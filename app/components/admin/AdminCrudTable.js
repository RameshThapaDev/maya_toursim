"use client";

import {
  Box,
  Button,
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
  Stack
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { downloadCSV, downloadExcel } from "./tableExport";

const PAGE_SIZE = 8;

export default function AdminCrudTable({
  rows,
  columns,
  searchKeys,
  filterKey,
  filterLabel,
  onEdit,
  onDelete,
  emptyText,
  exportName = "table-data"
}) {
  const [query, setQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [page, setPage] = useState(1);

  const filterOptions = useMemo(() => {
    if (!filterKey) return [];
    return Array.from(new Set(rows.map((row) => row[filterKey]).filter(Boolean)));
  }, [rows, filterKey]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesFilter = filterKey
        ? filterValue === "all" || String(row[filterKey]) === String(filterValue)
        : true;
      const matchesQuery =
        !q ||
        (searchKeys || []).some((key) =>
          String(row[key] || "")
            .toLowerCase()
            .includes(q)
        );
      return matchesFilter && matchesQuery;
    });
  }, [rows, query, filterKey, filterValue, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const exportHeaders = useMemo(
    () =>
      columns.map((col) => ({
        label: col.header,
        key: col.accessor || col.header
      })),
    [columns]
  );
  const exportRows = useMemo(
    () =>
      filtered.map((row) => {
        const result = {};
        exportHeaders.forEach((header) => {
          result[header.key] = row[header.key];
        });
        return result;
      }),
    [filtered, exportHeaders]
  );

  return (
    <Stack spacing={4}>
      <Flex direction={{ base: "column", md: "row" }} gap={3} justify="space-between">
        <Input
          placeholder="Search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <HStack spacing={3} align="center" flexWrap="wrap" justify={{ base: "flex-start", md: "flex-end" }}>
          {filterKey && (
            <HStack spacing={2} align="center">
              <Text fontSize="sm" color="blackAlpha.700">
                {filterLabel || "Filter"}
              </Text>
              <Select
                value={filterValue}
                onChange={(e) => {
                  setFilterValue(e.target.value);
                  setPage(1);
                }}
                maxW="200px"
              >
                <option value="all">All</option>
                {filterOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </HStack>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadCSV(exportName, exportHeaders, exportRows)}
            isDisabled={exportRows.length === 0}
          >
            Export CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => downloadExcel(exportName, exportHeaders, exportRows)}
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
              {columns.map((col) => (
                <Th key={col.header}>{col.header}</Th>
              ))}
              {(onEdit || onDelete) && <Th>Actions</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {paginated.map((row) => (
              <Tr key={row.id} _hover={{ bg: "blackAlpha.50" }}>
                {columns.map((col) => (
                  <Td key={col.header} maxW={col.maxW}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </Td>
                ))}
                {(onEdit || onDelete) && (
                  <Td>
                    <HStack spacing={2}>
                      {onEdit && (
                        <Button size="xs" onClick={() => onEdit(row)}>
                          Edit
                        </Button>
                      )}
                      {onDelete && (
                        <Button size="xs" colorScheme="red" onClick={() => onDelete(row.id)}>
                          Delete
                        </Button>
                      )}
                    </HStack>
                  </Td>
                )}
              </Tr>
            ))}
            {paginated.length === 0 && (
              <Tr>
                <Td colSpan={columns.length + 1}>
                  <Text py={4} textAlign="center" color="blackAlpha.700">
                    {emptyText || "No entries found."}
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
