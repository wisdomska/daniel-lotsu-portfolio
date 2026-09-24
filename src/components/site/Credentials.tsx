import type { Content } from '@/lib/validation/content';
import section from './section.module.css';
import timeline from './timeline.module.css';
import styles from './Credentials.module.css';

export function Credentials({ credentials }: { credentials: Content['credentials'] }) {
  return (
    <section id="credentials" className={section.section} aria-labelledby="credentials-title">
      <h2 id="credentials-title" className={section.heading}>
        {credentials.heading}
      </h2>
      <ul className={timeline.list}>
        {credentials.items.map((c, i) => (
          <li key={i} className={`${timeline.rowGrid} ${styles.row}`}>
            <span className={timeline.time}>{c.kind}</span>
            <span className={`${timeline.stack} ${styles.stack}`}>
              <span className={styles.title}>{c.title}</span>
              <span className={styles.org}>{c.org}</span>
            </span>
            <span className={timeline.time}>{c.year}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
