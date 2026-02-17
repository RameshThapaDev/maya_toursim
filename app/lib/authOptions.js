import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { getPool } from "./db";
import bcrypt from "bcryptjs";

function normalizeAppleKey(value) {
  return value ? value.replace(/\\n/g, "\n") : value;
}

async function upsertOAuthUser({ email, name }) {
  if (!email) return null;
  const pool = getPool();
  const existing = await pool.query("SELECT id, role, name FROM users WHERE email = $1", [email]);
  if (existing.rows[0]) {
    if (!existing.rows[0].name && name) {
      await pool.query("UPDATE users SET name = $1 WHERE id = $2", [name, existing.rows[0].id]);
    }
    return existing.rows[0];
  }
  const randomPassword = await bcrypt.hash(
    Math.random().toString(36).slice(2) + Date.now().toString(36),
    10
  );
  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, role, name",
    [name || email.split("@")[0], email, randomPassword, "user"]
  );
  return result.rows[0];
}

export const authOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),
    AppleProvider({
      clientId: process.env.APPLE_CLIENT_ID || "",
      clientSecret: {
        appleId: process.env.APPLE_CLIENT_ID || "",
        teamId: process.env.APPLE_TEAM_ID || "",
        privateKey: normalizeAppleKey(process.env.APPLE_PRIVATE_KEY || ""),
        keyId: process.env.APPLE_KEY_ID || ""
      }
    })
  ],
  callbacks: {
    async signIn({ user }) {
      if (!process.env.DATABASE_URL) return false;
      await upsertOAuthUser({ email: user.email, name: user.name });
      return true;
    },
    async jwt({ token }) {
      if (!token?.email || !process.env.DATABASE_URL) return token;
      const pool = getPool();
      const result = await pool.query("SELECT id, role, name FROM users WHERE email = $1", [token.email]);
      if (result.rows[0]) {
        token.id = result.rows[0].id;
        token.role = result.rows[0].role;
        token.name = result.rows[0].name || token.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.role = token.role || "user";
      }
      return session;
    }
  }
};
