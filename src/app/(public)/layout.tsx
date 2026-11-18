// Layout untuk route group (public) — halaman guest seperti /visi-misi dan
// /departemen. Halaman "/" memakai komponen yang sama secara langsung karena
// route group tidak dapat memiliki halaman pada path root.
import PublicShell from '@/components/public/PublicShell';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicShell>{children}</PublicShell>;
}