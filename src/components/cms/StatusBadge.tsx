export default function StatusBadge({ published }: { published: unknown }) {
  const isPublished = Boolean(published);

  return (
    <span
      className={`badge ${
        isPublished ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {isPublished ? 'Tayang' : 'Draft'}
    </span>
  );
}