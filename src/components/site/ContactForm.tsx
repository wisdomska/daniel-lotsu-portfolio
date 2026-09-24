'use client';

import { useActionState } from 'react';
import { Icon } from '@/components/ui/Icon';
import button from '@/components/ui/Button.module.css';
import type { Content } from '@/lib/validation/content';
import { HONEYPOT_FIELD } from '@/lib/validation/contact';
import { submitContactAction, type ContactState } from '@/server/actions/contact';
import styles from './Contact.module.css';

export function ContactForm({ contact }: { contact: Content['contact'] }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContactAction, {});
  const err = state.fieldErrors ?? {};

  if (state.ok) {
    return (
      <div className={styles.thanks} role="status">
        <span className={styles.thanksEmoji} aria-hidden="true">
          🤝
        </span>
        <h3 className={styles.thanksTitle}>
          {contact.thanksTitle.replace('{name}', state.name ?? 'there')}
        </h3>
        <p className={styles.thanksBody}>{contact.thanksBody}</p>
      </div>
    );
  }

  const describedBy = (k: 'name' | 'email' | 'message') =>
    err[k] ? `contact-${k}-err` : undefined;

  return (
    <form className={styles.form} action={action} noValidate>
      {/* Honeypot: invisible to people and to assistive tech; bots fill it in. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label>
          Leave this empty
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="visually-hidden" htmlFor="contact-name">
        {contact.namePlaceholder}
      </label>
      <input
        id="contact-name"
        name="name"
        defaultValue={state.values?.name}
        required
        maxLength={100}
        autoComplete="name"
        placeholder={contact.namePlaceholder}
        className={styles.input}
        aria-invalid={Boolean(err.name)}
        aria-describedby={describedBy('name')}
      />
      {err.name && (
        <p id="contact-name-err" className={styles.error}>
          {err.name}
        </p>
      )}

      <label className="visually-hidden" htmlFor="contact-email">
        {contact.emailPlaceholder}
      </label>
      <input
        id="contact-email"
        name="email"
        defaultValue={state.values?.email}
        type="email"
        required
        maxLength={254}
        autoComplete="email"
        placeholder={contact.emailPlaceholder}
        className={styles.input}
        aria-invalid={Boolean(err.email)}
        aria-describedby={describedBy('email')}
      />
      {err.email && (
        <p id="contact-email-err" className={styles.error}>
          {err.email}
        </p>
      )}

      <label className="visually-hidden" htmlFor="contact-message">
        {contact.messagePlaceholder}
      </label>
      <textarea
        id="contact-message"
        name="message"
        defaultValue={state.values?.message}
        required
        rows={5}
        maxLength={5000}
        placeholder={contact.messagePlaceholder}
        className={`${styles.input} ${styles.textarea}`}
        aria-invalid={Boolean(err.message)}
        aria-describedby={describedBy('message')}
      />
      {err.message && (
        <p id="contact-message-err" className={styles.error}>
          {err.message}
        </p>
      )}

      {state.error && (
        <p className={styles.error} role="alert">
          {state.error}
        </p>
      )}
      <button type="submit" className={`${button.primary} ${styles.submit}`} disabled={pending}>
        <Icon name="send" />
        {pending ? 'Sending…' : contact.submitLabel}
      </button>
    </form>
  );
}
