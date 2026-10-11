'use client';

import { useState, useEffect } from 'react';
import { Sun, Sunset, Sunrise } from 'lucide-react';

export default function SolarCycleCard({ solarData, lang = 'id' }) {
  const sunrise = solarData?.sunrise || '05:48';
  const sunset = solarData?.sunset || '17:54';
  const daylight = solarData?.daylightHours || '12j 06m';

  // State to hold current time in minutes to prevent hydration/prerender mismatch
  const [currentMinutes, setCurrentMinutes] = useState(12 * 60);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const [riseH, riseM] = sunrise.split(':').map(Number);
  const [setH, setM] = sunset.split(':').map(Number);
  const sunriseMinutes = (riseH || 5) * 60 + (riseM || 48);
  const sunsetMinutes = (setH || 17) * 60 + (setM || 54);

  let progress = 0;
  if (currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes) {
    progress = (currentMinutes - sunriseMinutes) / (sunsetMinutes - sunriseMinutes);
  } else if (currentMinutes > sunsetMinutes) {
    progress = 1;
  }

  // Arc path math (SVG viewBox: 0 0 300 125, semi-ellipse from (30, 110) to (270, 110))
  const angle = Math.PI * (1 - progress);
  const cx = 150;
  const cy = 110;
  const rx = 120;
  const ry = 85;
  const sunX = cx + rx * Math.cos(angle);
  const sunY = cy - ry * Math.sin(angle);

  return (
    <div className="glass-card" id="solar-cycle-card">
      <div className="card-title-row">
        <div className="card-title-wrap">
          <Sun size={18} className="card-title-icon" color="#fbbf24" />
          <span className="card-title-text">
            {lang === 'id' ? 'Siklus Matahari & Efemeris' : 'Solar Arc & Ephemeris'}
          </span>
        </div>
        <span className="card-subtitle-tag">
          {lang === 'id' ? `Durasi Siang: ${daylight}` : `Daylight: ${daylight}`}
        </span>
      </div>

      <div className="sun-arc-container">
        <svg className="sun-arc-svg" viewBox="0 0 300 125">
          <defs>
            <linearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.2" />
            </linearGradient>
            <filter id="sunGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Horizon Line */}
          <line x1="15" y1="110" x2="285" y2="110" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* Trajectory Arc */}
          <path
            d="M 30,110 A 120,85 0 0,1 270,110"
            fill="none"
            stroke="url(#arcGlow)"
            strokeWidth="2.5"
            strokeDasharray="4 4"
          />

          {/* Sun Body & Aura */}
          {progress > 0 && progress < 1 && (
            <g transform={`translate(${sunX}, ${sunY})`} filter="url(#sunGlow)">
              <circle r="9" fill="#fbbf24" />
              <circle r="14" fill="#f59e0b" opacity="0.35" />
            </g>
          )}
        </svg>

        <div className="sun-times-row">
          <div className="sun-time-item">
            <span className="sun-time-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sunrise size={13} color="#f59e0b" />
              {lang === 'id' ? 'Terbit' : 'Sunrise'}
            </span>
            <span className="sun-time-value">{sunrise} WIB</span>
          </div>

          <div className="sun-time-item" style={{ alignItems: 'center' }}>
            <span className="sun-time-label">
              {lang === 'id' ? 'Tengah Hari (Zenith)' : 'Solar Noon'}
            </span>
            <span className="sun-time-value" style={{ color: '#ffffff' }}>11:51 WIB</span>
          </div>

          <div className="sun-time-item" style={{ alignItems: 'flex-end' }}>
            <span className="sun-time-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sunset size={13} color="#f97316" />
              {lang === 'id' ? 'Terbenam' : 'Sunset'}
            </span>
            <span className="sun-time-value" style={{ color: '#fb923c' }}>{sunset} WIB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
