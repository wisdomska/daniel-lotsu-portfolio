import 'server-only';
import { hash, verify } from '@node-rs/argon2';

/** argon2id with the library's OWASP-aligned defaults. */
export function hashPassword(password: string): Promise<string> {
  return hash(password);
}

export async function verifyPassword(stored: string, password: string): Promise<boolean> {
  try {
    return await verify(stored, password);
  } catch {
    return false;
  }
}

/**
 * Verified against when the email is unknown, so a wrong email takes as long
 * as a wrong password and response timing does not reveal which it was.
 */
let dummy: Promise<string> | null = null;
export function dummyVerify(password: string): Promise<boolean> {
  dummy ??= hash('not-the-password');
  return dummy.then((h) => verifyPassword(h, password));
}
