'use client';

import { useState, type CSSProperties } from 'react';
import { accentContrast, HEX_RE, resolveTheme, THEMES } from '@/content/themes';
import { Icon } from '@/components/ui/Icon';
import { useCms } from './CmsProvider';
import { ResetSection } from './ResetSection';
import { VersionHistory } from './VersionHistory';
import { ViewHeader } from './ViewHeader';
import { EXTRA_VIEWS } from './views';
import fields from './fields.module.css';
import styles from './theme.module.css';

/** Accent presets, a custom colour with a contrast check, and layout/effect toggles. */
export function ThemePicker() {
  const { draft, update, flash } = useCms();
  const s = draft.settings;
  const current = resolveTheme(s);
  const [hex, setHex] = useState(s.customColor);
  const hexOk = HEX_RE.test(hex);
  const check = hexOk ? accentContrast(hex) : null;

  const pick = (key: (typeof THEMES)[number]['key'], name: string) => {
    update(['settings', 'theme'], key, { immediate: true });
    flash(`${name} applied`);
  };

  const applyCustom = () => {
    if (!hexOk) return;
    update(
      ['settings'],
      { ...s, theme: 'custom', customColor: hex.toUpperCase() },
      { immediate: true },
    );
    flash('Custom colour applied');
  };

  const toggle = (key: 'showMarquee' | 'showStars', label: string) => {
    const on = s[key];
    return (
      <button
        type="button"
        role="switch"
        aria-checked={on}
        className={fields.switch}
        onClick={() => update(['settings', key], !on, { immediate: true })}
      >
        <span>{label}</span>
        <span className={fields.track} aria-hidden="true">
          <span className={fields.knob} />
        </span>
      </button>
    );
  };

  const swatches = [
    ...THEMES.map((t) => ({ ...t, active: s.theme === t.key })),
    ...(current.key === 'custom' ? [{ ...current, key: 'custom' as const, active: true }] : []),
  ];

  return (
    <>
      <ViewHeader
        title={EXTRA_VIEWS.theme.title}
        desc={EXTRA_VIEWS.theme.desc}
        actions={<ResetSection section="settings" title="Theme & layout" />}
      />
      <div className={styles.grid} role="group" aria-label="Accent colour">
        {swatches.map((t) => (
          <button
            key={t.key}
            type="button"
            className={styles.card}
            aria-pressed={t.active}
            style={{ '--swatch': t.color } as CSSProperties}
            onClick={() => t.key !== 'custom' && pick(t.key, t.name)}
          >
            <span className={styles.cardTop}>
              <span className={styles.dot} aria-hidden="true" />
              {t.active && <span className={styles.active}>Active</span>}
            </span>
            <span className={styles.names}>
              <span className={styles.name}>{t.name}</span>
              <span className={styles.hex}>{t.color}</span>
            </span>
            <span className={styles.samples} aria-hidden="true">
              <span className={styles.sampleFill}>Button</span>
              <span className={styles.sampleLine}>Button</span>
            </span>
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        <h2 className={styles.panelTitle}>Custom colour</h2>
        <p className={styles.panelText}>
          Pick any colour. Bright, saturated colours work best on the dark background.
        </p>
        <div className={styles.customRow}>
          <input
            type="color"
            className={styles.picker}
            value={hexOk ? hex : current.color}
            onChange={(e) => setHex(e.target.value.toUpperCase())}
            aria-label="Pick a colour"
          />
          <input
            type="text"
            className={styles.hexInput}
            value={hex}
            placeholder="#00FFAA"
            aria-label="Hex colour"
            aria-invalid={hex !== '' && !hexOk}
            onChange={(e) => {
              let v = e.target.value.trim();
              if (v && !v.startsWith('#')) v = `#${v}`;
              setHex(v.toUpperCase());
            }}
          />
          <button type="button" className={styles.apply} disabled={!hexOk} onClick={applyCustom}>
            Use custom colour
          </button>
        </div>
        {check && (
          <p
            className={check.passesAA ? styles.contrastOk : styles.contrastWarn}
            role={check.passesAA ? undefined : 'alert'}
          >
            {check.passesAA ? (
              <>Contrast {check.ratio.toFixed(1)}:1 on the dark background — readable (WCAG AA).</>
            ) : (
              <>
                <Icon name="triangle-alert" size={14} /> Contrast is only {check.ratio.toFixed(1)}:1
                against the background. Links and buttons in this colour will be hard to read — aim
                for 4.5:1 or more by choosing a lighter, brighter colour.
              </>
            )}
          </p>
        )}
      </div>

      <div className={styles.stack}>
        <h2 className={styles.panelTitle}>Layout &amp; effects</h2>
        <div className={styles.row}>
          <span id="layout-label">Projects layout</span>
          <span className={styles.segmented} role="group" aria-labelledby="layout-label">
            {(['grid', 'list'] as const).map((l) => (
              <button
                key={l}
                type="button"
                className={styles.seg}
                aria-pressed={s.projectLayout === l}
                onClick={() => update(['settings', 'projectLayout'], l, { immediate: true })}
              >
                {l === 'grid' ? 'Grid' : 'List'}
              </button>
            ))}
          </span>
        </div>
        {toggle('showMarquee', 'Show scrolling tech strip')}
        {toggle('showStars', 'Show starlight background')}
      </div>

      <VersionHistory section="settings" title="Theme & layout" />
    </>
  );
}
