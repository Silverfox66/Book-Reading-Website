import { useUserData } from '../contexts/UserDataContext';
import { buildBoard, BOARD_LENGTH } from '../data/gameboard';
import BoardPath from '../components/Gameboard/BoardPath';

export default function Gameboard() {
  const { profile } = useUserData();
  if (!profile) return null;

  const nodes = buildBoard(profile.gameboardPosition);
  const percent = Math.round((profile.gameboardPosition / BOARD_LENGTH) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-ink-900">BookIt Gameboard</h1>
        <p className="text-ink-900/70">Your reading journey, one node at a time.</p>
      </div>

      <div className="card">
        <div className="mb-2 flex items-center justify-between text-sm font-bold text-ink-900/70">
          <span>Space {profile.gameboardPosition} of {BOARD_LENGTH}</span>
          <span>{percent}% of the path</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-violet-100" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-gradient-to-r from-quest-purple to-brand-500 transition-all" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <BoardPath nodes={nodes} currentPosition={profile.gameboardPosition} characterId={profile.activeCharacterId} />

      <div className="card">
        <h2 className="mb-2 text-lg font-bold text-ink-900">Legend</h2>
        <ul className="flex flex-wrap gap-4 text-sm text-ink-900/70">
          <li>📖 Reading milestone</li>
          <li>🪙 Coin reward</li>
          <li>⭐ Special challenge</li>
          <li>🎁 Mystery reward</li>
          <li>🏆 Major milestone</li>
          <li>🔒 Locked area</li>
        </ul>
      </div>
    </div>
  );
}
