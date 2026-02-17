import { getUserFromToken } from "../../../../lib/auth";
import { buildQuoteForInquiry } from "../../../../lib/billing";
import { getPool } from "../../../../lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";

export async function GET(request, { params }) {
  const user = getUserFromToken();
  const session = await getServerSession(authOptions);
  if (!user && !session?.user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const quote = await buildQuoteForInquiry(params.id);
  if (!quote) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }
  const pool = getPool();
  const inquiryResult = await pool.query(
    "SELECT user_id, email, status FROM booking_inquiries WHERE id = $1",
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
  return Response.json({ quote }, { status: 200 });
}
