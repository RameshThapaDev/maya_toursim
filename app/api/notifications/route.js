import { getUserFromToken } from "../../lib/auth";
import { getPool } from "../../lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(request) {
  const user = getUserFromToken();
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  });
  if (!user && !token) {
    return Response.json({ count: 0 }, { status: 200 });
  }
  const effectiveUser = user || token;

  try {
    const pool = getPool();
    if (effectiveUser.role === "admin") {
      const pendingResult = await pool.query(
        "SELECT COUNT(*)::int AS total FROM booking_inquiries WHERE status = 'pending'"
      );
      const failedMailResult = await pool.query(
        "SELECT COUNT(*)::int AS total FROM email_logs WHERE status = 'failed' AND created_at >= NOW() - INTERVAL '7 days'"
      );
      const count = (pendingResult.rows[0]?.total || 0) + (failedMailResult.rows[0]?.total || 0);
      return Response.json({ count }, { status: 200 });
    }

    let email = effectiveUser.email;
    if (!email && effectiveUser.id) {
      const userResult = await pool.query("SELECT email FROM users WHERE id = $1", [effectiveUser.id]);
      email = userResult.rows[0]?.email || null;
    }
    if (!email) {
      return Response.json({ count: 0 }, { status: 200 });
    }
    const userMailResult = await pool.query(
      "SELECT COUNT(*)::int AS total FROM email_logs WHERE LOWER(recipient) = LOWER($1) AND read_at IS NULL",
      [email]
    );
    return Response.json({ count: userMailResult.rows[0]?.total || 0 }, { status: 200 });
  } catch (error) {
    console.error("Notification count error:", error);
    return Response.json({ count: 0 }, { status: 200 });
  }
}
