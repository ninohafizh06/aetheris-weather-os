'use client';

import {
  Droplets,
  Gauge,
  Compass,
  Wind,
  ShieldCheck,
  SunMedium,
  CloudRain,
  Eye,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import {
  getWindDirectionLabel,
  getBeaufortScale,
  getAQIStatus,
  getUVStatus
} from '../lib/weatherData';

export default function MetricsGrid({ weatherData, lang = 'id' }) {
  const current = weatherData?.current || {};

  // Metrics calculations
  const humidity = current.humidity ?? 75;
  const pressure = current.pressure ?? 1012.0;
  const windSpeed = current.windSpeed ?? 14.5;
  const windDir = current.windDirection ?? 140;
  const windGusts = current.windGusts ?? Math.round(windSpeed * 1.4);
  const pm25 = current.pm25 ?? 19.8;
  const uvIndex = current.uvIndex ?? 6.2;
  const rainRate = current.rainRate ?? 0.0;

  const aqiInfo = getAQIStatus(pm25, lang);
  const uvInfo = getUVStatus(uvIndex, lang);
  const beaufort = getBeaufortScale(windSpeed, lang);
  const windDirLabel = getWindDirectionLabel(windDir, lang);

  return (
    <div className="metrics-grid-2x3" id="metrics-grid-container">
      {/* 1. Kelembaban Udara */}
      <div className="sub-metric-card" id="metric-card-humidity">
        <div className="sub-metric-header">
          <span className="sub-metric-title">
            <Droplets size={16} color="#38bdf8" />
            {lang === 'id' ? 'Kelembaban Udara' : 'Air Humidity'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>DHT22</span>
        </div>
        <div>
          <div className="sub-metric-val-wrap">
            <span className="sub-metric-val">{humidity}</span>
            <span className="sub-metric-unit">%</span>
          </div>
          <div className="metric-bar-track" style={{ marginTop: '8px' }}>
            <div
              className="metric-bar-fill"
              style={{
                width: `${Math.min(100, Math.max(0, humidity))}%`,
                background: 'linear-gradient(90deg, #38bdf8, #3b82f6)'
              }}
            />
          </div>
        </div>
        <div className="sub-metric-subtext">
          <span style={{ color: humidity > 80 ? '#38bdf8' : humidity > 50 ? '#34d399' : '#fbbf24' }}>
            ● {humidity > 80 ? (lang === 'id' ? 'Tinggi (Lembab Tropis)' : 'High (Humid)') : (lang === 'id' ? 'Rentang Nyaman' : 'Optimal Comfort')}
          </span>
        </div>
      </div>

      {/* 2. Tekanan Atmosfer Barometrik */}
      <div className="sub-metric-card" id="metric-card-pressure">
        <div className="sub-metric-header">
          <span className="sub-metric-title">
            <Gauge size={16} color="#c084fc" />
            {lang === 'id' ? 'Tekanan Barometrik' : 'Barometric Pressure'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>BMP280</span>
        </div>
        <div>
          <div className="sub-metric-val-wrap">
            <span className="sub-metric-val">{pressure.toFixed(1)}</span>
            <span className="sub-metric-unit">hPa</span>
          </div>
          <div className="metric-bar-track" style={{ marginTop: '8px' }}>
            <div
              className="metric-bar-fill"
              style={{
                width: `${Math.min(100, Math.max(0, ((pressure - 970) / 60) * 100))}%`,
                background: 'linear-gradient(90deg, #818cf8, #c084fc)'
              }}
            />
          </div>
        </div>
        <div className="sub-metric-subtext">
          <ArrowUpRight size={14} color="#34d399" />
          <span>{lang === 'id' ? '+0.4 hPa/3j (Kondisi Stabil)' : '+0.4 hPa/3h (Stable Trend)'}</span>
        </div>
      </div>

      {/* 3. Arah & Kecepatan Angin */}
      <div className="sub-metric-card" id="metric-card-wind">
        <div className="sub-metric-header">
          <span className="sub-metric-title">
            <Wind size={16} color="#93c5fd" />
            {lang === 'id' ? 'Arah & Kecepatan Angin' : 'Wind & Heading'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>HALL / VANE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="sub-metric-val-wrap">
              <span className="sub-metric-val">{windSpeed}</span>
              <span className="sub-metric-unit">km/h</span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Gusts: <strong style={{ color: '#ffffff' }}>{windGusts} km/h</strong>
            </div>
          </div>

          {/* Animated Mini Compass Needle */}
          <div className="compass-rose" style={{ width: '56px', height: '56px' }}>
            <div
              className="compass-pointer"
              style={{ height: '42px', transform: `rotate(${windDir}deg)` }}
            />
            <span style={{ position: 'absolute', top: '1px', fontSize: '0.55rem', color: '#f87171', fontWeight: 800 }}>U</span>
          </div>
        </div>
        <div className="sub-metric-subtext">
          <Compass size={13} color="var(--accent-cyan)" />
          <span>{windDirLabel} ({windDir}°) • Beaufort {beaufort.level} ({beaufort.text})</span>
        </div>
      </div>

      {/* 4. Kualitas Udara (AQI & PM2.5) */}
      <div className="sub-metric-card" id="metric-card-aqi">
        <div className="sub-metric-header">
          <span className="sub-metric-title">
            <ShieldCheck size={16} color={aqiInfo.color} />
            {lang === 'id' ? 'Kualitas Udara (AQI)' : 'Air Quality Index'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>PMS5003</span>
        </div>
        <div>
          <div className="sub-metric-val-wrap">
            <span className="sub-metric-val" style={{ color: aqiInfo.color }}>
              {aqiInfo.index}
            </span>
            <span className="sub-metric-unit" style={{ color: aqiInfo.color, fontWeight: 700 }}>
              {aqiInfo.label}
            </span>
          </div>
          <div className="metric-bar-track" style={{ marginTop: '8px' }}>
            <div
              className="metric-bar-fill"
              style={{
                width: `${Math.min(100, Math.max(0, (aqiInfo.index / 200) * 100))}%`,
                backgroundColor: aqiInfo.color
              }}
            />
          </div>
        </div>
        <div className="sub-metric-subtext" style={{ fontSize: '0.71rem' }}>
          <span>PM2.5: <strong style={{ color: '#ffffff' }}>{pm25} µg/m³</strong> • {aqiInfo.advice.slice(0, 48)}...</span>
        </div>
      </div>

      {/* 5. Indeks Radiasi UV */}
      <div className="sub-metric-card" id="metric-card-uv">
        <div className="sub-metric-header">
          <span className="sub-metric-title">
            <SunMedium size={16} color={uvInfo.color} />
            {lang === 'id' ? 'Indeks Radiasi UV' : 'UV Radiation Index'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>GUVA-S12</span>
        </div>
        <div>
          <div className="sub-metric-val-wrap">
            <span className="sub-metric-val" style={{ color: uvInfo.color }}>
              {uvIndex.toFixed(1)}
            </span>
            <span className="sub-metric-unit" style={{ color: uvInfo.color, fontWeight: 700 }}>
              {uvInfo.level}
            </span>
          </div>
          <div className="metric-bar-track" style={{ marginTop: '8px' }}>
            <div
              className="metric-bar-fill"
              style={{
                width: `${Math.min(100, Math.max(0, (uvIndex / 12) * 100))}%`,
                backgroundColor: uvInfo.color
              }}
            />
          </div>
        </div>
        <div className="sub-metric-subtext">
          <span>{uvInfo.advice}</span>
        </div>
      </div>

      {/* 6. Curah Hujan & Presipitasi */}
      <div className="sub-metric-card" id="metric-card-rain">
        <div className="sub-metric-header">
          <span className="sub-metric-title">
            <CloudRain size={16} color="#38bdf8" />
            {lang === 'id' ? 'Curah Hujan & Laju' : 'Precipitation Rate'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>TIPPING BUCKET</span>
        </div>
        <div>
          <div className="sub-metric-val-wrap">
            <span className="sub-metric-val" style={{ color: rainRate > 0 ? '#38bdf8' : '#ffffff' }}>
              {rainRate.toFixed(1)}
            </span>
            <span className="sub-metric-unit">mm/jam</span>
          </div>
          <div className="metric-bar-track" style={{ marginTop: '8px' }}>
            <div
              className="metric-bar-fill"
              style={{
                width: `${Math.min(100, Math.max(0, (rainRate / 25) * 100))}%`,
                background: 'linear-gradient(90deg, #38bdf8, #0284c7)'
              }}
            />
          </div>
        </div>
        <div className="sub-metric-subtext">
          <span>
            {rainRate > 0
              ? (lang === 'id' ? 'Sedang Turun Hujan' : 'Precipitation Active')
              : (lang === 'id' ? 'Kering / Tidak Ada Hujan' : 'Dry / No Precipitation')}
          </span>
        </div>
      </div>
    </div>
  );
}
