export interface CharacterPack {
  id: string;
  name: string;
  price: number;
  description: string;
  accent: string;
}

export const CHARACTER_PACKS: CharacterPack[] = [
  {
    id: 'starlight-pack',
    name: 'Starlight Pack',
    price: 1500,
    description: 'A sealed pack with one mysterious character from the starlit collection.',
    accent: 'from-indigo-500 to-sky-500',
  },
  {
    id: 'mythic-pack',
    name: 'Mythic Pack',
    price: 2500,
    description: 'A premium pack with one rare character from the hidden mythic collection.',
    accent: 'from-rose-500 to-amber-500',
  },
  {
    id: 'legendary-pack',
    name: 'Legendary Pack',
    price: 4000,
    description: 'The most expensive pack, with one character from the legendary collection.',
    accent: 'from-fuchsia-500 to-orange-500',
  },
];
