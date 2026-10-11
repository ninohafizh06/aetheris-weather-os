'use client';

import { useState } from 'react';
import { AreaChart, Droplets, Wind, Thermometer, Gauge } from 'lucide-react';

export default function HourlyForecastChart({ hourly = [], unit = 'C', lang = 'id' }) {
  const [activeTab, setActiveTab] = useState('temp');
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!hourly || hourly.length === 0) return null;

  // Take the next 16-20 hours for optimal density
  const data = hourly.slice(0, 18);

  const getMetricConfig = () => {
    switch (activeTab) {
      case 'rain':
        return {
          title: lang === 'id' ? 'Probabilitas Presipitasi Hujan' : 'Precipitation Probability',
          unit: '%',
          getValue: (d) => d.rainProbability,
          min: 0,
          max: 100,
          color: '#38bdf8',
          gradientStart: 'rgba(56, 189, 248, 0.4)',
          gradientEnd: 'rgba(56, 189, 248, 0.0)'
        };
      case 'wind':
        return {
          title: lang === 'id' ? 'Kecepatan Angin Horisontal' : 'Horizontal Wind Speed',
          unit: 'km/h',
          getValue: (d) => d.windSpeed,
          min: 0,
          max: Math.max(...data.map((d) => d.windSpeed), 30),
          color: '#93c5fd',
          gradientStart: 'rgba(147, 197, 253, 0.35)',
          gradientEnd: 'rgba(147, 197, 253, 0.0)'
        };
      case 'hum':
        return {
          title: lang === 'id' ? 'Tingkat Kelembaban Relatif' : 'Relative Humidity',
          unit: '%',
          getValue: (d) => d.humidity,
          min: 40,
          max: 100,
          color: '#34d399',
          gradientStart: 'rgba(52, 211, 153, 0.35)',
          gradientEnd: 'rgba(52, 211, 153, 0.0)'
        };
      default: // 'temp'
        return {
          title: lang === 'id' ? 'Prediksi Fluktuasi Suhu' : 'Hourly Temperature Curve',
          unit: `°${unit}`,
          getValue: (d) => (unit === 'F' ? Math.round((d.temperature * 9) / 5 + 32) : d.temperature),
          min: Math.min(...data.map((d) => (unit === 'F' ? Math.round((d.temperature * 9) / 5 + 32) : d.temperature))) - 2,
          max: Math.max(...data.map((d) => (unit === 'F' ? Math.round((d.temperature * 9) / 5 + 32) : d.temperature))) + 2,
          color: '#fb923c',
          gradientStart: 'rgba(251, 146, 60, 0.45)',
          gradientEnd: 'rgba(251, 146, 60, 0.0)'
        };
    }
  };

  const config = getMetricConfig();
  const width = 800;
  const height = 180;
  const paddingX = 35;
  const paddingY = 25;

  const points = data.map((d, index) => {
    const val = config.getValue(d);
    const x = paddingX + (index / (data.length - 1)) * (width - paddingX * 2);
    const range = config.max - config.min || 1;
    const y = height - paddingY - ((val - config.min) / range) * (height - paddingY * 2);
    return { x, y, val, d, index };
  });

  // Generate SVG Catmull-Rom or Bezier smooth curve path
  const generateSmoothPath = (pts) => {
    if (pts.length < 2) return '';
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  };

  const linePath = generateSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

  const hoveredPoint = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="glass-card" id="hourly-forecast-chart-card">
      <div className="chart-controls-row">
        <div className="card-title-wrap">
          <span className="card-title-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: config.color }} />
            {config.title} (24 Jam)
          </span>
        </div>

        <div className="chart-tabs-group">
          <button
            className={`chart-tab-btn ${activeTab === 'temp' ? 'active' : ''}`}
            onClick={() => setActiveTab('temp')}
          >
            {lang === 'id' ? 'Suhu' : 'Temp'}
          </button>
          <button
            className={`chart-tab-btn ${activeTab === 'rain' ? 'active' : ''}`}
            onClick={() => setActiveTab('rain')}
          >
            {lang === 'id' ? 'Peluang Hujan' : 'Rain'}
          </button>
          <button
            className={`chart-tab-btn ${activeTab === 'wind' ? 'active' : ''}`}
            onClick={() => setActiveTab('wind')}
          >
            {lang === 'id' ? 'Angin' : 'Wind'}
          </button>
          <button
            className={`chart-tab-btn ${activeTab === 'hum' ? 'active' : ''}`}
            onClick={() => setActiveTab('hum')}
          >
            {lang === 'id' ? 'Kelembaban' : 'Humidity'}
          </button>
        </div>
      </div>

      <div className="svg-chart-container">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={config.gradientStart} />
              <stop offset="100%" stopColor={config.gradientEnd} />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />

          {/* Area fill */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Line curve */}
          <path d={linePath} fill="none" stroke={config.color} strokeWidth="2.8" strokeLinecap="round" />

          {/* Points & Hover Target */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#0f172a"
                stroke={config.color}
                strokeWidth="2"
              />
              {/* Invisible larger hover hotspot */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r="18"
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoverIndex(i)}
              />
            </g>
          ))}

          {/* Hover highlight indicator */}
          {hoveredPoint && (
            <g>
              <line
                x1={hoveredPoint.x}
                y1={paddingY}
                x2={hoveredPoint.x}
                y2={height - paddingY}
                stroke="rgba(255,255,255,0.4)"
                strokeDasharray="2 2"
                strokeWidth="1.5"
              />
              <circle
                cx={hoveredPoint.x}
                cy={hoveredPoint.y}
                r="6"
                fill={config.color}
                stroke="#ffffff"
                strokeWidth="2.5"
              />
            </g>
          )}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              top: Math.max(0, hoveredPoint.y - 45),
              left: Math.min(width - 90, Math.max(10, (hoveredPoint.x / width) * 100)),
              transform: 'translateX(-50%)',
              background: 'rgba(15, 23, 42, 0.95)',
              border: `1px solid ${config.color}`,
              boxShadow: `0 4px 14px ${config.gradientStart}`,
              padding: '4px 10px',
              borderRadius: '8px',
              pointerEvents: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#ffffff',
              fontFamily: 'var(--font-mono)',
              whiteSpace: 'nowrap',
              zIndex: 10
            }}
          >
            {hoveredPoint.d.time}: {hoveredPoint.val} {config.unit}
          </div>
        )}
      </div>

      {/* Time Axis Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 14px 0 14px', fontSize: '0.72rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
        {points.filter((_, i) => i % 3 === 0).map((pt, idx) => (
          <span key={idx}>{pt.d.time}</span>
        ))}
      </div>
    </div>
  );
}
