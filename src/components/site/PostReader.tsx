'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useRouteDialog } from '@/components/ui/RouteDialog';
import { SiteImage } from '@/components/ui/SiteImage';
import button from '@/components/ui/Button.module.css';
import { postHref, type PostView } from '@/lib/posts';
import type { Block, Content } from '@/lib/validation/content';
import styles from './PostReader.module.css';

interface PostReaderProps {
  view: PostView;
  blog: Omit<Content['blog'], 'posts'>;
  /** 'page' for /blog/[slug] opened directly, 'modal' when intercepted over the home page. */
  mode: 'page' | 'modal';
  titleId: string;
}

function CodeBlock({ block }: { block: Block }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(t);
  }, [copied]);
  return (
    <figure className={styles.code}>
      <div className={styles.codeBar}>
        <figcaption className={styles.codeLang}>{block.lang || 'code'}</figcaption>
        <button
          type="button"
          className={styles.copy}
          onClick={() => {
            void navigator.clipboard?.writeText(block.text);
            setCopied(true);
          }}
        >
          <Icon name="copy" size={14} />
          <span aria-live="polite">{copied ? 'Copied ✓' : 'Copy'}</span>
        </button>
      </div>
      <pre className={styles.pre}>
        <code>{block.text}</code>
      </pre>
    </figure>
  );
}

function Avatar({ blog, size }: { blog: PostReaderProps['blog']; size: 'sm' | 'lg' }) {
  return (
    <span className={`${styles.avatar} ${size === 'lg' ? styles.avatarLg : ''}`} aria-hidden="true">
      {blog.authorPhoto ? (
        <SiteImage src={blog.authorPhoto} alt="" fill sizes="56px" className={styles.avatarImg} />
      ) : (
        blog.authorInitials
      )}
    </span>
  );
}

/**
 * The full-screen article reader: sticky bar with reading progress, header,
 * cover, paragraph and code blocks, author card and prev/next.
 */
export function PostReader({ view, blog, mode, titleId }: PostReaderProps) {
  const { post, position, prev, next } = view;
  const dialog = useRouteDialog();
  const rootRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const Title = mode === 'page' ? 'h1' : 'h2';
  const lead = post.blocks.findIndex((b) => b.type !== 'code');

  // Reading progress follows the dialog's own scroll in modal mode and the
  // window on the standalone page. Prev/next start the new post at the top.
  useEffect(() => {
    const scroller = rootRef.current?.closest('dialog') ?? null;
    const read = () => {
      const top = scroller ? scroller.scrollTop : window.scrollY;
      const max = scroller
        ? scroller.scrollHeight - scroller.clientHeight
        : document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (top / max) * 100) : 0);
    };
    if (scroller) scroller.scrollTop = 0;
    read();
    const target: HTMLElement | Window = scroller ?? window;
    target.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      target.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, [post.slug]);

  // Within the dialog, prev/next replace the entry so Back still closes it.
  // The standalone page uses plain links so they load as full pages rather
  // than being intercepted into a dialog over the current article.
  const neighbour = (n: { slug: string; title: string }, dir: 'prev' | 'next') => {
    const inner = (
      <>
        <span className={styles.navLabel}>
          {dir === 'prev' && <Icon name="arrow-left" size={14} />}
          {dir === 'prev' ? blog.prevLabel : blog.nextLabel}
          {dir === 'next' && <Icon name="arrow-right" size={14} />}
        </span>
        <span className={styles.navTitle}>{n.title}</span>
      </>
    );
    const cls = `${styles.navCard} ${dir === 'next' ? styles.navNext : ''}`;
    return mode === 'modal' ? (
      <Link href={postHref(n.slug)} replace scroll={false} className={cls} rel={dir}>
        {inner}
      </Link>
    ) : (
      <a href={postHref(n.slug)} className={cls} rel={dir}>
        {inner}
      </a>
    );
  };

  return (
    <div ref={rootRef} className={styles.reader}>
      <div className={styles.bar}>
        <div className={styles.barInner}>
          {dialog ? (
            <button
              type="button"
              className={`${button.outline} ${styles.back}`}
              onClick={dialog.close}
            >
              <Icon name="arrow-left" />
              {blog.backLabel}
            </button>
          ) : (
            <Link href="/#blog" className={`${button.outline} ${styles.back}`}>
              <Icon name="arrow-left" />
              {blog.backLabel}
            </Link>
          )}
          <span className={styles.barTitle} aria-hidden="true">
            {post.title}
          </span>
          <span className={styles.pos}>{position}</span>
        </div>
        <div
          className={styles.track}
          role="progressbar"
          aria-label="Reading progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div className={styles.fill} style={{ width: `${progress.toFixed(1)}%` }} />
        </div>
      </div>

      <article className={styles.article}>
        <header className={styles.header}>
          <div className={styles.meta}>
            <span className={styles.category}>{post.category}</span>
            <span>{post.date}</span>
            <span className={styles.bullet} aria-hidden="true">
              •
            </span>
            <span>{post.readTime} read</span>
          </div>
          <Title id={titleId} className={styles.title}>
            {post.fullTitle}
          </Title>
          <div className={styles.byline}>
            <Avatar blog={blog} size="sm" />
            <span className={styles.bylineText}>
              <span className={styles.authorName}>{blog.authorName}</span>
              <span className={styles.authorRole}>{blog.authorRole}</span>
            </span>
          </div>
        </header>

        {post.image && (
          <div className={styles.cover}>
            <div className={styles.coverFrame}>
              <SiteImage
                src={post.image}
                alt={post.imageAlt}
                fill
                priority={mode === 'page'}
                sizes="(max-width: 1180px) 100vw, 1100px"
                className={styles.coverImg}
              />
            </div>
          </div>
        )}

        <div className={styles.body}>
          {post.blocks.map((b, k) =>
            b.type === 'code' ? (
              <CodeBlock key={k} block={b} />
            ) : (
              <p key={k} className={k === lead ? styles.lead : styles.para}>
                {b.text}
              </p>
            ),
          )}
        </div>

        <footer className={styles.footer}>
          <div className={styles.author}>
            <Avatar blog={blog} size="lg" />
            <span className={styles.authorCard}>
              <span className={styles.writtenBy}>{blog.writtenByLabel}</span>
              <span className={styles.authorBig}>{blog.authorName}</span>
            </span>
            {/* Navigating to "/" also closes the dialog (see @modal/page.tsx). */}
            <Link href="/#contact" className={`${button.primary} ${styles.cta}`}>
              <Icon name="mail" />
              {blog.ctaLabel}
            </Link>
          </div>
        </footer>

        {prev && next && (
          <nav className={styles.pager} aria-label="More posts">
            {neighbour(prev, 'prev')}
            {neighbour(next, 'next')}
          </nav>
        )}
        <div className={styles.spacer} />
      </article>
    </div>
  );
}
