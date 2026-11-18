-- ============================================================
-- CMS — Skema konten untuk halaman publik GirlUp
--
-- Jalankan sebagai PEMILIK skema (role yang membuat tabel), bukan
-- sebagai role aplikasi girlupkilo_app yang hanya punya DML:
--   psql -h 43.128.89.51 -U postgres -d girlupkilo -f db/cms.sql
--
-- Idempoten (CREATE TABLE IF NOT EXISTS). Seed di bagian bawah
-- hanya berjalan bila tabel masih kosong, jadi tidak menimpa
-- hasil edit dari admin.
-- ============================================================

-- ------------------------------------------------------------
-- Pengaturan situs: dokumen JSON per bagian konten.
-- key dipakai sebagai nama bagian, mis. 'identity', 'about',
-- 'vision', 'missions', 'values', 'pillars', 'stats', 'join_steps'.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

COMMENT ON TABLE public.site_settings IS
  'Dokumen konten JSON per bagian halaman publik.';

-- ------------------------------------------------------------
-- Departemen
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_departments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  short_name   TEXT NOT NULL,
  tagline      TEXT NOT NULL DEFAULT '',
  description  TEXT NOT NULL DEFAULT '',
  focus        JSONB NOT NULL DEFAULT '[]'::jsonb,
  icon         TEXT NOT NULL DEFAULT 'sprout',
  head_name    TEXT,
  deputy_name  TEXT,
  member_count INTEGER CHECK (member_count IS NULL OR member_count >= 0),
  sort_order   INTEGER NOT NULL DEFAULT 0,
  published    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by   UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS cms_departments_sort_idx
  ON public.cms_departments (sort_order, created_at);

-- ------------------------------------------------------------
-- Pengurus
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_leaders (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  role       TEXT NOT NULL,
  group_name TEXT NOT NULL DEFAULT 'Departemen'
             CHECK (group_name IN ('Inti', 'Departemen')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  published  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS cms_leaders_sort_idx
  ON public.cms_leaders (sort_order, created_at);

-- ------------------------------------------------------------
-- Program unggulan
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_programs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  icon        TEXT NOT NULL DEFAULT 'sparkles',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  published   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by  UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS cms_programs_sort_idx
  ON public.cms_programs (sort_order, created_at);

-- ------------------------------------------------------------
-- Tonggak waktu
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_milestones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year        TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  published   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by  UUID REFERENCES public.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS cms_milestones_sort_idx
  ON public.cms_milestones (sort_order, created_at);

-- ------------------------------------------------------------
-- updated_at otomatis
-- ------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_cms_departments_updated ON public.cms_departments;
CREATE TRIGGER trg_cms_departments_updated
  BEFORE UPDATE ON public.cms_departments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_leaders_updated ON public.cms_leaders;
CREATE TRIGGER trg_cms_leaders_updated
  BEFORE UPDATE ON public.cms_leaders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_programs_updated ON public.cms_programs;
CREATE TRIGGER trg_cms_programs_updated
  BEFORE UPDATE ON public.cms_programs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_cms_milestones_updated ON public.cms_milestones;
CREATE TRIGGER trg_cms_milestones_updated
  BEFORE UPDATE ON public.cms_milestones
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Seed awal — hanya mengisi bila tabel masih kosong.
-- ============================================================

-- identity
INSERT INTO public.site_settings (key, value)
SELECT 'identity', $json${
  "name": "Girl Up UI",
  "fullName": "Girl Up Universitas Indonesia",
  "shortName": "GUUI",
  "tagline": "When Girls Rise, We All Rise",
  "established": 2019,
  "description": "Gerakan kepemimpinan perempuan muda di Universitas Indonesia yang tumbuh sebagai bagian dari jaringan global Girl Up. Kami mendorong kesetaraan gender, kepemimpinan, dan dampak sosial melalui advokasi, kolaborasi, dan pendidikan.",
  "parent": "Girl Up",
  "region": "Girl Up Southeast Asia",
  "home": "Universitas Indonesia, Depok",
  "contact": {
    "instagram": "https://instagram.com/girlupui.id",
    "instagramLabel": "@girlupui.id",
    "linkedin": "https://linkedin.com/company/girl-up-ui-indonesia",
    "medium": "https://girlupui-id.medium.com/",
    "email": ""
  }
}$json$::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'identity');

-- about
INSERT INTO public.site_settings (key, value)
SELECT 'about', $json${
  "title": "Berawal dari sebuah ide di United Nations Foundation",
  "paragraphs": [
    "Girl Up lahir pada 2010 di dalam United Nations Foundation sebagai sebuah inisiatif pengembangan kepemimpinan yang berpusat pada perempuan. Dari satu ide sederhana, Girl Up tumbuh menjadi gerakan global yang dipimpin oleh anak muda.",
    "Pada November 2025, Girl Up berpindah ke Global Fund for Children sebagai rumah fiskal barunya — memperkuat akar regional, dukungan langsung untuk aksi yang dipimpin anak muda, dan solidaritas global.",
    "Hari ini Girl Up menghubungkan lebih dari 345.000 pemimpin muda di 155 negara. Empat pilar kerjanya adalah Youth Leadership, Convenings, Youth-Led Action, dan Partnerships."
  ]
}$json$::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'about');

