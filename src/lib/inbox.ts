import 'server-only';
import { desc, eq, sql } from 'drizzle-orm';
import { getDb, hasDatabase, schema } from '@/lib/db';

export type InboxMessage = typeof schema.inboxMessages.$inferSelect;

export async function countUnread(): Promise<number> {
  if (!hasDatabase()) return 0;
  const [row] = await getDb()
    .select({ n: sql<number>`count(*)::int` })
    .from(schema.inboxMessages)
    .where(eq(schema.inboxMessages.read, false));
  return row?.n ?? 0;
}

export async function listMessages(): Promise<InboxMessage[]> {
  return getDb()
    .select()
    .from(schema.inboxMessages)
    .orderBy(desc(schema.inboxMessages.createdAt))
    .limit(500);
}
