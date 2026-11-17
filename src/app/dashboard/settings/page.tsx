import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/supabase/server-helpers';
import type { Profile } from '@/lib/types';
import SettingsForm from '@/components/settings/SettingsForm';

export default async function SettingsPage() {
  const profile = (await getProfile()) as Profile | null;
  if (!profile) redirect('/login');

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Kelola profil dan akun Anda
        </p>
      </div>
      <SettingsForm profile={profile} />
    </div>
  );
}