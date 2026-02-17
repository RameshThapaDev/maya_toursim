import { getPool } from "../../../../lib/db";
import { getUserFromToken } from "../../../../lib/auth";

export async function PATCH(request, { params }) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { name, type, amount, unit, active } = body;
  const pool = getPool();
  const result = await pool.query(
    "UPDATE charges SET name = $1, type = $2, amount = $3, unit = $4, active = $5 WHERE id = $6 RETURNING *",
    [name, type, Number(amount), unit, active !== false, params.id]
  );
  return Response.json({ item: result.rows[0] }, { status: 200 });
}

export async function DELETE(request, { params }) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const pool = getPool();
  await pool.query("DELETE FROM charges WHERE id = $1", [params.id]);
  return Response.json({ message: "Deleted" }, { status: 200 });
}
