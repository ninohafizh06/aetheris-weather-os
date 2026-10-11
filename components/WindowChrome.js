'use client';

import { Lock, ArrowLeft, ArrowRight, RotateCw, Plus, Minus, X } from 'lucide-react';

export default function WindowChrome({ title = 'aetheris.os — IoT Weather Station & Telemetry' }) {
  return (
    <div className="window-chrome-bar">
      <div className="window-traffic-lights">
        <span className="dot dot-close" />
        <span className="dot dot-min" />
        <span className="dot dot-max" />
        <div className="window-nav-arrows">
          <ArrowLeft size={13} className="window-nav-icon" />
          <ArrowRight size={13} className="window-nav-icon" />
        </div>
      </div>

      <div className="window-url-bar">
        <Lock size={11} className="window-lock-icon" />
        <span className="window-url-text">{title}</span>
      </div>

      <div className="window-actions-right">
        <RotateCw size={12} className="window-nav-icon" />
      </div>
    </div>
  );
}
