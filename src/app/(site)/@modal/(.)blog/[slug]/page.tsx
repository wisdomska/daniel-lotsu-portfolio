import { notFound } from 'next/navigation';
import { PostReader } from '@/components/site/PostReader';
import readerStyles from '@/components/site/PostReader.module.css';
import { RouteDialog } from '@/components/ui/RouteDialog';
import { getPublishedContent } from '@/lib/content';
import { findPost } from '@/lib/posts';

export async function generateStaticParams() {
  const c = await getPublishedContent();
  return c.blog.posts.map((p) => ({ slug: p.slug }));
}

/** A post opened from the home page: the same reader, over the page, in a dialog. */
export default async function PostModal({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const c = await getPublishedContent();
  const view = findPost(c.blog, slug);
  if (!view) notFound();
  const { posts: _posts, ...blog } = c.blog;
  return (
    <RouteDialog className={readerStyles.dialog} labelledBy="post-title">
      <PostReader view={view} blog={blog} mode="modal" titleId="post-title" />
    </RouteDialog>
  );
}
