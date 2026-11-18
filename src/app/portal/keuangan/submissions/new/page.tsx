import NewSubmissionForm from '@/components/submissions/NewSubmissionForm';
import { requireUser } from '@/lib/auth';

export default async function NewSubmissionPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Buat Pengajuan Baru</h1>
        <p className="mt-1 text-sm text-slate-500">
          Isi detail reimbursement yang ingin diajukan
        </p>
      </div>

      <NewSubmissionForm />
    </div>
  );
}
