export interface CharacterDef {
  id: string;
  price: number;
}

// Server-side source of truth for prices, so a client can never spoof a lower
// price than what is actually configured for a character.
export const CHARACTER_PRICES: Record<string, CharacterDef> = {
  bookworm: { id: 'bookworm', price: 0 },
  'speed-reader': { id: 'speed-reader', price: 250 },
  scholar: { id: 'scholar', price: 400 },
  explorer: { id: 'explorer', price: 600 },
};

export interface MovementOptionDef {
  cost: number;
  spaces: number;
}

export const MOVEMENT_OPTIONS: MovementOptionDef[] = [
  { cost: 50, spaces: 1 },
  { cost: 100, spaces: 2 },
  { cost: 200, spaces: 4 },
];

export const BOARD_LENGTH = 60;
export const QUIZ_REWARD_COINS = 100;
export const BOOKWORM_BONUS_COINS = 5;
