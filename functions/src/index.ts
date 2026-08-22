import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { randomBytes, randomInt, randomUUID } from 'crypto';
import { generateQuizQuestions, gradeAnswers } from './quizEngine.js';
import { CHARACTER_PACKS, CHARACTER_PRICES, MOVEMENT_OPTIONS, BOARD_LENGTH, QUIZ_REWARD_COINS, BOOKWORM_BONUS_COINS } from './catalog.js';

initializeApp();
const db = getFirestore();

const PASSING_SCORE = 8;
const MAX_ACTIVE_ATTEMPTS_PER_BOOK = 20; // generous cap to prevent abuse without blocking honest retries

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const diffMs = new Date(a + 'T00:00:00Z').getTime() - new Date(b + 'T00:00:00Z').getTime();
  return Math.round(diffMs / 86400000);
}

/**
 * Starts a new quiz attempt for a book the caller owns. Generates 10 questions
 * server-side (with a random per-session salt) and stores the answer key in a
 * private subcollection the client cannot read or write to directly.
 */
export const startQuiz = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Sign in required.');

  const bookId = String(request.data?.bookId || '');
  if (!bookId) throw new HttpsError('invalid-argument', 'bookId is required.');

  const bookRef = db.doc(`users/${uid}/books/${bookId}`);
  const bookSnap = await bookRef.get();
  if (!bookSnap.exists) throw new HttpsError('not-found', 'Book not found in your reading list.');
  const book = bookSnap.data()!;

  const attempts = book.attempts || 0;
  if (attempts >= MAX_ACTIVE_ATTEMPTS_PER_BOOK) {
    throw new HttpsError('resource-exhausted', 'Too many quiz attempts for this book.');
  }

  const sessionSalt = randomBytes(16).toString('hex');
  const questions = generateQuizQuestions(bookId, sessionSalt, {
    title: book.title,
    author: book.author,
    genre: book.genre,
  });

  const sessionId = randomUUID();
  await db.doc(`users/${uid}/quizSessions/${sessionId}`).set({
    bookId,
    sessionSalt,
    submitted: false,
    createdAt: Timestamp.now(),
  });

  return {
    sessionId,
    attemptsSoFar: attempts,
    questions: questions.map((q) => ({ id: q.id, prompt: q.prompt, choices: q.choices })),
  };
});

/**
 * Grades a submitted quiz by regenerating the same questions from the stored
 * session salt (never trusting a client-supplied score), then atomically awards
 * the one-time 100-coin reward the first time a book is passed.
 */
export const submitQuiz = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Sign in required.');

  const bookId = String(request.data?.bookId || '');
  const sessionId = String(request.data?.sessionId || '');
  const answers = request.data?.answers;
  if (!bookId || !sessionId || !Array.isArray(answers) || answers.length !== 10) {
    throw new HttpsError('invalid-argument', 'A completed set of 10 answers is required.');
  }

  const sessionRef = db.doc(`users/${uid}/quizSessions/${sessionId}`);
  const bookRef = db.doc(`users/${uid}/books/${bookId}`);
  const userRef = db.doc(`users/${uid}`);

  return db.runTransaction(async (tx) => {
    const [sessionSnap, bookSnap, userSnap] = await Promise.all([
      tx.get(sessionRef),
      tx.get(bookRef),
      tx.get(userRef),
    ]);

    if (!sessionSnap.exists) throw new HttpsError('not-found', 'Quiz session not found.');
    const session = sessionSnap.data()!;
    if (session.bookId !== bookId) throw new HttpsError('failed-precondition', 'Session does not match book.');
    if (session.submitted) throw new HttpsError('failed-precondition', 'This quiz session was already submitted.');

    if (!bookSnap.exists) throw new HttpsError('not-found', 'Book not found.');
    const book = bookSnap.data()!;
    if (!userSnap.exists) throw new HttpsError('not-found', 'User profile not found.');
    const user = userSnap.data()!;

    const questions = generateQuizQuestions(bookId, session.sessionSalt, {
      title: book.title,
      author: book.author,
      genre: book.genre,
    });
    const score = gradeAnswers(questions, answers as number[]);
    const passed = score >= PASSING_SCORE;

    tx.update(sessionRef, { submitted: true, score, submittedAt: Timestamp.now() });

    const alreadyRewarded = book.quizPassed === true;
    let coinsAwarded = 0;

    if (passed) {
      const bestScore = Math.max(book.bestScore || 0, score);
      tx.update(bookRef, {
        status: 'completed',
        quizPassed: true,
        bestScore,
        attempts: FieldValue.increment(1),
        completedAt: alreadyRewarded ? book.completedAt : Timestamp.now(),
      });

      if (!alreadyRewarded) {
        // One-time reward: only paid out the first time this specific book passes.
        coinsAwarded = QUIZ_REWARD_COINS;
        if (user.activeCharacterId === 'bookworm') coinsAwarded += BOOKWORM_BONUS_COINS;

        const today = todayKey();
        let newStreak = 1;
        if (user.lastReadDate) {
          const gap = daysBetween(today, user.lastReadDate);
          if (gap === 0) newStreak = user.streak || 1;
          else if (gap === 1) newStreak = (user.streak || 0) + 1;
          else newStreak = 1;
        }

        const newAchievements = [...(user.achievements || [])];
        newAchievements.push({
          id: randomUUID(),
          title: 'Quest Complete!',
          description: `Finished "${book.title}" and earned ${coinsAwarded} coins.`,
          emoji: '🏆',
          earnedAt: Date.now(),
        });
        if (newStreak > 0 && newStreak % 7 === 0) {
          newAchievements.push({
            id: randomUUID(),
            title: `${newStreak}-Day Streak!`,
            description: 'Consistent reading is paying off.',
            emoji: '🔥',
            earnedAt: Date.now(),
          });
        }

        const newPosition = Math.min(BOARD_LENGTH, (user.gameboardPosition || 0) + 1);

        tx.update(userRef, {
          coins: FieldValue.increment(coinsAwarded),
          totalBooksCompleted: FieldValue.increment(1),
          gameboardPosition: newPosition,
          streak: newStreak,
          lastReadDate: today,
          achievements: newAchievements,
        });
      }
    } else {
      tx.update(bookRef, { bestScore: Math.max(book.bestScore || 0, score), attempts: FieldValue.increment(1) });
    }

    return {
      score,
      passed,
      correctAnswers: questions.map((q) => q.correctIndex),
      rewarded: passed && !alreadyRewarded,
      coinsAwarded,
    };
  });
});

