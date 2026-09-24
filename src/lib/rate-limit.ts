import 'server-only';
import { eq, sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
}

/**
 * Database-backed fixed-window rate limiter (no extra service to run).
 * One atomic upsert per call: the counter restarts when its window has passed.
 */
export async function consume(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const t = schema.rateLimits;
  const expired = sql`${t.windowStart} < now() - (${windowSeconds}::int * interval '1 second')`;
  const [row] = await getDb()
    .insert(t)
    .values({ key, count: 1 })
    .onConflictDoUpdate({
      target: t.key,
      set: {
        count: sql`case when ${expired} then 1 else ${t.count} + 1 end`,
        windowStart: sql`case when ${expired} then now() else ${t.windowStart} end`,
      },
    })
    .returning({
      count: t.count,
      resetIn: sql<number>`greatest(0, ceil(extract(epoch from (${t.windowStart} + (${windowSeconds}::int * interval '1 second') - now()))))::int`,
    });
  return {
    allowed: row.count <= limit,
    remaining: Math.max(0, limit - row.count),
    retryAfter: row.resetIn,
  };
}

export async function resetLimit(key: string): Promise<void> {
  await getDb().delete(schema.rateLimits).where(eq(schema.rateLimits.key, key));
}

export const LIMITS = {
  loginPerIp: { limit: 10, window: 15 * 60 },
  loginPerAccount: { limit: 5, window: 15 * 60 },
  contactPerIp: { limit: 5, window: 60 * 60 },
} as const;
