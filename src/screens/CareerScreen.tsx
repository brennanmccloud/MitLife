import { useState } from 'react';
import type { Character } from '../types/Character';
import type { PowerFlags } from '../types/GameState';
import { ActionCard } from '../components/ActionCard';
import { Modal } from '../components/Modal';
import { StatBar } from '../components/StatBar';
import {
  ActionResult,
  applyPromotion,
  askForRaise,
  listAvailableJobs,
  quitJob,
  retire,
  takeJob,
  workHarder,
} from '../game/actions';
import { SPECIAL_CAREERS } from '../data/careers';

interface Props {
  character: Character;
  powers: PowerFlags;
  onAction: (mutator: (c: Character) => ActionResult) => void;
}

export function CareerScreen({ character: c, powers, onAction }: Props) {
  const [findOpen, setFindOpen] = useState(false);
  const [specialOpen, setSpecialOpen] = useState(false);
  if (c.age < 16) {
    return (
      <div className="px-3 pb-32 pt-2">
        <div className="card text-center text-slate-500">Too young to work. Come back at 16.</div>
      </div>
    );
  }

  return (
    <div className="px-3 pb-32 pt-2 space-y-3">
      {c.job ? (
        <div className="card bg-gradient-to-br from-violet-50 to-mit-50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-card grid place-items-center text-3xl">💼</div>
            <div>
              <div className="text-[10px] uppercase font-bold text-violet-700 tracking-widest">{c.job.field}</div>
              <div className="font-extrabold text-slate-800 text-lg">{c.job.title}</div>
              <div className="text-xs text-slate-500">Salary ${c.job.salary.toLocaleString()} · {c.job.years}y in role</div>
            </div>
          </div>
          <StatBar label="Performance" value={c.job.performance} icon="📈" color="bg-emerald-400" />
          <StatBar label="Stress" value={c.job.stress} icon="😰" color="bg-rose-400" />
          {c.job.bossBond !== undefined && (
            <StatBar label="Boss Bond" value={(c.job.bossBond + 0)} icon="🧑‍💼" color="bg-violet-400" />
          )}
          <div className="grid grid-cols-2 gap-2">
            <ActionCard icon="🛠️" label="Work Harder" tone="mit" onClick={() => onAction(workHarder)} />
            <ActionCard icon="💵" label="Ask for Raise" tone="emerald" onClick={() => onAction(askForRaise)} />
            <ActionCard icon="⬆️" label="Promotion" tone="plum" onClick={() => onAction(applyPromotion)} />
            <ActionCard icon="👋" label="Quit" tone="rose" onClick={() => onAction(quitJob)} />
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Unemployed</div>
          <p className="text-sm text-slate-600 mt-1">No job. Time to send out résumés.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <ActionCard icon="🔎" label="Find a Job" tone="mit" onClick={() => setFindOpen(true)} />
        <ActionCard icon="🌟" label="Special Careers" tone="amber" onClick={() => setSpecialOpen(true)} />
        <ActionCard icon="🏖️" label="Retire" tone="emerald" onClick={() => onAction(retire)} locked={c.age < 50} />
        <ActionCard icon="🚀" label="Start Business" tone="plum" onClick={() => {
          onAction((cc) => {
            if (cc.cash < 25000) return { ok: false, message: 'Need $25,000 to incorporate.' };
            cc.cash -= 25000;
            cc.assets.push({ id: `biz_${Math.random().toString(36).slice(2,7)}`, kind: 'business', name: 'Your Startup', value: 25000, paid: 25000, yield: 800 });
            cc.extra.business = Math.min(100, cc.extra.business + 10);
            cc.journal.push({ id: `j_${Math.random().toString(36).slice(2,7)}`, age: cc.age, type: 'business', icon: '🚀', text: 'Founded a tiny startup.', tone: 'good' });
            return { ok: true, message: 'Founded!', tone: 'good' };
          });
        }} />
      </div>

      {findOpen && (
        <Modal title="Available jobs" onClose={() => setFindOpen(false)} size="lg">
          <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
            {listAvailableJobs(c, { ...powers, careerPack: false }).map((j) => (
              <button
                key={j.id}
                onClick={() => { onAction((cc) => takeJob(cc, j, powers)); setFindOpen(false); }}
                className="p-3 rounded-2xl bg-mit-50 border border-mit-200 text-left active:scale-95"
              >
                <div className="font-extrabold text-slate-800 text-sm">{j.title}</div>
                <div className="text-[11px] text-slate-500">{j.field} · ${j.baseSalary.toLocaleString()} base</div>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {specialOpen && (
        <Modal title="Special careers" onClose={() => setSpecialOpen(false)} size="lg">
          {!powers.careerPack ? (
            <div className="text-sm text-slate-500">Career Pack disabled. Re-enable in Special.</div>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
              {SPECIAL_CAREERS.filter((j) => listAvailableJobs(c, powers).some((x) => x.id === j.id)).map((j) => (
                <button
                  key={j.id}
                  onClick={() => { onAction((cc) => takeJob(cc, j, powers)); setSpecialOpen(false); }}
                  className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-left active:scale-95"
                >
                  <div className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                    {j.title}
                    {j.fame && <span className="chip bg-yellow-200 text-yellow-800">🌟 fame</span>}
                  </div>
                  <div className="text-[11px] text-slate-500">{j.field} · ${j.baseSalary.toLocaleString()} base</div>
                </button>
              ))}
              {SPECIAL_CAREERS.filter((j) => !listAvailableJobs(c, powers).some((x) => x.id === j.id)).map((j) => (
                <div key={j.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left opacity-60">
                  <div className="font-extrabold text-slate-700 text-sm flex items-center gap-2">{j.title} 🔒</div>
                  <div className="text-[11px] text-slate-500">Requires more education or stats.</div>
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
