import { SCHEMA, type SectionDef } from '@/content/schema';
import type { IconName } from '@/components/ui/Icon';

/** CMS screens that are not generated from SCHEMA. */
export const EXTRA_VIEWS = {
  theme: {
    title: 'Theme & layout',
    icon: 'palette',
    desc: 'Choose the accent colour used for buttons, links and highlights across the site.',
  },
  inbox: {
    title: 'Inbox',
    icon: 'inbox',
    desc: 'Messages sent through the contact form on your site.',
  },
  settings: { title: 'Settings', icon: 'settings', desc: 'Password, backups and data.' },
} as const satisfies Record<string, { title: string; icon: IconName; desc: string }>;

export type ExtraViewId = keyof typeof EXTRA_VIEWS;
export type ViewId = SectionDef['id'] | ExtraViewId;

export const DEFAULT_VIEW: ViewId = 'hero';

export const VIEW_IDS: ViewId[] = [
  ...SCHEMA.map((s) => s.id),
  ...(Object.keys(EXTRA_VIEWS) as ExtraViewId[]),
];

export const isViewId = (v: string): v is ViewId => (VIEW_IDS as string[]).includes(v);

export const viewHref = (id: ViewId) => (id === DEFAULT_VIEW ? '/cms' : `/cms/${id}`);

export function viewFromPath(pathname: string): ViewId {
  const seg = pathname.split('/')[2] ?? '';
  return isViewId(seg) ? seg : DEFAULT_VIEW;
}

export const NAV_GROUPS: { label: string; items: ViewId[] }[] = [
  { label: 'CONTENT', items: SCHEMA.map((s) => s.id) },
  { label: 'DESIGN', items: ['theme'] },
  { label: 'MANAGE', items: ['inbox', 'settings'] },
];

export function viewMeta(id: ViewId): { title: string; icon: IconName; desc: string } {
  if (id in EXTRA_VIEWS) return EXTRA_VIEWS[id as ExtraViewId];
  const def = SCHEMA.find((s) => s.id === id);
  if (!def) throw new Error(`Unknown CMS view: ${id}`);
  return { title: def.title, icon: def.icon, desc: def.desc };
}
