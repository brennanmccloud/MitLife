import { useState } from 'react';
import type { Character } from '../types/Character';
import { ActionCard } from '../components/ActionCard';
import { Modal } from '../components/Modal';
import { ActionResult, ASSET_CATALOG, buyAsset, sellAsset } from '../game/actions';

interface Props {
  character: Character;
  onAction: (mutator: (c: Character) => ActionResult) => void;
}

const KIND_ICON: Record<string, string> = {
  house: '🏠',
  car: '🚗',
  jewelry: '💎',
  business: '🏢',
  plane: '✈️',
  boat: '🛥️',
  stock: '📈',
  crypto: '🪙',
};

export function AssetsScreen({ character: c, onAction }: Props) {
  const [shopOpen, setShopOpen] = useState(false);
  return (
    <div className="px-3 pb-32 pt-2 space-y-3">
      <div className="card">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Assets</div>
        {c.assets.length === 0 ? (
          <p className="text-sm text-slate-500 mt-2">You don't own anything yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 mt-2">
            {c.assets.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-3xl">{KIND_ICON[a.kind] ?? '📦'}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-slate-800 text-sm truncate">{a.name}</div>
                  <div className="text-[11px] text-slate-500">
                    value ${a.value.toLocaleString()}
                    {a.yield ? ` · $${a.yield.toLocaleString()}/mo` : ''}
                  </div>
                </div>
                <button onClick={() => onAction((cc) => sellAsset(cc, a.id))} className="px-3 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                  Sell
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ActionCard icon="🛍️" label="Asset Marketplace" sub="Buy houses, cars, businesses…" tone="amber" onClick={() => setShopOpen(true)} />

      {shopOpen && (
        <Modal title="Marketplace" onClose={() => setShopOpen(false)} size="lg">
          <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
            {ASSET_CATALOG.map((t, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-3xl">{t.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-slate-800 text-sm">{t.name}</div>
                  <div className="text-[11px] text-slate-500">${t.price.toLocaleString()}{t.yield ? ` · $${t.yield}/mo` : ''}</div>
                </div>
                <button
                  disabled={c.cash < t.price}
                  onClick={() => { onAction((cc) => buyAsset(cc, t)); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold ${c.cash < t.price ? 'bg-slate-200 text-slate-500' : 'bg-mit-500 text-white'}`}
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
