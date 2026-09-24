'use client';

import type { SectionDef } from '@/content/schema';
import { FieldRenderer } from './FieldRenderer';
import { ViewHeader } from './ViewHeader';

/** The generated editor for one SCHEMA section. */
export function SectionEditor({ def }: { def: SectionDef }) {
  return (
    <>
      <ViewHeader title={def.title} desc={def.desc} />
      <FieldRenderer fields={def.fields} base={[def.id]} />
    </>
  );
}
