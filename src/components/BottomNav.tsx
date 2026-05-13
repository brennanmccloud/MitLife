import type { Screen } from '../types/GameState';

interface Tab {
  id: Screen;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'dashboard', label: 'Life', icon: '🌱' },
  { id: 'relationships', label: 'People', icon: '💞' },
  { id: 'activities', label: 'Do', icon: '✨' },
  { id: 'career', label: 'Career', icon: '💼' },
  { id: 'assets', label: 'Assets', icon: '🏛️' },
  { id: 'special', label: 'Special', icon: '🪄' },
];

interface Props {
  active: Screen;
  onChange: (s: Screen) => void;
  onAgeUp: () => void;
  ageUpDisabled?: boolean;
}

export function BottomNav({ active, onChange, onAgeUp, ageUpDisabled }: Props) {
  return (
    <div className="sticky bottom-0 left-0 right-0 pointer-events-none">
      <div className="pointer-events-auto px-3 pb-3 pt-2 bg-gradient-to-t from-white via-white/95 to-white/0">
        <div className="relative">
          <div className="grid grid-cols-6 gap-1 bg-white/90 backdrop-blur rounded-2xl shadow-card border border-slate-100 px-1 py-1.5">
            {TABS.map((t) => {
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onChange(t.id)}
                  className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition active:scale-95 ${
                    isActive ? 'bg-mit-100 text-mit-700' : 'text-slate-500 hover:text-mit-600'
                  }`}
                >
                  <span className="text-lg leading-none">{t.icon}</span>
                  <span className="text-[10px] font-bold tracking-wide mt-0.5">{t.label}</span>
                </button>
              );
            })}
          </div>
          <button
            onClick={onAgeUp}
            disabled={ageUpDisabled}
            className={`absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full grid place-items-center text-white font-extrabold text-xl shadow-pop transition active:scale-90 ${
              ageUpDisabled
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-br from-mit-400 to-mit-600 hover:scale-105'
            }`}
            aria-label="Age up"
            title="Age Up"
          >
            +1
          </button>
        </div>
      </div>
    </div>
  );
}
