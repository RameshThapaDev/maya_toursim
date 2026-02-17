import AdminShell from "../../components/admin/AdminShell";
import AnalyticsClient from "./AnalyticsClient";
import { getUserFromToken } from "../../lib/auth";
import { getPool } from "../../lib/db";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Analytics | Maya Bliss Tours",
  description: "Tracking and analytics overview."
};

function formatDate(value) {
  return value.toISOString().split("T")[0];
}

export default async function AnalyticsPage() {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    redirect("/login");
  }

  const now = new Date();
  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 6);
  const dailyFrom = new Date(Math.max(fromDate.getTime(), new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).getTime()));

  const pool = getPool();

  const totalsResult = await pool.query(
    `SELECT
      (SELECT COUNT(*) FROM booking_inquiries WHERE created_at BETWEEN $1 AND $2) AS inquiries,
      (SELECT COUNT(*) FROM reviews WHERE created_at BETWEEN $1 AND $2) AS reviews,
      (SELECT COUNT(*) FROM email_logs WHERE created_at BETWEEN $1 AND $2) AS emails,
      (SELECT COUNT(*) FROM users WHERE created_at BETWEEN $1 AND $2) AS users`,
    [fromDate, now]
  );

  const statusCountsResult = await pool.query(
    `SELECT status, COUNT(*)::int AS total
     FROM booking_inquiries
     WHERE created_at BETWEEN $1 AND $2
     GROUP BY status`,
    [fromDate, now]
  );

  const dailyBookings = await pool.query(
    `SELECT TO_CHAR(date_trunc('day', created_at), 'DD Mon') AS label,
            COUNT(*)::int AS total
     FROM booking_inquiries
     WHERE created_at BETWEEN $1 AND $2
     GROUP BY 1
     ORDER BY date_trunc('day', MIN(created_at))`,
    [dailyFrom, now]
  );

  const monthlyBookings = await pool.query(
    `SELECT TO_CHAR(date_trunc('month', created_at), 'Mon') AS label,
            COUNT(*)::int AS total
     FROM booking_inquiries
     WHERE created_at BETWEEN $1 AND $2
     GROUP BY 1
     ORDER BY date_trunc('month', MIN(created_at))`,
    [fromDate, now]
  );

  const topTours = await pool.query(
    `SELECT tour_name AS label, COUNT(*)::int AS total
     FROM booking_inquiries
     WHERE tour_name IS NOT NULL AND created_at BETWEEN $1 AND $2
     GROUP BY tour_name
     ORDER BY total DESC
     LIMIT 5`,
    [fromDate, now]
  );

  const topHotels = await pool.query(
    `SELECT hotel_name AS label, COUNT(*)::int AS total
     FROM booking_inquiries
     WHERE hotel_name IS NOT NULL AND created_at BETWEEN $1 AND $2
     GROUP BY hotel_name
     ORDER BY total DESC
     LIMIT 5`,
    [fromDate, now]
  );

  const topGuides = await pool.query(
    `SELECT guide_name AS label, COUNT(*)::int AS total
     FROM booking_inquiries
     WHERE guide_name IS NOT NULL AND created_at BETWEEN $1 AND $2
     GROUP BY guide_name
     ORDER BY total DESC
     LIMIT 5`,
    [fromDate, now]
  );

  const topVehicles = await pool.query(
    `SELECT vehicle_name AS label, COUNT(*)::int AS total
     FROM booking_inquiries
     WHERE vehicle_name IS NOT NULL AND created_at BETWEEN $1 AND $2
     GROUP BY vehicle_name
     ORDER BY total DESC
     LIMIT 5`,
    [fromDate, now]
  );

  const usersMonthly = await pool.query(
    `SELECT TO_CHAR(date_trunc('month', created_at), 'Mon') AS label,
            COUNT(*)::int AS total
     FROM users
     WHERE created_at BETWEEN $1 AND $2
     GROUP BY 1
     ORDER BY date_trunc('month', MIN(created_at))`,
    [fromDate, now]
  );

  const reviewsMonthly = await pool.query(
    `SELECT TO_CHAR(date_trunc('month', created_at), 'Mon') AS label,
            COUNT(*)::int AS total
     FROM reviews
     WHERE created_at BETWEEN $1 AND $2
     GROUP BY 1
     ORDER BY date_trunc('month', MIN(created_at))`,
    [fromDate, now]
  );

  const reviewAverages = await pool.query(
    `SELECT target_type, ROUND(AVG(rating)::numeric, 2) AS avg
     FROM reviews
     WHERE created_at BETWEEN $1 AND $2
     GROUP BY target_type
     ORDER BY avg DESC`,
    [fromDate, now]
  );

  const initialData = {
    totals: totalsResult.rows[0],
    statusCounts: statusCountsResult.rows,
    dailyBookings: dailyBookings.rows,
    monthlyBookings: monthlyBookings.rows,
    topTours: topTours.rows,
    topHotels: topHotels.rows,
    topGuides: topGuides.rows,
    topVehicles: topVehicles.rows,
    usersMonthly: usersMonthly.rows,
    reviewsMonthly: reviewsMonthly.rows,
    reviewAverages: reviewAverages.rows
  };

  return (
    <AdminShell title="Analytics & tracking">
      <AnalyticsClient
        initialData={initialData}
        defaultFrom={formatDate(fromDate)}
        defaultTo={formatDate(now)}
      />
    </AdminShell>
  );
}
