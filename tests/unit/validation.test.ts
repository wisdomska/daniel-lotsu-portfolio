import { describe, expect, it } from 'vitest';
import { DEFAULTS } from '@/content/defaults';
import { SCHEMA, type Field } from '@/content/schema';
import {
  backupSchema,
  blogSchema,
  contentSchema,
  SECTION_SCHEMAS,
  urlField,
  aboutSchema,
} from '@/lib/validation/content';
import { contactSchema } from '@/lib/validation/contact';
import { changePasswordSchema } from '@/lib/validation/auth';
import type { z } from 'zod';

/** Keys a Zod object schema accepts (unwrapping effects and arrays). */
function zodShape(schema: z.ZodType): Record<string, z.ZodType> | null {
  const def = (
    schema as unknown as {
      def: { type: string; shape?: Record<string, z.ZodType>; element?: z.ZodType; in?: z.ZodType };
    }
  ).def;
  if (def.type === 'object') return def.shape ?? null;
  if (def.type === 'pipe' && def.in) return zodShape(def.in);
  return null;
}

function elementOf(schema: z.ZodType): z.ZodType {
  const def = (schema as unknown as { def: { type: string; element?: z.ZodType; in?: z.ZodType } })
    .def;
  if (def.type === 'array' && def.element) return def.element;
  if (def.type === 'pipe' && def.in) return elementOf(def.in);
  throw new Error('not an array');
}

function checkFields(fields: Field[], schema: z.ZodType, where: string) {
  const shape = zodShape(schema);
  expect(shape, `${where} should be an object schema`).not.toBeNull();
  for (const f of fields) {
    expect(shape, `${where}.${f.key} is in SCHEMA but not in Zod`).toHaveProperty(f.key);
    if (f.type === 'list') checkFields(f.of, elementOf(shape![f.key]), `${where}.${f.key}[]`);
  }
  // …and nothing in Zod is missing from the editor.
  const keys = fields.map((f) => f.key).sort();
  expect(Object.keys(shape!).sort(), `${where} fields differ`).toEqual(keys);
}

describe('SCHEMA ↔ Zod parity', () => {
  it.each(SCHEMA.map((s) => [s.id, s] as const))(
    '%s: every editable field is validated',
    (id, def) => {
      checkFields(def.fields, SECTION_SCHEMAS[id], id);
    },
  );

  it('every content section except settings has an editor', () => {
    const edited = SCHEMA.map((s) => s.id).sort();
    const all = Object.keys(SECTION_SCHEMAS)
      .filter((k) => k !== 'settings')
      .sort();
    expect(edited).toEqual(all);
  });
});

describe('DEFAULTS', () => {
  it('passes the content schema', () => {
    expect(contentSchema.safeParse(DEFAULTS).success).toBe(true);
  });

  it('uses the new contact email everywhere', () => {
    expect(DEFAULTS.contact.email).toBe('danielajayi100@gmail.com');
    expect(DEFAULTS.resume.email).toBe('danielajayi100@gmail.com');
  });

  it('gives every post a unique slug', () => {
    const slugs = DEFAULTS.blog.posts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('field rules', () => {
  it('accepts safe links and rejects script URLs', () => {
    for (const ok of ['', 'https://github.com/x', '/blog', '#contact', 'mailto:a@b.co']) {
      expect(urlField.safeParse(ok).success, ok).toBe(true);
    }
    for (const bad of ['javascript:alert(1)', 'data:text/html,hi', 'ftp://x', 'not a url']) {
      expect(urlField.safeParse(bad).success, bad).toBe(false);
    }
  });

  it('strips HTML from rich text but keeps **bold**', () => {
    const parsed = aboutSchema.parse({
      ...DEFAULTS.about,
      bio: 'Hi <script>x</script>**there** <b>you</b>',
    });
    expect(parsed.bio).toBe('Hi x**there** you');
  });

  it('rejects duplicate and malformed post slugs', () => {
    const [a, b] = DEFAULTS.blog.posts;
    const dup = blogSchema.safeParse({ ...DEFAULTS.blog, posts: [a, { ...b, slug: a.slug }] });
    expect(dup.success).toBe(false);
    const bad = blogSchema.safeParse({ ...DEFAULTS.blog, posts: [{ ...a, slug: 'Not A Slug' }] });
    expect(bad.success).toBe(false);
  });

  it('validates backups strictly', () => {
    const good = {
      format: 'daniel-lotsu-portfolio-backup',
      version: 1,
      exportedAt: 'x',
      content: DEFAULTS,
    };
    expect(backupSchema.safeParse(good).success).toBe(true);
    expect(backupSchema.safeParse({ ...good, version: 2 }).success).toBe(false);
    expect(backupSchema.safeParse({ ...good, content: { hero: {} } }).success).toBe(false);
  });
});

describe('contact form', () => {
  it('requires a name, a valid email and a message', () => {
    expect(
      contactSchema.safeParse({ name: 'Ama', email: 'ama@example.com', message: 'Hello' }).success,
    ).toBe(true);
    expect(
      contactSchema.safeParse({ name: ' ', email: 'ama@example.com', message: 'Hello' }).success,
    ).toBe(false);
    expect(contactSchema.safeParse({ name: 'Ama', email: 'nope', message: 'Hello' }).success).toBe(
      false,
    );
    expect(
      contactSchema.safeParse({ name: 'Ama', email: 'a@b.co', message: 'x'.repeat(5001) }).success,
    ).toBe(false);
  });
});

describe('change password', () => {
  it('needs a long enough, confirmed, different password', () => {
    const base = {
      current: 'old-password-1',
      next: 'new-password-123',
      confirm: 'new-password-123',
    };
    expect(changePasswordSchema.safeParse(base).success).toBe(true);
    expect(
      changePasswordSchema.safeParse({ ...base, next: 'short', confirm: 'short' }).success,
    ).toBe(false);
    expect(changePasswordSchema.safeParse({ ...base, confirm: 'different-123' }).success).toBe(
      false,
    );
    expect(
      changePasswordSchema.safeParse({ ...base, next: base.current, confirm: base.current })
        .success,
    ).toBe(false);
  });
});
