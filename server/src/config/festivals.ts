/**
 * Festival Configuration
 *
 * Config-driven festival rules for Hindu, Christian, Muslim, and government holidays.
 * Hindu festivals are typically based on Tithi or Nakshatra.
 * Christian/Muslim/Government festivals are fixed dates.
 */

import { TithiBasedFestival, FixedDateFestival, NakshatraBasedFestival } from '../types/panchangam.js';

/**
 * Hindu festivals based on Tithi (lunar day).
 * These occur when specific Tithi falls in specific Tamil month.
 */
export const TITHI_BASED_FESTIVALS: TithiBasedFestival[] = [
  // Major festivals
  {
    name: { en: 'Vinayagar Chaturthi', ta: 'விநாயகர் சதுர்த்தி' },
    type: 'hindu',
    month: 5,  // Aavani
    tithi: 4,  // Chaturthi
    paksha: 'shukla'
  },
  {
    name: { en: 'Navratri Begins', ta: 'நவராத்திரி தொடக்கம்' },
    type: 'hindu',
    month: 6,  // Purattasi
    tithi: 1,  // Pratipada
    paksha: 'shukla'
  },
  {
    name: { en: 'Vijayadashami', ta: 'விஜயதசமி' },
    type: 'hindu',
    month: 6,  // Purattasi
    tithi: 10, // Dashami
    paksha: 'shukla'
  },
  {
    name: { en: 'Deepavali', ta: 'தீபாவளி' },
    type: 'hindu',
    month: 7,  // Aippasi
    tithi: 30, // Amavasya
    paksha: 'krishna'
  },
  {
    name: { en: 'Karthigai Deepam', ta: 'கார்த்திகை தீபம்' },
    type: 'hindu',
    month: 8,  // Karthigai
    tithi: 15, // Purnima
    paksha: 'shukla'
  },
  {
    name: { en: 'Maha Shivaratri', ta: 'மகா சிவராத்திரி' },
    type: 'hindu',
    month: 11, // Maasi
    tithi: 29, // Chaturdashi
    paksha: 'krishna'
  },
  {
    name: { en: 'Holi', ta: 'ஹோலி' },
    type: 'hindu',
    month: 12, // Panguni
    tithi: 15, // Purnima
    paksha: 'shukla'
  },
  {
    name: { en: 'Tamil New Year', ta: 'தமிழ் புத்தாண்டு' },
    type: 'hindu',
    month: 1,  // Chithirai
    tithi: 1,  // Any (first day of month)
    paksha: 'shukla'
  },
  {
    name: { en: 'Akshaya Tritiya', ta: 'அக்ஷய திருதியை' },
    type: 'hindu',
    month: 2,  // Vaikasi
    tithi: 3,  // Tritiya
    paksha: 'shukla'
  },
  // Monthly Ekadashi
  {
    name: { en: 'Ekadashi', ta: 'ஏகாதசி' },
    type: 'hindu',
    month: 0,  // 0 = all months
    tithi: 11, // Ekadashi
    paksha: 'shukla'
  },
  {
    name: { en: 'Ekadashi', ta: 'ஏகாதசி' },
    type: 'hindu',
    month: 0,
    tithi: 26, // Krishna Ekadashi (index 26)
    paksha: 'krishna'
  },
  // Amavasya observances
  {
    name: { en: 'Amavasya', ta: 'அமாவாசை' },
    type: 'hindu',
    month: 0,  // All months
    tithi: 30,
    paksha: 'krishna'
  },
  // Purnima observances
  {
    name: { en: 'Pournami', ta: 'பௌர்ணமி' },
    type: 'hindu',
    month: 0,
    tithi: 15,
    paksha: 'shukla'
  },
  {
    name: { en: 'Pradosham', ta: 'பிரதோஷம்' },
    type: 'hindu',
    month: 0,  // All months
    tithi: 13, // Trayodashi
    paksha: 'shukla'
  },
  {
    name: { en: 'Pradosham', ta: 'பிரதோஷம்' },
    type: 'hindu',
    month: 0,
    tithi: 28, // Krishna Trayodashi
    paksha: 'krishna'
  },
];

/**
 * Hindu festivals based on Nakshatra.
 */
export const NAKSHATRA_BASED_FESTIVALS: NakshatraBasedFestival[] = [
  {
    name: { en: 'Krishna Jayanthi', ta: 'கிருஷ்ண ஜெயந்தி' },
    type: 'hindu',
    month: 5,    // Aavani
    nakshatra: 4  // Rohini
  },
  {
    name: { en: 'Thiruvathirai', ta: 'திருவாதிரை' },
    type: 'hindu',
    month: 9,    // Margazhi
    nakshatra: 6  // Ardra
  },
  {
    name: { en: 'Masi Magam', ta: 'மாசி மகம்' },
    type: 'hindu',
    month: 11,   // Maasi
    nakshatra: 10 // Magha
  },
  {
    name: { en: 'Chitirai Thirunal', ta: 'சித்திரை திருநாள்' },
    type: 'hindu',
    month: 1,    // Chithirai
    nakshatra: 14 // Chitra
  },
];

/**
 * Fixed date festivals (Gregorian calendar).
 */
export const FIXED_DATE_FESTIVALS: FixedDateFestival[] = [
  // Government holidays
  { name: { en: 'New Year', ta: 'புத்தாண்டு' }, type: 'government', month: 1, day: 1 },
  { name: { en: 'Republic Day', ta: 'குடியரசு தினம்' }, type: 'government', month: 1, day: 26 },
  { name: { en: 'Independence Day', ta: 'சுதந்திர தினம்' }, type: 'government', month: 8, day: 15 },
  { name: { en: 'Gandhi Jayanti', ta: 'காந்தி ஜெயந்தி' }, type: 'government', month: 10, day: 2 },

  // Tamil Nadu specific
  { name: { en: 'Pongal', ta: 'பொங்கல்' }, type: 'hindu', month: 1, day: 14 },
  { name: { en: 'Thiruvalluvar Day', ta: 'திருவள்ளுவர் தினம்' }, type: 'government', month: 1, day: 15 },
  { name: { en: 'Mattu Pongal', ta: 'மாட்டுப் பொங்கல்' }, type: 'hindu', month: 1, day: 16 },

  // Christian festivals
  { name: { en: 'Christmas', ta: 'கிறிஸ்துமஸ்' }, type: 'christian', month: 12, day: 25 },
  { name: { en: 'Good Friday', ta: 'புனித வெள்ளி' }, type: 'christian', month: 4, day: 7 }, // Approximate, varies by year

  // Note: Muslim festivals are lunar-based and shift ~11 days each year
  // These should be calculated or updated annually
];

/**
 * Get all festivals for a given date.
 * This is a simplified matcher - production version should handle edge cases.
 */
export function getFixedFestivals(month: number, day: number): FixedDateFestival[] {
  return FIXED_DATE_FESTIVALS.filter(f => f.month === month && f.day === day);
}
