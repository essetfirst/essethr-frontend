import {
  addDays as dfAddDays,
  differenceInDays,
  differenceInHours,
  endOfMonth,
  format,
  formatDistanceToNow,
  isValid,
  parse,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";

/** Normalize strings, numbers, and Date values into a valid Date or null. */
export function toDate(value) {
  if (value == null || value === "") return null;
  if (value instanceof Date) return isValid(value) ? value : null;
  if (typeof value === "number") {
    const d = new Date(value);
    return isValid(d) ? d : null;
  }
  const iso = parseISO(String(value));
  if (isValid(iso)) return iso;
  const fallback = new Date(value);
  return isValid(fallback) ? fallback : null;
}

/** Format a date value; returns empty string when invalid. */
export function fmt(value, pattern) {
  const d = toDate(value);
  return d ? format(d, pattern) : "";
}

/** Format the current date/time. */
export function fmtNow(pattern) {
  return format(new Date(), pattern);
}

/** Relative time, e.g. "3 days ago". */
export function fromNow(value) {
  const d = toDate(value);
  return d ? formatDistanceToNow(d, { addSuffix: true }) : "";
}

/** Parse a time string against a reference day (defaults to today). */
export function parseTime(value, pattern = "HH:mm", ref = new Date()) {
  return parse(String(value), pattern, ref);
}

export {
  dfAddDays as addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  differenceInDays,
  differenceInHours,
  format,
};

/** ISO week start (Monday), formatted as yyyy-MM-dd. */
export function startOfIsoWeek(date = new Date()) {
  return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
}

/** Start/end of current month as yyyy-MM-dd strings. */
export function monthBounds(date = new Date()) {
  return {
    start: format(startOfMonth(date), "yyyy-MM-dd"),
    end: format(endOfMonth(date), "yyyy-MM-dd"),
  };
}

/** Hours between two date/time values. */
export function diffHours(a, b) {
  const d1 = toDate(a);
  const d2 = toDate(b);
  if (!d1 || !d2) return 0;
  return differenceInHours(d1, d2);
}

/** Days between two date values (inclusive-friendly for ranges). */
export function diffDays(a, b) {
  const d1 = toDate(a);
  const d2 = toDate(b);
  if (!d1 || !d2) return 0;
  return differenceInDays(d1, d2);
}

/** Format milliseconds as HH:mm:ss (used for attendance duration). */
export function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms < 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}
