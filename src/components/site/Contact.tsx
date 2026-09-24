import { Icon } from '@/components/ui/Icon';
import type { Content } from '@/lib/validation/content';
import { ContactForm } from './ContactForm';
import section from './section.module.css';
import styles from './Contact.module.css';

export function Contact({ contact }: { contact: Content['contact'] }) {
  return (
    <section
      id="contact"
      className={`${section.section} ${styles.contact}`}
      aria-labelledby="contact-title"
    >
      <div className={styles.layout}>
        <div className={styles.intro}>
          <h2 id="contact-title" className={styles.heading}>
            {contact.heading}
          </h2>
          <p className={styles.body}>{contact.body}</p>
          <ul className={styles.links}>
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className={styles.link}>
                  <Icon name="mail" />
                  {contact.email}
                </a>
              </li>
            )}
            {contact.linkedinUrl && (
              <li>
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <Icon name="linkedin" />
                  {contact.linkedinLabel}
                </a>
              </li>
            )}
            {contact.githubUrl && (
              <li>
                <a
                  href={contact.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  <Icon name="github" />
                  {contact.githubLabel}
                </a>
              </li>
            )}
            <li className={styles.location}>
              <Icon name="map-pin" />
              {contact.location}
            </li>
          </ul>
        </div>
        <ContactForm contact={contact} />
      </div>
    </section>
  );
}
