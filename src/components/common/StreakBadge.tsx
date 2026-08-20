interface Props {
  streak: number;
}

export default function StreakBadge({ streak }: Props) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1.5 font-display font-bold text-rose-600"
      aria-label={`${streak} day reading streak`}
    >
      <span aria-hidden="true" className="text-lg">🔥</span>
      <span>{streak}</span>
    </div>
  );
}
