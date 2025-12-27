/**
 * Nakshatra (Lunar Mansion) Configuration
 *
 * The 27 Nakshatras divide the zodiac into 27 equal parts of 13°20' each.
 * Each Nakshatra has a ruling planet (lord) and is associated with specific qualities.
 */

import { NakshatraConfig, BilingualText } from '../types/panchangam.js';

// Nakshatra span in degrees: 360° / 27 = 13.333...°
export const NAKSHATRA_SPAN = 360 / 27;  // 13.333... degrees

// Lords of the Nakshatras (Vimshottari Dasha order)
const lords: Record<string, BilingualText> = {
  ketu: { en: 'Ketu', ta: 'கேது' },
  venus: { en: 'Venus', ta: 'சுக்கிரன்' },
  sun: { en: 'Sun', ta: 'சூரியன்' },
  moon: { en: 'Moon', ta: 'சந்திரன்' },
  mars: { en: 'Mars', ta: 'செவ்வாய்' },
  rahu: { en: 'Rahu', ta: 'ராகு' },
  jupiter: { en: 'Jupiter', ta: 'குரு' },
  saturn: { en: 'Saturn', ta: 'சனி' },
  mercury: { en: 'Mercury', ta: 'புதன்' },
};

/**
 * Complete list of 27 Nakshatras with Tamil names and ruling planets.
 * Index is 1-based for traditional usage.
 */
export const NAKSHATRAS: NakshatraConfig[] = [
  { index: 1,  name: { en: 'Ashwini',          ta: 'அஸ்வினி' },          lord: lords.ketu,    startDegree: 0 },
  { index: 2,  name: { en: 'Bharani',          ta: 'பரணி' },            lord: lords.venus,   startDegree: 13.333333 },
  { index: 3,  name: { en: 'Krittika',         ta: 'கார்த்திகை' },       lord: lords.sun,     startDegree: 26.666667 },
  { index: 4,  name: { en: 'Rohini',           ta: 'ரோகிணி' },          lord: lords.moon,    startDegree: 40 },
  { index: 5,  name: { en: 'Mrigashira',       ta: 'மிருகசீரிடம்' },     lord: lords.mars,    startDegree: 53.333333 },
  { index: 6,  name: { en: 'Ardra',            ta: 'திருவாதிரை' },       lord: lords.rahu,    startDegree: 66.666667 },
  { index: 7,  name: { en: 'Punarvasu',        ta: 'புனர்பூசம்' },       lord: lords.jupiter, startDegree: 80 },
  { index: 8,  name: { en: 'Pushya',           ta: 'பூசம்' },            lord: lords.saturn,  startDegree: 93.333333 },
  { index: 9,  name: { en: 'Ashlesha',         ta: 'ஆயில்யம்' },         lord: lords.mercury, startDegree: 106.666667 },
  { index: 10, name: { en: 'Magha',            ta: 'மகம்' },             lord: lords.ketu,    startDegree: 120 },
  { index: 11, name: { en: 'Purva Phalguni',   ta: 'பூரம்' },            lord: lords.venus,   startDegree: 133.333333 },
  { index: 12, name: { en: 'Uttara Phalguni',  ta: 'உத்திரம்' },         lord: lords.sun,     startDegree: 146.666667 },
  { index: 13, name: { en: 'Hasta',            ta: 'ஹஸ்தம்' },          lord: lords.moon,    startDegree: 160 },
  { index: 14, name: { en: 'Chitra',           ta: 'சித்திரை' },         lord: lords.mars,    startDegree: 173.333333 },
  { index: 15, name: { en: 'Swati',            ta: 'சுவாதி' },           lord: lords.rahu,    startDegree: 186.666667 },
  { index: 16, name: { en: 'Vishakha',         ta: 'விசாகம்' },          lord: lords.jupiter, startDegree: 200 },
  { index: 17, name: { en: 'Anuradha',         ta: 'அனுஷம்' },          lord: lords.saturn,  startDegree: 213.333333 },
  { index: 18, name: { en: 'Jyeshtha',         ta: 'கேட்டை' },           lord: lords.mercury, startDegree: 226.666667 },
  { index: 19, name: { en: 'Moola',            ta: 'மூலம்' },            lord: lords.ketu,    startDegree: 240 },
  { index: 20, name: { en: 'Purva Ashadha',    ta: 'பூராடம்' },          lord: lords.venus,   startDegree: 253.333333 },
  { index: 21, name: { en: 'Uttara Ashadha',   ta: 'உத்திராடம்' },       lord: lords.sun,     startDegree: 266.666667 },
  { index: 22, name: { en: 'Shravana',         ta: 'திருவோணம்' },        lord: lords.moon,    startDegree: 280 },
  { index: 23, name: { en: 'Dhanishta',        ta: 'அவிட்டம்' },         lord: lords.mars,    startDegree: 293.333333 },
  { index: 24, name: { en: 'Shatabhisha',      ta: 'சதயம்' },            lord: lords.rahu,    startDegree: 306.666667 },
  { index: 25, name: { en: 'Purva Bhadrapada', ta: 'பூரட்டாதி' },        lord: lords.jupiter, startDegree: 320 },
  { index: 26, name: { en: 'Uttara Bhadrapada',ta: 'உத்திரட்டாதி' },     lord: lords.saturn,  startDegree: 333.333333 },
  { index: 27, name: { en: 'Revati',           ta: 'ரேவதி' },            lord: lords.mercury, startDegree: 346.666667 },
];

/**
 * Get nakshatra index from moon longitude (sidereal).
 * @param moonLongitude - Moon's sidereal longitude (0-360)
 * @returns Nakshatra index (1-27)
 */
export function getNakshatraIndex(moonLongitude: number): number {
  const normalized = ((moonLongitude % 360) + 360) % 360;
  return Math.floor(normalized / NAKSHATRA_SPAN) + 1;
}

/**
 * Get nakshatra pada (quarter) from moon longitude.
 * Each nakshatra has 4 padas, each spanning 3°20'.
 * @param moonLongitude - Moon's sidereal longitude (0-360)
 * @returns Pada (1-4)
 */
export function getNakshatraPada(moonLongitude: number): number {
  const normalized = ((moonLongitude % 360) + 360) % 360;
  const positionInNakshatra = normalized % NAKSHATRA_SPAN;
  const padaSpan = NAKSHATRA_SPAN / 4;  // 3.333... degrees
  return Math.floor(positionInNakshatra / padaSpan) + 1;
}

/**
 * Get nakshatra configuration by index.
 */
export function getNakshatraConfig(index: number): NakshatraConfig | undefined {
  return NAKSHATRAS.find(n => n.index === index);
}

/**
 * Get nakshatra configuration by English name.
 */
export function getNakshatraByName(name: string): NakshatraConfig | undefined {
  return NAKSHATRAS.find(n =>
    n.name.en.toLowerCase() === name.toLowerCase() ||
    n.name.ta === name
  );
}
