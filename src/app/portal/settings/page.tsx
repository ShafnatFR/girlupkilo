import { requireUser } from '@/lib/auth';
import SettingsForm from '@/components/settings/SettingsForm';

export default async function SettingsPage() {
  const profile = await requireUser();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Pengaturan</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola profil dan akun Anda</p>
      </div>
      <SettingsForm profile={profile} />
    </div>
  );
}
