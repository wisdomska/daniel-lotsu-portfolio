'use client';

import { useId, useState } from 'react';
import type { Content } from '@/lib/validation/content';
import section from './section.module.css';
import timeline from './timeline.module.css';
import styles from './Career.module.css';

/** Expandable timeline of roles. The first role starts open, as in the design. */
export function Career({ career }: { career: Content['career'] }) {
  const [open, setOpen] = useState(0);
  const uid = useId();

  return (
    <section id="career" className={section.section} aria-labelledby="career-title">
      <h2 id="career-title" className={section.heading}>
        {career.heading}
      </h2>
      <ul className={timeline.list}>
        {career.items.map((e, i) => {
          const isOpen = open === i;
          const panel = `${uid}-panel-${i}`;
          return (
            <li key={i} className={styles.item}>
              <h3 className={styles.heading}>
                <button
                  type="button"
                  className={`${timeline.rowGrid} ${styles.toggle}`}
                  aria-expanded={isOpen}
                  aria-controls={panel}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span className={timeline.time}>{e.time}</span>
                  <span className={timeline.stack}>
                    <span className={styles.role}>{e.role}</span>
                    <span className={styles.org}>{e.org}</span>
                    {e.status && (
                      <span
                        className={`${timeline.badge} ${timeline.narrowOnly} ${styles.badgeNarrow}`}
                      >
                        {e.status}
                      </span>
                    )}
                  </span>
                  <span className={styles.end}>
                    {e.status && (
                      <span className={`${timeline.badge} ${timeline.wideOnly}`}>{e.status}</span>
                    )}
                    <span className={styles.circle} aria-hidden="true">
                      {isOpen ? '−' : '+'}
                    </span>
                  </span>
                </button>
              </h3>
              <div id={panel} hidden={!isOpen}>
                <p className={styles.body}>{e.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
