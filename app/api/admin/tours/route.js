import { getPool } from "../../../lib/db";
import { getUserFromToken } from "../../../lib/auth";

function parseCommaList(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET() {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const pool = getPool();
  const result = await pool.query("SELECT * FROM tours ORDER BY created_at DESC");
  return Response.json({ items: result.rows }, { status: 200 });
}

export async function POST(request) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const {
    slug,
    title,
    duration_days,
    difficulty,
    summary,
    overview,
    theme,
    image,
    video_url,
    inclusions,
    exclusions,
    itinerary,
    faq
  } = body;

  if (!slug || !title || !duration_days) {
    return Response.json({ message: "Missing required fields." }, { status: 400 });
  }

  let itineraryData = [];
  let faqData = [];
  try {
    itineraryData = itinerary ? JSON.parse(itinerary) : [];
    faqData = faq ? JSON.parse(faq) : [];
  } catch (error) {
    return Response.json({ message: "Invalid JSON in itinerary or FAQ." }, { status: 400 });
  }

  const pool = getPool();
  const result = await pool.query(
    `INSERT INTO tours
     (slug, title, duration_days, difficulty, summary, overview, theme, image, video_url, itinerary, inclusions, exclusions, faq)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [
      slug,
      title,
      Number(duration_days),
      difficulty || null,
      summary || null,
      overview || null,
      parseCommaList(theme),
      image || null,
      video_url || null,
      itineraryData,
      parseCommaList(inclusions),
      parseCommaList(exclusions),
      faqData
    ]
  );

  return Response.json({ item: result.rows[0] }, { status: 201 });
}
