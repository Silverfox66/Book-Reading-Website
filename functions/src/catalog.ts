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

const EXTRA_CHARACTER_IDS = [
  'page-pilot', 'plot-twister', 'chapter-chaser', 'ink-sprite', 'bookmark-hero',
  'plot-panda', 'novel-knight', 'rhyme-rider', 'library-lion', 'mystery-moth',
  'shelf-sailor', 'epic-eagle', 'fiction-fox', 'story-stag', 'chapter-cat',
  'prose-parrot', 'cover-crab', 'word-wizard', 'tome-turtle', 'reading-raven',
  'sonnet-swan', 'book-badger', 'fable-frog', 'page-panther', 'classic-corgi',
  'atlas-owl', 'fantasy-ram', 'romance-robin', 'scifi-shark', 'biography-bison',
  'history-hare', 'adventure-alpaca', 'horror-hedgehog', 'comic-chameleon', 'drama-dolphin',
  'travel-toucan', 'essay-ibex', 'memoir-meerkat', 'verse-viper', 'library-llama',
  'ending-elephant',
];

EXTRA_CHARACTER_IDS.forEach((id, index) => {
  CHARACTER_PRICES[id] = { id, price: 300 + (index % 8) * 100 };
});

export const CHARACTER_PACKS: Record<string, { price: number; characterIds: string[] }> = {
  'starlight-pack': {
    price: 1500,
    characterIds: ['moon-archivist', 'aurora-fox', 'comet-scribe'],
  },
  'mythic-pack': {
    price: 2500,
    characterIds: ['golden-griffin', 'crystal-dragon', 'timekeeper-owl'],
  },
  'legendary-pack': {
    price: 4000,
    characterIds: ['dream-whale', 'prism-unicorn', 'ember-phoenix'],
  },
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
