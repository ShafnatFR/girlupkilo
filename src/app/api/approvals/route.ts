import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/approvals - Ambil pengajuan yang perlu disetujui
export async function GET() {
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

  const { data, error } = await supabase
    .from('reimbursements')
    .select(
      '*, profile:profiles!reimbursements_user_id_fkey(full_name, email, department)'
    )
    .neq('status', 'draft')
    .neq('status', 'rejected')
    .neq('status', 'paid')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}