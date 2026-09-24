'use server';

import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/auth/session';
import { getDb, schema } from '@/lib/db';
import { countUnread } from '@/lib/inbox';

const UUID = /^[0-9a-f-]{36}$/i;

export async function setReadAction(id: string, read: boolean): Promise<{ unread: number }> {
  await requireAdmin();
  if (UUID.test(id)) {
    await getDb().update(schema.inboxMessages).set({ read }).where(eq(schema.inboxMessages.id, id));
  }
  return { unread: await countUnread() };
}

export async function deleteMessageAction(id: string): Promise<{ unread: number }> {
  await requireAdmin();
  if (UUID.test(id)) {
    await getDb().delete(schema.inboxMessages).where(eq(schema.inboxMessages.id, id));
  }
  return { unread: await countUnread() };
}
