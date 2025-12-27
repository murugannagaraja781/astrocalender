/**
 * Swiss Ephemeris Wrapper
 *
 * Provides high-level functions for astronomical calculations using Swiss Ephemeris.
 * All calculations use sidereal zodiac with Lahiri ayanamsa.
 *
 * Note: This module requires the Swiss Ephemeris data files (*.se1) to be present
 * in the ephe/ directory for accurate calculations beyond the built-in range.
 */

import sweph from 'sweph';
import path from 'path';
import { fileURLToPath } from 'url';
import Decimal from 'decimal.js';

// Get the directory path for ephemeris files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EPHE_PATH = path.resolve(__dirname, '../../ephe');

// Swiss Ephemeris constants
const SE_SUN = 0;
const SE_MOON = 1;
const SE_MERCURY = 2;
const SE_VENUS = 3;
const SE_MARS = 4;
const SE_JUPITER = 5;
const SE_SATURN = 6;
const SE_URANUS = 7;
const SE_NEPTUNE = 8;
const SE_PLUTO = 9;
const SE_MEAN_NODE = 10;  // Rahu
const SE_TRUE_NODE = 11;

// Calculation flags
const SEFLG_SIDEREAL = 64 * 1024;  // Sidereal zodiac
const SEFLG_SPEED = 256;           // Include speed in output

// Ayanamsa constants
const SE_SIDM_LAHIRI = 1;  // Lahiri (Chitrapaksha) ayanamsa

// Initialize flag
let isInitialized = false;

/**
 * Initialize Swiss Ephemeris with ephemeris path and Lahiri ayanamsa.
 */
export function initSwissEph(): void {
  if (isInitialized) return;

  try {
    // Set ephemeris path
    sweph.swe_set_ephe_path(EPHE_PATH);

    // Set sidereal mode with Lahiri ayanamsa
    sweph.swe_set_sid_mode(SE_SIDM_LAHIRI, 0, 0);

    isInitialized = true;
    console.log('Swiss Ephemeris initialized with Lahiri ayanamsa');
  } catch (error) {
    console.error('Failed to initialize Swiss Ephemeris:', error);
    throw error;
  }
}

/**
 * Get the sidereal longitude of a celestial body.
 *
 * @param julianDay - Julian Day Number
 * @param planet - Planet ID (SE_SUN, SE_MOON, etc.)
 * @returns Sidereal longitude in degrees (0-360)
 */
export function getPlanetLongitude(julianDay: number, planet: number): number {
  initSwissEph();

  const flags = SEFLG_SIDEREAL | SEFLG_SPEED;
  const result = sweph.swe_calc_ut(julianDay, planet, flags);

  if (result.error) {
    throw new Error(`Swiss Ephemeris calculation error: ${result.error}`);
  }

  // result.data[0] is the longitude
  let longitude = result.data[0];

  // Normalize to 0-360
  longitude = ((longitude % 360) + 360) % 360;

  return longitude;
}

/**
 * Get Sun's sidereal longitude.
 */
export function getSunLongitude(julianDay: number): number {
  return getPlanetLongitude(julianDay, SE_SUN);
}

/**
 * Get Moon's sidereal longitude.
 */
export function getMoonLongitude(julianDay: number): number {
  return getPlanetLongitude(julianDay, SE_MOON);
}

/**
 * Get both Sun and Moon positions at a given time.
 */
export function getSunMoonPositions(julianDay: number): { sun: number; moon: number } {
  return {
    sun: getSunLongitude(julianDay),
    moon: getMoonLongitude(julianDay),
  };
}

/**
 * Calculate sunrise time for a given location and date.
 *
 * @param julianDay - Julian Day Number for the date (usually at midnight)
 * @param latitude - Geographic latitude
 * @param longitude - Geographic longitude
 * @returns Julian Day Number of sunrise
 */
