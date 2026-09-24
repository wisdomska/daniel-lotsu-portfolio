import { About } from '@/components/site/About';
import { Blog } from '@/components/site/Blog';
import { Career } from '@/components/site/Career';
import { Contact } from '@/components/site/Contact';
import { Credentials } from '@/components/site/Credentials';
import { Footer } from '@/components/site/Footer';
import { Hero } from '@/components/site/Hero';
import { JsonLd } from '@/components/site/JsonLd';
import { LegacyHashRedirect } from '@/components/site/LegacyHashRedirect';
import { Marquee } from '@/components/site/Marquee';
import { Nav } from '@/components/site/Nav';
import { Projects } from '@/components/site/Projects';
import { Tools } from '@/components/site/Tools';
import { getPublishedContent } from '@/lib/content';
import { personJsonLd } from '@/lib/seo';

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
        <Blog blog={c.blog} />
        <Contact contact={c.contact} />
      </main>
      <Footer footer={c.footer} nav={c.nav} contact={c.contact} />
      <LegacyHashRedirect />
      <JsonLd data={personJsonLd(c)} />
    </>
  );
}
