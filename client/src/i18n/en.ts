/**
 * English Translations
 */
export const en = {
  // Header
  appTitle: 'Panchangam',
  appSubtitle: 'Tamil Daily Astrological Calendar',

  // Navigation
  today: 'Today',

  // Input Labels
  dateLabel: 'Date',
  locationLabel: 'Location',
  latitudeLabel: 'Latitude',
  longitudeLabel: 'Longitude',
  timezoneLabel: 'Timezone',
  birthNakshatraLabel: 'Birth Nakshatra (Optional)',
  birthNakshatraPlaceholder: 'Select for Chandrashtamam',
  detectLocation: 'Detect Location',
  calculate: 'Calculate',

  // Section Titles
  tamilCalendar: 'Tamil Calendar',
  sunTimes: 'Sun Times',
  dailyPanchangam: 'Daily Panchangam',
  moonPosition: 'Moon Position',
  lagnam: 'Lagnam (Ascendant)',
  inauspiciousPeriods: 'Inauspicious Periods',
  auspiciousPeriods: 'Auspicious Periods',
  festivals: 'Festivals',
  chandrashtamam: 'Chandrashtamam',

  // Panchangam Elements
  sunrise: 'Sunrise',
  sunset: 'Sunset',
  tithi: 'Tithi',
  nakshatra: 'Nakshatra',
  yoga: 'Yoga',
  karana: 'Karana',
  moonRasi: 'Moon Rasi',
  pada: 'Pada',
  endTime: 'ends at',
  next: 'Next',

  // Inauspicious Periods
  rahuKalam: 'Rahu Kalam',
  yamaGandam: 'Yama Gandam',
  kuligai: 'Kuligai',

  // Auspicious Periods
  gowriNeram: 'Gowri Neram',
  nallaNeram: 'Nalla Neram',
  good: 'Good',
  bad: 'Bad',

  // Chandrashtamam
  chandrashtamaActive: 'Chandrashtamam is active',
  chandrashtamaInactive: 'No Chandrashtamam today',
  birthNakshatraRequired: 'Enter birth nakshatra to check',

  // Status Messages
  loading: 'Calculating Panchangam...',
  error: 'Error calculating Panchangam',
  noFestivals: 'No festivals today',

  // Languages
  english: 'English',
  tamil: 'தமிழ்',

  // Tamil months
  months: {
    Chithirai: 'Chithirai',
    Vaikasi: 'Vaikasi',
    Aani: 'Aani',
    Aadi: 'Aadi',
    Aavani: 'Aavani',
    Purattasi: 'Purattasi',
    Aippasi: 'Aippasi',
    Karthigai: 'Karthigai',
    Margazhi: 'Margazhi',
    Thai: 'Thai',
    Maasi: 'Maasi',
    Panguni: 'Panguni',
  },

  // Weekdays
  weekdays: {
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
  },
};

export type Translations = typeof en;
