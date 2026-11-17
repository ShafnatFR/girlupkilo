import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import { getProfile } from '@/lib/supabase/server-helpers';
import type { Profile } from '@/lib/types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = (await getProfile()) as Profile | null;

  if (!profile) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar profile={profile} />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}