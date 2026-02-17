import { getPool } from "../../../lib/db";
import { signToken, setSessionCookie, verifyPassword } from "../../../lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ message: "Missing required fields." }, { status: 400 });
    }

    const pool = getPool();
    const result = await pool.query(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return Response.json({ message: "Invalid credentials." }, { status: 401 });
    }

    const user = result.rows[0];
    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return Response.json({ message: "Invalid credentials." }, { status: 401 });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    setSessionCookie(token);

    return Response.json({ message: "Logged in." }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ message: "Login failed." }, { status: 500 });
  }
}
