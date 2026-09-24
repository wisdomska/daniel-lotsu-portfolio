import type { ReactNode } from 'react';
import styles from './shell.module.css';
import cms from './cms.module.css';

export function ViewHeader({
  title,
  desc,
  actions,
}: {
  title: string;
  desc: string;
  actions?: ReactNode;
}) {
  return (
    <div className={styles.viewHead}>
      <div className={styles.viewTitleWrap}>
        <h1 className={styles.viewTitle}>{title}</h1>
        <p className={cms.muted}>{desc}</p>
      </div>
      {actions && <div className={styles.viewActions}>{actions}</div>}
    </div>
  );
}
