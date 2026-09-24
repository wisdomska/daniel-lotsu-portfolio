'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { themeStyle } from '@/lib/theme';
import { useCms } from './CmsProvider';
import { PreviewFrame } from './PreviewFrame';
import { SaveStatus } from './SaveStatus';
import { Sidebar } from './Sidebar';
import cms from './cms.module.css';
import styles from './shell.module.css';

/** The live preview needs room: it is offered from 1100px wide. */
function useCanPreview() {
  const [can, setCan] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1100px)');
    const on = () => setCan(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return can;
}

/** Header, section sidebar, editor column and live preview of the CMS dashboard. */
export function CmsShell({ children }: { children: ReactNode }) {
  const { draft, undo, canUndo, publish, publishing, unpublished } = useCms();
  const canPreview = useCanPreview();
  const [previewWanted, setPreviewWanted] = useState(true);
  const preview = canPreview && previewWanted;
  const pending = unpublished.length;

  return (
    <div className={styles.app} style={themeStyle(draft.settings)}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.brand}>{draft.nav.logo || 'Portfolio'}</span>
          <span className={cms.chip}>CMS</span>
          <SaveStatus />
        </div>
        <div className={styles.headerRight}>
          <button
            type="button"
            className={cms.btnGhost}
            onClick={undo}
            disabled={!canUndo}
            title="Undo last change (Ctrl+Z)"
          >
            <Icon name="undo-2" size={16} />
            <span className={styles.hideSmall}>Undo</span>
          </button>
          {canPreview && (
            <button
              type="button"
              className={cms.btnGhost}
              aria-pressed={previewWanted}
              onClick={() => setPreviewWanted((p) => !p)}
            >
              <Icon name={previewWanted ? 'panel-right-close' : 'panel-right-open'} size={16} />
              {previewWanted ? 'Hide preview' : 'Show preview'}
            </button>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={cms.btnGhost}
            aria-label="View live site (opens in a new tab)"
          >
            <Icon name="external-link" size={16} />
            <span className={styles.hideSmall}>View site</span>
          </a>
          <button
            type="button"
            className={cms.btnPrimary}
            onClick={() => void publish()}
            disabled={publishing || pending === 0}
            aria-describedby="publish-hint"
          >
            <Icon name="send" size={16} />
            {publishing ? 'Publishing…' : pending ? `Publish (${pending})` : 'Published'}
          </button>
          <span id="publish-hint" className="visually-hidden">
            {pending
              ? `${pending} section${pending === 1 ? '' : 's'} with changes not yet live`
              : 'Everything is live'}
          </span>
        </div>
      </header>
      <div className={`${styles.body} ${preview ? styles.bodyWithPreview : ''}`}>
        <Sidebar />
        <main id="main" className={styles.editor}>
          <div className={styles.editorInner}>{children}</div>
        </main>
        {preview && <PreviewFrame />}
      </div>
    </div>
  );
}
