'use client';

import { useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import button from '@/components/ui/Button.module.css';
import type { Content } from '@/lib/validation/content';
import styles from './Contact.module.css';

export function ContactForm({ contact }: { contact: Content['contact'] }) {
  const [sentName, setSentName] = useState<string | null>(null);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = String(new FormData(e.currentTarget).get('name') ?? '').trim();
    setSentName(name.split(' ')[0] || 'there');
  };

  if (sentName !== null) {
    return (
      <div className={styles.thanks} role="status">
        <span className={styles.thanksEmoji} aria-hidden="true">
          🤝
        </span>
        <h3 className={styles.thanksTitle}>{contact.thanksTitle.replace('{name}', sentName)}</h3>
        <p className={styles.thanksBody}>{contact.thanksBody}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className="visually-hidden" htmlFor="contact-name">
        {contact.namePlaceholder}
      </label>
      <input
        id="contact-name"
        name="name"
        required
        maxLength={100}
        autoComplete="name"
        placeholder={contact.namePlaceholder}
        className={styles.input}
      />
      <label className="visually-hidden" htmlFor="contact-email">
        {contact.emailPlaceholder}
      </label>
      <input
        id="contact-email"
        name="email"
        type="email"
        required
        maxLength={254}
        autoComplete="email"
        placeholder={contact.emailPlaceholder}
        className={styles.input}
      />
      <label className="visually-hidden" htmlFor="contact-message">
        {contact.messagePlaceholder}
      </label>
      <textarea
        id="contact-message"
        name="message"
        required
        rows={5}
        maxLength={5000}
        placeholder={contact.messagePlaceholder}
        className={`${styles.input} ${styles.textarea}`}
      />
      <button type="submit" className={`${button.primary} ${styles.submit}`}>
        <Icon name="send" />
        {contact.submitLabel}
      </button>
    </form>
  );
}
