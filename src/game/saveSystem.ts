import type { Character } from '../types/Character';
import type { PowerFlags } from '../types/GameState';
import { DEFAULT_POWERS } from '../types/GameState';
import { normalizeAvatar } from '../components/CharacterAvatar';

const KEY = 'mitlife:v1';
const POWERS_KEY = 'mitlife:powers:v1';

export interface SaveBlob {
  character: Character | null;
  history: Character[];
  savedAt: number;
}

function migrateCharacter(c: Character | null | undefined): Character | null {
  if (!c) return null;
  c.avatar = normalizeAvatar(c.avatar);
  if (Array.isArray(c.relationships)) {
    for (const r of c.relationships) {
      r.avatar = normalizeAvatar(r.avatar);
    }
  }
  return c;
}

export function saveGame(blob: SaveBlob): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(blob));
  } catch {
    // storage may be full or unavailable
  }
}

export function loadGame(): SaveBlob | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveBlob;
    parsed.character = migrateCharacter(parsed.character);
    if (Array.isArray(parsed.history)) {
      parsed.history = parsed.history.map((c) => migrateCharacter(c)!).filter(Boolean);
    }
    return parsed;
  } catch {
    return null;
  }
}

export function deleteSave(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function savePowers(p: PowerFlags): void {
  try {
    localStorage.setItem(POWERS_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function loadPowers(): PowerFlags {
  try {
    const raw = localStorage.getItem(POWERS_KEY);
    if (!raw) return { ...DEFAULT_POWERS };
    return { ...DEFAULT_POWERS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_POWERS };
  }
}
