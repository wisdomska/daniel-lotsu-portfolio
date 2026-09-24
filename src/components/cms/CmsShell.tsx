'use client';

import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useCms } from './CmsProvider';
import { Sidebar } from './Sidebar';
import cms from './cms.module.css';
import styles from './shell.module.css';

/** Header, section sidebar and editor column of the CMS dashboard. */
export function CmsShell({ children }: { children: ReactNode }) {
  const { draft } = useCms();
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.brand}>{draft.nav.logo || 'Portfolio'}</span>
          <span className={cms.chip}>CMS</span>
        </div>
        <div className={styles.headerRight}>
          <a href="/" target="_blank" rel="noopener noreferrer" className={cms.btnPrimary}>
            <Icon name="external-link" size={16} />
            View site
          </a>
        </div>
      </header>
      <div className={styles.body}>
        <Sidebar />
        <main id="main" className={styles.editor}>
          <div className={styles.editorInner}>{children}</div>
        </main>
      </div>
    </div>
  );
}
