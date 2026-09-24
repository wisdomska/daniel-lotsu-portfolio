'use server';

import { redirect } from 'next/navigation';
import { ensureAdmin, findAdminByEmail, normalizeEmail, setAdminPassword } from '@/lib/auth/admin';
import { dummyVerify, verifyPassword } from '@/lib/auth/password';
import { endSession, requireAdmin, startSession } from '@/lib/auth/session';
import { consume, LIMITS, resetLimit } from '@/lib/rate-limit';
import { clientIpHash } from '@/lib/request';
import { changePasswordSchema, loginSchema } from '@/lib/validation/auth';

export interface FormState {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
}

const firstErrors = (issues: { path: PropertyKey[]; message: string }[]) =>
  Object.fromEntries(issues.map((i) => [String(i.path[0]), i.message]));

const minutes = (s: number) => Math.max(1, Math.ceil(s / 60));

export async function loginAction(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: form.get('email'),
    password: form.get('password'),
  });
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error.issues) };
  const { email, password } = parsed.data;

  const ip = await clientIpHash();
  const byIp = await consume(`login:ip:${ip}`, LIMITS.loginPerIp.limit, LIMITS.loginPerIp.window);
  const accountKey = `login:acct:${normalizeEmail(email)}`;
  const byAccount = await consume(
    accountKey,
    LIMITS.loginPerAccount.limit,
    LIMITS.loginPerAccount.window,
  );
  if (!byIp.allowed || !byAccount.allowed) {
    const wait = Math.max(
      byIp.allowed ? 0 : byIp.retryAfter,
      byAccount.allowed ? 0 : byAccount.retryAfter,
    );
    return { error: `Too many sign-in attempts. Try again in ${minutes(wait)} minutes.` };
  }

  await ensureAdmin();
  const admin = await findAdminByEmail(email);
  const valid = admin
    ? await verifyPassword(admin.passwordHash, password)
    : await dummyVerify(password);
  if (!admin || !valid) return { error: 'That email and password don’t match. Try again.' };

  await resetLimit(accountKey);
  await startSession(admin.id);
  const next = String(form.get('next') ?? '');
  // Only ever return to a CMS page on this site.
  redirect(/^\/cms(\/[\w-]*)*$/.test(next) ? next : '/cms');
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect('/cms');
}

export async function changePasswordAction(_prev: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const parsed = changePasswordSchema.safeParse({
    current: form.get('current'),
    next: form.get('next'),
    confirm: form.get('confirm'),
  });
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error.issues) };

  const limit = await consume(
    `password:${admin.id}`,
    LIMITS.loginPerAccount.limit,
    LIMITS.loginPerAccount.window,
  );
  if (!limit.allowed) {
    return { error: `Too many attempts. Try again in ${minutes(limit.retryAfter)} minutes.` };
  }
  if (!(await verifyPassword(admin.passwordHash, parsed.data.current))) {
    return { fieldErrors: { current: 'Your current password is incorrect' } };
  }

  await setAdminPassword(admin.id, parsed.data.next);
  // Older sessions are now rejected; issue a fresh one for this browser.
  await startSession(admin.id);
  return { ok: true };
}
