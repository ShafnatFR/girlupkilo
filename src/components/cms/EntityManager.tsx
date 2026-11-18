'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { getColumnDefs, getMakeEmpty } from '@/lib/cms/column-defs';

export type CmsRow = Record<string, unknown> & { id: string };

export interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'list';
  required?: boolean;
  /** true bila nilai kosong disimpan sebagai NULL (bukan 0 atau ''). */
  nullable?: boolean;
  options?: { value: string; label: string }[];
  hint?: string;
  placeholder?: string;
  /** Lebar penuh pada grid dua kolom. */
  full?: boolean;
}

export interface ColumnDef {
  key: string;
  label: string;
  className?: string;
  render?: (row: CmsRow) => React.ReactNode;
}

interface EntityManagerProps {
  /** Nama entitas pada /api/cms/{entity}. */
  entity: string;
  /** Label tunggal & jamak untuk teks antarmuka. */
  singular: string;
  plural: string;
  description: string;
  rows: CmsRow[];
  fields: FieldDef[];
}

function toFormValues(fields: FieldDef[], row?: CmsRow): Record<string, unknown> {
  const base: Record<string, unknown> = {};
  for (const field of fields) {
    const raw = row?.[field.name];
    if (field.type === 'list') {
      base[field.name] = Array.isArray(raw)
        ? raw.filter((v): v is string => typeof v === 'string')
        : [];
    } else {
      base[field.name] = raw ?? '';
    }
  }
  return base;
}

/** Ubah nilai form menjadi payload yang dikirim ke API. */
function toPayload(fields: FieldDef[], values: Record<string, unknown>) {
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    const raw = values[field.name];

    switch (field.type) {
      case 'checkbox':
        payload[field.name] = Boolean(raw);
        break;

      case 'number': {
        const text = String(raw ?? '').trim();
        if (text === '') {
          payload[field.name] = field.nullable ? null : 0;
        } else {
          const parsed = Number(text);
          payload[field.name] = Number.isFinite(parsed) ? parsed : 0;
        }
        break;
      }

      case 'list': {
        const items = Array.isArray(raw)
          ? raw
          : String(raw ?? '')
              .split('\n')
              .map((line) => line.trim())
              .filter((line) => line !== '');
        payload[field.name] = items;
        break;
      }

      default: {
        const text = String(raw ?? '').trim();
        payload[field.name] = text === '' && field.nullable ? null : text;
        break;
      }
    }
  }

  return payload;
}

