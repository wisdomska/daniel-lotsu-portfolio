import type { Metadata } from 'next';
import { Starfield } from '@/components/site/Starfield';
import { getPublishedContent } from '@/lib/content';
import { themeStyle } from '@/lib/theme';
import styles from './site.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPublishedContent();
  const image = c.site.ogImage
    ? { url: c.site.ogImage, width: 1200, height: 630, alt: c.site.title }
    : { url: '/api/og', width: 1200, height: 630, alt: c.site.title };
  return {
    title: { default: c.site.title, template: `%s — ${c.resume.name}` },
    description: c.site.description,
    applicationName: c.nav.logo,
    authors: [{ name: c.resume.name }],
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      siteName: c.resume.name,
      title: c.site.title,
      description: c.site.description,
      url: '/',
      locale: 'en_GB',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.site.title,
      description: c.site.description,
      images: [image.url],
    },
  };
}

export default async function SiteLayout({ children, modal }: LayoutProps<'/'>) {
  const content = await getPublishedContent();
  return (
    <div id="top" className={styles.root} style={themeStyle(content.settings)}>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {content.settings.showStars && <Starfield />}
      {children}
      {modal}
    </div>
  );
}
