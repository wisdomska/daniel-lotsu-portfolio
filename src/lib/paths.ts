/** Immutable get/set by path, used by the CMS editor to update nested content. */

export type PathKey = string | number;
export type Path = readonly PathKey[];

type Indexable = Record<PathKey, unknown>;

export function getIn(obj: unknown, path: Path): unknown {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur === null || typeof cur !== 'object') return undefined;
    cur = (cur as Indexable)[key];
  }
  return cur;
}

export function setIn<T>(obj: T, path: Path, value: unknown): T {
  if (path.length === 0) return value as T;
  const [key, ...rest] = path;
  const base: Indexable = Array.isArray(obj)
    ? ([...obj] as unknown as Indexable)
    : { ...((obj ?? {}) as Indexable) };
  base[key] = setIn(obj == null ? undefined : (obj as Indexable)[key], rest, value);
  return base as T;
}

export const pathId = (path: Path) => path.join('.');

/** Array helpers that return new arrays (never mutate the argument). */
export function moveItem<T>(arr: readonly T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length || from === to) return [...arr];
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function removeItem<T>(arr: readonly T[], index: number): T[] {
  return arr.filter((_, i) => i !== index);
}

export function insertItem<T>(arr: readonly T[], index: number, item: T): T[] {
  const next = [...arr];
  next.splice(index, 0, item);
  return next;
}

/** "new-post", "new-post-2", … — the first slug not already taken. */
export function uniqueSlug(base: string, taken: readonly string[]): string {
  if (!taken.includes(base)) return base;
  let n = 2;
  while (taken.includes(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
}
