import 'server-only';

import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';
import { CMS_ROLES } from '@/lib/cms/admin';

/**
 * Penjaga halaman CMS. Mengalihkan tamu ke /login dan pengguna tanpa
 * hak kelola konten kembali ke dashboard.
 */
export async function requireCmsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (!CMS_ROLES.includes(user.role)) redirect('/dashboard');
  return user;
}