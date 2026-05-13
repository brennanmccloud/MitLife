import type { Character } from '../types/Character';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { legacyTitle, netWorth } from '../game/actions';

interface Props {
  character: Character;
  onNewLife: () => void;
  onContinueChild: () => void;
}

export function DeathScreen({ character: c, onNewLife, onContinueChild }: Props) {
  const heir = c.relationships.find((r) => r.role === 'child' && r.alive);
  const title = c.legacyTitle ?? legacyTitle(c);
  const nw = netWorth(c);
  return (
    <div className="min-h-[100dvh] flex flex-col bg-gradient-to-b from-slate-100 to-slate-300">
      <div className="px-6 pt-12 pb-4 text-center">
        <div className="text-5xl mb-3">🕯️</div>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-500">In Memory Of</div>
        <h2 className="text-3xl font-black text-slate-800 mt-1">{c.firstName} {c.lastName}</h2>
        <div className="text-sm text-slate-600 mt-1">Born → Age {c.age} · {c.countryFlag} {c.country}</div>
      </div>
      <div className="px-4 space-y-3">
        <div className="card flex items-center gap-3">
          <CharacterAvatar look={{ ...c.avatar, accessory: 'none' }} age={c.age} size={80} />
          <div className="flex-1">
            <div className="text-xs font-bold uppercase text-slate-500 tracking-wider">Cause of death</div>
            <div className="font-extrabold text-slate-800">{c.causeOfDeath ?? 'Unknown'}</div>
            <div className="mt-1 text-xs text-slate-500">Legacy title</div>
            <div className="font-extrabold text-amber-700">⭐ {title}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stat label="Net Worth" value={`$${nw.toLocaleString()}`} />
          <Stat label="Career" value={c.job?.title ?? '—'} />
          <Stat label="Fame" value={`${Math.round(c.extra.fame)}`} />
          <Stat label="Crimes" value={`${c.crimes.length}`} />
          <Stat label="Spouse" value={c.relationships.find((r) => r.role === 'spouse')?.name ?? '—'} />
          <Stat label="Children" value={`${c.relationships.filter((r) => r.role === 'child').length}`} />
        </div>

        <div className="card">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Final Words from the Journal</div>
          <ul className="space-y-1.5 max-h-[28vh] overflow-y-auto scroll-no-bar">
            {c.journal.slice(-8).reverse().map((j) => (
              <li key={j.id} className="flex items-start gap-2 text-sm">
                <span>{j.icon}</span>
                <span className="text-slate-700"><span className="text-slate-400 font-bold">Age {j.age}:</span> {j.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 px-4 pt-3 pb-5 bg-gradient-to-t from-slate-300 via-slate-300/95 to-transparent space-y-2">
        {heir && (
          <button onClick={onContinueChild} className="pill-btn-violet w-full py-3">
            🧬 Continue as {heir.name}
          </button>
        )}
        <button onClick={onNewLife} className="pill-btn-primary w-full py-3">
          🌱 Start a New Life
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card text-center">
      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{label}</div>
      <div className="font-extrabold text-slate-800 truncate">{value}</div>
    </div>
  );
}
