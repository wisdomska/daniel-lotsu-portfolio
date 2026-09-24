import 'server-only';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { cache } from 'react';
import { DEFAULTS } from '@/content/defaults';
import { getDb, hasDatabase, schema } from '@/lib/db';
import { clone, normalizeContent } from '@/lib/merge';
import type { Content, SectionId } from '@/lib/validation/content';

/** Cache tag on every read of published content. */
export const CONTENT_TAG = 'content:published';

type Stored = Partial<Record<SectionId, unknown>>;

async function readSections(column: 'draft' | 'published'): Promise<Stored> {
  const rows = await getDb()
    .select({ id: schema.contentSections.id, data: schema.contentSections[column] })
    .from(schema.contentSections);
  return Object.fromEntries(rows.map((r) => [r.id, r.data]));
}

/**
 * Published content for the public site. Pages are prerendered and the result
 * is cached under CONTENT_TAG until the CMS publishes, which revalidates it
 * (see revalidatePublished). Without a database (CI builds, first local run)
 * the seed defaults are served so the site still renders.
 */
const readPublished = unstable_cache(
  async (): Promise<Content> => {
    if (!hasDatabase()) return clone(DEFAULTS);
    return normalizeContent(await readSections('published'));
  },
  ['published-content'],
  { tags: [CONTENT_TAG] },
);

export const getPublishedContent = cache(readPublished);

/** The CMS's working copy. Never cached: editors must always see their latest save. */
export async function getDraftContent(): Promise<Content> {
  if (!hasDatabase()) return clone(DEFAULTS);
  return normalizeContent(await readSections('draft'));
}

/** Push freshly published content to the live site within seconds, without a redeploy. */
export function revalidatePublished() {
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath('/', 'layout');
}
