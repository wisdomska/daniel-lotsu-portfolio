'use client';

import { useEffect, useRef } from 'react';
import styles from './Starfield.module.css';

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
  p: number;
  s: number;
  ox: number;
  oy: number;
}

function parseColor(value: string): [number, number, number] {
  const hex = value.trim().replace('#', '');
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    const n = parseInt(hex, 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  }
  return [163, 233, 0];
}

/**
 * The drifting starlight background. Stars twinkle, parallax with the pointer
 * and scatter away from it, taking on the accent colour when disturbed.
 * Ported from startStars() in the prototype, with two changes: it waits for
 * the browser to be idle before starting, and with reduced motion it paints a
 * single still frame instead of animating.
 */
export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let W = 0;
    let H = 0;
    let pts: Star[] = [];
    let raf = 0;
    let t = 0;
    let px = 0;
    let py = 0;
    let visible = !document.hidden;
    const m = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    let accent = parseColor(getComputedStyle(canvas).getPropertyValue('--pri'));

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round((W * H) / 5200);
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random() * 0.8 + 0.2,
        r: Math.random() * 0.9 + 0.25,
        p: Math.random() * 6.28,
        s: Math.random() * 0.8 + 0.3,
        ox: 0,
        oy: 0,
      }));
    };

    const paint = (still: boolean) => {
      if (!still) {
        t += 0.016;
        if (m.tx > -999) {
          if (m.x < -999) {
            m.x = m.tx;
            m.y = m.ty;
          }
          m.x += (m.tx - m.x) * 0.08;
          m.y += (m.ty - m.y) * 0.08;
        } else {
          m.x = -9999;
          m.y = -9999;
        }
        const gx = m.tx > -999 ? m.tx / W - 0.5 : 0;
        const gy = m.ty > -999 ? m.ty / H - 0.5 : 0;
        px += (gx - px) * 0.03;
        py += (gy - py) * 0.03;
      }
      ctx.clearRect(0, 0, W, H);
      const [pr, pg, pb] = accent;
      for (const p of pts) {
        const bx = p.x - px * 24 * p.z;
        const by = p.y - py * 24 * p.z;
        const dx = bx - m.x;
        const dy = by - m.y;
        const d = Math.hypot(dx, dy);
        let near = 0;
        if (!still && d < 150) {
          near = 1 - d / 150;
          const f = near * near * 10 * p.z;
          p.ox += ((dx / (d || 1)) * f - p.ox) * 0.08;
          p.oy += ((dy / (d || 1)) * f - p.oy) * 0.08;
        } else {
          p.ox *= 0.94;
          p.oy *= 0.94;
        }
        const tw = still ? 0.7 : 0.55 + 0.45 * Math.sin(t * p.s + p.p);
        const a = (0.12 + 0.28 * p.z) * tw + near * 0.5;
        ctx.beginPath();
        ctx.arc(bx + p.ox, by + p.oy, p.r * (1 + near * 0.6), 0, 6.283);
        ctx.fillStyle = near > 0.05 ? `rgba(${pr},${pg},${pb},${a})` : `rgba(242,241,238,${a})`;
        ctx.fill();
      }
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      paint(false);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (motion.matches) paint(true);
      else if (visible) loop();
    };

    const onResize = () => {
      size();
      start();
    };
    const onMove = (e: PointerEvent) => {
      m.tx = e.clientX;
      m.ty = e.clientY;
    };
    const onLeave = () => {
      m.tx = -9999;
      m.ty = -9999;
    };
    const onVisibility = () => {
      visible = !document.hidden;
      if (visible) start();
      else cancelAnimationFrame(raf);
    };
    // The CMS theme picker changes --pri live in the preview.
    const observer = new MutationObserver(() => {
      accent = parseColor(getComputedStyle(canvas).getPropertyValue('--pri'));
    });

    const boot = () => {
      size();
      start();
      window.addEventListener('resize', onResize);
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
      document.addEventListener('visibilitychange', onVisibility);
      motion.addEventListener('change', start);
      const themed = canvas.closest('[style]');
      if (themed) observer.observe(themed, { attributes: true, attributeFilter: ['style'] });
    };

    const hasIdle = typeof window.requestIdleCallback === 'function';
    const idle = hasIdle
      ? window.requestIdleCallback(boot, { timeout: 1500 })
      : globalThis.setTimeout(boot, 300);

    return () => {
      if (hasIdle) window.cancelIdleCallback(idle as number);
      else globalThis.clearTimeout(idle);
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener('change', start);
    };
  }, []);

  return <canvas ref={ref} className={styles.canvas} aria-hidden="true" />;
}
