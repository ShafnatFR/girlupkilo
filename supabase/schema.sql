-- ============================================================
-- Reimburse — Skema Database Supabase (PostgreSQL)
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- ---------- Tabel: profiles ----------
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'staff'
              CHECK (role IN ('staff', 'manager', 'finance', 'admin')),
  department  TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- Tabel: reimbursements ----------
CREATE TABLE IF NOT EXISTS public.reimbursements (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title          TEXT NOT NULL,
  category       TEXT NOT NULL DEFAULT 'lainnya',
  amount         NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency       TEXT NOT NULL DEFAULT 'IDR',
  expense_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  description    TEXT,
  receipt_url    TEXT,
  status         TEXT NOT NULL DEFAULT 'draft'
                 CHECK (status IN ('draft','submitted','manager_approved',
                                   'finance_approved','rejected','paid')),
  rejection_reason TEXT,
  -- jejak persetujuan
  manager_approver  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  manager_approved_at TIMESTAMPTZ,
  finance_approver  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  finance_approved_at TIMESTAMPTZ,
  paid_at           TIMESTAMPTZ,
  paid_by           UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reimb_user    ON public.reimbursements(user_id);
CREATE INDEX IF NOT EXISTS idx_reimb_status  ON public.reimbursements(status);
CREATE INDEX IF NOT EXISTS idx_reimb_created ON public.reimbursements(created_at DESC);

-- ---------- Trigger: auto-update updated_at ----------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated ON public.profiles;
CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_reimb_updated ON public.reimbursements;
CREATE TRIGGER trg_reimb_updated
  BEFORE UPDATE ON public.reimbursements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------- Trigger: buat profile otomatis saat user daftar ----------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------- Helper: cek role ----------
CREATE OR REPLACE FUNCTION public.current_role()
RETURNS TEXT LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.can_approve()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT COALESCE(public.current_role() IN ('manager','finance','admin'), false);
$$;

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reimbursements  ENABLE ROW LEVEL SECURITY;

-- ---- profiles ----
DROP POLICY IF EXISTS "profiles_select_self_or_staff" ON public.profiles;
CREATE POLICY "profiles_select_self_or_staff" ON public.profiles
  FOR SELECT USING (
    id = auth.uid()
    OR public.current_role() IN ('manager','finance','admin')
  );

DROP POLICY IF EXISTS "profiles_update_self" ON public.profiles;
CREATE POLICY "profiles_update_self" ON public.profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_insert_self" ON public.profiles;
CREATE POLICY "profiles_insert_self" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- ---- reimbursements ----
DROP POLICY IF EXISTS "reimb_select" ON public.reimbursements;
CREATE POLICY "reimb_select" ON public.reimbursements
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.current_role() IN ('manager','finance','admin')
  );

DROP POLICY IF EXISTS "reimb_insert_own" ON public.reimbursements;
CREATE POLICY "reimb_insert_own" ON public.reimbursements
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "reimb_update_own_draft" ON public.reimbursements;
CREATE POLICY "reimb_update_own_draft" ON public.reimbursements
  FOR UPDATE USING (
    (user_id = auth.uid() AND status = 'draft')
    OR public.current_role() IN ('manager','finance','admin')
  );

DROP POLICY IF EXISTS "reimb_delete_own_draft" ON public.reimbursements;
CREATE POLICY "reimb_delete_own_draft" ON public.reimbursements
  FOR DELETE USING (
    user_id = auth.uid() AND status = 'draft'
  );

-- ============================================================
-- Seed data opsional (jalankan setelah membuat user via Auth)
-- ============================================================
-- UPDATE public.profiles SET role = 'admin'
-- WHERE email = 'admin@perusahaan.com';