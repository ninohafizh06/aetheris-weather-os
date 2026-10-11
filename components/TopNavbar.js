'use client';

import { useState } from 'react';
import {
  CloudSun,
  Search,
  Bell,
  Settings,
  ChevronDown,
  ChevronsUpDown,
  Zap,
  Radio,
  Cpu,
  ShieldAlert
} from 'lucide-react';

export default function TopNavbar({
  activeMode,
  onInjectAnomaly,
  onOpenThresholdModal,
  alertCount = 0,
  searchQuery,
  onSearchChange,
  stationName = 'ESP32-NODE-01'
}) {
  return (
    <nav className="top-navbar" id="top-navbar">
      {/* Brand & Workspace Title */}
      <div className="top-navbar-brand">
        <div className="brand-badge-icon">
          <CloudSun size={20} strokeWidth={2.4} color="#f8fafc" />
        </div>
        <div className="brand-text-stack">
          <div className="brand-title-row">
            <span className="brand-name">Aetheris<sup>®</sup></span>
          </div>
          <span className="brand-subtext">Weather & IoT OS</span>
        </div>
        <ChevronsUpDown size={14} className="brand-chevron" />
      </div>

      {/* Operator Profile */}
      <div className="top-navbar-center">
        <div className="operator-profile-pill">
          <div className="operator-avatar">
            <Radio size={14} color="#a855f7" />
            <span className="online-indicator-dot" />
          </div>
          <div className="operator-meta">
            <div className="operator-tag-row">
              <span className="operator-handle">@esp32-node1</span>
              <span className="pro-badge">PRO</span>
            </div>
            <span className="operator-name">Lab IoT Capstone</span>
          </div>
        </div>

        {/* Action Button: Injeksi Anomali */}
        <button
          type="button"
          className="navbar-deposit-btn"
          id="btn-navbar-inject-anomaly"
          onClick={onInjectAnomaly}
          title="Simulasi lonjakan badai petir / anomali sensor untuk pengujian"
        >
          <Zap size={15} className="deposit-btn-icon" />
          <span>Injeksi Anomali</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="top-navbar-right">
        {/* Alerts Bell */}
        <button
          type="button"
          className="navbar-icon-btn alert-bell-btn"
          onClick={onOpenThresholdModal}
          title="Peringatan Dini & Konfigurasi Alarm"
        >
          <Bell size={16} />
          {alertCount > 0 && <span className="alert-count-badge">{alertCount}</span>}
        </button>

        {/* Search Input */}
        <div className="navbar-search-box">
          <input
            type="text"
            placeholder="Search kota / sensor..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="navbar-search-input"
          />
          <Search size={14} className="navbar-search-icon" />
        </div>

        {/* Settings Button */}
        <button
          type="button"
          className="navbar-settings-btn"
          onClick={onOpenThresholdModal}
          title="Pengaturan Ambang Batas Sensor"
        >
          <span>Settings</span>
          <Settings size={15} />
        </button>
      </div>
    </nav>
  );
}
