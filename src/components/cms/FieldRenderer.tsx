'use client';

import { useId } from 'react';
import type { Field } from '@/content/schema';
import { getIn, pathId, type Path } from '@/lib/paths';
import { useCms } from './CmsProvider';
import { ImageField } from './ImageField';
import { ListEditor, StringsEditor } from './ListEditor';
import styles from './fields.module.css';

interface FieldRendererProps {
  fields: Field[];
  /** Path of the object these fields belong to, e.g. ['hero'] or ['blog', 'posts', 2]. */
  base: Path;
}

/** Generates the editor for a set of SCHEMA fields, recursing into lists. */
export function FieldRenderer({ fields, base }: FieldRendererProps) {
  return (
    <div className={styles.fields}>
      {fields.map((f) => (
        <FieldControl key={f.key} field={f} path={[...base, f.key]} />
      ))}
    </div>
  );
}

function FieldMessages({ id, help, error }: { id: string; help?: string; error?: string }) {
  return (
    <>
      {help && (
        <span id={`${id}-help`} className={styles.help}>
          {help}
        </span>
      )}
      {error && (
        <span id={`${id}-err`} className={styles.error} role="alert">
          {error}
        </span>
      )}
    </>
  );
}

function FieldControl({ field, path }: { field: Field; path: Path }) {
  const { draft, update, issues } = useCms();
  const uid = useId();
  const value = getIn(draft, path);
  const error = issues[pathId(path)];
  const describedBy =
    [field.help ? `${uid}-help` : '', error ? `${uid}-err` : ''].filter(Boolean).join(' ') ||
    undefined;

  switch (field.type) {
    case 'list':
      return <ListEditor field={field} path={path} />;
    case 'strings':
      return <StringsEditor field={field} path={path} />;
    case 'image':
    case 'file':
      return <ImageField field={field} path={path} />;
    case 'bool': {
      const on = value === true;
      return (
        <button
          type="button"
          role="switch"
          aria-checked={on}
          className={styles.switch}
          onClick={() => update(path, !on, { immediate: true })}
        >
          <span>{field.label}</span>
          <span className={styles.track} aria-hidden="true">
            <span className={styles.knob} />
          </span>
        </button>
      );
    }
    case 'select':
      return (
        <label className={styles.label}>
          {field.label}
          <select
            className={styles.select}
            value={String(value ?? '')}
            onChange={(e) => update(path, e.target.value, { immediate: true })}
            aria-describedby={describedBy}
          >
            {field.options.map((o) => (
              <option key={o.v} value={o.v}>
                {o.l}
              </option>
            ))}
          </select>
          <FieldMessages id={uid} help={field.help} error={error} />
        </label>
      );
    case 'textarea':
    case 'rich':
    case 'code': {
      const isCode = field.type === 'code';
      return (
        <label className={styles.label}>
          <span className={styles.labelRow}>
            <span>{field.label}</span>
            {field.type === 'rich' && <span className={styles.hint}>**bold**</span>}
          </span>
          <textarea
            className={`${styles.textarea} ${isCode ? styles.code : ''}`}
            rows={isCode || field.type === 'rich' ? 6 : 4}
            value={String(value ?? '')}
            onChange={(e) => update(path, e.target.value)}
            spellCheck={!isCode}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
          <FieldMessages id={uid} help={field.help} error={error} />
        </label>
      );
    }
    default: {
      const type = field.type === 'url' ? 'url' : field.type === 'email' ? 'email' : 'text';
      return (
        <label className={styles.label}>
          {field.label}
          <input
            type={type}
            className={styles.control}
            value={String(value ?? '')}
            placeholder={field.type === 'url' ? 'https://' : undefined}
            onChange={(e) => update(path, e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
          />
          <FieldMessages id={uid} help={field.help} error={error} />
        </label>
      );
    }
  }
}
