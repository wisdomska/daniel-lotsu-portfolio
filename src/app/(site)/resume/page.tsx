import type { Metadata } from 'next';
import { Resume } from '@/components/site/Resume';
import styles from '@/components/site/Resume.module.css';
import { getPublishedContent } from '@/lib/content';

export async function generateMetadata(): Promise<Metadata> {
  const c = await getPublishedContent();
  return {
    title: c.nav.resume,
    description: c.resume.summary,
    alternates: { canonical: '/resume' },
    openGraph: {
      title: `${c.nav.resume} — ${c.resume.name}`,
      description: c.resume.summary,
      url: '/resume',
    },
  };
}

export default async function ResumePage() {
  const c = await getPublishedContent();
  return (
    <main id="main" className={styles.page}>
      <Resume resume={c.resume} headingLevel="h1" titleId="resume-title" />
    </main>
  );
}
