import { LoginForm } from '@/components/cms/LoginForm';
import { ViewSwitch } from '@/components/cms/ViewSwitch';
import { DEFAULT_VIEW } from '@/components/cms/views';
import { getAdmin } from '@/lib/auth/session';
import { getPublishedContent } from '@/lib/content';
import { themeStyle } from '@/lib/theme';

export const dynamic = 'force-dynamic';

/** /cms: the sign-in screen, or the dashboard (opening on the Hero editor) once signed in. */
export default async function CmsHome({ searchParams }: PageProps<'/cms'>) {
  const admin = await getAdmin();
  if (admin) return <ViewSwitch view={DEFAULT_VIEW} />;

  const [content, params] = await Promise.all([getPublishedContent(), searchParams]);
  const next = typeof params.next === 'string' ? params.next : undefined;
  return (
    <div style={themeStyle(content.settings)}>
      <LoginForm brand={content.nav.logo} next={next} />
    </div>
  );
}
