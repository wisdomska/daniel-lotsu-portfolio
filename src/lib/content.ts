import 'server-only';
import { sql } from 'drizzle-orm';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { cache } from 'react';
import { DEFAULTS } from '@/content/defaults';
import { getDb, hasDatabase, schema } from '@/lib/db';
import { clone, normalizeContent } from '@/lib/merge';
import { SECTION_SCHEMAS, type Content, type SectionId } from '@/lib/validation/content';

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

export interface ValidationIssue {
  /** Dotted path from the content root, e.g. "blog.posts.0.slug". */
  path: string;
  message: string;
}

export type SaveResult<T> = { ok: true; data: T } | { ok: false; issues: ValidationIssue[] };

/** Validate one section against its Zod schema, reporting issues by full path. */
export function validateSection<S extends SectionId>(id: S, data: unknown): SaveResult<Content[S]> {
  const parsed = SECTION_SCHEMAS[id].safeParse(data);
  if (parsed.success) return { ok: true, data: parsed.data as Content[S] };
  return {
    ok: false,
    issues: parsed.error.issues.map((i) => ({
      path: [id, ...i.path.map(String)].join('.'),
      message: i.message,
    })),
  };
}

/** Save a section's working copy. The live site is untouched until it is published. */
export async function saveDraft<S extends SectionId>(
  id: S,
  data: unknown,
): Promise<SaveResult<Content[S]>> {
  const result = validateSection(id, data);
  if (!result.ok) return result;
  const t = schema.contentSections;
  await getDb()
    .insert(t)
    .values({ id, draft: result.data, published: DEFAULTS[id] })
    .onConflictDoUpdate({ target: t.id, set: { draft: result.data, draftUpdatedAt: sql`now()` } });
  return result;
}
