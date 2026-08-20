import { Character } from '../../types';

interface Props {
  character: Character;
  owned: boolean;
  active: boolean;
  affordable: boolean;
  busy: boolean;
  onBuy: () => void;
  onSelect: () => void;
}

export default function CharacterCard({ character, owned, active, affordable, busy, onBuy, onSelect }: Props) {
  return (
    <li className={`card flex flex-col items-center gap-3 text-center ${active ? 'ring-4 ring-quest-purple' : ''}`}>
      <div
        className={`flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br text-5xl shadow-pop ${character.gradient}`}
        aria-hidden="true"
      >
        {character.emoji}
      </div>
      <h3 className="text-lg font-bold text-ink-900">{character.name}</h3>
      <p className="text-sm text-ink-900/70">{character.description}</p>
      <p className="rounded-xl bg-violet-50 px-3 py-1.5 text-xs font-bold text-quest-purple">
        Perk: {character.perk}
      </p>

      {active && (
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
          Active Character
        </span>
      )}

      {!owned && (
        <button
          onClick={onBuy}
          disabled={!affordable || busy}
          className="btn-gold w-full"
          aria-label={`Buy ${character.name} for ${character.price} coins`}
        >
          {busy ? 'Purchasing…' : character.price === 0 ? 'Free' : `Buy for ${character.price} 🪙`}
        </button>
      )}
      {owned && !active && (
        <button onClick={onSelect} className="btn-outline w-full" disabled={busy}>
          Select as Active
        </button>
      )}
    </li>
  );
}
