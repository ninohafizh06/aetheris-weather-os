'use client';

import { X, Sliders, Bell, Volume2, VolumeX, Check } from 'lucide-react';

export default function ThresholdModal({
  isOpen,
  onClose,
  thresholds,
  onSaveThresholds,
  soundEnabled,
  onToggleSound,
  lang = 'id'
}) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updated = {
      maxTemp: parseFloat(formData.get('maxTemp')),
      maxWind: parseFloat(formData.get('maxWind')),
      maxRain: parseFloat(formData.get('maxRain')),
      maxPM25: parseFloat(formData.get('maxPM25'))
    };
    onSaveThresholds(updated);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Sliders size={20} color="var(--accent-cyan)" />
            <span>{lang === 'id' ? 'Konfigurasi Batas Alarm Cuaca' : 'Alert Threshold Settings'}</span>
          </div>
          <button className="btn-glass" style={{ padding: '6px' }} onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {lang === 'id'
                ? 'Sistem akan memicu peringatan visual dan audio darurat saat nilai telemetri sensor melampaui batas yang ditentukan.'
                : 'The system triggers visual and audible alerts when sensor telemetry exceeds specified thresholds.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                  {lang === 'id' ? 'Batas Suhu Tinggi (°C)' : 'Max Temperature Alert (°C)'}
                </label>
                <input
                  type="number"
                  name="maxTemp"
                  step="0.5"
                  defaultValue={thresholds.maxTemp}
                  className="city-search-input"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                  {lang === 'id' ? 'Batas Kecepatan Angin (km/h)' : 'Max Wind Speed Alert (km/h)'}
                </label>
                <input
                  type="number"
                  name="maxWind"
                  step="1"
                  defaultValue={thresholds.maxWind}
                  className="city-search-input"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                  {lang === 'id' ? 'Batas Intensitas Hujan Deras (mm/jam)' : 'Max Rain Rate Alert (mm/h)'}
                </label>
                <input
                  type="number"
                  name="maxRain"
                  step="0.5"
                  defaultValue={thresholds.maxRain}
                  className="city-search-input"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                  {lang === 'id' ? 'Batas Partikulat Polusi PM2.5 (µg/m³)' : 'Max PM2.5 Pollution (µg/m³)'}
                </label>
                <input
                  type="number"
                  name="maxPM25"
                  step="1"
                  defaultValue={thresholds.maxPM25}
                  className="city-search-input"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.84rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {soundEnabled ? <Volume2 size={16} color="#34d399" /> : <VolumeX size={16} color="var(--text-dim)" />}
                  {lang === 'id' ? 'Bunyikan Alarm Audio' : 'Sound Alarm'}
                </span>
                <button
                  type="button"
                  className={`btn-glass ${soundEnabled ? 'active-glow' : ''}`}
                  onClick={onToggleSound}
                  style={{ fontSize: '0.78rem' }}
                >
                  {soundEnabled ? (lang === 'id' ? 'Aktif' : 'Enabled') : (lang === 'id' ? 'Bisu' : 'Muted')}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn-glass" onClick={onClose}>
                {lang === 'id' ? 'Batal' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="btn-glass active-glow"
                style={{ background: 'linear-gradient(135deg, #0284c7, #2563eb)', color: '#ffffff', fontWeight: 600 }}
              >
                <Check size={14} />
                <span>{lang === 'id' ? 'Simpan Konfigurasi' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
