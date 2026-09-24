import type { Content, Post } from '@/lib/validation/content';

/** Canonical origin for URLs, sitemaps and structured data. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://daniel-lotsu.vercel.app'
).replace(/\/$/, '');

export const absoluteUrl = (path = '/') => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/** Serialise JSON-LD so it can never close its own <script> tag. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function personJsonLd(c: Content) {
  const sameAs = [c.contact.linkedinUrl, c.contact.githubUrl].filter(
    (u) => u && !/^https?:\/\/(www\.)?github\.com\/?$/.test(u),
  );
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: c.resume.name || `${c.hero.firstName} ${c.hero.lastName}`,
    jobTitle: c.resume.role,
    description: c.site.description,
    url: SITE_URL,
    email: c.contact.email ? `mailto:${c.contact.email}` : undefined,
    image: c.about.avatar || undefined,
    worksFor: { '@type': 'Organization', name: 'AmaliTech' },
    address: { '@type': 'PostalAddress', addressLocality: 'Kumasi', addressCountry: 'GH' },
    sameAs,
  };
}

/** Best-effort ISO date from the CMS's free-text date ("12 Nov 2025"). */
export function toIsoDate(text: string): string | undefined {
  const t = Date.parse(text);
  return Number.isNaN(t) ? undefined : new Date(t).toISOString().slice(0, 10);
}

export function blogPostingJsonLd(c: Content, post: Post) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.fullTitle || post.title,
    description: post.excerpt,
    image: post.image || undefined,
    datePublished: toIsoDate(post.date),
    articleSection: post.category,
    url,
    mainEntityOfPage: url,
    author: { '@type': 'Person', name: c.blog.authorName, url: SITE_URL },
  };
}
