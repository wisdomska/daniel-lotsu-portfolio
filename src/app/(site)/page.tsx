import { HomeView } from '@/components/site/HomeView';
import { JsonLd } from '@/components/site/JsonLd';
import { LegacyHashRedirect } from '@/components/site/LegacyHashRedirect';
import { getPublishedContent } from '@/lib/content';
import { personJsonLd } from '@/lib/seo';

export default async function HomePage() {
  const c = await getPublishedContent();
  return (
    <>
      <HomeView c={c} />
      <LegacyHashRedirect />
      <JsonLd data={personJsonLd(c)} />
    </>
  );
}
