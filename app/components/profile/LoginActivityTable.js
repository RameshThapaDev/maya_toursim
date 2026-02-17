"use client";

import { Badge, Box, Text } from "@chakra-ui/react";
import AdminCrudTable from "../admin/AdminCrudTable";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function LoginActivityTable({ rows }) {
  const columns = [
    {
      header: "Date",
      accessor: "createdAt",
      render: (row) => (
        <Text fontSize="sm" color="blackAlpha.800">
          {formatDate(row.createdAt)}
        </Text>
      )
    },
    {
      header: "Location",
      accessor: "location",
      render: (row) => (
        <Badge colorScheme="green" variant="subtle">
          {row.location || "Unknown"}
        </Badge>
      )
    },
    {
      header: "IP Address",
      accessor: "ip",
      render: (row) => <Text fontSize="sm">{row.ip || "Unknown"}</Text>
    },
    {
      header: "Device",
      accessor: "device",
      render: (row) => (
        <Box maxW="280px">
          <Text fontSize="xs" color="blackAlpha.700" noOfLines={2}>
            {row.device || "Unknown device"}
          </Text>
        </Box>
      )
    }
  ];

  return (
    <AdminCrudTable
      rows={rows}
      columns={columns}
      searchKeys={["location", "ip", "device"]}
      emptyText="No activity yet."
    />
  );
}
