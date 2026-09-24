import { Icon } from '@/components/ui/Icon';
import button from '@/components/ui/Button.module.css';
import type { Content } from '@/lib/validation/content';
import section from './section.module.css';
import styles from './Hero.module.css';

export function Hero({ hero }: { hero: Content['hero'] }) {
  return (
    <section className={`${section.section} ${styles.hero}`} aria-labelledby="hero-title">
      <div className={section.pill}>
        <Icon name="cloud-cog" size={18} />
        <span>{hero.eyebrow}</span>
      </div>
      <h1 id="hero-title" className={styles.name}>
        <span className={styles.first}>{hero.firstName}</span>{' '}
        <span className={styles.last}>{hero.lastName}</span>
      </h1>
      <p className={styles.tagline}>{hero.tagline}</p>

      <div className={styles.introRow}>
        <p className={styles.intro}>{hero.intro}</p>
        <div className={styles.ctas}>
          <a href="#projects" className={`${button.primary} ${styles.primary}`}>
            <span>{hero.primaryLabel}</span>
            <span className={styles.arrow} aria-hidden="true">
              <span className={styles.arrowGlyph}>↓</span>
            </span>
          </a>
          <a href="#contact" className={button.outline}>
            <Icon name="mail" />
            {hero.secondaryLabel}
          </a>
        </div>
      </div>

      {hero.stats.length > 0 && (
        <dl className={styles.stats}>
          {hero.stats.map((s, i) => (
            <div key={i} className={styles.stat}>
              <dt className={styles.statLabel}>{s.label}</dt>
              <dd className={styles.statValue}>{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
