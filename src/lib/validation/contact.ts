import { z } from 'zod';

/** Name of the hidden field bots fill in and people never see. */
export const HONEYPOT_FIELD = 'website';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please tell me your name').max(100, 'That name is too long'),
  email: z.email('Enter a valid email address').trim().max(254),
  message: z
    .string()
    .trim()
    .min(2, 'Please write a message')
    .max(5000, 'Keep it under 5,000 characters'),
});

export type ContactInput = z.infer<typeof contactSchema>;
