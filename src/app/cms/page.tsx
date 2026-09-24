import { LoginForm } from '@/components/cms/LoginForm';
import { getAdmin } from '@/lib/auth/session';
import { getPublishedContent } from '@/lib/content';
import { themeStyle } from '@/lib/theme';
import { logoutAction } from '@/server/actions/auth';

export const dynamic = 'force-dynamic';

export default async function CmsPage({ searchParams }: PageProps<'/cms'>) {
  const [admin, content, params] = await Promise.all([
    getAdmin(),
    getPublishedContent(),
    searchParams,
  ]);
  const next = typeof params.next === 'string' ? params.next : undefined;

  if (!admin) {
    return (
      <div style={themeStyle(content.settings)}>
        <LoginForm brand={content.nav.logo} next={next} />
      </div>
    );
  }

  return (
    <main style={{ padding: 40 }}>
      <p>Signed in as {admin.email}.</p>
      <form action={logoutAction}>
        <button type="submit">Sign out</button>
      </form>
    </main>
  );
}
