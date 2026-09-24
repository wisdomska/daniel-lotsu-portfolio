'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Content } from '@/lib/validation/content';

export interface CmsState {
  draft: Content;
  published: Content;
  unread: number;
  setUnread: (n: number) => void;
}

const Ctx = createContext<CmsState | null>(null);

export function useCms(): CmsState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCms must be used inside <CmsProvider>');
  return v;
}

interface CmsProviderProps {
  initialDraft: Content;
  initialPublished: Content;
  initialUnread: number;
  children: ReactNode;
}

/** Editor state shared by every CMS screen; lives in the dashboard layout so it survives navigation. */
export function CmsProvider({
  initialDraft,
  initialPublished,
  initialUnread,
  children,
}: CmsProviderProps) {
  const [draft] = useState(initialDraft);
  const [published] = useState(initialPublished);
  const [unread, setUnread] = useState(initialUnread);
  const value = useMemo(
    () => ({ draft, published, unread, setUnread }),
    [draft, published, unread],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
