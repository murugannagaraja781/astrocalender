/**
 * Tithi Calculator
 *
 * Calculates the current Tithi (lunar day) and its exact end time.
 * Tithi is based on the angular separation between Moon and Sun.
 * Each Tithi spans 12° of Moon-Sun elongation.
 */

import { TithiInfo, BilingualText } from '../types/panchangam.js';
import { getSunMoonPositions, findAngleCrossing, getMoonLongitude, getSunLongitude } from './swisseph.js';
import { TITHI_SPAN, getTithiConfig, getPaksha, TITHIS } from '../config/tithi.js';
import { julianDayToDateTime, formatTime } from '../utils/datetime.js';

/**
 * Calculate the Moon-Sun elongation (angular separation).
 * This determines the current Tithi.
 *
 * @param sunLongitude - Sun's sidereal longitude
 * @param moonLongitude - Moon's sidereal longitude
 * @returns Elongation in degrees (0-360)
 */
export function getMoonSunElongation(sunLongitude: number, moonLongitude: number): number {
  let elongation = moonLongitude - sunLongitude;
  if (elongation < 0) {
    elongation += 360;
  }
  return elongation;
}

/**
 * Get the current tithi index from elongation.
 * @param elongation - Moon-Sun elongation in degrees (0-360)
 * @returns Tithi index (1-30)
 */
export function getTithiIndexFromElongation(elongation: number): number {
  const index = Math.floor(elongation / TITHI_SPAN) + 1;
  return index > 30 ? 30 : index;
}

/**
 * Calculate the elongation for a given Julian Day.
 * Helper function for binary search.
 */
function getElongation(jd: number): number {
  const { sun, moon } = getSunMoonPositions(jd);
  return getMoonSunElongation(sun, moon);
}

/**
 * Find the end time of the current tithi.
 * Uses binary search to find when the elongation crosses the next 12° boundary.
 *
 * @param currentJD - Current Julian Day
 * @param currentTithiIndex - Current tithi index (1-30)
 * @param timezone - Timezone for output formatting
 * @returns Julian Day when tithi ends
 */
export function findTithiEndTime(
  currentJD: number,
  currentTithiIndex: number,
  timezone: string
): number {
  // The next tithi starts at this elongation
  const nextTithiElongation = (currentTithiIndex * TITHI_SPAN) % 360;

  // Moon moves about 13° per day, so tithi lasts roughly 1 day
  // Search within 2 days to be safe
  const searchEndJD = currentJD + 2;

  return findAngleCrossing(
    currentJD,
    searchEndJD,
    nextTithiElongation,
    getElongation,
    0.001
  );
}

/**
 * Calculate complete Tithi information for a given time.
 *
 * @param julianDay - Julian Day Number
 * @param timezone - Timezone for formatting times
 * @returns Complete TithiInfo object
 */
export function calculateTithi(julianDay: number, timezone: string): TithiInfo {
  // Get current Sun and Moon positions
  const { sun, moon } = getSunMoonPositions(julianDay);

  // Calculate elongation and tithi index
  const elongation = getMoonSunElongation(sun, moon);
  const tithiIndex = getTithiIndexFromElongation(elongation);

  // Get tithi configuration
  const tithiConfig = getTithiConfig(tithiIndex);
  if (!tithiConfig) {
    throw new Error(`Invalid tithi index: ${tithiIndex}`);
  }

  // Find when this tithi ends
  const endJD = findTithiEndTime(julianDay, tithiIndex, timezone);
  const endDateTime = julianDayToDateTime(endJD, timezone);

  // Get next tithi
  const nextTithiIndex = tithiIndex >= 30 ? 1 : tithiIndex + 1;
  const nextTithiConfig = getTithiConfig(nextTithiIndex);

  // Get paksha (lunar fortnight)
  const paksha = getPaksha(tithiIndex);

  return {
    index: tithiIndex,
    name: tithiConfig.name,
    paksha: paksha,
    endTime: formatTime(endDateTime),
    nextTithi: nextTithiConfig?.name ?? { en: 'Unknown', ta: 'அறியாத' },
  };
}

/**
 * Get tithi at sunrise (traditional Panchangam uses sunrise-to-sunrise).
 * This is the "ruling" tithi for the day.
 */
export function getTithiAtSunrise(
  sunriseJD: number,
  timezone: string
): TithiInfo {
  return calculateTithi(sunriseJD, timezone);
}
