import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  // Preview deployments (the develop site) must never be indexed.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    // /api/og stays crawlable so social previews can fetch the share card.
    rules: { userAgent: '*', allow: ['/', '/api/og'], disallow: ['/cms', '/api/'] },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
