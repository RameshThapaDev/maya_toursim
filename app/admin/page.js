import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Progress,
  Text,
  Stack,
  Flex
} from "@chakra-ui/react";
import AdminShell from "../components/admin/AdminShell";
import { getPool } from "../lib/db";
import { getUserFromToken } from "../lib/auth";
import { redirect } from "next/navigation";
import InquiryTable from "../components/admin/InquiryTable";

export const metadata = {
  title: "Admin | Maya Bliss Tours",
  description: "View booking inquiries."
};

async function getInquiries() {
  if (!process.env.DATABASE_URL) {
    return { error: "Database connection is not configured.", rows: [] };
  }

  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT
        bi.id,
        bi.tour_name,
        bi.hotel_name,
        bi.guide_name,
        bi.vehicle_name,
        bi.transport_mode,
        bi.document_type,
        bi.document_name,
        bi.document_data,
        bi.name,
        bi.email,
        bi.travelers,
        bi.travel_date,
        bi.notes,
        bi.status,
        bi.created_at,
        p.method AS payment_method,
        p.reference AS payment_reference,
        p.upi_id,
        p.binance_pay_id,
        p.status AS payment_status
      FROM booking_inquiries bi
      LEFT JOIN LATERAL (
        SELECT *
        FROM payments
        WHERE inquiry_id = bi.id
        ORDER BY created_at DESC
        LIMIT 1
      ) p ON true
      ORDER BY bi.created_at DESC`
    );
    return { rows: result.rows, error: null };
  } catch (error) {
    console.error("Admin inquiry fetch error:", error);
    return { error: "Unable to load inquiries.", rows: [] };
  }
}

export default async function AdminPage() {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }
  const { rows, error } = await getInquiries();
  const tableRows = rows.map((row) => ({
    ...row,
    created_at: new Date(row.created_at).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    })
  }));
  const pool = getPool();
  const countsResult = await pool.query(
    `SELECT
      (SELECT COUNT(*) FROM booking_inquiries) AS inquiries,
      (SELECT COUNT(*) FROM tours) AS tours,
      (SELECT COUNT(*) FROM hotels) AS hotels,
      (SELECT COUNT(*) FROM guides) AS guides,
      (SELECT COUNT(*) FROM vehicles) AS vehicles,
      (SELECT COUNT(*) FROM destinations) AS destinations,
      (SELECT COUNT(*) FROM reviews) AS reviews,
      (SELECT COUNT(*) FROM users) AS users,
      (SELECT COUNT(*) FROM email_logs) AS emails`
  );
  const counts = countsResult.rows[0];
  const statusCountsResult = await pool.query(
    `SELECT status, COUNT(*)::int AS total
     FROM booking_inquiries
     GROUP BY status`
  );
  const statusCounts = statusCountsResult.rows.reduce((acc, row) => {
    acc[row.status] = row.total;
    return acc;
  }, {});
  const totalBookings = Number(counts.inquiries || 0);

  const monthlyResult = await pool.query(
    `SELECT TO_CHAR(date_trunc('month', created_at), 'Mon YYYY') AS label,
            status,
            COUNT(*)::int AS total
     FROM booking_inquiries
     WHERE created_at >= NOW() - INTERVAL '12 months'
     GROUP BY 1, 2
     ORDER BY date_trunc('month', MIN(created_at)) DESC`
  );
  const dailyResult = await pool.query(
    `SELECT TO_CHAR(date_trunc('day', created_at), 'Mon DD') AS label,
            status,
            COUNT(*)::int AS total
     FROM booking_inquiries
     WHERE created_at >= NOW() - INTERVAL '30 days'
     GROUP BY 1, 2
     ORDER BY date_trunc('day', MIN(created_at)) DESC`
  );

  const groupByLabel = (rowsList) => {
    const map = new Map();
    rowsList.forEach((row) => {
      if (!map.has(row.label)) {
        map.set(row.label, { label: row.label, pending: 0, confirmed: 0, completed: 0, canceled: 0 });
      }
      const entry = map.get(row.label);
      entry[row.status] = row.total;
    });
    return Array.from(map.values());
  };

  const monthly = groupByLabel(monthlyResult.rows);
  const daily = groupByLabel(dailyResult.rows);

  return (
    <AdminShell title="Dashboard">
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
        {[
          { label: "Inquiries", value: counts.inquiries },
          { label: "Tours", value: counts.tours },
          { label: "Hotels", value: counts.hotels },
          { label: "Guides", value: counts.guides },
          { label: "Vehicles", value: counts.vehicles },
          { label: "Destinations", value: counts.destinations },
          { label: "Reviews", value: counts.reviews },
          { label: "Emails", value: counts.emails },
          { label: "Users", value: counts.users }
        ].map((item) => (
          <Stat
            key={item.label}
            bg="gray.50"
            borderRadius="xl"
            border="1px solid"
            borderColor="blackAlpha.100"
            p={4}
          >
            <Flex justify="space-between" align="center">
              <StatLabel color="blackAlpha.600">{item.label}</StatLabel>
              <Box w="8px" h="8px" borderRadius="full" bg="green.500" />
            </Flex>
            <StatNumber fontSize="2xl">{item.value}</StatNumber>
          </Stat>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={8}>
        <Box bg="gray.50" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontWeight="600" mb={3}>
            Booking status overview
          </Text>
          {["pending", "confirmed", "completed", "canceled"].map((status) => {
            const value = statusCounts[status] || 0;
            const percent = totalBookings ? Math.round((value / totalBookings) * 100) : 0;
            return (
              <Box key={status} mb={3}>
                <Text fontSize="sm" color="blackAlpha.700" mb={1}>
                  {status} · {value}
                </Text>
                <Progress value={percent} colorScheme={status === "completed" ? "green" : "orange"} />
              </Box>
            );
          })}
        </Box>
        <Box bg="gray.50" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={5}>
          <Text fontWeight="600" mb={3}>
            Monthly totals (last 12 months)
          </Text>
          <Stack spacing={3}>
            {monthly.map((item) => (
              <Box key={item.label}>
                <Text fontSize="sm" color="blackAlpha.700">
                  {item.label}
                </Text>
                <Text fontSize="sm" color="blackAlpha.600">
                  Pending {item.pending} · Confirmed {item.confirmed} · Completed {item.completed} · Canceled {item.canceled}
                </Text>
              </Box>
            ))}
          </Stack>
        </Box>
      </SimpleGrid>

      <Box bg="gray.50" borderRadius="xl" border="1px solid" borderColor="blackAlpha.100" p={5} mb={8}>
        <Text fontWeight="600" mb={3}>
          Daily totals (last 30 days)
        </Text>
        <Stack spacing={2}>
          {daily.map((item) => (
            <Text key={item.label} fontSize="sm" color="blackAlpha.700">
              {item.label}: Pending {item.pending}, Confirmed {item.confirmed}, Completed {item.completed}, Canceled {item.canceled}
            </Text>
          ))}
        </Stack>
      </Box>

      <Stack spacing={2} mb={4}>
        <Text fontSize="lg" fontWeight="600">
          Recent inquiries
        </Text>
        <Text color="blackAlpha.700" fontSize="sm">
          Review trip requests, assign completion status, and manage follow-ups.
        </Text>
      </Stack>
      {error && (
        <Box mb={6} p={4} bg="red.50" borderRadius="xl">
          <Text color="red.600">{error}</Text>
        </Box>
      )}
      <InquiryTable rows={tableRows} />

    </AdminShell>
  );
}
