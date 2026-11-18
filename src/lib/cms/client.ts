'use client';

/** Simpan satu atau beberapa dokumen pengaturan CMS. */
export async function saveSettings(
  entries: { key: string; value: unknown }[]
): Promise<{ ok: true } | { ok: false; error: string }> {
  for (const entry of entries) {
    try {
      const response = await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        return { ok: false, error: data.error ?? 'Gagal menyimpan perubahan' };
      }
    } catch {
      return { ok: false, error: 'Tidak dapat menghubungi server' };
    }
  }

  return { ok: true };
}

/** Kembalikan satu bagian ke nilai default dari kode. */
export async function resetSetting(
  key: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const response = await fetch(`/api/cms/settings?key=${encodeURIComponent(key)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      return { ok: false, error: data.error ?? 'Gagal mengembalikan nilai default' };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'Tidak dapat menghubungi server' };
  }
}