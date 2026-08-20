import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../contexts/UserDataContext';
import Nav from './Nav';
import BookItLogo from '../common/BookItLogo';
import CoinBadge from '../common/CoinBadge';
import StreakBadge from '../common/StreakBadge';

export default function AppShell({ children }: { children: ReactNode }) {
  const { logOut } = useAuth();
  const { profile } = useUserData();

  return (
    <div className="min-h-screen md:pl-24 lg:pl-56">
      <a href="#main-content" className="sr-only-focusable fixed left-2 top-2 z-50 rounded-lg bg-white px-4 py-2 font-bold shadow">
        Skip to main content
      </a>
      <Nav />

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-violet-100 bg-white/80 px-4 py-3 backdrop-blur md:px-8">
        <div className="flex items-center gap-2">
          <BookItLogo className="h-9 w-9" withWordmark />
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {profile && (
            <>
              <StreakBadge streak={profile.streak} />
              <CoinBadge coins={profile.coins} />
            </>
          )}
          <button
            onClick={() => logOut()}
            className="btn-outline !px-3 !py-2 text-sm"
            aria-label="Sign out of BookIt"
          >
            Sign out
          </button>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-8 md:pb-10">
        {children}
      </main>
    </div>
  );
}
