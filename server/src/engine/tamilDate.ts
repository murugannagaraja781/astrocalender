/**
 * Tamil Date Calculator
 *
 * Implements strict solar-ingress based Tamil date calculation using the Vakya/Surya Siddhanta rules (approx)
 * but adapted for Drik Ganita (Swisseph) with the specific Tamil calendar rule:
 *
 * Rule:
 * The month changes when the Sun enters the new sign (Sankranti).
 * - If Sankranti occurs during the *day* (Sunrise to Sunset), the *current* day is Day 1 of the new month.
 * - If Sankranti occurs during the *night* (Sunset to Sunrise next day), the *next* day is Day 1 of the new month.
 *
 * To calculate the Day Number:
 * 1. Find the Month Start Date (the first day where the effective month is the current month).
 * 2. Day Number = (Current Date - Start Date) + 1.
 */

import { getSunLongitude, calculateSunrise, calculateSunset } from './swisseph.js';
import { dateToJulianDay } from './swisseph.js'; // Use swisseph versions for JD consistency or adapt
import { createDateTime, getStartOfDay } from '../utils/datetime.js';

export interface TamilDateInfo {
  monthIndex: number; // 0 = Chithirai (Aries), 1 = Vaikasi (Taurus), etc.
  day: number;        // Day of the month (1, 2, 3...)
  gregorianDate: string; // YYYY-MM-DD
  totalDaysInMonth?: number; // Optional: Total days in this month
}

export interface Location {
    latitude: number;
    longitude: number;
    timezone: string;
}

/**
 * Get the effective Tamil Month Index for a specific Gregorian Date at a Location.
 * Applies the Sunset Rule.
 */
function getEffectiveMonthIndex(dateStr: string, location: Location): number {
    const { latitude, longitude, timezone } = location;

    // We need start of day JD for sunrise/settings calcs
    const startOfDayDt = getStartOfDay(dateStr, timezone);
    // Convert logic: swisseph expects Date object for dateToJulianDay usually,
    // or we can use the dateToJulianDay from swisseph which takes string?
    // Wait, swisseph.ts dateToJulianDay takes Date object.
    const jd_start = dateToJulianDay(startOfDayDt.toJSDate());

    // Calculate Sunrise & Sunset JDs
    const jd_sunrise = calculateSunrise(jd_start, latitude, longitude);
    const jd_sunset = calculateSunset(jd_start, latitude, longitude);

    // Get Sun Longitude at Sunrise and Sunset
    const sun_rise = getSunLongitude(jd_sunrise);
    const sun_set = getSunLongitude(jd_sunset);

    const sign_rise = Math.floor(sun_rise / 30);
    const sign_set = Math.floor(sun_set / 30);

    // Logic:
    // If sign_rise != sign_set, it means Sun moved to new sign during the day (Sankranti during day).
    // By rule: Day 1 of new month starts TODAY. So effective month is the NEW sign (sign_set).
    if (sign_rise !== sign_set) {
        return sign_set % 12; // Normalize 12 -> 0 if needed, though sun long is 0-360
    }

    // If sign_rise == sign_set, no change during day.
    // Ensure we check if change happened previous night?
    // Actually, if change happened last night (after yesterday sunset),
    // then Today Sunrise is ALREADY in new sign.
    // So effective month is simply sign_rise.
    return sign_rise % 12;
}

/**
 * Calculate Tamil Date based on rigorous civil calendar rules.
 *
 * @param dateStr - YYYY-MM-DD
 * @param location - Location object
 * @returns TamilDateInfo
 */
export function calculateTamilDate(dateStr: string, location: Location): TamilDateInfo {
  const currentMonthIndex = getEffectiveMonthIndex(dateStr, location);

  // Search backwards to find the Start Date (Day 1)
  // Limit search to ~35 days (max month length is 32)
  let dayCount = 1;
  const currentDt = createDateTime(dateStr, location.timezone);

  for (let i = 1; i <= 35; i++) {
      const prevDt = currentDt.minus({ days: i });
      const prevDateStr = prevDt.toFormat('yyyy-MM-dd');
      const prevMonthIndex = getEffectiveMonthIndex(prevDateStr, location);

      if (prevMonthIndex !== currentMonthIndex) {
          // The transition happened after prevDate.
          // So (prevDate + 1 day) was the first day of the new month.
          // currentDt is (prevDate + i days).
          // If i=1 (yesterday was diff), then Today is Day 1?
          // Wait.
          // If prevMonth != currentMonth, it means `prevDate` belongs to PREVIOUS month.
          // So `prevDate + 1` (which is `currentDt - (i-1) days`) is Day 1.

          // Example: Today (Match) = New Month. Yesterday (i=1) = Old Month.
          // So Today is Start Date. Day = 1.
          // Logic: valid.

          // But wait, the loop calculates `dayCount`?
          // actually dayCount is strictly `i`.
          // If i=1 (Yesterday), and Yesterday was Old Month, then Today is Day 1.
          // value is 1.
          // If i=2 (Day before Yesterday) was Old Month, then Yesterday was Day 1, Today is Day 2.
          // value is 2.

          dayCount = i;
          break;
      }
  }

  return {
    monthIndex: currentMonthIndex,
    day: dayCount,
    gregorianDate: dateStr
  };
}


// Maintain compatibility/lookup for names
export const TAMIL_MONTHS = [
  { en: 'Chithirai', ta: 'சித்திரை' },
  { en: 'Vaikasi', ta: 'வைகாசி' },
  { en: 'Aani', ta: 'ஆனி' },
  { en: 'Aadi', ta: 'ஆடி' },
  { en: 'Aavani', ta: 'ஆவணி' },
  { en: 'Purattasi', ta: 'புரட்டாசி' },
  { en: 'Aippasi', ta: 'ஐப்பசி' },
  { en: 'Karthigai', ta: 'கார்த்திகை' },
  { en: 'Margazhi', ta: 'மார்கழி' },
  { en: 'Thai', ta: 'தை' },
  { en: 'Maasi', ta: 'மாசி' },
  { en: 'Panguni', ta: 'பங்குனி' }
];

export function getTamilMonthName(index: number) {
  return TAMIL_MONTHS[index % 12];
}
