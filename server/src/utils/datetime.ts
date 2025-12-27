/**
 * DateTime Utilities
 *
 * Timezone-aware date/time handling using Luxon.
 * All internal calculations use UTC; display times are converted to local timezone.
 */

import { DateTime, Duration } from 'luxon';

/**
 * Convert a date string and timezone to a Luxon DateTime.
 * @param dateStr - Date in YYYY-MM-DD format
 * @param timezone - IANA timezone string (e.g., "Asia/Kolkata")
 * @returns DateTime object in the specified timezone
 */
export function createDateTime(dateStr: string, timezone: string): DateTime {
  const dt = DateTime.fromISO(dateStr, { zone: timezone });
  if (!dt.isValid) {
    throw new Error(`Invalid date or timezone: ${dateStr}, ${timezone}`);
  }
  return dt;
}

/**
 * Convert a date string to Julian Day Number.
 * The Julian Day starts at noon UTC, so we calculate for noon of the given day.
 *
 * @param dateStr - Date in YYYY-MM-DD format
 * @param timezone - IANA timezone string
 * @returns Julian Day Number (fractional)
 */
export function dateToJulianDay(dateStr: string, timezone: string): number {
  const dt = createDateTime(dateStr, timezone);
  // Convert to UTC for JD calculation
  const utc = dt.toUTC();

  const year = utc.year;
  const month = utc.month;
  const day = utc.day;
  const hour = utc.hour;
  const minute = utc.minute;
  const second = utc.second;

  // Calculate day fraction
  const dayFraction = (hour + minute / 60 + second / 3600) / 24;

  // Julian Day calculation (Meeus algorithm)
  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  const jd = Math.floor(365.25 * (y + 4716)) +
             Math.floor(30.6001 * (m + 1)) +
             day + dayFraction + b - 1524.5;

  return jd;
}

/**
 * Convert Julian Day Number to DateTime.
 * @param jd - Julian Day Number
 * @param timezone - Target timezone
 * @returns DateTime in the specified timezone
 */
export function julianDayToDateTime(jd: number, timezone: string): DateTime {
  // Convert JD to Unix timestamp
  // JD 2440587.5 = Unix epoch (Jan 1, 1970 00:00:00 UTC)
  const unixTimestamp = (jd - 2440587.5) * 86400;

  return DateTime.fromSeconds(unixTimestamp, { zone: 'UTC' }).setZone(timezone);
}

/**
 * Format a DateTime to time string (HH:MM:SS).
 */
export function formatTime(dt: DateTime): string {
  return dt.toFormat('HH:mm:ss');
}

/**
 * Format a DateTime to time string (HH:MM).
 */
export function formatTimeShort(dt: DateTime): string {
  return dt.toFormat('HH:mm');
}

/**
 * Get the start of day (midnight) for a given date in a timezone.
 */
export function getStartOfDay(dateStr: string, timezone: string): DateTime {
  return createDateTime(dateStr, timezone).startOf('day');
}

/**
 * Get the end of day (23:59:59) for a given date in a timezone.
 */
export function getEndOfDay(dateStr: string, timezone: string): DateTime {
  return createDateTime(dateStr, timezone).endOf('day');
}

/**
 * Calculate duration between two times and divide into segments.
 * Used for Rahu Kalam, Yama Gandam calculations.
 *
 * @param start - Start time
 * @param end - End time
 * @param segments - Number of segments to divide into
 * @returns Array of { start, end } for each segment
 */
export function divideTimeRange(
  start: DateTime,
  end: DateTime,
  segments: number
): Array<{ start: DateTime; end: DateTime }> {
  const totalDuration = end.diff(start);
  const segmentDuration = totalDuration.as('milliseconds') / segments;

  const result: Array<{ start: DateTime; end: DateTime }> = [];

  for (let i = 0; i < segments; i++) {
    const segStart = start.plus(Duration.fromMillis(segmentDuration * i));
    const segEnd = start.plus(Duration.fromMillis(segmentDuration * (i + 1)));
    result.push({ start: segStart, end: segEnd });
  }

  return result;
}

/**
 * Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday).
 */
export function getDayOfWeek(dateStr: string, timezone: string): number {
  const dt = createDateTime(dateStr, timezone);
  // Luxon uses 1-7 (Mon-Sun), convert to 0-6 (Sun-Sat)
  return dt.weekday % 7;
}

/**
 * Validate IANA timezone string.
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    const dt = DateTime.now().setZone(timezone);
    return dt.isValid && dt.zoneName !== null;
  } catch {
    return false;
  }
}
