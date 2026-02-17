import { getPool } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";

export async function GET() {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const pool = getPool();
  const result = await pool.query("SELECT * FROM destinations ORDER BY created_at DESC");
  return Response.json({ items: result.rows }, { status: 200 });
}

export async function POST(request) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { slug, name, best_time, description, highlights, image, weather_info, seasonal_info, travel_tips, transport_info, accommodations } = body;
  if (!slug || !name) {
    return Response.json({ message: "Missing required fields." }, { status: 400 });
  }
  const pool = getPool();
  const result = await pool.query(
    "INSERT INTO destinations (slug, name, best_time, description, highlights, image, weather_info, seasonal_info, travel_tips, transport_info, accommodations) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
    [
      slug,
      name,
      best_time || null,
      description || null,
      highlights || [],
      image || null,
      weather_info || null,
      seasonal_info || null,
      travel_tips || null,
      transport_info || null,
      accommodations || []
    ]
  );
  return Response.json({ item: result.rows[0] }, { status: 201 });
}
