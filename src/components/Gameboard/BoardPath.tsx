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

  return (
    <div className="flex flex-col gap-8 rounded-3xl bg-gradient-to-b from-violet-100 via-white to-orange-50 p-6 md:p-10">
      {rows.map((row, rowIdx) => {
        const reversed = rowIdx % 2 === 1;
        const displayRow = reversed ? [...row].reverse() : row;
        return (
          <div key={rowIdx} className={`flex items-center justify-between gap-2 ${reversed ? 'flex-row-reverse' : ''}`}>
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
  );
}
