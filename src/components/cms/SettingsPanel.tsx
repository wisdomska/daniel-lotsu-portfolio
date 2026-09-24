'use client';

import { useActionState, useRef, type ChangeEvent } from 'react';
import { DEFAULTS } from '@/content/defaults';
import { Icon } from '@/components/ui/Icon';
import { PASSWORD_MIN } from '@/lib/validation/constants';
import { changePasswordAction, logoutAction, type FormState } from '@/server/actions/auth';
import { exportBackupAction, validateBackupAction } from '@/server/actions/backup';
import { useCms } from './CmsProvider';
import { ViewHeader } from './ViewHeader';
import { EXTRA_VIEWS } from './views';
import cms from './cms.module.css';
import styles from './settings.module.css';

function ChangePassword() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePasswordAction, {});
  const form = useRef<HTMLFormElement>(null);
  const err = state.fieldErrors ?? {};

  const field = (name: 'current' | 'next' | 'confirm', label: string, auto: string) => (
    <label className={cms.label}>
      {label}
      <input
        type="password"
        name={name}
        autoComplete={auto}
        required
        className={styles.input}
        aria-invalid={Boolean(err[name])}
        aria-describedby={err[name] ? `pw-${name}-err` : undefined}
      />
      {err[name] && (
        <span id={`pw-${name}-err`} className={cms.fieldError}>
          {err[name]}
        </span>
      )}
    </label>
  );

  return (
    <form ref={form} action={action} className={styles.card} noValidate>
      <h2 className={styles.title}>Change password</h2>
      {field('current', 'Current password', 'current-password')}
      {field('next', `New password (at least ${PASSWORD_MIN} characters)`, 'new-password')}
      {field('confirm', 'Confirm new password', 'new-password')}
      <div className={styles.row}>
        <button type="submit" className={cms.btnPrimary} disabled={pending}>
          {pending ? 'Updating…' : 'Change password'}
        </button>
        {state.ok && (
          <span className={cms.fieldOk} role="status">
            Password changed. Other devices have been signed out.
          </span>
        )}
        {state.error && (
          <span className={cms.fieldError} role="alert">
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}

function ContentData() {
  const { replace, confirm, flash, flush } = useCms();
  const fileInput = useRef<HTMLInputElement>(null);

  const exportJson = async () => {
    await flush();
    const backup = await exportBackupAction();
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `portfolio-backup-${backup.exportedAt.slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    flash('Backup downloaded');
  };

  const importJson = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const res = await validateBackupAction(await file.text());
    if (!res.ok) {
      flash(res.error);
      return;
    }
    const ok = await confirm({
      title: 'Import this backup?',
      body: 'Your draft will be replaced with the backup. Nothing goes live until you publish. You can undo this.',
      cta: 'Import',
      tone: 'primary',
    });
    if (!ok) return;
    replace(res.content);
    flash('Backup imported into your draft');
  };

  const resetAll = async () => {
    const ok = await confirm({
      title: 'Reset everything?',
      body: 'All content and theme settings in your draft will return to the originals. Inbox messages and your password are kept. Nothing goes live until you publish, and you can undo this.',
      cta: 'Reset everything',
    });
    if (!ok) return;
    replace(structuredClone(DEFAULTS));
    flash('All content reset in your draft');
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Content data</h2>
      <p className={cms.muted}>
        Download a backup of all your content (including unpublished changes), restore one, or start
        again from the original content.
      </p>
      <div className={styles.row}>
        <button type="button" className={cms.btnOutline} onClick={() => void exportJson()}>
          <Icon name="download" size={15} />
          Export backup
        </button>
        <button type="button" className={cms.btnOutline} onClick={() => fileInput.current?.click()}>
          <Icon name="upload" size={15} />
          Import backup
        </button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => void importJson(e)}
        />
        <button type="button" className={cms.btnDanger} onClick={() => void resetAll()}>
          <Icon name="rotate-ccw" size={15} />
          Reset everything
        </button>
      </div>
    </div>
  );
}

/** Password, backups and sign-out. */
export function SettingsPanel({ email }: { email: string }) {
  return (
    <>
      <ViewHeader title={EXTRA_VIEWS.settings.title} desc={EXTRA_VIEWS.settings.desc} />
      <ChangePassword />
      <ContentData />
      <div className={`${styles.card} ${styles.split}`}>
        <span className={styles.stack}>
          <h2 className={styles.title}>Sign out</h2>
          <span className={cms.muted}>Signed in as {email}. End this editing session.</span>
        </span>
        <form action={logoutAction}>
          <button type="submit" className={cms.btnGhost}>
            <Icon name="log-out" size={15} />
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}
