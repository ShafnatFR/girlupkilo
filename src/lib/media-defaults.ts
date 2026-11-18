// ============================================================
// Tipe + data default untuk modul konten publik tambahan:
// Acara (events), Dokumentasi/Galeri, Artikel, dan E-Magazine.
//
// Data default di sini dipakai sebagai fallback ketika tabel CMS
// belum dipasang atau belum diisi — sama seperti src/lib/site.ts.
// ============================================================

// ------------------------------------------------------------
// Acara (events)

export interface MediaEvent {
  slug: string;
  title: string;
  description: string;
  /** Tanggal ISO (YYYY-MM-DD) atau string bebas bila tidak diketahui. */
  date: string;
  location: string;
  category: string;
  image: string;
}

export const DEFAULT_EVENTS: MediaEvent[] = [
  {
    slug: 'women-s-talk-2026',
    title: "Women's Talk on Current Issues",
    description:
      'Seri percakapan kritis tentang isu perempuan bersama pembicara dari berbagai latar belakang.',
    date: '2026-03-14',
    location: 'Universitas Indonesia, Depok',
    category: 'Diskusi',
    image: '',
  },
  {
    slug: '16-haktp-2026',
    title: '16 Days of Activism',
    description:
      'Kampanye solidaritas melawan kekerasan berbasis gender sepanjang 16 hari.',
    date: '2026-11-25',
    location: 'Daring & Kampus',
    category: 'Kampanye',
    image: '',
  },
  {
    slug: 'international-womens-day-2026',
    title: "International Women's Day",
    description:
      'Perayaan Hari Perempuan Internasional melalui panel diskusi dan kampanye digital.',
    date: '2026-03-08',
    location: 'Universitas Indonesia, Depok',
    category: 'Kampanye',
    image: '',
  },
];

// ------------------------------------------------------------
// Dokumentasi / Galeri

export interface MediaGalleryItem {
  title: string;
  caption: string;
  image: string;
  category: string;
}

export const DEFAULT_GALLERY: MediaGalleryItem[] = [
  {
    title: 'Diskusi Womantic',
    caption: "Suasana diskusi Women's Talk bersama peserta dan pembicara.",
    image: '',
    category: 'Diskusi',
  },
  {
    title: 'Kampanye 16 HAKtP',
    caption: 'Aksi kampanye menolak kekerasan berbasis gender.',
    image: '',
    category: 'Kampanye',
  },
  {
    title: 'Kunjungan Day Out',
    caption: 'Kunjungan institusional memperluas wawasan kepemimpinan.',
    image: '',
    category: 'Edukasi',
  },
];

// ------------------------------------------------------------
// Artikel

export interface MediaArticle {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  /** Tanggal ISO (YYYY-MM-DD) terbit, bila ada. */
  date: string;
}

export const DEFAULT_ARTICLES: MediaArticle[] = [
  {
    slug: 'memahami-kesetaraan-gender',
    title: 'Memahami Kesetaraan Gender',
    excerpt:
      'Tulisan pengantar tentang makna kesetaraan gender dan mengapa ia penting bagi semua.',
    content:
      'Kesetaraan gender berarti hak, kesempatan, dan perlakuan yang setara bagi semua gender. Tulisan ini mengajak pembaca memahami konsep dasar dan relevansinya dalam kehidupan sehari-hari.',
    author: 'Tim Research and Advocacy',
    category: 'Artikel',
    image: '',
    date: '2026-02-10',
  },
  {
    slug: 'ruang-aman-bagi-perempuan',
    title: 'Menciptakan Ruang Aman bagi Perempuan',
    excerpt:
      'Bagaimana komunitas dapat membangun ruang yang aman dan inklusif.',
    content:
      'Ruang aman adalah tempat di mana setiap orang dapat berbagi pengalaman tanpa takut dihakimi. Artikel ini membahas langkah-langkah membangun komunitas yang inklusif.',
    author: 'Tim Research and Advocacy',
    category: 'Artikel',
    image: '',
    date: '2026-02-24',
  },
];

// ------------------------------------------------------------
// E-Magazine

export interface MediaEmagazine {
  slug: string;
  title: string;
  description: string;
  issue: string;
  image: string;
  fileUrl: string;
  date: string;
}

export const DEFAULT_EMAGAZINES: MediaEmagazine[] = [
  {
    slug: 'e-magazine-edisi-1',
    title: 'E-Magazine Edisi 1',
    description:
      'Terbitan perdana yang memuat esai, kajian, dan karya tulis anggota tentang isu gender dan hak perempuan.',
    issue: 'Edisi 1',
    image: '',
    fileUrl: '',
    date: '2026-01-20',
  },
  {
    slug: 'e-magazine-edisi-2',
    title: 'E-Magazine Edisi 2',
    description:
      'Terbitan kedua dengan tema ruang aman dan kepemimpinan perempuan muda.',
    issue: 'Edisi 2',
    image: '',
    fileUrl: '',
    date: '2026-05-18',
  },
];