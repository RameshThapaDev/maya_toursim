import { getPool } from "../../../../lib/db";
import { getUserFromToken } from "../../../../lib/auth";
import { sendInquiryNotification } from "../../../../lib/mailer";
import { logEmail } from "../../../../lib/emailLog";
import { buildQuoteForInquiry } from "../../../../lib/billing";

export async function PATCH(request, { params }) {
  try {
    const user = getUserFromToken();
    if (!user || user.role !== "admin") {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;
    const allowed = ["pending", "confirmed", "completed", "canceled"];

    if (!allowed.includes(status)) {
      return Response.json({ message: "Invalid status." }, { status: 400 });
    }

    const pool = getPool();
    const completedAt = status === "completed" ? new Date() : null;
    const confirmedAt = status === "confirmed" ? new Date() : null;

    await pool.query(
      "UPDATE booking_inquiries SET status = $1, completed_at = $2, confirmed_at = COALESCE($3, confirmed_at) WHERE id = $4",
      [status, completedAt, confirmedAt, params.id]
    );

    const inquiryResult = await pool.query(
      "SELECT name, email, tour_name, travel_date FROM booking_inquiries WHERE id = $1",
      [params.id]
    );
    const inquiry = inquiryResult.rows[0];
    if (inquiry?.email) {
      let subject = `Your booking status is now ${status}`;
      let html = `
        <h2>Booking status update</h2>
        <p>Hi ${inquiry.name || "Traveler"},</p>
        <p>Your Bhutan booking request has been updated.</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Tour:</strong> ${inquiry.tour_name || "Custom itinerary"}</p>
        <p><strong>Dates:</strong> ${inquiry.travel_date}</p>
        <p>Reply to this email if you have any questions.</p>
      `;

      if (status === "confirmed") {
        const quote = await buildQuoteForInquiry(params.id);
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:8080";
        const payUrl = `${baseUrl}/payments/${params.id}`;
        const total = quote ? quote.total.toFixed(2) : "0.00";
        subject = "Your booking is confirmed — complete your payment";
        html = `
          <h2>Your Bhutan booking is confirmed</h2>
          <p>Hi ${inquiry.name || "Traveler"},</p>
          <p>Great news — your booking has been confirmed.</p>
          <p><strong>Tour:</strong> ${inquiry.tour_name || "Custom itinerary"}</p>
          <p><strong>Dates:</strong> ${inquiry.travel_date}</p>
          <p><strong>Estimated total:</strong> USD ${total}</p>
          <p>Please complete payment using the secure link below:</p>
          <p><a href="${payUrl}">${payUrl}</a></p>
        `;
        const paymentResult = await pool.query(
          "SELECT id FROM payments WHERE inquiry_id = $1 LIMIT 1",
          [params.id]
        );
        if (paymentResult.rowCount === 0) {
          await pool.query(
            "INSERT INTO payments (inquiry_id, method, status, amount, currency, breakdown) VALUES ($1, $2, $3, $4, $5, $6)",
            [
              params.id,
              "pending",
              "pending",
              quote?.total || 0,
              quote?.currency || "USD",
              quote ? JSON.stringify(quote.breakdown) : null
            ]
          );
        }
      }
      try {
        await sendInquiryNotification({
          to: inquiry.email,
          subject,
          html
        });
        await logEmail({ recipient: inquiry.email, subject, body: html, status: "sent" });
      } catch (mailError) {
        console.error("Status email error:", mailError);
        await logEmail({
          recipient: inquiry.email,
          subject,
          body: html,
          status: "failed",
          errorMessage: mailError?.message || String(mailError)
        });
      }
    }

    return Response.json({ message: "Updated." }, { status: 200 });
  } catch (error) {
    console.error("Inquiry status update error:", error);
    return Response.json({ message: "Update failed." }, { status: 500 });
  }
}
