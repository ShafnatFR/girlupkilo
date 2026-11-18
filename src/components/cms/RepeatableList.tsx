'use client';

import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

interface RepeatableListProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  makeEmpty: () => T;
  renderItem: (
    item: T,
    update: (patch: Partial<T>) => void,
    index: number
  ) => React.ReactNode;
  addLabel: string;
  emptyLabel?: string;
}

/**
 * Editor daftar yang bisa ditambah, dikurangi, dan diurutkan.
 * Dipakai untuk misi, nilai, pilar, statistik, dan langkah pendaftaran.
 */
export default function RepeatableList<T>({
  items,
  onChange,
  makeEmpty,
  renderItem,
  addLabel,
  emptyLabel = 'Belum ada butir.',
}: RepeatableListProps<T>) {
  function updateAt(index: number, patch: Partial<T>) {
    const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange(next);
  }

  function removeAt(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500">
          {emptyLabel}
        </p>
      )}

      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Butir {index + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="rounded-md p-1.5 text-slate-500 hover:bg-white disabled:opacity-30"
                aria-label="Naikkan urutan"
              >
                <ArrowUp size={15} />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                className="rounded-md p-1.5 text-slate-500 hover:bg-white disabled:opacity-30"
                aria-label="Turunkan urutan"
              >
                <ArrowDown size={15} />
              </button>
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                aria-label="Hapus butir"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {renderItem(item, (patch) => updateAt(index, patch), index)}
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, makeEmpty()])}
        className="btn-secondary w-full border-dashed"
      >
        <Plus size={16} />
        {addLabel}
      </button>
    </div>
  );
}