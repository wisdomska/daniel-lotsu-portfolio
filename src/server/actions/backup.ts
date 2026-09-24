'use server';

import { requireAdmin } from '@/lib/auth/session';
import { getDraftContent } from '@/lib/content';
import { normalizeContent } from '@/lib/merge';
import {
  backupSchema,
  contentSchema,
  SECTION_IDS,
  type Backup,
  type Content,
} from '@/lib/validation/content';

/** The full working copy (including unpublished changes) as a backup document. */
export async function exportBackupAction(): Promise<Backup> {
  await requireAdmin();
  return {
    format: 'daniel-lotsu-portfolio-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    content: await getDraftContent(),
  };
}

export type ImportResult = { ok: true; content: Content } | { ok: false; error: string };

/**
 * Validate a backup file before anything is applied. Accepts this app's
 * backup format, or a bare content object (e.g. the prototype's export),
 * which is completed from the defaults. Nothing is written here: the CMS
 * applies the result to the draft as one undoable change.
 */
export async function validateBackupAction(json: string): Promise<ImportResult> {
  await requireAdmin();
  if (json.length > 5_000_000)
    return { ok: false, error: 'That file is too large to be a backup.' };
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return { ok: false, error: 'That file isn’t valid JSON.' };
  }

  const wrapped = backupSchema.safeParse(data);
  if (wrapped.success) return { ok: true, content: wrapped.data.content };

  const looksLikeContent =
    typeof data === 'object' &&
    data !== null &&
    !Array.isArray(data) &&
    Object.keys(data).some((k) => (SECTION_IDS as string[]).includes(k));
  if (!looksLikeContent) {
    return { ok: false, error: 'That file isn’t a portfolio backup.' };
  }
  // Report what is actually wrong rather than silently dropping sections.
  const bare = contentSchema.safeParse(normalizeContentStrict(data as Record<string, unknown>));
  if (!bare.success) {
    const first = bare.error.issues[0];
    return {
      ok: false,
      error: `The backup has an invalid value at “${first.path.join('.')}”: ${first.message}`,
    };
  }
  return { ok: true, content: bare.data };
}

/** Fill missing sections from defaults, but keep provided sections as-is for validation. */
function normalizeContentStrict(data: Record<string, unknown>): Record<string, unknown> {
  const filled = normalizeContent({}) as unknown as Record<string, unknown>;
  for (const id of SECTION_IDS) {
    if (id in data) filled[id] = { ...(filled[id] as object), ...(data[id] as object) };
  }
  return filled;
}
