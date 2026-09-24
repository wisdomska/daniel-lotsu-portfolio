'use client';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect } from 'react';

/**
 * Lenis smooth scrolling for the public site, including in-page anchor links.
 * It is skipped entirely for people who prefer reduced motion, pauses while a
 * dialog (blog post, resume) is open, and never hijacks scrolling inside one.
 */
export function SmoothScroll() {
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;
    let observer: MutationObserver | null = null;

    const start = () => {
      lenis = new Lenis({
        autoRaf: true,
        anchors: true,
        lerp: 0.1,
        // Dialogs are their own scroll containers.
        prevent: (node) => node.closest('dialog') !== null,
      });
      const sync = () => {
        if (document.querySelector('dialog[open]')) lenis?.stop();
        else lenis?.start();
      };
      observer = new MutationObserver(sync);
      observer.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ['open'],
      });
      sync();
    };
    const stop = () => {
      observer?.disconnect();
      lenis?.destroy();
      lenis = observer = null;
    };
    const onChange = () => (motion.matches ? stop() : !lenis && start());

    if (!motion.matches) start();
    motion.addEventListener('change', onChange);
    return () => {
      motion.removeEventListener('change', onChange);
      stop();
    };
  }, []);

  return null;
}
