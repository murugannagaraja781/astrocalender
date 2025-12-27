/**
 * Tamil Calendar Configuration
 *
 * Tamil months follow the solar calendar (sidereal zodiac).
 * Each month begins when the Sun enters a new zodiac sign.
 * The Tamil year starts with Chithirai (mid-April) when Sun enters Mesha.
 */

import { TamilMonthConfig, BilingualText } from '../types/panchangam.js';

/**
 * Tamil months with corresponding Sun positions (sidereal).
 * The month begins when Sun enters the specified degree.
 */
export const TAMIL_MONTHS: TamilMonthConfig[] = [
  { index: 1,  name: { en: 'Chithirai',  ta: 'சித்திரை' },   sunStartDegree: 0 },    // Apr-May (Mesha)
  { index: 2,  name: { en: 'Vaikasi',    ta: 'வைகாசி' },    sunStartDegree: 30 },   // May-Jun (Vrishabha)
  { index: 3,  name: { en: 'Aani',       ta: 'ஆனி' },       sunStartDegree: 60 },   // Jun-Jul (Mithuna)
  { index: 4,  name: { en: 'Aadi',       ta: 'ஆடி' },       sunStartDegree: 90 },   // Jul-Aug (Karka)
  { index: 5,  name: { en: 'Aavani',     ta: 'ஆவணி' },     sunStartDegree: 120 },  // Aug-Sep (Simha)
  { index: 6,  name: { en: 'Purattasi',  ta: 'புரட்டாசி' },  sunStartDegree: 150 },  // Sep-Oct (Kanya)
  { index: 7,  name: { en: 'Aippasi',    ta: 'ஐப்பசி' },    sunStartDegree: 180 },  // Oct-Nov (Tula)
  { index: 8,  name: { en: 'Karthigai',  ta: 'கார்த்திகை' }, sunStartDegree: 210 },  // Nov-Dec (Vrischika)
  { index: 9,  name: { en: 'Margazhi',   ta: 'மார்கழி' },    sunStartDegree: 240 },  // Dec-Jan (Dhanu)
  { index: 10, name: { en: 'Thai',       ta: 'தை' },        sunStartDegree: 270 },  // Jan-Feb (Makara)
  { index: 11, name: { en: 'Maasi',      ta: 'மாசி' },      sunStartDegree: 300 },  // Feb-Mar (Kumbha)
  { index: 12, name: { en: 'Panguni',    ta: 'பங்குனி' },    sunStartDegree: 330 },  // Mar-Apr (Meena)
];

/**
 * Tamil year names - 60-year cycle (Prabhava to Akshaya)
 * We only include common ones used in current period.
 */
