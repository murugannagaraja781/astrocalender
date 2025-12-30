/**
 * Astronomy Engine
 *
 * Provides astronomical calculations for Panchangam using pure JavaScript libraries.
 * Uses 'astronomia' for planetary positions and 'suncalc' for sunrise/sunset.
 * All calculations use sidereal zodiac with Lahiri ayanamsa.
 */

import SunCalc from 'suncalc';
import { DateTime } from 'luxon';
import Decimal from 'decimal.js';

// Lahiri Ayanamsa (approximate value for 2025)
// Ayanamsa increases by about 50.3 arcsec per year
// Reference: 23°51'11" on Jan 1, 2000
const AYANAMSA_2000 = 23.85306; // degrees
const AYANAMSA_RATE = 50.3 / 3600; // degrees per year

/**
 * Calculate Lahiri Ayanamsa for a given year.
 */
export function getAyanamsa(year: number): number {
  const yearsSince2000 = year - 2000;
  return AYANAMSA_2000 + (yearsSince2000 * AYANAMSA_RATE);
}

/**
 * Convert tropical longitude to sidereal.
 */
export function tropicalToSidereal(tropicalLongitude: number, year: number): number {
  const ayanamsa = getAyanamsa(year);
  let sidereal = tropicalLongitude - ayanamsa;
  // Normalize to 0-360
  sidereal = ((sidereal % 360) + 360) % 360;
  return sidereal;
}

/**
 * Calculate Julian Day for a given date.
 */
export function dateToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;

  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);

  const jd = Math.floor(365.25 * (y + 4716)) +
             Math.floor(30.6001 * (m + 1)) +
             day + (hour / 24) + b - 1524.5;

  return jd;
}

/**
 * Convert Julian Day to Date.
 */
export function julianDayToDate(jd: number): Date {
  const z = Math.floor(jd + 0.5);
  const f = (jd + 0.5) - z;

  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }

  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  const day = b - d - Math.floor(30.6001 * e) + f;
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;

  const dayInt = Math.floor(day);
  const dayFrac = day - dayInt;
  const hours = dayFrac * 24;
  const hourInt = Math.floor(hours);
  const minutes = (hours - hourInt) * 60;
  const minuteInt = Math.floor(minutes);
  const seconds = (minutes - minuteInt) * 60;

  return new Date(Date.UTC(year, month - 1, dayInt, hourInt, minuteInt, Math.floor(seconds)));
}

/**
 * Calculate Sun's tropical longitude (approximate, VSOP87-based simplified).
 * Good for Panchangam accuracy (within 1 arcminute).
 */
