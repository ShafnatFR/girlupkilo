-- ============================================================
-- Login / registrasi dengan Google (OAuth 2.0)
-- Jalankan sekali pada database yang sudah ada:
--   psql -d girlupkilo -f db/migrations/2026-11-18-google-oauth.sql
-- (instalasi baru cukup menjalankan db/schema.sql yang sudah memuat kolom ini)
-- ============================================================

-- ID unik akun Google ("sub"). NULL untuk user yang hanya pakai password.
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS google_sub TEXT;

-- Foto profil dari Google (opsional, hanya dipakai untuk ditampilkan).
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- User yang mendaftar lewat Google tidak punya password lokal.
ALTER TABLE public.users ALTER COLUMN password_hash DROP NOT NULL;

-- Satu akun Google hanya boleh terhubung ke satu user.
CREATE UNIQUE INDEX IF NOT EXISTS users_google_sub_idx ON public.users (google_sub);

-- Pastikan role aplikasi tetap boleh menulis kolom baru (tidak perlu grant ulang
-- karena grant-nya level tabel, bukan kolom).
