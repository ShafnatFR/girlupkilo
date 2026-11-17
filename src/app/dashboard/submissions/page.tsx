import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/supabase/server-helpers';
import type { Profile, Reimbursement } from '@/lib/types';
import { formatCurrency, formatDate, STATUS_STYLES } from '@/lib/utils';
import { STATUS_LABELS } from '@/lib/types';
import { Plus, FileText, Filter } from 'lucide-react';
import Link from 'next/link';

export default async function SubmissionsPage() {
  const profile = (await getProfile()) as Profile | null;
  if (!profile) redirect('/login');

  const supabase = await createClient();

  const { data: reimbursements } = await supabase
    .from('reimbursements')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false });

  const all = (reimbursements || []) as Reimbursement[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Pengajuan Saya
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {all.length} pengajuan reimbursement
          </p>
        </div>
        <Link href="/dashboard/submissions/new" className="btn-primary">
          <Plus size={18} />
          Buat Baru
        </Link>
      </div>

      {/* List */}
      {all.length === 0 ? (
        <div className="card px-6 py-12 text-center">
          <FileText className="mx-auto mb-3 h-12 w-12 text-slate-300" />
          <p className="text-sm text-slate-500">
            Belum ada pengajuan reimbursement
          </p>
          <Link href="/dashboard/submissions/new" className="btn-primary mt-4">
            Buat Pengajuan Pertama
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Judul
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {all.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/submissions/${item.id}`}
                        className="font-medium text-slate-900 hover:text-brand-600"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {item.category.replace('_', ' ')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {formatDate(item.expense_date)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-slate-900">
                      {formatCurrency(Number(item.amount))}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`badge ${STATUS_STYLES[item.status]}`}
                      >
                        {STATUS_LABELS[item.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <Link
                        href={`/dashboard/submissions/${item.id}`}
                        className="text-brand-600 hover:text-brand-700"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}