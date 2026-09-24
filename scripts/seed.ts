/**
 * Seed the content tables from src/content/defaults.ts.
 *
 *   pnpm db:seed           insert any section that does not exist yet (safe to re-run)
 *   pnpm db:seed --force   overwrite every section's draft and published copy
 *
 * Icon and image URLs are stored exactly as the design had them, so a freshly
 * seeded site looks identical to the prototype.
 */
import './load-env';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DEFAULTS } from '../src/content/defaults';
import { contentSections } from '../src/lib/db/schema';
import { SECTION_IDS, contentSchema } from '../src/lib/validation/content';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.warn('[seed] DATABASE_URL is not set — skipping seed.');
    return;
  }
  const force = process.argv.includes('--force');
  // Refuse to seed content that would not pass the CMS's own validation.
  contentSchema.parse(DEFAULTS);

  const pool = new Pool({ connectionString: url, max: 1 });
  const db = drizzle(pool);
  try {
    const rows = SECTION_IDS.map((id) => ({ id, draft: DEFAULTS[id], published: DEFAULTS[id] }));
    const q = db.insert(contentSections).values(rows);
    const result = force
      ? await q.onConflictDoUpdate({
          target: contentSections.id,
          set: {
            draft: sql`excluded.draft`,
            published: sql`excluded.published`,
            draftUpdatedAt: sql`now()`,
            publishedAt: sql`now()`,
          },
        })
      : await q.onConflictDoNothing({ target: contentSections.id });
    console.log(
      `[seed] ${force ? 'Reset' : 'Inserted'} ${result.rowCount ?? 0} of ${rows.length} sections.`,
    );
  } finally {
    await pool.end();
  }
}

main().catch((err: unknown) => {
  console.error('[seed] Failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
