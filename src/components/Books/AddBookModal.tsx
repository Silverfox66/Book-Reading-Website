import { FormEvent, useState } from 'react';

interface Props {
  onClose: () => void;
  onAdd: (data: { title: string; author: string; coverUrl: string; genre?: string }) => Promise<void>;
}

export default function AddBookModal({ onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [genre, setGenre] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError('Title and author are required.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onAdd({ title: title.trim(), author: author.trim(), coverUrl: coverUrl.trim(), genre: genre.trim() });
      onClose();
    } catch (err) {
      setError('Could not add the book. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4" role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-book-title"
        className="card w-full max-w-md animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="add-book-title" className="mb-4 text-2xl font-bold text-ink-900">
          Add a Book to Your List
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="book-title" className="mb-1 block text-sm font-bold text-ink-900">
              Title *
            </label>
            <input
              id="book-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border-2 border-violet-100 px-3 py-2 focus:border-quest-purple"
              required
            />
          </div>
          <div>
            <label htmlFor="book-author" className="mb-1 block text-sm font-bold text-ink-900">
              Author *
            </label>
            <input
              id="book-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-xl border-2 border-violet-100 px-3 py-2 focus:border-quest-purple"
              required
            />
          </div>
          <div>
            <label htmlFor="book-cover" className="mb-1 block text-sm font-bold text-ink-900">
              Cover image URL
            </label>
            <input
              id="book-cover"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://…"
              className="w-full rounded-xl border-2 border-violet-100 px-3 py-2 focus:border-quest-purple"
            />
          </div>
          <div>
            <label htmlFor="book-genre" className="mb-1 block text-sm font-bold text-ink-900">
              Genre (optional)
            </label>
            <input
              id="book-genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full rounded-xl border-2 border-violet-100 px-3 py-2 focus:border-quest-purple"
            />
          </div>

          {error && <p role="alert" className="text-sm font-semibold text-rose-600">{error}</p>}

          <div className="mt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Adding…' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
