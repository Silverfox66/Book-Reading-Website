import { GameNode, GameNodeType, MovementOption } from '../types';

export const BOARD_LENGTH = 60;

const NODE_ICONS: Record<GameNodeType, string> = {
  reading: '📖',
  coin: '🪙',
  challenge: '⭐',
  mystery: '🎁',
  milestone: '🏆',
  locked: '🔒',
};

function nodeTypeFor(index: number): GameNodeType {
  if (index % 15 === 0) return 'milestone';
  if (index % 7 === 0) return 'mystery';
  if (index % 5 === 0) return 'challenge';
  if (index % 3 === 0) return 'coin';
  return 'reading';
}

export function buildBoard(unlockedUpTo: number): GameNode[] {
  const nodes: GameNode[] = [];
  for (let i = 0; i <= BOARD_LENGTH; i++) {
    const type = i > unlockedUpTo + 3 ? 'locked' : nodeTypeFor(i);
    nodes.push({
      index: i,
      type,
      label: i === 0 ? 'Start' : i === BOARD_LENGTH ? 'BookIt Champion' : `Space ${i}`,
    });
  }
  return nodes;
}

export const NODE_ICON = NODE_ICONS;

export const MOVEMENT_OPTIONS: MovementOption[] = [
  { cost: 50, spaces: 1, label: '50 coins → Move 1 space' },
  { cost: 100, spaces: 2, label: '100 coins → Move 2 spaces' },
  { cost: 200, spaces: 4, label: '200 coins → Move 4 spaces' },
];
