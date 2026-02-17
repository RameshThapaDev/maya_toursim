import { getPool } from "../../lib/db";
import { sendInquiryNotification } from "../../lib/mailer";
import { getUserFromToken } from "../../lib/auth";
import { logEmail } from "../../lib/emailLog";

export async function POST(request) {
  try {
    const body = await request.json();
    const maxDocSize = 2 * 1024 * 1024;
    const {
      name,
      email,
      travelers,
      date,
      notes,
      tourName,
      hotelName,
      guideName,
      vehicleName,
      travelersDetails,
      documentType,
      documentName,
      documentData,
      paymentMethod,
      paymentReference,
      upiId,
      binancePayId,
      transportMode,
      preferredTimezone
    } = body;

    if (!name || !email || !travelers || !date) {
      return Response.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }
    if (documentData && documentData.length > maxDocSize * 1.37) {
      return Response.json(
        { message: "Document must be 2 MB or smaller." },
        { status: 400 }
      );
    }

    if (!process.env.DATABASE_URL) {
      return Response.json(
        { message: "Database connection is not configured." },
        { status: 500 }
      );
    }

    const pool = getPool();
    const user = getUserFromToken();
    const query =
      "INSERT INTO booking_inquiries (tour_name, hotel_name, guide_name, vehicle_name, user_id, status, travelers_details, document_type, document_name, document_data, payment_method, payment_reference, upi_id, binance_pay_id, transport_mode, preferred_timezone, name, email, travelers, travel_date, notes) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING id";
    const values = [
      tourName || null,
      hotelName || null,
      guideName || null,
      vehicleName || null,
      user?.id || null,
      "pending",
      JSON.stringify(Array.isArray(travelersDetails) ? travelersDetails : []),
      documentType || null,
      documentName || null,
      documentData || null,
      paymentMethod || null,
      paymentReference || null,
      upiId || null,
      binancePayId || null,
      transportMode || null,
      preferredTimezone || null,
      name,
      email,
      Number(travelers),
      date,
      notes || null
    ];
    const result = await pool.query(query, values);

    const adminEmail = process.env.MAIL_TO || email;
    const inquiryId = result.rows[0]?.id;

    if (inquiryId && paymentMethod) {
      await pool.query(
        "INSERT INTO payments (inquiry_id, method, reference, upi_id, binance_pay_id, status) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          inquiryId,
          paymentMethod,
          paymentReference || null,
          upiId || null,
          binancePayId || null,
          "demo"
        ]
      );
    }

    const adminSubject = `New booking inquiry${tourName ? `: ${tourName}` : ""}`;
    const adminHtml = `
      <h2>New Bhutan tour inquiry</h2>
      <p><strong>Tour:</strong> ${tourName || "General inquiry"}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Travelers:</strong> ${travelers}</p>
      <p><strong>Preferred date:</strong> ${date}</p>
      <p><strong>Hotel:</strong> ${hotelName || "-"}</p>
      <p><strong>Guide:</strong> ${guideName || "-"}</p>
      <p><strong>Vehicle:</strong> ${vehicleName || "-"}</p>
      <p><strong>Own transport:</strong> ${transportMode || "-"}</p>
      <p><strong>Document:</strong> ${documentType || "-"} ${documentName || ""}</p>
      <p><strong>Notes:</strong> ${notes || "-"}</p>
      <p><strong>Inquiry ID:</strong> ${inquiryId}</p>
    `;

    const userSubject = `We received your Bhutan booking request${tourName ? ` for ${tourName}` : ""}`;
    const userHtml = `
      <h2>Thank you for your booking request</h2>
      <p>Hi ${name},</p>
      <p>We have received your Bhutan travel request and our team will confirm details shortly.</p>
      <h3>Booking summary</h3>
      <p><strong>Tour:</strong> ${tourName || "Custom itinerary"}</p>
      <p><strong>Travel dates:</strong> ${date}</p>
      <p><strong>Travelers:</strong> ${travelers}</p>
      <p><strong>Hotel preference:</strong> ${hotelName || "Not specified"}</p>
      <p><strong>Guide preference:</strong> ${guideName || "Not specified"}</p>
      <p><strong>Vehicle preference:</strong> ${vehicleName || "Not specified"}</p>
      <p><strong>Own transport:</strong> ${transportMode || "Not specified"}</p>
      <p><strong>Document on file:</strong> ${documentType || "-"} ${documentName || ""}</p>
      <p><strong>Notes:</strong> ${notes || "-"}</p>
      <p>We will contact you within 24 hours with the next steps.</p>
      <p>Your inquiry ID: ${inquiryId}</p>
    `;

    try {
      await sendInquiryNotification({
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
        replyTo: email
      });
      await logEmail({ recipient: adminEmail, subject: adminSubject, body: adminHtml, status: "sent" });
    } catch (mailError) {
      console.error("Inquiry email error:", mailError);
      await logEmail({
        recipient: adminEmail,
        subject: adminSubject,
        body: adminHtml,
        status: "failed",
        errorMessage: mailError?.message || String(mailError)
      });
    }

    try {
      await sendInquiryNotification({
        to: email,
        subject: userSubject,
        html: userHtml,
        replyTo: adminEmail
      });
      await logEmail({ recipient: email, subject: userSubject, body: userHtml, status: "sent" });
    } catch (mailError) {
      console.error("User inquiry email error:", mailError);
      await logEmail({
        recipient: email,
        subject: userSubject,
        body: userHtml,
        status: "failed",
        errorMessage: mailError?.message || String(mailError)
      });
    }

    return Response.json({ message: "Inquiry received." }, { status: 200 });
  } catch (error) {
    console.error("Inquiry API error:", error);
    return Response.json(
      { message: "Inquiry failed. Check server logs for details." },
      { status: 500 }
    );
  }
}
