import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (displayName: string, email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await ensureUserDocument(firebaseUser);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function ensureUserDocument(firebaseUser: User) {
    const ref = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || 'BookIt Reader',
        photoURL: firebaseUser.photoURL,
        email: firebaseUser.email,
        coins: 0,
        totalBooksCompleted: 0,
        activeCharacterId: 'bookworm',
        ownedCharacters: ['bookworm'],
        gameboardPosition: 0,
        streak: 0,
        lastReadDate: null,
        achievements: [],
        createdAt: serverTimestamp(),
      });
    }
  }

  async function signInWithGoogle() {
    await signInWithPopup(auth, googleProvider);
  }

  async function signUpWithEmail(displayName: string, email: string, password: string) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    await ensureUserDocument({ ...credential.user, displayName } as User);
  }

  async function signInWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logOut() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
