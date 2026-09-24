'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ConfirmDialog, type ConfirmRequest } from '@/components/ui/ConfirmDialog';
import { setIn, type Path } from '@/lib/paths';
import type { Content, SectionId } from '@/lib/validation/content';
import { saveDraftAction } from '@/server/actions/content';
import styles from './shell.module.css';

export type SaveStatus = 'saved' | 'saving' | 'error' | 'invalid';

export interface UpdateOptions {
  /** Save right away instead of after the typing pause (toggles, list edits). */
  immediate?: boolean;
}

export interface CmsState {
  draft: Content;
  published: Content;
  status: SaveStatus;
  /** Validation messages keyed by dotted path ("blog.posts.0.slug"). */
  issues: Record<string, string>;
  update: (path: Path, value: unknown, opts?: UpdateOptions) => void;
  /** Wait for any pending autosave. Resolves false if something could not be saved. */
  flush: () => Promise<boolean>;
  flash: (message: string) => void;
  confirm: (req: ConfirmRequest) => Promise<boolean>;
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

const SAVE_DELAY_MS = 450;

/**
 * Editor state shared by every CMS screen. It lives in the dashboard layout,
 * so it survives moving between sections. Edits apply locally at once and are
 * autosaved per section after a short pause.
 */
export function CmsProvider({
  initialDraft,
  initialPublished,
  initialUnread,
  children,
}: CmsProviderProps) {
  const [draft, setDraftState] = useState(initialDraft);
  const [published] = useState(initialPublished);
  const [status, setStatus] = useState<SaveStatus>('saved');
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [unread, setUnread] = useState(initialUnread);
  const [toast, setToast] = useState('');
  const [confirmReq, setConfirmReq] = useState<ConfirmRequest | null>(null);

  const draftRef = useRef(draft);
  const dirty = useRef(new Set<SectionId>());
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const chain = useRef<Promise<boolean>>(Promise.resolve(true));
  const confirmResolve = useRef<((ok: boolean) => void) | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setDraft = useCallback((next: Content) => {
    draftRef.current = next;
    setDraftState(next);
  }, []);

  const runSave = useCallback(async (): Promise<boolean> => {
    const ids = [...dirty.current];
    dirty.current.clear();
    if (ids.length === 0) return true;
    setStatus('saving');
    let invalid = false;
    let failed = false;
    const found: Record<string, string> = {};
    for (const id of ids) {
      try {
        const res = await saveDraftAction(id, draftRef.current[id]);
        if (!res.ok) {
          if (res.issues?.length) {
            invalid = true;
            for (const i of res.issues) found[i.path] ??= i.message;
          } else {
            failed = true;
            dirty.current.add(id);
          }
        }
      } catch {
        failed = true;
        dirty.current.add(id);
      }
    }
    setIssues((prev) => {
      const next = Object.fromEntries(
        Object.entries(prev).filter(([k]) => !ids.some((id) => k === id || k.startsWith(`${id}.`))),
      );
      return { ...next, ...found };
    });
    setStatus(failed ? 'error' : invalid ? 'invalid' : 'saved');
    return !failed && !invalid;
  }, []);

  const flush = useCallback(() => {
    clearTimeout(timer.current);
    chain.current = chain.current.then(runSave, runSave);
    return chain.current;
  }, [runSave]);

  const update = useCallback(
    (path: Path, value: unknown, opts?: UpdateOptions) => {
      const id = path[0] as SectionId;
      setDraft(setIn(draftRef.current, path, value));
      dirty.current.add(id);
      setStatus('saving');
      clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), opts?.immediate ? 0 : SAVE_DELAY_MS);
    },
    [flush, setDraft],
  );

  const flash = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  }, []);

  const confirm = useCallback((req: ConfirmRequest) => {
    setConfirmReq(req);
    return new Promise<boolean>((resolve) => {
      confirmResolve.current = resolve;
    });
  }, []);

  // Warn before leaving with an autosave still in flight.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty.current.size > 0) e.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const value = useMemo<CmsState>(
    () => ({
      draft,
      published,
      status,
      issues,
      update,
      flush,
      flash,
      confirm,
      unread,
      setUnread,
    }),
    [draft, published, status, issues, update, flush, flash, confirm, unread],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <ConfirmDialog
        request={confirmReq}
        onResolve={(ok) => {
          setConfirmReq(null);
          confirmResolve.current?.(ok);
          confirmResolve.current = null;
        }}
      />
      <div className={styles.toastRegion} role="status" aria-live="polite">
        {toast && <div className={styles.toast}>{toast}</div>}
      </div>
    </Ctx.Provider>
  );
}
