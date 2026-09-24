import type { CSSProperties } from 'react';
import { resolveTheme } from '@/content/themes';
import type { Settings } from '@/lib/validation/content';

/** Inline CSS custom properties that apply the CMS accent to a subtree. */
export function themeStyle(settings: Pick<Settings, 'theme' | 'customColor'>): CSSProperties {
  const t = resolveTheme(settings);
  return { '--pri': t.color, '--prih': t.hover } as CSSProperties;
}
