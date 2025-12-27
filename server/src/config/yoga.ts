/**
 * Yoga Configuration
 *
 * A Yoga is calculated from the combined motion of Sun and Moon.
 * Yoga = (Sun Longitude + Moon Longitude) / 13°20'
 * There are 27 Yogas, each spanning 13°20' of the combined longitude.
 */

import { YogaConfig } from '../types/panchangam.js';

// Yoga span: 360° / 27 = 13.333...°
export const YOGA_SPAN = 360 / 27;

/**
 * Complete list of 27 Yogas with Tamil names and nature.
 * Nature indicates general auspiciousness of the yoga.
 */
export const YOGAS: YogaConfig[] = [
  { index: 1,  name: { en: 'Vishkumbha',   ta: 'விஷ்கும்பம்' },   nature: 'inauspicious' },
  { index: 2,  name: { en: 'Priti',        ta: 'பிரீதி' },        nature: 'auspicious' },
  { index: 3,  name: { en: 'Ayushman',     ta: 'ஆயுஷ்மான்' },     nature: 'auspicious' },
  { index: 4,  name: { en: 'Saubhagya',    ta: 'சௌபாக்கியம்' },   nature: 'auspicious' },
  { index: 5,  name: { en: 'Shobhana',     ta: 'சோபனம்' },        nature: 'auspicious' },
  { index: 6,  name: { en: 'Atiganda',     ta: 'அதிகண்டம்' },     nature: 'inauspicious' },
  { index: 7,  name: { en: 'Sukarma',      ta: 'சுகர்மா' },       nature: 'auspicious' },
  { index: 8,  name: { en: 'Dhriti',       ta: 'திருதி' },        nature: 'auspicious' },
  { index: 9,  name: { en: 'Shula',        ta: 'சூலம்' },         nature: 'inauspicious' },
  { index: 10, name: { en: 'Ganda',        ta: 'கண்டம்' },        nature: 'inauspicious' },
  { index: 11, name: { en: 'Vriddhi',      ta: 'விருத்தி' },      nature: 'auspicious' },
  { index: 12, name: { en: 'Dhruva',       ta: 'த்ருவம்' },       nature: 'auspicious' },
  { index: 13, name: { en: 'Vyaghata',     ta: 'வியாகாதம்' },     nature: 'inauspicious' },
  { index: 14, name: { en: 'Harshana',     ta: 'ஹர்ஷணம்' },       nature: 'auspicious' },
  { index: 15, name: { en: 'Vajra',        ta: 'வஜ்ரம்' },        nature: 'inauspicious' },
  { index: 16, name: { en: 'Siddhi',       ta: 'சித்தி' },        nature: 'auspicious' },
  { index: 17, name: { en: 'Vyatipata',    ta: 'வியதீபாதம்' },    nature: 'inauspicious' },
  { index: 18, name: { en: 'Variyan',      ta: 'வரீயான்' },       nature: 'auspicious' },
  { index: 19, name: { en: 'Parigha',      ta: 'பரிகம்' },        nature: 'inauspicious' },
  { index: 20, name: { en: 'Shiva',        ta: 'சிவம்' },         nature: 'auspicious' },
  { index: 21, name: { en: 'Siddha',       ta: 'சித்தம்' },       nature: 'auspicious' },
  { index: 22, name: { en: 'Sadhya',       ta: 'சாத்தியம்' },     nature: 'auspicious' },
  { index: 23, name: { en: 'Shubha',       ta: 'சுபம்' },         nature: 'auspicious' },
  { index: 24, name: { en: 'Shukla',       ta: 'சுக்லம்' },       nature: 'auspicious' },
  { index: 25, name: { en: 'Brahma',       ta: 'பிரம்மம்' },      nature: 'auspicious' },
  { index: 26, name: { en: 'Indra',        ta: 'இந்திரம்' },      nature: 'auspicious' },
  { index: 27, name: { en: 'Vaidhriti',    ta: 'வைதிருதி' },      nature: 'inauspicious' },
];

/**
 * Calculate yoga index from Sun and Moon longitudes.
 * Yoga = (Sun + Moon) / 13°20'
 *
 * @param sunLongitude - Sun's sidereal longitude (0-360)
 * @param moonLongitude - Moon's sidereal longitude (0-360)
 * @returns Yoga index (1-27)
 */
export function getYogaIndex(sunLongitude: number, moonLongitude: number): number {
  // Sum of Sun and Moon longitudes
  let combined = sunLongitude + moonLongitude;

  // Normalize to 0-360
  combined = combined % 360;
  if (combined < 0) {
    combined += 360;
  }

  // Calculate yoga index
  const yogaIndex = Math.floor(combined / YOGA_SPAN) + 1;

  return yogaIndex > 27 ? 27 : yogaIndex;
}

/**
 * Get yoga configuration by index.
 */
export function getYogaConfig(index: number): YogaConfig | undefined {
  return YOGAS.find(y => y.index === index);
}
