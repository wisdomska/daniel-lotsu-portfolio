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
import { SECTION_IDS, type Content, type SectionId } from '@/lib/validation/content';
import { publishAction, saveDraftAction } from '@/server/actions/content';
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
  /** Sections whose draft differs from what is live. */
  unpublished: SectionId[];
  update: (path: Path, value: unknown, opts?: UpdateOptions) => void;
  /** Replace whole sections (restore, reset, import) as one undoable change. */
  replace: (sections: Partial<Content>) => void;
  /** Wait for any pending autosave. Resolves false if something could not be saved. */
  flush: () => Promise<boolean>;
  publish: () => Promise<void>;
  publishing: boolean;
  undo: () => void;
  canUndo: boolean;
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
/** Keystrokes closer together than this are undone as one change. */
const UNDO_BURST_MS = 800;
const UNDO_LIMIT = 50;

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Editor state shared by every CMS screen. It lives in the dashboard layout,
 * so it survives moving between sections. Edits apply locally at once, are
 * autosaved to the draft after a short pause, and go live only on Publish.
 * Undo history is kept for this browser session.
 */
export function CmsProvider({
  initialDraft,
  initialPublished,
  initialUnread,
  children,
}: CmsProviderProps) {
  const [draft, setDraftState] = useState(initialDraft);
  const [published, setPublished] = useState(initialPublished);
  const [status, setStatus] = useState<SaveStatus>('saved');
  const [issues, setIssues] = useState<Record<string, string>>({});
  const [unread, setUnread] = useState(initialUnread);
  const [toast, setToast] = useState('');
  const [confirmReq, setConfirmReq] = useState<ConfirmRequest | null>(null);
  const history = useRef<Content[]>([]);
  const [historyLen, setHistoryLen] = useState(0);
  const [publishing, setPublishing] = useState(false);

  const draftRef = useRef(draft);
  const dirty = useRef(new Set<SectionId>());
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const chain = useRef<Promise<boolean>>(Promise.resolve(true));
  const confirmResolve = useRef<((ok: boolean) => void) | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastEdit = useRef(0);

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

  const schedule = useCallback(
    (ids: SectionId[], immediate?: boolean) => {
      for (const id of ids) dirty.current.add(id);
      setStatus('saving');
      clearTimeout(timer.current);
      timer.current = setTimeout(() => void flush(), immediate ? 0 : SAVE_DELAY_MS);
    },
    [flush],
  );

  /** Remember the state before a change, folding rapid typing into one undo step. */
  const remember = useCallback((force: boolean) => {
    const now = Date.now();
    const burst = !force && now - lastEdit.current < UNDO_BURST_MS;
    lastEdit.current = force ? 0 : now;
    if (burst) return;
    history.current = [...history.current.slice(-(UNDO_LIMIT - 1)), draftRef.current];
    setHistoryLen(history.current.length);
  }, []);

  const update = useCallback(
    (path: Path, value: unknown, opts?: UpdateOptions) => {
      remember(Boolean(opts?.immediate));
      setDraft(setIn(draftRef.current, path, value));
      schedule([path[0] as SectionId], opts?.immediate);
    },
    [remember, schedule, setDraft],
  );

  const replace = useCallback(
    (sections: Partial<Content>) => {
      remember(true);
      setDraft({ ...draftRef.current, ...sections });
      schedule(Object.keys(sections) as SectionId[], true);
    },
    [remember, schedule, setDraft],
  );

  const undo = useCallback(() => {
    const prev = history.current.at(-1);
    if (!prev) return;
    history.current = history.current.slice(0, -1);
    setHistoryLen(history.current.length);
    const changed = SECTION_IDS.filter((id) => !same(prev[id], draftRef.current[id]));
    setDraft(prev);
    lastEdit.current = 0;
    schedule(changed, true);
  }, [schedule, setDraft]);

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

  const unpublished = useMemo(
    () => SECTION_IDS.filter((id) => !same(draft[id], published[id])),
    [draft, published],
  );

  const publish = useCallback(async () => {
    setPublishing(true);
    try {
      if (!(await flush())) {
        flash('Fix the highlighted fields before publishing');
        return;
      }
      const ids = SECTION_IDS.filter((id) => !same(draftRef.current[id], published[id]));
      if (ids.length === 0) {
        flash('Everything is already live');
        return;
      }
      const res = await publishAction(ids);
      if (!res.ok) {
        flash(res.error ?? 'Publishing failed');
        return;
      }
      setPublished((p) => ({ ...p, ...res.data.published }));
      // Adopt the server-normalised copy (e.g. trimmed text) so draft and live match.
      setDraft({ ...draftRef.current, ...res.data.published });
      const n = Object.keys(res.data.published).length;
      flash(
        res.data.issues.length
          ? `Published ${n}; some sections need fixing first`
          : `Published — your site is updating now`,
      );
    } catch {
      flash('Publishing failed. Check your connection and try again.');
    } finally {
      setPublishing(false);
    }
  }, [flush, flash, published, setDraft]);

  // Ctrl/Cmd+Z undoes CMS changes when you're not typing in a field
  // (inside a field the browser's own text undo applies).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(
        (document.activeElement as HTMLElement | null)?.tagName ?? '',
      );
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !typing) {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo]);

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
      unpublished,
      update,
      replace,
      flush,
      publish,
      publishing,
      undo,
      canUndo: historyLen > 0,
      flash,
      confirm,
      unread,
      setUnread,
    }),
    [
      draft,
      published,
      status,
      issues,
      unpublished,
      update,
      replace,
      flush,
      publish,
      publishing,
      undo,
      historyLen,
      flash,
      confirm,
      unread,
    ],
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
