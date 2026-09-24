import { notFound } from 'next/navigation';
import { PostReader } from '@/components/site/PostReader';
import { getPublishedContent } from '@/lib/content';
import { findPost } from '@/lib/posts';

export async function generateStaticParams() {
  const c = await getPublishedContent();
  return c.blog.posts.map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const c = await getPublishedContent();
  const view = findPost(c.blog, slug);
  if (!view) notFound();
  const { posts: _posts, ...blog } = c.blog;
  return (
    <main id="main">
      <PostReader view={view} blog={blog} mode="page" titleId="post-title" />
    </main>
  );
}
