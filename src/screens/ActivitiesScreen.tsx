import { useState } from 'react';
import type { Character } from '../types/Character';
import type { PowerFlags } from '../types/GameState';
import { ActionCard } from '../components/ActionCard';
import { Modal } from '../components/Modal';
import {
  ActionResult,
  CRIMES,
  applyCollege,
  applyGradSchool,
  casino,
  commitCrime,
  doctor,
  emigrate,
  gym,
  joinClub,
  joinSport,
  library,
  lottery,
  meditate,
  nightlife,
  plasticSurgery,
  skipSchool,
  socialMedia,
  studyHarder,
  vacation,
  appealSentence,
  escapeAttempt,
  useJailbreak,
} from '../game/actions';
import { COLLEGE_MAJORS } from '../data/careers';
import { COUNTRIES } from '../data/countries';

interface Props {
  character: Character;
  powers: PowerFlags;
  onAction: (mutator: (c: Character) => ActionResult) => void;
}

export function ActivitiesScreen({ character: c, powers, onAction }: Props) {
  const [crimeOpen, setCrimeOpen] = useState(false);
  const [collegeOpen, setCollegeOpen] = useState(false);
  const [emigrateOpen, setEmigrateOpen] = useState(false);
  const adult = c.age >= 18;
  const teen = c.age >= 13;

  if (c.prison.inPrison) {
    return (
      <div className="px-3 pb-32 pt-2 space-y-3">
        <div className="card bg-gradient-to-br from-slate-200 to-slate-300">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">Incarcerated</div>
          <div className="font-extrabold text-2xl text-slate-800">Cell Block {c.prison.security.toUpperCase()}</div>
          <div className="text-sm text-slate-700 mt-1">{c.prison.yearsRemaining} years remaining of {c.prison.totalSentence}.</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ActionCard icon="🙌" label="Behave" sub="Lower sentence chance" tone="emerald" onClick={() => onAction((cc) => { cc.prison.reputation = Math.max(0, cc.prison.reputation - 4); cc.core.happiness = Math.max(0, cc.core.happiness - 2); return { ok: true, message: 'Kept your head down.', tone: 'neutral' }; })} />
          <ActionCard icon="🥊" label="Fight Inmate" tone="rose" onClick={() => onAction((cc) => { cc.prison.reputation = Math.min(100, cc.prison.reputation + 10); cc.core.health = Math.max(0, cc.core.health - 8); return { ok: true, message: 'Bloody knuckles. Reputation up.', tone: 'neutral' }; })} />
          <ActionCard icon="⚖️" label="Appeal" tone="amber" onClick={() => onAction(appealSentence)} />
          <ActionCard icon="🏃" label="Escape" tone="plum" onClick={() => onAction(escapeAttempt)} />
          {powers.jailbreakCard && (
            <ActionCard icon="🗝️" label="Jailbreak Card" sub="Walk out free" tone="amber" onClick={() => onAction(useJailbreak)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 pb-32 pt-2 space-y-3">
      <div className="card">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Activities</div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <ActionCard icon="🩺" label="Doctor" sub="$200" tone="emerald" onClick={() => onAction(doctor)} />
          <ActionCard icon="🏋️" label="Gym" sub="$60" tone="emerald" onClick={() => onAction(gym)} locked={c.age < 8} />
          <ActionCard icon="🧘" label="Meditate" tone="emerald" onClick={() => onAction(meditate)} />
          <ActionCard icon="📚" label="Library" tone="mit" onClick={() => onAction(library)} />
          <ActionCard icon="🍸" label="Nightlife" sub="$120" tone="plum" onClick={() => onAction(nightlife)} locked={!adult} />
          <ActionCard icon="🏖️" label="Vacation" sub="$2,000" tone="amber" onClick={() => onAction(vacation)} />
          <ActionCard icon="📱" label="Social Media" tone="plum" onClick={() => onAction(socialMedia)} locked={!teen} />
          <ActionCard icon="🎰" label="Lottery" tone="amber" onClick={() => onAction(lottery)} locked={!adult} />
          <ActionCard icon="🎲" label="Casino" tone="rose" onClick={() => onAction(casino)} locked={c.age < 21} />
          <ActionCard icon="💅" label="Cosmetic" sub="$5,000" tone="plum" onClick={() => onAction(plasticSurgery)} locked={!adult} />
          <ActionCard icon="🛂" label="Emigrate" tone="mit" onClick={() => setEmigrateOpen(true)} locked={!adult} />
          <ActionCard icon="🦹" label="Crime" tone="rose" onClick={() => setCrimeOpen(true)} locked={c.age < 10} />
        </div>
      </div>

      {c.education.level !== 'none' && (
        <div className="card">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">School</div>
          <div className="text-sm text-slate-700 mt-1">
            Currently in {c.education.level === 'college' ? `College — ${c.education.major}` : c.education.level === 'grad' ? `Grad school — ${c.education.major}` : c.education.level} · grades {Math.round(c.education.grades)} · popularity {Math.round(c.education.popularity)}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <ActionCard icon="📖" label="Study Harder" tone="mit" onClick={() => onAction(studyHarder)} />
            <ActionCard icon="🛹" label="Skip School" tone="amber" onClick={() => onAction(skipSchool)} />
            <ActionCard icon="🎭" label="Join Club" tone="plum" onClick={() => onAction(joinClub)} />
            <ActionCard icon="⚽" label="Join Sport" tone="emerald" onClick={() => onAction(joinSport)} />
          </div>
        </div>
      )}

      {c.age >= 18 && c.education.level === 'none' && (
        <div className="card">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Higher Education</div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <ActionCard icon="🎓" label="College" tone="mit" onClick={() => setCollegeOpen(true)} />
            <ActionCard
              icon="🎓"
              label="Grad School"
              tone="plum"
              onClick={() => setCollegeOpen(true)}
              disabled={!c.education.degrees.some((d) => d.startsWith("Bachelor's"))}
            />
          </div>
        </div>
      )}

      {crimeOpen && (
        <Modal title="Crime" onClose={() => setCrimeOpen(false)} size="lg">
          <p className="text-xs text-slate-500 mb-2">Pick your poison. Risk and reward.</p>
          <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
            {CRIMES.filter((cr) => c.age >= cr.minAge).map((cr) => (
              <button
                key={cr.id}
                className="text-left p-3 rounded-2xl bg-rose-50 border border-rose-200 active:scale-95 transition"
                onClick={() => {
                  onAction((cc) => {
                    const res = commitCrime(cc, cr, powers);
                    return { ok: res.ok, message: res.message, tone: res.outcome === 'success' ? 'good' : res.outcome === 'killed' ? 'bad' : 'bad' };
                  });
                  setCrimeOpen(false);
                }}
              >
                <div className="font-extrabold text-slate-800 text-sm">{cr.name}</div>
                <div className="text-[11px] text-slate-600">
                  reward ${cr.rewardMin}–${cr.rewardMax.toLocaleString()} · sentence {cr.sentence[0]}–{cr.sentence[1]}y
                </div>
                {cr.lethal && (
                  <div className="text-[10px] text-rose-600 font-bold mt-0.5">
                    {powers.shadowBlade ? '🗡️ Shadow Blade active' : '☠️ Lethal'}
                  </div>
                )}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {collegeOpen && (
        <Modal title="Pick a major" onClose={() => setCollegeOpen(false)} size="lg">
          <div className="grid grid-cols-2 gap-2">
            {COLLEGE_MAJORS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  const hasBachelor = c.education.degrees.some((d) => d.startsWith("Bachelor's"));
                  onAction((cc) => (hasBachelor ? applyGradSchool(cc, m) : applyCollege(cc, m, powers)));
                  setCollegeOpen(false);
                }}
                className="p-3 rounded-2xl bg-mit-50 border border-mit-200 text-sm font-bold text-mit-700 text-left active:scale-95"
              >
                {m}
              </button>
            ))}
          </div>
          {powers.instantDiploma && (
            <div className="mt-3 text-xs text-slate-500 text-center">🎓 Instant Diploma is active — picking a major awards the degree instantly.</div>
          )}
        </Modal>
      )}

      {emigrateOpen && (
        <Modal title="Move where?" onClose={() => setEmigrateOpen(false)} size="lg">
          <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
            {COUNTRIES.filter((co) => co.name !== c.country).map((co) => (
              <button
                key={co.name}
                className="p-3 rounded-2xl bg-mit-50 border border-mit-200 text-left active:scale-95"
                onClick={() => {
                  onAction((cc) => emigrate(cc, co.name, powers));
                  setEmigrateOpen(false);
                }}
              >
                <div className="text-2xl">{co.flag}</div>
                <div className="font-extrabold text-slate-800 text-sm">{co.name}</div>
                <div className="text-[11px] text-slate-500">{co.vibe}</div>
              </button>
            ))}
          </div>
          {powers.globalPass && <div className="mt-3 text-xs text-slate-500 text-center">🛂 Global Pass active — guaranteed approval.</div>}
        </Modal>
      )}
    </div>
  );
}
