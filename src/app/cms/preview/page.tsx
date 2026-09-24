import type { Metadata } from 'next';
import { PreviewClient } from '@/components/cms/PreviewClient';
import { requireAdminPage } from '@/lib/auth/session';
import { getDraftContent } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Preview' };

/** The draft home page, shown inside the CMS's live preview pane. Admin only. */
export default async function PreviewPage() {
  await requireAdminPage();
  return <PreviewClient initial={await getDraftContent()} />;
}
