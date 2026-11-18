-- ============================================================
-- Reimburse — Skema database (PostgreSQL, tanpa Supabase)
-- Jalankan sekali:  psql -d girlupkilo -f db/schema.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS public.users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name     TEXT NOT NULL DEFAULT '',
  role          TEXT NOT NULL DEFAULT 'staff'
                CHECK (role IN ('staff', 'manager', 'finance', 'admin')),
  department    TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS users_email_idx ON public.users (lower(email));

CREATE TABLE IF NOT EXISTS public.sessions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_user_idx    ON public.sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_idx ON public.sessions (expires_at);

CREATE TABLE IF NOT EXISTS public.reimbursements (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  category            TEXT NOT NULL DEFAULT 'lainnya',
  amount              NUMERIC(14,2) NOT NULL CHECK (amount > 0),
  currency            TEXT NOT NULL DEFAULT 'IDR',
  expense_date        DATE NOT NULL DEFAULT CURRENT_DATE,
  description         TEXT,
  receipt_url         TEXT,
  status              TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft','submitted','manager_approved',
                                        'finance_approved','rejected','paid')),
  rejection_reason    TEXT,
  manager_approver    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  manager_approved_at TIMESTAMPTZ,
  finance_approver    UUID REFERENCES public.users(id) ON DELETE SET NULL,
  finance_approved_at TIMESTAMPTZ,
  paid_at             TIMESTAMPTZ,
  paid_by             UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS reimb_user_idx    ON public.reimbursements (user_id);
CREATE INDEX IF NOT EXISTS reimb_status_idx  ON public.reimbursements (status);
CREATE INDEX IF NOT EXISTS reimb_created_idx ON public.reimbursements (created_at DESC);

-- updated_at otomatis
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_users_updated ON public.users;
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_reimb_updated ON public.reimbursements;
CREATE TRIGGER trg_reimb_updated BEFORE UPDATE ON public.reimbursements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ------------------------------------------------------------
-- Role database untuk aplikasi (least privilege, bukan superuser)
-- Jalankan sebagai superuser, ganti password-nya:
--   CREATE ROLE girlupkilo_app LOGIN PASSWORD 'ganti-password-ini';
--   GRANT CONNECT ON DATABASE girlupkilo TO girlupkilo_app;
--   GRANT USAGE ON SCHEMA public TO girlupkilo_app;
--   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO girlupkilo_app;
--   GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO girlupkilo_app;
-- ------------------------------------------------------------

-- ------------------------------------------------------------
-- Membuat admin pertama (password di-hash aplikasi, jangan tulis plaintext):
--   npm run create-admin -- admin@perusahaan.com 'SandiRahasia123' "Nama Admin"
-- ------------------------------------------------------------
