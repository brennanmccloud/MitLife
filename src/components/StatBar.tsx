interface Props {
  label: string;
  value: number;
  icon: string;
  color?: string;
}

export function StatBar({ label, value, icon, color = 'bg-mit-500' }: Props) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1">
          <span className="text-base leading-none">{icon}</span>
          {label}
        </span>
        <span className="font-bold text-slate-500 tabular-nums">{Math.round(v)}%</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full bar-fill`} style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
