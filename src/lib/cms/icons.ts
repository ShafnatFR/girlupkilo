import {
  FileText,
  Globe2,
  HeartHandshake,
  Lightbulb,
  Megaphone,
  Microscope,
  Palette,
  Radio,
  ShieldCheck,
  Sparkles,
  Sprout,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

/**
 * Ikon disimpan sebagai string di database agar admin bisa memilihnya
 * tanpa menyentuh kode. Pemetaan ke komponen hanya ada di sini.
 */
export const ICON_MAP = {
  sprout: Sprout,
  users: Users,
  megaphone: Megaphone,
  globe: Globe2,
  radio: Radio,
  lightbulb: Lightbulb,
  'shield-check': ShieldCheck,
  palette: Palette,
  'file-text': FileText,
  microscope: Microscope,
  wallet: Wallet,
  'heart-handshake': HeartHandshake,
  sparkles: Sparkles,
} as const;

export type IconKey = keyof typeof ICON_MAP;

export const DEFAULT_ICON: IconKey = 'sprout';

/** Pilihan yang ditampilkan di form admin. */
export const ICON_CHOICES: { value: IconKey; label: string }[] = [
  { value: 'sprout', label: 'Tunas' },
  { value: 'users', label: 'Orang' },
  { value: 'megaphone', label: 'Pengeras suara' },
  { value: 'globe', label: 'Bumi' },
  { value: 'radio', label: 'Radio' },
  { value: 'lightbulb', label: 'Lampu' },
  { value: 'shield-check', label: 'Perisai' },
  { value: 'palette', label: 'Palet' },
  { value: 'file-text', label: 'Dokumen' },
  { value: 'microscope', label: 'Mikroskop' },
  { value: 'wallet', label: 'Dompet' },
  { value: 'heart-handshake', label: 'Jabat tangan' },
  { value: 'sparkles', label: 'Kilau' },
];

/** Ubah string dari DB menjadi komponen ikon. Selalu mengembalikan nilai valid. */
export function resolveIcon(key: string | null | undefined): LucideIcon {
  if (key && key in ICON_MAP) {
    return ICON_MAP[key as IconKey];
  }
  return ICON_MAP[DEFAULT_ICON];
}

/**
 * Kebalikan resolveIcon — dipakai saat mengirim data ke komponen klien,
 * karena fungsi komponen tidak bisa dilewatkan sebagai prop.
 */
export function iconKeyOf(icon: LucideIcon): IconKey {
  for (const [key, component] of Object.entries(ICON_MAP)) {
    if (component === icon) return key as IconKey;
  }
  return DEFAULT_ICON;
}