import { getPool } from "./db";

export async function buildQuoteForInquiry(inquiryId) {
  const pool = getPool();
  const inquiryResult = await pool.query(
    `SELECT id, tour_name, hotel_name, guide_name, vehicle_name, transport_mode, status, travel_date
     FROM booking_inquiries WHERE id = $1`,
    [inquiryId]
  );
  const inquiry = inquiryResult.rows[0];
  if (!inquiry) return null;

  let days = 1;
  if (inquiry.tour_name) {
    const tourResult = await pool.query("SELECT duration_days FROM tours WHERE title = $1 LIMIT 1", [
      inquiry.tour_name
    ]);
    if (tourResult.rows[0]?.duration_days) {
      days = Number(tourResult.rows[0].duration_days) || 1;
    }
  }

  const breakdown = [];
  let total = 0;

  if (inquiry.hotel_name) {
    const hotelResult = await pool.query("SELECT price_per_night FROM hotels WHERE name = $1 LIMIT 1", [
      inquiry.hotel_name
    ]);
    const price = Number(hotelResult.rows[0]?.price_per_night || 0);
    if (price > 0) {
      const amount = price * days;
      breakdown.push({ label: `Hotel (${inquiry.hotel_name})`, amount, unit: "per_night", qty: days });
      total += amount;
    }
  }

  if (inquiry.guide_name) {
    const guideResult = await pool.query("SELECT price_per_day FROM guides WHERE name = $1 LIMIT 1", [
      inquiry.guide_name
    ]);
    const price = Number(guideResult.rows[0]?.price_per_day || 0);
    if (price > 0) {
      const amount = price * days;
      breakdown.push({ label: `Guide (${inquiry.guide_name})`, amount, unit: "per_day", qty: days });
      total += amount;
    }
  }

  if (inquiry.vehicle_name && inquiry.transport_mode !== "own-car" && inquiry.transport_mode !== "own-bike") {
    const vehicleResult = await pool.query("SELECT price_per_day FROM vehicles WHERE name = $1 LIMIT 1", [
      inquiry.vehicle_name
    ]);
    const price = Number(vehicleResult.rows[0]?.price_per_day || 0);
    if (price > 0) {
      const amount = price * days;
      breakdown.push({ label: `Vehicle (${inquiry.vehicle_name})`, amount, unit: "per_day", qty: days });
      total += amount;
    }
  }

  const chargesResult = await pool.query("SELECT * FROM charges WHERE active = true ORDER BY created_at ASC");
  chargesResult.rows.forEach((charge) => {
    const amount = charge.unit === "per_day" ? Number(charge.amount) * days : Number(charge.amount);
    breakdown.push({ label: charge.name, amount, unit: charge.unit });
    total += amount;
  });

  return {
    inquiry,
    days,
    total,
    breakdown,
    currency: "USD"
  };
}
