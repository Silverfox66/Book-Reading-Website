export default function CompletionAnimation({ coins }: { coins: number }) {
  return (
    <div className="flex flex-col items-center py-6 text-center" role="status" aria-live="assertive">
      <div className="relative mb-4 h-24 w-24 animate-pop-in rounded-full bg-quest-gold/20 flex items-center justify-center">
        <span className="text-5xl">🏆</span>
        <span className="absolute -right-2 -top-2 animate-float-up text-2xl" aria-hidden="true">🪙</span>
        <span className="absolute -left-2 top-0 animate-float-up text-xl" style={{ animationDelay: '0.2s' }} aria-hidden="true">🪙</span>
        <span className="absolute left-4 -top-4 animate-float-up text-xl" style={{ animationDelay: '0.4s' }} aria-hidden="true">✨</span>
      </div>
      <h3 className="text-2xl font-extrabold text-ink-900">Quest Complete!</h3>
      <p className="mt-1 text-lg font-bold text-amber-600">You earned {coins} coins! 🪙</p>
      <p className="mt-2 max-w-xs text-sm text-ink-900/70">
        Your book is marked complete and your gameboard progress has been updated.
      </p>
    </div>
  );
}
