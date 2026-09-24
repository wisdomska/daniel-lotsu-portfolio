'use client';

import { useEffect, useRef } from 'react';
import styles from './ConfirmDialog.module.css';

export interface ConfirmRequest {
  title: string;
  body: string;
  cta: string;
  tone?: 'danger' | 'primary';
}

interface ConfirmDialogProps {
  request: ConfirmRequest | null;
  onResolve: (ok: boolean) => void;
}

/** Modal confirmation for destructive actions, on the native <dialog> element. */
export function ConfirmDialog({ request, onResolve }: ConfirmDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (request && !d.open) d.showModal();
    if (!request && d.open) d.close();
  }, [request]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="confirm-title"
      aria-describedby="confirm-body"
      onCancel={(e) => {
        e.preventDefault();
        onResolve(false);
      }}
      onClick={(e) => e.target === e.currentTarget && onResolve(false)}
    >
      {request && (
        <div className={styles.card}>
          <h2 id="confirm-title" className={styles.title}>
            {request.title}
          </h2>
          <p id="confirm-body" className={styles.body}>
            {request.body}
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancel}
              onClick={() => onResolve(false)}
              autoFocus
            >
              Cancel
            </button>
            <button
              type="button"
              className={request.tone === 'primary' ? styles.primary : styles.danger}
              onClick={() => onResolve(true)}
            >
              {request.cta}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
