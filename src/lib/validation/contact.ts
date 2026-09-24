import { z } from 'zod';

export { HONEYPOT_FIELD } from './constants';

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
