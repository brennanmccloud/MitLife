import type { Character } from '../types/Character';
import { MiniAvatar } from './CharacterAvatar';

interface Props {
  character: Character;
  onSave: () => void;
  onSettings: () => void;
}

export function Header({ character, onSave, onSettings }: Props) {
  return (
    <div className="sticky top-0 z-30 bg-gradient-to-b from-mit-50/90 to-mit-50/60 backdrop-blur px-3 pt-3 pb-2">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white shadow-card p-0.5">
          <MiniAvatar look={character.avatar} age={character.age} size={42} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-slate-800 truncate flex items-center gap-1">
            {character.firstName} {character.lastName}
            {character.alive ? null : <span className="text-xs">🕯️</span>}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span>Age {character.age}</span>
            <span>·</span>
            <span>{character.countryFlag} {character.country}</span>
          </div>
        </div>
        <button onClick={onSave} className="p-2 rounded-full hover:bg-white text-slate-600" title="Save" aria-label="Save">
          💾
        </button>
        <button onClick={onSettings} className="p-2 rounded-full hover:bg-white text-slate-600" title="Menu" aria-label="Menu">
          ☰
        </button>
      </div>
    </div>
  );
}
