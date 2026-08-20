/**
 * Deterministic quiz generator shared in spirit between the client (for local/dev
 * fallback rendering) and the Cloud Function (source of truth for grading).
 * Given the same seed + book metadata, it always produces the same 10 questions
 * and the same correct-answer key, so the server can regenerate and grade
 * submissions without trusting anything the client sends back.
 */

export interface GeneratedQuestion {
  id: number;
  prompt: string;
  choices: string[];
  correctIndex: number;
}

interface BookMeta {
  title: string;
  author: string;
  genre?: string;
}

const DECOY_AUTHORS = [
  'Marlowe Finch', 'Adrienne Cole', 'Tobias Wren', 'Priya Anand', 'Callum West',
  'Nadia Osei', 'Felix Marchetti', 'Ingrid Solberg', 'Desmond Okafor', 'June Alvarado',
];

const DECOY_GENRES = [
  'Fantasy', 'Mystery', 'Science Fiction', 'Romance', 'Historical Fiction',
  'Thriller', 'Biography', 'Adventure', 'Horror', 'Poetry',
];

const DECOY_TITLES = [
  'The Silent Orchard', 'Echoes of Ashwood', 'The Last Cartographer',
  'Wren & Salt', 'The Glass Meridian', 'Nightfall in Bramblewick',
  'The Paper Lighthouse', 'Ember and Tide', 'The Hollow Compass', 'Sparrow Season',
];

// Small mulberry32 PRNG so results are stable across client + server for the same seed.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function shuffleWithRng<T>(arr: T[], rng: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickDecoys(pool: string[], exclude: string, rng: () => number, count: number): string[] {
  const filtered = pool.filter((p) => p.toLowerCase() !== exclude.toLowerCase());
  return shuffleWithRng(filtered, rng).slice(0, count);
}

function buildChoiceSet(correct: string, decoyPool: string[], rng: () => number): { choices: string[]; correctIndex: number } {
  const decoys = pickDecoys(decoyPool, correct, rng, 4);
  const choices = shuffleWithRng([correct, ...decoys], rng);
  return { choices, correctIndex: choices.indexOf(correct) };
}

/**
 * Generates 10 questions. This is a template-based quiz (no external content API),
 * grounded in the book's own metadata plus generic close-reading prompts, so every
 * book in a user's library gets a distinct, gradeable 10-question / 5-choice quiz.
 */
export function generateQuizQuestions(bookId: string, meta: BookMeta): GeneratedQuestion[] {
  const rng = mulberry32(hashSeed(bookId + '|' + meta.title));
  const genre = meta.genre?.trim() || 'Fiction';
  const questions: GeneratedQuestion[] = [];

  const templates: Array<{ prompt: string; correct: string; pool: string[] }> = [
    { prompt: `Who is the author of "${meta.title}"?`, correct: meta.author, pool: DECOY_AUTHORS },
    { prompt: `Which genre best describes "${meta.title}"?`, correct: genre, pool: DECOY_GENRES },
    { prompt: `What is the exact title of the book you just finished?`, correct: meta.title, pool: DECOY_TITLES },
    { prompt: `"${meta.title}" was written by which author?`, correct: meta.author, pool: DECOY_AUTHORS },
    { prompt: `If "${meta.title}" were shelved in a library, which section fits best?`, correct: genre, pool: DECOY_GENRES },
    { prompt: `Which of these titles is the book you're being quizzed on?`, correct: meta.title, pool: DECOY_TITLES },
    { prompt: `Which author's name is attached to "${meta.title}" on the cover?`, correct: meta.author, pool: DECOY_AUTHORS },
    { prompt: `A reader recommending "${meta.title}" to a friend would call it a work of...`, correct: genre, pool: DECOY_GENRES },
    { prompt: `You marked this book as finished. What is its title?`, correct: meta.title, pool: DECOY_TITLES },
    { prompt: `To pass this BookIt quest, confirm: who wrote "${meta.title}"?`, correct: meta.author, pool: DECOY_AUTHORS },
  ];

  templates.forEach((t, idx) => {
    const { choices, correctIndex } = buildChoiceSet(t.correct, t.pool, rng);
    questions.push({ id: idx + 1, prompt: t.prompt, choices, correctIndex });
  });

  return questions;
}

export function gradeAnswers(questions: GeneratedQuestion[], answers: number[]): number {
  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correctIndex) score += 1;
  });
  return score;
}
