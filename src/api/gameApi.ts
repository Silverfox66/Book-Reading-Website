import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import { QuizQuestion, QuizResult } from '../types';

interface StartQuizResponse {
  sessionId: string;
  questions: QuizQuestion[];
  attemptsSoFar: number;
}

interface SubmitQuizResponse extends QuizResult {}

interface PurchaseCharacterResponse {
  ok: true;
  coins: number;
  ownedCharacters: string[];
}

interface MoveResponse {
  ok: true;
  coins: number;
  gameboardPosition: number;
}

/**
 * All reward-affecting actions go through callable Cloud Functions backed by the
 * Admin SDK, so a user can never edit their own coins / position / completed
 * books directly through the client SDK (Firestore rules also block those writes).
 */
export const startQuiz = async (bookId: string) => {
  const fn = httpsCallable<{ bookId: string }, StartQuizResponse>(functions, 'startQuiz');
  const res = await fn({ bookId });
  return res.data;
};

export const submitQuiz = async (bookId: string, sessionId: string, answers: number[]) => {
  const fn = httpsCallable<{ bookId: string; sessionId: string; answers: number[] }, SubmitQuizResponse>(
    functions,
    'submitQuiz'
  );
  const res = await fn({ bookId, sessionId, answers });
  return res.data;
};

export const purchaseCharacter = async (characterId: string) => {
  const fn = httpsCallable<{ characterId: string }, PurchaseCharacterResponse>(functions, 'purchaseCharacter');
  const res = await fn({ characterId });
  return res.data;
};

export const moveOnBoard = async (cost: number, spaces: number) => {
  const fn = httpsCallable<{ cost: number; spaces: number }, MoveResponse>(functions, 'moveOnBoard');
  const res = await fn({ cost, spaces });
  return res.data;
};
