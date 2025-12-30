/**
 * Panchangam API Types
 *
 * TypeScript interfaces for all Panchangam-related data structures.
 * These types are shared between the calculation engine and API layer.
 */

// ============================================================================
// Bilingual Text Support
// ============================================================================

export interface BilingualText {
  en: string;
  ta: string;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface PanchangamRequest {
  date: string;           // YYYY-MM-DD format
  latitude: number;       // -90 to 90
  longitude: number;      // -180 to 180
  timezone: string;       // IANA timezone (e.g., "Asia/Kolkata")
  birthNakshatra?: string | undefined; // Optional, for Chandrashtamam calculation
}

export interface PanchangamResponse {
  date: string;
  location: LocationInfo;
  tamilCalendar: TamilCalendar;
  sunrise: string;        // HH:MM:SS format in local time
  sunset: string;         // HH:MM:SS format in local time
  tithi: TithiInfo;
  nakshatra: NakshatraInfo;
  yoga: YogaInfo;
  karana: KaranaInfo;
  moonRasi: RasiInfo;
  lagnam: LagnamInfo[];
  inauspiciousPeriods: InauspiciousPeriods;
  auspiciousPeriods: AuspiciousPeriods;
  festivals: FestivalInfo[];
  chandrashtama: ChandrashtamaInfo | null;
}

// ============================================================================
// Location & Calendar Types
// ============================================================================

export interface LocationInfo {
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface TamilCalendar {
  month: BilingualText;
  day: number;
  year: {
    name: BilingualText;  // Tamil year name (e.g., "Krodhana")
    number: number;       // Tamil year number
  };
}

// ============================================================================
// Core Panchangam Elements
// ============================================================================

export interface TithiInfo {
  index: number;          // 1-30
  name: BilingualText;
  paksha: BilingualText;  // Shukla (waxing) or Krishna (waning)
  endTime: string;        // HH:MM:SS when tithi ends
  nextTithi: BilingualText;
}

export interface NakshatraInfo {
  index: number;          // 1-27
  name: BilingualText;
  pada: number;           // 1-4 (quarter of nakshatra)
  endTime: string;        // HH:MM:SS when nakshatra ends
  lord: BilingualText;    // Ruling planet
  nextNakshatra: BilingualText;
}

export interface YogaInfo {
  index: number;          // 1-27
  name: BilingualText;
  endTime: string;        // HH:MM:SS when yoga ends
}

export interface KaranaInfo {
  index: number;          // 1-11
  name: BilingualText;
  endTime: string;        // HH:MM:SS when karana ends
  nextKarana: BilingualText;
}

export interface RasiInfo {
  index: number;          // 1-12
  name: BilingualText;
  degree: number;         // Precise degree within sign (0-30)
}

// ============================================================================
// Lagnam (Ascendant) Types
// ============================================================================

export interface LagnamInfo {
  index: number;          // 1-12
  rasi: BilingualText;
  start: string;          // HH:MM when this lagnam starts
  end: string;            // HH:MM when this lagnam ends
}

// ============================================================================
// Muhurta (Auspicious/Inauspicious Periods)
// ============================================================================

export interface TimePeriod {
  start: string;          // HH:MM format
  end: string;            // HH:MM format
}

export interface InauspiciousPeriods {
  rahuKalam: TimePeriod;
  yamaGandam: TimePeriod;
  kuligai: TimePeriod;
}

export interface GowriPeriod extends TimePeriod {
  type: 'good' | 'bad';
  name: BilingualText;
}

export interface AuspiciousPeriods {
  gowriNeram: GowriPeriod[];
  nallaNeram: TimePeriod[];
}

// ============================================================================
// Festival Types
// ============================================================================

export type FestivalType = 'hindu' | 'christian' | 'muslim' | 'government';

export interface FestivalInfo {
  name: BilingualText;
  type: FestivalType;
  description?: BilingualText;
}

// ============================================================================
// Chandrashtamam Types
// ============================================================================

export interface ChandrashtamaInfo {
  isActive: boolean;
  startTime: string;      // HH:MM when chandrashtamam starts
  endTime: string;        // HH:MM when chandrashtamam ends
  birthNakshatra: BilingualText;
  currentMoonRasi: BilingualText;
}

// ============================================================================
// Internal Calculation Types (not exposed in API)
// ============================================================================

export interface SunMoonPosition {
  sunLongitude: number;   // Sidereal longitude (0-360)
  moonLongitude: number;  // Sidereal longitude (0-360)
  julianDay: number;      // Julian Day Number
}

export interface SunriseSunset {
  sunrise: Date;          // UTC Date object
  sunset: Date;           // UTC Date object
  dayDuration: number;    // Duration in minutes
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface NakshatraConfig {
  index: number;
  name: BilingualText;
  lord: BilingualText;
  startDegree: number;    // Starting degree in zodiac (0-360)
}

export interface TithiConfig {
  index: number;
  name: BilingualText;
  paksha: 'shukla' | 'krishna';
}

export interface YogaConfig {
  index: number;
  name: BilingualText;
  nature: 'auspicious' | 'inauspicious' | 'neutral';
}

export interface KaranaConfig {
  index: number;
  name: BilingualText;
  type: 'movable' | 'fixed';
}

export interface RasiConfig {
  index: number;
  name: BilingualText;
  lord: BilingualText;
  startDegree: number;    // Starting degree (0, 30, 60, ... 330)
}

export interface TamilMonthConfig {
  index: number;
  name: BilingualText;
  sunStartDegree: number; // Sun's sidereal longitude when month starts
}

// ============================================================================
// Festival Rule Types
// ============================================================================

export interface TithiBasedFestival {
  name: BilingualText;
  type: 'hindu';
  month: number;          // Tamil month (1-12)
  tithi: number;          // Tithi index (1-30)
  paksha: 'shukla' | 'krishna';
}

export interface FixedDateFestival {
  name: BilingualText;
  type: FestivalType;
  month: number;          // Gregorian month (1-12)
  day: number;            // Day of month (1-31)
}

export interface NakshatraBasedFestival {
  name: BilingualText;
  type: 'hindu';
  month: number;          // Tamil month (1-12)
  nakshatra: number;      // Nakshatra index (1-27)
}
