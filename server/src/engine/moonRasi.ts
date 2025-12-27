/**
 * Moon Rasi Calculator
 *
 * Calculates the Moon's current zodiac sign (Rasi).
 * This is important for Chandrashtamam and other Moon-based calculations.
 */

import { RasiInfo } from '../types/panchangam.js';
import { getMoonLongitude } from './swisseph.js';
import { getRasiIndex, getDegreeInRasi, getRasiConfig, RASIS } from '../config/rasi.js';

/**
 * Calculate Moon Rasi for a given Julian Day.
 *
 * @param julianDay - Julian Day Number
 * @returns RasiInfo with Moon's current sign and degree
 */
export function calculateMoonRasi(julianDay: number): RasiInfo {
  const moonLongitude = getMoonLongitude(julianDay);
  const rasiIndex = getRasiIndex(moonLongitude);
  const degreeInRasi = getDegreeInRasi(moonLongitude);

  const rasiConfig = getRasiConfig(rasiIndex);
  if (!rasiConfig) {
    throw new Error(`Invalid rasi index: ${rasiIndex}`);
  }

  return {
    index: rasiIndex,
    name: rasiConfig.name,
    degree: Math.round(degreeInRasi * 1000) / 1000, // Round to 3 decimal places
  };
}

/**
 * Get Moon Rasi at sunrise.
 */
export function getMoonRasiAtSunrise(sunriseJD: number): RasiInfo {
  return calculateMoonRasi(sunriseJD);
}
