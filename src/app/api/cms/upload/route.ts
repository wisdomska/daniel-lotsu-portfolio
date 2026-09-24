import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getAdmin } from '@/lib/auth/session';
import { hasBlobStore } from '@/lib/storage';
import { EXTENSIONS, MAX_UPLOAD_BYTES, UPLOAD_TYPES } from '@/lib/upload-rules';

/**
 * Issues short-lived tokens so the CMS can upload straight from the browser to
 * Vercel Blob (serverless request bodies are capped at 4.5 MB). Only a
 * signed-in admin gets a token, only for the accepted types, up to 5 MB, and
 * only under uploads/. The file is re-checked server-side afterwards
 * (registerUploadAction) before it is used.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!hasBlobStore()) {
    return NextResponse.json(
      { error: 'Uploads are not configured (BLOB_READ_WRITE_TOKEN is missing).' },
      { status: 503 },
    );
  }
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await getAdmin())) throw new Error('Not signed in');
        const ext = pathname.split('.').pop()?.toLowerCase() ?? '';
        const allowedExt = new Set([...Object.values(EXTENSIONS), 'jpeg']);
        if (!pathname.startsWith('uploads/') || !allowedExt.has(ext)) {
          throw new Error('That file type is not allowed');
        }
        return {
          allowedContentTypes: [...UPLOAD_TYPES],
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
        };
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    const status = message === 'Not signed in' ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
