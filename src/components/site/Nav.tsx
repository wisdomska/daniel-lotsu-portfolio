'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { Content } from '@/lib/validation/content';
import styles from './Nav.module.css';

interface NavProps {
  nav: Content['nav'];
  /** Prefix for in-page anchors: '' on the home page, '/' everywhere else. */
  base?: '' | '/';
}

export function Nav({ nav, base = '' }: NavProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth >= 760 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const links = [
    { href: `${base}#top`, label: nav.home },
    { href: `${base}#contact`, label: nav.contact },
    { href: '/resume', label: nav.resume, resume: true },
    { href: `${base}#blog`, label: nav.blog },
  ];

  return (
    <header className={styles.header}>
      <nav className={styles.bar} aria-label="Main">
        <Link href={`${base || '/'}#top`} className={styles.logo}>
          {nav.logo}
        </Link>
        <div className={styles.links}>
          {links.map((l) =>
            l.resume ? (
              <Link key={l.href} href={l.href} scroll={false} className={styles.link}>
                {l.label}
              </Link>
            ) : (
              <a key={l.href} href={l.href} className={styles.link}>
                {l.label}
              </a>
            ),
          )}
        </div>
        <button
          type="button"
          className={styles.menuButton}
          aria-label="Menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? 'x' : 'menu'} size={20} />
        </button>
        {nav.showAvailability && (
          <div className={styles.badge}>
            <span className={styles.dot} aria-hidden="true" />
            {nav.availability}
          </div>
        )}
      </nav>
      <div id={menuId} className={styles.menu} hidden={!open}>
        {links.map((l) =>
          l.resume ? (
            <Link
              key={l.href}
              href={l.href}
              scroll={false}
              className={styles.menuLink}
              onClick={close}
            >
              {l.label}
            </Link>
          ) : (
            <a key={l.href} href={l.href} className={styles.menuLink} onClick={close}>
              {l.label}
            </a>
          ),
        )}
        {nav.showAvailability && (
          <div className={styles.menuBadge}>
            <span className={styles.dot} aria-hidden="true" />
            {nav.availability}
          </div>
        )}
      </div>
    </header>
  );
}
