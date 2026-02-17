"use client";

import {
  Badge,
  Box,
  Flex,
  HStack,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Stack,
  Button
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import PaymentStatusForm from "./PaymentStatusForm";
import { downloadCSV, downloadExcel } from "./tableExport";

const PAGE_SIZE = 8;

const statusColor = (status) => {
  switch (status) {
    case "paid":
      return "green";
    case "pending":
      return "orange";
    case "failed":
      return "red";
    case "refunded":
      return "purple";
    default:
      return "gray";
  }
};

export default function PaymentsTable({ rows }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesStatus = status === "all" ? true : row.status === status;
      const matchesMethod = method === "all" ? true : row.method === method;
      const matchesQuery =
        !q ||
        [
          row.name,
          row.email,
          row.tour_name,
          row.reference,
          row.method,
          row.upi_id,
          row.binance_pay_id
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(q));
      return matchesStatus && matchesMethod && matchesQuery;
    });
  }, [rows, query, status, method]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const exportHeaders = [
    { label: "ID", key: "id" },
    { label: "Inquiry", key: "inquiry_id" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Tour", key: "tour_name" },
    { label: "Method", key: "method" },
    { label: "Reference", key: "reference" },
    { label: "Account", key: "account" },
    { label: "Amount", key: "amount_display" },
    { label: "Created", key: "created_at" },
    { label: "Status", key: "status" },
    { label: "Updated", key: "updated_at" }
  ];
  const exportRows = filtered.map((row) => ({
    ...row,
    account: row.upi_id || row.binance_pay_id || "-",
    amount_display: row.amount
      ? `${row.currency || "USD"} ${Number(row.amount).toFixed(2)}`
      : "-"
  }));

  return (
    <Stack spacing={4}>
      <Flex direction={{ base: "column", md: "row" }} gap={3} justify="space-between">
        <Input
          placeholder="Search by name, email, tour, method, reference"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <HStack spacing={2} align="center" flexWrap="wrap" justify={{ base: "flex-start", md: "flex-end" }}>
          <Text fontSize="sm" color="blackAlpha.700">
            Method
          </Text>
          <Select
            value={method}
            onChange={(e) => {
              setMethod(e.target.value);
              setPage(1);
            }}
            maxW="160px"
          >
            <option value="all">All</option>
            <option value="stripe">Stripe</option>
            <option value="binance">Binance</option>
            <option value="upi">UPI</option>
          </Select>
          <Text fontSize="sm" color="blackAlpha.700">
            Status
          </Text>
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            maxW="160px"
          >
            <option value="all">All</option>
            <option value="demo">Demo</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </Select>
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadCSV("payments", exportHeaders, exportRows)}
            isDisabled={exportRows.length === 0}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadExcel("payments", exportHeaders, exportRows)}
            isDisabled={exportRows.length === 0}
          >
            Export Excel
          </Button>
        </HStack>
      </Flex>

      <TableContainer
        bg="white"
        borderRadius="lg"
        boxShadow="sm"
        border="1px solid"
        borderColor="blackAlpha.100"
        maxH="520px"
        overflowY="auto"
      >
        <Table size="sm" variant="simple">
          <Thead
            position="sticky"
            top={0}
            bg="gray.50"
            zIndex={1}
            sx={{ th: { fontSize: "sm", py: 3 } }}
          >
            <Tr>
              <Th colSpan={5}>Guest</Th>
              <Th colSpan={5}>Payment</Th>
              <Th colSpan={2}>Status</Th>
            </Tr>
            <Tr>
              <Th>ID</Th>
              <Th>Inquiry</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Tour</Th>
              <Th>Method</Th>
              <Th>Reference</Th>
              <Th>Account</Th>
              <Th>Amount</Th>
              <Th>Created</Th>
              <Th>Status</Th>
              <Th>Updated</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginated.map((row) => (
              <Tr key={row.id} _hover={{ bg: "blackAlpha.50" }}>
                <Td>{row.id}</Td>
                <Td>#{row.inquiry_id}</Td>
                <Td>{row.name || "-"}</Td>
                <Td>{row.email || "-"}</Td>
                <Td>{row.tour_name || "-"}</Td>
                <Td>{row.method}</Td>
                <Td>{row.reference || "-"}</Td>
                <Td>{row.upi_id || row.binance_pay_id || "-"}</Td>
                <Td>{row.amount ? `${row.currency || "USD"} ${Number(row.amount).toFixed(2)}` : "-"}</Td>
                <Td>{row.created_at}</Td>
                <Td>
                  <Badge colorScheme={statusColor(row.status)}>{row.status}</Badge>
                </Td>
                <Td>
                  <PaymentStatusForm id={row.id} status={row.status} />
                </Td>
              </Tr>
            ))}
            {paginated.length === 0 && (
              <Tr>
                <Td colSpan={12}>
                  <Text py={4} textAlign="center" color="blackAlpha.700">
                    No payments match your filters.
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      <Flex justify="space-between" align="center">
        <Text fontSize="sm" color="blackAlpha.600">
          Showing {paginated.length} of {filtered.length}
        </Text>
        <HStack spacing={2}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            isDisabled={currentPage === 1}
          >
            Prev
          </Button>
          <Text fontSize="sm">
            Page {currentPage} / {totalPages}
          </Text>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            isDisabled={currentPage === totalPages}
          >
            Next
          </Button>
        </HStack>
      </Flex>
    </Stack>
  );
}
