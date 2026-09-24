'use client';

import { getSectionDef } from '@/content/schema';
import { SectionEditor } from './SectionEditor';
import { ThemePicker } from './ThemePicker';
import { ViewHeader } from './ViewHeader';
import { viewMeta, type ViewId } from './views';

/** Renders the editor for one CMS view. */
export function ViewSwitch({ view }: { view: ViewId }) {
  const def = getSectionDef(view);
  if (def) return <SectionEditor key={def.id} def={def} />;
  if (view === 'theme') return <ThemePicker />;
  const meta = viewMeta(view);
  return <ViewHeader title={meta.title} desc={meta.desc} />;
}
