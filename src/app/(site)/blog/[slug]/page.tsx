import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/site/JsonLd';
import { PostReader } from '@/components/site/PostReader';
import { getPublishedContent } from '@/lib/content';
import { findPost, postHref } from '@/lib/posts';
import { blogPostingJsonLd, toIsoDate } from '@/lib/seo';

export async function generateStaticParams() {
  const c = await getPublishedContent();
  return c.blog.posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const c = await getPublishedContent();
  const view = findPost(c.blog, slug);
  if (!view) return {};
  const { post } = view;
  const images = [
    post.image
      ? { url: post.image, alt: post.imageAlt || post.title }
      : { url: '/api/og', width: 1200, height: 630, alt: c.site.title },
  ];
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: postHref(post.slug) },
    openGraph: {
      type: 'article',
      siteName: c.resume.name,
      title: post.fullTitle || post.title,
      description: post.excerpt,
      url: postHref(post.slug),
      publishedTime: toIsoDate(post.date),
      authors: [c.blog.authorName],
      section: post.category,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.fullTitle || post.title,
      description: post.excerpt,
      images: images.map((i) => i.url),
    },
  };
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
      <JsonLd data={blogPostingJsonLd(c, view.post)} />
    </main>
  );
}
