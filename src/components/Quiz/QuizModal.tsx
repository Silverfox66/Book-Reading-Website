import { useEffect, useState } from 'react';
import { Book, QuizQuestion } from '../../types';
import { startQuiz, submitQuiz } from '../../api/gameApi';
import CompletionAnimation from './CompletionAnimation';

interface Props {
  book: Book;
  onClose: () => void;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

type Phase = 'loading' | 'in-progress' | 'submitting' | 'result' | 'error';

export default function QuizModal({ book, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{ score: number; passed: boolean; coinsAwarded: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    void loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadQuiz() {
    setPhase('loading');
    setErrorMsg(null);
    try {
      const res = await startQuiz(book.id);
      setSessionId(res.sessionId);
      setQuestions(res.questions);
      setAnswers([]);
      setCurrent(0);
      setSelected(null);
      setResult(null);
      setPhase('in-progress');
    } catch (err) {
      setErrorMsg('Could not start the quiz. Please try again.');
      setPhase('error');
    }
  }

  function handleContinue() {
    if (selected === null || !sessionId) return;
    const nextAnswers = [...answers, selected];
    setAnswers(nextAnswers);
    setSelected(null);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      void handleSubmit(nextAnswers);
    }
  }

  async function handleSubmit(finalAnswers: number[]) {
    if (!sessionId) return;
    setPhase('submitting');
    try {
      const res = await submitQuiz(book.id, sessionId, finalAnswers);
      setResult({ score: res.score, passed: res.passed, coinsAwarded: res.coinsAwarded });
      setPhase('result');
    } catch (err) {
      setErrorMsg('We could not grade your quiz. Please try again.');
      setPhase('error');
    }
  }

  const question = questions[current];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-title"
        className="card w-full max-w-lg animate-pop-in"
      >
        <div className="mb-2 flex items-center justify-between">
          <h2 id="quiz-title" className="text-xl font-bold text-ink-900">
            {book.title} — Finished Book Quiz
          </h2>
          <button onClick={onClose} aria-label="Close quiz" className="rounded-full p-1 text-2xl leading-none text-ink-900/50 hover:bg-violet-50">
            ×
          </button>
        </div>

        {phase === 'loading' && (
          <p className="py-10 text-center text-ink-900/70" role="status">Preparing your 10-question quiz…</p>
        )}

        {phase === 'error' && (
          <div className="py-6 text-center">
            <p role="alert" className="mb-4 font-semibold text-rose-600">{errorMsg}</p>
            <button onClick={loadQuiz} className="btn-primary">Try Again</button>
          </div>
        )}

        {phase === 'in-progress' && question && (
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-wide text-quest-purple" aria-live="polite">
              Question {current + 1} of {questions.length}
            </p>
            <fieldset>
              <legend className="mb-4 text-lg font-bold text-ink-900">{question.prompt}</legend>
              <div className="flex flex-col gap-2">
                {question.choices.map((choice, i) => (
                  <label
                    key={i}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition-colors ${
                      selected === i ? 'border-quest-purple bg-violet-50' : 'border-violet-100 hover:bg-violet-50/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      className="h-4 w-4 accent-violet-600"
                      checked={selected === i}
                      onChange={() => setSelected(i)}
                    />
                    <span className="font-bold text-quest-purple">{LETTERS[i]}.</span>
                    <span className="text-ink-900">{choice}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-6 flex justify-end">
              <button onClick={handleContinue} disabled={selected === null} className="btn-primary">
                {current + 1 === questions.length ? 'Submit Quiz' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {phase === 'submitting' && (
          <p className="py-10 text-center text-ink-900/70" role="status">Grading your answers…</p>
        )}

        {phase === 'result' && result && (
          <div>
            {result.passed ? (
              <CompletionAnimation coins={result.coinsAwarded} />
            ) : (
              <div className="py-4 text-center">
                <p className="text-5xl" aria-hidden="true">📚</p>
                <h3 className="mt-3 text-xl font-bold text-ink-900">Not quite a pass yet</h3>
                <p className="mt-1 text-ink-900/70">
                  You scored <strong>{result.score}/10</strong>. You need at least 8/10 to complete this quest.
                </p>
                <p className="mt-2 text-sm text-ink-900/60">
                  Review the book and give it another shot — no coins are lost by retrying.
                </p>
              </div>
            )}
            <div className="mt-6 flex justify-end gap-3">
              {!result.passed && (
                <button onClick={loadQuiz} className="btn-primary">Retake Quiz</button>
              )}
              <button onClick={onClose} className="btn-outline">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
