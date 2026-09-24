'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from 'react';

interface RouteDialogContext {
  close: () => void;
}

const Ctx = createContext<RouteDialogContext | null>(null);

/** Inside an intercepted-route dialog this closes it; elsewhere it is null. */
export function useRouteDialog() {
  return useContext(Ctx);
}

interface RouteDialogProps {
  className?: string;
  labelledBy: string;
  /** Close when the dimmed area outside the content is clicked. */
  closeOnBackdrop?: boolean;
  children: ReactNode;
}

/**
 * A modal <dialog> for an intercepted route (a blog post or the resume opened
 * from the home page). The native dialog gives focus trapping, Escape and an
 * inert page behind it; closing goes back in history so the URL, the back
 * button and the dialog always agree.
 */
export function RouteDialog({
  className,
  labelledBy,
  closeOnBackdrop,
  children,
}: RouteDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const closing = useRef(false);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    router.back();
  }, [router]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!dialog.open) dialog.showModal();
    closing.current = false;
    return () => {
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  return (
    <Ctx.Provider value={{ close }}>
      <dialog
        ref={ref}
        className={className}
        aria-labelledby={labelledBy}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={closeOnBackdrop ? (e) => e.target === e.currentTarget && close() : undefined}
      >
        {children}
      </dialog>
    </Ctx.Provider>
  );
}
