export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string | null;
  email: string | null;
  coins: number;
  totalBooksCompleted: number;
  activeCharacterId: string;
  ownedCharacters: string[];
  gameboardPosition: number;
  streak: number;
  lastReadDate: string | null; // yyyy-mm-dd, used to compute streaks
  achievements: Achievement[];
  createdAt: number;
}

export type BookStatus = 'want-to-read' | 'currently-reading' | 'completed';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  genre?: string;
  status: BookStatus;
  addedAt: number;
  completedAt?: number;
  quizPassed?: boolean;
  bestScore?: number;
  attempts?: number;
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  choices: string[]; // exactly 5, "A" - "E"
}

export interface QuizSession {
  id: string;
  bookId: string;
  questions: QuizQuestion[];
  createdAt: number;
  submitted: boolean;
}

export interface QuizResult {
  score: number;
  passed: boolean;
  correctAnswers: number[];
  rewarded: boolean;
  coinsAwarded: number;
}

export interface Character {
  id: string;
  name: string;
  price: number;
  description: string;
  perk: string;
  emoji: string;
  gradient: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  earnedAt: number;
}

export type GameNodeType =
  | 'reading'
  | 'coin'
  | 'challenge'
  | 'mystery'
  | 'milestone'
  | 'locked';

export interface GameNode {
  index: number;
  type: GameNodeType;
  label: string;
}

export interface MovementOption {
  cost: number;
  spaces: number;
  label: string;
}
