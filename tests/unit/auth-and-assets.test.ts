import { SignJWT } from 'jose';
import { describe, expect, it } from 'vitest';
import { THEMES, accentContrast, contrastRatio, resolveTheme, shade } from '@/content/themes';
import { dummyVerify, hashPassword, verifyPassword } from '@/lib/auth/password';
import { signSession, verifySession } from '@/lib/auth/token';
import { collectBlobUrls, isOurBlobUrl } from '@/lib/storage';
import { checkUpload, MAX_UPLOAD_BYTES, sniffType } from '@/lib/upload-rules';

describe('password hashing', () => {
  it('hashes with argon2id and verifies', async () => {
    const hash = await hashPassword('correct horse battery');
    expect(hash.startsWith('$argon2id$')).toBe(true);
    expect(await verifyPassword(hash, 'correct horse battery')).toBe(true);
    expect(await verifyPassword(hash, 'wrong')).toBe(false);
  });

  it('never throws on a malformed hash', async () => {
    expect(await verifyPassword('not-a-hash', 'x')).toBe(false);
    expect(await dummyVerify('anything')).toBe(false);
  });
});

describe('session tokens', () => {
  it('round-trips a signed session', async () => {
    const token = await signSession('admin-123');
    const claims = await verifySession(token);
    expect(claims?.sub).toBe('admin-123');
    expect(typeof claims?.iat).toBe('number');
  });

  it('rejects tampered, foreign and expired tokens', async () => {
    const token = await signSession('admin-123');
    const [h, p, s] = token.split('.');
    expect(await verifySession(`${h}.${p}x.${s}`)).toBeNull();
    expect(await verifySession(undefined)).toBeNull();

    const foreign = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('admin-123')
      .setIssuer('daniel-lotsu-cms')
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode('a-completely-different-secret-value-123'));
    expect(await verifySession(foreign)).toBeNull();

    const expired = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject('admin-123')
      .setIssuer('daniel-lotsu-cms')
      .setIssuedAt(Math.floor(Date.now() / 1000) - 7200)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 3600)
      .sign(new TextEncoder().encode(process.env.AUTH_SECRET));
    expect(await verifySession(expired)).toBeNull();
  });
});

describe('themes', () => {
  it('every preset accent passes WCAG AA against the page background', () => {
    for (const t of THEMES) expect(accentContrast(t.color).passesAA, t.name).toBe(true);
  });

  it('flags a dark custom colour', () => {
    expect(accentContrast('#333333').passesAA).toBe(false);
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
  });

  it('resolves custom colours and falls back to lime', () => {
    expect(resolveTheme({ theme: 'custom', customColor: '#00ffaa' })).toMatchObject({
      key: 'custom',
      color: '#00FFAA',
      hover: shade('#00FFAA', -0.12),
    });
    expect(resolveTheme({ theme: 'custom', customColor: 'oops' }).key).toBe('lime');
  });
});

describe('uploads', () => {
  const bytes = (...b: (number | string)[]) =>
    new Uint8Array(
      b.flatMap((x) => (typeof x === 'string' ? [...x].map((c) => c.charCodeAt(0)) : [x])),
    );

  it('identifies files by their content, not their name', () => {
    expect(sniffType(bytes(0x89, 'PNG', 0x0d, 0x0a))).toBe('image/png');
    expect(sniffType(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe('image/jpeg');
    expect(sniffType(bytes('RIFF', 0, 0, 0, 0, 'WEBP'))).toBe('image/webp');
    expect(sniffType(bytes(0, 0, 0, 0x1c, 'ftypavif'))).toBe('image/avif');
    expect(sniffType(bytes('%PDF-1.7'))).toBe('application/pdf');
    // A real file: UTF-8 byte-order mark, then the XML prolog.
    expect(sniffType(bytes(0xef, 0xbb, 0xbf, '<?xml version="1.0"?><svg xmlns="x"/>'))).toBe(
      'image/svg+xml',
    );
    expect(sniffType(bytes('<html><script>alert(1)</script>'))).toBeNull();
    expect(sniffType(bytes('MZ'))).toBeNull();
  });

  it('checks type and size before uploading', () => {
    expect(checkUpload({ type: 'image/png', size: 1000 }, 'image')).toBeNull();
    expect(checkUpload({ type: 'image/gif', size: 1000 }, 'image')).not.toBeNull();
    expect(checkUpload({ type: 'image/png', size: MAX_UPLOAD_BYTES + 1 }, 'image')).not.toBeNull();
    expect(checkUpload({ type: 'image/png', size: 10 }, 'file')).not.toBeNull();
    expect(checkUpload({ type: 'application/pdf', size: 10 }, 'file')).toBeNull();
  });

  it('only treats this Blob store as ours, and finds every reference', () => {
    const url = 'https://abc.public.blob.vercel-storage.com/uploads/hero/a.png';
    expect(isOurBlobUrl(url)).toBe(true);
    expect(isOurBlobUrl('https://evil.example.com/a.png')).toBe(false);
    const found = collectBlobUrls({ a: [url, { b: url }], c: 'https://images.unsplash.com/x' });
    expect([...found]).toEqual([url]);
  });
});
