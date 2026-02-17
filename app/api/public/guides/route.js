import { getPool } from "../../../lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const pool = getPool();
    const result = await pool.query("SELECT * FROM guides ORDER BY created_at DESC");
    return Response.json({ items: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Public guides fetch error:", error);
    return Response.json({ items: [] }, { status: 200 });
  }
}
