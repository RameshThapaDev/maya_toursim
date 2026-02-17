import { getPool } from "../../../../../lib/db";
import { getUserFromToken } from "../../../../../lib/auth";
import { sendInquiryNotification } from "../../../../../lib/mailer";
import { logEmail } from "../../../../../lib/emailLog";

export async function POST(request, { params }) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const pool = getPool();
    const result = await pool.query(
      "SELECT recipient, subject, body FROM email_logs WHERE id = $1",
      [params.id]
    );
    const email = result.rows[0];
    if (!email) {
      return Response.json({ message: "Email not found" }, { status: 404 });
    }

    await sendInquiryNotification({
      to: email.recipient,
      subject: email.subject,
      html: email.body
    });

    await logEmail({
      recipient: email.recipient,
      subject: email.subject,
      body: email.body,
      status: "sent"
    });

    return Response.json({ message: "Resent" }, { status: 200 });
  } catch (error) {
    console.error("Resend email error:", error);
    await logEmail({
      recipient: "unknown",
      subject: "Resend failed",
      body: String(error),
      status: "failed",
      errorMessage: error?.message || String(error)
    });
    return Response.json({ message: "Resend failed" }, { status: 500 });
  }
}
