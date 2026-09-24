'use client';

import { useState } from 'react';
import type { Field, ListField } from '@/content/schema';
import { Icon } from '@/components/ui/Icon';
import {
  getIn,
  insertItem,
  moveItem,
  pathId,
  removeItem,
  uniqueSlug,
  type Path,
} from '@/lib/paths';
import { useCms } from './CmsProvider';
import { FieldRenderer } from './FieldRenderer';
import styles from './fields.module.css';

/** h2 for a section's own lists, h3 for lists nested inside list items. */
function ListHeading({ path, children }: { path: Path; children: string }) {
  return path.length > 2 ? (
    <h3 className={styles.listTitle}>{children}</h3>
  ) : (
    <h2 className={styles.listTitle}>{children}</h2>
  );
}

const plural = (n: number) => `${n} ${n === 1 ? 'item' : 'items'}`;
const singular = (label: string) => label.replace(/s$/, '').replace(/ie$/, 'y').toLowerCase();

type Item = Record<string, unknown>;

/** A repeatable list of objects: collapsible items with move, duplicate and delete. */
export function ListEditor({ field, path }: { field: ListField; path: Path }) {
  const { draft, update, confirm, issues } = useCms();
  const items = (getIn(draft, path) as Item[] | undefined) ?? [];
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const listKey = pathId(path);

  const set = (next: Item[]) => update(path, next, { immediate: true });

  /** A new post needs a slug no other post uses. */
  const fresh = (template: Item): Item => {
    const item = structuredClone(template);
    if (typeof item.slug === 'string') {
      item.slug = uniqueSlug(
        item.slug,
        items.map((i) => String(i.slug ?? '')),
      );
    }
    return item;
  };

  const titleOf = (item: Item) => String(item?.[field.itemTitle] ?? '').trim() || 'Untitled';
  const hasIssue = (i: number) => {
    const prefix = `${listKey}.${i}.`;
    return Object.keys(issues).some((k) => k.startsWith(prefix));
  };

  return (
    <div className={styles.fields}>
      <div className={styles.listHead}>
        <ListHeading path={path}>{field.label}</ListHeading>
        <span className={styles.count}>{plural(items.length)}</span>
      </div>
      {items.map((item, i) => {
        const key = `${listKey}.${i}`;
        const isOpen = Boolean(open[key]);
        const title = titleOf(item);
        return (
          <div key={key} className={styles.fields}>
            <div className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
              <button
                type="button"
                className={styles.itemToggle}
                aria-expanded={isOpen}
                onClick={() => setOpen((o) => ({ ...o, [key]: !o[key] }))}
              >
                <span className={styles.chev}>
                  <Icon name="chevron-right" size={16} />
                </span>
                <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.itemTitle}>{title}</span>
                {hasIssue(i) && <span className={styles.error}>Needs attention</span>}
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label={`Move “${title}” up`}
                disabled={i === 0}
                onClick={() => set(moveItem(items, i, i - 1))}
              >
                <Icon name="chevron-up" size={15} />
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label={`Move “${title}” down`}
                disabled={i === items.length - 1}
                onClick={() => set(moveItem(items, i, i + 1))}
              >
                <Icon name="chevron-down" size={15} />
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label={`Duplicate “${title}”`}
                onClick={() => set(insertItem(items, i + 1, fresh(item)))}
              >
                <Icon name="copy-plus" size={15} />
              </button>
              <button
                type="button"
                className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                aria-label={`Delete “${title}”`}
                onClick={async () => {
                  const ok = await confirm({
                    title: 'Delete this item?',
                    body: `“${title}” will be removed from your draft. You can undo this.`,
                    cta: 'Delete',
                  });
                  if (ok) set(removeItem(items, i));
                }}
              >
                <Icon name="trash-2" size={15} />
              </button>
            </div>
            {isOpen && (
              <div className={styles.nested}>
                <FieldRenderer fields={field.of} base={[...path, i]} />
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        className={styles.add}
        onClick={() => {
          set([...items, fresh(field.newItem)]);
          setOpen((o) => ({ ...o, [`${listKey}.${items.length}`]: true }));
        }}
      >
        <Icon name="plus" size={15} />
        Add {singular(field.label)}
      </button>
    </div>
  );
}

/** A plain list of strings (skill tags, marquee words, bullet points). */
export function StringsEditor({ field, path }: { field: Field; path: Path }) {
  const { draft, update, issues } = useCms();
  const items = (getIn(draft, path) as string[] | undefined) ?? [];
  const listKey = pathId(path);

  return (
    <div className={styles.fields}>
      <div className={styles.listHead}>
        <ListHeading path={path}>{field.label}</ListHeading>
        <span className={styles.count}>{plural(items.length)}</span>
      </div>
      {items.map((s, i) => {
        const error = issues[`${listKey}.${i}`];
        return (
          <div key={`${listKey}.${i}`} className={styles.stringRow}>
            <input
              type="text"
              className={styles.stringInput}
              value={s}
              aria-label={`${field.label} ${i + 1}`}
              aria-invalid={Boolean(error)}
              onChange={(e) => update([...path, i], e.target.value)}
            />
            <button
              type="button"
              className={styles.iconBtn}
              aria-label={`Move item ${i + 1} up`}
              disabled={i === 0}
              onClick={() => update(path, moveItem(items, i, i - 1), { immediate: true })}
            >
              <Icon name="chevron-up" size={15} />
            </button>
            <button
              type="button"
              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
              aria-label={`Remove item ${i + 1}`}
              onClick={() => update(path, removeItem(items, i), { immediate: true })}
            >
              <Icon name="x" size={15} />
            </button>
          </div>
        );
      })}
      <button
        type="button"
        className={styles.add}
        onClick={() => update(path, [...items, ''], { immediate: true })}
      >
        <Icon name="plus" size={15} />
        Add item
      </button>
    </div>
  );
}
