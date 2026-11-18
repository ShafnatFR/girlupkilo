-- ============================================================
-- Modul konten publik tambahan: Acara, Dokumentasi/Galeri,
-- Artikel, dan E-Magazine.
--
-- Jalankan sebagai PEMILIK skema (role yang membuat tabel), bukan
-- sebagai role aplikasi girlupkilo_app yang hanya punya DML:
--   psql -h 43.128.89.51 -U postgres -d girlupkilo -f db/content.sql
--
-- Idempoten (CREATE TABLE IF NOT EXISTS). Seed di bagian bawah
-- hanya berjalan bila tabel masih kosong, jadi tidak menimpa
-- hasil edit dari admin. Membuat set_updated_at() bila belum ada
-- agar file ini dapat berdiri sendiri.
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- Acara (events)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  event_date      DATE,
  location        TEXT NOT NULL DEFAULT '',
  category        TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT NOT NULL DEFAULT '',
  sort_order      INTEGER NOT NULL DEFAULT 0,
  published       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by      UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS cms_events_sort_idx
  ON public.cms_events (sort_order, created_at);

-- ------------------------------------------------------------
-- Dokumentasi / Galeri
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_gallery (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  caption    TEXT NOT NULL DEFAULT '',
  image_url  TEXT NOT NULL DEFAULT '',
  event_id   UUID REFERENCES public.cms_events(id) ON DELETE SET NULL,
  category   TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  published  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS cms_gallery_sort_idx
  ON public.cms_gallery (sort_order, created_at);

-- ------------------------------------------------------------
-- Artikel
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_articles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  excerpt         TEXT NOT NULL DEFAULT '',
  content         TEXT NOT NULL DEFAULT '',
  author          TEXT NOT NULL DEFAULT '',
  category        TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT NOT NULL DEFAULT '',
  sort_order      INTEGER NOT NULL DEFAULT 0,
  published       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by      UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS cms_articles_sort_idx
  ON public.cms_articles (sort_order, created_at);

-- ------------------------------------------------------------
-- E-Magazine
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_emagazines (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            TEXT NOT NULL UNIQUE,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  issue           TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT NOT NULL DEFAULT '',
  file_url        TEXT NOT NULL DEFAULT '',
  sort_order      INTEGER NOT NULL DEFAULT 0,
  published       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by      UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS cms_emagazines_sort_idx
  ON public.cms_emagazines (sort_order, created_at);

-- ------------------------------------------------------------
-- updated_at otomatis
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_cms_events_updated ON public.cms_events;
CREATE TRIGGER trg_cms_events_updated
  BEFORE UPDATE ON public.cms_events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_gallery_updated ON public.cms_gallery;
CREATE TRIGGER trg_cms_gallery_updated
  BEFORE UPDATE ON public.cms_gallery
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_articles_updated ON public.cms_articles;
CREATE TRIGGER trg_cms_articles_updated
  BEFORE UPDATE ON public.cms_articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_emagazines_updated ON public.cms_emagazines;
CREATE TRIGGER trg_cms_emagazines_updated
  BEFORE UPDATE ON public.cms_emagazines
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Seed awal — hanya mengisi bila tabel masih kosong.
-- ============================================================

-- events
INSERT INTO public.cms_events (slug, title, description, event_date, location, category, sort_order)
SELECT * FROM (VALUES
  ('women-s-talk-2026', 'Women''s Talk on Current Issues', 'Seri percakapan kritis tentang isu perempuan bersama pembicara dari berbagai latar belakang.', DATE '2026-03-14', 'Universitas Indonesia, Depok', 'Diskusi', 1),
  ('16-haktp-2026', '16 Days of Activism', 'Kampanye solidaritas melawan kekerasan berbasis gender sepanjang 16 hari.', DATE '2026-11-25', 'Daring & Kampus', 'Kampanye', 2),
  ('international-womens-day-2026', 'International Women''s Day', 'Perayaan Hari Perempuan Internasional melalui panel diskusi dan kampanye digital.', DATE '2026-03-08', 'Universitas Indonesia, Depok', 'Kampanye', 3)
) AS seed(slug, title, description, event_date, location, category, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.cms_events);

-- gallery
INSERT INTO public.cms_gallery (title, caption, category, sort_order)
SELECT * FROM (VALUES
  ('Diskusi Womantic', 'Suasana diskusi Women''s Talk bersama peserta dan pembicara.', 'Diskusi', 1),
  ('Kampanye 16 HAKtP', 'Aksi kampanye menolak kekerasan berbasis gender.', 'Kampanye', 2),
  ('Kunjungan Day Out', 'Kunjungan institusional memperluas wawasan kepemimpinan.', 'Edukasi', 3)
) AS seed(title, caption, category, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.cms_gallery);

-- articles
INSERT INTO public.cms_articles (slug, title, excerpt, content, author, category, sort_order)
SELECT * FROM (VALUES
  ('memahami-kesetaraan-gender', 'Memahami Kesetaraan Gender', 'Tulisan pengantar tentang makna kesetaraan gender dan mengapa ia penting bagi semua.',
   'Kesetaraan gender berarti hak, kesempatan, dan perlakuan yang setara bagi semua gender. Tulisan ini mengajak pembaca memahami konsep dasar dan relevansinya dalam kehidupan sehari-hari.',
   'Tim Research and Advocacy', 'Artikel', 1),
  ('ruang-aman-bagi-perempuan', 'Menciptakan Ruang Aman bagi Perempuan', 'Bagaimana komunitas dapat membangun ruang yang aman dan inklusif.',
   'Ruang aman adalah tempat di mana setiap orang dapat berbagi pengalaman tanpa takut dihakimi. Artikel ini membahas langkah-langkah membangun komunitas yang inklusif.',
   'Tim Research and Advocacy', 'Artikel', 2)
) AS seed(slug, title, excerpt, content, author, category, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.cms_articles);

-- emagazines
INSERT INTO public.cms_emagazines (slug, title, description, issue, sort_order)
SELECT * FROM (VALUES
  ('e-magazine-edisi-1', 'E-Magazine Edisi 1', 'Terbitan perdana yang memuat esai, kajian, dan karya tulis anggota tentang isu gender dan hak perempuan.', 'Edisi 1', 1),
  ('e-magazine-edisi-2', 'E-Magazine Edisi 2', 'Terbitan kedua dengan tema ruang aman dan kepemimpinan perempuan muda.', 'Edisi 2', 2)
) AS seed(slug, title, description, issue, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.cms_emagazines);

-- ============================================================
-- Grant akses untuk role aplikasi.
-- ============================================================
DO $do$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'girlupkilo_app') THEN
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO girlupkilo_app';
    EXECUTE 'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO girlupkilo_app';
  END IF;
END
$do$;