/**
 * Karana Configuration
 *
 * A Karana is half of a Tithi, spanning 6° of Moon-Sun separation.
 * There are 11 Karanas: 7 movable (repeating) and 4 fixed.
 * The 7 movable karanas repeat 8 times in a lunar month.
 * The 4 fixed karanas occur only once at specific positions.
 */

import { KaranaConfig } from '../types/panchangam.js';

// Karana span: half of tithi = 6 degrees
export const KARANA_SPAN = 6;

/**
 * Fixed Karanas (occur once per lunar month at specific positions)
 * - Shakuni: Second half of Krishna Chaturdashi (29th tithi)
 * - Chatushpada: First half of Amavasya (30th tithi)
 * - Naga: Second half of Amavasya (30th tithi)
 * - Kimstughna: First half of Shukla Pratipada (1st tithi)
 */
export const FIXED_KARANAS: KaranaConfig[] = [
  { index: 8,  name: { en: 'Shakuni',     ta: 'சகுனி' },      type: 'fixed' },
  { index: 9,  name: { en: 'Chatushpada', ta: 'சதுஷ்பாதம்' }, type: 'fixed' },
  { index: 10, name: { en: 'Naga',        ta: 'நாகம்' },      type: 'fixed' },
  { index: 11, name: { en: 'Kimstughna',  ta: 'கிம்ஸ்துக்னம்' }, type: 'fixed' },
];

/**
 * Movable Karanas (repeat 8 times per lunar month)
 * Order: Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti
 */
export const MOVABLE_KARANAS: KaranaConfig[] = [
  { index: 1, name: { en: 'Bava',    ta: 'பவ' },     type: 'movable' },
  { index: 2, name: { en: 'Balava',  ta: 'பாலவ' },   type: 'movable' },
  { index: 3, name: { en: 'Kaulava', ta: 'கௌலவ' },   type: 'movable' },
  { index: 4, name: { en: 'Taitila', ta: 'தைதுல' },  type: 'movable' },
  { index: 5, name: { en: 'Gara',    ta: 'கரஜை' },   type: 'movable' },
  { index: 6, name: { en: 'Vanija',  ta: 'வணிக்' },  type: 'movable' },
  { index: 7, name: { en: 'Vishti',  ta: 'பத்ரை' },  type: 'movable' }, // Also known as Bhadra
];

// All 11 karanas combined
export const KARANAS: KaranaConfig[] = [...MOVABLE_KARANAS, ...FIXED_KARANAS];

/**
 * Calculate karana from Sun and Moon longitudes.
 *
 * The 60 karanas (half-tithis) of a lunar month follow this pattern:
 * - Karana 1 (first half of Shukla Pratipada): Kimstughna (fixed)
 * - Karanas 2-57: Movable karanas cycling (Bava to Vishti, 8 cycles)
 * - Karana 58 (second half of Krishna Chaturdashi): Shakuni (fixed)
 * - Karana 59 (first half of Amavasya): Chatushpada (fixed)
 * - Karana 60 (second half of Amavasya): Naga (fixed)
 *
 * @param sunLongitude - Sun's sidereal longitude (0-360)
 * @param moonLongitude - Moon's sidereal longitude (0-360)
 * @returns Karana configuration
 */
export function getKaranaFromPositions(sunLongitude: number, moonLongitude: number): KaranaConfig {
  // Calculate Moon-Sun elongation
  let elongation = moonLongitude - sunLongitude;
  if (elongation < 0) {
    elongation += 360;
  }

  // Calculate karana number (1-60)
  const karanaNumber = Math.floor(elongation / KARANA_SPAN) + 1;

  return getKaranaByNumber(karanaNumber > 60 ? 60 : karanaNumber);
}

/**
 * Get karana configuration from karana number (1-60).
 * Maps the 60 karanas of a lunar month to the 11 unique karanas.
 */
export function getKaranaByNumber(karanaNumber: number): KaranaConfig {
  // Normalize to 1-60
  let num = ((karanaNumber - 1) % 60) + 1;

  // Fixed karanas at specific positions
  if (num === 1) {
    return FIXED_KARANAS[3]!; // Kimstughna
  }
  if (num === 58) {
    return FIXED_KARANAS[0]!; // Shakuni
  }
  if (num === 59) {
    return FIXED_KARANAS[1]!; // Chatushpada
  }
  if (num === 60) {
    return FIXED_KARANAS[2]!; // Naga
  }

  // Movable karanas (positions 2-57, cycling through 7 karanas)
  // Position 2 starts with Bava (index 0)
  const movableIndex = (num - 2) % 7;
  return MOVABLE_KARANAS[movableIndex]!;
}

/**
 * Get karana configuration by index (1-11).
 */
export function getKaranaConfig(index: number): KaranaConfig | undefined {
  return KARANAS.find(k => k.index === index);
}
