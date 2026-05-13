import type { Relationship } from '../types/Character';
import { MiniAvatar } from './CharacterAvatar';

interface Props {
  rel: Relationship;
  onClick?: () => void;
  selected?: boolean;
}

const ROLE_LABEL: Record<Relationship['role'], string> = {
  mother: 'Mom',
  father: 'Dad',
  parent: 'Parent',
  sibling: 'Sibling',
  halfSibling: 'Half-sibling',
  friend: 'Friend',
  bestFriend: 'Best Friend',
  enemy: 'Enemy',
  partner: 'Partner',
  spouse: 'Spouse',
  ex: 'Ex',
  child: 'Child',
  stepChild: 'Stepchild',
  pet: 'Pet',
  classmate: 'Classmate',
  coworker: 'Coworker',
  boss: 'Boss',
  crush: 'Crush',
};

function bondPercent(bond: number): number {
  return Math.round(((bond + 100) / 2));
}

function bondColor(bond: number): string {
  if (bond >= 60) return 'bg-emerald-500';
  if (bond >= 20) return 'bg-mit-500';
  if (bond >= -20) return 'bg-amber-500';
  if (bond >= -60) return 'bg-orange-500';
  return 'bg-rose-500';
}

export function RelationshipCard({ rel, onClick, selected }: Props) {
  const b = bondPercent(rel.bond);
  return (
    <button
      onClick={onClick}
      className={`w-full card flex items-center gap-3 hover:shadow-pop transition active:scale-[0.99] ${
        selected ? 'ring-2 ring-mit-400' : ''
      } ${!rel.alive ? 'opacity-60 grayscale' : ''}`}
    >
      <div className="shrink-0">
        <MiniAvatar look={rel.avatar} age={rel.age} size={48} />
      </div>
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-baseline gap-2">
          <div className="font-extrabold text-slate-800 truncate">{rel.name}</div>
          {!rel.alive && <span className="text-xs text-slate-500">🕯️</span>}
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="chip bg-slate-100 text-slate-700">{ROLE_LABEL[rel.role]}</span>
          <span>· age {rel.age}</span>
        </div>
        <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`${bondColor(rel.bond)} h-full bar-fill`} style={{ width: `${b}%` }} />
        </div>
      </div>
    </button>
  );
}