-- vision
INSERT INTO public.site_settings (key, value)
SELECT 'vision', $json${
  "statement": "Terwujudnya dunia yang lebih adil dan setara bagi perempuan dan anak perempuan — dunia yang memberikan manfaat bagi semua orang.",
  "quote": "Girl Up membayangkan dunia yang lebih adil dan setara bagi perempuan, yang pada akhirnya menguntungkan semua orang."
}$json$::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'vision');

-- missions
INSERT INTO public.site_settings (key, value)
SELECT 'missions', $json$[
  {"title": "Mengembangkan kepemimpinan perempuan muda", "description": "Membekali perempuan muda dengan keterampilan, kepercayaan diri, dan pengalaman kepemimpinan nyata agar mereka mampu mengambil posisi di ruang pengambilan keputusan."},
  {"title": "Mengadvokasikan kesetaraan gender", "description": "Mengangkat isu kesetaraan gender, hak reproduksi, dan pemberdayaan perempuan melalui kajian berbasis riset serta kampanye yang terarah dan terukur."},
  {"title": "Menciptakan ruang aman dan inklusif", "description": "Membangun komunitas yang aman bagi perempuan dan kelompok terpinggirkan untuk berbagi pengalaman, berdiskusi, dan saling mendukung tanpa penilaian."},
  {"title": "Menjalin kolaborasi lintas komunitas", "description": "Bermitra dengan kampus, institusi, komunitas, dan organisasi sejenis untuk memperluas dampak gerakan kesetaraan gender."},
  {"title": "Menggerakkan aksi yang dipimpin anak muda", "description": "Mewujudkan program dan aksi sosial yang dirancang serta dijalankan oleh anak muda, sehingga perubahan tumbuh dari mereka sendiri."}
]$json$::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'missions');

-- values
INSERT INTO public.site_settings (key, value)
SELECT 'values', $json$[
  {"title": "Youth-Centered", "id": "Berpusat pada anak muda", "description": "Suara anak muda layak didengar dan dipertimbangkan di tingkat pengambilan keputusan tertinggi. Gerakan ini terbuka bagi semua anak muda, dan keamanan mereka selalu menjadi prioritas."},
  {"title": "Passionate Action", "id": "Tindakan yang berapi-api", "description": "Anak muda memiliki kekuatan untuk menggerakkan perubahan. Program kami membantu anggota mengubah kepedulian menjadi aksi nyata untuk komunitas yang lebih adil."},
  {"title": "Global Community", "id": "Komunitas global", "description": "Kami merangkul pengalaman dan perspektif setiap anggota. Setiap identitas — latar belakang, kepercayaan, kemampuan, dan orientasi — dihargai dan dirayakan."},
  {"title": "Accountability", "id": "Akuntabilitas", "description": "Kami membuka ruang masukan melalui survei dan komite, serta menempatkan suara anak muda di setiap tingkat organisasi. Kami mengundang anggota untuk menagih kami."}
]$json$::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'values');

-- pillars
INSERT INTO public.site_settings (key, value)
SELECT 'pillars', $json$[
  {"title": "Youth Leadership", "description": "Pelatihan kepemimpinan, pendampingan, dan ruang pertumbuhan bagi perempuan muda.", "icon": "sprout"},
  {"title": "Convenings", "description": "Pertemuan, diskusi publik, dan kolokium yang mempertemukan lintas komunitas.", "icon": "users"},
  {"title": "Youth-Led Action", "description": "Aksi langsung yang dipimpin anak muda untuk perubahan struktural dan budaya.", "icon": "megaphone"},
  {"title": "Partnerships", "description": "Kolaborasi dengan kampus, institusi, komunitas, dan organisasi sejenis.", "icon": "globe"}
]$json$::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'pillars');

-- stats
INSERT INTO public.site_settings (key, value)
SELECT 'stats', $json$[
  {"value": "2019", "label": "Tahun berdiri", "note": "Girl Up UI hadir di Universitas Indonesia sejak 2019."},
  {"value": "7", "label": "Departemen", "note": "Tujuh departemen yang menopang program dan operasional."},
  {"value": "155", "label": "Negara", "note": "Jangkauan jaringan global Girl Up di seluruh dunia."},
  {"value": "1.000.000", "label": "Target pemimpin 2030", "note": "Target Girl Up melatih satu juta pemimpin perempuan dan anak muda."}
]$json$::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'stats');

