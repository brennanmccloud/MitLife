import { useMemo } from 'react';

interface Props {
  hasSave: boolean;
  onNewLife: () => void;
  onContinue: () => void;
  onSpecial: () => void;
  onCredits: () => void;
}

const ICONS = ['🍼', '🎓', '💰', '❤️', '💼', '💀', '👑', '🏠', '🚗', '🎂', '💍', '⚽', '✈️', '🪄'];

export function StartScreen({ hasSave, onNewLife, onContinue, onSpecial, onCredits }: Props) {
  const floaters = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        icon: ICONS[i % ICONS.length],
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 4,
        scale: 0.8 + Math.random() * 0.8,
      })),
    [],
  );
  return (
    <div className="relative min-h-[100dvh] overflow-hidden flex flex-col">
      <div className="absolute inset-0 pointer-events-none">
        {floaters.map((f, i) => (
          <span
            key={i}
            className="absolute text-3xl opacity-20 animate-drift"
            style={{
              left: `${f.left}%`,
              top: `${f.top}%`,
              animationDelay: `${f.delay}s`,
              transform: `scale(${f.scale})`,
            }}
          >
            {f.icon}
          </span>
        ))}
      </div>
      <div className="relative px-6 pt-16 pb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-card text-xs font-bold text-mit-700">
          ✨ All Powers Unlocked
        </div>
        <h1 className="mt-6 text-5xl font-black text-slate-800 tracking-tight">
          Mit<span className="text-mit-500">Life</span>
        </h1>
        <p className="mt-2 text-slate-500 font-bold">Live a whole life, one tap at a time.</p>
      </div>

      <div className="relative flex-1 px-6 pb-10 flex flex-col gap-3 max-w-sm w-full mx-auto">
        <button className="pill-btn-primary w-full text-lg py-4" onClick={onNewLife}>
          🌱 Start New Life
        </button>
        <button
          className={`pill-btn-ghost w-full text-lg py-4 ${!hasSave ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={hasSave ? onContinue : undefined}
        >
          ⏯️ Continue Life
        </button>
        <button className="pill-btn-violet w-full text-lg py-4" onClick={onSpecial}>
          🪄 Special Modes
        </button>
        <button className="pill-btn-ghost w-full text-base py-3" onClick={onCredits}>
          ℹ️ Credits
        </button>
        <div className="text-center text-[11px] text-slate-400 mt-6">
          MitLife · An original life-sim sandbox · v0.1
        </div>
      </div>
    </div>
  );
}
