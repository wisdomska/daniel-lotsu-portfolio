'use client';

import { upload } from '@vercel/blob/client';
import { useState, type ChangeEvent } from 'react';
import type { AssetField } from '@/content/schema';
import { Icon } from '@/components/ui/Icon';
import { getIn, pathId, slugify, type Path } from '@/lib/paths';
import { checkUpload, EXTENSIONS, isUploadType } from '@/lib/upload-rules';
import { registerUploadAction } from '@/server/actions/uploads';
import { useCms } from './CmsProvider';
import styles from './fields.module.css';

/**
 * Image or file field: upload to Vercel Blob or paste a link. Replaced files
 * are not deleted immediately — the published site and saved versions may
 * still use them — they are cleaned up once nothing refers to them.
 */
export function ImageField({ field, path }: { field: AssetField; path: Path }) {
  const { draft, update, issues, flash } = useCms();
  const [progress, setProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');
  const value = String(getIn(draft, path) ?? '');
  const error = issues[pathId(path)] ?? uploadError;
  const isFile = field.type === 'file';
  const kind = isFile ? 'file' : 'image';
  const contain = field.fit === 'contain';
  const busy = progress !== null;

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadError('');
    const problem = checkUpload(file, kind);
    if (problem || !isUploadType(file.type)) {
      setUploadError(problem ?? 'That file type is not allowed.');
      return;
    }
    const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'upload';
    const pathname = `uploads/${String(path[0])}/${base}.${EXTENSIONS[file.type]}`;
    try {
      setProgress(0);
      const blob = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/cms/upload',
        contentType: file.type,
        onUploadProgress: (p) => setProgress(Math.round(p.percentage)),
      });
      const checked = await registerUploadAction(blob.url, kind);
      if (!checked.ok) {
        setUploadError(checked.error);
        return;
      }
      update(path, checked.url, { immediate: true });
      flash(isFile ? 'File uploaded' : 'Image uploaded');
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setProgress(null);
    }
  };

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
            placeholder={
              isFile ? 'Paste a link to the file, or upload' : 'Paste an image link, or upload'
            }
            aria-label={`${field.label} link`}
            aria-invalid={Boolean(error)}
            onChange={(e) => update(path, e.target.value.trim())}
          />
          <div className={styles.assetActions}>
            <label className={styles.upload} aria-disabled={busy}>
              <Icon name="upload" size={14} />
              {busy ? `Uploading… ${progress}%` : 'Upload'}
              <input
                type="file"
                className="visually-hidden"
                accept={
                  isFile
                    ? (field.accept ?? 'application/pdf')
                    : 'image/png,image/jpeg,image/webp,image/svg+xml,image/avif'
                }
                onChange={onFile}
                disabled={busy}
              />
            </label>
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
            <span className={styles.note}>
              {isFile
                ? value
                  ? 'File linked ✓'
                  : 'No file yet · PDF up to 5 MB'
                : 'PNG, JPG, WebP, SVG or AVIF · up to 5 MB'}
            </span>
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
