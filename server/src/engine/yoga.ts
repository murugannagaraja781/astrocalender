/**
 * Yoga Calculator
 *
 * Calculates the current Yoga from Sun and Moon positions.
 * Yoga = (Sun Longitude + Moon Longitude) / 13°20'
 * There are 27 Yogas, each with specific auspicious/inauspicious qualities.
 */

import { YogaInfo } from '../types/panchangam.js';
import { getSunMoonPositions, findAngleCrossing, getMoonLongitude, getSunLongitude } from './swisseph.js';
import { YOGA_SPAN, getYogaIndex, getYogaConfig, YOGAS } from '../config/yoga.js';
import { julianDayToDateTime, formatTime } from '../utils/datetime.js';

/**
 * Calculate the combined Sun-Moon longitude.
 * This determines the current Yoga.
 */
export function getCombinedLongitude(sunLongitude: number, moonLongitude: number): number {
  let combined = sunLongitude + moonLongitude;
  return combined % 360;
}

/**
 * Get combined longitude for a given Julian Day.
 * Helper function for binary search.
 */
function getCombinedAtJD(jd: number): number {
  const { sun, moon } = getSunMoonPositions(jd);
  return getCombinedLongitude(sun, moon);
}

/**
 * Find the end time of the current yoga.
 * Uses binary search to find when combined longitude crosses the next boundary.
 *
 * @param currentJD - Current Julian Day
 * @param currentYogaIndex - Current yoga index (1-27)
 * @returns Julian Day when yoga ends
 */
export function findYogaEndTime(
  currentJD: number,
  currentYogaIndex: number
): number {
  // The next yoga starts at this combined longitude
  const nextYogaStart = (currentYogaIndex * YOGA_SPAN) % 360;

  // Combined motion is faster than individual, but still roughly 1 day per yoga
  const searchEndJD = currentJD + 2;

  return findAngleCrossing(
    currentJD,
    searchEndJD,
    nextYogaStart,
    getCombinedAtJD,
    0.001
  );
}

/**
 * Calculate complete Yoga information for a given time.
 *
 * @param julianDay - Julian Day Number
 * @param timezone - Timezone for formatting times
 * @returns Complete YogaInfo object
 */
export function calculateYoga(julianDay: number, timezone: string): YogaInfo {
  // Get current Sun and Moon positions
  const { sun, moon } = getSunMoonPositions(julianDay);

  // Calculate combined longitude and yoga index
  const combined = getCombinedLongitude(sun, moon);
  const yogaIndex = getYogaIndex(sun, moon);

  // Get yoga configuration
  const yogaConfig = getYogaConfig(yogaIndex);
  if (!yogaConfig) {
    throw new Error(`Invalid yoga index: ${yogaIndex}`);
  }

  // Find when this yoga ends
  const endJD = findYogaEndTime(julianDay, yogaIndex);
  const endDateTime = julianDayToDateTime(endJD, timezone);

  return {
    index: yogaIndex,
    name: yogaConfig.name,
    endTime: formatTime(endDateTime),
  };
}

/**
 * Get yoga at sunrise.
 */
export function getYogaAtSunrise(sunriseJD: number, timezone: string): YogaInfo {
  return calculateYoga(sunriseJD, timezone);
}
