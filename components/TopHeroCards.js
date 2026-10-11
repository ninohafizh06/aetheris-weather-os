'use client';

import { useState } from 'react';
import {
  Thermometer,
  Droplets,
  Gauge,
  ArrowUpRight,
  ChevronDown,
  Sparkles,
  Zap,
  Sliders,
  ShieldCheck,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function TopHeroCards({
  weatherData,
  unit = 'C',
  onToggleUnit,
  onOpenThresholdModal,
  onInjectAnomaly,
  lang = 'id'
}) {
  const current = weatherData?.current || {};
  const tempVal = typeof current.temperature === 'number'
    ? (unit === 'F' ? Math.round((current.temperature * 9) / 5 + 32) : current.temperature.toFixed(1))
    : '29.8';
  const humidityVal = current.humidity ?? 74;
  const pressureVal = current.pressure ? current.pressure.toFixed(1) : '1011.5';
  const dewPoint = current.dewPoint ? `${current.dewPoint}°C` : '24.5°C';
  const feelsLike = current.feelsLike ? `${current.feelsLike}°C` : '32.8°C';

  return (
    <section className="top-hero-section">
      {/* Section Header Row */}
      <div className="section-header-row">
        <div className="section-title-wrap">
          <div className="section-eyebrow">
            <span>Telemetri sensor 24 jam terakhir</span>
            <span className="eyebrow-clock">🕒</span>
            <span className="eyebrow-badge">3 Parameter Kritis</span>
          </div>
          <h2 className="section-main-heading">Parameter Cuaca Utama</h2>
        </div>

        <div className="section-filter-pills">
          <button type="button" className="filter-pill-btn">
            <ChevronDown size={13} />
            <span>24H</span>
          </button>
          <button type="button" className="filter-pill-btn">
            <ChevronDown size={13} />
            <span>Sensor Realtime</span>
          </button>
          <button type="button" className="filter-pill-btn">
            <ChevronDown size={13} />
            <span>Presisi Tinggi</span>
          </button>
        </div>
      </div>

      {/* Grid of 3 Asset Cards + 1 Hero Action Card */}
      <div className="top-cards-grid">
        {/* Card 1: Suhu Udara (Ethereum / ETH Style) */}
        <div className="crypto-stat-card card-eth">
          <div className="card-top-row">
            <div className="asset-info-badge">
              <div className="asset-icon-circle icon-eth">
                <Thermometer size={15} color="#c084fc" />
              </div>
              <div className="asset-labels">
                <span className="asset-category">Sensor DHT22</span>
                <span className="asset-name">Suhu Udara (°{unit})</span>
              </div>
            </div>
            <button
              type="button"
              className="card-arrow-btn"
              onClick={onToggleUnit}
              title={`Klik untuk ubah ke °${unit === 'C' ? 'F' : 'C'}`}
            >
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="card-metric-body">
            <span className="metric-rate-label">Suhu Saat Ini</span>
            <div className="metric-big-val-row">
              <span className="metric-big-val">{tempVal}°{unit}</span>
            </div>
            <div className="metric-badges-row">
              <span className="trend-badge positive">
                <TrendingUp size={11} />
                <span>+0.4°C</span>
              </span>
              <span className="asset-secondary-tag">Dew Point: {dewPoint}</span>
            </div>
          </div>

          {/* Glowing Spline Chart 1 */}
          <div className="card-spline-wrap">
            <svg viewBox="0 0 280 60" className="card-spline-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="ethGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,44 C 40,48 70,30 110,38 C 150,46 180,22 220,26 C 250,30 270,18 280,20 L 280,60 L 0,60 Z"
                fill="url(#ethGradient)"
              />
              <path
                d="M 0,44 C 40,48 70,30 110,38 C 150,46 180,22 220,26 C 250,30 270,18 280,20"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="280" cy="20" r="3.5" fill="#a5b4fc" />
            </svg>
          </div>
        </div>

        {/* Card 2: Kelembaban Relatif (BNB Chain Style) */}
        <div className="crypto-stat-card card-bnb">
          <div className="card-top-row">
            <div className="asset-info-badge">
              <div className="asset-icon-circle icon-bnb">
                <Droplets size={15} color="#fbbf24" />
              </div>
              <div className="asset-labels">
                <span className="asset-category">Sensor DHT22</span>
                <span className="asset-name">Kelembaban (%)</span>
              </div>
            </div>
            <div className="card-arrow-btn">
              <ArrowUpRight size={15} />
            </div>
          </div>

          <div className="card-metric-body">
            <span className="metric-rate-label">Kelembaban Relatif</span>
            <div className="metric-big-val-row">
              <span className="metric-big-val">{humidityVal}%</span>
            </div>
            <div className="metric-badges-row">
              <span className="trend-badge positive">
                <TrendingUp size={11} />
                <span>Optimal Tropis</span>
              </span>
              <span className="asset-secondary-tag">Feels: {feelsLike}</span>
            </div>
          </div>

          {/* Glowing Spline Chart 2 */}
          <div className="card-spline-wrap">
            <svg viewBox="0 0 280 60" className="card-spline-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="bnbGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,38 C 45,34 80,48 120,40 C 160,32 195,46 235,32 C 255,24 270,26 280,28 L 280,60 L 0,60 Z"
                fill="url(#bnbGradient)"
              />
              <path
                d="M 0,38 C 45,34 80,48 120,40 C 160,32 195,46 235,32 C 255,24 270,26 280,28"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="280" cy="28" r="3.5" fill="#fde047" />
            </svg>
          </div>
        </div>

        {/* Card 3: Tekanan Udara (Polygon / Matic Style) */}
        <div className="crypto-stat-card card-matic">
          <div className="card-top-row">
            <div className="asset-info-badge">
              <div className="asset-icon-circle icon-matic">
                <Gauge size={15} color="#c084fc" />
              </div>
              <div className="asset-labels">
                <span className="asset-category">Sensor BMP280</span>
                <span className="asset-name">Tekanan (hPa)</span>
              </div>
            </div>
            <div className="card-arrow-btn">
              <ArrowUpRight size={15} />
            </div>
          </div>

          <div className="card-metric-body">
            <span className="metric-rate-label">Tekanan Barometer</span>
            <div className="metric-big-val-row">
              <span className="metric-big-val">{pressureVal}</span>
            </div>
            <div className="metric-badges-row">
              <span className="trend-badge warning">
                <TrendingDown size={11} />
                <span>1.00 atm (Stabil)</span>
              </span>
              <span className="asset-secondary-tag">Elevasi: 15m dpl</span>
            </div>
          </div>

          {/* Glowing Spline Chart 3 */}
          <div className="card-spline-wrap">
            <svg viewBox="0 0 280 60" className="card-spline-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="maticGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,28 C 35,24 75,44 115,48 C 155,52 195,30 235,38 C 255,42 270,36 280,34 L 280,60 L 0,60 Z"
                fill="url(#maticGradient)"
              />
              <path
                d="M 0,28 C 35,24 75,44 115,48 C 155,52 195,30 235,38 C 255,42 270,36 280,34"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="280" cy="34" r="3.5" fill="#fb7185" />
            </svg>
          </div>
        </div>

        {/* Card 4: Random Forest ML Weather Prediction */}
        <div className="hero-action-purple-card">
          <div className="purple-card-stars-overlay" />
          <div className="purple-card-content">
            <div className="purple-card-top-row">
              <div className="purple-card-brand">
                <Sparkles size={16} color="#c084fc" />
                <span className="purple-brand-name">Aetheris AI</span>
              </div>
              <span className="purple-new-pill" style={{ background: 'rgba(168, 85, 247, 0.25)', border: '1px solid rgba(192, 132, 252, 0.4)' }}>
                Random Forest ML
              </span>
            </div>

            <div className="purple-card-text-block">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Prediksi Klasifikasi Cuaca
                </span>
                <span style={{ fontSize: '10px', color: '#a855f7', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                  Akurasi 99.8%
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '4px 0 8px 0' }}>
                <h3 className="purple-card-heading" style={{ fontSize: '24px', margin: 0, color: '#f3e8ff' }}>
                  {humidityVal >= 85 ? '🌧️ Hujan' : humidityVal >= 75 ? '⛅ Berawan' : '☀️ Cerah'}
                </h3>
                <span style={{ fontSize: '12px', color: '#e9d5ff', fontWeight: 500 }}>
                  (Keyakinan: 100%)
                </span>
              </div>

              <p className="purple-card-desc" style={{ fontSize: '12px', lineHeight: 1.4, color: 'rgba(233, 213, 255, 0.8)' }}>
                Model terlatih dengan dataset 10 tahun NASA POWER. Memprediksi kondisi cuaca real-time dari sensor Suhu & Kelembapan.
              </p>
            </div>

            <div className="purple-card-buttons-stack" style={{ marginTop: '10px' }}>
              <button
                type="button"
                className="purple-btn-primary"
                onClick={onOpenThresholdModal}
              >
                <span>Konfigurasi Ambang Alarm</span>
                <Sliders size={14} />
              </button>
              <button
                type="button"
                className="purple-btn-secondary"
                onClick={onInjectAnomaly}
              >
                <span>Uji Coba Anomali Sensor</span>
                <Zap size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
