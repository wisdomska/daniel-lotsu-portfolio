import 'server-only';
import { DEFAULTS } from '@/content/defaults';
import type { Content } from '@/lib/validation/content';

/** Published content for the public site. */
export async function getPublishedContent(): Promise<Content> {
  return DEFAULTS;
}
