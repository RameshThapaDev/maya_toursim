import { getPool } from "../../../../lib/db";
import { getUserFromToken } from "../../../../lib/auth";

function parseCommaList(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function PATCH(request, { params }) {
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
    `UPDATE tours
     SET slug = $1, title = $2, duration_days = $3, difficulty = $4, summary = $5, overview = $6,
         theme = $7, image = $8, video_url = $9, itinerary = $10, inclusions = $11, exclusions = $12, faq = $13
     WHERE id = $14 RETURNING *`,
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
      faqData,
      params.id
    ]
  );

  return Response.json({ item: result.rows[0] }, { status: 200 });
}

export async function DELETE(request, { params }) {
  const user = getUserFromToken();
  if (!user || user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const pool = getPool();
  await pool.query("DELETE FROM tours WHERE id = $1", [params.id]);
  return Response.json({ message: "Deleted" }, { status: 200 });
}
