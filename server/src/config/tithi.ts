/**
 * Tithi (Lunar Day) Configuration
 *
 * A Tithi is the time taken for the Moon to gain 12° over the Sun.
 * There are 30 Tithis in a lunar month, split into two pakshas (fortnights):
 * - Shukla Paksha (waxing moon): Tithis 1-15 (Pratipada to Purnima)
 * - Krishna Paksha (waning moon): Tithis 1-15 (Pratipada to Amavasya)
 */

import { TithiConfig, BilingualText } from '../types/panchangam.js';

// Each tithi spans 12 degrees of Moon-Sun separation
export const TITHI_SPAN = 12;  // degrees

// Paksha names
export const PAKSHA: Record<string, BilingualText> = {
  shukla: { en: 'Shukla Paksha', ta: 'சுக்ல பக்ஷம்' },
  krishna: { en: 'Krishna Paksha', ta: 'கிருஷ்ண பக்ஷம்' },
};

/**
 * Complete list of 30 Tithis (15 for each paksha).
 * Index 1-15: Shukla Paksha
 * Index 16-30: Krishna Paksha
 */
export const TITHIS: TithiConfig[] = [
  // Shukla Paksha (Waxing Moon)
  { index: 1,  name: { en: 'Pratipada',   ta: 'பிரதமை' },     paksha: 'shukla' },
  { index: 2,  name: { en: 'Dwitiya',     ta: 'துவிதியை' },   paksha: 'shukla' },
  { index: 3,  name: { en: 'Tritiya',     ta: 'திருதியை' },   paksha: 'shukla' },
  { index: 4,  name: { en: 'Chaturthi',   ta: 'சதுர்த்தி' },   paksha: 'shukla' },
  { index: 5,  name: { en: 'Panchami',    ta: 'பஞ்சமி' },     paksha: 'shukla' },
  { index: 6,  name: { en: 'Shashti',     ta: 'சஷ்டி' },      paksha: 'shukla' },
  { index: 7,  name: { en: 'Saptami',     ta: 'சப்தமி' },     paksha: 'shukla' },
  { index: 8,  name: { en: 'Ashtami',     ta: 'அஷ்டமி' },     paksha: 'shukla' },
  { index: 9,  name: { en: 'Navami',      ta: 'நவமி' },       paksha: 'shukla' },
  { index: 10, name: { en: 'Dashami',     ta: 'தசமி' },       paksha: 'shukla' },
  { index: 11, name: { en: 'Ekadashi',    ta: 'ஏகாதசி' },     paksha: 'shukla' },
  { index: 12, name: { en: 'Dwadashi',    ta: 'துவாதசி' },    paksha: 'shukla' },
  { index: 13, name: { en: 'Trayodashi',  ta: 'திரயோதசி' },   paksha: 'shukla' },
  { index: 14, name: { en: 'Chaturdashi', ta: 'சதுர்தசி' },   paksha: 'shukla' },
  { index: 15, name: { en: 'Purnima',     ta: 'பூர்ணிமா' },   paksha: 'shukla' },

  // Krishna Paksha (Waning Moon)
  { index: 16, name: { en: 'Pratipada',   ta: 'பிரதமை' },     paksha: 'krishna' },
  { index: 17, name: { en: 'Dwitiya',     ta: 'துவிதியை' },   paksha: 'krishna' },
  { index: 18, name: { en: 'Tritiya',     ta: 'திருதியை' },   paksha: 'krishna' },
  { index: 19, name: { en: 'Chaturthi',   ta: 'சதுர்த்தி' },   paksha: 'krishna' },
  { index: 20, name: { en: 'Panchami',    ta: 'பஞ்சமி' },     paksha: 'krishna' },
  { index: 21, name: { en: 'Shashti',     ta: 'சஷ்டி' },      paksha: 'krishna' },
  { index: 22, name: { en: 'Saptami',     ta: 'சப்தமி' },     paksha: 'krishna' },
  { index: 23, name: { en: 'Ashtami',     ta: 'அஷ்டமி' },     paksha: 'krishna' },
  { index: 24, name: { en: 'Navami',      ta: 'நவமி' },       paksha: 'krishna' },
  { index: 25, name: { en: 'Dashami',     ta: 'தசமி' },       paksha: 'krishna' },
  { index: 26, name: { en: 'Ekadashi',    ta: 'ஏகாதசி' },     paksha: 'krishna' },
  { index: 27, name: { en: 'Dwadashi',    ta: 'துவாதசி' },    paksha: 'krishna' },
  { index: 28, name: { en: 'Trayodashi',  ta: 'திரயோதசி' },   paksha: 'krishna' },
  { index: 29, name: { en: 'Chaturdashi', ta: 'சதுர்தசி' },   paksha: 'krishna' },
  { index: 30, name: { en: 'Amavasya',    ta: 'அமாவாசை' },    paksha: 'krishna' },
];

/**
 * Calculate tithi index from Sun and Moon longitudes.
 * Tithi = (Moon - Sun) / 12°
 *
 * @param sunLongitude - Sun's sidereal longitude (0-360)
 * @param moonLongitude - Moon's sidereal longitude (0-360)
 * @returns Tithi index (1-30)
 */
export function getTithiIndex(sunLongitude: number, moonLongitude: number): number {
  // Calculate Moon-Sun elongation (angular distance)
  let elongation = moonLongitude - sunLongitude;

  // Normalize to 0-360
  if (elongation < 0) {
    elongation += 360;
  }

  // Calculate tithi index (each tithi is 12°)
  const tithiIndex = Math.floor(elongation / TITHI_SPAN) + 1;

  // Handle edge case: if exactly 360°, it's tithi 30
  return tithiIndex > 30 ? 30 : tithiIndex;
}

/**
 * Get tithi configuration by index.
 */
export function getTithiConfig(index: number): TithiConfig | undefined {
  return TITHIS.find(t => t.index === index);
}

/**
 * Get paksha (lunar fortnight) for a given tithi index.
 */
export function getPaksha(tithiIndex: number): BilingualText {
  return tithiIndex <= 15 ? PAKSHA.shukla : PAKSHA.krishna;
}
