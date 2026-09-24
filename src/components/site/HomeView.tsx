import type { Content } from '@/lib/validation/content';
import { About } from './About';
import { Blog } from './Blog';
import { Career } from './Career';
import { Contact } from './Contact';
import { Credentials } from './Credentials';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Marquee } from './Marquee';
import { Nav } from './Nav';
import { Projects } from './Projects';
import { Tools } from './Tools';

/**
 * The single-page portfolio for a given content document. Rendered on the
 * server for the live site, and in the browser by the CMS preview (from the
 * draft), so the preview is exactly what will be published.
 */
export function HomeView({ c }: { c: Content }) {
  return (
    <>
      <Nav nav={c.nav} />
      <main id="main">
        <Hero hero={c.hero} />
        <Projects projects={c.projects} layout={c.settings.projectLayout} />
        <About about={c.about} />
        {c.settings.showMarquee && <Marquee items={c.marquee.items} />}
        <Tools stack={c.stack} />
        <Career career={c.career} />
        <Credentials credentials={c.credentials} />
        <Blog blog={c.blog} />
        <Contact contact={c.contact} />
      </main>
      <Footer footer={c.footer} nav={c.nav} contact={c.contact} />
    </>
  );
}
