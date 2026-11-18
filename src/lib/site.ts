// ============================================================
// Sumber konten untuk halaman publik (guest / pengunjung).
//
// Semua teks, struktur departemen, dan nama pengurus halaman publik
// diambil dari file ini. Ubah di sini bila ada pembaruan periode
// kepengurusan — tidak perlu menyentuh komponen halaman.
// ============================================================

import type { LucideIcon } from 'lucide-react';
import {
  Megaphone,
  Microscope,
  Users,
  Palette,
  Wallet,
  HeartHandshake,
  FileText,
  Sprout,
  Globe2,
  Radio,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';

// ------------------------------------------------------------ identitas

export const SITE = {
  name: 'Girl Up UI',
  fullName: 'Girl Up Universitas Indonesia',
  shortName: 'GUUI',
  tagline: 'When Girls Rise, We All Rise',
  established: 2019,
  description:
    'Gerakan kepemimpinan perempuan muda di Universitas Indonesia yang tumbuh sebagai bagian dari jaringan global Girl Up. Kami mendorong kesetaraan gender, kepemimpinan, dan dampak sosial melalui advokasi, kolaborasi, dan pendidikan.',
  parent: 'Girl Up',
  region: 'Girl Up Southeast Asia',
  home: 'Universitas Indonesia, Depok',
} as const;

export const CONTACT = {
  instagram: 'https://instagram.com/girlupui.id',
  instagramLabel: '@girlupui.id',
  linkedin: 'https://linkedin.com/company/girl-up-ui-indonesia',
  medium: 'https://girlupui-id.medium.com/',
  // Isi bila sudah tersedia; tautan tidak ditampilkan bila kosong.
  email: '',
} as const;

// ------------------------------------------------------------ angka kunci

export interface Stat {
  value: string;
  label: string;
  note: string;
}

export const STATS: Stat[] = [
  {
    value: '2019',
    label: 'Tahun berdiri',
    note: 'Girl Up UI hadir di Universitas Indonesia sejak 2019.',
  },
  {
    value: '7',
    label: 'Departemen',
    note: 'Tujuh departemen yang menopang program dan operasional.',
  },
  {
    value: '155',
    label: 'Negara',
    note: 'Jangkauan jaringan global Girl Up di seluruh dunia.',
  },
  {
    value: '1.000.000',
    label: 'Target pemimpin 2030',
    note: 'Target Girl Up melatih satu juta pemimpin perempuan dan anak muda.',
  },
];

// ------------------------------------------------------------ ringkasan global

export const ABOUT_GLOBAL = {
  title: 'Berawal dari sebuah ide di United Nations Foundation',
  paragraphs: [
    'Girl Up lahir pada 2010 di dalam United Nations Foundation sebagai sebuah inisiatif pengembangan kepemimpinan yang berpusat pada perempuan. Dari satu ide sederhana, Girl Up tumbuh menjadi gerakan global yang dipimpin oleh anak muda.',
    'Pada November 2025, Girl Up berpindah ke Global Fund for Children sebagai rumah fiskal barunya — memperkuat akar regional, dukungan langsung untuk aksi yang dipimpin anak muda, dan solidaritas global.',
    'Hari ini Girl Up menghubungkan lebih dari 345.000 pemimpin muda di 155 negara. Empat pilar kerjanya adalah Youth Leadership, Convenings, Youth-Led Action, dan Partnerships.',
  ],
} as const;

// ------------------------------------------------------------ nilai inti

export interface ValueItem {
  title: string;
  id: string;
  description: string;
}

export const VALUES: ValueItem[] = [
  {
    title: 'Youth-Centered',
    id: 'Berpusat pada anak muda',
    description:
      'Suara anak muda layak didengar dan dipertimbangkan di tingkat pengambilan keputusan tertinggi. Gerakan ini terbuka bagi semua anak muda, dan keamanan mereka selalu menjadi prioritas.',
  },
  {
    title: 'Passionate Action',
    id: 'Tindakan yang berapi-api',
    description:
      'Anak muda memiliki kekuatan untuk menggerakkan perubahan. Program kami membantu anggota mengubah kepedulian menjadi aksi nyata untuk komunitas yang lebih adil.',
  },
  {
    title: 'Global Community',
    id: 'Komunitas global',
    description:
      'Kami merangkul pengalaman dan perspektif setiap anggota. Setiap identitas — latar belakang, kepercayaan, kemampuan, dan orientasi — dihargai dan dirayakan.',
  },
  {
    title: 'Accountability',
    id: 'Akuntabilitas',
    description:
      'Kami membuka ruang masukan melalui survei dan komite, serta menempatkan suara anak muda di setiap tingkat organisasi. Kami mengundang anggota untuk menagih kami.',
  },
];

// ------------------------------------------------------------ visi

export const VISION =
  'Terwujudnya dunia yang lebih adil dan setara bagi perempuan dan anak perempuan — dunia yang memberikan manfaat bagi semua orang.';

export const VISION_QUOTE =
  'Girl Up membayangkan dunia yang lebih adil dan setara bagi perempuan, yang pada akhirnya menguntungkan semua orang.';

// ------------------------------------------------------------ misi

export interface Mission {
  title: string;
  description: string;
}

export const MISSIONS: Mission[] = [
  {
    title: 'Mengembangkan kepemimpinan perempuan muda',
    description:
      'Membekali perempuan muda dengan keterampilan, kepercayaan diri, dan pengalaman kepemimpinan nyata agar mereka mampu mengambil posisi di ruang pengambilan keputusan.',
  },
  {
    title: 'Mengadvokasikan kesetaraan gender',
    description:
      'Mengangkat isu kesetaraan gender, hak reproduksi, dan pemberdayaan perempuan melalui kajian berbasis riset serta kampanye yang terarah dan terukur.',
  },
  {
    title: 'Menciptakan ruang aman dan inklusif',
    description:
      'Membangun komunitas yang aman bagi perempuan dan kelompok terpinggirkan untuk berbagi pengalaman, berdiskusi, dan saling mendukung tanpa penilaian.',
  },
  {
    title: 'Menjalin kolaborasi lintas komunitas',
    description:
      'Bermitra dengan kampus, institusi, komunitas, dan organisasi sejenis untuk memperluas dampak gerakan kesetaraan gender.',
  },
  {
    title: 'Menggerakkan aksi yang dipimpin anak muda',
    description:
      'Mewujudkan program dan aksi sosial yang dirancang serta dijalankan oleh anak muda, sehingga perubahan tumbuh dari mereka sendiri.',
  },
];

// ------------------------------------------------------------ pendekatan

export interface ApproachStep {
  title: string;
  description: string;
}

export const APPROACH: ApproachStep[] = [
  {
    title: 'Kesadaran',
    description:
      'Membuka percakapan tentang isu gender melalui kajian, diskusi publik, dan kampanye digital.',
  },
  {
    title: 'Kepemimpinan',
    description:
      'Melatih keterampilan advokasi, pengorganisasian, dan komunikasi bagi anggota muda.',
  },
  {
    title: 'Aksi',
    description:
      'Menerjemahkan kesadaran menjadi program dan aksi sosial yang berdampak langsung di komunitas.',
  },
  {
    title: 'Dampak',
    description:
      'Mengukur, mendokumentasikan, dan melaporkan hasil agar pembelajaran terus berjalan.',
  },
];

// ------------------------------------------------------------ pilar

export interface Pillar {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const PILLARS: Pillar[] = [
  {
    title: 'Youth Leadership',
    description:
      'Pelatihan kepemimpinan, pendampingan, dan ruang pertumbuhan bagi perempuan muda.',
    icon: Sprout,
  },
  {
    title: 'Convenings',
    description:
      'Pertemuan, diskusi publik, dan kolokium yang mempertemukan lintas komunitas.',
    icon: Users,
  },
  {
    title: 'Youth-Led Action',
    description:
      'Aksi langsung yang dipimpin anak muda untuk perubahan struktural dan budaya.',
    icon: Megaphone,
  },
  {
    title: 'Partnerships',
    description:
      'Kolaborasi dengan kampus, institusi, komunitas, dan organisasi sejenis.',
    icon: Globe2,
  },
];

// ------------------------------------------------------------ program unggulan

export interface Program {
  title: string;
  category: string;
  description: string;
  icon: LucideIcon;
}

export const PROGRAMS: Program[] = [
  {
    title: 'Womantic',
    category: 'Diskusi & Advokasi',
    description:
      'Women’s Talk on Current Issues — seri percakapan kritis tentang isu perempuan, dari kematian akibat gender hingga kekerasan berbasis gender daring.',
    icon: Radio,
  },
  {
    title: 'BRIDGE',
    category: 'Aksi Sosial',
    description:
      'Bridging Respect, Inclusivity in Diversity, and Generating Empowerment. Program pemberdayaan disabilitas berbasis relawan dengan pendampingan dan pelatihan sadar inklusi.',
    icon: HeartHandshake,
  },
  {
    title: 'We Hear You',
    category: 'Diskusi Publik',
    description:
      'Ruang diskusi terbuka yang mengangkat isu kesetaraan gender dan pemberdayaan perempuan bersama pembicara dari berbagai latar belakang.',
    icon: Lightbulb,
  },
  {
    title: '16 HAKtP',
    category: 'Kampanye',
    description:
      'Kampanye 16 Days of Activism Against Gender-Based Violence sebagai bentuk solidaritas melawan kekerasan berbasis gender.',
    icon: ShieldCheck,
  },
  {
    title: 'International Women’s Day',
    category: 'Kampanye',
    description:
      'Perayaan Hari Perempuan Internasional melalui panel diskusi, talk show, dan kampanye digital yang melibatkan ratusan peserta.',
    icon: Megaphone,
  },
  {
    title: 'Movie of the Month',
    category: 'Kajian & Media',
    description:
      'Tayangan dan kajian bulanan film serta serial yang mengangkat isu perempuan, diikuti diskusi bersama anggota dan publik.',
    icon: Palette,
  },
  {
    title: 'E-Magazine',
    category: 'Publikasi',
    description:
      'Terbitan digital yang memuat esai, kajian, dan karya tulis anggota tentang isu gender dan hak perempuan.',
    icon: FileText,
  },
  {
    title: 'Day Out',
    category: 'Edukasi',
    description:
      'Kunjungan institusional untuk memperluas wawasan kepemimpinan dan representasi perempuan di ruang kebijakan.',
    icon: Globe2,
  },
];

// ------------------------------------------------------------ departemen

export interface Member {
  name: string;
  role: string;
}

export interface Department {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  focus: string[];
  icon: LucideIcon;
  head?: string;
  deputy?: string;
  members?: number;
}

export const DEPARTMENTS: Department[] = [
  {
    slug: 'programs',
    name: 'Programs Department',
    shortName: 'Programs',
    tagline: 'Dari gagasan menjadi aksi di lapangan',
    description:
      'Departemen yang merancang, menyiapkan, dan mengeksekusi program pemberdayaan perempuan dan kelompok terpinggirkan — mulai dari perencanaan, koordinasi relawan, hingga evaluasi dampak.',
    focus: [
      'Perancangan dan eksekusi program tahunan',
      'Manajemen relawan dan kolaborasi komunitas',
      'Kampanye kesetaraan gender dan inklusi',
    ],
    icon: Sprout,
    head: 'Nashula Tabina',
  },
  {
    slug: 'research-advocacy',
    name: 'Research and Advocacy Department',
    shortName: 'Research & Advocacy',
    tagline: 'Riset yang menjadi dasar advokasi',
    description:
      'Departemen yang menghasilkan kajian berbasis riset dan konten advokasi digital tentang hak reproduksi, keadilan gender, dan isu sosial lainnya.',
    focus: [
      'Penulisan artikel dan kajian berbasis riset',
      'Kampanye advokasi digital',
      'Edukasi isu SRHR dan keadilan gender',
    ],
    icon: Microscope,
    head: 'Alya Lubna Khairani',
    deputy: 'Nadra Syafaziel',
    members: 13,
  },
  {
    slug: 'prsmm',
    name: 'Public Relations and Social Media Management',
    shortName: 'PRSMM',
    tagline: 'Menjaga hubungan, memperluas jangkauan',
    description:
      'Departemen yang membangun hubungan dengan media, komunitas, dan mitra, sekaligus mengelola kanal komunikasi publik Girl Up UI.',
    focus: [
      'Hubungan dengan media dan mitra',
      'Pengelolaan kanal media sosial',
      'Publikasi dan penyebarluasan informasi',
    ],
    icon: Megaphone,
    head: 'Fatimah Sausan Almuhdor',
  },
  {
    slug: 'creative-media',
    name: 'Creative Media',
    shortName: 'Creative Media',
    tagline: 'Bahasa visual untuk isu yang penting',
    description:
      'Departemen yang menerjemahkan pesan advokasi menjadi karya visual — desain, konten kreatif, dan publikasi yang menjangkau.',
    focus: [
      'Desain grafis dan identitas visual',
      'Produksi konten kreatif bulanan',
      'Kajian film dan serial bermuatan isu perempuan',
    ],
    icon: Palette,
    head: 'Najwa Syahrira',
    deputy: 'Zulaikha Salsabila',
  },
  {
    slug: 'finance-accounting',
    name: 'Finance and Accounting',
    shortName: 'Finance & Accounting',
    tagline: 'Akuntabilitas di setiap rupiah',
    description:
      'Departemen yang mengelola keuangan organisasi — perencanaan anggaran, pencatatan, pelaporan, hingga akuntabilitas dana program.',
    focus: [
      'Perencanaan dan pengendalian anggaran',
      'Pencatatan dan pelaporan keuangan',
      'Penggalangan dana dan akuntabilitas',
    ],
    icon: Wallet,
  },
  {
    slug: 'human-resources',
    name: 'Human Resources',
    shortName: 'Human Resources',
    tagline: 'Merawat orang, merawat gerakan',
    description:
      'Departemen yang menjaga proses rekrutasi, pengembangan, dan kesejahteraan anggota agar setiap orang tumbuh dan bekerja dengan aman.',
    focus: [
      'Rekrutasi dan seleksi anggota',
      'Pengembangan dan pendampingan anggota',
      'Kesejahteraan dan budaya organisasi',
    ],
    icon: HeartHandshake,
  },
  {
    slug: 'secretary',
    name: 'Secretary and Internal Affairs',
    shortName: 'Secretary',
    tagline: 'Menjaga tata kelola dan administrasi',
    description:
      'Departemen yang menopang tata kelola internal — administrasi, dokumentasi, notulensi, dan koordinasi antar departemen.',
    focus: [
      'Administrasi dan dokumentasi organisasi',
      'Notulensi dan tata kelola rapat',
      'Koordinasi internal lintas departemen',
    ],
    icon: FileText,
    head: 'Zulfa Fadilatun Nisa',
  },
];

// ------------------------------------------------------------ pengurus

// Catatan: nama di bawah dikompilasi dari sumber publik (LinkedIn) periode
// 2025/2026 dan perlu dikonfirmasi sebelum dipublikasikan. Cukup ubah nilai
// di sini bila ada pembaruan — halaman akan mengikuti otomatis.

export interface LeadershipMember extends Member {
  group: 'Inti' | 'Departemen';
}

export const LEADERSHIP: LeadershipMember[] = [
  { name: 'Annisa Shafa Humaira', role: 'President', group: 'Inti' },
  {
    name: 'Rajwa Nazhifa Firdausi',
    role: 'Vice President External',
    group: 'Inti',
  },
  {
    name: 'Nashula Tabina',
    role: 'Head of Programs Department',
    group: 'Departemen',
  },
  {
    name: 'Alya Lubna Khairani',
    role: 'Head of Research and Advocacy',
    group: 'Departemen',
  },
  {
    name: 'Nadra Syafaziel',
    role: 'Deputy Head Internal, Research and Advocacy',
    group: 'Departemen',
  },
  {
    name: 'Yasyfa Nadhira',
    role: 'Deputy External, Research and Advocacy',
    group: 'Departemen',
  },
  {
    name: 'Fatimah Sausan Almuhdor',
    role: 'Head of PRSMM',
    group: 'Departemen',
  },
  {
    name: 'Aqila Berlian Zalia',
    role: 'Board of Directors — PRSMM',
    group: 'Departemen',
  },
  {
    name: 'Najwa Syahrira',
    role: 'Head of Creative Media',
    group: 'Departemen',
  },
  {
    name: 'Zulaikha Salsabila',
    role: 'Deputy Head of Creative Media',
    group: 'Departemen',
  },
  {
    name: 'Zulfa Fadilatun Nisa',
    role: 'Head of Secretary',
    group: 'Departemen',
  },
];

// ------------------------------------------------------------ tonggak waktu

export interface Milestone {
  year: string;
  title: string;
  description: string;
}

export const MILESTONES: Milestone[] = [
  {
    year: '2010',
    title: 'Girl Up diluncurkan',
    description:
      'Girl Up lahir di dalam United Nations Foundation sebagai inisiatif pengembangan kepemimpinan perempuan.',
  },
  {
    year: '2019',
    title: 'Girl Up UI berdiri',
    description:
      'Babak baru dimulai di Universitas Indonesia sebagai gerakan kesetaraan gender yang dipimpin mahasiswa.',
  },
  {
    year: '2025',
    title: 'Beralih ke Global Fund for Children',
    description:
      'Girl Up menandai babak baru dengan berpindah ke Global Fund for Children sebagai rumah fiskal, dipimpin penuh oleh anak muda.',
  },
  {
    year: '2030',
    title: 'Satu juta pemimpin',
    description:
      'Target global Girl Up untuk melatih satu juta pemimpin perempuan dan anak muda yang menggerakkan keadilan gender.',
  },
];

// ------------------------------------------------------------ alur keanggotaan

export interface Step {
  title: string;
  description: string;
}

export const JOIN_STEPS: Step[] = [
  {
    title: 'Kenali gerakan kami',
    description:
      'Baca tentang Girl Up, nilai inti, dan program yang kami jalankan agar kamu tahu apa yang kami perjuangkan.',
  },
  {
    title: 'Ikuti kanal resmi',
    description:
      'Pantau Instagram dan LinkedIn Girl Up UI untuk informasi rekrutasi dan agenda terbaru.',
  },
  {
    title: 'Ikut seleksi',
    description:
      'Lengkapi formulir pendaftaran dan ikuti tahap seleksi bersama departemen pilihanmu.',
  },
  {
    title: 'Bertumbuh bersama',
    description:
      'Setelah bergabung, kamu akan didampingi melalui pelatihan dan program kerja nyata.',
  },
];