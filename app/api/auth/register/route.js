import { getPool } from "../../../lib/db";
import { hashPassword, signToken, setSessionCookie } from "../../../lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json({ message: "Missing required fields." }, { status: 400 });
    }

    const pool = getPool();
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rowCount > 0) {
      return Response.json({ message: "Email already registered." }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, role",
      [name, email, passwordHash, "user"]
    );

    const token = signToken({
      id: result.rows[0].id,
      email,
      role: result.rows[0].role,
      name
    });

    setSessionCookie(token);

    return Response.json({ message: "Registered." }, { status: 200 });
  } catch (error) {
    console.error("Register error:", error);
    return Response.json({ message: "Registration failed." }, { status: 500 });
  }
}
