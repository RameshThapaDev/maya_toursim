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
import InquiryStatusForm from "./InquiryStatusForm";
import { downloadCSV, downloadExcel } from "./tableExport";

const PAGE_SIZE = 8;

export default function InquiryTable({ rows }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesStatus = status === "all" ? true : row.status === status;
      const matchesQuery =
        !q ||
        [row.tour_name, row.name, row.email, row.hotel_name, row.guide_name, row.vehicle_name]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [rows, query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const exportHeaders = [
    { label: "ID", key: "id" },
    { label: "Tour", key: "tour_name" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Travelers", key: "travelers" },
    { label: "Date", key: "travel_date" },
    { label: "Hotel", key: "hotel_name" },
    { label: "Guide", key: "guide_name" },
    { label: "Vehicle", key: "vehicle_name" },
    { label: "Own transport", key: "transport_mode" },
    { label: "Document type", key: "document_type" },
    { label: "Document file", key: "document_name" },
    { label: "Payment method", key: "payment_method" },
    { label: "Payment reference", key: "payment_reference" },
    { label: "Payment account", key: "payment_account" },
    { label: "Status", key: "status" },
    { label: "Created", key: "created_at" }
  ];
  const exportRows = filtered.map((row) => ({
    ...row,
    tour_name: row.tour_name || "General",
    hotel_name: row.hotel_name || "-",
    guide_name: row.guide_name || "-",
    vehicle_name: row.vehicle_name || "-",
    transport_mode: row.transport_mode || "-",
    document_type: row.document_type || "-",
    document_name: row.document_name || "-",
    payment_method: row.payment_method || "-",
    payment_reference: row.payment_reference || "-",
    payment_account: row.upi_id || row.binance_pay_id || "-"
  }));

  return (
    <Stack spacing={4}>
      <Flex direction={{ base: "column", md: "row" }} gap={3} justify="space-between">
        <Input
          placeholder="Search by name, email, tour, hotel, guide, vehicle"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <HStack spacing={2} align="center" flexWrap="wrap" justify={{ base: "flex-start", md: "flex-end" }}>
          <Text fontSize="sm" color="blackAlpha.700">
            Status
          </Text>
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            maxW="180px"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </Select>
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadCSV("inquiries", exportHeaders, exportRows)}
            isDisabled={exportRows.length === 0}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadExcel("inquiries", exportHeaders, exportRows)}
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
              <Th colSpan={6}>Guest</Th>
              <Th colSpan={3}>Preferences</Th>
              <Th colSpan={2}>Documents</Th>
              <Th colSpan={3}>Payment</Th>
              <Th colSpan={2}>Status</Th>
            </Tr>
            <Tr>
              <Th>ID</Th>
              <Th>Tour</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th isNumeric>Travelers</Th>
              <Th>Date</Th>
              <Th>Hotel</Th>
              <Th>Guide</Th>
              <Th>Vehicle</Th>
              <Th>Own transport</Th>
              <Th>Type</Th>
              <Th>File</Th>
              <Th>Method</Th>
              <Th>Reference</Th>
              <Th>Account</Th>
              <Th>Status</Th>
              <Th>Created</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginated.map((row) => (
              <Tr key={row.id} _hover={{ bg: "blackAlpha.50" }}>
                <Td>{row.id}</Td>
                <Td>{row.tour_name || "General"}</Td>
                <Td>{row.name}</Td>
                <Td>{row.email}</Td>
                <Td isNumeric>{row.travelers}</Td>
                <Td>{row.travel_date}</Td>
                <Td>{row.hotel_name || "-"}</Td>
                <Td>{row.guide_name || "-"}</Td>
                <Td>{row.vehicle_name || "-"}</Td>
                <Td>{row.transport_mode || "-"}</Td>
                <Td>{row.document_type || "-"}</Td>
                <Td>
                  <Stack spacing={1}>
                    <Text fontSize="sm">{row.document_name || "-"}</Text>
                    {row.document_data ? (
                      <Button
                        size="xs"
                        variant="outline"
                        as="a"
                        href={row.document_data}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View
                      </Button>
                    ) : (
                      <Text fontSize="xs" color="blackAlpha.600">
                        Not uploaded
                      </Text>
                    )}
                  </Stack>
                </Td>
                <Td>{row.payment_method || "-"}</Td>
                <Td>{row.payment_reference || "-"}</Td>
                <Td>{row.upi_id || row.binance_pay_id || "-"}</Td>
                <Td>
                  <Stack spacing={2}>
                    <Badge colorScheme={row.status === "completed" ? "green" : "orange"}>
                      {row.status}
                    </Badge>
                    <InquiryStatusForm id={row.id} status={row.status} />
                  </Stack>
                </Td>
                <Td>{row.created_at}</Td>
              </Tr>
            ))}
            {paginated.length === 0 && (
              <Tr>
                <Td colSpan={17}>
                  <Text py={4} textAlign="center" color="blackAlpha.700">
                    No inquiries match your filters.
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
