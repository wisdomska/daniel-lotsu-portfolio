/**
 * What the CMS accepts as uploads. Shared by the browser (fast feedback) and
 * the server (the actual enforcement), so the rules cannot drift.
 */

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'image/avif',
] as const;
export const FILE_TYPES = ['application/pdf'] as const;
export const UPLOAD_TYPES = [...IMAGE_TYPES, ...FILE_TYPES] as const;
export type UploadType = (typeof UPLOAD_TYPES)[number];

export const EXTENSIONS: Record<UploadType, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/avif': 'avif',
  'application/pdf': 'pdf',
};

export const isUploadType = (t: string): t is UploadType =>
  (UPLOAD_TYPES as readonly string[]).includes(t);

/** A message to show, or null if the file is acceptable for this field. */
export function checkUpload(
  file: { size: number; type: string },
  kind: 'image' | 'file',
): string | null {
  const allowed: readonly string[] = kind === 'image' ? IMAGE_TYPES : FILE_TYPES;
  if (!allowed.includes(file.type)) {
    return kind === 'image' ? 'Use a PNG, JPG, WebP, SVG or AVIF image.' : 'Upload a PDF file.';
  }
  if (file.size > MAX_UPLOAD_BYTES) return 'That file is larger than 5 MB.';
  if (file.size === 0) return 'That file is empty.';
  return null;
}

/**
 * Identify a file from its first bytes, regardless of the name or the type the
 * browser claimed. Returns null for anything that is not an accepted format.
 */
export function sniffType(bytes: Uint8Array): UploadType | null {
  const b = (i: number) => bytes[i];
  const ascii = (from: number, to: number) => String.fromCharCode(...bytes.slice(from, to));
  if (b(0) === 0x89 && ascii(1, 4) === 'PNG') return 'image/png';
  if (b(0) === 0xff && b(1) === 0xd8 && b(2) === 0xff) return 'image/jpeg';
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  if (ascii(4, 8) === 'ftyp' && ['avif', 'avis'].includes(ascii(8, 12))) return 'image/avif';
  if (ascii(0, 5) === '%PDF-') return 'application/pdf';
  // trimStart() also drops a leading byte-order mark.
  const head = new TextDecoder().decode(bytes).trimStart().toLowerCase();
  if (
    (head.startsWith('<?xml') || head.startsWith('<svg') || head.startsWith('<!--')) &&
    head.includes('<svg')
  ) {
    return 'image/svg+xml';
  }
  return null;
}
