import { useMemo, useState } from 'react';
import type { AvatarLook, Gender, HiddenStats } from '../types/Character';
import { COUNTRIES } from '../data/countries';
import { AvatarEditor } from '../components/AvatarEditor';
import { randomAvatar } from '../game/createCharacter';

const TALENTS: { key: keyof HiddenStats; label: string; icon: string }[] = [
  { key: 'crimeTalent', label: 'Crime', icon: '🦹' },
  { key: 'musicTalent', label: 'Music', icon: '🎵' },
  { key: 'actingTalent', label: 'Acting', icon: '🎭' },
  { key: 'sportsTalent', label: 'Sports', icon: '🏆' },
  { key: 'businessTalent', label: 'Business', icon: '💼' },
];

const EDITABLE_STATS: { key: string; label: string }[] = [
  { key: 'happiness', label: 'Happiness' },
  { key: 'health', label: 'Health' },
  { key: 'intelligence', label: 'Intelligence' },
  { key: 'appearance', label: 'Appearance' },
  { key: 'discipline', label: 'Discipline' },
  { key: 'luck', label: 'Luck' },
  { key: 'willpower', label: 'Willpower' },
  { key: 'karma', label: 'Karma' },
  { key: 'craziness', label: 'Craziness' },
  { key: 'fertility', label: 'Fertility' },
  { key: 'crimeTalent', label: 'Crime Talent' },
  { key: 'musicTalent', label: 'Music Talent' },
  { key: 'actingTalent', label: 'Acting Talent' },
  { key: 'sportsTalent', label: 'Sports Talent' },
  { key: 'businessTalent', label: 'Business Talent' },
];

export interface NewLifeForm {
  firstName: string;
  lastName: string;
  gender: Gender;
  country: string;
  avatar: AvatarLook;
  wealth: 'poor' | 'middle' | 'rich';
  talent?: keyof HiddenStats;
  custom: Record<string, number>;
  creator: boolean;
}

interface Props {
  onBegin: (form: NewLifeForm) => void;
  onBack: () => void;
}

type Mode = 'random' | 'custom' | 'creator';

export function NewLifeScreen({ onBegin, onBack }: Props) {
  const [mode, setMode] = useState<Mode>('random');
  const initialAvatar = useMemo(() => randomAvatar('female'), []);
  const [form, setForm] = useState<NewLifeForm>({
    firstName: '',
    lastName: '',
    gender: 'female',
    country: COUNTRIES[0].name,
    avatar: initialAvatar,
    wealth: 'middle',
    talent: undefined,
    custom: {},
    creator: false,
  });

  const country = COUNTRIES.find((c) => c.name === form.country) ?? COUNTRIES[0];

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <button onClick={onBack} className="p-2 rounded-full bg-white shadow-card">←</button>
        <h2 className="text-xl font-extrabold text-slate-800">New Life</h2>
      </div>

      <div className="px-4">
        <div className="grid grid-cols-3 gap-2 bg-white rounded-2xl p-1 shadow-card text-xs font-bold">
          {(['random', 'custom', 'creator'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setForm((f) => ({ ...f, creator: m === 'creator' }));
              }}
              className={`py-2 rounded-xl capitalize ${mode === m ? 'bg-mit-500 text-white' : 'text-slate-600'}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 pt-4 pb-28 overflow-y-auto space-y-4">
        <div className="card">
          <div className="text-[11px] font-bold uppercase tracking-wider text-mit-700 mb-1">Identity</div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-bold text-slate-600">
              First name
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-mit-400 outline-none font-normal text-slate-800"
                placeholder="(random)"
              />
            </label>
            <label className="text-xs font-bold text-slate-600">
              Last name
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-mit-400 outline-none font-normal text-slate-800"
                placeholder="(random)"
              />
            </label>
          </div>

          <div className="mt-3">
            <div className="text-xs font-bold text-slate-600 mb-1">Gender</div>
            <div className="grid grid-cols-3 gap-2">
              {(['female', 'male', 'nonbinary'] as Gender[]).map((g) => (
                <button
                  key={g}
                  className={`py-2 rounded-xl text-sm font-bold ${
                    form.gender === g ? 'bg-mit-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                  onClick={() => setForm((f) => ({ ...f, gender: g, avatar: { ...f.avatar, gender: g } }))}
                >
                  {g === 'female' ? '♀ Female' : g === 'male' ? '♂ Male' : '⚧ Nonbinary'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <div className="text-xs font-bold text-slate-600 mb-1">Country</div>
            <select
              value={form.country}
              onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-mit-400 outline-none"
            >
              {COUNTRIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            <div className="text-[11px] text-slate-500 mt-1">{country.vibe}</div>
          </div>

          <div className="mt-3">
            <div className="text-xs font-bold text-slate-600 mb-1">Family wealth</div>
            <div className="grid grid-cols-3 gap-2">
              {(['poor', 'middle', 'rich'] as const).map((w) => (
                <button
                  key={w}
                  className={`py-2 rounded-xl text-sm font-bold capitalize ${
                    form.wealth === w ? 'bg-mit-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                  onClick={() => setForm((f) => ({ ...f, wealth: w }))}
                >
                  {w === 'poor' ? '🪙 Poor' : w === 'middle' ? '💼 Middle' : '💎 Rich'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3">
            <div className="text-xs font-bold text-slate-600 mb-1">Special talent (optional)</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`py-2 rounded-xl text-xs font-bold ${!form.talent ? 'bg-mit-500 text-white' : 'bg-slate-100 text-slate-600'}`}
                onClick={() => setForm((f) => ({ ...f, talent: undefined }))}
              >
                None
              </button>
              {TALENTS.map((t) => (
                <button
                  key={t.key}
                  className={`py-2 rounded-xl text-xs font-bold ${
                    form.talent === t.key ? 'bg-mit-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                  onClick={() => setForm((f) => ({ ...f, talent: t.key }))}
                >
                  <div className="text-lg leading-none">{t.icon}</div>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="text-[11px] font-bold uppercase tracking-wider text-mit-700 mb-2">Appearance</div>
          <AvatarEditor
            look={form.avatar}
            age={1}
            onChange={(next) => setForm((f) => ({ ...f, avatar: { ...next, gender: f.gender } }))}
            onRandomize={() => setForm((f) => ({ ...f, avatar: { ...randomAvatar(f.gender) } }))}
            compact
          />
        </div>

        {mode === 'creator' && (
          <div className="card space-y-3">
            <div className="text-xs font-bold text-slate-600">Creator Mode · edit any stat (0–100)</div>
            {EDITABLE_STATS.map((s) => (
              <div key={s.key}>
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>{s.label}</span>
                  <span className="tabular-nums">{form.custom[s.key] ?? 50}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.custom[s.key] ?? 50}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, custom: { ...f.custom, [s.key]: Number(e.target.value) } }))
                  }
                  className="w-full accent-mit-500"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 left-0 right-0 px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white/90 to-transparent">
        <button className="pill-btn-primary w-full text-lg py-4" onClick={() => onBegin(form)}>
          ✨ Begin Life
        </button>
      </div>
    </div>
  );
}
