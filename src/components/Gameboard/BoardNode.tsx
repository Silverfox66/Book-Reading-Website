import { GameNode } from '../../types';
import { NODE_ICON } from '../../data/gameboard';
import { CHARACTER_MAP } from '../../data/characters';

interface Props {
  node: GameNode;
  isCurrent: boolean;
  characterId?: string;
}

const TYPE_STYLE: Record<string, string> = {
  reading: 'bg-sky-100 border-sky-400 text-sky-700',
  coin: 'bg-amber-100 border-amber-400 text-amber-700',
  challenge: 'bg-violet-100 border-violet-400 text-violet-700',
  mystery: 'bg-rose-100 border-rose-400 text-rose-700',
  milestone: 'bg-gradient-to-br from-quest-gold to-brand-500 border-amber-500 text-white',
  locked: 'bg-slate-100/90 border-slate-300 text-slate-400 grayscale',
};

export default function BoardNode({ node, isCurrent, characterId }: Props) {
  const character = characterId ? CHARACTER_MAP[characterId] : undefined;
  return (
    <div className="relative flex min-w-0 flex-col items-center gap-1">
      {isCurrent && character && (
        <div
          className="absolute -top-11 animate-pop-in text-3xl drop-shadow md:-top-12 md:text-4xl"
          aria-hidden="true"
          title={character.name}
        >
          {character.emoji}
        </div>
      )}
      <div
        className={`flex aspect-square w-11 items-center justify-center rounded-2xl border-4 text-lg font-bold shadow-pop transition-transform sm:w-14 sm:text-xl ${
          TYPE_STYLE[node.type]
        } ${isCurrent ? 'scale-110 ring-4 ring-quest-purple ring-offset-2' : ''}`}
        role="img"
        aria-label={`${node.label}: ${node.type} node${isCurrent ? ', your current position' : ''}`}
      >
        <span aria-hidden="true">{NODE_ICON[node.type]}</span>
      </div>
      <span className="text-[10px] font-bold text-ink-900/50">{node.index}</span>
    </div>
  );
}
