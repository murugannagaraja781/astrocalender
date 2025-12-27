/**
 * Panchangam API Client Types
 *
 * TypeScript interfaces matching the backend API types.
 */

export interface BilingualText {
  en: string;
  ta: string;
}

export interface PanchangamRequest {
  date: string;
  latitude: number;
  longitude: number;
  timezone: string;
  birthNakshatra?: string;
}

export interface LocationInfo {
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface TamilCalendar {
  month: BilingualText;
  day: number;
  year: {
    name: BilingualText;
    number: number;
  };
}

export interface TithiInfo {
  index: number;
  name: BilingualText;
  paksha: BilingualText;
  endTime: string;
  nextTithi: BilingualText;
}

export interface NakshatraInfo {
  index: number;
  name: BilingualText;
  pada: number;
  endTime: string;
  lord: BilingualText;
  nextNakshatra: BilingualText;
}

export interface YogaInfo {
  index: number;
  name: BilingualText;
  endTime: string;
}

export interface KaranaInfo {
  index: number;
  name: BilingualText;
  endTime: string;
  nextKarana: BilingualText;
}

export interface RasiInfo {
  index: number;
  name: BilingualText;
  degree: number;
}

export interface LagnamInfo {
  index: number;
  rasi: BilingualText;
  start: string;
  end: string;
}

export interface TimePeriod {
  start: string;
  end: string;
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

export type FestivalType = 'hindu' | 'christian' | 'muslim' | 'government';

export interface FestivalInfo {
  name: BilingualText;
  type: FestivalType;
}

export interface ChandrashtamaInfo {
  isActive: boolean;
  startTime: string;
  endTime: string;
  birthNakshatra: BilingualText;
  currentMoonRasi: BilingualText;
}

export interface PanchangamResponse {
  date: string;
  location: LocationInfo;
  tamilCalendar: TamilCalendar;
  sunrise: string;
  sunset: string;
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
