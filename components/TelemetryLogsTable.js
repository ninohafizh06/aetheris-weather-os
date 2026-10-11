'use client';

import { useState } from 'react';
import {
  Download,
  Database,
  Radio,
  Play,
  Pause,
  Zap,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function TelemetryLogsTable({
  logs = [],
  isStreaming = true,
  onToggleStreaming,
  onInjectAnomaly,
  lang = 'id'
}) {
  const [filterText, setFilterText] = useState('');

  const filteredLogs = logs.filter((log) =>
    log.stationId?.toLowerCase().includes(filterText.toLowerCase()) ||
    log.status?.toLowerCase().includes(filterText.toLowerCase()) ||
    log.timestamp?.includes(filterText)
  );

  const exportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['ID', 'Station_ID', 'Timestamp', 'Temperature_C', 'Humidity_Pct', 'Pressure_hPa', 'WindSpeed_kmh', 'WindDir_Deg', 'RainRate_mmh', 'PM25_ugm3', 'Battery_V', 'Status'];
    const rows = logs.map((l) => [
      l.id,
      l.stationId,
      l.timestamp,
      l.temperature,
      l.humidity,
      l.pressure,
      l.windSpeed,
      l.windDirection,
      l.rainRate,
      l.pm25,
      l.batteryVoltage,
      l.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `telemetri_cuaca_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    if (logs.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `telemetri_cuaca_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-card" id="telemetry-logs-card">
      <div className="card-title-row" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div className="card-title-wrap">
          <Database size={18} className="card-title-icon" color="var(--accent-cyan)" />
          <span className="card-title-text">
            {lang === 'id' ? 'Log Telemetri Stasiun Sensor Real-time' : 'Real-time Telemetry Sensor Logs'}
          </span>
          <span className="status-badge-live" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
            {logs.length} {lang === 'id' ? 'Paket Terekam' : 'Packets'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Stream Pause / Play */}
          <button
            className="btn-glass"
            style={{ fontSize: '0.74rem', padding: '5px 10px' }}
            onClick={onToggleStreaming}
            title={isStreaming ? 'Jeda Stream Sensor' : 'Lanjutkan Stream Sensor'}
          >
            {isStreaming ? (
              <>
                <Pause size={13} color="#f59e0b" />
                <span>{lang === 'id' ? 'Jeda Stream' : 'Pause'}</span>
              </>
            ) : (
              <>
                <Play size={13} color="#10b981" />
                <span>{lang === 'id' ? 'Lanjutkan' : 'Resume'}</span>
              </>
            )}
          </button>

          {/* Anomaly Injection Simulation */}
          <button
            className="btn-glass"
            style={{ fontSize: '0.74rem', padding: '5px 10px' }}
            onClick={onInjectAnomaly}
            title="Simulasi lonjakan badai petir & hujan lebat mendadak"
          >
            <Zap size={13} color="#ec4899" />
            <span>{lang === 'id' ? 'Injeksi Anomali' : 'Inject Anomaly'}</span>
          </button>

          {/* CSV Export */}
          <button
            className="btn-glass active-glow"
            style={{ fontSize: '0.74rem', padding: '5px 10px' }}
            onClick={exportCSV}
            title="Download CSV untuk analisis data tugas akhir / skripsi"
          >
            <Download size={13} />
            <span>CSV</span>
          </button>

          {/* JSON Export */}
          <button
            className="btn-glass"
            style={{ fontSize: '0.74rem', padding: '5px 10px' }}
            onClick={exportJSON}
            title="Download JSON Payload"
          >
            <Download size={13} />
            <span>JSON</span>
          </button>
        </div>
      </div>

      <div className="telemetry-table-wrapper">
        <table className="telemetry-table">
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Node ID</th>
              <th>Suhu</th>
              <th>Kelembaban</th>
              <th>Tekanan</th>
              <th>Angin</th>
              <th>Hujan</th>
              <th>PM2.5</th>
              <th>Baterai</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.slice(0, 10).map((l, idx) => (
              <tr key={idx}>
                <td style={{ color: '#93c5fd' }}>{l.timestamp}</td>
                <td style={{ color: '#cbd5e1' }}>{l.stationId}</td>
                <td style={{ color: '#fb923c', fontWeight: 600 }}>{l.temperature}°C</td>
                <td style={{ color: '#38bdf8' }}>{l.humidity}%</td>
                <td>{l.pressure} hPa</td>
                <td>{l.windSpeed} km/h</td>
                <td style={{ color: l.rainRate > 0 ? '#38bdf8' : '#64748b' }}>
                  {l.rainRate > 0 ? `${l.rainRate} mm` : '0 mm'}
                </td>
                <td style={{ color: l.pm25 > 50 ? '#ef4444' : '#34d399' }}>{l.pm25} µg</td>
                <td style={{ color: '#34d399' }}>{l.batteryVoltage}V</td>
                <td>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      background:
                        l.status === 'CRITICAL'
                          ? 'rgba(239, 68, 68, 0.2)'
                          : l.status === 'WARNING'
                          ? 'rgba(245, 158, 11, 0.2)'
                          : 'rgba(16, 185, 129, 0.15)',
                      color:
                        l.status === 'CRITICAL'
                          ? '#f87171'
                          : l.status === 'WARNING'
                          ? '#fbbf24'
                          : '#34d399',
                      border: `1px solid ${
                        l.status === 'CRITICAL'
                          ? 'rgba(239, 68, 68, 0.4)'
                          : l.status === 'WARNING'
                          ? 'rgba(245, 158, 11, 0.4)'
                          : 'rgba(16, 185, 129, 0.3)'
                      }`
                    }}
                  >
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
