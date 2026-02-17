import { getPool } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";

function parseDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

export async function GET(request) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fromParam = parseDate(searchParams.get("from"));
  const toParam = parseDate(searchParams.get("to"));

  const toDate = toParam || new Date();
  const fromDate = fromParam || new Date(new Date().setMonth(new Date().getMonth() - 6));

  const dailyFrom = new Date(Math.max(fromDate.getTime(), new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).getTime()));

  try {
    const pool = getPool();

    const totalsResult = await pool.query(
      `SELECT
        (SELECT COUNT(*) FROM booking_inquiries WHERE created_at BETWEEN $1 AND $2) AS inquiries,
        (SELECT COUNT(*) FROM reviews WHERE created_at BETWEEN $1 AND $2) AS reviews,
        (SELECT COUNT(*) FROM email_logs WHERE created_at BETWEEN $1 AND $2) AS emails,
        (SELECT COUNT(*) FROM users WHERE created_at BETWEEN $1 AND $2) AS users`,
      [fromDate, toDate]
    );

    const statusCountsResult = await pool.query(
      `SELECT status, COUNT(*)::int AS total
       FROM booking_inquiries
       WHERE created_at BETWEEN $1 AND $2
       GROUP BY status`,
      [fromDate, toDate]
    );

    const dailyBookings = await pool.query(
      `SELECT TO_CHAR(date_trunc('day', created_at), 'DD Mon') AS label,
              COUNT(*)::int AS total
       FROM booking_inquiries
       WHERE created_at BETWEEN $1 AND $2
       GROUP BY 1
       ORDER BY date_trunc('day', MIN(created_at))`,
      [dailyFrom, toDate]
    );

    const monthlyBookings = await pool.query(
      `SELECT TO_CHAR(date_trunc('month', created_at), 'Mon') AS label,
              COUNT(*)::int AS total
       FROM booking_inquiries
       WHERE created_at BETWEEN $1 AND $2
       GROUP BY 1
       ORDER BY date_trunc('month', MIN(created_at))`,
      [fromDate, toDate]
    );

    const topTours = await pool.query(
      `SELECT tour_name AS label, COUNT(*)::int AS total
       FROM booking_inquiries
       WHERE tour_name IS NOT NULL AND created_at BETWEEN $1 AND $2
       GROUP BY tour_name
       ORDER BY total DESC
       LIMIT 5`,
      [fromDate, toDate]
    );

    const topHotels = await pool.query(
      `SELECT hotel_name AS label, COUNT(*)::int AS total
       FROM booking_inquiries
       WHERE hotel_name IS NOT NULL AND created_at BETWEEN $1 AND $2
       GROUP BY hotel_name
       ORDER BY total DESC
       LIMIT 5`,
      [fromDate, toDate]
    );

    const topGuides = await pool.query(
      `SELECT guide_name AS label, COUNT(*)::int AS total
       FROM booking_inquiries
       WHERE guide_name IS NOT NULL AND created_at BETWEEN $1 AND $2
       GROUP BY guide_name
       ORDER BY total DESC
       LIMIT 5`,
      [fromDate, toDate]
    );

    const topVehicles = await pool.query(
      `SELECT vehicle_name AS label, COUNT(*)::int AS total
       FROM booking_inquiries
       WHERE vehicle_name IS NOT NULL AND created_at BETWEEN $1 AND $2
       GROUP BY vehicle_name
       ORDER BY total DESC
       LIMIT 5`,
      [fromDate, toDate]
    );

    const usersMonthly = await pool.query(
      `SELECT TO_CHAR(date_trunc('month', created_at), 'Mon') AS label,
              COUNT(*)::int AS total
       FROM users
       WHERE created_at BETWEEN $1 AND $2
       GROUP BY 1
       ORDER BY date_trunc('month', MIN(created_at))`,
      [fromDate, toDate]
    );

    const reviewsMonthly = await pool.query(
      `SELECT TO_CHAR(date_trunc('month', created_at), 'Mon') AS label,
              COUNT(*)::int AS total
       FROM reviews
       WHERE created_at BETWEEN $1 AND $2
       GROUP BY 1
       ORDER BY date_trunc('month', MIN(created_at))`,
      [fromDate, toDate]
    );

    const reviewAverages = await pool.query(
      `SELECT target_type, ROUND(AVG(rating)::numeric, 2) AS avg
       FROM reviews
       WHERE created_at BETWEEN $1 AND $2
       GROUP BY target_type
       ORDER BY avg DESC`,
      [fromDate, toDate]
    );

    return Response.json(
      {
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
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Analytics API error:", error);
    return Response.json({ message: "Error" }, { status: 500 });
  }
}
