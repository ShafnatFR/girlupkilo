import { notFound, redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { getReimbursementForUser } from '@/lib/reimbursements';
import ApprovalDetailForm from '@/components/approvals/ApprovalDetailForm';

export default async function ApprovalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await requireUser();

  if (!['manager', 'finance', 'admin'].includes(profile.role)) {
    redirect('/dashboard');
  }

  const item = await getReimbursementForUser(id, profile);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <ApprovalDetailForm reimbursement={item} />
    </div>
  );
}
