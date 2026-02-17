import { getPool } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";
import { tours } from "../../../data/tours";
async function resolveTargetName(pool, targetType, targetSlug) {
  const tableMap = {
    hotel: "hotels",
    guide: "guides",
    vehicle: "vehicles"
  };
  if (targetType === "tour") {
    const result = await pool.query("SELECT title FROM tours WHERE slug = $1 LIMIT 1", [targetSlug]);
    return result.rows[0]?.title || tours.find((item) => item.slug === targetSlug)?.title || null;
  }
  const table = tableMap[targetType];
  if (!table) return null;
  const result = await pool.query(`SELECT name FROM ${table} WHERE slug = $1 LIMIT 1`, [targetSlug]);
  return result.rows[0]?.name || null;
}

export async function GET(request) {
  const user = getUserFromToken();
  if (!user) {
    return Response.json({ canReview: false, reason: "login" }, { status: 200 });
  }

  const { searchParams } = new URL(request.url);
  const targetType = searchParams.get("targetType");
  const targetSlug = searchParams.get("targetSlug");

  const columnMap = {
    hotel: "hotel_name",
    guide: "guide_name",
    vehicle: "vehicle_name",
    tour: "tour_name"
  };

  const column = columnMap[targetType];
  if (!column) {
    return Response.json({ canReview: false, reason: "invalid" }, { status: 200 });
  }

  try {
    const pool = getPool();
    const targetName = await resolveTargetName(pool, targetType, targetSlug);
    if (!targetName) {
      return Response.json({ canReview: false, reason: "invalid" }, { status: 200 });
    }
    const result = await pool.query(
      `SELECT id FROM booking_inquiries WHERE user_id = $1 AND status = 'completed' AND ${column} = $2 LIMIT 1`,
      [user.id, targetName]
    );

    if (result.rowCount === 0) {
      return Response.json({ canReview: false, reason: "ineligible" }, { status: 200 });
    }

    return Response.json({ canReview: true }, { status: 200 });
  } catch (error) {
    console.error("Review eligibility error:", error);
    return Response.json({ canReview: false, reason: "error" }, { status: 200 });
  }
}
