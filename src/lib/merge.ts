import { DEFAULTS } from '@/content/defaults';
import type { Content, SectionId } from '@/lib/validation/content';
import { SECTION_IDS, SECTION_SCHEMAS } from '@/lib/validation/content';

type Plain = { [key: string]: unknown };

const isPlainObject = (v: unknown): v is Plain =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Deep-merge `over` onto `base`. Objects merge key by key; arrays and scalars
 * from `over` replace the base value outright (a list the editor shortened
 * must stay short). `undefined` in `over` keeps the base value.
 */
export function deepMerge<T>(base: T, over: unknown): T {
  if (over === undefined) return base;
  if (!isPlainObject(base) || !isPlainObject(over)) return over as T;
  const out: Plain = { ...base };
  for (const [k, v] of Object.entries(over)) {
    out[k] =
      isPlainObject(base[k]) && isPlainObject(v)
        ? deepMerge(base[k], v)
        : v === undefined
          ? base[k]
          : v;
  }
  return out as T;
}

export const clone = <T>(v: T): T => structuredClone(v);

/**
 * Bring one stored section up to the current shape: fill fields added since it
 * was saved from DEFAULTS, then validate. Anything that no longer validates
 * falls back to the default for that section rather than breaking the page.
 */
export function normalizeSection<S extends SectionId>(id: S, stored: unknown): Content[S] {
  const merged = deepMerge(clone(DEFAULTS[id]), stored);
  const parsed = SECTION_SCHEMAS[id].safeParse(merged);
  return (parsed.success ? parsed.data : clone(DEFAULTS[id])) as Content[S];
}

/** Assemble a full content document from whatever sections are stored. */
export function normalizeContent(stored: Partial<Record<SectionId, unknown>>): Content {
  const out = {} as Record<SectionId, unknown>;
  for (const id of SECTION_IDS) out[id] = normalizeSection(id, stored[id]);
  return out as Content;
}
