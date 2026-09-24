import { Icon } from '@/components/ui/Icon';
import button from '@/components/ui/Button.module.css';
import type { Content } from '@/lib/validation/content';
import { ResumeClose } from './ResumeClose';
import styles from './Resume.module.css';

interface ResumeProps {
  resume: Content['resume'];
  headingLevel: 'h1' | 'h2';
  titleId: string;
}

/** The resume sheet, shared by the /resume page and the dialog over the home page. */
export function Resume({ resume: r, headingLevel, titleId }: ResumeProps) {
  const Title = headingLevel;
  const Sub = headingLevel === 'h1' ? 'h2' : 'h3';
  return (
    <article className={styles.sheet}>
      <div className={styles.top}>
        <div className={styles.identity}>
          <span className={styles.eyebrow}>{r.eyebrow}</span>
          <Title id={titleId} className={styles.name}>
            {r.name}
          </Title>
          <span className={styles.role}>{r.role}</span>
          <span className={styles.contacts}>
            {r.email && (
              <a href={`mailto:${r.email}`} className={styles.contact}>
                <Icon name="mail" size={14} />
                {r.email}
              </a>
            )}
            {r.linkedin && (
              <span className={styles.contact}>
                <Icon name="linkedin" size={14} />
                {r.linkedin}
              </span>
            )}
            {r.location && (
              <span className={styles.contact}>
                <Icon name="map-pin" size={14} />
                {r.location}
              </span>
            )}
          </span>
        </div>
        <div className={styles.actions}>
          {r.pdf && (
            <a
              href={r.pdf}
              download="Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={button.primary}
            >
              <Icon name="download" />
              {r.downloadLabel}
            </a>
          )}
          <ResumeClose label={r.closeLabel} className={styles.close} />
        </div>
      </div>

      <section className={styles.block}>
        <Sub className={styles.blockTitle}>{r.summaryTitle}</Sub>
        <p className={styles.summary}>{r.summary}</p>
      </section>

      <section className={`${styles.block} ${styles.jobs}`}>
        <Sub className={styles.blockTitle}>{r.experienceTitle}</Sub>
        {r.jobs.map((j, i) => (
          <div key={i} className={styles.job}>
            <div className={styles.jobHead}>
              <strong className={styles.jobRole}>{j.role}</strong>
              <span className={styles.muted}>{j.time}</span>
            </div>
            <span className={styles.org}>{j.org}</span>
            <ul className={styles.points}>
              {j.points.map((p, k) => (
                <li key={k}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <div className={styles.split}>
        <section className={styles.col}>
          <Sub className={styles.blockTitle}>{r.educationTitle}</Sub>
          {r.education.map((e, i) => (
            <div key={i} className={styles.edu}>
              <div className={styles.eduHead}>
                <strong>{e.degree}</strong>
                <span className={styles.muted}>{e.time}</span>
              </div>
              <span className={styles.org}>{e.school}</span>
            </div>
          ))}
        </section>
        <section className={styles.col}>
          <Sub className={styles.blockTitle}>{r.certsTitle}</Sub>
          <ul className={styles.certs}>
            {r.certs.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className={`${styles.block} ${styles.skillsBlock}`}>
        <Sub className={styles.blockTitle}>{r.skillsTitle}</Sub>
        <dl className={styles.skills}>
          {r.skills.map((s, i) => (
            <div key={i} className={styles.skill}>
              <dt>
                <strong>{s.label}</strong>
              </dt>
              <dd className={styles.skillValue}>{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
