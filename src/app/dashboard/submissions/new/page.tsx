import { redirect } from 'next/navigation';
import NewSubmissionForm from '@/components/submissions/NewSubmissionForm';
import { getProfile } from '@/lib/supabase/server-helpers';
import type { Profile } from '@/lib/types';

export default async function NewSubmissionPage() {
  const profile = (await getProfile()) as Profile | null;
  if (!profile) redirect('/login');

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Buat Pengajuan Baru
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Isi detail reimbursement yang ingin diajukan
        </p>
      </div>

      <NewSubmissionForm />
    </div>
  );
}