import DashboardShell from '@/components/dashboard/DashboardShell';
import { requireUser } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireUser();

  return <DashboardShell profile={profile}>{children}</DashboardShell>;
}