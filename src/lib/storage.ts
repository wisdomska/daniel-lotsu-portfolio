import 'server-only';
import { del, head } from '@vercel/blob';
import { and, inArray, lt, notInArray, sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { sniffType, MAX_UPLOAD_BYTES, type UploadType } from '@/lib/upload-rules';

export const hasBlobStore = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/** Only blobs in this project's store are ours to register or delete. */
export function isOurBlobUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.hostname.endsWith('.public.blob.vercel-storage.com');
  } catch {
    return false;
  }
}

export type RegisterResult =
  { ok: true; url: string; contentType: UploadType } | { ok: false; error: string };

/**
 * Called after a direct browser upload finishes. Re-checks the stored file on
 * the server — size and real type from its first bytes — deletes it if it is
 * not acceptable, and records it so it can be cleaned up once unused.
 */
export async function registerUpload(
  url: string,
  expected: 'image' | 'file',
): Promise<RegisterResult> {
  if (!isOurBlobUrl(url)) return { ok: false, error: 'Unknown upload location.' };
  const meta = await head(url);
  const reject = async (error: string): Promise<RegisterResult> => {
    await del(url).catch(() => undefined);
    return { ok: false, error };
  };
  if (meta.size > MAX_UPLOAD_BYTES) return reject('That file is larger than 5 MB.');

  const res = await fetch(url, { headers: { Range: 'bytes=0-1023' }, cache: 'no-store' });
  const bytes = new Uint8Array(await res.arrayBuffer());
  const type = sniffType(bytes);
  const isImage = type?.startsWith('image/') ?? false;
  if (!type || (expected === 'image' ? !isImage : type !== 'application/pdf')) {
    return reject(
      expected === 'image'
        ? 'That file isn’t a PNG, JPG, WebP, SVG or AVIF image.'
        : 'That file isn’t a PDF.',
    );
  }

  await getDb()
    .insert(schema.blobAssets)
    .values({ url, pathname: meta.pathname, contentType: type, size: meta.size })
    .onConflictDoNothing({ target: schema.blobAssets.url });
  return { ok: true, url, contentType: type };
}

/** Every Blob URL mentioned anywhere in a JSON value. */
export function collectBlobUrls(value: unknown, into = new Set<string>()): Set<string> {
  if (typeof value === 'string') {
    if (isOurBlobUrl(value)) into.add(value);
  } else if (Array.isArray(value)) {
    for (const v of value) collectBlobUrls(v, into);
  } else if (value && typeof value === 'object') {
    for (const v of Object.values(value)) collectBlobUrls(v, into);
  }
  return into;
}

/**
 * Delete uploads that no draft, published copy or saved version refers to any
 * more. Files uploaded in the last hour are kept, so an image uploaded but not
 * yet saved into a draft is never swept away.
 */
export async function cleanupUnusedUploads(): Promise<number> {
  if (!hasBlobStore()) return 0;
  const db = getDb();
  const [sections, versions] = await Promise.all([
    db
      .select({ d: schema.contentSections.draft, p: schema.contentSections.published })
      .from(schema.contentSections),
    db.select({ data: schema.sectionVersions.data }).from(schema.sectionVersions),
  ]);
  const used = new Set<string>();
  for (const s of sections) {
    collectBlobUrls(s.d, used);
    collectBlobUrls(s.p, used);
  }
  for (const v of versions) collectBlobUrls(v.data, used);

  const stale = lt(schema.blobAssets.createdAt, sql`now() - interval '1 hour'`);
  const orphans = await db
    .select({ url: schema.blobAssets.url })
    .from(schema.blobAssets)
    .where(used.size ? and(stale, notInArray(schema.blobAssets.url, [...used])) : stale);
  if (orphans.length === 0) return 0;

  const urls = orphans.map((o) => o.url);
  await del(urls);
  await db.delete(schema.blobAssets).where(inArray(schema.blobAssets.url, urls));
  return urls.length;
}
