import { cookies } from 'next/headers';

import SiteFooter from '@/components/public/SiteFooter';
import SiteNavbar from '@/components/public/SiteNavbar';
import { getPublicContent } from '@/lib/content';

// Nama cookie sesi — disamakan dengan src/middleware.ts dan src/lib/auth.ts.
const SESSION_COOKIE = 'rg_session';

/**
 * Kerangka halaman publik: navbar + area konten + footer.
 * Dipakai oleh route group (public) dan halaman "/".
 */
export default async function PublicShell({
  children,
}: {
  children: React.ReactNode;
}) {
  let isLoggedIn = false;
  try {
    const jar = await cookies();
    isLoggedIn = Boolean(jar.get(SESSION_COOKIE)?.value);
  } catch {
    // cookies() tidak tersedia di konteks render tertentu; treat sebagai tidak login
  }
  const { site, contact } = await getPublicContent();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar isLoggedIn={isLoggedIn} site={site} />
      <main className="flex-1">{children}</main>
      <SiteFooter site={site} contact={contact} />
    </div>
  );
}