import { FormEvent, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import BookItLogo from '../common/BookItLogo';

type Mode = 'sign-in' | 'sign-up';

function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with that email already exists. Try signing in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export default function Login() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleGoogleSignIn() {
    setError(null);
    setBusy(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setError('Sign-in did not complete. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === 'sign-up') {
      if (!displayName.trim()) {
        setError('Please enter a display name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setBusy(true);
    try {
      if (mode === 'sign-up') {
        await signUpWithEmail(displayName.trim(), email.trim(), password);
      } else {
        await signInWithEmail(email.trim(), password);
      }
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-quest-violet/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" />

      <main className="card relative z-10 w-full max-w-md animate-pop-in text-center">
        <div className="mb-6 flex justify-center">
          <BookItLogo className="h-20 w-20" />
        </div>
        <h1 className="mb-1 text-4xl font-extrabold text-ink-900">BookIt</h1>
        <p className="mb-6 font-display text-lg font-semibold text-quest-purple">
          Read. Prove it. Level up.
        </p>

        <p className="mb-6 text-sm text-ink-900/70">
          Track your reading list, pass book quizzes, collect characters, and adventure
          across the BookIt gameboard — one finished book at a time.
        </p>

        <button
          onClick={handleGoogleSignIn}
          disabled={busy}
          className="btn-primary w-full text-base"
          aria-label="Sign in with Google to start your BookIt journey"
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-wide text-ink-900/40">
          <span className="h-px flex-1 bg-violet-100" />
          or use email
          <span className="h-px flex-1 bg-violet-100" />
        </div>

        <div role="tablist" aria-label="Choose sign in or sign up" className="mb-5 flex rounded-2xl bg-violet-50 p-1">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sign-in'}
            onClick={() => { setMode('sign-in'); setError(null); }}
            className={`flex-1 rounded-xl py-2 text-sm font-bold transition-colors ${
              mode === 'sign-in' ? 'bg-white text-quest-purple shadow-pop' : 'text-ink-900/60'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'sign-up'}
            onClick={() => { setMode('sign-up'); setError(null); }}
            className={`flex-1 rounded-xl py-2 text-sm font-bold transition-colors ${
              mode === 'sign-up' ? 'bg-white text-quest-purple shadow-pop' : 'text-ink-900/60'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4 text-left">
          {mode === 'sign-up' && (
            <div>
              <label htmlFor="display-name" className="mb-1 block text-sm font-bold text-ink-900">
                Display name
              </label>
              <input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="nickname"
                className="w-full rounded-xl border-2 border-violet-100 px-3 py-2 focus:border-quest-purple"
                required
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-bold text-ink-900">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-xl border-2 border-violet-100 px-3 py-2 focus:border-quest-purple"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-bold text-ink-900">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
              minLength={6}
              className="w-full rounded-xl border-2 border-violet-100 px-3 py-2 focus:border-quest-purple"
              required
            />
          </div>
          {mode === 'sign-up' && (
            <div>
              <label htmlFor="confirm-password" className="mb-1 block text-sm font-bold text-ink-900">
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                className="w-full rounded-xl border-2 border-violet-100 px-3 py-2 focus:border-quest-purple"
                required
              />
            </div>
          )}

          <button type="submit" disabled={busy} className="btn-outline w-full text-base">
            {busy ? 'Please wait…' : mode === 'sign-up' ? 'Create BookIt Account' : 'Sign In'}
          </button>
        </form>

        {error && (
          <p role="alert" className="mt-4 text-sm font-semibold text-rose-600">
            {error}
          </p>
        )}

        <p className="mt-8 text-xs text-ink-900/50">
          Your progress, coins, and collection are securely saved to your BookIt account.
        </p>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.6C29.6 34.9 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C41.9 36 44 30.6 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

