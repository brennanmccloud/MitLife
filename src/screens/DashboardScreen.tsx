import type { Character } from '../types/Character';
import { CharacterAvatar } from '../components/CharacterAvatar';
import { StatBar } from '../components/StatBar';
import { netWorth } from '../game/actions';

interface Props {
  character: Character;
}

const TONE_ACCENT: Record<string, string> = {
  birth: '#10b981',
  family: '#f43f5e',
  school: '#3b82f6',
  friend: '#f59e0b',
  love: '#ec4899',
  baby: '#d946ef',
  job: '#8b5cf6',
  money: '#14b8a6',
  asset: '#f59e0b',
  health: '#22c55e',
  crime: '#ef4444',
  prison: '#64748b',
  fame: '#eab308',
  business: '#6366f1',
  chaos: '#f97316',
  death: '#475569',
};

function stageOf(age: number): string {
  if (age < 1) return 'Newborn';
  if (age < 4) return 'Toddler';
  if (age < 13) return 'Child';
  if (age < 20) return 'Teen';
  if (age < 35) return 'Young Adult';
  if (age < 55) return 'Adult';
  if (age < 75) return 'Senior';
  return 'Elder';
}

export function DashboardScreen({ character: c }: Props) {
  const nw = netWorth(c);
  const partner = c.relationships.find((r) => r.role === 'spouse' || r.role === 'partner');
  const heroStatus = c.prison.inPrison
    ? `🔒 Incarcerated · ${c.prison.yearsRemaining}y left`
    : c.job?.title
    ? `💼 ${c.job.title}`
    : c.education.level !== 'none'
    ? c.education.level === 'college'
      ? `🎓 Studying ${c.education.major ?? 'College'}`
      : c.education.level === 'grad'
      ? `🎓 Grad School — ${c.education.major}`
      : `🎒 ${c.education.level} school`
    : c.age >= 65
    ? '🏖️ Retired'
    : c.age >= 18
    ? '🌫️ Unemployed'
    : '🎈 Growing up';

  return (
    <div className="px-3 pb-32 pt-3 space-y-3">
      {/* === HERO === */}
      <div className="card hero-aurora p-5 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-2)]">
        <div className="flex items-center gap-4 relative z-10">
          <div className="rounded-3xl bg-[var(--surface-3)] p-1 glow-ring shrink-0">
            <CharacterAvatar look={c.avatar} age={c.age} size={96} bg="lilac" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-soft">
              <span className="px-1.5 py-0.5 rounded-full bg-[var(--surface-3)] text-[color:var(--accent)]">
                Gen {c.generation}
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-[var(--surface-3)]">{stageOf(c.age)}</span>
            </div>
            <div className="font-black text-xl truncate mt-1">
              {c.firstName} {c.lastName}
            </div>
            <div className="text-xs text-mute flex items-center gap-1.5 mt-0.5">
              <span>{c.countryFlag}</span>
              <span>{c.country}</span>
            </div>
            <div className="text-sm font-bold mt-1.5">{heroStatus}</div>
            {partner && (
              <div className="text-xs text-soft mt-0.5">💞 with {partner.name}</div>
            )}
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-widest text-mute">Age</div>
            <div className="text-4xl font-black leading-none mt-0.5 bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent-2)] bg-clip-text text-transparent">
              {c.age}
            </div>
          </div>
        </div>
      </div>

      {/* === STATS === */}
      <div className="card">
        <SectionHeading icon="✨" label="Stats" />
        <div className="space-y-3 mt-2">
          <StatBar label="Happiness" value={c.core.happiness} icon="😊" color="bg-gradient-to-r from-amber-300 to-amber-500" />
          <StatBar label="Health" value={c.core.health} icon="❤️" color="bg-gradient-to-r from-rose-300 to-rose-500" />
          <StatBar label="Intelligence" value={c.core.intelligence} icon="🧠" color="bg-gradient-to-r from-violet-300 to-violet-500" />
          <StatBar label="Appearance" value={c.core.appearance} icon="✨" color="bg-gradient-to-r from-pink-300 to-pink-500" />
          {c.extra.fame > 0 && (
            <StatBar label="Fame" value={c.extra.fame} icon="🌟" color="bg-gradient-to-r from-yellow-300 to-orange-400" />
          )}
          {c.extra.notoriety > 0 && (
            <StatBar label="Notoriety" value={c.extra.notoriety} icon="🦹" color="bg-gradient-to-r from-rose-500 to-rose-700" />
          )}
          {c.extra.respect > 0 && (
            <StatBar label="Respect" value={c.extra.respect} icon="👑" color="bg-gradient-to-r from-amber-400 to-amber-600" />
          )}
          {c.extra.business > 0 && (
            <StatBar label="Business" value={c.extra.business} icon="📈" color="bg-gradient-to-r from-emerald-400 to-emerald-600" />
          )}
        </div>
      </div>

      {/* === MONEY === */}
      <div className="grid grid-cols-2 gap-2">
        <MoneyCard label="Bank" value={`$${c.cash.toLocaleString()}`} tint="from-teal-400 to-cyan-500" icon="🏦" />
        <MoneyCard label="Net Worth" value={`$${nw.toLocaleString()}`} tint="from-violet-400 to-fuchsia-500" icon="💎" />
        <MoneyCard label="Salary" value={`$${(c.job?.salary ?? 0).toLocaleString()}`} tint="from-amber-400 to-orange-500" icon="💰" />
        <MoneyCard label="Debt" value={`$${c.debt.toLocaleString()}`} tint="from-rose-400 to-pink-500" icon="💳" />
      </div>

      {/* === JOURNAL === */}
      <div className="card">
        <SectionHeading icon="📖" label="Life Journal" sub={`${c.journal.length} memories`} />
        <ul className="timeline mt-3 space-y-2 max-h-[44vh] overflow-y-auto scroll-no-bar pr-1">
          {[...c.journal].reverse().map((j) => (
            <li key={j.id} className="relative pl-10">
              <div
                className="absolute left-2 top-2 w-7 h-7 rounded-full grid place-items-center text-base shadow-card"
                style={{ background: TONE_ACCENT[j.type] ?? 'var(--surface-3)', color: '#fff' }}
              >
                <span>{j.icon}</span>
              </div>
              <div className="card-2 py-2 px-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-mute">Age {j.age}</div>
                <div className="text-sm font-medium">{j.text}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SectionHeading({ icon, label, sub }: { icon: string; label: string; sub?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <div className="text-xs font-bold uppercase tracking-widest text-mute flex items-center gap-1.5">
        <span className="text-base leading-none">{icon}</span>
        {label}
      </div>
      {sub && <div className="text-[11px] text-mute">{sub}</div>}
    </div>
  );
}

function MoneyCard({ label, value, tint, icon }: { label: string; value: string; tint: string; icon: string }) {
  return (
    <div className="card relative overflow-hidden">
      <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${tint} opacity-25 blur-2xl`} />
      <div className="flex items-center gap-2">
        <span className="text-xl leading-none">{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-mute">{label}</span>
      </div>
      <div className="font-black text-lg tabular-nums mt-1">{value}</div>
    </div>
  );
}
