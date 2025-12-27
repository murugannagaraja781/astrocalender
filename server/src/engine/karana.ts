/**
 * Karana Calculator
 *
 * Calculates the current Karana from Sun and Moon positions.
 * Karana is half of a Tithi, spanning 6° of Moon-Sun elongation.
 * There are 11 Karanas: 7 movable (repeating) and 4 fixed.
 */

import { KaranaInfo } from '../types/panchangam.js';
import { getSunMoonPositions, findAngleCrossing } from './swisseph.js';
import { KARANA_SPAN, getKaranaFromPositions, getKaranaByNumber, MOVABLE_KARANAS, FIXED_KARANAS } from '../config/karana.js';
import { julianDayToDateTime, formatTime } from '../utils/datetime.js';

/**
 * Get the Moon-Sun elongation for a given Julian Day.
 */
function getElongation(jd: number): number {
  const { sun, moon } = getSunMoonPositions(jd);
  let elongation = moon - sun;
  if (elongation < 0) {
    elongation += 360;
  }
  return elongation;
}

/**
 * Get the karana number (1-60) from elongation.
 */
function getKaranaNumber(elongation: number): number {
  return Math.floor(elongation / KARANA_SPAN) + 1;
}

/**
 * Find the end time of the current karana.
 * Each karana spans 6° of elongation.
 *
 * @param currentJD - Current Julian Day
 * @param currentKaranaNumber - Current karana number (1-60)
 * @returns Julian Day when karana ends
 */
export function findKaranaEndTime(
  currentJD: number,
  currentKaranaNumber: number
): number {
  // The next karana starts at this elongation
  const nextKaranaElongation = (currentKaranaNumber * KARANA_SPAN) % 360;

  // Each karana lasts about 12 hours
  const searchEndJD = currentJD + 1;

  return findAngleCrossing(
    currentJD,
    searchEndJD,
    nextKaranaElongation,
    getElongation,
    0.001
  );
}

/**
 * Calculate complete Karana information for a given time.
 *
 * @param julianDay - Julian Day Number
 * @param timezone - Timezone for formatting times
 * @returns Complete KaranaInfo object
 */
export function calculateKarana(julianDay: number, timezone: string): KaranaInfo {
  // Get current Sun and Moon positions
  const { sun, moon } = getSunMoonPositions(julianDay);

  // Get the karana from positions
  const karanaConfig = getKaranaFromPositions(sun, moon);

  // Calculate the karana number for end time calculation
  const elongation = getElongation(julianDay);
  const karanaNumber = getKaranaNumber(elongation);

  // Find when this karana ends
  const endJD = findKaranaEndTime(julianDay, karanaNumber);
  const endDateTime = julianDayToDateTime(endJD, timezone);

  // Get next karana
  const nextKaranaNumber = karanaNumber >= 60 ? 1 : karanaNumber + 1;
  const nextKaranaConfig = getKaranaByNumber(nextKaranaNumber);

  return {
    index: karanaConfig.index,
    name: karanaConfig.name,
    endTime: formatTime(endDateTime),
    nextKarana: nextKaranaConfig.name,
  };
}

/**
 * Get karana at sunrise.
 */
export function getKaranaAtSunrise(sunriseJD: number, timezone: string): KaranaInfo {
  return calculateKarana(sunriseJD, timezone);
}
