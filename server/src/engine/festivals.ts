/**
 * Festival Matcher
 *
 * Determines which festivals fall on a given date based on:
 * - Tithi-based Hindu festivals
 * - Nakshatra-based Hindu festivals
 * - Fixed date (Gregorian) festivals
 */

import { FestivalInfo, TithiInfo, NakshatraInfo } from '../types/panchangam.js';
import {
  TITHI_BASED_FESTIVALS,
  NAKSHATRA_BASED_FESTIVALS,
  getFixedFestivals
} from '../config/festivals.js';
import { getTamilMonth } from '../config/tamilCalendar.js';
import { getSunLongitude } from './swisseph.js';

/**
 * Get all festivals for a given date.
 *
 * @param dateStr - Date in YYYY-MM-DD format
 * @param tithi - Current Tithi info
 * @param nakshatra - Current Nakshatra info
 * @param sunLongitude - Sun's sidereal longitude (for Tamil month)
 * @returns Array of festivals for this date
 */
export function getMatchingFestivals(
  dateStr: string,
  tithi: TithiInfo,
  nakshatra: NakshatraInfo,
  sunLongitude: number
): FestivalInfo[] {
  const festivals: FestivalInfo[] = [];

  // Parse date for fixed festivals
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const gregorianMonth = parseInt(monthStr ?? '1', 10);
  const gregorianDay = parseInt(dayStr ?? '1', 10);

  // Get Tamil month for Hindu festivals
  const tamilMonth = getTamilMonth(sunLongitude);

  // Check tithi-based festivals
  for (const festival of TITHI_BASED_FESTIVALS) {
    // Check if month matches (0 = all months)
    const monthMatches = festival.month === 0 || festival.month === tamilMonth.index;

    // Check if tithi matches
    const tithiMatches = festival.tithi === tithi.index;

    if (monthMatches && tithiMatches) {
      festivals.push({
        name: festival.name,
        type: festival.type,
      });
    }
  }

  // Check nakshatra-based festivals
  for (const festival of NAKSHATRA_BASED_FESTIVALS) {
    const monthMatches = festival.month === 0 || festival.month === tamilMonth.index;
    const nakshatraMatches = festival.nakshatra === nakshatra.index;

    if (monthMatches && nakshatraMatches) {
      festivals.push({
        name: festival.name,
        type: festival.type,
      });
    }
  }

  // Check fixed date festivals
  const fixedFestivals = getFixedFestivals(gregorianMonth, gregorianDay);
  for (const festival of fixedFestivals) {
    festivals.push({
      name: festival.name,
      type: festival.type,
    });
  }

  // Remove duplicates based on English name
  const uniqueFestivals = festivals.filter(
    (festival, index, self) =>
      index === self.findIndex(f => f.name.en === festival.name.en)
  );

  return uniqueFestivals;
}
