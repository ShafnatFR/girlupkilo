'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { resetSetting, saveSettings } from '@/lib/cms/client';

export interface SettingsFormState {
  saving: boolean;
  error: string;
  saved: boolean;
  run: (entries: { key: string; value: unknown }[]) => Promise<boolean>;
  reset: (keys: string[]) => Promise<void>;
  clearMessages: () => void;
}

/** Status & aksi simpan yang dipakai bersama oleh form pengaturan CMS. */
export function useSettingsForm(): SettingsFormState {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function run(
    entries: { key: string; value: unknown }[]
  ): Promise<boolean> {
    setSaving(true);
    setError('');
    setSaved(false);

    const result = await saveSettings(entries);

    if (!result.ok) {
      setError(result.error);
      setSaving(false);
      return false;
    }

    setSaving(false);
    setSaved(true);
    router.refresh();
    return true;
  }

  async function reset(keys: string[]) {
    setSaving(true);
    setError('');
    setSaved(false);

    for (const key of keys) {
      const result = await resetSetting(key);
      if (!result.ok) {
        setError(result.error);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    router.refresh();
  }

  function clearMessages() {
    setError('');
    setSaved(false);
  }

  return { saving, error, saved, run, reset, clearMessages };
}