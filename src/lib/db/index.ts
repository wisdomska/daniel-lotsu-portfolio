import 'server-only';
import { attachDatabasePool } from '@vercel/functions';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export type Db = NodePgDatabase<typeof schema>;

let instance: Db | null = null;

export const hasDatabase = () => Boolean(process.env.DATABASE_URL);

/**
 * Lazily created Drizzle client over a pg Pool. Neon's pooled connection
 * string is used in production; locally it points at PGlite (`pnpm db:local`).
 * On Vercel the pool is attached so idle clients are released before the
 * function instance is suspended.
 */
export function getDb(): Db {
  if (instance) return instance;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  const pool = new Pool({
    connectionString: url,
    max: Number(process.env.DATABASE_POOL_MAX ?? 5),
    idleTimeoutMillis: 10_000,
  });
  if (process.env.VERCEL) attachDatabasePool(pool);
  instance = drizzle(pool, { schema });
  return instance;
}

export { schema };
