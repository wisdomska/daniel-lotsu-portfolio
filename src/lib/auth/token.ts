import { jwtVerify, SignJWT } from 'jose';

/*
 * Session tokens: an HS256 JWT signed with AUTH_SECRET. This module has no
 * Next.js request dependencies so both the proxy and server code can use it.
 */

export const SESSION_COOKIE = 'dl_cms_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 12;
const ISSUER = 'daniel-lotsu-cms';

export interface SessionClaims {
  /** Admin user id. */
  sub: string;
  /** Issued-at, seconds since epoch. */
  iat: number;
}

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be set to at least 32 characters');
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(adminId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(adminId)
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      issuer: ISSUER,
      algorithms: ['HS256'],
    });
    if (typeof payload.sub !== 'string' || typeof payload.iat !== 'number') return null;
    return { sub: payload.sub, iat: payload.iat };
  } catch {
    return null;
  }
}
