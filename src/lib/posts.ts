import type { Content, Post } from '@/lib/validation/content';

export interface PostNeighbour {
  slug: string;
  title: string;
}

export interface PostView {
  post: Post;
  index: number;
  total: number;
  /** "02 / 04", shown in the reader's top bar. */
  position: string;
  prev: PostNeighbour | null;
  next: PostNeighbour | null;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Locate a post by slug and work out its neighbours. Prev/next wrap around,
 * as in the prototype, and are omitted when there is only one post.
 */
export function findPost(blog: Content['blog'], slug: string): PostView | null {
  const posts = blog.posts;
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  const total = posts.length;
  const at = (i: number) => {
    const p = posts[(i + total) % total];
    return { slug: p.slug, title: p.title };
  };
  return {
    post: posts[index],
    index,
    total,
    position: `${pad(index + 1)} / ${pad(total)}`,
    prev: total > 1 ? at(index - 1) : null,
    next: total > 1 ? at(index + 1) : null,
  };
}

export const postHref = (slug: string) => `/blog/${slug}`;
