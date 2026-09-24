import type { Metadata } from 'next';
import { Inbox } from '@/components/cms/Inbox';
import { requireAdminPage } from '@/lib/auth/session';
import { listMessages } from '@/lib/inbox';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Inbox' };

export default async function InboxPage() {
  await requireAdminPage();
  const messages = await listMessages();
  return (
    <Inbox
      initial={messages.map((m) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        message: m.message,
        read: m.read,
        createdAt: m.createdAt.toISOString(),
      }))}
    />
  );
}
