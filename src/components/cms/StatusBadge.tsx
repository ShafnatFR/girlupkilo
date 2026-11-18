export default function StatusBadge({ published }: { published: unknown }) {
  const isPublished = Boolean(published);

  return (
    <span
      className={`badge ${
        isPublished
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border dark:border-emerald-800/40'
          : 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300'
      }`}
    >
      {isPublished ? 'Tayang' : 'Draft'}
    </span>
  );
}
