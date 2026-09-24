import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import button from '@/components/ui/Button.module.css';
import { getPublishedContent } from '@/lib/content';
import { themeStyle } from '@/lib/theme';
import styles from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default async function NotFound() {
  const c = await getPublishedContent();
  return (
    <main id="main" className={styles.page} style={themeStyle(c.settings)}>
      <Link href="/" className={styles.logo}>
        {c.nav.logo}
      </Link>
      <div className={styles.body}>
        <span className={styles.code} aria-hidden="true">
          404
        </span>
        <h1 className={styles.title}>This page drifted out of orbit.</h1>
        <p className={styles.text}>
          The link may be old, or the page may have moved. Everything else is still online.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={button.primary}>
            <Icon name="arrow-left" />
            Back home
          </Link>
          <Link href="/blog" className={button.outline}>
            {c.nav.blog}
          </Link>
        </div>
      </div>
      <span className={styles.big} aria-hidden="true">
        {c.footer.bigText}
      </span>
    </main>
  );
}
