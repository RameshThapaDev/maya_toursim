import { getPool } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";

export async function GET() {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const pool = getPool();
  const result = await pool.query("SELECT * FROM charges ORDER BY created_at DESC");
  return Response.json({ items: result.rows }, { status: 200 });
}

export async function POST(request) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { name, type, amount, unit, active } = body;
  if (!name || !type || !amount || !unit) {
    return Response.json({ message: "Missing required fields." }, { status: 400 });
  }
  const pool = getPool();
  const result = await pool.query(
    "INSERT INTO charges (name, type, amount, unit, active) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, type, Number(amount), unit, active !== false]
  );
  return Response.json({ item: result.rows[0] }, { status: 201 });
}
