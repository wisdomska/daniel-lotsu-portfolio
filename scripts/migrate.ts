/**
 * Apply committed Drizzle migrations. Runs before `next build` on Vercel
 * (see the vercel-build script), so each environment's database — Production
 * and the separate Preview branch — is migrated by its own deployments.
 * Migrations are additive and idempotent; already-applied ones are skipped.
 */
import './load-env';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  if (!url) {
    console.warn('[migrate] DATABASE_URL is not set — skipping migrations.');
    return;
  }
  const pool = new Pool({ connectionString: url, max: 1 });
  try {
    await migrate(drizzle(pool), { migrationsFolder: './drizzle' });
    console.log('[migrate] Database is up to date.');
  } finally {
    await pool.end();
  }
}

main().catch((err: unknown) => {
  console.error('[migrate] Failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
