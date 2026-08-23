import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyDzB2JcDTcchVIaqK3oFydNdfYjetryucw",
  authDomain: "bookit-8fbb1.firebaseapp.com",
  projectId: "bookit-8fbb1",
  storageBucket: "bookit-8fbb1.firebasestorage.app",
  messagingSenderId: "183384430872",
  appId: "1:183384430872:web:05459d5493018d6b1b666d",
  measurementId: "G-SRGXRHV2S9"
};

export const app =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

// Firebase Functions are deployed in us-central1
export const functions = getFunctions(app, 'us-central1');

export const googleProvider = new GoogleAuthProvider();
