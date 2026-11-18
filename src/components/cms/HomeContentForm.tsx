'use client';

import { useState } from 'react';

import RepeatableList from '@/components/cms/RepeatableList';
import SaveBar from '@/components/cms/SaveBar';
import { useSettingsForm } from '@/components/cms/useSettingsForm';

export interface StatItem {
  value: string;
  label: string;
  note: string;
}

export interface JoinStepItem {
  title: string;
  description: string;
}

interface HomeContentFormProps {
  stats: StatItem[];
  joinSteps: JoinStepItem[];
}

export default function HomeContentForm({
  stats: initialStats,
  joinSteps: initialJoinSteps,
}: HomeContentFormProps) {
  const { saving, error, saved, run, reset, clearMessages } = useSettingsForm();

  const [stats, setStats] = useState<StatItem[]>(initialStats);
  const [joinSteps, setJoinSteps] = useState<JoinStepItem[]>(initialJoinSteps);

  async function handleSave() {
    await run([
      { key: 'stats', value: stats },
      { key: 'join_steps', value: joinSteps },
    ]);
  }

  return (
    <div className="space-y-5">
      <section className="card p-6">
        <h2 className="font-semibold text-slate-900">Statistik</h2>
        <p className="mt-1 text-sm text-slate-500">
          Angka yang tampil pada bagian statistik di bawah hero halaman beranda.
        </p>

        <div className="mt-5">
          <RepeatableList
            items={stats}
            onChange={(items) => {
              clearMessages();
              setStats(items);
            }}
            makeEmpty={() => ({ value: '', label: '', note: '' })}
            addLabel="Tambah statistik"
            renderItem={(item, update) => (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Angka</label>
                    <input
                      className="input"
                      placeholder="155"
                      value={item.value}
                      onChange={(e) => update({ value: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Label</label>
                    <input
                      className="input"
                      placeholder="Negara"
                      value={item.label}
                      onChange={(e) => update({ label: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Keterangan</label>
                  <textarea
                    rows={2}
                    className="input"
                    placeholder="Penjelasan singkat di bawah angka"
                    value={item.note}
                    onChange={(e) => update({ note: e.target.value })}
                  />
                </div>
              </div>
            )}
          />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold text-slate-900">Alur bergabung</h2>
        <p className="mt-1 text-sm text-slate-500">
          Langkah-langkah yang tampil pada halaman Departemen.
        </p>

        <div className="mt-5">
          <RepeatableList
            items={joinSteps}
            onChange={(items) => {
              clearMessages();
              setJoinSteps(items);
            }}
            makeEmpty={() => ({ title: '', description: '' })}
            addLabel="Tambah langkah"
            renderItem={(item, update) => (
              <div className="space-y-3">
                <div>
                  <label className="label">Judul langkah</label>
                  <input
                    className="input"
                    value={item.title}
                    onChange={(e) => update({ title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Penjelasan</label>
                  <textarea
                    rows={2}
                    className="input"
                    value={item.description}
                    onChange={(e) => update({ description: e.target.value })}
                  />
                </div>
              </div>
            )}
          />
        </div>
      </section>

      <div className="card p-5">
        <SaveBar
          saving={saving}
          error={error}
          saved={saved}
          onSave={handleSave}
          onReset={() => reset(['stats', 'join_steps'])}
        />
      </div>
    </div>
  );
}