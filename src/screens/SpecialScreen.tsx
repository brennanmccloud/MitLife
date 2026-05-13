import type { GameState, PowerFlags } from '../types/GameState';
import { POWERS } from '../data/specialPowers';

interface Props {
  powers: PowerFlags;
  state: GameState;
  onToggle: (id: keyof PowerFlags) => void;
  onRewind: () => void;
}

export function SpecialScreen({ powers, state, onToggle, onRewind }: Props) {
  return (
    <div className="px-3 pb-32 pt-2 space-y-3">
      <div className="card bg-gradient-to-br from-amber-50 to-fuchsia-50 border border-amber-100">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-700">All Unlocked</div>
        <div className="font-extrabold text-slate-800 text-lg">Special Powers</div>
        <p className="text-sm text-slate-600 mt-1">
          Every premium-style power is yours, free forever. Toggle them on or off any time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {POWERS.map((p) => {
          const on = powers[p.id];
          return (
            <div
              key={p.id}
              className={`card flex items-center gap-3 transition ${on ? 'ring-2 ring-mit-300' : 'opacity-80'}`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} grid place-items-center text-3xl shadow-card`}>
                {p.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  {p.name}
                  <span className="chip bg-slate-100 text-slate-600">{p.tag}</span>
                </div>
                <div className="text-[12px] text-slate-600">{p.description}</div>
              </div>
              <button
                onClick={() => onToggle(p.id)}
                className={`relative w-12 h-7 rounded-full transition ${on ? 'bg-mit-500' : 'bg-slate-300'}`}
                aria-pressed={on}
                aria-label={`Toggle ${p.name}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition ${
                    on ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {powers.rewindToken && state.previousCharacter && (
        <button onClick={onRewind} className="pill-btn-violet w-full py-3">
          ⏪ Rewind Last Year
        </button>
      )}
    </div>
  );
}
