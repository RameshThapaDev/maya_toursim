import { getPool } from "../../../../lib/db";
import { getUserFromToken } from "../../../../lib/auth";

export async function PATCH(request, { params }) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { slug, name, location, style, summary, image, price_per_night } = body;
  const pool = getPool();
  const result = await pool.query(
    "UPDATE hotels SET slug = $1, name = $2, location = $3, style = $4, summary = $5, image = $6, price_per_night = $7 WHERE id = $8 RETURNING *",
    [slug, name, location, style || null, summary || null, image || null, price_per_night || null, params.id]
  );
  return Response.json({ item: result.rows[0] }, { status: 200 });
}

export async function DELETE(request, { params }) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const pool = getPool();
  await pool.query("DELETE FROM hotels WHERE id = $1", [params.id]);
  return Response.json({ message: "Deleted" }, { status: 200 });
}
