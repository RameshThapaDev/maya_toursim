import { getPool } from "./db";

export async function logEmail({ recipient, subject, body, status, errorMessage }) {
  try {
    const pool = getPool();
    await pool.query(
      "INSERT INTO email_logs (recipient, subject, body, status, error_message) VALUES ($1, $2, $3, $4, $5)",
      [recipient ? recipient.toLowerCase() : recipient, subject, body, status, errorMessage || null]
    );
  } catch (error) {
    console.error("Email log error:", error);
  }
}
