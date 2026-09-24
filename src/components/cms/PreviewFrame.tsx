'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { getSectionDef } from '@/content/schema';
import { useCms } from './CmsProvider';
import { PREVIEW_READY, type PreviewMessage } from './preview-protocol';
import { viewFromPath } from './views';
import styles from './preview.module.css';

const WIDTHS = { desktop: 1280, mobile: 390 } as const;
type Device = keyof typeof WIDTHS;

function post(frame: HTMLIFrameElement | null, msg: PreviewMessage) {
  frame?.contentWindow?.postMessage(msg, window.location.origin);
}

/** Scaled iframe of the draft site with a desktop/mobile toggle, updated as you type. */
export function PreviewFrame() {
  const { draft } = useCms();
  const view = viewFromPath(usePathname());
  const frame = useRef<HTMLIFrameElement>(null);
  const pane = useRef<HTMLDivElement>(null);
  const [device, setDevice] = useState<Device>('desktop');
  const [size, setSize] = useState({ w: 600, h: 800 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = pane.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === PREVIEW_READY) setReady(true);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Push the draft on every change (lightly debounced) once the preview is listening.
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => post(frame.current, { type: 'cms:draft', content: draft }), 120);
    return () => clearTimeout(t);
  }, [draft, ready]);

  // Follow the section being edited.
  useEffect(() => {
    if (!ready) return;
    const anchor = view === 'theme' ? 'projects' : getSectionDef(view)?.anchor;
    if (anchor) post(frame.current, { type: 'cms:scroll', anchor });
  }, [view, ready]);

  const vw = WIDTHS[device];
  const scale = Math.min(1, size.w / vw);
  const left = Math.max(0, Math.round((size.w - vw * scale) / 2));

  return (
    <section className={styles.pane} aria-label="Live preview">
      <div className={styles.bar}>
        <span className={styles.label}>LIVE PREVIEW</span>
        <span className={styles.segmented} role="group" aria-label="Preview size">
          {(Object.keys(WIDTHS) as Device[]).map((d) => (
            <button
              key={d}
              type="button"
              className={styles.seg}
              aria-pressed={device === d}
              onClick={() => setDevice(d)}
            >
              {d === 'desktop' ? 'Desktop' : 'Mobile'}
            </button>
          ))}
        </span>
      </div>
      <div ref={pane} className={styles.viewport}>
        <iframe
          ref={frame}
          src="/cms/preview"
          title="Preview of your draft site"
          className={styles.frame}
          style={{
            left,
            width: vw,
            height: Math.round(size.h / scale),
            transform: `scale(${scale.toFixed(4)})`,
          }}
        />
      </div>
    </section>
  );
}
