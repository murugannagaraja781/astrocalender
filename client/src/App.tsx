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
import { Language } from './i18n';

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
    const { data, loading, error, calculate } = usePanchangam();

    const [date, setDate] = useState(getToday());
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
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div className="input-group">
                                <label className="input-group__label">{t.dateLabel}</label>
                                <input
                                    type="date"
                                    className="input-group__input"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

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

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <button type="button" className="btn btn--secondary" onClick={handleDetectLocation}>
                                📍 {t.detectLocation}
                            </button>
                            <button type="submit" className="btn btn--primary" disabled={loading}>
                                {loading ? '⏳' : '🔮'} {t.calculate}
                            </button>
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

                    {/* Panchangam Display */}
                    {data && !loading && (
                        <PanchangamDisplay data={data} language={language} t={t} getText={getText} />
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