export default function EntityManager({
  entity,
  singular,
  plural,
  description,
  rows,
  fields,
}: EntityManagerProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CmsRow | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState<CmsRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const columns = getColumnDefs(entity);
  const makeEmpty = getMakeEmpty(entity);

  function startCreate() {
    setEditing(null);
    setValues({ ...makeEmpty(), ...toFormValues(fields) });
    setError('');
    setOpen(true);
  }

  function startEdit(row: CmsRow) {
    setEditing(row);
    setValues(toFormValues(fields, row));
    setError('');
    setOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setOpen(false);
    setEditing(null);
    setError('');
  }

  function update(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = toPayload(fields, values);
      const url = editing
        ? `/api/cms/${entity}/${editing.id}`
        : `/api/cms/${entity}`;

      const response = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? 'Gagal menyimpan data');
        return;
      }

      setOpen(false);
      setEditing(null);
      router.refresh();
    } catch {
      setError('Tidak dapat menghubungi server');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row: CmsRow) {
    setDeleting(true);
    setError('');

    try {
      const response = await fetch(`/api/cms/${entity}/${row.id}`, {
        method: 'DELETE',
      });
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(result.error ?? 'Gagal menghapus data');
        setConfirming(null);
        return;
      }

      setConfirming(null);
      router.refresh();
    } catch {
      setError('Tidak dapat menghubungi server');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{plural}</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <button onClick={startCreate} className="btn-primary shrink-0">
          <Plus size={16} />
          Tambah {singular}
        </button>
      </div>

      {error && !open && !confirming && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 dark:border dark:border-rose-800/40">
          {error}
        </div>
      )}

      {/* Tabel */}
      <div className="card overflow-hidden">
        {rows.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
            Belum ada data {plural.toLowerCase()}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700/60 dark:bg-slate-800/60">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 ${
                        column.className ?? ''
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/20">
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-4 py-3 align-top text-slate-700 dark:text-slate-300 ${
                          column.className ?? ''
                        }`}
                      >
                        {column.render
                          ? column.render(row)
                          : String(row[column.key] ?? '')}
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => startEdit(row)}
                          className="rounded-md p-2 text-slate-500 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-slate-400 dark:hover:bg-brand-950/40 dark:hover:text-brand-300"
                          aria-label={`Ubah ${singular}`}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setConfirming(row)}
                          className="rounded-md p-2 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                          aria-label={`Hapus ${singular}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form */}
      {open && (
        <div className="card border-brand-200 p-6 dark:border-brand-800/40">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                {editing ? `Ubah ${singular}` : `Tambah ${singular}`}
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Kolom bertanda * wajib diisi.
              </p>
            </div>
            <button
              onClick={closeForm}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => {
                const value = values[field.name];

                if (field.type === 'checkbox') {
                  return (
                    <label
                      key={field.name}
                      className={`flex items-center gap-3 rounded-lg border border-slate-200 bg-white/50 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-800/40 ${
                        field.full ? 'sm:col-span-2' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => update(field.name, e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600 dark:border-slate-600 dark:bg-slate-700"
                      />
                      <span className="text-sm">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {field.label}
                        </span>
                        {field.hint && (
                          <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                            {field.hint}
                          </span>
                        )}
                      </span>
                    </label>
                  );
                }

                const span = field.full ? 'sm:col-span-2' : '';

                if (field.type === 'select') {
                  return (
                    <div key={field.name} className={span}>
                      <label className="label" htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-red-500"> *</span>}
                      </label>
                      <select
                        id={field.name}
                        className="input"
                        value={String(value ?? '')}
                        onChange={(e) => update(field.name, e.target.value)}
                      >
                        {(field.options ?? []).map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                if (field.type === 'textarea' || field.type === 'list') {
                  return (
                    <div key={field.name} className={span}>
                      <label className="label" htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-red-500"> *</span>}
                      </label>
                      <textarea
                        id={field.name}
                        rows={field.type === 'list' ? 3 : 4}
                        className="input"
                        placeholder={field.placeholder}
                        value={
                          field.type === 'list'
                            ? (Array.isArray(value)
                                ? value.join('\n')
                                : String(value ?? ''))
                            : String(value ?? '')
                        }
                        onChange={(e) => update(field.name, e.target.value)}
                      />
                      {field.hint && (
                        <p className="mt-1 text-xs text-slate-500">{field.hint}</p>
                      )}
                    </div>
                  );
                }

                if (field.type === 'number') {
                  return (
                    <div key={field.name} className={span}>
                      <label className="label" htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-red-500"> *</span>}
                      </label>
                      <input
                        id={field.name}
                        type="number"
                        className="input"
                        placeholder={field.placeholder}
                        value={String(value ?? '')}
                        onChange={(e) => update(field.name, e.target.value)}
                      />
                      {field.hint && (
                        <p className="mt-1 text-xs text-slate-500">{field.hint}</p>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={field.name} className={span}>
                    <label className="label" htmlFor={field.name}>
                      {field.label}
                      {field.required && <span className="text-red-500"> *</span>}
                    </label>
                    <input
                      id={field.name}
                      type="text"
                      className="input"
                      placeholder={field.placeholder}
                      value={String(value ?? '')}
                      onChange={(e) => update(field.name, e.target.value)}
                    />
                    {field.hint && (
                      <p className="mt-1 text-xs text-slate-500">{field.hint}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="btn-secondary"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Konfirmasi hapus */}
      {confirming && (
        <div className="card border-rose-200 bg-rose-50/60 p-5 dark:border-rose-800/40 dark:bg-rose-950/20">
          <h3 className="font-semibold text-rose-900 dark:text-rose-200">
            Hapus {singular} ini?
          </h3>
          <p className="mt-1 text-sm text-rose-700 dark:text-rose-300">
            Data yang sudah dihapus tidak dapat dikembalikan.
          </p>

          {error && <p className="mt-3 text-sm text-rose-700 dark:text-rose-300">{error}</p>}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleDelete(confirming)}
              disabled={deleting}
              className="btn-danger"
            >
              {deleting && <Loader2 size={16} className="animate-spin" />}
              {deleting ? 'Menghapus...' : 'Ya, hapus'}
            </button>
            <button
              onClick={() => setConfirming(null)}
              disabled={deleting}
              className="btn-secondary"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}