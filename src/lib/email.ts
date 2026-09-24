import 'server-only';
import { Resend } from 'resend';
import type { ContactInput } from '@/lib/validation/contact';

/**
 * Email Daniel about a new contact message. Optional: without RESEND_API_KEY
 * this does nothing — the message is already safe in the CMS inbox.
 */
export async function notifyNewMessage(msg: ContactInput): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  if (!key || !to) return;
  const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://daniel-lotsu.vercel.app';
  const { error } = await new Resend(key).emails.send({
    from,
    to,
    replyTo: msg.email,
    subject: `New message from ${msg.name.slice(0, 80)}`,
    text: [
      `${msg.name} <${msg.email}> wrote:`,
      '',
      msg.message,
      '',
      '—',
      `Reply to this email to answer, or see it in your inbox: ${site}/cms/inbox`,
    ].join('\n'),
  });
  // Never log the message itself or the sender's details.
  if (error) console.error('[contact] Notification email failed:', error.name);
}
