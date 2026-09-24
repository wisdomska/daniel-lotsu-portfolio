'use client';

import { ViewHeader } from './ViewHeader';
import { viewMeta, type ViewId } from './views';

/** Renders the editor for one CMS view. */
export function ViewSwitch({ view }: { view: ViewId }) {
  const meta = viewMeta(view);
  return <ViewHeader title={meta.title} desc={meta.desc} />;
}
