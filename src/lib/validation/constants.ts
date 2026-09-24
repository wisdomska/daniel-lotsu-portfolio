/*
 * Plain constants shared with client components. Kept apart from the Zod
 * schemas so importing them never pulls Zod into the public page's bundle.
 */

/** Name of the hidden contact-form field bots fill in and people never see. */
export const HONEYPOT_FIELD = 'website';

export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 200;
