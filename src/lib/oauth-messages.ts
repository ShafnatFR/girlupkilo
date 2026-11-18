/** Pesan error login Google yang aman dipakai di client (tanpa import server-only). */
export const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  google_disabled: 'Login dengan Google belum dikonfigurasi di server.',
  google_cancelled: 'Login dengan Google dibatalkan.',
  google_state: 'Sesi login Google kedaluwarsa. Silakan coba lagi.',
  google_token: 'Gagal memverifikasi akun Google. Coba lagi.',
  google_email: 'Akun Google ini tidak punya email terverifikasi.',
  google_domain: 'Domain email kamu tidak diizinkan untuk masuk lewat Google.',
  google_not_registered: 'Email ini belum terdaftar. Minta admin membuatkan akun dulu.',
  google_conflict: 'Email ini sudah terhubung ke akun Google lain.',
  google_server: 'Terjadi kesalahan di server saat login dengan Google.',
};

export function oauthErrorMessage(code: string | undefined | null): string {
  if (!code) return '';
  return OAUTH_ERROR_MESSAGES[code] ?? 'Login dengan Google gagal. Coba lagi.';
}
