'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Activity,
  LineChart,
  Calculator,
  ExternalLink,
  Cpu,
  ChevronDown,
  ChevronUp,
  Zap,
  Radio,
  MapPin,
  Flame,
  Droplets,
  CloudSun
} from 'lucide-react';
import { POPULAR_CITIES } from '../lib/weatherData';

export default function Sidebar({
  activeMode,
  onChangeMode,
  selectedCity,
  onSelectCity,
  onOpenHardwareModal,
  activeNav = 'dashboard',
  onSelectNav
}) {
  const [isStationsOpen, setIsStationsOpen] = useState(true);

  // Curated 6 primary monitoring stations matching the reference image's 6 active stakings
  const stations = [
    {
      id: 'iot-node1',
      name: 'ESP32 Node 01',
      sub: 'Lab Hardware IoT',
      temp: '29.8°C',
      color: '#a855f7',
      isIot: true
    },
    {
      id: 'jkt',
      name: 'DKI Jakarta',
      sub: 'Stasiun BMKG Pusat',
      temp: '31.4°C',
      color: '#38bdf8',
      cityObj: POPULAR_CITIES.find((c) => c.id === 'jkt')
    },
    {
      id: 'bdg',
      name: 'Bandung',
      sub: 'Stasiun Geofisika',
      temp: '24.2°C',
      color: '#f43f5e',
      cityObj: POPULAR_CITIES.find((c) => c.id === 'bdg')
    },
    {
      id: 'sby',
      name: 'Surabaya',
      sub: 'Stasiun Maritim',
      temp: '33.1°C',
      color: '#eab308',
      cityObj: POPULAR_CITIES.find((c) => c.id === 'sby')
    },
    {
      id: 'mdn',
      name: 'Medan',
      sub: 'Stasiun Klimatologi',
      temp: '28.5°C',
      color: '#10b981',
      cityObj: POPULAR_CITIES.find((c) => c.id === 'mdn')
    },
    {
      id: 'dps',
      name: 'Denpasar',
      sub: 'Stasiun Ngurah Rai',
      temp: '30.1°C',
      color: '#6366f1',
      cityObj: POPULAR_CITIES.find((c) => c.id === 'dps')
    }
  ];

  return (
    <aside className="dashboard-sidebar" id="dashboard-sidebar">
      {/* Top Segmented Mode Control */}
      <div className="sidebar-mode-toggle-wrap">
        <div className="sidebar-mode-toggle">
          <button
            type="button"
            className={`mode-toggle-pill ${activeMode === 'meteo' ? 'active' : ''}`}
            onClick={() => onChangeMode('meteo')}
          >
            <span>BMKG Satelit</span>
          </button>
          <button
            type="button"
            className={`mode-toggle-pill ${activeMode === 'iot' ? 'active' : ''}`}
            onClick={() => onChangeMode('iot')}
          >
            <span>IoT ESP32</span>
          </button>
        </div>
      </div>

      {/* Primary Navigation Menu */}
      <div className="sidebar-nav-section">
        <button
          type="button"
          className={`sidebar-nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
          onClick={() => onSelectNav?.('dashboard')}
        >
          <div className="nav-item-content">
            <LayoutDashboard size={17} className="nav-item-icon" />
            <span className="nav-item-label">Dashboard</span>
          </div>
          {activeNav === 'dashboard' && <span className="nav-active-indicator" />}
        </button>

        <button
          type="button"
          className={`sidebar-nav-item ${activeNav === 'sensors' ? 'active' : ''}`}
          onClick={() => onSelectNav?.('sensors')}
        >
          <div className="nav-item-content">
            <Activity size={17} className="nav-item-icon" />
            <span className="nav-item-label">Sensors & Metrik</span>
          </div>
        </button>

        <button
          type="button"
          className={`sidebar-nav-item ${activeNav === 'analytics' ? 'active' : ''}`}
          onClick={() => onSelectNav?.('analytics')}
        >
          <div className="nav-item-content">
            <LineChart size={17} className="nav-item-icon" />
            <span className="nav-item-label">Grafik 24 Jam</span>
          </div>
        </button>

        <button
          type="button"
          className={`sidebar-nav-item ${activeNav === 'calculator' ? 'active' : ''}`}
          onClick={() => onSelectNav?.('calculator')}
        >
          <div className="nav-item-content">
            <Calculator size={17} className="nav-item-icon" />
            <span className="nav-item-label">Kalkulator Cuaca</span>
          </div>
        </button>

        <button
          type="button"
          className="sidebar-nav-item"
          onClick={onOpenHardwareModal}
        >
          <div className="nav-item-content">
            <ExternalLink size={17} className="nav-item-icon" />
            <span className="nav-item-label">REST Data API</span>
          </div>
          <span className="nav-link-arrow">↗</span>
        </button>

        <button
          type="button"
          className={`sidebar-nav-item ${activeNav === 'hardware' ? 'active' : ''}`}
          onClick={onOpenHardwareModal}
        >
          <div className="nav-item-content">
            <Cpu size={17} className="nav-item-icon" />
            <span className="nav-item-label">Hardware Node</span>
          </div>
          <span className="nav-pill-badge">ESP32</span>
        </button>
      </div>

      {/* Active Stations Section */}
      <div className="sidebar-stations-section">
        <div
          className="sidebar-section-header"
          onClick={() => setIsStationsOpen(!isStationsOpen)}
        >
          <div className="section-title-wrap">
            <Radio size={14} className="section-icon-radio" />
            <span className="section-title">Stasiun Cuaca Aktif</span>
            <span className="section-count-badge">6</span>
          </div>
          {isStationsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>

        {isStationsOpen && (
          <div className="sidebar-stations-list">
            {stations.map((st) => {
              const isSelected = st.isIot
                ? activeMode === 'iot'
                : selectedCity?.id === st.cityObj?.id;

              return (
                <div
                  key={st.id}
                  className={`station-item-pill ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    if (st.isIot) {
                      onChangeMode('iot');
                    } else if (st.cityObj) {
                      onChangeMode('meteo');
                      onSelectCity(st.cityObj);
                    }
                  }}
                >
                  <div className="station-avatar-mini" style={{ background: `${st.color}20`, borderColor: st.color }}>
                    {st.isIot ? (
                      <Zap size={13} color={st.color} />
                    ) : (
                      <MapPin size={13} color={st.color} />
                    )}
                  </div>
                  <div className="station-meta-mini">
                    <span className="station-name-mini">{st.name}</span>
                    <span className="station-sub-mini">{st.sub}</span>
                  </div>
                  <div className="station-val-mini" style={{ color: st.color }}>
                    {st.temp}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Promo/Hardware Status Card */}
      <div className="sidebar-bottom-promo" onClick={onOpenHardwareModal}>
        <div className="promo-icon-circle">
          <Zap size={16} color="#c084fc" />
        </div>
        <div className="promo-content">
          <span className="promo-title">Stasiun ESP32 Aktif</span>
          <span className="promo-subtitle">Lihat skema pin & kode firmware</span>
        </div>
      </div>
    </aside>
  );
}
