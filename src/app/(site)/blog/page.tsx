import { Blog } from '@/components/site/Blog';
import { Footer } from '@/components/site/Footer';
import { Nav } from '@/components/site/Nav';
import { getPublishedContent } from '@/lib/content';
import styles from './blog.module.css';

export default async function BlogIndexPage() {
  const c = await getPublishedContent();
  return (
    <>
      <Nav nav={c.nav} base="/" />
      <main id="main" className={styles.main}>
        <Blog blog={c.blog} headingLevel="h1" />
      </main>
      <Footer footer={c.footer} nav={c.nav} contact={c.contact} base="/" />
    </>
  );
}
