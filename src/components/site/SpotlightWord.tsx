'use client';

import { useEffect, useRef, type PointerEvent } from 'react';
import styles from './SpotlightWord.module.css';

/**
 * The footer's giant word. It is sized to fill the footer width exactly, and a
 * torch that follows the pointer lights it up in the accent colour.
 */
export function SpotlightWord({ text }: { text: string }) {
  const box = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = box.current;
    const t = word.current;
    if (!el || !t) return;
    const fit = () => {
      el.style.fontSize = '100px';
      const w = t.getBoundingClientRect().width;
      const avail = el.clientWidth - 24;
      if (w) el.style.fontSize = `${(100 * avail) / w}px`;
    };
    fit();
    void document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  const setOn = (on: boolean) => box.current?.style.setProperty('--o', on ? '1' : '0');

  return (
    <div
      ref={box}
      className={styles.box}
      onPointerMove={move}
      onPointerEnter={() => setOn(true)}
      onPointerLeave={() => setOn(false)}
    >
      <div className={styles.base}>
        <span ref={word} className={styles.word}>
          {text}
        </span>
      </div>
      <div className={styles.lit} aria-hidden="true">
        {text}
      </div>
      <div className={styles.glow} aria-hidden="true" />
    </div>
  );
}
