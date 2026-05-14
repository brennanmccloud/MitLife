import type { Character } from '../types/Character';
import { MiniAvatar } from './CharacterAvatar';
import type { Theme } from '../utils/theme';

interface Props {
  character: Character;
  theme: Theme;
  onToggleTheme: () => void;
  onSave: () => void;
  onSettings: () => void;
}

export function Header({ character, theme, onToggleTheme, onSave, onSettings }: Props) {
  return (
    <div
      className="sticky top-0 z-30 px-3 pt-3 pb-2 backdrop-blur-xl"
      style={{
        background:
          'linear-gradient(to bottom, color-mix(in srgb, var(--surface) 90%, transparent) 0%, color-mix(in srgb, var(--surface) 60%, transparent) 80%, transparent 100%)',
        borderBottom: '1px solid var(--border-soft)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="rounded-xl bg-[var(--surface-3)] p-0.5 shadow-card">
          <MiniAvatar look={character.avatar} age={character.age} size={40} bg="lilac" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold truncate flex items-center gap-1 leading-tight">
            {character.firstName} {character.lastName}
            {character.alive ? null : <span className="text-xs">🕯️</span>}
          </div>
          <div className="text-[11px] text-mute flex items-center gap-1.5">
            <span className="font-bold">Age {character.age}</span>
            <span>·</span>
            <span>
              {character.countryFlag} {character.country}
            </span>
          </div>
        </div>
        <IconButton
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          ariaLabel="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </IconButton>
        <IconButton onClick={onSave} title="Save" ariaLabel="Save">
          💾
        </IconButton>
        <IconButton onClick={onSettings} title="Menu" ariaLabel="Menu">
          ☰
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({
  onClick,
  title,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  title: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      className="w-9 h-9 rounded-full grid place-items-center text-base transition active:scale-90 hover:bg-[var(--surface-3)]"
      style={{ background: 'var(--surface)', border: '1px solid var(--border-soft)' }}
    >
      {children}
    </button>
  );
}
