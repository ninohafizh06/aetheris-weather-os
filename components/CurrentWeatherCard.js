'use client';

import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudRain,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Droplets,
  Wind,
  Thermometer,
  BatteryCharging,
  Wifi,
  Radio,
  MapPin
} from 'lucide-react';

export default function CurrentWeatherCard({
  weatherData,
  unit = 'C',
  activeMode = 'meteo',
  lang = 'id'
}) {
  const current = weatherData?.current || {};
  const isDay = current.isDay ?? 1;

  // Temperature unit conversion
  const displayTemp = (tempC) => {
    if (typeof tempC !== 'number') return '--';
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return Math.round(tempC * 10) / 10;
  };

  // Weather icon mapping
  const renderWeatherIcon = () => {
    const code = current.weatherCode ?? 1;
    const size = 78;

    if (code >= 95) return <CloudLightning size={size} color="#facc15" className="weather-animated-icon" />;
    if (code >= 61 && code <= 82) return <CloudRain size={size} color="#38bdf8" className="weather-animated-icon" />;
    if (code >= 51 && code <= 55) return <CloudDrizzle size={size} color="#7dd3fc" className="weather-animated-icon" />;
    if (code === 45 || code === 48) return <CloudFog size={size} color="#cbd5e1" className="weather-animated-icon" />;
    if (code === 3) return <Cloud size={size} color="#94a3b8" className="weather-animated-icon" />;
    if (code === 1 || code === 2) return <CloudSun size={size} color="#fbbf24" className="weather-animated-icon" />;
    if (isDay) return <Sun size={size} color="#f59e0b" className="weather-animated-icon" />;
    return <Moon size={size} color="#93c5fd" className="weather-animated-icon" />;
  };

  return (
    <div className="glass-card hero-weather-card" id="hero-weather-card">
      <div className="hero-station-header">
        <div>
          <div className="hero-location-name">
            <MapPin size={22} color="var(--accent-cyan)" />
            <span>{weatherData?.city || 'Stasiun Cuaca'}</span>
          </div>
          <div className="hero-coordinates">
            {weatherData?.province && `${weatherData.province} • `}
            {weatherData?.lat?.toFixed(4)}°, {weatherData?.lon?.toFixed(4)}° • Elev: {weatherData?.elevation || 15}m
          </div>
        </div>

        {activeMode === 'iot' ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <span className="status-badge-live" style={{ background: 'rgba(56, 189, 248, 0.15)', borderColor: 'var(--accent-cyan)' }}>
              <Radio size={12} color="var(--accent-cyan)" />
              {current?.stationId || 'ESP32-NODE-01'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <BatteryCharging size={13} color="#34d399" />
                {current?.batteryVoltage ? `${current.batteryVoltage}V` : '4.12V'}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Wifi size={13} color="#38bdf8" />
                -64 dBm
              </span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'right' }}>
            <span className="card-subtitle-tag">
              {lang === 'id' ? 'Pembaruan Terakhir' : 'Last Updated'}
            </span>
            <div style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' }}>
              {current?.updatedAt || '--:--'}
            </div>
          </div>
        )}
      </div>

      <div className="hero-main-stats">
        <div>
          <div className="hero-temp-large">
            <span>{displayTemp(current?.temperature)}</span>
            <span className="temp-unit-symbol">°{unit}</span>
          </div>
          <div className="hero-temp-summary">
            <span>
              {lang === 'id' ? 'Terasa seperti' : 'Feels like'}{' '}
              <strong style={{ color: '#ffffff' }}>
                {displayTemp(current?.feelsLike || current?.temperature)}°{unit}
              </strong>
            </span>
            <span>•</span>
            <span>
              Dew Pt:{' '}
              <strong style={{ color: '#93c5fd' }}>
                {displayTemp(current?.dewPoint || 22)}°{unit}
              </strong>
            </span>
          </div>
        </div>

        <div className="hero-condition-icon-wrap">
          {renderWeatherIcon()}
          <span className="hero-condition-text">
            {current?.condition?.description || (lang === 'id' ? 'Cerah Berawan' : 'Partly Cloudy')}
          </span>
        </div>
      </div>

      <div className="hero-secondary-pills">
        <div className="metric-pill">
          <div className="metric-pill-label">
            <Droplets size={13} color="#38bdf8" />
            <span>{lang === 'id' ? 'Kelembaban' : 'Humidity'}</span>
          </div>
          <div className="metric-pill-val" style={{ color: '#38bdf8' }}>
            {current?.humidity ?? '--'}%
          </div>
        </div>

        <div className="metric-pill">
          <div className="metric-pill-label">
            <Wind size={13} color="#93c5fd" />
            <span>{lang === 'id' ? 'Kecepatan Angin' : 'Wind Speed'}</span>
          </div>
          <div className="metric-pill-val">
            {current?.windSpeed ?? '--'} <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>km/h</span>
          </div>
        </div>

        <div className="metric-pill">
          <div className="metric-pill-label">
            <Thermometer size={13} color="#f59e0b" />
            <span>{lang === 'id' ? 'Rentang Suhu' : 'Diurnal Range'}</span>
          </div>
          <div className="metric-pill-val" style={{ fontSize: '0.85rem' }}>
            <span style={{ color: '#93c5fd' }}>{displayTemp(23.5)}°</span> - <span style={{ color: '#f87171' }}>{displayTemp(32.8)}°</span>
          </div>
        </div>
      </div>
    </div>
  );
}
