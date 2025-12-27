/**
 * Nakshatra Calculator
 *
 * Calculates the current Nakshatra (lunar mansion) and its exact end time.
 * There are 27 Nakshatras, each spanning 13°20' of the zodiac.
 * The Nakshatra is determined by the Moon's sidereal position.
 */

import { NakshatraInfo, BilingualText } from '../types/panchangam.js';
import { getMoonLongitude, findAngleCrossing } from './swisseph.js';
import {
  NAKSHATRA_SPAN,
  getNakshatraIndex,
  getNakshatraPada,
  getNakshatraConfig,
  NAKSHATRAS
} from '../config/nakshatra.js';
import { julianDayToDateTime, formatTime } from '../utils/datetime.js';

/**
 * Find the end time of the current nakshatra.
 * Uses binary search to find when Moon crosses into the next nakshatra.
 *
 * @param currentJD - Current Julian Day
 * @param currentNakshatraIndex - Current nakshatra index (1-27)
 * @returns Julian Day when nakshatra ends
 */
export function findNakshatraEndTime(
  currentJD: number,
  currentNakshatraIndex: number
): number {
  // The next nakshatra starts at this longitude
  const nextNakshatraStart = (currentNakshatraIndex * NAKSHATRA_SPAN) % 360;

  // Moon moves about 13° per day, so nakshatra lasts roughly 1 day
  // Search within 2 days to be safe
  const searchEndJD = currentJD + 2;

  return findAngleCrossing(
    currentJD,
    searchEndJD,
    nextNakshatraStart,
    getMoonLongitude,
    0.001
  );
}

/**
 * Calculate complete Nakshatra information for a given time.
 *
 * @param julianDay - Julian Day Number
 * @param timezone - Timezone for formatting times
 * @returns Complete NakshatraInfo object
 */
export function calculateNakshatra(julianDay: number, timezone: string): NakshatraInfo {
  // Get Moon's current position
  const moonLongitude = getMoonLongitude(julianDay);

  // Calculate nakshatra index and pada
  const nakshatraIndex = getNakshatraIndex(moonLongitude);
  const pada = getNakshatraPada(moonLongitude);

  // Get nakshatra configuration
  const nakshatraConfig = getNakshatraConfig(nakshatraIndex);
  if (!nakshatraConfig) {
    throw new Error(`Invalid nakshatra index: ${nakshatraIndex}`);
  }

  // Find when this nakshatra ends
  const endJD = findNakshatraEndTime(julianDay, nakshatraIndex);
  const endDateTime = julianDayToDateTime(endJD, timezone);

  // Get next nakshatra
  const nextNakshatraIndex = nakshatraIndex >= 27 ? 1 : nakshatraIndex + 1;
  const nextNakshatraConfig = getNakshatraConfig(nextNakshatraIndex);

  return {
    index: nakshatraIndex,
    name: nakshatraConfig.name,
    pada: pada,
    endTime: formatTime(endDateTime),
    lord: nakshatraConfig.lord,
    nextNakshatra: nextNakshatraConfig?.name ?? { en: 'Unknown', ta: 'அறியாத' },
  };
}

/**
 * Get nakshatra at sunrise (traditional Panchangam uses sunrise-to-sunrise).
 */
export function getNakshatraAtSunrise(
  sunriseJD: number,
  timezone: string
): NakshatraInfo {
  return calculateNakshatra(sunriseJD, timezone);
}

/**
 * Get nakshatra rasi (Moon sign) from Moon's position.
 * Used for Chandrashtama calculation.
 *
 * @param julianDay - Julian Day Number
 * @returns Nakshatra index (1-27)
 */
export function getCurrentNakshatraIndex(julianDay: number): number {
  const moonLongitude = getMoonLongitude(julianDay);
  return getNakshatraIndex(moonLongitude);
}