export const TAMIL_YEARS: BilingualText[] = [
  { en: 'Prabhava', ta: 'பிரபவ' },       // Year 1
  { en: 'Vibhava', ta: 'விபவ' },         // Year 2
  { en: 'Shukla', ta: 'சுக்ல' },          // Year 3
  { en: 'Pramodoota', ta: 'பிரமோதூத' },  // Year 4
  { en: 'Prajothpathi', ta: 'பிரஜோத்பத்தி' }, // Year 5
  { en: 'Aangirasa', ta: 'ஆங்கிரச' },    // Year 6
  { en: 'Sreemukha', ta: 'ஸ்ரீமுக' },     // Year 7
  { en: 'Bhava', ta: 'பவ' },             // Year 8
  { en: 'Yuva', ta: 'யுவ' },             // Year 9
  { en: 'Dhaatu', ta: 'தாது' },          // Year 10
  { en: 'Eswara', ta: 'ஈஸ்வர' },         // Year 11
  { en: 'Bahudhanya', ta: 'பகுதான்ய' },   // Year 12
  { en: 'Pramathi', ta: 'பிரமாதி' },      // Year 13
  { en: 'Vikrama', ta: 'விக்ரம' },        // Year 14
  { en: 'Vishu', ta: 'விஷு' },           // Year 15
  { en: 'Chitrabhanu', ta: 'சித்திரபானு' }, // Year 16
  { en: 'Subhanu', ta: 'சுபானு' },        // Year 17
  { en: 'Tharana', ta: 'தாரண' },         // Year 18
  { en: 'Parthiva', ta: 'பார்த்திவ' },    // Year 19
  { en: 'Vyaya', ta: 'வியய' },           // Year 20
  { en: 'Sarvajithu', ta: 'சர்வஜித்' },   // Year 21
  { en: 'Sarvadhari', ta: 'சர்வதாரி' },   // Year 22
  { en: 'Virodhi', ta: 'விரோதி' },        // Year 23
  { en: 'Vikruthi', ta: 'விக்ருதி' },     // Year 24
  { en: 'Khara', ta: 'கர' },             // Year 25
  { en: 'Nandana', ta: 'நந்தன' },         // Year 26
  { en: 'Vijaya', ta: 'விஜய' },          // Year 27
  { en: 'Jaya', ta: 'ஜய' },              // Year 28
  { en: 'Manmatha', ta: 'மன்மத' },        // Year 29
  { en: 'Durmukhi', ta: 'துர்முகி' },     // Year 30
  { en: 'Hevilambi', ta: 'ஹேவிளம்பி' },   // Year 31
  { en: 'Vilambi', ta: 'விளம்பி' },       // Year 32
  { en: 'Vikari', ta: 'விகாரி' },         // Year 33
  { en: 'Sharvari', ta: 'சார்வரி' },      // Year 34
  { en: 'Plava', ta: 'பிலவ' },           // Year 35
  { en: 'Shubhakruthu', ta: 'சுபக்ருது' }, // Year 36
  { en: 'Shobhakruthu', ta: 'சோபக்ருது' }, // Year 37
  { en: 'Krodhi', ta: 'குரோதி' },         // Year 38
  { en: 'Vishwavasu', ta: 'விஸ்வாவசு' },  // Year 39
  { en: 'Parabhava', ta: 'பராபவ' },       // Year 40
  { en: 'Plavanga', ta: 'பிலவங்க' },      // Year 41
  { en: 'Keelaka', ta: 'கீலக' },          // Year 42
  { en: 'Sowmya', ta: 'சௌம்ய' },          // Year 43
  { en: 'Sadharana', ta: 'சாதாரண' },      // Year 44
  { en: 'Virodhikruthu', ta: 'விரோதிக்ருது' }, // Year 45
  { en: 'Parithaabi', ta: 'பரிதாபி' },    // Year 46
  { en: 'Pramadicha', ta: 'பிரமாதீச' },   // Year 47
  { en: 'Ananda', ta: 'ஆனந்த' },          // Year 48
  { en: 'Rakshasa', ta: 'ராக்ஷச' },       // Year 49
  { en: 'Nala', ta: 'நள' },              // Year 50
  { en: 'Pingala', ta: 'பிங்கள' },        // Year 51
  { en: 'Kalayukthi', ta: 'காளயுக்தி' },  // Year 52
  { en: 'Siddharthi', ta: 'சித்தார்த்தி' }, // Year 53
  { en: 'Raudri', ta: 'ரௌத்ரி' },         // Year 54
  { en: 'Durmathi', ta: 'துர்மதி' },      // Year 55
  { en: 'Dundubhi', ta: 'துந்துபி' },     // Year 56
  { en: 'Rudhirodgaari', ta: 'ருதிரோத்காரி' }, // Year 57
  { en: 'Raktakshi', ta: 'ரக்தாக்ஷி' },   // Year 58
  { en: 'Krodhana', ta: 'குரோதன' },       // Year 59
  { en: 'Akshaya', ta: 'அக்ஷய' },         // Year 60
];

/**
 * Get Tamil month from Sun's sidereal longitude.
 */
export function getTamilMonth(sunLongitude: number): TamilMonthConfig {
  const normalized = ((sunLongitude % 360) + 360) % 360;
  const monthIndex = Math.floor(normalized / 30);
  return TAMIL_MONTHS[monthIndex] ?? TAMIL_MONTHS[0]!;
}

/**
 * Get Tamil day of month.
 * Tamil day = degree within the month (1-30 or 1-31 depending on month).
 * Simplified: We use Sun's degree within the sign + 1.
 */
export function getTamilDay(sunLongitude: number): number {
  const normalized = ((sunLongitude % 360) + 360) % 360;
  const degreeInSign = normalized % 30;
  return Math.floor(degreeInSign) + 1;
}

/**
 * Get Tamil year name for a given Gregorian year.
 * The 60-year cycle repeats. Reference: Year 2000 was Vikruthi (index 24).
 */
export function getTamilYear(gregorianYear: number): { name: BilingualText; number: number } {
  // Reference: 2000 AD = Vikruthi (Year 24 in 60-year cycle)
  // Calculate offset from reference year
  const referenceYear = 2000;
  const referenceIndex = 23;  // 0-indexed

  const yearsSinceReference = gregorianYear - referenceYear;
  let cycleIndex = (referenceIndex + yearsSinceReference) % 60;
  if (cycleIndex < 0) {
    cycleIndex += 60;
  }

  // Kali Yuga year calculation (approximate)
  // Kali Yuga started 3102 BCE, so Kali year = Gregorian year + 3101
  const kaliYear = gregorianYear + 3101;

  return {
    name: TAMIL_YEARS[cycleIndex] ?? TAMIL_YEARS[0]!,
    number: kaliYear,
  };
}
