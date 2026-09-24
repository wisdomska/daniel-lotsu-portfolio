'use client';

import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { useRouteDialog } from '@/components/ui/RouteDialog';

/** Closes the resume dialog, or leaves the standalone /resume page for home. */
export function ResumeClose({ label, className }: { label: string; className: string }) {
  const dialog = useRouteDialog();
  if (dialog) {
    return (
      <button type="button" className={className} onClick={dialog.close}>
        <Icon name="x" />
        {label}
      </button>
    );
  }
  return (
    <Link href="/" className={className}>
      <Icon name="x" />
      {label}
    </Link>
  );
}
