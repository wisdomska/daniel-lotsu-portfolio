import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import button from '@/components/ui/Button.module.css';
import type { Content } from '@/lib/validation/content';
import { SpotlightWord } from './SpotlightWord';
import styles from './Footer.module.css';

interface FooterProps {
  footer: Content['footer'];
  nav: Content['nav'];
  contact: Content['contact'];
  base?: '' | '/';
}

export function Footer({ footer, nav, contact, base = '' }: FooterProps) {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brandCol}>
          <span className={styles.brand}>{footer.brand}</span>
          <span className={styles.tagline}>{footer.tagline}</span>
        </div>
        <nav className={styles.col} aria-labelledby="footer-links">
          <h2 id="footer-links" className={styles.colHeading}>
            {footer.linksHeading}
          </h2>
          <a href={`${base}#top`} className={styles.link}>
            {nav.home}
          </a>
          <a href={`${base}#contact`} className={styles.link}>
            {nav.contact}
          </a>
          <a href={`${base}#blog`} className={styles.link}>
            {nav.blog}
          </a>
        </nav>
        <div className={styles.col}>
          <h2 className={styles.colHeading}>{footer.elsewhereHeading}</h2>
          {contact.githubUrl && (
            <a
              href={contact.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconLink}
            >
              <Icon name="github" size={16} />
              GitHub
            </a>
          )}
          {contact.linkedinUrl && (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconLink}
            >
              <Icon name="linkedin" size={16} />
              LinkedIn
            </a>
          )}
          {contact.email && (
            <a href={`mailto:${contact.email}`} className={styles.iconLink}>
              <Icon name="mail" size={16} />
              Email
            </a>
          )}
        </div>
        <div className={styles.resumeCol}>
          <Link href="/resume" scroll={false} className={button.outline}>
            <Icon name="file-text" />
            {footer.resumeLabel}
          </Link>
        </div>
      </div>
      <SpotlightWord text={footer.bigText} />
      <div className={styles.bottom}>
        <span>{footer.copyright}</span>
        <span className={styles.status}>{footer.status}</span>
      </div>
    </footer>
  );
}
