import type { CSSProperties } from 'react';
import styles from './Marquee.module.css';

/**
 * The scrolling band of technologies. The words are rendered twice so the
 * strip loops seamlessly; the second copy is hidden from assistive tech.
 */
export function Marquee({ items }: { items: string[] }) {
  const words = items.filter(Boolean);
  if (words.length === 0) return null;
  const duration = { '--mq-duration': `${Math.max(20, words.length * 3)}s` } as CSSProperties;

  const row = (hidden: boolean) =>
    words.map((w, i) => (
      <li
        key={`${hidden ? 'b' : 'a'}${i}`}
        className={styles.word}
        aria-hidden={hidden || undefined}
      >
        {w}
        <span className={styles.dot} aria-hidden="true" />
      </li>
    ));

  return (
    <section className={styles.marquee} aria-label="Technologies I work with">
      <ul className={styles.track} style={duration}>
        {row(false)}
        {row(true)}
      </ul>
    </section>
  );
}
