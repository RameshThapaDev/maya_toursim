import { getUserFromToken } from "../../../lib/auth";
import { getPool } from "../../../lib/db";
import { getToken } from "next-auth/jwt";

export async function POST(request) {
  const user = getUserFromToken();
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  });
  if (!user && !token) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const effectiveUser = user || token;

  try {
    const pool = getPool();
    let email = effectiveUser.email;
    if (!email && effectiveUser.id) {
      const userResult = await pool.query("SELECT email FROM users WHERE id = $1", [effectiveUser.id]);
      email = userResult.rows[0]?.email || null;
    }
    if (!email) {
      return Response.json({ message: "No email" }, { status: 200 });
    }
    await pool.query(
      "UPDATE email_logs SET read_at = NOW() WHERE LOWER(recipient) = LOWER($1) AND read_at IS NULL",
      [email]
    );
    return Response.json({ message: "Marked read" }, { status: 200 });
  } catch (error) {
    console.error("Notification read error:", error);
    return Response.json({ message: "Failed" }, { status: 500 });
  }
}
