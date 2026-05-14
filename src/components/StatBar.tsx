interface Props {
  label: string;
  value: number;
  icon: string;
  color?: string;
}

export function StatBar({ label, value, icon, color = 'bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-2)]' }: Props) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold flex items-center gap-1.5">
          <span className="text-base leading-none">{icon}</span>
          <span className="text-soft">{label}</span>
        </span>
        <span className="font-bold text-mute tabular-nums">{Math.round(v)}</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-3)' }}>
        <div className={`${color} h-full rounded-full bar-fill shadow-inner`} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
