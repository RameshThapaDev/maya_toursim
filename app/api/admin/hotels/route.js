import { getPool } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";

export async function GET() {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const pool = getPool();
  const result = await pool.query("SELECT * FROM hotels ORDER BY created_at DESC");
  return Response.json({ items: result.rows }, { status: 200 });
}

export async function POST(request) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { slug, name, location, style, summary, image, price_per_night } = body;
  if (!slug || !name || !location) {
    return Response.json({ message: "Missing required fields." }, { status: 400 });
  }
  const pool = getPool();
  const result = await pool.query(
    "INSERT INTO hotels (slug, name, location, style, summary, image, price_per_night) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    [slug, name, location, style || null, summary || null, image || null, price_per_night || null]
  );
  return Response.json({ item: result.rows[0] }, { status: 201 });
}
