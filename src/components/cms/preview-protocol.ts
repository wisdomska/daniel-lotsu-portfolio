import type { Content } from '@/lib/validation/content';

/** Messages the CMS sends to its preview iframe (same origin only). */
export type PreviewMessage =
  { type: 'cms:draft'; content: Content } | { type: 'cms:scroll'; anchor: string };

/** Sent by the preview once it is listening, so the CMS can push the current draft. */
export const PREVIEW_READY = 'cms:preview-ready';

export function isPreviewMessage(data: unknown): data is PreviewMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    (data.type === 'cms:draft' || data.type === 'cms:scroll')
  );
}
