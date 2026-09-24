'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { deleteMessageAction, setReadAction } from '@/server/actions/inbox';
import { useCms } from './CmsProvider';
import { ViewHeader } from './ViewHeader';
import { EXTRA_VIEWS } from './views';
import styles from './inbox.module.css';

export interface InboxItem {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

/** The address was validated on submit; only strip anything that could break the URL. */
const replyHref = (m: InboxItem) =>
  `mailto:${m.email.replace(/[^A-Za-z0-9._%+@-]/g, '')}?subject=${encodeURIComponent('Re: your message')}`;

/** Contact-form messages with read/unread, delete and reply-by-email. */
export function Inbox({ initial }: { initial: InboxItem[] }) {
  const { setUnread, confirm, flash } = useCms();
  const [items, setItems] = useState(initial);

  const toggleRead = async (m: InboxItem) => {
    setItems((all) => all.map((x) => (x.id === m.id ? { ...x, read: !m.read } : x)));
    const res = await setReadAction(m.id, !m.read);
    setUnread(res.unread);
  };

  const remove = async (m: InboxItem) => {
    const ok = await confirm({
      title: 'Delete this message?',
      body: `The message from ${m.name} will be permanently deleted.`,
      cta: 'Delete',
    });
    if (!ok) return;
    setItems((all) => all.filter((x) => x.id !== m.id));
    const res = await deleteMessageAction(m.id);
    setUnread(res.unread);
    flash('Message deleted');
  };

  return (
    <>
      <ViewHeader title={EXTRA_VIEWS.inbox.title} desc={EXTRA_VIEWS.inbox.desc} />
      {items.length === 0 ? (
        <div className={styles.empty}>
          No messages yet. Submissions from the contact form will appear here.
        </div>
      ) : (
        <ul className={styles.list}>
          {items.map((m) => (
            <li key={m.id}>
              <article className={`${styles.card} ${m.read ? '' : styles.unread}`}>
                <div className={styles.head}>
                  <span className={styles.from}>
                    {!m.read && (
                      <span className={styles.dot}>
                        <span className="visually-hidden">Unread</span>
                      </span>
                    )}
                    <strong className={styles.name}>{m.name}</strong>
                    <span className={styles.email}>{m.email}</span>
                  </span>
                  <time className={styles.when} dateTime={m.createdAt}>
                    {when(m.createdAt)}
                  </time>
                </div>
                <p className={styles.message}>{m.message}</p>
                <div className={styles.actions}>
                  <a href={replyHref(m)} className={styles.reply}>
                    <Icon name="reply" size={14} />
                    Reply
                  </a>
                  <button type="button" className={styles.ghost} onClick={() => void toggleRead(m)}>
                    {m.read ? 'Mark unread' : 'Mark read'}
                  </button>
                  <button
                    type="button"
                    className={`${styles.ghost} ${styles.danger}`}
                    onClick={() => void remove(m)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
