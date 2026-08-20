import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';
import { CHARACTER_MAP } from '../data/characters';
import CoinBadge from '../components/common/CoinBadge';
import StreakBadge from '../components/common/StreakBadge';

export default function Profile() {
  const { user } = useAuth();
  const { profile, books } = useUserData();
  if (!profile) return null;

  const character = CHARACTER_MAP[profile.activeCharacterId];
  const completed = books.filter((b) => b.status === 'completed');

  return (
    <div className="flex flex-col gap-6">
      <div className="card flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
        {user?.photoURL ? (
          <img src={user.photoURL} alt={`${profile.displayName}'s profile picture`} className="h-20 w-20 rounded-full object-cover shadow-pop" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-3xl" aria-hidden="true">👤</div>
        )}
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900">{profile.displayName}</h1>
          <p className="text-ink-900/60">{profile.email}</p>
          <div className="mt-2 flex justify-center gap-2 sm:justify-start">
            <StreakBadge streak={profile.streak} />
            <CoinBadge coins={profile.coins} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Books Completed" value={profile.totalBooksCompleted} emoji="📚" />
        <Stat label="Reading Streak" value={`${profile.streak} days`} emoji="🔥" />
        <Stat label="Gameboard Position" value={profile.gameboardPosition} emoji="🗺️" />
        <Stat label="Coins" value={profile.coins} emoji="🪙" />
      </div>

      <div className="card flex items-center gap-4">
        <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-3xl ${character?.gradient}`} aria-hidden="true">
          {character?.emoji}
        </div>
        <div>
          <p className="text-sm text-ink-900/60">Current Character</p>
          <p className="text-lg font-bold text-ink-900">{character?.name}</p>
          <p className="text-sm text-ink-900/70">{character?.perk}</p>
        </div>
      </div>

      <section className="card" aria-labelledby="achievements-heading">
        <h2 id="achievements-heading" className="mb-3 text-xl font-bold text-ink-900">Achievements</h2>
        {profile.achievements.length === 0 ? (
          <p className="text-sm text-ink-900/60">Complete quizzes and reach milestones to earn achievements.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {profile.achievements.slice().reverse().map((a) => (
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

      <section className="card" aria-labelledby="completed-heading">
        <h2 id="completed-heading" className="mb-3 text-xl font-bold text-ink-900">Completed Books</h2>
        {completed.length === 0 ? (
          <p className="text-sm text-ink-900/60">No completed books yet — finish a quiz to see it here.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {completed.map((b) => (
              <li key={b.id} className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                {b.title}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, emoji }: { label: string; value: string | number; emoji: string }) {
  return (
    <div className="card items-center text-center">
      <p className="text-2xl" aria-hidden="true">{emoji}</p>
      <p className="text-xl font-extrabold text-ink-900">{value}</p>
      <p className="text-xs font-semibold text-ink-900/60">{label}</p>
    </div>
  );
}
