'use server';

import { requireAdmin } from '@/lib/auth/session';
import { saveDraft, type ValidationIssue } from '@/lib/content';
import { isSectionId } from '@/lib/validation/content';

export type ActionResult<T = undefined> =
  { ok: true; data: T } | { ok: false; error?: string; issues?: ValidationIssue[] };

/** Autosave one section's draft. Validated server-side; the client is never trusted. */
export async function saveDraftAction(
  section: string,
  data: unknown,
): Promise<ActionResult<{ savedAt: string }>> {
  await requireAdmin();
  if (!isSectionId(section)) return { ok: false, error: 'Unknown section' };
  const result = await saveDraft(section, data);
  if (!result.ok) return { ok: false, issues: result.issues };
  return { ok: true, data: { savedAt: new Date().toISOString() } };
}
