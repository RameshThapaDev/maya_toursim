import { getPool } from "../../lib/db";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email || !emailRegex.test(email)) {
      return Response.json({ message: "Invalid email." }, { status: 400 });
    }

    if (!process.env.DATABASE_URL) {
      return Response.json({ message: "Database connection is not configured." }, { status: 500 });
    }

    const pool = getPool();
    await pool.query(
      "INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING",
      [email.toLowerCase().trim()]
    );

    return Response.json({ message: "Subscribed." }, { status: 200 });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return Response.json({ message: "Subscribe failed." }, { status: 500 });
  }
}
