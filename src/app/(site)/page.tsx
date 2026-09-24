import { Hero } from '@/components/site/Hero';
import { Nav } from '@/components/site/Nav';
import { Projects } from '@/components/site/Projects';
import { getPublishedContent } from '@/lib/content';

export default async function HomePage() {
  const c = await getPublishedContent();
  return (
    <>
      <Nav nav={c.nav} />
      <main id="main">
        <Hero hero={c.hero} />
        <Projects projects={c.projects} layout={c.settings.projectLayout} />
      </main>
    </>
  );
}
