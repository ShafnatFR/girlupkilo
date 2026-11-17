import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/reimbursements - Ambil semua reimbursement user
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('reimbursements')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/reimbursements - Buat reimbursement baru
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    category,
    amount,
    expense_date,
    description,
    receipt_url,
  } = body;

  if (!title || !category || !amount || !expense_date) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('reimbursements')
    .insert({
      user_id: user.id,
      title,
      category,
      amount: parseFloat(amount),
      expense_date,
      description: description || null,
      receipt_url: receipt_url || null,
      status: 'submitted',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}