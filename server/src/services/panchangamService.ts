/**
 * Panchangam Service
 *
 * Orchestrates all calculations to produce the complete Panchangam response.
 * This is the main service that coordinates all engine modules.
 */

import { PanchangamRequest, PanchangamResponse, TamilCalendar } from '../types/panchangam.js';
import {
  initSwissEph,
  calculateSunrise,
  calculateSunset,
  getSunLongitude,
  getMoonLongitude,
  getSunMoonPositions
} from '../engine/swisseph.js';
import { calculateTithi } from '../engine/tithi.js';
import { calculateNakshatra } from '../engine/nakshatra.js';
import { calculateYoga } from '../engine/yoga.js';
import { calculateKarana } from '../engine/karana.js';
import { calculateMoonRasi } from '../engine/moonRasi.js';
import { calculateDayLagnams } from '../engine/lagnam.js';
import { calculateInauspiciousPeriods, calculateAuspiciousPeriods } from '../engine/muhurta.js';
import { calculateChandrashtama } from '../engine/chandrashtama.js';
import { getMatchingFestivals } from '../engine/festivals.js';
import { getTamilMonth, getTamilDay, getTamilYear } from '../config/tamilCalendar.js';
import { dateToJulianDay, julianDayToDateTime, formatTime, getStartOfDay } from '../utils/datetime.js';

/**
 * Calculate complete Panchangam for a given date and location.
 *
 * @param request - Input parameters (date, location, timezone, optional birthNakshatra)
 * @returns Complete PanchangamResponse
 */
export async function calculatePanchangam(request: PanchangamRequest): Promise<PanchangamResponse> {
  // Initialize Swiss Ephemeris
  initSwissEph();

  const { date, latitude, longitude, timezone, birthNakshatra } = request;

  // Get Julian Day for the date (at local noon)
  const startOfDayJD = dateToJulianDay(date, timezone);

  // Calculate sunrise and sunset
  const sunriseJD = calculateSunrise(startOfDayJD, latitude, longitude);
  const sunsetJD = calculateSunset(startOfDayJD, latitude, longitude);

  // Get Sun position for Tamil calendar
  const sunLongitude = getSunLongitude(sunriseJD);

  // Calculate Tamil calendar
  const tamilMonth = getTamilMonth(sunLongitude);
  const tamilDay = getTamilDay(sunLongitude);
  const gregorianYear = parseInt(date.split('-')[0] ?? '2025', 10);
  const tamilYear = getTamilYear(gregorianYear);

  const tamilCalendar: TamilCalendar = {
    month: tamilMonth.name,
    day: tamilDay,
    year: tamilYear,
  };

  // Calculate core Panchangam elements at sunrise
  const tithi = calculateTithi(sunriseJD, timezone);
  const nakshatra = calculateNakshatra(sunriseJD, timezone);
  const yoga = calculateYoga(sunriseJD, timezone);
  const karana = calculateKarana(sunriseJD, timezone);
  const moonRasi = calculateMoonRasi(sunriseJD);

  // Calculate Lagnam periods for the day
  const lagnam = calculateDayLagnams(sunriseJD, sunsetJD, latitude, longitude, timezone);

  // Calculate inauspicious and auspicious periods
  const inauspiciousPeriods = calculateInauspiciousPeriods(sunriseJD, sunsetJD, date, timezone);
  const auspiciousPeriods = calculateAuspiciousPeriods(sunriseJD, sunsetJD, date, timezone);

  // Get matching festivals
  const festivals = getMatchingFestivals(date, tithi, nakshatra, sunLongitude);

  // Calculate Chandrashtama if birthNakshatra is provided
  const chandrashtama = birthNakshatra
    ? calculateChandrashtama(sunriseJD, birthNakshatra, timezone)
    : null;

  // Format sunrise and sunset times
  const sunriseTime = julianDayToDateTime(sunriseJD, timezone);
  const sunsetTime = julianDayToDateTime(sunsetJD, timezone);

  return {
    date,
    location: {
      latitude,
      longitude,
      timezone,
    },
    tamilCalendar,
    sunrise: formatTime(sunriseTime),
    sunset: formatTime(sunsetTime),
    tithi,
    nakshatra,
    yoga,
    karana,
    moonRasi,
    lagnam,
    inauspiciousPeriods,
    auspiciousPeriods,
    festivals,
    chandrashtama,
  };
}
