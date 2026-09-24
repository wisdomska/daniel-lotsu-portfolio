import { Icon } from '@/components/ui/Icon';
import { SiteImage } from '@/components/ui/SiteImage';
import button from '@/components/ui/Button.module.css';
import type { Content } from '@/lib/validation/content';
import section from './section.module.css';
import styles from './Projects.module.css';
import { TechTag } from './TechTag';

interface ProjectsProps {
  projects: Content['projects'];
  layout: Content['settings']['projectLayout'];
}

export function Projects({ projects, layout }: ProjectsProps) {
  return (
    <section id="projects" className={section.section} aria-labelledby="projects-title">
      <div className={section.headingRow}>
        <h2 id="projects-title" className={section.heading}>
          {projects.heading}
        </h2>
        {projects.buttonUrl && (
          <a
            href={projects.buttonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={button.outline}
          >
            <Icon name="github" />
            {projects.buttonLabel} ↗
          </a>
        )}
      </div>

      {layout === 'list' ? (
        <div className={styles.list}>
          {projects.items.map((p, i) => (
            <article key={i} className={styles.row}>
              <h3 className={styles.rowTitle}>{p.title}</h3>
              <div className={styles.rowBody}>
                <p className={styles.rowText}>{p.description}</p>
                {p.tags.length > 0 && (
                  <ul className={styles.tags} aria-label="Technologies">
                    {p.tags.map((t, k) => (
                      <TechTag key={k} {...t} />
                    ))}
                  </ul>
                )}
              </div>
              <span className={styles.status}>{p.status}</span>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.items.map((p, i) => (
            <article key={i} className={styles.card}>
              <div className={`${styles.cover} ${section.placeholder}`}>
                {p.image ? (
                  <SiteImage
                    src={p.image}
                    alt={p.imageAlt || p.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 560px"
                    className={styles.coverImg}
                  />
                ) : (
                  <span className={section.mono} aria-hidden="true">
                    {p.imageLabel}
                  </span>
                )}
                {p.featured && <span className={styles.featured}>{projects.featuredLabel}</span>}
              </div>
              <div className={styles.titleRow}>
                <h3 className={styles.title}>{p.title}</h3>
                <span className={styles.status}>{p.status}</span>
              </div>
              <p className={styles.text}>{p.description}</p>
              <div className={styles.meta}>
                {p.tags.length > 0 && (
                  <ul className={styles.tags} aria-label="Technologies">
                    {p.tags.map((t, k) => (
                      <TechTag key={k} {...t} />
                    ))}
                  </ul>
                )}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.visit}
                  >
                    Visit<span className="visually-hidden"> {p.title}</span>
                    <Icon name="arrow-up-right" size={16} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
