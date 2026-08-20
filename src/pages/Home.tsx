import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';
import { CHARACTER_MAP } from '../data/characters';
import { BOARD_LENGTH } from '../data/gameboard';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const { user } = useAuth();
  const { profile, books } = useUserData();
  if (!profile) return null;

  const currentBook = books.find((b) => b.status === 'currently-reading') ?? books.find((b) => b.status === 'want-to-read');
  const character = CHARACTER_MAP[profile.activeCharacterId];
  const level = Math.floor(profile.totalBooksCompleted / 2) + 1;
  const progressPercent = Math.round((profile.gameboardPosition / BOARD_LENGTH) * 100);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-ink-900">
          {greeting()}, {user?.displayName?.split(' ')[0] || 'Reader'}! 👋
        </h1>
        <p className="text-ink-900/70">Here's your BookIt reading journey.</p>
      </div>

      <section aria-label="Reading stats" className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard emoji="📚" value={profile.totalBooksCompleted} label="Books Completed" />
        <StatCard emoji="🔥" value={profile.streak} label="Day Streak" />
        <StatCard emoji="🪙" value={profile.coins} label="Coins" />
        <StatCard emoji="🏆" value={level} label="Level" />
      </section>

      <section className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-quest-purple">Current Book</p>
          {currentBook ? (
            <>
              <h2 className="text-xl font-bold text-ink-900">{currentBook.title}</h2>
              <p className="text-ink-900/70">by {currentBook.author}</p>
            </>
          ) : (
            <p className="text-ink-900/70">Add a book to your list to start your next quest.</p>
          )}
        </div>
        <Link to="/books" className="btn-primary w-full sm:w-auto">
          {currentBook ? 'Continue Reading' : 'Add a Book'}
        </Link>
      </section>

      <section className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-3xl ${character?.gradient}`} aria-hidden="true">
            {character?.emoji}
          </div>
          <div>
            <p className="text-sm text-ink-900/60">Adventuring as</p>
            <p className="text-lg font-bold text-ink-900">{character?.name}</p>
          </div>
        </div>
        <div className="flex-1 sm:mx-8">
          <div className="mb-1 flex justify-between text-sm font-semibold text-ink-900/70">
            <span>Gameboard progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-violet-100" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-gradient-to-r from-quest-purple to-brand-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <Link to="/gameboard" className="btn-outline w-full sm:w-auto">View Gameboard</Link>
      </section>

      <section aria-labelledby="recent-achievements" className="card">
        <h2 id="recent-achievements" className="mb-3 text-lg font-bold text-ink-900">Recent Achievements</h2>
        {profile.achievements.length === 0 ? (
          <p className="text-sm text-ink-900/60">Finish a book quiz to earn your first achievement.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {profile.achievements.slice(-3).reverse().map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-xl bg-violet-50 px-4 py-3">
                <span className="text-2xl" aria-hidden="true">{a.emoji}</span>
                <div>
                  <p className="font-bold text-ink-900">{a.title}</p>
                  <p className="text-sm text-ink-900/70">{a.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatCard({ emoji, value, label }: { emoji: string; value: number; label: string }) {
  return (
    <div className="card items-center text-center">
      <p className="text-2xl" aria-hidden="true">{emoji}</p>
      <p className="text-xl font-extrabold text-ink-900">{value}</p>
      <p className="text-xs font-semibold text-ink-900/60">{label}</p>
    </div>
  );
}
