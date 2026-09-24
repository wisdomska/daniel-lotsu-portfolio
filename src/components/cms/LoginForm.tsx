'use client';

import { useActionState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { loginAction, type FormState } from '@/server/actions/auth';
import styles from './cms.module.css';

export function LoginForm({ brand, next }: { brand: string; next?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(loginAction, {});
  const err = state.fieldErrors ?? {};

  return (
    <main className={styles.loginWrap}>
      <form action={action} className={styles.loginCard} noValidate>
        <div className={styles.brandRow}>
          <span className={styles.brandLg}>{brand}</span>
          <span className={styles.chip}>CMS</span>
        </div>
        <div className={styles.loginHead}>
          <h1 className={styles.loginTitle}>Sign in</h1>
          <p className={styles.muted}>Sign in to edit the portfolio.</p>
        </div>
        <input type="hidden" name="next" value={next ?? ''} />
        <label className={styles.label}>
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="username"
            className={styles.inputLg}
            aria-invalid={Boolean(err.email)}
            aria-describedby={err.email ? 'login-email-err' : undefined}
          />
          {err.email && (
            <span id="login-email-err" className={styles.fieldError}>
              {err.email}
            </span>
          )}
        </label>
        <label className={styles.label}>
          Password
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className={styles.inputLg}
            aria-invalid={Boolean(err.password)}
            aria-describedby={err.password ? 'login-pass-err' : undefined}
          />
          {err.password && (
            <span id="login-pass-err" className={styles.fieldError}>
              {err.password}
            </span>
          )}
        </label>
        {state.error && (
          <span className={styles.fieldError} role="alert">
            {state.error}
          </span>
        )}
        <button type="submit" className={styles.btnPrimaryLg} disabled={pending}>
          <Icon name="lock-open" />
          {pending ? 'Signing in…' : 'Unlock'}
        </button>
      </form>
    </main>
  );
}
