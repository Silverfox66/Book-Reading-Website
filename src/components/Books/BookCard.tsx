import { Book } from '../../types';

interface Props {
  book: Book;
  onMarkCurrentlyReading: () => void;
  onRemove: () => void;
  onFinishBook: () => void;
}

const STATUS_LABEL: Record<Book['status'], string> = {
  'want-to-read': 'Want to Read',
  'currently-reading': 'Currently Reading',
  completed: 'Completed',
};

const STATUS_STYLE: Record<Book['status'], string> = {
  'want-to-read': 'bg-slate-100 text-slate-600',
  'currently-reading': 'bg-sky-100 text-sky-700',
  completed: 'bg-emerald-100 text-emerald-700',
};

export default function BookCard({ book, onMarkCurrentlyReading, onRemove, onFinishBook }: Props) {
  return (
    <li className="card flex flex-col gap-3 transition-transform hover:-translate-y-1">
      <div className="flex gap-4">
        <div className="h-28 w-20 shrink-0 overflow-hidden rounded-xl bg-violet-100 shadow-inner">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl" aria-hidden="true">
              📕
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="truncate font-display text-lg font-bold text-ink-900">{book.title}</h3>
          <p className="truncate text-sm text-ink-900/70">{book.author}</p>
          {book.genre && (
            <p className="text-xs font-semibold uppercase tracking-wide text-quest-purple/70">{book.genre}</p>
          )}
          <span className={`mt-1 inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLE[book.status]}`}>
            {STATUS_LABEL[book.status]}
          </span>
          {typeof book.bestScore === 'number' && (
            <p className="text-xs text-ink-900/60">Best quiz score: {book.bestScore}/10</p>
          )}
        </div>
      </div>

      <div className="mt-1 flex flex-wrap gap-2">
        {book.status === 'want-to-read' && (
          <button onClick={onMarkCurrentlyReading} className="btn-outline !px-3 !py-2 text-sm">
            Start Reading
          </button>
        )}
        {book.status !== 'completed' && (
          <button
            onClick={onFinishBook}
            className="btn-primary !px-3 !py-2 text-sm"
            aria-label={`Take the finished-book quiz for ${book.title}`}
          >
            ✅ Finished Book
          </button>
        )}
        {book.status === 'completed' && (
          <button onClick={onFinishBook} className="btn-outline !px-3 !py-2 text-sm">
            Retake Quiz
          </button>
        )}
        <button
          onClick={onRemove}
          className="rounded-2xl px-3 py-2 text-sm font-bold text-rose-500 hover:bg-rose-50"
          aria-label={`Remove ${book.title} from reading list`}
        >
          Remove
        </button>
      </div>
    </li>
  );
}
