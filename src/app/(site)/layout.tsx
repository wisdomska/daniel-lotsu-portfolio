import { Starfield } from '@/components/site/Starfield';
import { getPublishedContent } from '@/lib/content';
import { themeStyle } from '@/lib/theme';
import styles from './site.module.css';

export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const content = await getPublishedContent();
  return (
    <div id="top" className={styles.root} style={themeStyle(content.settings)}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {content.settings.showStars && <Starfield />}
      {children}
    </div>
  );
}
