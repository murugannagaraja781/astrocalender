/**
 * Muhurta Calculator
 *
 * Calculates auspicious and inauspicious time periods:
 * - Rahu Kalam: Inauspicious period ruled by Rahu
 * - Yama Gandam: Inauspicious period ruled by Yama (death)
 * - Kuligai: Inauspicious period ruled by Gulika
 * - Gowri Neram: Auspicious/inauspicious periods based on Gowri Panchangam
 * - Nalla Neram: Generally auspicious times
 *
 * These are calculated by dividing the day into 8 equal segments.
 */

import {
  InauspiciousPeriods,
  AuspiciousPeriods,
  TimePeriod,
  GowriPeriod,
  BilingualText
} from '../types/panchangam.js';
import { julianDayToDateTime, formatTimeShort, getDayOfWeek } from '../utils/datetime.js';
import { DateTime, Duration } from 'luxon';

/**
 * Rahu Kalam segment positions by day of week.
 * Day starts from sunrise, divided into 8 segments.
 * Value indicates which segment (1-8) is Rahu Kalam.
 *
 * Sunday=0, Monday=1, ... Saturday=6
 */
const RAHU_KALAM_SEGMENTS: Record<number, number> = {
  0: 8,  // Sunday: Last segment
  1: 2,  // Monday: 2nd segment
  2: 7,  // Tuesday: 7th segment
  3: 5,  // Wednesday: 5th segment
  4: 6,  // Thursday: 6th segment
  5: 4,  // Friday: 4th segment
  6: 3,  // Saturday: 3rd segment
};

/**
 * Yama Gandam segment positions by day of week.
 */
const YAMA_GANDAM_SEGMENTS: Record<number, number> = {
  0: 5,  // Sunday: 5th segment
  1: 4,  // Monday: 4th segment
  2: 3,  // Tuesday: 3rd segment
  3: 2,  // Wednesday: 2nd segment
  4: 1,  // Thursday: 1st segment
  5: 7,  // Friday: 7th segment
  6: 6,  // Saturday: 6th segment
};

/**
 * Kuligai (Gulika Kalam) segment positions by day of week.
 */
const KULIGAI_SEGMENTS: Record<number, number> = {
  0: 7,  // Sunday: 7th segment
  1: 6,  // Monday: 6th segment
  2: 5,  // Tuesday: 5th segment
  3: 4,  // Wednesday: 4th segment
  4: 3,  // Thursday: 3rd segment
  5: 2,  // Friday: 2nd segment
  6: 1,  // Saturday: 1st segment
};

/**
 * Gowri Panchangam - Good and Bad periods by day of week.
 * Each day is divided into 8 periods during day and 8 during night.
 * This is the daytime pattern (segment numbers that are good).
 */
const GOWRI_GOOD_SEGMENTS: Record<number, number[]> = {
  0: [1, 2, 5, 6],      // Sunday
  1: [3, 4, 7, 8],      // Monday
  2: [1, 2, 5, 6],      // Tuesday
  3: [3, 4, 7, 8],      // Wednesday
  4: [1, 2, 5, 6],      // Thursday
  5: [3, 4, 7, 8],      // Friday
  6: [1, 2, 5, 6],      // Saturday
};

/**
 * Gowri period names (8 periods per day).
 */
const GOWRI_NAMES: BilingualText[] = [
  { en: 'Uthira', ta: 'உத்திரம்' },
  { en: 'Chandra', ta: 'சந்திரன்' },
  { en: 'Sani', ta: 'சனி' },
  { en: 'Budha', ta: 'புதன்' },
  { en: 'Guru', ta: 'குரு' },
  { en: 'Ravi', ta: 'ரவி' },
  { en: 'Sukra', ta: 'சுக்கிரன்' },
  { en: 'Kuja', ta: 'செவ்வாய்' },
];

/**
 * Calculate a specific time segment from day duration.
 *
 * @param sunriseTime - DateTime of sunrise
 * @param sunsetTime - DateTime of sunset
 * @param segment - Segment number (1-8)
 * @returns TimePeriod with start and end times
 */
function getTimeSegment(
  sunriseTime: DateTime,
  sunsetTime: DateTime,
  segment: number
): TimePeriod {
  const dayDuration = sunsetTime.diff(sunriseTime).as('milliseconds');
  const segmentDuration = dayDuration / 8;

  const startMs = segmentDuration * (segment - 1);
  const endMs = segmentDuration * segment;

  const startTime = sunriseTime.plus(Duration.fromMillis(startMs));
  const endTime = sunriseTime.plus(Duration.fromMillis(endMs));

  return {
    start: formatTimeShort(startTime),
    end: formatTimeShort(endTime),
  };
}

/**
 * Calculate all inauspicious periods for a day.
 *
 * @param sunriseJD - Julian Day of sunrise
 * @param sunsetJD - Julian Day of sunset
 * @param dateStr - Date string (YYYY-MM-DD)
 * @param timezone - Timezone string
 * @returns InauspiciousPeriods object
 */
export function calculateInauspiciousPeriods(
  sunriseJD: number,
  sunsetJD: number,
  dateStr: string,
  timezone: string
): InauspiciousPeriods {
  const sunriseTime = julianDayToDateTime(sunriseJD, timezone);
  const sunsetTime = julianDayToDateTime(sunsetJD, timezone);

  // Get day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = getDayOfWeek(dateStr, timezone);

  // Calculate each inauspicious period
  const rahuKalam = getTimeSegment(
    sunriseTime,
    sunsetTime,
    RAHU_KALAM_SEGMENTS[dayOfWeek] ?? 1
  );

  const yamaGandam = getTimeSegment(
    sunriseTime,
    sunsetTime,
    YAMA_GANDAM_SEGMENTS[dayOfWeek] ?? 1
  );

  const kuligai = getTimeSegment(
    sunriseTime,
    sunsetTime,
    KULIGAI_SEGMENTS[dayOfWeek] ?? 1
  );

  return {
    rahuKalam,
    yamaGandam,
    kuligai,
  };
}

/**
 * Calculate auspicious periods (Gowri Neram and Nalla Neram).
 *
 * @param sunriseJD - Julian Day of sunrise
 * @param sunsetJD - Julian Day of sunset
 * @param dateStr - Date string (YYYY-MM-DD)
 * @param timezone - Timezone string
 * @returns AuspiciousPeriods object
 */
export function calculateAuspiciousPeriods(
  sunriseJD: number,
  sunsetJD: number,
  dateStr: string,
  timezone: string
): AuspiciousPeriods {
  const sunriseTime = julianDayToDateTime(sunriseJD, timezone);
  const sunsetTime = julianDayToDateTime(sunsetJD, timezone);
  const dayOfWeek = getDayOfWeek(dateStr, timezone);

  // Calculate Gowri Neram (8 periods with good/bad classification)
  const gowriNeram: GowriPeriod[] = [];
  const goodSegments = GOWRI_GOOD_SEGMENTS[dayOfWeek] ?? [];

  for (let segment = 1; segment <= 8; segment++) {
    const period = getTimeSegment(sunriseTime, sunsetTime, segment);
    const isGood = goodSegments.includes(segment);
    const nameIndex = (segment - 1 + dayOfWeek) % 8;

    gowriNeram.push({
      ...period,
      type: isGood ? 'good' : 'bad',
      name: GOWRI_NAMES[nameIndex]!,
    });
  }

  // Nalla Neram: Filter to only good periods
  const nallaNeram: TimePeriod[] = gowriNeram
    .filter(g => g.type === 'good')
    .map(({ start, end }) => ({ start, end }));

  return {
    gowriNeram,
    nallaNeram,
  };
}
