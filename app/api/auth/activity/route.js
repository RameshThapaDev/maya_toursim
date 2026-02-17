import { getUserFromToken } from "../../../lib/auth";
import { getPool } from "../../../lib/db";
import { getToken } from "next-auth/jwt";

function getIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") || null;
}

export async function POST(request) {
  const user = getUserFromToken();
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
  });
  const effectiveUser = user || token;
  if (!effectiveUser) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const pool = getPool();
  let email = effectiveUser.email ? effectiveUser.email.toLowerCase() : null;
  let userId = effectiveUser.id;
  if (!email && userId) {
    const userResult = await pool.query("SELECT email FROM users WHERE id = $1", [userId]);
    email = userResult.rows[0]?.email?.toLowerCase() || null;
  }
  if (!userId && email) {
    const userResult = await pool.query("SELECT id FROM users WHERE LOWER(email) = $1", [email]);
    userId = userResult.rows[0]?.id || null;
  }

  const ip = getIp(request);
  const userAgent = request.headers.get("user-agent") || null;
  const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || null;
  const city = request.headers.get("x-vercel-ip-city") || null;

  await pool.query(
    "INSERT INTO login_activity (user_id, email, ip_address, user_agent, country, city) VALUES ($1,$2,$3,$4,$5,$6)",
    [userId || null, email || null, ip || null, userAgent, country, city]
  );

  return Response.json({ message: "Logged" }, { status: 200 });
}
