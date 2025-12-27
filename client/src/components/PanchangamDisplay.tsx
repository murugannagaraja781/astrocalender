/**
 * Panchangam Display Component
 *
 * Renders the complete Panchangam data in a traditional format.
 */

import { PanchangamResponse, BilingualText } from '../types/panchangam';
import { Translations, Language } from '../i18n';

interface Props {
    data: PanchangamResponse;
    language: Language;
    t: Translations;
    getText: (bilingual: BilingualText) => string;
}

export function PanchangamDisplay({ data, language, t, getText }: Props) {
    return (
        <div className="panchangam-display">
            {/* Tamil Calendar */}
            <div className="card">
                <div className="card__header">
                    <h2 className="card__title">🗓️ {t.tamilCalendar}</h2>
                </div>
                <table className="panchangam-table">
                    <tbody>
                        <tr>
                            <td className="panchangam-table__label">{language === 'ta' ? 'மாதம்' : 'Month'}</td>
                            <td className="panchangam-table__value">{getText(data.tamilCalendar.month)}</td>
                        </tr>
                        <tr>
                            <td className="panchangam-table__label">{language === 'ta' ? 'தேதி' : 'Day'}</td>
                            <td className="panchangam-table__value">{data.tamilCalendar.day}</td>
                        </tr>
                        <tr>
                            <td className="panchangam-table__label">{language === 'ta' ? 'வருடம்' : 'Year'}</td>
                            <td className="panchangam-table__value">
                                {getText(data.tamilCalendar.year.name)} ({data.tamilCalendar.year.number})
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Sun Times */}
            <div className="card">
                <div className="card__header">
                    <h2 className="card__title">☀️ {t.sunTimes}</h2>
                </div>
                <div className="time-grid">
                    <div className="time-period time-period--good">
                        <div className="time-period__name">{t.sunrise}</div>
                        <div className="time-period__time">{data.sunrise}</div>
                    </div>
                    <div className="time-period" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                        <div className="time-period__name">{t.sunset}</div>
                        <div className="time-period__time">{data.sunset}</div>
                    </div>
                </div>
            </div>

            {/* Daily Panchangam */}
            <div className="card">
                <div className="card__header">
                    <h2 className="card__title">🔮 {t.dailyPanchangam}</h2>
                </div>
                <table className="panchangam-table">
                    <tbody>
                        <tr>
                            <td className="panchangam-table__label">{t.tithi}</td>
                            <td className="panchangam-table__value">
                                {getText(data.tithi.name)} ({getText(data.tithi.paksha)})
                                <span className="panchangam-table__time">{t.endTime} {data.tithi.endTime}</span>
                            </td>
                        </tr>
                        <tr>
                            <td className="panchangam-table__label">{t.nakshatra}</td>
                            <td className="panchangam-table__value">
                                {getText(data.nakshatra.name)} - {t.pada} {data.nakshatra.pada}
                                <span className="panchangam-table__time">{t.endTime} {data.nakshatra.endTime}</span>
                            </td>
                        </tr>
                        <tr>
                            <td className="panchangam-table__label">{t.yoga}</td>
                            <td className="panchangam-table__value">
                                {getText(data.yoga.name)}
                                <span className="panchangam-table__time">{t.endTime} {data.yoga.endTime}</span>
                            </td>
                        </tr>
                        <tr>
                            <td className="panchangam-table__label">{t.karana}</td>
                            <td className="panchangam-table__value">
                                {getText(data.karana.name)}
                                <span className="panchangam-table__time">{t.endTime} {data.karana.endTime}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Moon Position */}
            <div className="card">
                <div className="card__header">
                    <h2 className="card__title">🌙 {t.moonPosition}</h2>
                </div>
                <table className="panchangam-table">
                    <tbody>
                        <tr>
                            <td className="panchangam-table__label">{t.moonRasi}</td>
                            <td className="panchangam-table__value">
                                {getText(data.moonRasi.name)} ({data.moonRasi.degree.toFixed(2)}°)
                            </td>
                        </tr>
                        <tr>
                            <td className="panchangam-table__label">{t.nakshatra} Lord</td>
                            <td className="panchangam-table__value">{getText(data.nakshatra.lord)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Inauspicious Periods */}
            <div className="card">
                <div className="card__header">
                    <h2 className="card__title">⚠️ {t.inauspiciousPeriods}</h2>
                </div>
                <div className="time-grid">
                    <div className="time-period time-period--bad">
                        <div className="time-period__name">{t.rahuKalam}</div>
                        <div className="time-period__time">
                            {data.inauspiciousPeriods.rahuKalam.start} - {data.inauspiciousPeriods.rahuKalam.end}
                        </div>
                    </div>
                    <div className="time-period time-period--bad">
                        <div className="time-period__name">{t.yamaGandam}</div>
                        <div className="time-period__time">
                            {data.inauspiciousPeriods.yamaGandam.start} - {data.inauspiciousPeriods.yamaGandam.end}
                        </div>
                    </div>
                    <div className="time-period time-period--bad">
                        <div className="time-period__name">{t.kuligai}</div>
                        <div className="time-period__time">
                            {data.inauspiciousPeriods.kuligai.start} - {data.inauspiciousPeriods.kuligai.end}
                        </div>
                    </div>
                </div>
            </div>

            {/* Auspicious Periods (Gowri Neram) */}
            <div className="card">
                <div className="card__header">
                    <h2 className="card__title">✨ {t.gowriNeram}</h2>
                </div>
                <div className="time-grid">
                    {data.auspiciousPeriods.gowriNeram.map((period, index) => (
                        <div
                            key={index}
                            className={`time-period ${period.type === 'good' ? 'time-period--good' : 'time-period--bad'}`}
                        >
                            <div className="time-period__name">
                                {getText(period.name)}
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                                    ({period.type === 'good' ? t.good : t.bad})
                                </span>
                            </div>
                            <div className="time-period__time">{period.start} - {period.end}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lagnam */}
            {data.lagnam.length > 0 && (
                <div className="card">
                    <div className="card__header">
                        <h2 className="card__title">⬆️ {t.lagnam}</h2>
                    </div>
                    <table className="panchangam-table">
                        <thead>
                            <tr>
                                <th>{language === 'ta' ? 'ராசி' : 'Rasi'}</th>
                                <th>{language === 'ta' ? 'தொடக்கம்' : 'Start'}</th>
                                <th>{language === 'ta' ? 'முடிவு' : 'End'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.lagnam.map((lagna, index) => (
                                <tr key={index}>
                                    <td className="panchangam-table__value">{getText(lagna.rasi)}</td>
                                    <td>{lagna.start}</td>
                                    <td>{lagna.end}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Festivals */}
            <div className="card">
                <div className="card__header">
                    <h2 className="card__title">🎉 {t.festivals}</h2>
                </div>
                {data.festivals.length > 0 ? (
                    <div className="festival-list">
                        {data.festivals.map((festival, index) => (
                            <span
                                key={index}
                                className={`festival-tag festival-tag--${festival.type}`}
                            >
                                {getText(festival.name)}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: 'var(--color-text-muted)' }}>{t.noFestivals}</p>
                )}
            </div>

            {/* Chandrashtamam */}
            {data.chandrashtama && (
                <div className="card">
                    <div className="card__header">
                        <h2 className="card__title">🌑 {t.chandrashtamam}</h2>
                    </div>
                    {data.chandrashtama.isActive ? (
                        <div className="time-period time-period--bad">
                            <div className="time-period__name text-bad">{t.chandrashtamaActive}</div>
                            <div className="time-period__time">
                                {data.chandrashtama.startTime} - {data.chandrashtama.endTime}
                            </div>
                            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                {language === 'ta' ? 'சந்திரன் ' : 'Moon in '}
                                {getText(data.chandrashtama.currentMoonRasi)}
                            </p>
                        </div>
                    ) : (
                        <p style={{ color: 'var(--color-good)' }}>✓ {t.chandrashtamaInactive}</p>
                    )}
                </div>
            )}
        </div>
    );
}
