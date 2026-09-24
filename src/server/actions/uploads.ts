'use server';

import { requireAdmin } from '@/lib/auth/session';
import { registerUpload, type RegisterResult } from '@/lib/storage';

/** Verify and record a file the browser just uploaded to Vercel Blob. */
export async function registerUploadAction(
  url: string,
  kind: 'image' | 'file',
): Promise<RegisterResult> {
  await requireAdmin();
  try {
    return await registerUpload(url, kind);
  } catch {
    return { ok: false, error: 'Couldn’t check that upload. Please try again.' };
  }
}
