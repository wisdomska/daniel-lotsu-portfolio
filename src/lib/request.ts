import 'server-only';
import { createHmac } from 'node:crypto';
import { headers } from 'next/headers';

/** Best-effort client IP from Vercel's proxy headers. */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return (h.get('x-real-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown').slice(
    0,
    64,
  );
}

/**
 * Keyed hash of the client IP. Rate limits and the inbox store this instead
 * of the address itself.
 */
export async function clientIpHash(): Promise<string> {
  const secret = process.env.AUTH_SECRET ?? 'dev-only-secret';
  return createHmac('sha256', secret)
    .update(await clientIp())
    .digest('hex')
    .slice(0, 32);
}
