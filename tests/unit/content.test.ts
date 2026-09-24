import { describe, expect, it } from 'vitest';
import { DEFAULTS } from '@/content/defaults';
import { deepMerge, normalizeContent, normalizeSection } from '@/lib/merge';
import { getIn, moveItem, removeItem, insertItem, setIn, slugify, uniqueSlug } from '@/lib/paths';
import { findPost } from '@/lib/posts';
import { richSegments } from '@/lib/rich-text';
import { jsonLd, toIsoDate } from '@/lib/seo';

describe('deepMerge', () => {
  it('merges objects key by key and replaces arrays', () => {
    const merged = deepMerge(
      { a: 1, b: { c: 2, d: 3 }, list: [1, 2, 3] },
      { b: { c: 9 }, list: [4] },
    );
    expect(merged).toEqual({ a: 1, b: { c: 9, d: 3 }, list: [4] });
  });

  it('keeps the base where the override is undefined', () => {
    expect(deepMerge({ a: 1 }, { a: undefined })).toEqual({ a: 1 });
    expect(deepMerge({ a: 1 }, undefined)).toEqual({ a: 1 });
  });
});

describe('normalizeContent', () => {
  it('fills missing sections and fields from DEFAULTS', () => {
    const c = normalizeContent({ hero: { firstName: 'Kofi' } });
    expect(c.hero.firstName).toBe('Kofi');
    expect(c.hero.lastName).toBe(DEFAULTS.hero.lastName);
    expect(c.blog).toEqual(DEFAULTS.blog);
  });

  it('falls back to the default when a stored section is invalid', () => {
    expect(normalizeSection('nav', { showAvailability: 'yes' })).toEqual(DEFAULTS.nav);
  });

  it('does not mutate DEFAULTS', () => {
    const c = normalizeContent({});
    c.hero.firstName = 'Changed';
    expect(DEFAULTS.hero.firstName).toBe('Daniel');
  });
});

describe('paths', () => {
  it('sets nested values immutably', () => {
    const src = { a: { list: [{ x: 1 }, { x: 2 }] } };
    const out = setIn(src, ['a', 'list', 1, 'x'], 5);
    expect(getIn(out, ['a', 'list', 1, 'x'])).toBe(5);
    expect(src.a.list[1].x).toBe(2);
    expect(Array.isArray(getIn(out, ['a', 'list']))).toBe(true);
  });

  it('moves, removes and inserts without mutating', () => {
    const arr = ['a', 'b', 'c'];
    expect(moveItem(arr, 0, 2)).toEqual(['b', 'c', 'a']);
    expect(moveItem(arr, 0, -1)).toEqual(arr);
    expect(removeItem(arr, 1)).toEqual(['a', 'c']);
    expect(insertItem(arr, 1, 'z')).toEqual(['a', 'z', 'b', 'c']);
    expect(arr).toEqual(['a', 'b', 'c']);
  });

  it('makes URL-safe, unique slugs', () => {
    expect(slugify("Cold starts aren't the enemy — 60%!")).toBe('cold-starts-arent-the-enemy-60');
    expect(uniqueSlug('new-post', ['new-post', 'new-post-2'])).toBe('new-post-3');
    expect(uniqueSlug('fresh', ['new-post'])).toBe('fresh');
  });
});

describe('findPost', () => {
  it('finds a post with wrap-around neighbours', () => {
    const posts = DEFAULTS.blog.posts;
    const first = findPost(DEFAULTS.blog, posts[0].slug)!;
    expect(first.position).toBe('01 / 04');
    expect(first.prev?.slug).toBe(posts[posts.length - 1].slug);
    expect(first.next?.slug).toBe(posts[1].slug);
    expect(findPost(DEFAULTS.blog, 'missing')).toBeNull();
  });

  it('has no neighbours when there is a single post', () => {
    const one = { ...DEFAULTS.blog, posts: [DEFAULTS.blog.posts[0]] };
    const v = findPost(one, one.posts[0].slug)!;
    expect(v.prev).toBeNull();
    expect(v.next).toBeNull();
  });
});

describe('richSegments', () => {
  it('splits **bold** runs', () => {
    expect(richSegments('a **b** c')).toEqual([
      { text: 'a ', bold: false },
      { text: 'b', bold: true },
      { text: ' c', bold: false },
    ]);
  });

  it('treats markup as plain text', () => {
    expect(richSegments('<img src=x onerror=alert(1)>')).toEqual([
      { text: '<img src=x onerror=alert(1)>', bold: false },
    ]);
    expect(richSegments(undefined)).toEqual([]);
  });
});

describe('seo helpers', () => {
  it('escapes JSON-LD so it cannot close its script tag', () => {
    expect(jsonLd({ name: '</script><script>alert(1)</script>' })).not.toContain('</script>');
  });

  it('turns free-text dates into ISO dates when possible', () => {
    expect(toIsoDate('12 Nov 2025')).toBe('2025-11-12');
    expect(toIsoDate('sometime')).toBeUndefined();
  });
});
