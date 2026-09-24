import { Resume } from '@/components/site/Resume';
import styles from '@/components/site/Resume.module.css';
import { getPublishedContent } from '@/lib/content';

export default async function ResumePage() {
  const c = await getPublishedContent();
  return (
    <main id="main" className={styles.page}>
      <Resume resume={c.resume} headingLevel="h1" titleId="resume-title" />
    </main>
  );
}
