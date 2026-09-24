'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { SectionId } from '@/lib/validation/content';
import { listVersionsAction, restoreVersionAction } from '@/server/actions/content';
import type { VersionSummary } from '@/lib/content';
import { useCms } from './CmsProvider';
import cms from './cms.module.css';
import styles from './history.module.css';

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

/** The last 20 published versions of a section, each restorable into the draft. */
export function VersionHistory({ section, title }: { section: SectionId; title: string }) {
  const { replace, confirm, flash, flush } = useCms();
  const [open, setOpen] = useState(false);
  const [versions, setVersions] = useState<VersionSummary[] | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const res = await listVersionsAction(section);
    setVersions(res.ok ? res.data : []);
  };

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next) await load();
  };

  const restore = async (v: VersionSummary, index: number) => {
    const ok = await confirm({
      title: 'Restore this version?',
      body: `Your draft of “${title}” will be replaced with the version published ${when(v.publishedAt)}. Nothing goes live until you publish. You can undo this.`,
      cta: 'Restore',
      tone: 'primary',
    });
    if (!ok) return;
    setBusy(true);
    try {
      await flush();
      const res = await restoreVersionAction(v.id);
      if (!res.ok) {
        flash(res.error ?? 'Couldn’t restore that version');
        return;
      }
      replace({ [res.data.section]: res.data.data });
      flash(index === 0 ? 'Draft reset to what’s live' : 'Version restored into your draft');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={styles.panel} aria-labelledby={`history-${section}`}>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        onClick={() => void toggle()}
      >
        <Icon name="history" size={16} />
        <span id={`history-${section}`} className={styles.title}>
          Version history
        </span>
        <span className={styles.chev} aria-hidden="true">
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
        </span>
      </button>
      {open && (
        <div className={styles.body}>
          {versions === null ? (
            <p className={cms.muted}>Loading…</p>
          ) : versions.length === 0 ? (
            <p className={cms.muted}>No published versions yet. Each publish is saved here.</p>
          ) : (
            <ol className={styles.list}>
              {versions.map((v, i) => (
                <li key={v.id} className={styles.row}>
                  <span className={styles.date}>
                    {when(v.publishedAt)}
                    {i === 0 && <span className={styles.live}>Live</span>}
                  </span>
                  <button
                    type="button"
                    className={cms.btnGhost}
                    disabled={busy}
                    onClick={() => void restore(v, i)}
                  >
                    <Icon name="rotate-ccw" size={14} />
                    Restore
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </section>
  );
}
