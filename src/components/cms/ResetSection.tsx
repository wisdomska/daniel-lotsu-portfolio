'use client';

import { DEFAULTS } from '@/content/defaults';
import { Icon } from '@/components/ui/Icon';
import type { SectionId } from '@/lib/validation/content';
import { useCms } from './CmsProvider';
import cms from './cms.module.css';

/** Put one section's draft back to the original seed content, after confirming. */
export function ResetSection({ section, title }: { section: SectionId; title: string }) {
  const { replace, confirm, flash } = useCms();
  return (
    <button
      type="button"
      className={cms.btnGhost}
      onClick={async () => {
        const ok = await confirm({
          title: `Reset “${title}”?`,
          body: 'This section of your draft will go back to its original content. Nothing goes live until you publish, and you can undo this.',
          cta: 'Reset',
        });
        if (!ok) return;
        replace({ [section]: structuredClone(DEFAULTS[section]) });
        flash(`${title} reset`);
      }}
    >
      <Icon name="rotate-ccw" size={14} />
      Reset section
    </button>
  );
}
