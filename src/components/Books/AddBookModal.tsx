import { FormEvent, useEffect, useState } from 'react';
import { BookSearchResult, searchBooksByTitle } from '../../api/booksApi';

interface Props {
  onClose: () => void;
  onAdd: (data: {
    title: string;
    author: string;
    coverUrl: string;
    genre?: string;
  }) => Promise<void>;
}

export default function AddBookModal({ onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [genre, setGenre] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      if (title.trim().length < 2) {
        setResults([]);
        return;
      }

      setSearching(true);

      try {
        const searchResults = await searchBooksByTitle(
          title,
          controller.signal
        );

        setResults(searchResults);
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Book search failed:', err);
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearching(false);
        }
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [title]);

  function selectBook(book: BookSearchResult) {
    setTitle(book.title);
    setAuthor(book.author);
    setCoverUrl(book.coverUrl);
    setGenre(book.genre);
    setResults([]);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      setError('Title and author are required.');
      return;
    }

    if (saving) return;

    setSaving(true);
    setError(null);

    const bookData = {
      title: title.trim(),
      author: author.trim(),
      coverUrl: coverUrl.trim(),
      genre: genre.trim(),
    };

    try {
      await onAdd(bookData);

      // Close the popup after the book has successfully been added
      onClose();
    } catch (err) {
      console.error('Could not add book:', err);
      setError('Could not add the book. Please try again.');
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-book-title"
        className="card w-full max-w-md animate-pop-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="add-book-title"
          className="mb-4 text-2xl font-bold text-ink-900"
        >
          Add a Book to Your List
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="book-title"
              className="mb-1 block text-sm font-bold text-ink-900"
            >
              Title *
            </label>

            <input
              id="book-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border-2 border-violet-100 px-3 py-2 focus:border-quest-purple"
              required
            />

            {searching && (
              <p
                className="mt-1 text-xs text-ink-900/60"
                role="status"
              >
                Searching the book catalog…
              </p>
            )}

            {!searching && results.length > 0 && (
              <ul
                className="mt-2 max-h-64 overflow-y-auto rounded-xl border-2 border-violet-100 bg-white shadow-lg"
                aria-label="Book search results"
              >
                {results.map((book) => (
                  <li key={book.id}>
                    <button
                      type="button"
                      onClick={() => selectBook(book)}
                      className="flex w-full items-center gap-3 border-b border-violet-50 px-3 py-2 text-left last:border-0 hover:bg-violet-50"
                    >
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt=""
                          className="h-12 w-8 rounded object-cover"
                        />
                      ) : (
                        <span
                          className="flex h-12 w-8 items-center justify-center rounded bg-violet-100"
                          aria-hidden="true"
                        >
                          📕
                        </span>
                      )}

                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-ink-900">
                          {book.title}
                        </span>

                        <span className="block truncate text-xs text-ink-900/60">
                          {book.author}
                          {book.publishedYear
                            ? ` · ${book.publishedYear}`
                            : ''}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label
              htmlFor="book-author"
              className="mb-1 block text-sm font-bold text-ink-900"
            >
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
            <label
              htmlFor="book-cover"
              className="mb-1 block text-sm font-bold text-ink-900"
            >
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
            <label
              htmlFor="book-genre"
              className="mb-1 block text-sm font-bold text-ink-900"
            >
              Genre (optional)
            </label>

            <input
              id="book-genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full rounded-xl border-2 border-violet-100 px-3 py-2 focus:border-quest-purple"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="text-sm font-semibold text-rose-600"
            >
              {error}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="btn-outline"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Adding…' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
