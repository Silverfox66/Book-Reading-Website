import { Character } from '../types';

const CHARACTER_DATA = [
  ['page-pilot', 'Page Pilot', 'Navigates every chapter with a perfectly folded map.', 'Reveals the next reading milestone.', '🚀'],
  ['plot-twister', 'Plot Twister', 'Thrives when every prediction turns delightfully upside down.', 'Earns a bonus after a first-attempt pass.', '🌀'],
  ['chapter-chaser', 'Chapter Chaser', 'Always one page ahead and never loses the thread.', 'Adds a small streak bonus each week.', '🏃'],
  ['ink-sprite', 'Ink Sprite', 'A tiny spark of imagination born between the lines.', 'Highlights a new achievement.', '✨'],
  ['bookmark-hero', 'Bookmark Hero', 'Keeps every adventure exactly where you left it.', 'Protects one missed reading day.', '🔖'],
  ['plot-panda', 'Plot Panda', 'Calm, clever, and always ready for one more chapter.', 'Adds 10 coins to the first quiz pass.', '🐼'],
  ['novel-knight', 'Novel Knight', 'Defends great stories with a well-worn hardcover shield.', 'Unlocks milestone badges sooner.', '🛡️'],
  ['rhyme-rider', 'Rhyme Rider', 'Glides through poetry, prose, and every punchy ending.', 'Gains a bonus on genre quests.', '🛹'],
  ['library-lion', 'Library Lion', 'Rules the quietest kingdom with a mighty purr.', 'Adds a coin to each board move.', '🦁'],
  ['mystery-moth', 'Mystery Moth', 'Follows clues from the first page to the final reveal.', 'Improves mystery board rewards.', '🦋'],
  ['shelf-sailor', 'Shelf Sailor', 'Crosses entire bookcases looking for the next horizon.', 'Starts each quest one space ahead.', '⛵'],
  ['epic-eagle', 'Epic Eagle', 'Spots an epic ending from high above the bookshelf.', 'Adds a milestone coin bonus.', '🦅'],
  ['fiction-fox', 'Fiction Fox', 'Cleverly slips into every imagined world.', 'Earns extra coins from fiction genres.', '🦊'],
  ['story-stag', 'Story Stag', 'Carries old legends and new favorites through the forest.', 'Boosts achievement rewards.', '🦌'],
  ['chapter-cat', 'Chapter Cat', 'Pounces on cliffhangers and naps between quests.', 'Reduces one movement cost each week.', '🐈'],
  ['prose-parrot', 'Prose Parrot', 'Remembers every memorable line and colorful character.', 'Adds a quiz preparation hint.', '🦜'],
  ['cover-crab', 'Cover Crab', 'Carries a whole stack of books without dropping one.', 'Increases book list capacity.', '🦀'],
  ['word-wizard', 'Word Wizard', 'Turns tricky vocabulary into a little bit of magic.', 'Adds a vocabulary achievement.', '🧙'],
  ['tome-turtle', 'Tome Turtle', 'Takes the scenic route and finishes every journey.', 'Keeps streaks steady on slow weeks.', '🐢'],
  ['reading-raven', 'Reading Raven', 'Collects curious facts from every dark and bright tale.', 'Adds a lore badge to completed books.', '🐦‍⬛'],
  ['sonnet-swan', 'Sonnet Swan', 'Makes every reading session feel graceful and grand.', 'Boosts poetry rewards.', '🦢'],
  ['book-badger', 'Book Badger', 'Digs deep into stories others might overlook.', 'Adds a deep-read achievement.', '🦡'],
  ['fable-frog', 'Fable Frog', 'Leaps from lesson to lesson with cheerful focus.', 'Adds a small first-book bonus.', '🐸'],
  ['page-panther', 'Page Panther', 'Moves silently through a stack of suspense novels.', 'Boosts thriller rewards.', '🐆'],
  ['classic-corgi', 'Classic Corgi', 'A loyal companion for every timeless favorite.', 'Adds a classic-book badge.', '🐶'],
  ['atlas-owl', 'Atlas Owl', 'Knows exactly where every story belongs.', 'Boosts historical fiction rewards.', '🦉'],
  ['fantasy-ram', 'Fantasy Ram', 'Charges bravely into quests, dragons, and distant realms.', 'Boosts fantasy rewards.', '🐏'],
  ['romance-robin', 'Romance Robin', 'Carries heartfelt stories from shelf to shelf.', 'Boosts romance rewards.', '🐦'],
  ['scifi-shark', 'Sci-Fi Shark', 'Swims through galaxies and never fears the unknown.', 'Boosts science fiction rewards.', '🦈'],
  ['biography-bison', 'Biography Bison', 'Remembers the real lives behind remarkable stories.', 'Boosts biography rewards.', '🦬'],
  ['history-hare', 'History Hare', 'Hops between eras faster than a turning page.', 'Boosts historical reading rewards.', '🐇'],
  ['adventure-alpaca', 'Adventure Alpaca', 'Carries supplies for the longest reading expeditions.', 'Boosts adventure rewards.', '🦙'],
  ['horror-hedgehog', 'Horror Hedgehog', 'Stays brave when the bookshelf gets spooky.', 'Boosts horror rewards.', '🦔'],
  ['comic-chameleon', 'Comic Chameleon', 'Changes color with every panel and punchline.', 'Boosts comic reading rewards.', '🦎'],
  ['drama-dolphin', 'Drama Dolphin', 'Surfs every emotional wave with perfect timing.', 'Boosts drama rewards.', '🐬'],
  ['travel-toucan', 'Travel Toucan', 'Collects passports from imaginary places.', 'Boosts travel reading rewards.', '🦜'],
  ['essay-ibex', 'Essay Ibex', 'Climbs confidently through challenging ideas.', 'Boosts nonfiction rewards.', '🐐'],
  ['memoir-meerkat', 'Memoir Meerkat', 'Keeps watch for honest, unforgettable moments.', 'Boosts memoir rewards.', '🦦'],
  ['verse-viper', 'Verse Viper', 'Strikes at the perfect word with elegant precision.', 'Boosts poetry streaks.', '🐍'],
  ['library-llama', 'Library Llama', 'Carries cozy stories wherever the day wanders.', 'Adds a cozy-reading badge.', '🦙'],
  ['ending-elephant', 'Ending Elephant', 'Never forgets a finale worth talking about.', 'Adds a completion bonus.', '🐘'],
] as const;

