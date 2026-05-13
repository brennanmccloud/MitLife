interface Props {
  icon: string;
  label: string;
  sub?: string;
  onClick?: () => void;
  disabled?: boolean;
  locked?: boolean;
  tone?: 'mit' | 'plum' | 'rose' | 'amber' | 'emerald' | 'slate';
}

const TONES: Record<NonNullable<Props['tone']>, string> = {
  mit: 'from-mit-100 to-mit-200',
  plum: 'from-fuchsia-100 to-plum-200',
  rose: 'from-rose-100 to-pink-200',
  amber: 'from-amber-100 to-orange-200',
  emerald: 'from-emerald-100 to-teal-200',
  slate: 'from-slate-100 to-slate-200',
};

export function ActionCard({ icon, label, sub, onClick, disabled, locked, tone = 'mit' }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || locked}
      className={`relative text-left p-3 rounded-2xl bg-gradient-to-br ${TONES[tone]} shadow-card border border-white/40 transition active:scale-95 ${
        (disabled || locked) ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:shadow-pop'
      }`}
    >
      <div className="text-3xl leading-none">{icon}</div>
      <div className="mt-2 font-extrabold text-slate-800 text-sm leading-tight">{label}</div>
      {sub && <div className="text-[11px] text-slate-600 mt-0.5">{sub}</div>}
      {locked && (
        <div className="absolute top-2 right-2 text-base" title="Locked by age">
          🔒
        </div>
      )}
    </button>
  );
}
