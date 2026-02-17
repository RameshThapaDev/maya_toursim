import {
  Badge,
  Box,
  Flex,
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
import AdminShell from "../../components/admin/AdminShell";
import { getPool } from "../../lib/db";
import { getUserFromToken } from "../../lib/auth";
import { redirect } from "next/navigation";
import ResendEmailButton from "../../components/admin/ResendEmailButton";
import EmailExportControls from "../../components/admin/EmailExportControls";

export const metadata = {
  title: "Admin Emails | Maya Bliss Tours",
  description: "System email delivery log."
};

export default async function AdminEmailsPage() {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const pool = getPool();
  const result = await pool.query(
    "SELECT id, recipient, subject, status, created_at FROM email_logs ORDER BY created_at DESC"
  );

  return (
    <AdminShell title="Email log">
      <Box bg="white" borderRadius="2xl" border="1px solid" borderColor="blackAlpha.100" p={5}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={3} mb={4}>
          <Stack spacing={1}>
            <Text fontSize="lg" fontWeight="600">
              All system emails
            </Text>
            <Text color="blackAlpha.700" fontSize="sm">
              Complete delivery history with resend for failed messages.
            </Text>
          </Stack>
          <EmailExportControls rows={result.rows} />
        </Flex>
        <TableContainer>
          <Table size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>Recipient</Th>
                <Th>Subject</Th>
                <Th>Status</Th>
                <Th>Action</Th>
                <Th>Sent</Th>
              </Tr>
            </Thead>
            <Tbody>
              {result.rows.map((row) => (
                <Tr key={row.id}>
                  <Td>{row.recipient}</Td>
                  <Td maxW="420px">
                    <Text noOfLines={1}>{row.subject}</Text>
                  </Td>
                  <Td>
                    <Badge colorScheme={row.status === "sent" ? "green" : "red"}>
                      {row.status}
                    </Badge>
                  </Td>
                  <Td>
                    {row.status === "failed" ? <ResendEmailButton id={row.id} /> : "-"}
                  </Td>
                  <Td>
                    {new Date(row.created_at).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })}
                  </Td>
                </Tr>
              ))}
              {result.rows.length === 0 && (
                <Tr>
                  <Td colSpan={5}>
                    <Text py={3} textAlign="center" color="blackAlpha.600">
                      No emails logged yet.
                    </Text>
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </AdminShell>
  );
}
