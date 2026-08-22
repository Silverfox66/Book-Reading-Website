import { useState } from 'react';
import { useUserData } from '../contexts/UserDataContext';
import { CHARACTERS, EXTRA_CHARACTERS, SECRET_CHARACTERS } from '../data/characters';
import { CHARACTER_PACKS } from '../data/packs';
import CharacterCard from '../components/Shop/CharacterCard';
import MovementShop from '../components/Shop/MovementShop';
import PackShop from '../components/Shop/PackShop';
import { openCharacterPack, purchaseCharacter, moveOnBoard } from '../api/gameApi';

export default function Shop() {
  const { profile, setActiveCharacter } = useUserData();
  const [busyCharacter, setBusyCharacter] = useState<string | null>(null);
  const [busyMoveCost, setBusyMoveCost] = useState<number | null>(null);
  const [busyPack, setBusyPack] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!profile) return null;

  async function handleBuy(characterId: string) {
    setError(null);
    setFeedback(null);
    setBusyCharacter(characterId);
    try {
      await purchaseCharacter(characterId);
      setFeedback('Character purchased! 🎉');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Purchase failed. Please try again.';
      setError(message || 'Purchase failed. Please try again.');
    } finally {
      setBusyCharacter(null);
    }
  }

  async function handleMove(cost: number, spaces: number) {
    setError(null);
    setFeedback(null);
    setBusyMoveCost(cost);
    try {
      await moveOnBoard(cost, spaces);
      setFeedback(`Your character moved ${spaces} space${spaces > 1 ? 's' : ''} forward!`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Move failed. Please try again.';
      setError(message || 'Move failed. Please try again.');
    } finally {
      setBusyMoveCost(null);
    }
  }

  async function handleOpenPack(packId: string) {
    setError(null);
    setFeedback(null);
    setBusyPack(packId);
    try {
      const result = await openCharacterPack(packId);
      const character = SECRET_CHARACTERS.find((item) => item.id === result.characterId);
      setFeedback(`You revealed ${character?.name || 'a secret character'}! 🎉`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Pack opening failed. Please try again.';
      setError(message || 'Pack opening failed. Please try again.');
    } finally {
      setBusyPack(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-ink-900">BookIt Shop</h1>
        <p className="text-ink-900/70">Spend your coins on new characters and gameboard progress.</p>
      </div>

      <div role="status" aria-live="polite">
        {feedback && <p className="rounded-xl bg-emerald-50 px-4 py-2 font-semibold text-emerald-700">{feedback}</p>}
        {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-2 font-semibold text-rose-600">{error}</p>}
      </div>

      <MovementShop coins={profile.coins} busyCost={busyMoveCost} onMove={handleMove} />

      <PackShop packs={CHARACTER_PACKS} coins={profile.coins} busyPack={busyPack} onOpen={handleOpenPack} />

      <section aria-labelledby="characters-heading">
        <h2 id="characters-heading" className="mb-4 text-xl font-bold text-ink-900">Characters</h2>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...CHARACTERS, ...EXTRA_CHARACTERS].map((c) => (
            <CharacterCard
              key={c.id}
              character={c}
              owned={profile.ownedCharacters.includes(c.id)}
              active={profile.activeCharacterId === c.id}
              affordable={profile.coins >= c.price}
              busy={busyCharacter === c.id}
              onBuy={() => handleBuy(c.id)}
              onSelect={() => setActiveCharacter(c.id)}
            />
          ))}
        </ul>
      </section>

      {profile.ownedCharacters.some((id) => SECRET_CHARACTERS.some((character) => character.id === id)) && (
        <section aria-labelledby="secret-characters-heading">
          <h2 id="secret-characters-heading" className="mb-4 text-xl font-bold text-ink-900">Revealed Secret Characters</h2>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SECRET_CHARACTERS.filter((c) => profile.ownedCharacters.includes(c.id)).map((c) => (
              <CharacterCard
                key={c.id}
                character={c}
                owned
                active={profile.activeCharacterId === c.id}
                affordable={false}
                busy={false}
                onBuy={() => undefined}
                onSelect={() => setActiveCharacter(c.id)}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