/**
 * Purchases a character using server-verified pricing, atomically deducting
 * coins and adding it to the caller's owned-characters list.
 */
export const purchaseCharacter = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Sign in required.');

  const characterId = String(request.data?.characterId || '');
  const def = CHARACTER_PRICES[characterId];
  if (!def) throw new HttpsError('invalid-argument', 'Unknown character.');

  const userRef = db.doc(`users/${uid}`);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    if (!snap.exists) throw new HttpsError('not-found', 'User profile not found.');
    const user = snap.data()!;
    const owned: string[] = user.ownedCharacters || [];

    if (owned.includes(characterId)) throw new HttpsError('already-exists', 'You already own this character.');
    if ((user.coins || 0) < def.price) throw new HttpsError('failed-precondition', 'Not enough coins.');

    const newCoins = (user.coins || 0) - def.price;
    const newOwned = [...owned, characterId];
    tx.update(userRef, { coins: newCoins, ownedCharacters: newOwned });

    return { ok: true as const, coins: newCoins, ownedCharacters: newOwned };
  });
});

/** Opens a premium pack and atomically awards one random unowned hidden character. */
export const openCharacterPack = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Sign in required.');

  const packId = String(request.data?.packId || '');
  const pack = CHARACTER_PACKS[packId];
  if (!pack) throw new HttpsError('invalid-argument', 'Unknown character pack.');

  const userRef = db.doc(`users/${uid}`);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    if (!snap.exists) throw new HttpsError('not-found', 'User profile not found.');
    const user = snap.data()!;
    const owned: string[] = user.ownedCharacters || [];
    const available = pack.characterIds.filter((id) => !owned.includes(id));

    if (available.length === 0) throw new HttpsError('already-exists', 'You already own every character in this pack.');
    if ((user.coins || 0) < pack.price) throw new HttpsError('failed-precondition', 'Not enough coins.');

    const characterId = available[randomInt(available.length)];
    tx.update(userRef, {
      coins: (user.coins || 0) - pack.price,
      ownedCharacters: [...owned, characterId],
    });

    return { ok: true as const, coins: (user.coins || 0) - pack.price, characterId };
  });
});

/**
 * Moves the caller's character forward on the gameboard. The (cost, spaces)
 * pair is re-validated against the server catalog so a client cannot request
 * extra spaces for a discounted cost.
 */
export const moveOnBoard = onCall(async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError('unauthenticated', 'Sign in required.');

  const cost = Number(request.data?.cost);
  const option = MOVEMENT_OPTIONS.find((o) => o.cost === cost);
  if (!option) throw new HttpsError('invalid-argument', 'Invalid movement option.');

  const userRef = db.doc(`users/${uid}`);
  return db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    if (!snap.exists) throw new HttpsError('not-found', 'User profile not found.');
    const user = snap.data()!;

    if ((user.coins || 0) < option.cost) throw new HttpsError('failed-precondition', 'Not enough coins.');

    const newCoins = (user.coins || 0) - option.cost;
    const newPosition = Math.min(BOARD_LENGTH, (user.gameboardPosition || 0) + option.spaces);
    tx.update(userRef, { coins: newCoins, gameboardPosition: newPosition });

    return { ok: true as const, coins: newCoins, gameboardPosition: newPosition };
  });
});
