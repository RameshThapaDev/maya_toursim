import { Box, Stack, Text } from "@chakra-ui/react";
import AdminShell from "../../components/admin/AdminShell";
import PaymentsTable from "../../components/admin/PaymentsTable";
import { getPool } from "../../lib/db";
import { getUserFromToken } from "../../lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Payments | Maya Bliss Tours",
  description: "Manage payment details and statuses."
};

async function getPayments() {
  if (!process.env.DATABASE_URL) {
    return { error: "Database connection is not configured.", rows: [] };
  }

  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT
        p.id,
        p.inquiry_id,
        p.method,
        p.reference,
        p.upi_id,
        p.binance_pay_id,
        p.status,
        p.amount,
        p.currency,
        p.created_at,
        bi.name,
        bi.email,
        bi.tour_name
      FROM payments p
      LEFT JOIN booking_inquiries bi ON bi.id = p.inquiry_id
      ORDER BY p.created_at DESC`
    );
    return { rows: result.rows, error: null };
  } catch (error) {
    console.error("Payments fetch error:", error);
    return { error: "Unable to load payments.", rows: [] };
  }
}

export default async function PaymentsPage() {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const { rows, error } = await getPayments();
  const tableRows = rows.map((row) => ({
    ...row,
    created_at: new Date(row.created_at).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    })
  }));

  return (
    <AdminShell title="Payments">
      <Stack spacing={2} mb={4}>
        <Text fontSize="lg" fontWeight="600">
          Payment activity
        </Text>
        <Text color="blackAlpha.700" fontSize="sm">
          Filter by method and status, then update payment states as needed.
        </Text>
      </Stack>
      {error && (
        <Box mb={6} p={4} bg="red.50" borderRadius="xl">
          <Text color="red.600">{error}</Text>
        </Box>
      )}
      <PaymentsTable rows={tableRows} />
    </AdminShell>
  );
}
