import { getUserFromToken } from "../../../lib/auth";
import { getPool } from "../../../lib/db";
import { getToken } from "next-auth/jwt";

export async function GET(request) {
  const user = getUserFromToken();
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  });
  if (!user && !token) {
    return Response.json({ items: [] }, { status: 200 });
  }
  const effectiveUser = user || token;

  try {
    const pool = getPool();
    if (effectiveUser.role === "admin") {
      const pendingResult = await pool.query(
        "SELECT id, name, email, tour_name, created_at FROM booking_inquiries WHERE status = 'pending' ORDER BY created_at DESC LIMIT 20"
      );
      const failedMailResult = await pool.query(
        "SELECT id, recipient, subject, created_at FROM email_logs WHERE status = 'failed' ORDER BY created_at DESC LIMIT 20"
      );
      const items = [
        ...pendingResult.rows.map((row) => ({
          id: `pending-${row.id}`,
          subject: `Pending inquiry: ${row.tour_name || "Custom itinerary"}`,
          status: "pending",
          created_at: row.created_at,
          detail: `${row.name} · ${row.email}`
        })),
        ...failedMailResult.rows.map((row) => ({
          id: `failed-${row.id}`,
          subject: `Email failed: ${row.subject}`,
          status: "failed",
          created_at: row.created_at,
          detail: row.recipient
        }))
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return Response.json({ items }, { status: 200 });
    }

    let email = effectiveUser.email;
    if (!email && effectiveUser.id) {
      const userResult = await pool.query("SELECT email FROM users WHERE id = $1", [effectiveUser.id]);
      email = userResult.rows[0]?.email || null;
    }
    if (!email) {
      return Response.json({ items: [] }, { status: 200 });
    }
    const result = await pool.query(
      "SELECT id, subject, status, read_at, created_at FROM email_logs WHERE LOWER(recipient) = LOWER($1) ORDER BY created_at DESC LIMIT 20",
      [email]
    );
    return Response.json({ items: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Notification list error:", error);
    return Response.json({ items: [] }, { status: 200 });
  }
}
