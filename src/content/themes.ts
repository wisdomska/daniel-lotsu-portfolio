/** Accent presets, ported from design-source/portfolio-cms.js (THEMES). */
export const THEMES = [
  { key: 'lime', name: 'Volt Lime', color: '#A3E900', hover: '#8FCC00' },
  { key: 'cyan', name: 'Cyber Cyan', color: '#00E5FF', hover: '#00C4DB' },
  { key: 'magenta', name: 'Hot Magenta', color: '#FF2FD1', hover: '#E011B3' },
  { key: 'orange', name: 'Blaze Orange', color: '#FF7A1A', hover: '#E86400' },
  { key: 'violet', name: 'Ultra Violet', color: '#B57BFF', hover: '#9D57FF' },
] as const;

export type ThemeKey = (typeof THEMES)[number]['key'];
export const THEME_KEYS = THEMES.map((t) => t.key) as [ThemeKey, ...ThemeKey[]];

export interface ResolvedTheme {
  key: ThemeKey | 'custom';
  name: string;
  color: string;
  hover: string;
}

export const HEX_RE = /^#[0-9a-f]{6}$/i;

/** Page background the accent sits on, and the ink used on accent buttons. */
export const PAGE_BG = '#111111';
export const ON_ACCENT = '#111111';

export function resolveTheme(settings: { theme: string; customColor: string }): ResolvedTheme {
  if (settings.theme === 'custom' && HEX_RE.test(settings.customColor)) {
    const color = settings.customColor.toUpperCase();
    return { key: 'custom', name: 'Custom', color, hover: shade(color, -0.12) };
  }
  return THEMES.find((t) => t.key === settings.theme) ?? THEMES[0];
}

/** Lighten (amt > 0) or darken (amt < 0) a #RRGGBB colour. */
export function shade(hex: string, amt: number): string {
  const [r, g, b] = hexToRgb(hex).map((c) =>
    Math.max(0, Math.min(255, Math.round(c + (amt < 0 ? c * amt : (255 - c) * amt)))),
  );
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.1 contrast ratio between two #RRGGBB colours (1–21). */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * The accent is used both as text on the page background and as a button
 * background behind dark ink, so it has to clear AA (4.5:1) against #111 in
 * both roles (they are the same pair).
 */
export function accentContrast(color: string): { ratio: number; passesAA: boolean } {
  const ratio = contrastRatio(color, PAGE_BG);
  return { ratio, passesAA: ratio >= 4.5 };
}
