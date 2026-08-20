import { useMemo, useState } from 'react';
import { useUserData } from '../contexts/UserDataContext';
import BookCard from '../components/Books/BookCard';
import AddBookModal from '../components/Books/AddBookModal';
import QuizModal from '../components/Quiz/QuizModal';
import { Book, BookStatus } from '../types';

const COLUMNS: { status: BookStatus; title: string; emoji: string }[] = [
  { status: 'want-to-read', title: 'Want to Read', emoji: '📝' },
  { status: 'currently-reading', title: 'Currently Reading', emoji: '📖' },
  { status: 'completed', title: 'Completed', emoji: '🏆' },
];

export default function MyBooks() {
  const { books, addBook, updateBookStatus, removeBook } = useUserData();
  const [showAdd, setShowAdd] = useState(false);
  const [quizBook, setQuizBook] = useState<Book | null>(null);

  const grouped = useMemo(() => {
    const map: Record<BookStatus, Book[]> = { 'want-to-read': [], 'currently-reading': [], completed: [] };
    for (const b of books) map[b.status].push(b);
    return map;
  }, [books]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-ink-900">My Books</h1>
          <p className="text-ink-900/70">Build your BookIt reading list and start your next quest.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          + Add Book
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {COLUMNS.map((col) => (
          <section key={col.status} aria-labelledby={`col-${col.status}`}>
            <h2 id={`col-${col.status}`} className="mb-3 flex items-center gap-2 text-lg font-bold text-ink-900">
              <span aria-hidden="true">{col.emoji}</span> {col.title}
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-quest-purple">
                {grouped[col.status].length}
              </span>
            </h2>
            {grouped[col.status].length === 0 ? (
              <p className="rounded-2xl border-2 border-dashed border-violet-200 p-6 text-center text-sm text-ink-900/50">
                No books here yet.
              </p>
            ) : (
              <ul className="flex flex-col gap-4">
                {grouped[col.status].map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onMarkCurrentlyReading={() => updateBookStatus(book.id, 'currently-reading')}
                    onRemove={() => removeBook(book.id)}
                    onFinishBook={() => setQuizBook(book)}
                  />
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      {showAdd && <AddBookModal onClose={() => setShowAdd(false)} onAdd={addBook} />}
      {quizBook && <QuizModal book={quizBook} onClose={() => setQuizBook(null)} />}
    </div>
  );
}
