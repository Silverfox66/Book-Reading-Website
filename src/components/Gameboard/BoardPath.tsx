import { GameNode } from '../../types';
import BoardNode from './BoardNode';

interface Props {
  nodes: GameNode[];
  currentPosition: number;
  characterId: string;
}

const PER_ROW = 5;

export default function BoardPath({ nodes, currentPosition, characterId }: Props) {
  const rows: GameNode[][] = [];
  for (let i = 0; i < nodes.length; i += PER_ROW) {
    rows.push(nodes.slice(i, i + PER_ROW));
  }

  const mapHeight = rows.length * 100;
  const routePoints = rows.flatMap((row, rowIdx) => {
    const xPositions = [100, 300, 500, 700, 900];
    const rowPoints = xPositions.map((x) => ({ x, y: 50 + rowIdx * 100 }));
    return rowIdx % 2 === 1 ? rowPoints.reverse() : rowPoints;
  });
  const routePath = routePoints.reduce((path, point, pointIdx) => {
    if (pointIdx === 0) return `M ${point.x} ${point.y}`;
    const previous = routePoints[pointIdx - 1];
    if (previous.y === point.y) return `${path} L ${point.x} ${point.y}`;
    const direction = point.x > previous.x ? 1 : -1;
    return `${path} C ${previous.x + direction * 80} ${previous.y + 35}, ${point.x - direction * 80} ${point.y - 35}, ${point.x} ${point.y}`;
  }, '');

  return (
    <div className="relative overflow-hidden rounded-[2rem] border-8 border-white bg-[#dff2d2] p-3 shadow-card md:p-5">
      <div className="relative overflow-hidden rounded-[1.5rem] border-2 border-emerald-900/10 bg-[#b9dfa8] px-3 py-5 md:px-8 md:py-8">
        <div className="pointer-events-none absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#79b776 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="relative z-10 mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-950/60">The Great Reading Trail</p>
            <h2 className="font-display text-2xl font-extrabold text-emerald-950 md:text-3xl">Journey to BookIt Peak</h2>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-white bg-white/80 text-2xl shadow-md" aria-label="Map compass">🧭</div>
        </div>

        <div className="relative">
          <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full" viewBox={`0 0 1000 ${mapHeight}`} preserveAspectRatio="none" aria-hidden="true">
            <path d={routePath} fill="none" stroke="#fff7d6" strokeWidth="72" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
            <path d={routePath} fill="none" stroke="#c98951" strokeWidth="44" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10 14" />
          </svg>

          <div className="pointer-events-none absolute left-2 top-6 z-10 text-3xl opacity-80 md:left-8" aria-hidden="true">🌲</div>
          <div className="pointer-events-none absolute right-2 top-[28%] z-10 text-3xl opacity-80 md:right-8" aria-hidden="true">⛰️</div>
          <div className="pointer-events-none absolute left-2 top-[58%] z-10 text-3xl opacity-80 md:left-8" aria-hidden="true">🌻</div>
          <div className="pointer-events-none absolute right-2 top-[82%] z-10 text-3xl opacity-80 md:right-8" aria-hidden="true">🌲</div>

          <div className="relative z-20 flex flex-col gap-10 py-2 md:gap-10">
            {rows.map((row, rowIdx) => {
              const reversed = rowIdx % 2 === 1;
              const displayRow = reversed ? [...row].reverse() : row;
              return (
                <div key={rowIdx} className="grid grid-cols-5 items-center gap-0">
                  {displayRow.map((node) => (
                    <BoardNode
                      key={node.index}
                      node={node}
                      isCurrent={node.index === currentPosition}
                      characterId={node.index === currentPosition ? characterId : undefined}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 mt-6 flex items-center justify-between rounded-2xl border border-emerald-900/10 bg-white/65 px-4 py-3 text-sm font-bold text-emerald-950/70">
          <span>🏕️ Start Camp</span>
          <span className="hidden sm:inline">Follow the trail, finish books, earn your way upward.</span>
          <span>🏰 BookIt Peak</span>
        </div>
      </div>
    </div>
  );
}
