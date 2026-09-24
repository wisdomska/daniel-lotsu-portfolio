import { CmsProvider } from '@/components/cms/CmsProvider';
import { CmsShell } from '@/components/cms/CmsShell';
import { getAdmin } from '@/lib/auth/session';
import { getDraftContent, getPublishedContent } from '@/lib/content';
import { countUnread } from '@/lib/inbox';
import { themeStyle } from '@/lib/theme';

export const dynamic = 'force-dynamic';

/**
 * Signed out, this renders the sign-in page as-is. Signed in, it wraps every
 * CMS screen in the editor state and chrome, which persist across navigation.
 */
export default async function DashboardLayout({ children }: LayoutProps<'/cms'>) {
  const admin = await getAdmin();
  if (!admin) return children;

  const [draft, published, unread] = await Promise.all([
    getDraftContent(),
    getPublishedContent(),
    countUnread(),
  ]);
  return (
    <div style={themeStyle(draft.settings)}>
      <CmsProvider initialDraft={draft} initialPublished={published} initialUnread={unread}>
        <CmsShell>{children}</CmsShell>
      </CmsProvider>
    </div>
  );
}
