'use client';

import {
  Wind,
  CloudRain,
  SunMedium,
  BatteryCharging,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import { getUVStatus } from '../lib/weatherData';

export default function BottomMetricsRow({ weatherData, lang = 'id' }) {
  const current = weatherData?.current || {};
  const windSpeed = current.windSpeed ?? 14.5;
  const rainRate = current.rainRate ?? 0.0;
  const uvIndex = current.uvIndex ?? 5.8;
  const batteryVoltage = current.batteryVoltage ?? 4.14;
  const uvInfo = getUVStatus(uvIndex, lang);

  return (
    <div className="bottom-metrics-row">
      {/* Box 1: Kecepatan Angin */}
      <div className="bottom-stat-box">
        <div className="bottom-stat-header">
          <span className="bottom-stat-title">Kecepatan Angin</span>
          <span className="bottom-stat-period">24H</span>
        </div>
        <div className="bottom-stat-val-row">
          <span className="bottom-stat-val">{windSpeed.toFixed(1)} km/h</span>
          <span className="bottom-stat-trend positive">
            <TrendingUp size={12} />
            <span>+1.2</span>
          </span>
        </div>
      </div>

      {/* Box 2: Curah Hujan */}
      <div className="bottom-stat-box">
        <div className="bottom-stat-header">
          <span className="bottom-stat-title">Curah Hujan (Rain Rate)</span>
          <span className="bottom-stat-period">24H</span>
        </div>
        <div className="bottom-stat-val-row">
          <span className="bottom-stat-val">{rainRate.toFixed(1)} mm/j</span>
          <span className="bottom-stat-trend neutral">
            <span>0.00%</span>
          </span>
        </div>
      </div>

      {/* Box 3: Indeks Radiasi UV */}
      <div className="bottom-stat-box">
        <div className="bottom-stat-header">
          <span className="bottom-stat-title">Indeks Radiasi UV</span>
          <span className="bottom-stat-period">24H</span>
        </div>
        <div className="bottom-stat-val-row">
          <span className="bottom-stat-val">{uvIndex.toFixed(1)} UV</span>
          <span className="bottom-stat-trend" style={{ color: uvInfo.color }}>
            <span>{uvInfo.status}</span>
          </span>
        </div>
      </div>

      {/* Box 4: Tegangan Node ESP32 / Baterai */}
      <div className="bottom-stat-box">
        <div className="bottom-stat-header">
          <span className="bottom-stat-title">Status Daya & Baterai Node</span>
          <span className="bottom-stat-period">Li-ion</span>
        </div>
        <div className="bottom-stat-val-row">
          <span className="bottom-stat-val">{batteryVoltage.toFixed(2)} V</span>
          <div className="battery-dots-indicator">
            <span className="batt-dot filled" />
            <span className="batt-dot filled" />
            <span className="batt-dot filled" />
            <span className="batt-dot filled" />
          </div>
        </div>
      </div>
    </div>
  );
}
