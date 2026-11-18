'use client';

import { useState } from 'react';

import RepeatableList from '@/components/cms/RepeatableList';
import SaveBar from '@/components/cms/SaveBar';
import { useSettingsForm } from '@/components/cms/useSettingsForm';
import { ICON_CHOICES } from '@/lib/cms/icons';

export interface MissionItem {
  title: string;
  description: string;
}

export interface ValueItem {
  title: string;
  id: string;
  description: string;
}

export interface PillarItem {
  title: string;
  description: string;
  icon: string;
}

interface VisionMissionFormProps {
  vision: { statement: string; quote: string };
  missions: MissionItem[];
  values: ValueItem[];
  pillars: PillarItem[];
}

export default function VisionMissionForm({
  vision,
  missions: initialMissions,
  values: initialValues,
  pillars: initialPillars,
}: VisionMissionFormProps) {
  const { saving, error, saved, run, reset, clearMessages } = useSettingsForm();

  const [statement, setStatement] = useState(vision.statement);
  const [quote, setQuote] = useState(vision.quote);
  const [missions, setMissions] = useState<MissionItem[]>(initialMissions);
  const [values, setValues] = useState<ValueItem[]>(initialValues);
  const [pillars, setPillars] = useState<PillarItem[]>(initialPillars);

  async function handleSave() {
    await run([
      { key: 'vision', value: { statement, quote } },
      { key: 'missions', value: missions },
      { key: 'values', value: values },
      { key: 'pillars', value: pillars },
    ]);
  }

  return (
    <div className="space-y-5">
      {/* Visi */}
      <section className="card p-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200">Visi</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Pernyataan utama yang tampil besar pada halaman Visi &amp; Misi.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="visionStatement">
              Pernyataan visi *
            </label>
            <textarea
              id="visionStatement"
              rows={3}
              className="input"
              value={statement}
              onChange={(e) => {
                clearMessages();
                setStatement(e.target.value);
              }}
            />
          </div>
          <div>
            <label className="label" htmlFor="visionQuote">
              Kutipan pendukung
            </label>
            <textarea
              id="visionQuote"
              rows={2}
              className="input"
              value={quote}
              onChange={(e) => {
                clearMessages();
                setQuote(e.target.value);
              }}
            />
          </div>
        </div>
      </section>

      {/* Misi */}
      <section className="card p-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200">Misi</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Daftar misi yang tampil sebagai butir bernomor.
        </p>

        <div className="mt-5">
          <RepeatableList
            items={missions}
            onChange={(items) => {
              clearMessages();
              setMissions(items);
            }}
            makeEmpty={() => ({ title: '', description: '' })}
            addLabel="Tambah misi"
            renderItem={(item, update) => (
              <div className="space-y-3">
                <div>
                  <label className="label">Judul misi</label>
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

      {/* Nilai */}
      <section className="card p-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200">Nilai inti</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Empat nilai yang menjadi kompas organisasi.
        </p>

        <div className="mt-5">
          <RepeatableList
            items={values}
            onChange={(items) => {
              clearMessages();
              setValues(items);
            }}
            makeEmpty={() => ({ title: '', id: '', description: '' })}
            addLabel="Tambah nilai"
            renderItem={(item, update) => (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Nama nilai</label>
                    <input
                      className="input"
                      value={item.title}
                      onChange={(e) => update({ title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Terjemahan</label>
                    <input
                      className="input"
                      value={item.id}
                      onChange={(e) => update({ id: e.target.value })}
                    />
                  </div>
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

      {/* Pilar */}
      <section className="card p-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200">Pilar</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Empat pilar kerja Girl Up yang tampil pada halaman beranda.
        </p>

        <div className="mt-5">
          <RepeatableList
            items={pillars}
            onChange={(items) => {
              clearMessages();
              setPillars(items);
            }}
            makeEmpty={() => ({
              title: '',
              description: '',
              icon: 'sparkles',
            })}
            addLabel="Tambah pilar"
            renderItem={(item, update) => (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Nama pilar</label>
                    <input
                      className="input"
                      value={item.title}
                      onChange={(e) => update({ title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Ikon</label>
                    <select
                      className="input"
                      value={item.icon}
                      onChange={(e) => update({ icon: e.target.value })}
                    >
                      {ICON_CHOICES.map((choice) => (
                        <option key={choice.value} value={choice.value}>
                          {choice.label}
                        </option>
                      ))}
                    </select>
                  </div>
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
          onReset={() => reset(['vision', 'missions', 'values', 'pillars'])}
        />
      </div>
    </div>
  );
}