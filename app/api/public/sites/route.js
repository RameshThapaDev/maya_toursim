import { getPool } from "../../../lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get("destination");
    const pool = getPool();
    const result = destination
      ? await pool.query("SELECT * FROM tourist_sites WHERE destination_slug = $1 ORDER BY created_at DESC", [
          destination
        ])
      : await pool.query("SELECT * FROM tourist_sites ORDER BY created_at DESC");
    return Response.json({ items: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Public sites fetch error:", error);
    return Response.json({ items: [] }, { status: 200 });
  }
}
