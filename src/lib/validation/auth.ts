import { z } from 'zod';
import { PASSWORD_MAX, PASSWORD_MIN } from './constants';

export { PASSWORD_MAX, PASSWORD_MIN };

export const loginSchema = z.object({
  email: z.email('Enter your email address').max(254),
  password: z.string().min(1, 'Enter your password').max(PASSWORD_MAX),
});

export const changePasswordSchema = z
  .object({
    current: z.string().min(1, 'Enter your current password').max(PASSWORD_MAX),
    next: z
      .string()
      .min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters`)
      .max(PASSWORD_MAX, 'That password is too long'),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, {
    path: ['confirm'],
    message: 'The new passwords don’t match',
  })
  .refine((v) => v.next !== v.current, {
    path: ['next'],
    message: 'Choose a password you haven’t used here',
  });
