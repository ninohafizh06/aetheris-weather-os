'use client';

import { useState, useRef, useEffect } from 'react';
import {
  CloudSun,
  Search,
  MapPin,
  Cpu,
  Globe2,
  Sliders,
  Code2,
  Maximize2,
  Minimize2,
  RefreshCw,
  Navigation
} from 'lucide-react';
import { POPULAR_CITIES } from '../lib/weatherData';

export default function Header({
  selectedCity,
  onSelectCity,
  onUseCurrentLocation,
  isGeoLoading,
  activeMode,
  onChangeMode,
  unit,
  onToggleUnit,
  lang,
  onToggleLang,
  onRefresh,
  isRefreshing,
  onOpenHardwareModal,
  onOpenThresholdModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <header className="header-glass" id="weather-dashboard-header">
      <div className="brand-wrapper">
        <div className="brand-icon-box">
          <CloudSun size={26} strokeWidth={2.2} />
        </div>
        <div className="brand-meta">
          <h1>
            AETHERIS
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
              WEATHER OS
            </span>
          </h1>
          <div className="brand-subline">
            <span className="status-badge-live">
              <span className="pulsing-dot" />
              {activeMode === 'iot'
                ? (lang === 'id' ? 'ESP32 NODE AKTIF' : 'ESP32 NODE LIVE')
                : (lang === 'id' ? 'BMKG / SATELIT LIVE' : 'METEO SATELLITE LIVE')}
            </span>
            <span style={{ opacity: 0.6 }}>•</span>
            <span>CAPSTONE PROJECT v2.5</span>
          </div>
        </div>
      </div>

      <div className="header-actions">
        {/* City Search & Dropdown (When in Meteo Mode) */}
        {activeMode === 'meteo' && (
          <div className="city-search-box" ref={dropdownRef}>
            <Search size={15} className="city-search-icon" />
            <input
              type="text"
              id="city-search-input"
              className="city-search-input"
              placeholder={lang === 'id' ? 'Cari Kota / Wilayah...' : 'Search City / Region...'}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />
            {isDropdownOpen && (
              <div className="city-dropdown-menu">
                <div style={{ padding: '4px 8px 8px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {lang === 'id' ? 'PILIH WILAYAH INDONESIA & GLOBAL' : 'SELECT REGION'}
                </div>
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    className={`city-dropdown-item ${selectedCity.name === city.name ? 'active' : ''}`}
                    onClick={() => {
                      onSelectCity(city);
                      setIsDropdownOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <span>{city.name}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{city.province}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GPS Geolocation Button */}
        {activeMode === 'meteo' && (
          <button
            className="btn-glass"
            id="btn-geolocation"
            title={lang === 'id' ? 'Deteksi Lokasi GPS Saya' : 'Detect My Location'}
            onClick={onUseCurrentLocation}
            disabled={isGeoLoading}
          >
            <Navigation size={15} className={isGeoLoading ? 'spin-anim' : ''} />
            <span>
              {isGeoLoading ? (lang === 'id' ? 'Mencari...' : 'Locating...') : 'GPS'}
            </span>
          </button>
        )}

        {/* Mode Selector Toggle */}
        <div className="mode-toggle-group" id="feed-mode-toggle">
          <button
            className={`mode-toggle-btn ${activeMode === 'meteo' ? 'active' : ''}`}
            id="mode-btn-meteo"
            onClick={() => onChangeMode('meteo')}
            title="Data Meteorologi Satelit & Stasiun Wilayah"
          >
            <Globe2 size={14} />
            <span>{lang === 'id' ? 'Stasiun BMKG' : 'Regional Meteo'}</span>
          </button>
          <button
            className={`mode-toggle-btn ${activeMode === 'iot' ? 'active' : ''}`}
            id="mode-btn-iot"
            onClick={() => onChangeMode('iot')}
            title="Telemetri Stasiun Cuaca IoT ESP32 Capstone"
          >
            <Cpu size={14} />
            <span>{lang === 'id' ? 'Node Sensor IoT' : 'IoT Node'}</span>
          </button>
        </div>

        {/* Unit Toggle (°C / °F) */}
        <button
          className="btn-glass"
          id="btn-unit-toggle"
          onClick={onToggleUnit}
          title="Ganti Satuan Suhu"
        >
          <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
            °{unit}
          </span>
        </button>

        {/* Language Toggle (ID / EN) */}
        <button
          className="btn-glass"
          id="btn-lang-toggle"
          onClick={onToggleLang}
          title="Ganti Bahasa"
        >
          <span style={{ fontWeight: 600, fontSize: '0.78rem' }}>
            {lang.toUpperCase()}
          </span>
        </button>

        {/* Threshold Alerts Config Modal */}
        <button
          className="btn-glass"
          id="btn-threshold-settings"
          onClick={onOpenThresholdModal}
          title={lang === 'id' ? 'Pengaturan Ambang Batas Alarm' : 'Alert Thresholds'}
        >
          <Sliders size={15} />
        </button>

        {/* ESP32 Arduino Hardware Code Modal */}
        <button
          className="btn-glass active-glow"
          id="btn-hardware-docs"
          onClick={onOpenHardwareModal}
          title={lang === 'id' ? 'Integrasi Hardware ESP32 & Source Code' : 'ESP32 Code & API'}
        >
          <Code2 size={15} />
          <span>{lang === 'id' ? 'Hardware IoT' : 'IoT Code'}</span>
        </button>

        {/* Refresh Button */}
        <button
          className="btn-glass"
          id="btn-refresh-data"
          onClick={onRefresh}
          title={lang === 'id' ? 'Perbarui Data Sekarang' : 'Refresh Data'}
          disabled={isRefreshing}
        >
          <RefreshCw size={15} className={isRefreshing ? 'spin-anim' : ''} />
        </button>

        {/* Fullscreen Kiosk Mode */}
        <button
          className="btn-glass"
          id="btn-toggle-fullscreen"
          onClick={toggleFullscreen}
          title={lang === 'id' ? 'Layar Penuh (Mode Kiosk / Monitor)' : 'Toggle Fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>

      <style jsx>{`
        .spin-anim {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}
