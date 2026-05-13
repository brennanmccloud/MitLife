import type { Character } from '../types/Character';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { StatBar } from '../components/StatBar';
import { netWorth } from '../game/actions';

interface Props {
  character: Character;
}

const TONE_COLOR: Record<string, string> = {
  birth: 'border-emerald-300 bg-emerald-50',
  family: 'border-rose-200 bg-rose-50',
  school: 'border-sky-200 bg-sky-50',
  friend: 'border-amber-200 bg-amber-50',
  love: 'border-pink-200 bg-pink-50',
  baby: 'border-fuchsia-200 bg-fuchsia-50',
  job: 'border-violet-200 bg-violet-50',
  money: 'border-teal-200 bg-teal-50',
  asset: 'border-amber-200 bg-amber-50',
  health: 'border-emerald-200 bg-emerald-50',
  crime: 'border-rose-300 bg-rose-50',
  prison: 'border-slate-300 bg-slate-100',
  fame: 'border-yellow-300 bg-yellow-50',
  business: 'border-indigo-200 bg-indigo-50',
  chaos: 'border-orange-200 bg-orange-50',
  death: 'border-slate-400 bg-slate-100',
};

export function DashboardScreen({ character: c }: Props) {
  const nw = netWorth(c);
  const partner = c.relationships.find((r) => r.role === 'spouse' || r.role === 'partner');
  const status = c.prison.inPrison
    ? `Incarcerated · ${c.prison.yearsRemaining}y left`
    : c.job?.title ?? c.status;
  return (
    <div className="px-3 pb-32 pt-2 space-y-3">
      {/* Character card */}
      <div className="card flex items-center gap-3 bg-gradient-to-br from-white to-mit-50">
        <div className="rounded-2xl bg-white shadow-card p-1">
          <CharacterAvatar look={c.avatar} age={c.age} size={84} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold uppercase tracking-wider text-mit-600">Gen {c.generation}</div>
          <div className="font-extrabold text-xl text-slate-800 truncate">{c.firstName} {c.lastName}</div>
          <div className="text-xs text-slate-500">Age {c.age} · {c.countryFlag} {c.country}</div>
          <div className="mt-1 text-xs text-slate-700 font-bold">{status}</div>
          <div className="mt-1 text-xs text-slate-500">{partner ? `💞 with ${partner.name}` : '💔 single'}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="card space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Stats</div>
        <StatBar label="Happiness" value={c.core.happiness} icon="😊" color="bg-amber-400" />
        <StatBar label="Health" value={c.core.health} icon="❤️" color="bg-rose-400" />
        <StatBar label="Intelligence" value={c.core.intelligence} icon="🧠" color="bg-violet-400" />
        <StatBar label="Appearance" value={c.core.appearance} icon="✨" color="bg-pink-400" />
        {c.extra.fame > 0 && <StatBar label="Fame" value={c.extra.fame} icon="🌟" color="bg-yellow-400" />}
        {c.extra.notoriety > 0 && <StatBar label="Notoriety" value={c.extra.notoriety} icon="🦹" color="bg-rose-600" />}
        {c.extra.respect > 0 && <StatBar label="Respect" value={c.extra.respect} icon="👑" color="bg-amber-500" />}
        {c.extra.business > 0 && <StatBar label="Business" value={c.extra.business} icon="📈" color="bg-emerald-500" />}
      </div>

      {/* Money */}
      <div className="grid grid-cols-2 gap-2">
        <div className="card bg-gradient-to-br from-teal-100 to-mit-100">
          <div className="text-[10px] font-bold uppercase text-teal-700 tracking-wider">Bank</div>
          <div className="font-extrabold text-slate-800 text-lg tabular-nums">${c.cash.toLocaleString()}</div>
        </div>
        <div className="card bg-gradient-to-br from-violet-100 to-fuchsia-100">
          <div className="text-[10px] font-bold uppercase text-violet-700 tracking-wider">Net Worth</div>
          <div className="font-extrabold text-slate-800 text-lg tabular-nums">${nw.toLocaleString()}</div>
        </div>
        <div className="card bg-gradient-to-br from-amber-100 to-orange-100">
          <div className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">Salary</div>
          <div className="font-extrabold text-slate-800 text-lg tabular-nums">
            ${(c.job?.salary ?? 0).toLocaleString()}
          </div>
        </div>
        <div className="card bg-gradient-to-br from-rose-100 to-pink-100">
          <div className="text-[10px] font-bold uppercase text-rose-700 tracking-wider">Debt</div>
          <div className="font-extrabold text-slate-800 text-lg tabular-nums">${c.debt.toLocaleString()}</div>
        </div>
      </div>

      {/* Life journal */}
      <div className="card">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Life Journal</div>
        <ul className="space-y-1.5 max-h-[42vh] overflow-y-auto scroll-no-bar">
          {[...c.journal].reverse().map((j) => (
            <li
              key={j.id}
              className={`flex items-start gap-2 p-2 rounded-xl border ${TONE_COLOR[j.type] ?? 'border-slate-200 bg-slate-50'}`}
            >
              <div className="text-xl leading-none">{j.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-slate-500 font-bold">Age {j.age}</div>
                <div className="text-sm text-slate-800">{j.text}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
