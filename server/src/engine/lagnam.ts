/**
 * Lagnam (Ascendant) Calculator
 *
 * Calculates the rising sign (Lagna) throughout the day.
 * Each rasi (zodiac sign) rises for approximately 2 hours.
 * The exact duration varies based on latitude and time of year.
 */

import { LagnamInfo, BilingualText } from '../types/panchangam.js';
import { calculateAscendant, getSunLongitude } from './swisseph.js';
import { getRasiIndex, getRasiConfig, RASI_SPAN, RASIS } from '../config/rasi.js';
import { julianDayToDateTime, formatTimeShort, divideTimeRange, createDateTime } from '../utils/datetime.js';
import { DateTime } from 'luxon';

/**
 * Calculate all Lagnam (ascendant) changes for a day.
 * Returns the time periods for each rasi rising.
 *
 * @param sunriseJD - Julian Day of sunrise
 * @param sunsetJD - Julian Day of sunset
 * @param latitude - Geographic latitude
 * @param longitude - Geographic longitude
 * @param timezone - Timezone string
 * @returns Array of LagnamInfo showing when each rasi rises
 */
export function calculateDayLagnams(
  sunriseJD: number,
  sunsetJD: number,
  latitude: number,
  longitude: number,
  timezone: string
): LagnamInfo[] {
  const lagnams: LagnamInfo[] = [];

  // We need to calculate lagnams for the full 24-hour period
  // Starting from sunrise of today to sunrise of next day
  const fullDayEndJD = sunriseJD + 1;

  // Sample ascendant positions throughout the day
  // Use smaller increments for accuracy (every 10 minutes = 1/144 of a day)
  const timeStep = 1 / 144;

  let prevRasiIndex = -1;
  let periodStart = sunriseJD;
  let periodStartTime: DateTime | null = null;

  for (let jd = sunriseJD; jd <= fullDayEndJD; jd += timeStep) {
    try {
      const ascendant = calculateAscendant(jd, latitude, longitude);
      const rasiIndex = getRasiIndex(ascendant);

      if (prevRasiIndex !== -1 && rasiIndex !== prevRasiIndex) {
        // Rasi has changed, record the previous period
        const rasiConfig = getRasiConfig(prevRasiIndex);
        if (rasiConfig && periodStartTime) {
          const periodEndTime = julianDayToDateTime(jd, timezone);
          lagnams.push({
            index: prevRasiIndex,
            rasi: rasiConfig.name,
            start: formatTimeShort(periodStartTime),
            end: formatTimeShort(periodEndTime),
          });
        }
        periodStart = jd;
        periodStartTime = julianDayToDateTime(jd, timezone);
      }

      if (prevRasiIndex === -1) {
        periodStartTime = julianDayToDateTime(jd, timezone);
      }

      prevRasiIndex = rasiIndex;
    } catch (error) {
      // Skip errors in ascendant calculation
      continue;
    }
  }

  // Add the last period
  if (prevRasiIndex !== -1 && periodStartTime) {
    const rasiConfig = getRasiConfig(prevRasiIndex);
    if (rasiConfig) {
      const endTime = julianDayToDateTime(fullDayEndJD, timezone);
      lagnams.push({
        index: prevRasiIndex,
        rasi: rasiConfig.name,
        start: formatTimeShort(periodStartTime),
        end: formatTimeShort(endTime),
      });
    }
  }

  return lagnams;
}

/**
 * Get the current Lagnam (ascendant) for a specific moment.
 *
 * @param julianDay - Julian Day Number
 * @param latitude - Geographic latitude
 * @param longitude - Geographic longitude
 * @returns Rasi index and name
 */
export function getCurrentLagnam(
  julianDay: number,
  latitude: number,
  longitude: number
): { index: number; name: BilingualText } {
  const ascendant = calculateAscendant(julianDay, latitude, longitude);
  const rasiIndex = getRasiIndex(ascendant);
  const rasiConfig = getRasiConfig(rasiIndex);

  if (!rasiConfig) {
    throw new Error(`Invalid rasi index: ${rasiIndex}`);
  }

  return {
    index: rasiIndex,
    name: rasiConfig.name,
  };
}
