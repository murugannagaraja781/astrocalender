# 🌙 Panchangam - Tamil Daily Astrological Calendar

A production-ready Panchangam (Hindu astrological calendar) calculation system with React frontend and Node.js backend using Swiss Ephemeris for accurate astronomical calculations.

## Features

- **Accurate Astronomical Calculations**: Uses Swiss Ephemeris with Lahiri ayanamsa (sidereal zodiac)
- **Complete Panchangam Elements**: Tithi, Nakshatra, Yoga, Karana with exact end times
- **Tamil Calendar**: Month, day, and 60-year cycle year names
- **Inauspicious Periods**: Rahu Kalam, Yama Gandam, Kuligai
- **Auspicious Periods**: Gowri Neram, Nalla Neram
- **Lagnam**: Rising sign throughout the day
- **Chandrashtamam**: Based on birth nakshatra
- **Festivals**: Config-driven Hindu, Christian, Muslim, and government holidays
- **Bilingual**: Tamil and English support
- **Mobile-First**: Responsive design

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Calculations**: Swiss Ephemeris (`sweph` package)
- **Timezone**: Luxon (no JavaScript Date hacks)
- **Validation**: Zod

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Backend Setup

```bash
cd server
npm install
npm run dev
```

The API server will start at `http://localhost:3001`

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`

## API Reference

### POST /api/panchangam

Calculate Panchangam for a given date and location.

**Request:**
```json
{
  "date": "2025-01-15",
  "latitude": 13.0827,
  "longitude": 80.2707,
  "timezone": "Asia/Kolkata",
  "birthNakshatra": "Rohini"
}
```

**Response:**
```json
{
  "date": "2025-01-15",
  "location": {
    "latitude": 13.0827,
    "longitude": 80.2707,
    "timezone": "Asia/Kolkata"
  },
  "tamilCalendar": {
    "month": { "en": "Thai", "ta": "தை" },
    "day": 1,
    "year": { "name": { "en": "Krodhana", "ta": "குரோதன" }, "number": 5126 }
  },
  "sunrise": "06:32:15",
  "sunset": "17:58:42",
  "tithi": {
    "index": 1,
    "name": { "en": "Pratipada", "ta": "பிரதமை" },
    "paksha": { "en": "Shukla Paksha", "ta": "சுக்ல பக்ஷம்" },
    "endTime": "14:23:18",
    "nextTithi": { "en": "Dwitiya", "ta": "துவிதியை" }
  },
  "nakshatra": {
    "index": 22,
    "name": { "en": "Shravana", "ta": "திருவோணம்" },
    "pada": 2,
    "endTime": "19:45:30",
    "lord": { "en": "Moon", "ta": "சந்திரன்" },
    "nextNakshatra": { "en": "Dhanishta", "ta": "அவிட்டம்" }
  },
  "yoga": {
    "index": 16,
    "name": { "en": "Siddhi", "ta": "சித்தி" },
    "endTime": "22:15:00"
  },
  "karana": {
    "index": 1,
    "name": { "en": "Bava", "ta": "பவ" },
    "endTime": "08:30:00",
    "nextKarana": { "en": "Balava", "ta": "பாலவ" }
  },
  "moonRasi": {
    "index": 10,
    "name": { "en": "Makara", "ta": "மகரம்" },
    "degree": 15.234
  },
  "lagnam": [
    { "index": 9, "rasi": { "en": "Dhanu", "ta": "தனுசு" }, "start": "06:32", "end": "08:15" }
  ],
  "inauspiciousPeriods": {
    "rahuKalam": { "start": "15:00", "end": "16:30" },
    "yamaGandam": { "start": "12:00", "end": "13:30" },
    "kuligai": { "start": "09:00", "end": "10:30" }
  },
  "auspiciousPeriods": {
    "gowriNeram": [
      { "start": "06:32", "end": "07:55", "type": "good", "name": { "en": "Uthira", "ta": "உத்திரம்" } }
    ],
    "nallaNeram": [
      { "start": "06:32", "end": "07:55" }
    ]
  },
  "festivals": [
    { "name": { "en": "Pongal", "ta": "பொங்கல்" }, "type": "hindu" }
  ],
  "chandrashtama": null
}
```

### GET /api/panchangam/today

Get Panchangam for today (default: Chennai, India).

## Project Structure

```
astrocalender/
├── server/                    # Node.js + Express backend
│   ├── src/
│   │   ├── config/           # Nakshatra, Tithi, Yoga, Karana, Festival configs
│   │   ├── engine/           # Calculation modules
│   │   ├── controllers/      # API controllers
│   │   ├── routes/           # Express routes
│   │   ├── services/         # Business logic
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # Datetime utilities
│   └── package.json
│
└── client/                    # React + Vite frontend
    ├── src/
    │   ├── components/       # React components
    │   ├── hooks/            # Custom hooks
    │   ├── services/         # API client
    │   ├── i18n/             # Translations (Tamil/English)
    │   └── types/            # TypeScript interfaces
    └── package.json
```

## Calculation Formulas

| Element | Formula |
|---------|---------|
| **Tithi** | (Moon° - Sun°) / 12° = Tithi index (1-30) |
| **Nakshatra** | Moon° / 13°20' = Nakshatra index (1-27) |
| **Yoga** | (Sun° + Moon°) / 13°20' = Yoga index (1-27) |
| **Karana** | (Moon° - Sun°) / 6° = Karana number (1-60) |
| **Rahu Kalam** | Day ÷ 8 segments, varies by weekday |

## Configuration

### Adding Festivals

Edit `server/src/config/festivals.ts`:

```typescript
// Tithi-based festival
{
  name: { en: 'Festival Name', ta: 'பண்டிகை' },
  type: 'hindu',
  month: 5,     // Tamil month (1-12)
  tithi: 4,     // Tithi index (1-30)
  paksha: 'shukla'
}

// Fixed date festival
{
  name: { en: 'Holiday', ta: 'விடுமுறை' },
  type: 'government',
  month: 1,     // Gregorian month
  day: 26
}
```

## Notes

- All calculations use UTC internally; display times are in specified timezone
- Lahiri (Chitrapaksha) ayanamsa is used for sidereal calculations
- Precision: End times are calculated with ±1 minute accuracy

## License

MIT
