import { SiteImage } from '@/components/ui/SiteImage';
import styles from './Projects.module.css';

export function TechTag({ label, icon }: { label: string; icon: string }) {
  return (
    <li className={styles.tag}>
      {icon ? (
        <SiteImage src={icon} alt="" width={14} height={14} className={styles.tagIcon} />
      ) : (
        <span className={styles.tagIcon} aria-hidden="true" />
      )}
      {label}
    </li>
  );
}
