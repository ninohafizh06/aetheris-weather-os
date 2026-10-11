'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, X, Volume2, VolumeX } from 'lucide-react';

export default function AlertBanner({ alerts = [], soundEnabled = false, onToggleSound }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (alerts.length > 0 && soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // Audio policy ignore
      }
    }
  }, [alerts, soundEnabled]);

  if (!alerts || alerts.length === 0 || dismissed) {
    return null;
  }

  const primaryAlert = alerts[0];

  return (
    <div className="alert-banner" id="weather-alert-banner" role="alert">
      <div className="alert-content-wrap">
        <span className="alert-badge">
          <AlertTriangle size={14} />
          {primaryAlert.level || 'PERINGATAN DINI'}
        </span>
        <div className="alert-text">
          <strong>{primaryAlert.title}:</strong> {primaryAlert.message}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="btn-glass"
          style={{ padding: '4px 8px', fontSize: '0.72rem' }}
          onClick={onToggleSound}
          title={soundEnabled ? 'Matikan Suara Alarm' : 'Aktifkan Suara Alarm'}
        >
          {soundEnabled ? <Volume2 size={14} color="#fca5a5" /> : <VolumeX size={14} />}
        </button>
        <button
          className="btn-glass"
          style={{ padding: '4px 8px' }}
          onClick={() => setDismissed(true)}
          title="Tutup Peringatan"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
