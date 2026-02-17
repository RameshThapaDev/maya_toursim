import { getPool } from "../../../../lib/db";
import { getUserFromToken } from "../../../../lib/auth";

export async function PATCH(request, { params }) {
  try {
    const user = getUserFromToken();
    if (!user || user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;
    const allowed = ["demo", "pending", "paid", "failed", "refunded"];

    if (!allowed.includes(status)) {
      return Response.json({ message: "Invalid status." }, { status: 400 });
    }

    const pool = getPool();
    await pool.query("UPDATE payments SET status = $1 WHERE id = $2", [status, params.id]);

    return Response.json({ message: "Updated." }, { status: 200 });
  } catch (error) {
    console.error("Payment status update error:", error);
    return Response.json({ message: "Update failed." }, { status: 500 });
  }
}
