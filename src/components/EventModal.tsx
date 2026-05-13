import type { PendingEvent } from '../types/GameState';

interface Props {
  event: PendingEvent;
  onChoose: (idx: number) => void;
}

const TONE_BG: Record<string, string> = {
  good: 'from-emerald-400 to-teal-500',
  bad: 'from-rose-400 to-pink-500',
  neutral: 'from-indigo-400 to-violet-500',
  epic: 'from-amber-400 to-orange-500',
};

const RISK_BG: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700',
  med: 'bg-amber-100 text-amber-700',
  high: 'bg-rose-100 text-rose-700',
  epic: 'bg-fuchsia-100 text-fuchsia-700',
};

export function EventModal({ event, onChoose }: Props) {
  const grad = TONE_BG[event.tone] ?? TONE_BG.neutral;
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6">
      <div className="w-full max-w-md card animate-floatUp p-0 overflow-hidden">
        <div className={`bg-gradient-to-br ${grad} p-6 text-white flex items-center gap-3`}>
          <div className="w-14 h-14 rounded-2xl bg-white/20 grid place-items-center text-4xl shadow-inner">
            {event.icon}
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest opacity-80">{event.category}</div>
            <h2 className="text-xl font-extrabold leading-tight">{event.title}</h2>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-slate-700 leading-relaxed">{event.description}</p>
          <div className="space-y-2">
            {event.choices.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => onChoose(idx)}
                className="w-full text-left px-4 py-3 rounded-2xl bg-slate-50 hover:bg-mit-50 border border-slate-200 hover:border-mit-300 transition flex items-center justify-between gap-3"
              >
                <span className="font-bold text-slate-800">{c.label}</span>
                {c.risk && (
                  <span className={`chip ${RISK_BG[c.risk]}`}>
                    {c.risk === 'epic' ? '⚡ epic risk' : `${c.risk} risk`}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
