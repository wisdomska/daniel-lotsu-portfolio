'use client';

import { useEffect } from 'react';
import cms from '@/components/cms/cms.module.css';

/** Error boundary for CMS screens: keeps the dashboard chrome and offers a retry. */
export default function CmsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '48px 0' }}
    >
      <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 28 }}>
        Something went wrong
      </h1>
      <p className={cms.muted}>
        This screen couldn’t load. Your saved drafts are safe. Try again, or reload the page.
        {error.digest ? ` (Reference: ${error.digest})` : ''}
      </p>
      <div>
        <button type="button" className={cms.btnPrimary} onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
