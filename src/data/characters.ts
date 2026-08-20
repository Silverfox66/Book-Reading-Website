import { Character } from '../types';

export const CHARACTERS: Character[] = [
  {
    id: 'bookworm',
    name: 'Bookworm',
    price: 0,
    description: 'A cozy, curious companion who never puts a book down. The default BookIt hero.',
    perk: 'Earns a +5 coin bonus after every passed quiz.',
    emoji: '🐛',
    gradient: 'from-lime-400 to-emerald-500',
  },
  {
    id: 'speed-reader',
    name: 'Speed Reader',
    price: 250,
    description: 'A blur of turning pages, always racing to "The End" first.',
    perk: 'Unlocks the "Sprint" movement option on the gameboard.',
    emoji: '⚡️',
    gradient: 'from-sky-400 to-blue-600',
  },
  {
    id: 'scholar',
    name: 'Scholar',
    price: 400,
    description: 'Wise and meticulous, the Scholar rereads every plot twist twice.',
    perk: 'Gains one free quiz retry per book without waiting.',
    emoji: '🎓',
    gradient: 'from-violet-400 to-purple-700',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    price: 600,
    description: 'Charts new territory on every quest, map and compass in hand.',
    perk: 'Unlocks special hidden areas of the gameboard.',
    emoji: '🧭',
    gradient: 'from-amber-400 to-orange-600',
  },
];

export const CHARACTER_MAP = Object.fromEntries(CHARACTERS.map((c) => [c.id, c]));
