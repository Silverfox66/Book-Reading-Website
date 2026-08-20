import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { Book, BookStatus, UserProfile } from '../types';

interface UserDataContextValue {
  profile: UserProfile | null;
  books: Book[];
  loading: boolean;
  addBook: (data: { title: string; author: string; coverUrl: string; genre?: string }) => Promise<void>;
  updateBookStatus: (bookId: string, status: BookStatus) => Promise<void>;
  removeBook: (bookId: string) => Promise<void>;
  setActiveCharacter: (characterId: string) => Promise<void>;
}

const UserDataContext = createContext<UserDataContextValue | undefined>(undefined);

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setBooks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubProfile = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) setProfile(snap.data() as UserProfile);
      setLoading(false);
    });
    const booksQuery = query(collection(db, 'users', user.uid, 'books'), orderBy('addedAt', 'desc'));
    const unsubBooks = onSnapshot(booksQuery, (snap) => {
      setBooks(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Book));
    });
    return () => {
      unsubProfile();
      unsubBooks();
    };
  }, [user]);

  async function addBook(data: { title: string; author: string; coverUrl: string; genre?: string }) {
    if (!user) return;
    await addDoc(collection(db, 'users', user.uid, 'books'), {
      title: data.title,
      author: data.author,
      coverUrl: data.coverUrl || '',
      genre: data.genre || '',
      status: 'want-to-read' as BookStatus,
      addedAt: Date.now(),
    });
  }

  async function updateBookStatus(bookId: string, status: BookStatus) {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'books', bookId), { status });
  }

  async function removeBook(bookId: string) {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'books', bookId));
  }

  async function setActiveCharacter(characterId: string) {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), { activeCharacterId: characterId });
  }

  return (
    <UserDataContext.Provider
      value={{ profile, books, loading, addBook, updateBookStatus, removeBook, setActiveCharacter }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error('useUserData must be used within UserDataProvider');
  return ctx;
}
