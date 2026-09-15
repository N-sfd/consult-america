/**
 * Monday–Friday business-day scheduling for Phase 2B.
 * No holiday calendar. Result is an absolute timestamp so restarts
 * cannot reinterpret the delay.
 */
export function addBusinessDays(from: Date, businessDays: number): Date {
  if (!Number.isFinite(businessDays) || businessDays < 0) {
    throw new Error("businessDays must be a non-negative number");
  }
  if (businessDays === 0) return new Date(from.getTime());

  const result = new Date(from.getTime());
  let remaining = Math.floor(businessDays);
  while (remaining > 0) {
    result.setUTCDate(result.getUTCDate() + 1);
    const day = result.getUTCDay(); // 0 Sun .. 6 Sat
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return result;
}

/** Test helper: count Mon–Fri days between two instants (exclusive of start day boundaries). */
export function businessDaysBetween(from: Date, to: Date): number {
  let count = 0;
  const cursor = new Date(from.getTime());
  while (cursor < to) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6 && cursor <= to) count += 1;
  }
  return count;
}
