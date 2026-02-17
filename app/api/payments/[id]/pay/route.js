import { getUserFromToken } from "../../../../lib/auth";
import { buildQuoteForInquiry } from "../../../../lib/billing";
import { getPool } from "../../../../lib/db";
import { sendInquiryNotification } from "../../../../lib/mailer";
import { logEmail } from "../../../../lib/emailLog";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function POST(request, { params }) {
  try {
    const user = getUserFromToken();
    const session = await getServerSession(authOptions);
    if (!user && !session?.user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
    const pool = getPool();
    const inquiryResult = await pool.query(
      "SELECT id, user_id, email, name, tour_name, travel_date, status FROM booking_inquiries WHERE id = $1",
      [params.id]
    );
    const inquiry = inquiryResult.rows[0];
    const userId = user?.id || session?.user?.id;
    const userEmail = user?.email || session?.user?.email;
    if (
      !inquiry ||
      (inquiry.user_id && inquiry.user_id !== userId) ||
      (!inquiry.user_id && inquiry.email && userEmail && inquiry.email !== userEmail)
    ) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }
    if (inquiry.status !== "confirmed") {
      return Response.json({ message: "Booking not confirmed." }, { status: 400 });
    }

    const quote = await buildQuoteForInquiry(params.id);
    if (!quote) {
      return Response.json({ message: "Quote unavailable." }, { status: 400 });
    }

    await pool.query(
      "UPDATE payments SET status = $1, amount = $2, currency = $3, breakdown = $4 WHERE inquiry_id = $5",
      ["paid", quote.total, quote.currency, JSON.stringify(quote.breakdown), params.id]
    );

    const subject = "Payment received — Maya Bliss Tours";
    const html = `
      <h2>Payment received</h2>
      <p>Hi ${inquiry.name || "Traveler"},</p>
      <p>We have received your payment for ${inquiry.tour_name || "your booking"}.</p>
      <p><strong>Total paid:</strong> USD ${quote.total.toFixed(2)}</p>
      <p><strong>Travel date:</strong> ${inquiry.travel_date}</p>
      <p>We will follow up with your final itinerary and travel documents.</p>
    `;

    try {
      await sendInquiryNotification({
        to: inquiry.email,
        subject,
        html
      });
      await logEmail({ recipient: inquiry.email, subject, body: html, status: "sent" });
    } catch (mailError) {
      await logEmail({
        recipient: inquiry.email,
        subject,
        body: html,
        status: "failed",
        errorMessage: mailError?.message || String(mailError)
      });
    }

    return Response.json({ message: "Payment recorded." }, { status: 200 });
  } catch (error) {
    console.error("Payment error:", error);
    return Response.json({ message: "Payment failed." }, { status: 500 });
  }
}
