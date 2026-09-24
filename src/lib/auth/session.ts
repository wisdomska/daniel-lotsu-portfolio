import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { findAdminById, type Admin } from './admin';
import { SESSION_COOKIE, SESSION_TTL_SECONDS, signSession, verifySession } from './token';

export async function startSession(adminId: string): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, await signSession(adminId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
    priority: 'high',
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

/**
 * The signed-in admin, or null. Beyond the signature and expiry checked by
 * the proxy, this confirms the account still exists and that the session was
 * issued after the last password change.
 */
export const getAdmin = cache(async (): Promise<Admin | null> => {
  const claims = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!claims) return null;
  const admin = await findAdminById(claims.sub);
  if (!admin) return null;
  // iat has one-second resolution; allow the change and the new session to share a second.
  if (claims.iat + 1 < Math.floor(admin.passwordChangedAt.getTime() / 1000)) return null;
  return admin;
});

/** For CMS pages: the admin, or a redirect to the sign-in screen. */
export async function requireAdminPage(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect('/cms');
  return admin;
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Not signed in');
    this.name = 'UnauthorizedError';
  }
}

/** For server actions and route handlers: never trust the client, check every call. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) throw new UnauthorizedError();
  return admin;
}
