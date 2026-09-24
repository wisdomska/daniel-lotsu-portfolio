'use client';

import type { AssetField } from '@/content/schema';
import { Icon } from '@/components/ui/Icon';
import { getIn, pathId, type Path } from '@/lib/paths';
import { useCms } from './CmsProvider';
import styles from './fields.module.css';

/** Image or file field: a link to the asset, with a thumbnail and remove button. */
export function ImageField({ field, path }: { field: AssetField; path: Path }) {
  const { draft, update, issues } = useCms();
  const value = String(getIn(draft, path) ?? '');
  const error = issues[pathId(path)];
  const isFile = field.type === 'file';
  const contain = field.fit === 'contain';

  return (
    <div className={styles.label}>
      <span>{field.label}</span>
      <div className={styles.asset}>
        <span className={`${styles.thumb} ${isFile ? styles.thumbFile : ''}`} aria-hidden="true">
          {value && !isFile ? (
            // A CMS thumbnail of arbitrary external/Blob URLs; next/image adds nothing here.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className={`${styles.thumbImg} ${contain ? styles.thumbContain : ''}`}
            />
          ) : (
            <Icon name={isFile ? 'file-text' : 'upload'} size={18} />
          )}
        </span>
        <div className={styles.assetBody}>
          <input
            type="url"
            className={styles.assetUrl}
            value={value}
            placeholder={isFile ? 'Paste a link to the file' : 'Paste an image link'}
            aria-label={`${field.label} link`}
            aria-invalid={Boolean(error)}
            onChange={(e) => update(path, e.target.value.trim())}
          />
          <div className={styles.assetActions}>
            {value && (
              <button
                type="button"
                className={styles.remove}
                onClick={() => update(path, '', { immediate: true })}
              >
                <Icon name="trash-2" size={14} />
                Remove
              </button>
            )}
            {isFile && (
              <span className={styles.note}>{value ? 'File linked ✓' : 'No file yet'}</span>
            )}
          </div>
        </div>
      </div>
      {field.help && <span className={styles.help}>{field.help}</span>}
      {error && (
        <span className={styles.error} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
