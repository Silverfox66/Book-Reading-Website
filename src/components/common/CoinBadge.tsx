interface Props {
  coins: number;
}

export default function CoinBadge({ coins }: Props) {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full bg-quest-gold/20 px-3 py-1.5 font-display font-bold text-amber-700"
      aria-label={`${coins} BookIt coins`}
    >
      <span aria-hidden="true" className="text-lg">🪙</span>
      <span>{coins.toLocaleString()}</span>
    </div>
  );
}
