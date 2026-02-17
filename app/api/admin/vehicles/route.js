import { getPool } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";

export async function GET() {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const pool = getPool();
  const result = await pool.query("SELECT * FROM vehicles ORDER BY created_at DESC");
  return Response.json({ items: result.rows }, { status: 200 });
}

export async function POST(request) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { slug, name, capacity, summary, price_per_day } = body;
  if (!slug || !name || !capacity) {
    return Response.json({ message: "Missing required fields." }, { status: 400 });
  }
  const pool = getPool();
  const result = await pool.query(
    "INSERT INTO vehicles (slug, name, capacity, summary, price_per_day) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [slug, name, Number(capacity), summary || null, price_per_day || null]
  );
  return Response.json({ item: result.rows[0] }, { status: 201 });
}
