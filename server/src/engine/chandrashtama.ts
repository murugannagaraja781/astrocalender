/**
 * Chandrashtama Calculator
 *
 * Chandrashtama (also called Ashtama Chandra) is an inauspicious period
 * when the transiting Moon is in the 8th sign from one's birth Moon sign.
 *
 * This occurs approximately every 27-28 days and lasts about 2.5 days.
 */

import { ChandrashtamaInfo, BilingualText } from '../types/panchangam.js';
import { getMoonLongitude, findAngleCrossing } from './swisseph.js';
import { getNakshatraByName, getNakshatraConfig, NAKSHATRA_SPAN, NAKSHATRAS } from '../config/nakshatra.js';
import { getRasiIndex, getRasiConfig, RASI_SPAN, RASIS } from '../config/rasi.js';
import { julianDayToDateTime, formatTimeShort } from '../utils/datetime.js';

/**
 * Calculate the birth Moon Rasi from birth Nakshatra.
 * Each nakshatra falls within a specific rasi.
 *
 * @param birthNakshatra - Birth nakshatra name (English or Tamil)
 * @returns Rasi index (1-12) or null if nakshatra not found
 */
export function getBirthMoonRasi(birthNakshatra: string): number | null {
  const nakshatra = getNakshatraByName(birthNakshatra);
  if (!nakshatra) {
    return null;
  }

  // The rasi is determined by the nakshatra's starting degree
  const rasiIndex = getRasiIndex(nakshatra.startDegree);
  return rasiIndex;
}

/**
 * Check if Chandrashtama is active for a given time.
 * Chandrashtama occurs when Moon transits the 8th sign from birth Moon sign.
 *
 * @param julianDay - Current Julian Day
 * @param birthMoonRasi - Birth Moon Rasi index (1-12)
 * @returns True if Chandrashtama is active
 */
export function isChandrashtamaActive(
  julianDay: number,
  birthMoonRasi: number
): boolean {
  const moonLongitude = getMoonLongitude(julianDay);
  const currentMoonRasi = getRasiIndex(moonLongitude);

  // 8th house from birth rasi
  const chandrashtamaRasi = ((birthMoonRasi - 1 + 7) % 12) + 1;

  return currentMoonRasi === chandrashtamaRasi;
}

/**
 * Calculate detailed Chandrashtama information.
 *
 * @param julianDay - Current Julian Day
 * @param birthNakshatra - Birth nakshatra name
 * @param timezone - Timezone for formatting
 * @returns ChandrashtamaInfo or null if not applicable
 */
export function calculateChandrashtama(
  julianDay: number,
  birthNakshatra: string,
  timezone: string
): ChandrashtamaInfo | null {
  // Get birth Moon rasi from nakshatra
  const birthMoonRasi = getBirthMoonRasi(birthNakshatra);
  if (!birthMoonRasi) {
    return null;  // Invalid nakshatra
  }

  // Calculate the 8th house (chandrashtama rasi)
  const chandrashtamaRasi = ((birthMoonRasi - 1 + 7) % 12) + 1;
  const chandrashtamaRasiConfig = getRasiConfig(chandrashtamaRasi);

  // Check if currently active
  const moonLongitude = getMoonLongitude(julianDay);
  const currentMoonRasi = getRasiIndex(moonLongitude);

  // Get birth nakshatra config for response
  const birthNakshatraConfig = getNakshatraByName(birthNakshatra);

  if (currentMoonRasi !== chandrashtamaRasi) {
    // Not currently in Chandrashtama
    return null;
  }

  // Find when Chandrashtama started and will end
  const chandrashtamaStart = chandrashtamaRasiConfig?.startDegree ?? 0;
  const chandrashtamaEnd = chandrashtamaStart + RASI_SPAN;

  // Find start time (when Moon entered this rasi)
  const startJD = findAngleCrossing(
    julianDay - 3,  // Search up to 3 days back
    julianDay,
    chandrashtamaStart,
    getMoonLongitude,
    0.01
  );

  // Find end time (when Moon will leave this rasi)
  const endJD = findAngleCrossing(
    julianDay,
    julianDay + 3,  // Search up to 3 days forward
    chandrashtamaEnd % 360,
    getMoonLongitude,
    0.01
  );

  const startTime = julianDayToDateTime(startJD, timezone);
  const endTime = julianDayToDateTime(endJD, timezone);

  return {
    isActive: true,
    startTime: formatTimeShort(startTime),
    endTime: formatTimeShort(endTime),
    birthNakshatra: birthNakshatraConfig?.name ?? { en: birthNakshatra, ta: birthNakshatra },
    currentMoonRasi: chandrashtamaRasiConfig?.name ?? { en: 'Unknown', ta: 'அறியாத' },
  };
}
