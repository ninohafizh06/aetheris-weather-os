'use client';

import {
  CalendarDays,
  CloudSun,
  Sun,
  CloudRain,
  CloudLightning,
  Cloud,
  Droplets
} from 'lucide-react';

export default function DailyForecastList({ daily = [], unit = 'C', lang = 'id' }) {
  if (!daily || daily.length === 0) return null;

  const displayTemp = (tempC) => {
    if (typeof tempC !== 'number') return '--';
    if (unit === 'F') return Math.round((tempC * 9) / 5 + 32);
    return Math.round(tempC);
  };

  // Find min and max for the whole 7-day period to scale the spectrum bars
  const weekMin = Math.min(...daily.map((d) => d.tempMin));
  const weekMax = Math.max(...daily.map((d) => d.tempMax));
  const weekRange = weekMax - weekMin || 1;

  const renderIcon = (code) => {
    if (code >= 95) return <CloudLightning size={18} color="#facc15" />;
    if (code >= 61 && code <= 82) return <CloudRain size={18} color="#38bdf8" />;
    if (code === 3) return <Cloud size={18} color="#94a3b8" />;
    if (code === 1 || code === 2) return <CloudSun size={18} color="#fbbf24" />;
    return <Sun size={18} color="#f59e0b" />;
  };

  return (
    <div className="glass-card" id="daily-forecast-card">
      <div className="card-title-row">
        <div className="card-title-wrap">
          <CalendarDays size={18} className="card-title-icon" />
          <span className="card-title-text">
            {lang === 'id' ? 'Prakiraan Cuaca 7 Hari ke Depan' : '7-Day Extended Forecast'}
          </span>
        </div>
        <span className="card-subtitle-tag">
          {lang === 'id' ? 'Proyeksi Model' : 'Model Projection'}
        </span>
      </div>

      <div className="daily-forecast-container">
        {daily.map((day, idx) => {
          // Calculate relative bar position
          const leftPercent = ((day.tempMin - weekMin) / weekRange) * 100;
          const widthPercent = Math.max(12, ((day.tempMax - day.tempMin) / weekRange) * 100);

          return (
            <div key={idx} className="daily-row-item">
              <span className="daily-day-label">{day.dayLabel}</span>

              <div className="daily-condition-box">
                {renderIcon(day.weatherCode)}
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {day.condition?.description || 'Berawan'}
                </span>
              </div>

              <div className="daily-temp-bar-wrap">
                <span className="temp-min-text">{displayTemp(day.tempMin)}°</span>
                <div className="daily-spectrum-bar">
                  <div
                    className="daily-spectrum-fill"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`
                    }}
                  />
                </div>
                <span className="temp-max-text">{displayTemp(day.tempMax)}°</span>
              </div>

              <div className="daily-rain-chance">
                <Droplets size={12} color="#38bdf8" />
                <span>{day.rainChance}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
