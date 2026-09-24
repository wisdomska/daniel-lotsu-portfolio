import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { SiteImage } from '@/components/ui/SiteImage';
import { postHref } from '@/lib/posts';
import type { Content } from '@/lib/validation/content';
import section from './section.module.css';
import styles from './Blog.module.css';

interface BlogProps {
  blog: Content['blog'];
  /** The /blog index uses this section as its page title. */
  headingLevel?: 'h1' | 'h2';
}

export function Blog({ blog, headingLevel = 'h2' }: BlogProps) {
  const Heading = headingLevel;
  const [feat, ...earlier] = blog.posts;
  return (
    <section id="blog" className={styles.blog} aria-labelledby="blog-title">
      <div className={section.headingRow}>
        <Heading id="blog-title" className={section.heading}>
          {blog.heading}
        </Heading>
        <span className={styles.subtitle}>{blog.subtitle}</span>
      </div>

      {feat && (
        <>
          <Link href={postHref(feat.slug)} scroll={false} className={styles.featured}>
            <div className={styles.featCover}>
              {feat.image && (
                <SiteImage
                  src={feat.image}
                  alt={feat.imageAlt}
                  fill
                  sizes="(max-width: 900px) 100vw, 560px"
                  className={styles.coverImg}
                />
              )}
            </div>
            <div className={styles.featBody}>
              <div className={styles.featMeta}>
                <span className={styles.latest}>{blog.latestLabel}</span>
                <span>{feat.category}</span>
                <span>
                  {feat.date} · {feat.readTime} read
                </span>
              </div>
              <h3 className={styles.featTitle}>{feat.title}</h3>
              <p className={styles.featExcerpt}>{feat.excerpt}</p>
              <span className={styles.readMore}>
                {blog.readMoreLabel}
                <Icon name="arrow-right" />
              </span>
            </div>
          </Link>

          {earlier.length > 0 && (
            <ul className={styles.list}>
              {earlier.map((b) => (
                <li key={b.slug}>
                  <Link href={postHref(b.slug)} scroll={false} className={styles.card}>
                    <div className={styles.thumb}>
                      {b.image && (
                        <SiteImage
                          src={b.image}
                          alt={b.imageAlt}
                          fill
                          sizes="(max-width: 700px) 100vw, 380px"
                          className={styles.coverImg}
                        />
                      )}
                    </div>
                    <span className={styles.cardBody}>
                      <span className={styles.cardCategory}>{b.category}</span>
                      <h3 className={styles.cardTitle}>{b.title}</h3>
                      <span className={styles.cardDate}>
                        {b.date} · {b.readTime}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
