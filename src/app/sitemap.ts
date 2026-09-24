import type { MetadataRoute } from 'next';
import { getPublishedContent } from '@/lib/content';
import { postHref } from '@/lib/posts';
import { absoluteUrl, toIsoDate } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const c = await getPublishedContent();
  return [
    { url: absoluteUrl('/'), changeFrequency: 'monthly', priority: 1 },
    { url: absoluteUrl('/blog'), changeFrequency: 'weekly', priority: 0.8 },
    { url: absoluteUrl('/resume'), changeFrequency: 'monthly', priority: 0.6 },
    ...c.blog.posts.map((p) => ({
      url: absoluteUrl(postHref(p.slug)),
      lastModified: toIsoDate(p.date),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
