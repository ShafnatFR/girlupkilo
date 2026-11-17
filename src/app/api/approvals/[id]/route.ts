import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// PATCH /api/approvals/[id] - Setujui atau tolak reimbursement
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Cek role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['manager', 'finance', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { action, rejection_reason } = body;

  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  // Ambil reimbursement
  const { data: reimbursement } = await supabase
    .from('reimbursements')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!reimbursement) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Tentukan status berikutnya berdasarkan action dan role
  let updates: any = {};

  if (action === 'reject') {
    if (!rejection_reason) {
      return NextResponse.json(
        { error: 'Rejection reason required' },
        { status: 400 }
      );
    }
    updates = {
      status: 'rejected',
      rejection_reason,
    };
  } else {
    // approve
    if (profile.role === 'manager' && reimbursement.status === 'submitted') {
      updates = {
        status: 'manager_approved',
        manager_approver: user.id,
        manager_approved_at: new Date().toISOString(),
      };
    } else if (
      profile.role === 'finance' &&
      reimbursement.status === 'manager_approved'
    ) {
      updates = {
        status: 'finance_approved',
        finance_approver: user.id,
        finance_approved_at: new Date().toISOString(),
      };
    } else if (profile.role === 'admin') {
      // Admin bisa approve di tahap manapun
      if (reimbursement.status === 'submitted') {
        updates = {
          status: 'manager_approved',
          manager_approver: user.id,
          manager_approved_at: new Date().toISOString(),
        };
      } else if (reimbursement.status === 'manager_approved') {
        updates = {
          status: 'finance_approved',
          finance_approver: user.id,
          finance_approved_at: new Date().toISOString(),
        };
      } else if (reimbursement.status === 'finance_approved') {
        updates = {
          status: 'paid',
          paid_at: new Date().toISOString(),
          paid_by: user.id,
        };
      }
    } else if (
      profile.role === 'finance' &&
      reimbursement.status === 'finance_approved'
    ) {
      updates = {
        status: 'paid',
        paid_at: new Date().toISOString(),
        paid_by: user.id,
      };
    }
  }

  if (!updates || Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'Cannot approve at this stage' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('reimbursements')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}