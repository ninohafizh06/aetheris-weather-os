'use client';

import { useState } from 'react';
import {
  Link2,
  Share2,
  ExternalLink,
  LineChart,
  RefreshCw,
  Plus,
  SlidersHorizontal,
  ChevronsUpDown,
  Sun,
  Moon,
  CloudSun,
  Flame,
  Wind,
  ShieldCheck,
  Droplets,
  Radio,
  MapPin,
  Clock
} from 'lucide-react';
import { getWindDirectionLabel, getBeaufortScale, getAQIStatus } from '../lib/weatherData';

export default function ActiveStationHero({
  weatherData,
  activeMode = 'meteo',
  unit = 'C',
  onToggleUnit,
  onRefresh,
  isRefreshing,
  onOpenHardwareModal,
  lang = 'id'
}) {
  const current = weatherData?.current || {};
  const solar = weatherData?.solar || {};

  // High precision display matching 31.39686 style
  const numericTemp = typeof current.temperature === 'number'
    ? (unit === 'F' ? ((current.temperature * 9) / 5 + 32).toFixed(4) : current.temperature.toFixed(4))
    : '29.8450';

  const windDirLabel = getWindDirectionLabel(current.windDirection ?? 140, lang);
  const beaufort = getBeaufortScale(current.windSpeed ?? 14.5, lang);
  const aqiInfo = getAQIStatus(current.pm25 ?? 18.2, lang);

  // Scrubber percentage for solar daylight progression
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const sunriseMinutes = 5 * 60 + 48; // 05:48
  const sunsetMinutes = 17 * 60 + 54; // 17:54
  const dayProgress = Math.min(100, Math.max(0, ((currentMinutes - sunriseMinutes) / (sunsetMinutes - sunriseMinutes)) * 100));

  return (
    <section className="active-station-section">
      {/* Top Header of the Section */}
      <div className="section-header-row">
        <h2 className="section-main-heading">Stasiun Pemantau Aktif</h2>
        <div className="active-card-top-icons">
          <button type="button" className="mini-icon-btn" title="Statistik Visual">
            <LineChart size={14} />
          </button>
          <button
            type="button"
            className={`mini-icon-btn ${isRefreshing ? 'spin' : ''}`}
            onClick={onRefresh}
            title="Muat Ulang Data"
          >
            <RefreshCw size={14} />
          </button>
          <button type="button" className="mini-icon-btn" title="Filter Parameter">
            <SlidersHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Main Large Split Card */}
      <div className="active-station-split-card">
        {/* Left Side: Station Details & Big Numeric Display */}
        <div className="station-card-left-panel">
          <div className="update-timestamp-row">
            <span>Pembaruan Terakhir — {current.updatedAt || 'Baru Saja'}</span>
            <Clock size={12} className="update-clock-icon" />
          </div>

          <div className="station-title-action-row">
            <div className="station-hero-title-group">
              <h3 className="station-hero-title">
                {activeMode === 'iot' ? 'ESP32 Weather Node' : weatherData?.city || 'Stasiun Cuaca'}
              </h3>
              <div className="station-hero-pill-badge">
                {activeMode === 'iot' ? (
                  <span className="station-badge-text">AVAX IoT</span>
                ) : (
                  <span className="station-badge-text">{weatherData?.province || 'Satelit'}</span>
                )}
              </div>
            </div>

            <div className="station-hero-actions-group">
              <button
                type="button"
                className="action-icon-pill"
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                title="Salin Link API"
              >
                <Link2 size={14} />
              </button>
              <button
                type="button"
                className="action-icon-pill"
                title="Bagikan Telemetri"
              >
                <Share2 size={14} />
              </button>
              <button
                type="button"
                className="action-profile-pill"
                onClick={onOpenHardwareModal}
              >
                <span>Lihat Profil Sensor</span>
                <ExternalLink size={13} />
              </button>
            </div>
          </div>

          {/* Huge Number & Action Buttons */}
          <div className="station-balance-wrap">
            <span className="balance-label">Suhu Udara & Indeks Termal Presisi (°{unit})</span>
            <div className="balance-numeric-row">
              <div className="balance-huge-val">
                {numericTemp}
              </div>
              <div className="balance-buttons-group">
                <button
                  type="button"
                  className="balance-btn-upgrade"
                  onClick={onToggleUnit}
                  title="Ganti Satuan Suhu"
                >
                  Beralih ke °{unit === 'C' ? 'F' : 'C'}
                </button>
                <button
                  type="button"
                  className="balance-btn-unstake"
                  onClick={onRefresh}
                >
                  Sinkronisasi
                </button>
              </div>
            </div>
          </div>

          {/* 4 Metadata Tags with Chevrons Up/Down */}
          <div className="station-meta-tags-grid">
            <div className="meta-tag-item">
              <div className="meta-tag-label-row">
                <span className="meta-tag-title">Arah & Dinamika Angin</span>
                <ChevronsUpDown size={12} className="meta-chevron" />
              </div>
              <span className="meta-tag-val">{windDirLabel} • {beaufort.name}</span>
            </div>

            <div className="meta-tag-item">
              <div className="meta-tag-label-row">
                <span className="meta-tag-title">Kondisi Atmosfer</span>
                <ChevronsUpDown size={12} className="meta-chevron" />
              </div>
              <span className="meta-tag-val">{current.condition?.text || 'Cerah Berawan'}</span>
            </div>

            <div className="meta-tag-item">
              <div className="meta-tag-label-row">
                <span className="meta-tag-title">Kualitas Udara (AQI)</span>
                <ChevronsUpDown size={12} className="meta-chevron" />
              </div>
              <span className="meta-tag-val" style={{ color: aqiInfo.color }}>
                {aqiInfo.status} (PM2.5: {current.pm25 ?? 18.2})
              </span>
            </div>

            <div className="meta-tag-item">
              <div className="meta-tag-label-row">
                <span className="meta-tag-title">Intensitas Presipitasi</span>
                <ChevronsUpDown size={12} className="meta-chevron" />
              </div>
              <span className="meta-tag-val">
                {current.rainRate > 0 ? `${current.rainRate} mm/jam` : '0.0 mm/jam (Kering)'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Investment Period / Solar Arc Slider */}
        <div className="station-card-right-panel">
          <div className="period-header-row">
            <div className="period-titles">
              <h4 className="period-heading">Siklus Orbit Matahari (24 Jam)</h4>
              <span className="period-subtext">Waktu Siang Hari: 12 Jam 06 Menit</span>
            </div>
            <span className="period-badge-pill">Zenith Siang</span>
          </div>

          {/* Scrubber Timeline Bar */}
          <div className="period-slider-container">
            <div className="period-slider-labels">
              <span className="slider-label-left">Terbit: {solar.sunrise || '05:48'}</span>
              <span className="slider-label-right">Terbenam: {solar.sunset || '17:54'}</span>
            </div>

            <div className="period-track-wrap">
              <div
                className="period-track-fill"
                style={{ width: `${dayProgress}%` }}
              />
              <div
                className="period-scrubber-handle"
                style={{ left: `${dayProgress}%` }}
              >
                <div className="scrubber-inner-dot" />
              </div>
            </div>

            {/* Waveform / Visual Audio Equalizer Style Bars */}
            <div className="period-waveform-bars">
              {[18, 30, 45, 60, 75, 90, 100, 95, 80, 65, 50, 35, 20, 15].map((h, i) => (
                <div
                  key={i}
                  className="waveform-bar-col"
                  style={{
                    height: `${h}%`,
                    background: i === 6 ? '#a855f7' : 'rgba(168, 85, 247, 0.25)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
