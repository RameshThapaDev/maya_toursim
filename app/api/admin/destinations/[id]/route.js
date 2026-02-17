import { getPool } from "../../../../lib/db";
import { getUserFromToken } from "../../../../lib/auth";

export async function PATCH(request, { params }) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { slug, name, best_time, description, highlights, image, weather_info, seasonal_info, travel_tips, transport_info, accommodations } = body;
  const pool = getPool();
  const result = await pool.query(
    "UPDATE destinations SET slug = $1, name = $2, best_time = $3, description = $4, highlights = $5, image = $6, weather_info = $7, seasonal_info = $8, travel_tips = $9, transport_info = $10, accommodations = $11 WHERE id = $12 RETURNING *",
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
      accommodations || [],
      params.id
    ]
  );
  return Response.json({ item: result.rows[0] }, { status: 200 });
}

export async function DELETE(request, { params }) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const pool = getPool();
  await pool.query("DELETE FROM destinations WHERE id = $1", [params.id]);
  return Response.json({ message: "Deleted" }, { status: 200 });
}
