import 'server-only';
import { eq, sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { hashPassword } from './password';

export type Admin = typeof schema.adminUsers.$inferSelect;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

/**
 * Create the single admin from ADMIN_EMAIL / ADMIN_INITIAL_PASSWORD the first
 * time anyone tries to sign in. Once the account exists these variables are
 * ignored, so changing the password in the CMS is permanent.
 */
export async function ensureAdmin(): Promise<void> {
  const db = getDb();
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.adminUsers);
  if (count > 0) return;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!email || !password) return;
  await db
    .insert(schema.adminUsers)
    .values({ email: normalizeEmail(email), passwordHash: await hashPassword(password) })
    .onConflictDoNothing({ target: schema.adminUsers.email });
}

export async function findAdminByEmail(email: string): Promise<Admin | undefined> {
  const [row] = await getDb()
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.email, normalizeEmail(email)))
    .limit(1);
  return row;
}

export async function findAdminById(id: string): Promise<Admin | undefined> {
  const [row] = await getDb()
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.id, id))
    .limit(1);
  return row;
}

export async function setAdminPassword(id: string, password: string): Promise<void> {
  await getDb()
    .update(schema.adminUsers)
    .set({ passwordHash: await hashPassword(password), passwordChangedAt: sql`now()` })
    .where(eq(schema.adminUsers.id, id));
}