const GRADIENTS = [
  'from-cyan-400 to-teal-600',
  'from-pink-400 to-rose-600',
  'from-yellow-400 to-amber-600',
  'from-emerald-400 to-green-700',
];

export const EXTRA_CHARACTERS: Character[] = CHARACTER_DATA.map(
  ([id, name, description, perk, emoji], index) => ({
    id,
    name,
    price: 300 + (index % 8) * 100,
    description,
    perk,
    emoji,
    gradient: GRADIENTS[index % GRADIENTS.length],
  })
);

export const SECRET_CHARACTERS: Character[] = [
  { id: 'moon-archivist', name: 'Moon Archivist', price: 0, description: 'A secret keeper of stories written under moonlight.', perk: 'A rare hidden companion.', emoji: '🌙', gradient: 'from-slate-500 to-indigo-700' },
  { id: 'aurora-fox', name: 'Aurora Fox', price: 0, description: 'A luminous guide through the brightest imagined worlds.', perk: 'A rare hidden companion.', emoji: '🌌', gradient: 'from-cyan-400 to-fuchsia-600' },
  { id: 'golden-griffin', name: 'Golden Griffin', price: 0, description: 'A legendary guardian of the grandest bookshelf.', perk: 'A legendary hidden companion.', emoji: '🦁', gradient: 'from-yellow-400 to-orange-600' },
  { id: 'crystal-dragon', name: 'Crystal Dragon', price: 0, description: 'A legendary reader with pages like polished glass.', perk: 'A legendary hidden companion.', emoji: '🐉', gradient: 'from-fuchsia-400 to-violet-700' },
  { id: 'comet-scribe', name: 'Comet Scribe', price: 0, description: 'Writes new constellations in the margins of every quest.', perk: 'A rare hidden companion.', emoji: '☄️', gradient: 'from-blue-400 to-indigo-700' },
  { id: 'timekeeper-owl', name: 'Timekeeper Owl', price: 0, description: 'Knows when every story is ready to be discovered.', perk: 'A rare hidden companion.', emoji: '⏳', gradient: 'from-amber-400 to-red-600' },
  { id: 'dream-whale', name: 'Dream Whale', price: 0, description: 'Carries entire imaginary oceans between its pages.', perk: 'A legendary hidden companion.', emoji: '🐋', gradient: 'from-sky-400 to-blue-700' },
  { id: 'prism-unicorn', name: 'Prism Unicorn', price: 0, description: 'Leaves a trail of color through every favorite chapter.', perk: 'A legendary hidden companion.', emoji: '🦄', gradient: 'from-pink-400 to-purple-700' },
  { id: 'ember-phoenix', name: 'Ember Phoenix', price: 0, description: 'Returns from every unfinished story with renewed curiosity.', perk: 'A legendary hidden companion.', emoji: '🔥', gradient: 'from-orange-400 to-red-700' },
];
