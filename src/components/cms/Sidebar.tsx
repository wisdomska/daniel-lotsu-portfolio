'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { useCms } from './CmsProvider';
import { NAV_GROUPS, viewFromPath, viewHref, viewMeta } from './views';
import styles from './shell.module.css';

export function Sidebar() {
  const active = viewFromPath(usePathname());
  const { unread } = useCms();

  return (
    <nav className={styles.sidebar} aria-label="CMS sections">
      {NAV_GROUPS.map((g) => (
        <div key={g.label} className={styles.navGroup}>
          <span className={styles.navLabel}>{g.label}</span>
          {g.items.map((id) => {
            const meta = viewMeta(id);
            const isActive = id === active;
            const badge = id === 'inbox' && unread > 0 ? unread : 0;
            return (
              <Link
                key={id}
                href={viewHref(id)}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon name={meta.icon} size={16} />
                <span className={styles.navText}>{meta.title}</span>
                {badge > 0 && (
                  <span className={styles.badge} aria-label={`${badge} unread`}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
