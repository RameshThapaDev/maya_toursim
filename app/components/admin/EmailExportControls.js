"use client";

import { HStack, Button } from "@chakra-ui/react";
import { downloadCSV, downloadExcel } from "./tableExport";

export default function EmailExportControls({ rows }) {
  const headers = [
    { label: "Recipient", key: "recipient" },
    { label: "Subject", key: "subject" },
    { label: "Status", key: "status" },
    { label: "Sent", key: "created_at" }
  ];

  return (
    <HStack spacing={2}>
      <Button
        size="sm"
        variant="outline"
        onClick={() => downloadCSV("email-log", headers, rows)}
        isDisabled={rows.length === 0}
      >
        Export CSV
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => downloadExcel("email-log", headers, rows)}
        isDisabled={rows.length === 0}
      >
        Export Excel
      </Button>
    </HStack>
  );
}
