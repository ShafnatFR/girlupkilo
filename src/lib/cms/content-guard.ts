import 'server-only';

import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';
import { CONTENT_ROLES } from '@/lib/cms/admin';

/**
 * Penjaga halaman modul konten (acara, galeri, artikel, e-magazine).
 * Mengalihkan tamu ke /login dan pengguna tanpa hak kelola konten
 * (hanya finance yang tidak termasuk CONTENT_ROLES) kembali ke dashboard.
 */
export async function requireContentPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!CONTENT_ROLES.includes(user.role)) redirect('/portal');
  return user;
}