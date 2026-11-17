import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getProfile } from '@/lib/supabase/server-helpers';
import type { Profile, Reimbursement } from '@/lib/types';
import ApprovalDetailForm from '@/components/approvals/ApprovalDetailForm';

export default async function ApprovalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const profile = (await getProfile()) as Profile | null;
  if (!profile) redirect('/login');

  if (!['manager', 'finance', 'admin'].includes(profile.role)) {
    redirect('/dashboard');
  }

  const supabase = await createClient();

  const { data: reimbursement } = await supabase
    .from('reimbursements')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!reimbursement) {
    redirect('/dashboard/approvals');
  }

  return (
    <div className="mx-auto max-w-4xl">
      <ApprovalDetailForm reimbursement={reimbursement as Reimbursement} />
    </div>
  );
}