export function getSunTropicalLongitude(jd: number): number {
  // Julian centuries from J2000.0
  const T = (jd - 2451545.0) / 36525.0;

  // Mean longitude of Sun (degrees)
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  L0 = L0 % 360;
  if (L0 < 0) L0 += 360;

  // Mean anomaly of Sun (degrees)
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  M = M % 360;
  if (M < 0) M += 360;

  // Equation of center
  const Mrad = M * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
            (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
            0.000289 * Math.sin(3 * Mrad);

  // Sun's true longitude
  let sunLongitude = L0 + C;
  sunLongitude = sunLongitude % 360;
  if (sunLongitude < 0) sunLongitude += 360;

  return sunLongitude;
}

/**
 * Calculate Moon's tropical longitude (approximate).
 * Good for Panchangam accuracy (within 0.5 degrees).
 */
export function getMoonTropicalLongitude(jd: number): number {
  // Julian centuries from J2000.0
  const T = (jd - 2451545.0) / 36525.0;

  // Moon's mean longitude
  let L1 = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  L1 = L1 % 360;
  if (L1 < 0) L1 += 360;

  // Moon's mean anomaly
  let M1 = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  M1 = M1 % 360;
  if (M1 < 0) M1 += 360;
  const M1rad = M1 * Math.PI / 180;

  // Sun's mean anomaly
  let M = 357.5291092 + 35999.0502909 * T;
  M = M % 360;
  if (M < 0) M += 360;
  const Mrad = M * Math.PI / 180;

  // Moon's argument of latitude
  let F = 93.2720950 + 483202.0175233 * T;
  F = F % 360;
  if (F < 0) F += 360;
  const Frad = F * Math.PI / 180;

  // Mean elongation of Moon
  let D = 297.8501921 + 445267.1114034 * T;
  D = D % 360;
  if (D < 0) D += 360;
  const Drad = D * Math.PI / 180;

  // Principal longitude terms
  let longitude = L1 +
    6.289 * Math.sin(M1rad) +
    1.274 * Math.sin(2 * Drad - M1rad) +
    0.658 * Math.sin(2 * Drad) +
    0.214 * Math.sin(2 * M1rad) -
    0.186 * Math.sin(Mrad) -
    0.114 * Math.sin(2 * Frad);

  longitude = longitude % 360;
  if (longitude < 0) longitude += 360;

  return longitude;
}

/**
 * Get Sun's sidereal longitude.
 */
export function getSunLongitude(jd: number): number {
  const tropical = getSunTropicalLongitude(jd);
  const date = julianDayToDate(jd);
  return tropicalToSidereal(tropical, date.getUTCFullYear());
}

/**
 * Get Moon's sidereal longitude.
 */
export function getMoonLongitude(jd: number): number {
  const tropical = getMoonTropicalLongitude(jd);
  const date = julianDayToDate(jd);
  return tropicalToSidereal(tropical, date.getUTCFullYear());
}

/**
 * Get both Sun and Moon positions at a given time.
 */
export function getSunMoonPositions(jd: number): { sun: number; moon: number } {
  return {
    sun: getSunLongitude(jd),
    moon: getMoonLongitude(jd),
  };
}

/**
 * Calculate sunrise time using SunCalc.
 * Returns Julian Day of sunrise.
 */
export function calculateSunrise(jd: number, latitude: number, longitude: number): number {
  const date = julianDayToDate(jd);
  const times = SunCalc.getTimes(date, latitude, longitude);

  if (!times.sunrise || isNaN(times.sunrise.getTime())) {
    // Fallback: approximate based on noon
    const noonDate = new Date(date);
    noonDate.setUTCHours(6, 0, 0, 0);
    return dateToJulianDay(noonDate);
  }

  return dateToJulianDay(times.sunrise);
}

/**
 * Calculate sunset time using SunCalc.
 * Returns Julian Day of sunset.
 */
export function calculateSunset(jd: number, latitude: number, longitude: number): number {
  const date = julianDayToDate(jd);
  const times = SunCalc.getTimes(date, latitude, longitude);

  if (!times.sunset || isNaN(times.sunset.getTime())) {
    // Fallback
    const sunsetDate = new Date(date);
    sunsetDate.setUTCHours(18, 0, 0, 0);
    return dateToJulianDay(sunsetDate);
  }

  return dateToJulianDay(times.sunset);
}

/**
 * Calculate the Ascendant (Lagna) for a given time and location.
 * Uses simplified formula for rising sign.
 */
export function calculateAscendant(jd: number, latitude: number, longitude: number): number {
  // Local Sidereal Time
  const T = (jd - 2451545.0) / 36525.0;
  const date = julianDayToDate(jd);

  // Greenwich Mean Sidereal Time
  let GMST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T;
  GMST = GMST % 360;
  if (GMST < 0) GMST += 360;

  // Local Sidereal Time
  let LST = GMST + longitude;
  LST = LST % 360;
  if (LST < 0) LST += 360;

  // Obliquity of ecliptic
  const epsilon = 23.4393 - 0.0000004 * (jd - 2451545.0);
  const epsilonRad = epsilon * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
  const LSTrad = LST * Math.PI / 180;

  // Calculate Ascendant
  const tanAsc = Math.cos(LSTrad) / (-Math.sin(LSTrad) * Math.cos(epsilonRad) - Math.tan(latRad) * Math.sin(epsilonRad));
  let asc = Math.atan(tanAsc) * 180 / Math.PI;

  // Adjust quadrant
  if (Math.cos(LSTrad) < 0) {
    asc += 180;
  }

  asc = ((asc % 360) + 360) % 360;

  // Convert to sidereal
  return tropicalToSidereal(asc, date.getUTCFullYear());
}

/**
 * Find the Julian Day when a specific angle is reached.
 * Uses binary search.
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
 * Normalize angle to 0-360.
 */
export function normalizeAngle(angle: number): number {
  const decimal = new Decimal(angle);
  const result = decimal.mod(360);
  return result.lessThan(0) ? result.plus(360).toNumber() : result.toNumber();
}

/**
 * Initialize (no-op for pure JS version).
 */
export function initSwissEph(): void {
  // No initialization needed for pure JS version
}