export function calculateSunrise(
  julianDay: number,
  latitude: number,
  longitude: number
): number {
  initSwissEph();

  // SE_CALC_RISE = 1 for sunrise
  // SE_BIT_DISC_CENTER = 256 for center of disc
  const result = sweph.swe_rise_trans(
    julianDay,
    SE_SUN,
    '',           // Star name (empty for planets)
    0,            // Ephemeris flag
    1,            // rsmi: 1 = sunrise
    [longitude, latitude, 0], // Geographic position [lon, lat, altitude]
    0,            // Atmospheric pressure (use default)
    0,            // Temperature (use default)
  );

  if (result.error) {
    throw new Error(`Sunrise calculation error: ${result.error}`);
  }

  return result.data;
}

/**
 * Calculate sunset time for a given location and date.
 */
export function calculateSunset(
  julianDay: number,
  latitude: number,
  longitude: number
): number {
  initSwissEph();

  // SE_CALC_SET = 2 for sunset
  const result = sweph.swe_rise_trans(
    julianDay,
    SE_SUN,
    '',
    0,
    2,            // rsmi: 2 = sunset
    [longitude, latitude, 0],
    0,
    0,
  );

  if (result.error) {
    throw new Error(`Sunset calculation error: ${result.error}`);
  }

  return result.data;
}

/**
 * Get Lahiri ayanamsa value for a given Julian Day.
 * Ayanamsa is the difference between tropical and sidereal zodiacs.
 */
export function getAyanamsa(julianDay: number): number {
  initSwissEph();
  return sweph.swe_get_ayanamsa_ut(julianDay);
}

/**
 * Calculate the Ascendant (Lagna) for a given time and location.
 *
 * @param julianDay - Julian Day Number
 * @param latitude - Geographic latitude
 * @param longitude - Geographic longitude
 * @returns Sidereal Ascendant in degrees (0-360)
 */
export function calculateAscendant(
  julianDay: number,
  latitude: number,
  longitude: number
): number {
  initSwissEph();

  const houses = sweph.swe_houses(julianDay, latitude, longitude, 'P'); // Placidus

  if (!houses || !houses.ascendant) {
    throw new Error('Ascendant calculation failed');
  }

  // Apply ayanamsa to get sidereal ascendant
  const ayanamsa = getAyanamsa(julianDay);
  let siderealAsc = houses.ascendant - ayanamsa;

  // Normalize to 0-360
  siderealAsc = ((siderealAsc % 360) + 360) % 360;

  return siderealAsc;
}

/**
 * Find the Julian Day when a specific angle is reached.
 * Used for finding tithi/nakshatra change times.
 *
 * Uses binary search to find the moment when the target condition is met.
 *
 * @param startJD - Starting Julian Day
 * @param endJD - Ending Julian Day
 * @param targetAngle - Target angle in degrees
 * @param getAngle - Function that returns the current angle for a given JD
 * @param tolerance - Precision in degrees (default: 0.001)
 * @returns Julian Day when target angle is reached
 */
export function findAngleCrossing(
  startJD: number,
  endJD: number,
  targetAngle: number,
  getAngle: (jd: number) => number,
  tolerance: number = 0.001
): number {
  const maxIterations = 50;
  let low = startJD;
  let high = endJD;

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2;
    const currentAngle = getAngle(mid);

    // Handle wraparound at 0/360 degrees
    let diff = currentAngle - targetAngle;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    if (Math.abs(diff) < tolerance) {
      return mid;
    }

    // Determine which half contains the target
    const lowAngle = getAngle(low);
    let lowDiff = lowAngle - targetAngle;
    if (lowDiff > 180) lowDiff -= 360;
    if (lowDiff < -180) lowDiff += 360;

    if (lowDiff * diff < 0) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return (low + high) / 2;
}

/**
 * Precision-safe modulo for angles.
 */
export function normalizeAngle(angle: number): number {
  const decimal = new Decimal(angle);
  const result = decimal.mod(360);
  return result.lessThan(0) ? result.plus(360).toNumber() : result.toNumber();
}
