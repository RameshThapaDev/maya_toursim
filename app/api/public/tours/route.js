import { getPool } from "../../../lib/db";

export async function GET() {
  const pool = getPool();
  const result = await pool.query("SELECT * FROM tours ORDER BY created_at DESC");
  return Response.json({ items: result.rows }, { status: 200 });
}
