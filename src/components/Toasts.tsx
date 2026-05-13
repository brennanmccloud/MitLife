import type { ToastMessage } from '../types/GameState';

const COLOR: Record<ToastMessage['tone'], string> = {
  good: 'bg-emerald-500',
  bad: 'bg-rose-500',
  neutral: 'bg-slate-700',
};

export function Toasts({ toasts }: { toasts: ToastMessage[] }) {
  return (
    <div className="fixed top-3 left-0 right-0 z-50 px-3 pointer-events-none flex flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-none ${COLOR[t.tone]} text-white px-4 py-2 rounded-full font-bold text-sm shadow-pop animate-pop`}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
