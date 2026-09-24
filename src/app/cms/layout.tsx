import type { Metadata } from 'next';
import styles from '@/components/cms/cms.module.css';

export const metadata: Metadata = {
  title: { default: 'CMS · Portfolio', template: '%s · CMS' },
  robots: { index: false, follow: false, nocache: true },
};

export default function CmsLayout({ children }: LayoutProps<'/cms'>) {
  return <div className={styles.shell}>{children}</div>;
}
