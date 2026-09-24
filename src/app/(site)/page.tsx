import { About } from '@/components/site/About';
import { Career } from '@/components/site/Career';
import { Credentials } from '@/components/site/Credentials';
import { Hero } from '@/components/site/Hero';
import { Marquee } from '@/components/site/Marquee';
import { Nav } from '@/components/site/Nav';
import { Projects } from '@/components/site/Projects';
import { Tools } from '@/components/site/Tools';
import { getPublishedContent } from '@/lib/content';

export default async function HomePage() {
  const c = await getPublishedContent();
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
      </main>
    </>
  );
}
