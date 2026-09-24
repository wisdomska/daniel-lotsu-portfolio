import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ViewSwitch } from '@/components/cms/ViewSwitch';
import { isViewId, viewMeta } from '@/components/cms/views';
import { requireAdminPage } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps<'/cms/[section]'>): Promise<Metadata> {
  const { section } = await params;
  return isViewId(section) ? { title: viewMeta(section).title } : {};
}

export default async function CmsSectionPage({ params }: PageProps<'/cms/[section]'>) {
  await requireAdminPage();
  const { section } = await params;
  if (!isViewId(section)) notFound();
  return <ViewSwitch view={section} />;
}