-- join_steps
INSERT INTO public.site_settings (key, value)
SELECT 'join_steps', $json$[
  {"title": "Kenali gerakan kami", "description": "Baca tentang Girl Up, nilai inti, dan program yang kami jalankan agar kamu tahu apa yang kami perjuangkan."},
  {"title": "Ikuti kanal resmi", "description": "Pantau Instagram dan LinkedIn Girl Up UI untuk informasi rekrutasi dan agenda terbaru."},
  {"title": "Ikut seleksi", "description": "Lengkapi formulir pendaftaran dan ikuti tahap seleksi bersama departemen pilihanmu."},
  {"title": "Bertumbuh bersama", "description": "Setelah bergabung, kamu akan didampingi melalui pelatihan dan program kerja nyata."}
]$json$::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings WHERE key = 'join_steps');

-- departments
INSERT INTO public.cms_departments (slug, name, short_name, tagline, description, focus, icon, head_name, deputy_name, member_count, sort_order)
SELECT * FROM (VALUES
  ('programs', 'Programs Department', 'Programs', 'Dari gagasan menjadi aksi di lapangan',
   'Departemen yang merancang, menyiapkan, dan mengeksekusi program pemberdayaan perempuan dan kelompok terpinggirkan — mulai dari perancangan, koordinasi relawan, hingga evaluasi dampak.',
   '["Perancangan dan eksekusi program tahunan","Manajemen relawan dan kolaborasi komunitas","Kampanye kesetaraan gender dan inklusi"]'::jsonb,
   'sprout', 'Nashula Tabina', NULL, NULL, 1),
  ('research-advocacy', 'Research and Advocacy Department', 'Research & Advocacy', 'Riset yang menjadi dasar advokasi',
   'Departemen yang menghasilkan kajian berbasis riset dan konten advokasi digital tentang hak reproduksi, keadilan gender, dan isu sosial lainnya.',
   '["Penulisan artikel dan kajian berbasis riset","Kampanye advokasi digital","Edukasi isu SRHR dan keadilan gender"]'::jsonb,
   'microscope', 'Alya Lubna Khairani', 'Nadra Syafaziel', 13, 2),
  ('prsmm', 'Public Relations and Social Media Management', 'PRSMM', 'Menjaga hubungan, memperluas jangkauan',
   'Departemen yang membangun hubungan dengan media, komunitas, dan mitra, sekaligus mengelola kanal komunikasi publik Girl Up UI.',
   '["Hubungan dengan media dan mitra","Pengelolaan kanal media sosial","Publikasi dan penyebarluasan informasi"]'::jsonb,
   'megaphone', 'Fatimah Sausan Almuhdor', NULL, NULL, 3),
  ('creative-media', 'Creative Media', 'Creative Media', 'Bahasa visual untuk isu yang penting',
   'Departemen yang menerjemahkan pesan advokasi menjadi karya visual — desain, konten kreatif, dan publikasi yang menjangkau.',
   '["Desain grafis dan identitas visual","Produksi konten kreatif bulanan","Kajian film dan serial bermuatan isu perempuan"]'::jsonb,
   'palette', 'Najwa Syahrira', 'Zulaikha Salsabila', NULL, 4),
  ('finance-accounting', 'Finance and Accounting', 'Finance & Accounting', 'Akuntabilitas di setiap rupiah',
   'Departemen yang mengelola keuangan organisasi — perencanaan anggaran, pencatatan, pelaporan, hingga akuntabilitas dana program.',
   '["Perencanaan dan pengendalian anggaran","Pencatatan dan pelaporan keuangan","Penggalangan dana dan akuntabilitas"]'::jsonb,
   'wallet', NULL, NULL, NULL, 5),
  ('human-resources', 'Human Resources', 'Human Resources', 'Merawat orang, merawat gerakan',
   'Departemen yang menjaga proses rekrutasi, pengembangan, dan kesejahteraan anggota agar setiap orang tumbuh dan bekerja dengan aman.',
   '["Rekrutasi dan seleksi anggota","Pengembangan dan pendampingan anggota","Kesejahteraan dan budaya organisasi"]'::jsonb,
   'heart-handshake', NULL, NULL, NULL, 6),
  ('secretary', 'Secretary and Internal Affairs', 'Secretary', 'Menjaga tata kelola dan administrasi',
   'Departemen yang menopang tata kelola internal — administrasi, dokumentasi, notulensi, dan koordinasi antar departemen.',
   '["Administrasi dan dokumentasi organisasi","Notulensi dan tata kelola rapat","Koordinasi internal lintas departemen"]'::jsonb,
   'file-text', 'Zulfa Fadilatun Nisa', NULL, NULL, 7)
) AS seed(slug, name, short_name, tagline, description, focus, icon, head_name, deputy_name, member_count, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.cms_departments);

