'use client';

import { useEffect, useRef } from 'react';

export default function WeatherCanvas({ weatherType = 'clear', isDay = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle sets based on weather
    const drops = [];
    const dropCount = weatherType === 'thunder' ? 160 : weatherType === 'rain' ? 110 : 0;
    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 20 + 12,
        speed: Math.random() * 9 + 14,
        opacity: Math.random() * 0.45 + 0.2
      });
    }

    // Stars for clear night
    const stars = [];
    const starCount = !isDay && (weatherType === 'clear' || weatherType === 'clouds') ? 70 : 0;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * (height * 0.7),
        radius: Math.random() * 1.5 + 0.6,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.03 + 0.01
      });
    }

    // Sun motes / golden atmospheric dust for clear day
    const motes = [];
    const moteCount = isDay && weatherType === 'clear' ? 35 : 0;
    for (let i = 0; i < moteCount; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.6 - 0.2,
        alpha: Math.random() * 0.5 + 0.15
      });
    }

    // Clouds
    const clouds = [];
    if (weatherType === 'clouds' || weatherType === 'fog') {
      for (let i = 0; i < 6; i++) {
        clouds.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.4),
          radius: Math.random() * 120 + 80,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.06 + 0.03
        });
      }
    }

    let lightningTimer = 0;
    let lightningFlash = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Thunderstorm lightning
      if (weatherType === 'thunder') {
        lightningTimer++;
        if (lightningTimer > 180 && Math.random() < 0.015) {
          lightningFlash = 0.25;
          lightningTimer = 0;
        }
        if (lightningFlash > 0) {
          ctx.fillStyle = `rgba(224, 231, 255, ${lightningFlash})`;
          ctx.fillRect(0, 0, width, height);
          lightningFlash -= 0.02;
        }
      }

      // Render rain drops
      if (weatherType === 'rain' || weatherType === 'thunder') {
        ctx.strokeStyle = weatherType === 'thunder' ? 'rgba(186, 230, 253, 0.45)' : 'rgba(125, 211, 252, 0.38)';
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';

        drops.forEach((d) => {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + 1.5, d.y + d.length);
          ctx.stroke();

          d.y += d.speed;
          d.x += 1.2;

          if (d.y > height) {
            d.y = -20;
            d.x = Math.random() * width;
          }
        });
      }

      // Render night stars
      if (stars.length > 0) {
        stars.forEach((s) => {
          s.alpha += Math.sin(Date.now() * 0.002 * s.speed) * 0.02;
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, Math.min(0.9, s.alpha))})`;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Render sunny dust motes
      if (motes.length > 0) {
        motes.forEach((m) => {
          ctx.fillStyle = `rgba(253, 224, 71, ${m.alpha})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          ctx.fill();

          m.x += m.vx;
          m.y += m.vy;

          if (m.y < -10) {
            m.y = height + 10;
            m.x = Math.random() * width;
          }
        });
      }

      // Render soft cloud puffs
      if (clouds.length > 0) {
        clouds.forEach((c) => {
          const gradient = ctx.createRadialGradient(c.x, c.y, 10, c.x, c.y, c.radius);
          gradient.addColorStop(0, `rgba(203, 213, 225, ${c.opacity})`);
          gradient.addColorStop(1, 'rgba(203, 213, 225, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
          ctx.fill();

          c.x += c.speed;
          if (c.x - c.radius > width) {
            c.x = -c.radius;
            c.y = Math.random() * (height * 0.4);
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherType, isDay]);

  return <canvas ref={canvasRef} className="weather-canvas-container" id="weather-ambient-canvas" />;
}
