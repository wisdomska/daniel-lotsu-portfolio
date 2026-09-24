'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { HomeView } from '@/components/site/HomeView';
import { Starfield } from '@/components/site/Starfield';
import { themeStyle } from '@/lib/theme';
import type { Content } from '@/lib/validation/content';
import { isPreviewMessage, PREVIEW_READY } from './preview-protocol';
import styles from './preview.module.css';

/**
 * The home page rendered from the CMS draft inside the preview iframe. The
 * CMS pushes every edit here as it happens (before it is even saved), so the
 * preview always shows exactly what Publish would put live.
 */
export function PreviewClient({ initial }: { initial: Content }) {
  const [content, setContent] = useState(initial);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || !isPreviewMessage(e.data)) return;
      if (e.data.type === 'cms:draft') setContent(e.data.content);
      else document.getElementById(e.data.anchor)?.scrollIntoView({ behavior: 'smooth' });
    };
    window.addEventListener('message', onMessage);
    window.parent?.postMessage({ type: PREVIEW_READY }, window.location.origin);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Keep the preview on this page: in-page anchors scroll, everything else is inert.
  const onClickCapture = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a) return;
    const href = a.getAttribute('href') ?? '';
    e.preventDefault();
    const hash = href.includes('#') ? href.slice(href.indexOf('#') + 1) : '';
    if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      id="top"
      className={styles.root}
      style={themeStyle(content.settings)}
      onClickCapture={onClickCapture}
    >
      {content.settings.showStars && <Starfield />}
      <HomeView c={content} />
    </div>
  );
}
