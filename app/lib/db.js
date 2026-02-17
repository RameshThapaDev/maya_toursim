import { Pool } from "pg";

let pool;

function buildPoolConfig() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (process.env.VERCEL === "1" && /(localhost|127\.0\.0\.1)/i.test(connectionString)) {
    throw new Error("DATABASE_URL cannot point to localhost on Vercel");
  }

  const useSsl = !/(localhost|127\.0\.0\.1)/i.test(connectionString);
  return {
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : false
  };
}

export function getPool() {
  if (!pool) {
    pool = new Pool(buildPoolConfig());
  }
  return pool;
}
