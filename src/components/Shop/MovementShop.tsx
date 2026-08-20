import { MOVEMENT_OPTIONS } from '../../data/gameboard';

interface Props {
  coins: number;
  busyCost: number | null;
  onMove: (cost: number, spaces: number) => void;
}

export default function MovementShop({ coins, busyCost, onMove }: Props) {
  return (
    <div className="card">
      <h2 className="mb-1 text-xl font-bold text-ink-900">Move on the Gameboard</h2>
      <p className="mb-4 text-sm text-ink-900/70">
        Spend coins to advance your character along the BookIt path. Cost is shown before you confirm.
      </p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {MOVEMENT_OPTIONS.map((opt) => {
          const affordable = coins >= opt.cost;
          const busy = busyCost === opt.cost;
          return (
            <li key={opt.cost}>
              <button
                onClick={() => onMove(opt.cost, opt.spaces)}
                disabled={!affordable || busyCost !== null}
                className="btn-primary w-full flex-col !py-4 disabled:opacity-40"
                aria-label={`Spend ${opt.cost} coins to move ${opt.spaces} spaces`}
              >
                <span className="text-2xl">{'🚶'.repeat(Math.min(opt.spaces, 4))}</span>
                <span className="text-sm">{opt.label}</span>
                {busy && <span className="text-xs">Moving…</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
