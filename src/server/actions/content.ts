'use server';

import { after } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import {
  listVersions,
  publishSections,
  restoreVersion,
  saveDraft,
  type PublishResult,
  type ValidationIssue,
  type VersionSummary,
} from '@/lib/content';
import { cleanupUnusedUploads } from '@/lib/storage';
import { isSectionId, type SectionId } from '@/lib/validation/content';

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

/** Make the given sections' drafts live. */
export async function publishAction(sections: string[]): Promise<ActionResult<PublishResult>> {
  await requireAdmin();
  const ids = [...new Set(sections)].filter(isSectionId);
  if (ids.length === 0) return { ok: false, error: 'Nothing to publish' };
  const result = await publishSections(ids as SectionId[]);
  // Replaced images are only deleted once nothing refers to them any more.
  after(() => cleanupUnusedUploads().catch(() => undefined));
  return { ok: true, data: result };
}

export async function listVersionsAction(section: string): Promise<ActionResult<VersionSummary[]>> {
  await requireAdmin();
  if (!isSectionId(section)) return { ok: false, error: 'Unknown section' };
  return { ok: true, data: await listVersions(section) };
}

export async function restoreVersionAction(
  versionId: string,
): Promise<ActionResult<{ section: SectionId; data: unknown }>> {
  await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(versionId)) return { ok: false, error: 'Unknown version' };
  const restored = await restoreVersion(versionId);
  if (!restored) return { ok: false, error: 'That version could not be restored' };
  return { ok: true, data: { section: restored.id, data: restored.data } };
}
