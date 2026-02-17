import { getPool } from "../../../../lib/db";
import { getUserFromToken } from "../../../../lib/auth";

export async function PATCH(request, { params }) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { destination_slug, slug, name, summary, details, qr_data, image } = body;
  const pool = getPool();
  const result = await pool.query(
    `UPDATE tourist_sites
     SET destination_slug = $1, slug = $2, name = $3, summary = $4, details = $5, qr_data = $6, image = $7
     WHERE id = $8 RETURNING *`,
    [destination_slug, slug, name, summary || null, details || null, qr_data || null, image || null, params.id]
  );
  return Response.json({ item: result.rows[0] }, { status: 200 });
}

export async function DELETE(request, { params }) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const pool = getPool();
  await pool.query("DELETE FROM tourist_sites WHERE id = $1", [params.id]);
  return Response.json({ message: "Deleted" }, { status: 200 });
}
