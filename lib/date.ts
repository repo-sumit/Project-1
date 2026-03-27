// ─── Date helpers ─────────────────────────────────────────────────────────────
// All date logic for PrepFire uses IST (UTC+5:30) so that a student
// practising just after midnight in India gets today's date, not yesterday's.
//
// Works on both server (API routes) and client (React components).

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000 // 5 hours 30 minutes

/**
 * Returns today's date string in IST as "YYYY-MM-DD".
 * Safe to call from server (API routes) or client (components).
 */
export function todayIST(): string {
  return new Date(Date.now() + IST_OFFSET_MS).toISOString().slice(0, 10)
}
