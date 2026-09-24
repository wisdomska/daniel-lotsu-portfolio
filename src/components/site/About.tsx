import { SiteImage } from '@/components/ui/SiteImage';
import type { Content } from '@/lib/validation/content';
import { RichText } from './RichText';
import section from './section.module.css';
import styles from './About.module.css';

export function About({ about }: { about: Content['about'] }) {
  return (
    <section id="about" className={section.section} aria-labelledby="about-title">
      <h2 id="about-title" className={section.heading}>
        {about.heading}
      </h2>
      <div className={styles.layout}>
        <div className={styles.side}>
          <div className={`${styles.portrait} ${section.placeholder}`}>
            {about.avatar ? (
              <SiteImage
                src={about.avatar}
                alt={about.avatarAlt || about.heading}
                fill
                sizes="(max-width: 700px) 420px, 520px"
                className={styles.portraitImg}
              />
            ) : (
              <>
                <span className={styles.initials} aria-hidden="true">
                  {about.avatarInitials}
                </span>
                <span className={section.mono} aria-hidden="true">
                  {about.avatarLabel}
                </span>
              </>
            )}
          </div>
          {about.tags.length > 0 && (
            <ul className={styles.tags} aria-label="Skills">
              {about.tags.map((t, i) => (
                <li key={i} className={styles.tag}>
                  {t}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.main}>
          <p className={styles.bio}>
            <RichText text={about.bio} boldClassName={styles.bold} />
          </p>
          <dl className={styles.facts}>
            {about.facts.map((f, i) => (
              <div key={i} className={styles.fact}>
                <dt className={styles.factLabel}>{f.label}</dt>
                <dd className={styles.factValue}>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
