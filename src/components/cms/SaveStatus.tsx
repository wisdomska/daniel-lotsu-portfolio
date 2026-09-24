'use client';

import { useCms, type SaveStatus as Status } from './CmsProvider';
import styles from './shell.module.css';

const LABELS: Record<Status, { text: string; color: string }> = {
  saved: { text: 'Draft saved', color: '#8a8882' },
  saving: { text: 'Saving…', color: '#e8c46a' },
  invalid: { text: 'Fix the highlighted fields to save', color: '#ff8a80' },
  error: { text: 'Couldn’t save — retrying on your next edit', color: '#ff8a80' },
};

export function SaveStatus() {
  const { status } = useCms();
  const l = LABELS[status];
  return (
    <span className={styles.status} style={{ color: l.color }} role="status" title={l.text}>
      <span className={styles.statusDot} aria-hidden="true" />
      <span className={styles.statusText}>{l.text}</span>
    </span>
  );
}
