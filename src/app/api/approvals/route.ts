import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth';
import { listApprovals } from '@/lib/reimbursements';
import { isApprover } from '@/lib/validation';

/** GET /api/approvals — pengajuan yang relevan untuk approver. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!isApprover(user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  return NextResponse.json(await listApprovals(user.role));
}
