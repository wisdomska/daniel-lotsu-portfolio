import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';
const isPreviewDeploy = process.env.VERCEL_ENV === 'preview';

const IMAGE_HOSTS = [
  'https://images.unsplash.com',
  'https://cdn.jsdelivr.net',
  'https://*.public.blob.vercel-storage.com',
];
// Direct-from-browser uploads to Vercel Blob.
const BLOB_API = ['https://vercel.com/api/blob', 'https://*.blob.vercel-storage.com'];
// Vercel's comment toolbar, only on preview deployments.
const VERCEL_LIVE = isPreviewDeploy ? ['https://vercel.live', 'wss://ws-us3.pusher.com'] : [];

/*
 * Pages are statically prerendered, so per-request nonces are not available;
 * Next's inline bootstrap scripts therefore need 'unsafe-inline'. Everything
 * else is locked to this origin and the known image/upload hosts.
 */
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} ${VERCEL_LIVE.join(' ')}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: ${IMAGE_HOSTS.join(' ')} ${VERCEL_LIVE.join(' ')}`,
  `font-src 'self' data:`,
  `connect-src 'self' ${BLOB_API.join(' ')} ${VERCEL_LIVE.join(' ')}${isDev ? ' ws:' : ''}`,
  `media-src 'self' ${IMAGE_HOSTS.join(' ')}`,
  // The CMS previews the site in a same-origin iframe; nobody else may frame it.
  `frame-src 'self' ${VERCEL_LIVE.join(' ')}`,
  `frame-ancestors 'self'`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  ...(isDev ? [] : ['upgrade-insecure-requests']),
]
  .map((d) => d.replace(/\s+/g, ' ').trim())
  .join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/cms/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      { source: '/cms', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
};

export default nextConfig;
