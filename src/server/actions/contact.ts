'use server';

import { after } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { notifyNewMessage } from '@/lib/email';
import { consume, LIMITS } from '@/lib/rate-limit';
import { clientIpHash } from '@/lib/request';
import { contactSchema, HONEYPOT_FIELD } from '@/lib/validation/contact';

export interface ContactState {
  ok?: boolean;
  /** First name, for the thank-you message. */
  name?: string;
  error?: string;
  fieldErrors?: Partial<Record<'name' | 'email' | 'message', string>>;
  /** Echoed back on failure so the form keeps what was typed. */
  values?: { name: string; email: string; message: string };
}

/** Public contact form: honeypot, validation and rate limiting, then the inbox. */
export async function submitContactAction(
  _prev: ContactState,
  form: FormData,
): Promise<ContactState> {
  const firstName = (n: string) => n.trim().split(/\s+/)[0] || 'there';

  // Bots fill every field. Pretend it worked and store nothing.
  if (String(form.get(HONEYPOT_FIELD) ?? '') !== '') {
    return { ok: true, name: firstName(String(form.get('name') ?? '')) };
  }

  const values = {
    name: String(form.get('name') ?? '').slice(0, 100),
    email: String(form.get('email') ?? '').slice(0, 254),
    message: String(form.get('message') ?? '').slice(0, 5000),
  };
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: ContactState['fieldErrors'] = {};
    for (const i of parsed.error.issues) {
      const k = String(i.path[0]) as keyof NonNullable<ContactState['fieldErrors']>;
      fieldErrors[k] ??= i.message;
    }
    return { fieldErrors, values };
  }

  const ipHash = await clientIpHash();
  const limit = await consume(
    `contact:${ipHash}`,
    LIMITS.contactPerIp.limit,
    LIMITS.contactPerIp.window,
  );
  if (!limit.allowed) {
    return {
      error: 'You’ve sent a few messages already. Please try again a little later.',
      values,
    };
  }

  try {
    await getDb()
      .insert(schema.inboxMessages)
      .values({ ...parsed.data, ipHash });
  } catch {
    return {
      error: 'Your message couldn’t be sent just now. Please try again, or email me.',
      values,
    };
  }
  after(() => notifyNewMessage(parsed.data).catch(() => undefined));
  return { ok: true, name: firstName(parsed.data.name) };
}
