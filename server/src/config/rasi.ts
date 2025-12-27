/**
 * Rasi (Zodiac Sign) Configuration
 *
 * The 12 Rasis divide the zodiac into 12 equal parts of 30° each.
 * Used for Moon Rasi calculation and Lagnam (ascendant) determination.
 */

import { RasiConfig, BilingualText } from '../types/panchangam.js';

// Each rasi spans 30 degrees
export const RASI_SPAN = 30;

// Planetary lords of rasis
const lords: Record<string, BilingualText> = {
  mars: { en: 'Mars', ta: 'செவ்வாய்' },
  venus: { en: 'Venus', ta: 'சுக்கிரன்' },
  mercury: { en: 'Mercury', ta: 'புதன்' },
  moon: { en: 'Moon', ta: 'சந்திரன்' },
  sun: { en: 'Sun', ta: 'சூரியன்' },
  jupiter: { en: 'Jupiter', ta: 'குரு' },
  saturn: { en: 'Saturn', ta: 'சனி' },
};

/**
 * Complete list of 12 Rasis (zodiac signs) with Tamil names and lords.
 */
export const RASIS: RasiConfig[] = [
  { index: 1,  name: { en: 'Mesha',    ta: 'மேஷம்' },    lord: lords.mars,    startDegree: 0 },    // Aries
  { index: 2,  name: { en: 'Vrishabha', ta: 'ரிஷபம்' },   lord: lords.venus,   startDegree: 30 },   // Taurus
  { index: 3,  name: { en: 'Mithuna',  ta: 'மிதுனம்' },   lord: lords.mercury, startDegree: 60 },   // Gemini
  { index: 4,  name: { en: 'Karka',    ta: 'கடகம்' },    lord: lords.moon,    startDegree: 90 },   // Cancer
  { index: 5,  name: { en: 'Simha',    ta: 'சிம்மம்' },   lord: lords.sun,     startDegree: 120 },  // Leo
  { index: 6,  name: { en: 'Kanya',    ta: 'கன்னி' },    lord: lords.mercury, startDegree: 150 },  // Virgo
  { index: 7,  name: { en: 'Tula',     ta: 'துலாம்' },   lord: lords.venus,   startDegree: 180 },  // Libra
  { index: 8,  name: { en: 'Vrischika', ta: 'விருச்சிகம்' }, lord: lords.mars,    startDegree: 210 },  // Scorpio
  { index: 9,  name: { en: 'Dhanu',    ta: 'தனுசு' },    lord: lords.jupiter, startDegree: 240 },  // Sagittarius
  { index: 10, name: { en: 'Makara',   ta: 'மகரம்' },    lord: lords.saturn,  startDegree: 270 },  // Capricorn
  { index: 11, name: { en: 'Kumbha',   ta: 'கும்பம்' },   lord: lords.saturn,  startDegree: 300 },  // Aquarius
  { index: 12, name: { en: 'Meena',    ta: 'மீனம்' },    lord: lords.jupiter, startDegree: 330 },  // Pisces
];

/**
 * Get rasi index from celestial longitude (sidereal).
 * @param longitude - Sidereal longitude (0-360)
 * @returns Rasi index (1-12)
 */
export function getRasiIndex(longitude: number): number {
  const normalized = ((longitude % 360) + 360) % 360;
  return Math.floor(normalized / RASI_SPAN) + 1;
}

/**
 * Get degree within rasi (0-30) from celestial longitude.
 * @param longitude - Sidereal longitude (0-360)
 * @returns Degree within sign (0-30)
 */
export function getDegreeInRasi(longitude: number): number {
  const normalized = ((longitude % 360) + 360) % 360;
  return normalized % RASI_SPAN;
}

/**
 * Get rasi configuration by index.
 */
export function getRasiConfig(index: number): RasiConfig | undefined {
  return RASIS.find(r => r.index === index);
}
