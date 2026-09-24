import type { Metadata } from 'next';
import { SettingsPanel } from '@/components/cms/SettingsPanel';
import { requireAdminPage } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  const admin = await requireAdminPage();
  return <SettingsPanel email={admin.email} />;
}
