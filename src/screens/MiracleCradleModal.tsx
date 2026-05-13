import { useState } from 'react';
import type { Gender, HiddenStats } from '../types/Character';
import { Modal } from '../components/Modal';

interface Props {
  onClose: () => void;
  onConfirm: (count: 1 | 2 | 3, gender: Gender, talent?: keyof HiddenStats) => void;
}

const TALENTS: { key: keyof HiddenStats; label: string; icon: string }[] = [
  { key: 'crimeTalent', label: 'Crime', icon: '🦹' },
  { key: 'musicTalent', label: 'Music', icon: '🎵' },
  { key: 'actingTalent', label: 'Acting', icon: '🎭' },
  { key: 'sportsTalent', label: 'Sports', icon: '🏆' },
  { key: 'businessTalent', label: 'Business', icon: '💼' },
];

export function MiracleCradleModal({ onClose, onConfirm }: Props) {
  const [count, setCount] = useState<1 | 2 | 3>(1);
  const [gender, setGender] = useState<Gender>('female');
  const [talent, setTalent] = useState<keyof HiddenStats | undefined>();

  return (
    <Modal title="🍼 Miracle Cradle" onClose={onClose} size="lg">
      <p className="text-sm text-slate-600 mb-3">
        Choose exactly how the next bundle of joy arrives.
      </p>

      <div className="space-y-3">
        <div>
          <div className="text-xs font-bold text-slate-600 mb-1">Number of babies</div>
          <div className="grid grid-cols-3 gap-2">
            {([1, 2, 3] as const).map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`py-3 rounded-2xl font-bold ${count === n ? 'bg-mit-500 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                {n === 1 ? '👶 One' : n === 2 ? '👶👶 Twins' : '👶👶👶 Triplets'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-600 mb-1">Gender</div>
          <div className="grid grid-cols-3 gap-2">
            {(['female', 'male', 'nonbinary'] as Gender[]).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`py-2 rounded-2xl text-sm font-bold ${gender === g ? 'bg-mit-500 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                {g === 'female' ? '♀ Female' : g === 'male' ? '♂ Male' : '⚧ Nonbinary'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold text-slate-600 mb-1">Special talent (optional)</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setTalent(undefined)}
              className={`py-2 rounded-2xl text-xs font-bold ${!talent ? 'bg-mit-500 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              None
            </button>
            {TALENTS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTalent(t.key)}
                className={`py-2 rounded-2xl text-xs font-bold ${talent === t.key ? 'bg-mit-500 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                <div className="text-lg">{t.icon}</div>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => { onConfirm(count, gender, talent); onClose(); }}
          className="pill-btn-primary w-full py-3 mt-2"
        >
          ✨ Confirm
        </button>
      </div>
    </Modal>
  );
}
