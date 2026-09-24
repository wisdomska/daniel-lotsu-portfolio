'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** The prototype opened the resume at /#resume; keep those links working. */
export function LegacyHashRedirect() {
  const router = useRouter();
  useEffect(() => {
    if (window.location.hash === '#resume') router.replace('/resume', { scroll: false });
  }, [router]);
  return null;
}
