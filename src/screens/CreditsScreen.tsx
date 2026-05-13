interface Props {
  onBack: () => void;
}

export function CreditsScreen({ onBack }: Props) {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <button onClick={onBack} className="p-2 rounded-full bg-white shadow-card">←</button>
        <h2 className="text-xl font-extrabold text-slate-800">Credits</h2>
      </div>
      <div className="px-4 pb-8 space-y-3">
        <div className="card">
          <div className="text-xs font-bold uppercase tracking-wider text-mit-700">MitLife</div>
          <div className="font-extrabold text-slate-800 text-lg">An original life-sim sandbox.</div>
          <p className="text-sm text-slate-600 mt-2">
            Designed as an entirely original game in the broader life-simulator genre. All names, places,
            events, and characters are fictional. Built with React, TypeScript, Vite, and Tailwind CSS.
          </p>
        </div>
        <div className="card">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Special Powers</div>
          <p className="text-sm text-slate-600 mt-1">
            All twelve special powers are unlocked by default and can be toggled freely from the Special tab.
          </p>
        </div>
        <div className="card">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Save Data</div>
          <p className="text-sm text-slate-600 mt-1">
            Your save is stored locally in your browser. Clearing your browser data will wipe it.
          </p>
        </div>
      </div>
    </div>
  );
}
