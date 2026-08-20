import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import AppShell from './components/Layout/AppShell';
import Home from './pages/Home';
import MyBooks from './pages/MyBooks';
import Gameboard from './pages/Gameboard';
import Shop from './pages/Shop';
import Profile from './pages/Profile';

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-quest-purple border-t-transparent" />
        <p className="font-display text-lg text-ink-900">Loading BookIt…</p>
      </div>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Login />;

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<MyBooks />} />
        <Route path="/gameboard" element={<Gameboard />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
