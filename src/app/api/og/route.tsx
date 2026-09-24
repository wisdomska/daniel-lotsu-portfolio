import { ImageResponse } from 'next/og';
import { resolveTheme } from '@/content/themes';
import { getPublishedContent } from '@/lib/content';

/** Generated 1200×630 social card, used when no share image is uploaded. */
export async function GET() {
  const c = await getPublishedContent();
  const accent = resolveTheme(c.settings).color;
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: '#111111',
        color: '#f2f1ee',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, color: accent }}>
        {c.nav.logo}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -5, lineHeight: 0.95 }}>
          {c.hero.firstName}
        </div>
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            letterSpacing: -5,
            lineHeight: 1,
            color: '#6c6a65',
          }}
        >
          {c.hero.lastName}
        </div>
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 32, color: '#a8a6a0' }}
      >
        <div style={{ width: 18, height: 18, borderRadius: 9, background: accent }} />
        {c.resume.role}
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
    },
  );
}
