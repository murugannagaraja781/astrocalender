/**
 * Tamil Date Calculator
 *
 * Implements strict solar-ingress based Tamil date calculation.
 *
 * Rules:
 * 1. Tamil Month is determined by the Sidereal Zodiac Sign of the Sun.
 * 2. Month transition (Sankranti) happens at the exact moment Sun enters the sign.
 * 3. The "Day" of the month is calculated based on the elapsed time since ingress,
 *    but simplified to the user's requirement:
 *    - If event_time >= solar_ingress_time -> Date = 1 (start of month).
 *    - To give a useful "Date 1..31", we calculate the day number based on degrees traversed + 1.
 *    This aligns with "1 degree per day" approximation and ensures Day 1 starts at 0°.
 */

import { getSunLongitude, findAngleCrossing, normalizeAngle } from './swisseph.js';
import { julianDayToDate } from './swisseph.js';

export interface TamilDateInfo {
  monthIndex: number; // 0 = Chithirai (Aries), 1 = Vaikasi (Taurus), etc.
  day: number;        // Day of the month (1..32)
  fraction: number;   // Fraction of the day elapsed
  ingressJD: number;  // JD of the month start (Sankranti)
}

/**
 * Calculate Tamil Date based on strict solar ingress.
 *
 * @param jd - Julian Day of the event/query
 * @returns TamilDateInfo
 */
export function calculateTamilDateStrict(jd: number): TamilDateInfo {
  // 1. Get Sun's sidereal longitude
  const sunLong = getSunLongitude(jd);

  // 2. Determine the Month (Zodiac Sign)
  // 0 = Aries (Mesham/Chithirai), 1 = Taurus (Rishabam/Vaikasi)...
  const monthIndex = Math.floor(sunLong / 30);

  // 3. Find the exact Ingress Time (Sankranti) for this month
  // The target angle is the start of the current sign (0, 30, 60...)
  const targetAngle = monthIndex * 30;

  // Search backwards up to 32 days to find when Sun crossed `targetAngle`
  // Sun moves ~1 degree per day, so 30 degrees takes ~30 days.
  // We search back 35 days to be safe.
  const searchStartJD = jd - 35;
  const searchEndJD = jd;

  const ingressJD = findAngleCrossing(
    searchStartJD,
    searchEndJD,
    targetAngle,
    getSunLongitude,
    0.00001 // High precision for seconds-level accuracy
  );

  // 4. Calculate Day Number
  // Conceptually, Day 1 is the first 24h (or degree?) after ingress?
  // The user prompt says: "If event_time >= solar_ingress_time -> Tamil date = 1"
  // This implies strict elapsed time or degree count.
  // Method A: Degree-based (Astronomical standard)
  // Day = floor(Longitude within sign) + 1
  // Example: 0.1° -> Day 1. 29.9° -> Day 30.

  const degreesInSign = sunLong - targetAngle;
  // Handle edge case of 360/0 wrap around if calc is slightly off
  const normalizedDegrees = degreesInSign < 0 ? degreesInSign + 360 : degreesInSign;

  const day = Math.floor(normalizedDegrees) + 1;
  const fraction = normalizedDegrees - Math.floor(normalizedDegrees);

  return {
    monthIndex,
    day,
    fraction,
    ingressJD
  };
}

/**
 * Get Tamil Month Name (English and Tamil)
 */
export const TAMIL_MONTHS = [
  { en: 'Chithirai', ta: 'சித்திரை' },
  { en: 'Vaikasi', ta: 'வைகாசி' },
  { en: 'Ani', ta: 'ஆனி' },
  { en: 'Adi', ta: 'ஆடி' },
  { en: 'Avani', ta: 'ஆவணி' },
  { en: 'Purattasi', ta: 'புரட்டாசி' },
  { en: 'Aippasi', ta: 'ஐப்பசி' },
  { en: 'Karthigai', ta: 'கார்த்திகை' },
  { en: 'Margazhi', ta: 'மார்கழி' },
  { en: 'Thai', ta: 'தை' },
  { en: 'Masi', ta: 'மாசி' },
  { en: 'Panguni', ta: 'பங்குனி' }
];

export function getTamilMonthName(index: number) {
  return TAMIL_MONTHS[index % 12];
}
