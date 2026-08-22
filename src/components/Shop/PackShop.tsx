import { CharacterPack } from '../../data/packs';

interface Props {
  packs: CharacterPack[];
  coins: number;
  busyPack: string | null;
  onOpen: (packId: string) => void;
}

export default function PackShop({ packs, coins, busyPack, onOpen }: Props) {
  return (
    <section aria-labelledby="packs-heading">
      <div className="mb-4">
        <h2 id="packs-heading" className="text-xl font-bold text-ink-900">Secret Character Packs</h2>
        <p className="text-sm text-ink-900/70">Open a pack to reveal one hidden character. Every opening is server-verified.</p>
      </div>
      <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {packs.map((pack) => {
          const busy = busyPack === pack.id;
          return (
            <li key={pack.id} className="card flex flex-col gap-4 overflow-hidden p-0">
              <div className={`bg-gradient-to-br p-6 text-center text-6xl ${pack.accent}`} aria-hidden="true">?</div>
              <div className="flex flex-1 flex-col gap-3 p-5 pt-0">
                <div>
                  <h3 className="text-lg font-bold text-ink-900">{pack.name}</h3>
                  <p className="text-sm text-ink-900/70">{pack.description}</p>
                </div>
                <button
                  onClick={() => onOpen(pack.id)}
                  disabled={coins < pack.price || busy || busyPack !== null}
                  className="btn-gold mt-auto w-full"
                  aria-label={`Open ${pack.name} for ${pack.price} coins`}
                >
                  {busy ? 'Opening…' : `Open for ${pack.price} 🪙`}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
