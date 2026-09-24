import { SiteImage } from '@/components/ui/SiteImage';
import type { Content } from '@/lib/validation/content';
import section from './section.module.css';
import styles from './Tools.module.css';

export function Tools({ stack }: { stack: Content['stack'] }) {
  return (
    <section id="tools" className={section.section} aria-labelledby="tools-title">
      <h2 id="tools-title" className={section.heading}>
        {stack.heading}
      </h2>
      <div className={styles.groups}>
        {stack.groups.map((g, i) => (
          <div key={i} className={styles.group}>
            <div className={styles.groupHead}>
              <span className={styles.num} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.groupName}>{g.name}</h3>
            </div>
            <ul className={styles.tiles}>
              {g.items.map((t, k) => (
                <li key={k} className={styles.tile}>
                  {t.icon ? (
                    <SiteImage
                      src={t.icon}
                      alt=""
                      width={40}
                      height={40}
                      className={`${styles.logo} ${t.invert ? styles.invert : ''}`}
                    />
                  ) : (
                    <span className={styles.logo} aria-hidden="true" />
                  )}
                  <span className={styles.name}>{t.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
