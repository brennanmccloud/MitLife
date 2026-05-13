import { useState } from 'react';
import type { Character, Relationship } from '../types/Character';
import type { PowerFlags } from '../types/GameState';
import { RelationshipCard } from '../components/RelationshipCard';
import { MiniAvatar } from '../components/CharacterAvatar';
import { Modal } from '../components/Modal';
import {
  ActionResult,
  adopt,
  apologize,
  argue,
  askForMoney,
  compliment,
  divorce,
  giftMoney,
  insult,
  propose,
  spendTime,
  startDating,
  tryForBaby,
} from '../game/actions';

interface Props {
  character: Character;
  powers: PowerFlags;
  onAction: (mutator: (c: Character) => ActionResult) => void;
  onMiracleCradle: (partnerId: string) => void;
}

const ROLE_GROUPS: { id: string; label: string; filter: (r: Relationship) => boolean }[] = [
  { id: 'family', label: 'Family', filter: (r) => ['mother', 'father', 'parent', 'sibling', 'halfSibling', 'child', 'stepChild'].includes(r.role) },
  { id: 'love', label: 'Love', filter: (r) => ['partner', 'spouse', 'ex', 'crush'].includes(r.role) },
  { id: 'friends', label: 'Friends', filter: (r) => ['friend', 'bestFriend', 'classmate', 'enemy'].includes(r.role) },
  { id: 'work', label: 'Work', filter: (r) => ['coworker', 'boss'].includes(r.role) },
  { id: 'pets', label: 'Pets', filter: (r) => r.role === 'pet' },
];

export function RelationshipsScreen({ character: c, powers, onAction, onMiracleCradle }: Props) {
  const [tab, setTab] = useState('family');
  const [selected, setSelected] = useState<Relationship | null>(null);

  const list = c.relationships.filter(ROLE_GROUPS.find((g) => g.id === tab)!.filter);
  return (
    <div className="px-3 pb-32 pt-2 space-y-3">
      <div className="card">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Relationships</div>
        <div className="flex gap-1 overflow-x-auto scroll-no-bar -mx-1 px-1 pb-1">
          {ROLE_GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => setTab(g.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold ${
                tab === g.id ? 'bg-mit-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {list.length === 0 && (
          <div className="card text-center text-sm text-slate-500">
            Nobody here yet. Try the "Love" tab and start dating, or wait — life will introduce people.
          </div>
        )}
        {list.map((r) => (
          <RelationshipCard key={r.id} rel={r} onClick={() => setSelected(r)} selected={selected?.id === r.id} />
        ))}
      </div>

      {(tab === 'love' || tab === 'family') && (
        <div className="card grid grid-cols-2 gap-2">
          {tab === 'love' && (
            <button
              className="pill-btn-violet text-sm"
              onClick={() => onAction((cc) => startDating(cc, powers))}
            >
              💞 Find Date
            </button>
          )}
          {tab === 'family' && (
            <button className="pill-btn-ghost text-sm" onClick={() => onAction((cc) => adopt(cc))}>
              👶 Adopt a Child
            </button>
          )}
        </div>
      )}

      {selected && (
        <RelDetailModal
          rel={selected}
          character={c}
          powers={powers}
          onClose={() => setSelected(null)}
          onAction={onAction}
          onMiracleCradle={onMiracleCradle}
        />
      )}
    </div>
  );
}

interface DetailProps {
  rel: Relationship;
  character: Character;
  powers: PowerFlags;
  onClose: () => void;
  onAction: (mutator: (c: Character) => ActionResult) => void;
  onMiracleCradle: (partnerId: string) => void;
}

function RelDetailModal({ rel, character: c, powers, onClose, onAction, onMiracleCradle }: DetailProps) {
  const isLover = rel.role === 'partner' || rel.role === 'spouse';
  return (
    <Modal title={rel.name} onClose={onClose} size="lg">
      <div className="flex items-center gap-3">
        <MiniAvatar look={rel.avatar} age={rel.age} size={64} />
        <div className="flex-1">
          <div className="font-extrabold text-slate-800">{rel.name}</div>
          <div className="text-xs text-slate-500 capitalize">{rel.role} · age {rel.age}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
        <Stat label="Looks" v={rel.stats.looks} />
        <Stat label="Smarts" v={rel.stats.intelligence} />
        <Stat label="Loyalty" v={rel.stats.loyalty} />
        <Stat label="Temper" v={rel.stats.temper} />
        <Stat label="Crazy" v={rel.stats.craziness} />
        <Stat label="Money" v={rel.stats.money} />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <ActionBtn icon="🤝" label="Spend Time" onClick={() => { onAction((cc) => spendTime(cc, rel.id, powers)); }} />
        <ActionBtn icon="💬" label="Compliment" onClick={() => onAction((cc) => compliment(cc, rel.id, powers))} />
        <ActionBtn icon="🗯️" label="Argue" onClick={() => onAction((cc) => argue(cc, rel.id))} />
        <ActionBtn icon="🙏" label="Apologize" onClick={() => onAction((cc) => apologize(cc, rel.id))} />
        <ActionBtn icon="😡" label="Insult" onClick={() => onAction((cc) => insult(cc, rel.id))} />
        <ActionBtn icon="🎁" label="Gift $100" onClick={() => onAction((cc) => giftMoney(cc, rel.id, 100))} />
        <ActionBtn icon="🤲" label="Ask for $" onClick={() => onAction((cc) => askForMoney(cc, rel.id))} />
        {rel.role === 'partner' && (
          <ActionBtn icon="💍" label="Propose" onClick={() => onAction((cc) => propose(cc, rel.id, powers))} />
        )}
        {rel.role === 'spouse' && (
          <ActionBtn icon="📑" label="Divorce" tone="rose" onClick={() => onAction((cc) => divorce(cc, rel.id))} />
        )}
        {isLover && (
          <ActionBtn
            icon="👶"
            label={powers.miracleCradle ? 'Miracle Cradle' : 'Try for Baby'}
            tone="emerald"
            onClick={() => {
              if (powers.miracleCradle) onMiracleCradle(rel.id);
              else onAction((cc) => tryForBaby(cc, rel.id, powers));
            }}
          />
        )}
      </div>
    </Modal>
  );
}

function Stat({ label, v }: { label: string; v: number }) {
  return (
    <div className="bg-slate-50 rounded-xl py-1.5">
      <div className="text-[10px] uppercase text-slate-500 font-bold tracking-wide">{label}</div>
      <div className="font-extrabold text-slate-800 tabular-nums">{Math.round(v)}</div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, tone = 'mit' }: { icon: string; label: string; onClick: () => void; tone?: 'mit' | 'rose' | 'emerald' }) {
  const cls = tone === 'rose' ? 'bg-rose-50 text-rose-700 border-rose-200' : tone === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-mit-50 text-mit-700 border-mit-200';
  return (
    <button onClick={onClick} className={`p-2.5 rounded-2xl border ${cls} font-bold text-sm flex items-center gap-2 active:scale-95 transition`}>
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}
