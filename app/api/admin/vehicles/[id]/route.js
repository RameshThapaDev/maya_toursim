import { getPool } from "../../../../lib/db";
import { getUserFromToken } from "../../../../lib/auth";

export async function PATCH(request, { params }) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { slug, name, capacity, summary, price_per_day } = body;
  const pool = getPool();
  const result = await pool.query(
    "UPDATE vehicles SET slug = $1, name = $2, capacity = $3, summary = $4, price_per_day = $5 WHERE id = $6 RETURNING *",
    [slug, name, Number(capacity), summary || null, price_per_day || null, params.id]
  );
  return Response.json({ item: result.rows[0] }, { status: 200 });
}

export async function DELETE(request, { params }) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const pool = getPool();
  await pool.query("DELETE FROM vehicles WHERE id = $1", [params.id]);
  return Response.json({ message: "Deleted" }, { status: 200 });
}
