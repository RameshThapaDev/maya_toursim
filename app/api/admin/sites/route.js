import { getPool } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";

export async function GET() {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const pool = getPool();
  const result = await pool.query("SELECT * FROM tourist_sites ORDER BY created_at DESC");
  return Response.json({ items: result.rows }, { status: 200 });
}

export async function POST(request) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { destination_slug, slug, name, summary, details, qr_data, image } = body;
  if (!destination_slug || !slug || !name) {
    return Response.json({ message: "Missing required fields." }, { status: 400 });
  }
  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO tourist_sites
     (destination_slug, slug, name, summary, details, qr_data, image)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [destination_slug, slug, name, summary || null, details || null, qr_data || null, image || null]
  );
  return Response.json({ item: result.rows[0] }, { status: 201 });
}
