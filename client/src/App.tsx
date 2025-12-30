/**
 * Main Panchangam Application
 *
 * Root component with layout and state management.
 */

import { useState, useEffect, FormEvent } from 'react';
import { usePanchangam } from './hooks/usePanchangam';
import { useGeolocation } from './hooks/useGeolocation';
import { useLanguage } from './hooks/useLanguage';
import { PanchangamDisplay } from './components/PanchangamDisplay';
import { BilingualText } from './types/panchangam';

// Nakshatra list for birth nakshatra selector
const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
    'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
    'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Moola', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati'
];

function getToday(): string {
    return new Date().toISOString().split('T')[0]!;
}

export default function App() {
    const { language, t, setLanguage } = useLanguage();
    const { location, detectLocation } = useGeolocation();
    const { data, loading, error, calculate, downloadCsv } = usePanchangam();

    // Single date mode
    const [date, setDate] = useState(getToday());

    // Date range mode
    const [isRangeMode, setIsRangeMode] = useState(false);
    const [startDate, setStartDate] = useState(getToday());
    const [endDate, setEndDate] = useState(getToday());

    // Location
    const [latitude, setLatitude] = useState('13.0827');
    const [longitude, setLongitude] = useState('80.2707');
    const [timezone, setTimezone] = useState('Asia/Kolkata');
    const [birthNakshatra, setBirthNakshatra] = useState('');

    // Update location when detected
    useEffect(() => {
        if (location) {
            setLatitude(location.latitude.toFixed(4));
            setLongitude(location.longitude.toFixed(4));
        }
    }, [location]);

    // Auto-calculate on first load
    useEffect(() => {
        handleCalculate();
    }, []);

    const handleCalculate = async (e?: FormEvent) => {
        e?.preventDefault();

        await calculate({
            date,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            timezone,
            birthNakshatra: birthNakshatra || undefined,
        });
    };

    const handleDetectLocation = () => {
        detectLocation();
    };

    const handleDownloadCSV = async () => {
        const blob = await downloadCsv({
            startDate,
            endDate,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            timezone,
            birthNakshatra: birthNakshatra || undefined,
        });

        if (blob) {
            // Download the CSV file
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `panchangam_${startDate}_to_${endDate}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    };

    const getText = (bilingual: BilingualText): string => {
        return language === 'ta' ? bilingual.ta : bilingual.en;
    };

    return (
        <div className="app">
            {/* Header */}
            <header className="header">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className="header__title">{t.appTitle}</h1>
                            <p className="header__subtitle">{t.appSubtitle}</p>
                        </div>
                        <div className="lang-toggle">
                            <button
                                className={`lang-toggle__btn ${language === 'en' ? 'lang-toggle__btn--active' : ''}`}
                                onClick={() => setLanguage('en')}
                            >
                                {t.english}
                            </button>
                            <button
                                className={`lang-toggle__btn ${language === 'ta' ? 'lang-toggle__btn--active' : ''}`}
                                onClick={() => setLanguage('ta')}
                            >
                                {t.tamil}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="main">
                <div className="container">
                    {/* Input Form */}
                    <form className="card" onSubmit={handleCalculate}>
                        <div className="card__header">
                            <h2 className="card__title">📅 {t.dateLabel} & {t.locationLabel}</h2>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <label style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                    <input
                                        type="checkbox"
                                        checked={isRangeMode}
                                        onChange={(e) => setIsRangeMode(e.target.checked)}
                                        style={{ marginRight: '0.25rem' }}
                                    />
                                    {language === 'ta' ? 'தேதி வரம்பு' : 'Date Range'}
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {!isRangeMode ? (
                                <div className="input-group">
                                    <label className="input-group__label">{t.dateLabel}</label>
                                    <input
                                        type="date"
                                        className="input-group__input"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="input-group">
                                        <label className="input-group__label">
                                            {language === 'ta' ? 'தொடக்க தேதி' : 'Start Date'}
                                        </label>
                                        <input
                                            type="date"
                                            className="input-group__input"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="input-group__label">
                                            {language === 'ta' ? 'முடிவு தேதி' : 'End Date'}
                                        </label>
                                        <input
                                            type="date"
                                            className="input-group__input"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="input-group">
                                <label className="input-group__label">{t.latitudeLabel}</label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    className="input-group__input"
                                    value={latitude}
                                    onChange={(e) => setLatitude(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-group__label">{t.longitudeLabel}</label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    className="input-group__input"
                                    value={longitude}
                                    onChange={(e) => setLongitude(e.target.value)}
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-group__label">{t.timezoneLabel}</label>
                                <input
                                    type="text"
                                    className="input-group__input"
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    placeholder="Asia/Kolkata"
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-group__label">{t.birthNakshatraLabel}</label>
                                <select
                                    className="input-group__input"
                                    value={birthNakshatra}
                                    onChange={(e) => setBirthNakshatra(e.target.value)}
                                >
                                    <option value="">{t.birthNakshatraPlaceholder}</option>
                                    {NAKSHATRAS.map((nak) => (
                                        <option key={nak} value={nak}>{nak}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                            <button type="button" className="btn btn--secondary" onClick={handleDetectLocation}>
                                📍 {t.detectLocation}
                            </button>

                            {!isRangeMode ? (
                                <button type="submit" className="btn btn--primary" disabled={loading}>
                                    {loading ? '⏳' : '🔮'} {t.calculate}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className="btn btn--primary"
                                    onClick={handleDownloadCSV}
                                    disabled={loading}
                                >
                                    {loading ? '⏳' : '📥'} {language === 'ta' ? 'CSV பதிவிறக்கம்' : 'Download CSV'}
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Loading State */}
                    {loading && (
                        <div className="loading">
                            <div className="loading__spinner"></div>
                            <p>{t.loading}</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="error">
                            <p>❌ {t.error}: {error}</p>
                        </div>
                    )}

                    {/* Panchangam Display (only in single date mode) */}
                    {data && !loading && !isRangeMode && (
                        <PanchangamDisplay data={data} language={language} t={t} getText={getText} />
                    )}

                    {/* Range Mode Info */}
                    {isRangeMode && !loading && (
                        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                                📊 {language === 'ta' ? 'தேதி வரம்பு CSV ஏற்றுமதி' : 'Date Range CSV Export'}
                            </p>
                            <p style={{ color: 'var(--color-text-secondary)' }}>
                                {language === 'ta'
                                    ? 'தொடக்க மற்றும் முடிவு தேதிகளைத் தேர்ந்தெடுத்து CSV பதிவிறக்க பொத்தானைக் கிளிக் செய்யவும்.'
                                    : 'Select start and end dates, then click Download CSV to export Panchangam data for the entire date range.'
                                }
                            </p>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                {language === 'ta' ? 'அதிகபட்சம் 365 நாட்கள்' : 'Maximum 365 days'}
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                <p>🌙 {t.appTitle} - {new Date().getFullYear()}</p>
            </footer>
        </div>
    );
}
