import { getPool } from "../../lib/db";
import { getUserFromToken } from "../../lib/auth";
import { tours } from "../../data/tours";
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

async function hasCompletedBooking(pool, userId, targetType, targetSlug) {
  const targetName = await resolveTargetName(pool, targetType, targetSlug);
  if (!targetName) return false;

  let column = null;
  if (targetType === "hotel") column = "hotel_name";
  if (targetType === "guide") column = "guide_name";
  if (targetType === "vehicle") column = "vehicle_name";
  if (targetType === "tour") column = "tour_name";
  if (!column) return false;

  const result = await pool.query(
    `SELECT id FROM booking_inquiries WHERE user_id = $1 AND status = 'completed' AND ${column} = $2 LIMIT 1`,
    [userId, targetName]
  );
  return result.rowCount > 0;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetType = searchParams.get("targetType");
  const targetSlug = searchParams.get("targetSlug");

  if (!targetType || !targetSlug) {
    return Response.json({ reviews: [] }, { status: 200 });
  }

  try {
    const pool = getPool();
    const result = await pool.query(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.name
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.target_type = $1 AND r.target_slug = $2
       ORDER BY r.created_at DESC`,
      [targetType, targetSlug]
    );
    return Response.json({ reviews: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Review fetch error:", error);
    return Response.json({ reviews: [] }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = getUserFromToken();
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { targetType, targetSlug, rating, comment } = body;

    if (!targetType || !targetSlug || !rating) {
      return Response.json({ message: "Missing required fields." }, { status: 400 });
    }

    const parsedRating = Number(rating);
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return Response.json({ message: "Invalid rating." }, { status: 400 });
    }

    const pool = getPool();
    const eligible = await hasCompletedBooking(pool, user.id, targetType, targetSlug);
    if (!eligible) {
      return Response.json(
        { message: "Only completed bookings can leave reviews." },
        { status: 403 }
      );
    }
    await pool.query(
      "INSERT INTO reviews (user_id, target_type, target_slug, rating, comment) VALUES ($1, $2, $3, $4, $5)",
      [user.id, targetType, targetSlug, parsedRating, comment || null]
    );

    return Response.json({ message: "Review saved." }, { status: 200 });
  } catch (error) {
    console.error("Review create error:", error);
    return Response.json({ message: "Review failed." }, { status: 500 });
  }
}
