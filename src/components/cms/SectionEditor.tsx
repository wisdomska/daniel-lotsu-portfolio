'use client';

import type { SectionDef } from '@/content/schema';
import { FieldRenderer } from './FieldRenderer';
import { ResetSection } from './ResetSection';
import { VersionHistory } from './VersionHistory';
import { ViewHeader } from './ViewHeader';

/** The generated editor for one SCHEMA section. */
export function SectionEditor({ def }: { def: SectionDef }) {
  return (
    <>
      <ViewHeader
        title={def.title}
        desc={def.desc}
        actions={<ResetSection section={def.id} title={def.title} />}
      />
      <FieldRenderer fields={def.fields} base={[def.id]} />
      <VersionHistory section={def.id} title={def.title} />
    </>
  );
}
