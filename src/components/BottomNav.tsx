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
      <div
        className="pointer-events-auto px-3 pb-3 pt-2"
        style={{
          background:
            'linear-gradient(to top, color-mix(in srgb, var(--surface) 95%, transparent) 0%, color-mix(in srgb, var(--surface) 70%, transparent) 60%, transparent 100%)',
        }}
      >
        <div className="relative">
          <div
            className="grid grid-cols-6 gap-1 rounded-2xl px-1 py-1.5 backdrop-blur-xl"
            style={{
              background: 'color-mix(in srgb, var(--surface) 80%, transparent)',
              border: '1px solid var(--border-soft)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {TABS.map((t) => {
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onChange(t.id)}
                  className="flex flex-col items-center justify-center py-1.5 rounded-xl transition active:scale-90"
                  style={{
                    background: isActive
                      ? 'color-mix(in srgb, var(--accent) 18%, transparent)'
                      : 'transparent',
                    color: isActive ? 'var(--accent)' : 'var(--text-mute)',
                  }}
                >
                  <span className="text-lg leading-none">{t.icon}</span>
                  <span className="text-[10px] font-extrabold tracking-wide mt-0.5">{t.label}</span>
                  {isActive && (
                    <span
                      className="mt-1 block w-1.5 h-1.5 rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <button
            onClick={onAgeUp}
            disabled={ageUpDisabled}
            className={`absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full grid place-items-center text-white font-black text-xl transition active:scale-90 ${
              ageUpDisabled ? 'cursor-not-allowed' : 'hover:scale-105'
            }`}
            style={{
              background: ageUpDisabled
                ? 'var(--surface-3)'
                : 'linear-gradient(135deg, var(--accent), var(--accent-2))',
              boxShadow: ageUpDisabled ? 'none' : 'var(--shadow-pop)',
              color: ageUpDisabled ? 'var(--text-mute)' : '#fff',
              border: '3px solid var(--surface)',
            }}
            aria-label="Age up"
            title="Age Up"
          >
            <div className="flex flex-col items-center leading-none">
              <span className="text-[18px]">+1</span>
              <span className="text-[9px] font-bold mt-0.5 opacity-80">YEAR</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