-- leaders
INSERT INTO public.cms_leaders (name, role, group_name, sort_order)
SELECT * FROM (VALUES
  ('Annisa Shafa Humaira', 'President', 'Inti', 1),
  ('Rajwa Nazhifa Firdausi', 'Vice President External', 'Inti', 2),
  ('Nashula Tabina', 'Head of Programs Department', 'Departemen', 3),
  ('Alya Lubna Khairani', 'Head of Research and Advocacy', 'Departemen', 4),
  ('Nadra Syafaziel', 'Deputy Head Internal, Research and Advocacy', 'Departemen', 5),
  ('Yasyfa Nadhira', 'Deputy External, Research and Advocacy', 'Departemen', 6),
  ('Fatimah Sausan Almuhdor', 'Head of PRSMM', 'Departemen', 7),
  ('Aqila Berlian Zalia', 'Board of Directors — PRSMM', 'Departemen', 8),
  ('Najwa Syahrira', 'Head of Creative Media', 'Departemen', 9),
  ('Zulaikha Salsabila', 'Deputy Head of Creative Media', 'Departemen', 10),
  ('Zulfa Fadilatun Nisa', 'Head of Secretary', 'Departemen', 11)
) AS seed(name, role, group_name, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.cms_leaders);

-- programs
INSERT INTO public.cms_programs (title, category, description, icon, sort_order)
SELECT * FROM (VALUES
  ('Womantic', 'Diskusi & Advokasi', 'Women’s Talk on Current Issues — seri percakapan kritis tentang isu perempuan, dari kematian akibat gender hingga kekerasan berbasis gender daring.', 'radio', 1),
  ('BRIDGE', 'Aksi Sosial', 'Bridging Respect, Inclusivity in Diversity, and Generating Empowerment. Program pemberdayaan disabilitas berbasis relawan dengan pendampingan dan pelatihan sadar inklusi.', 'heart-handshake', 2),
  ('We Hear You', 'Diskusi Publik', 'Ruang diskusi terbuka yang mengangkat isu kesetaraan gender dan pemberdayaan perempuan bersama pembicara dari berbagai latar belakang.', 'lightbulb', 3),
  ('16 HAKtP', 'Kampanye', 'Kampanye 16 Days of Activism Against Gender-Based Violence sebagai bentuk solidaritas melawan kekerasan berbasis gender.', 'shield-check', 4),
  ('International Women’s Day', 'Kampanye', 'Perayaan Hari Perempuan Internasional melalui panel diskusi, talk show, dan kampanye digital yang melibatkan ratusan peserta.', 'megaphone', 5),
  ('Movie of the Month', 'Kajian & Media', 'Tayangan dan kajian bulanan film serta serial yang mengangkat isu perempuan, diikuti diskusi bersama anggota dan publik.', 'palette', 6),
  ('E-Magazine', 'Publikasi', 'Terbitan digital yang memuat esai, kajian, dan karya tulis anggota tentang isu gender dan hak perempuan.', 'file-text', 7),
  ('Day Out', 'Edukasi', 'Kunjungan institusional untuk memperluas wawasan kepemimpinan dan representasi perempuan di ruang kebijakan.', 'globe', 8)
) AS seed(title, category, description, icon, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.cms_programs);

-- milestones
INSERT INTO public.cms_milestones (year, title, description, sort_order)
SELECT * FROM (VALUES
  ('2010', 'Girl Up diluncurkan', 'Girl Up lahir di dalam United Nations Foundation sebagai inisiatif pengembangan kepemimpinan perempuan.', 1),
  ('2019', 'Girl Up UI berdiri', 'Babak baru dimulai di Universitas Indonesia sebagai gerakan kesetaraan gender yang dipimpin mahasiswa.', 2),
  ('2025', 'Beralih ke Global Fund for Children', 'Girl Up menandai babak baru dengan berpindah ke Global Fund for Children sebagai rumah fiskal, dipimpin penuh oleh anak muda.', 3),
  ('2030', 'Satu juta pemimpin', 'Target global Girl Up untuk melatih satu juta pemimpin perempuan dan anak muda yang menggerakkan keadilan gender.', 4)
) AS seed(year, title, description, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.cms_milestones);

-- ============================================================
-- Grant akses untuk role aplikasi.
--
-- GRANT ... ON ALL TABLES hanya mencakup tabel yang sudah ada saat
-- grant dijalankan, jadi tabel CMS baru harus di-grant secara eksplisit.
-- Dibungkus pengecekan agar file ini tetap aman dijalankan ulang
-- dan tidak gagal bila nama role berbeda.
-- ============================================================
DO $do$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'girlupkilo_app') THEN
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO girlupkilo_app';
    EXECUTE 'GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO girlupkilo_app';
  END IF;
END
$do$;