import { tours as seedTours } from "../data/tours";
import { getPool } from "./db";

export function mapTourRow(row) {
  if (!row) return null;
  return {
    slug: row.slug,
    title: row.title,
    durationDays: row.duration_days,
    theme: Array.isArray(row.theme) ? row.theme : [],
    difficulty: row.difficulty || "",
    summary: row.summary || "",
    overview: row.overview || "",
    image: row.image || "",
    videoUrl: row.video_url || "",
    itinerary: Array.isArray(row.itinerary) ? row.itinerary : [],
    inclusions: Array.isArray(row.inclusions) ? row.inclusions : [],
    exclusions: Array.isArray(row.exclusions) ? row.exclusions : [],
    faq: Array.isArray(row.faq) ? row.faq : []
  };
}

export async function getToursWithFallback() {
  try {
    const pool = getPool();
    const result = await pool.query("SELECT * FROM tours ORDER BY created_at DESC");
    if (result.rowCount > 0) {
      return result.rows.map(mapTourRow);
    }
  } catch (error) {
    console.error("Tour fetch error:", error);
  }
  return seedTours;
}

export async function getTourBySlugWithFallback(slug) {
  try {
    const pool = getPool();
    const result = await pool.query("SELECT * FROM tours WHERE slug = $1 LIMIT 1", [slug]);
    if (result.rowCount > 0) {
      return mapTourRow(result.rows[0]);
    }
  } catch (error) {
    console.error("Tour fetch error:", error);
  }
  return seedTours.find((item) => item.slug === slug) || null;
}
