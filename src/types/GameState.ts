import type { Character } from './Character';

export interface PowerFlags {
  legacyPass: boolean;
  creatorMode: boolean;
  careerPack: boolean;
  miracleCradle: boolean;
  globalPass: boolean;
  fameSpark: boolean;
  jailbreakCard: boolean;
  fortuneSeed: boolean;
  instantDiploma: boolean;
  rewindToken: boolean;
  perfectCharm: boolean;
  shadowBlade: boolean;
}

export const DEFAULT_POWERS: PowerFlags = {
  legacyPass: true,
  creatorMode: true,
  careerPack: true,
  miracleCradle: true,
  globalPass: true,
  fameSpark: true,
  jailbreakCard: true,
  fortuneSeed: true,
  instantDiploma: true,
  rewindToken: true,
  perfectCharm: true,
  shadowBlade: true,
};

export type Screen =
  | 'start'
  | 'newLife'
  | 'dashboard'
  | 'relationships'
  | 'activities'
  | 'career'
  | 'assets'
  | 'special'
  | 'death'
  | 'credits';

export interface ToastMessage {
  id: string;
  text: string;
  tone: 'good' | 'bad' | 'neutral';
}

export interface PendingEvent {
  id: string;
  title: string;
  icon: string;
  description: string;
  tone: 'good' | 'bad' | 'neutral' | 'epic';
  category: string;
  choices: PendingChoice[];
  meta?: Record<string, unknown>;
}

export interface PendingChoice {
  id: string;
  label: string;
  risk?: 'low' | 'med' | 'high' | 'epic';
  resolve: () => void;
}

export interface GameState {
  character: Character | null;
  previousCharacter?: Character | null;
  powers: PowerFlags;
  screen: Screen;
  pendingEvent: PendingEvent | null;
  toasts: ToastMessage[];
  history: Character[];
}
