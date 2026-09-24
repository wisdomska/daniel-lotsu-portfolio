import { Resume } from '@/components/site/Resume';
import styles from '@/components/site/Resume.module.css';
import { RouteDialog } from '@/components/ui/RouteDialog';
import { getPublishedContent } from '@/lib/content';

/** The resume opened from the nav or footer: a dialog over the current page. */
export default async function ResumeModal() {
  const c = await getPublishedContent();
  return (
    <RouteDialog className={styles.dialog} labelledBy="resume-title" closeOnBackdrop>
      <Resume resume={c.resume} headingLevel="h2" titleId="resume-title" />
    </RouteDialog>
  );
}
