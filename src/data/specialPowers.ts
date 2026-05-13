export interface PowerDef {
  id: keyof import('../types/GameState').PowerFlags;
  name: string;
  icon: string;
  tag: string;
  description: string;
  color: string;
}

export const POWERS: PowerDef[] = [
  {
    id: 'legacyPass',
    name: 'Legacy Pass',
    icon: '👑',
    tag: 'Generations',
    description: 'Live unlimited generations and unlock deeper relationship interactions.',
    color: 'from-amber-300 to-amber-500',
  },
  {
    id: 'creatorMode',
    name: 'Creator Mode',
    icon: '🪄',
    tag: 'Edit anything',
    description: 'Edit your own stats, looks, and even tweak the people around you.',
    color: 'from-fuchsia-300 to-fuchsia-500',
  },
  {
    id: 'careerPack',
    name: 'Career Pack',
    icon: '💼',
    tag: 'Special jobs',
    description: 'Unlock every special career: actor, athlete, founder, astronaut, politician, and more.',
    color: 'from-sky-300 to-sky-500',
  },
  {
    id: 'miracleCradle',
    name: 'Miracle Cradle',
    icon: '🍼',
    tag: 'Family planning',
    description: 'Guaranteed fertility after 18. Choose baby count, gender, and a special talent.',
    color: 'from-rose-300 to-rose-500',
  },
  {
    id: 'globalPass',
    name: 'Global Pass',
    icon: '🛂',
    tag: 'Emigrate freely',
    description: 'Move to any country in the world without waiting on the visa lottery.',
    color: 'from-emerald-300 to-emerald-500',
  },
  {
    id: 'fameSpark',
    name: 'Fame Spark',
    icon: '✨',
    tag: 'Instant fame',
    description: 'Skyrocket your fame in any spotlight career — actor, musician, athlete, politician.',
    color: 'from-yellow-300 to-orange-400',
  },
  {
    id: 'jailbreakCard',
    name: 'Jailbreak Card',
    icon: '🗝️',
    tag: 'Out of prison',
    description: 'Instantly walk out of any prison and wipe your criminal record clean.',
    color: 'from-slate-300 to-slate-500',
  },
  {
    id: 'fortuneSeed',
    name: 'Fortune Seed',
    icon: '💎',
    tag: 'Start rich',
    description: 'Begin a new life with a cool $1,000,000 in the bank.',
    color: 'from-teal-300 to-teal-500',
  },
  {
    id: 'instantDiploma',
    name: 'Instant Diploma',
    icon: '🎓',
    tag: 'Skip school',
    description: 'Pick any degree, in any field — and instantly land a matching job.',
    color: 'from-indigo-300 to-indigo-500',
  },
  {
    id: 'rewindToken',
    name: 'Rewind Token',
    icon: '⏪',
    tag: 'Undo a year',
    description: 'Undo your most recent year or last big decision.',
    color: 'from-cyan-300 to-cyan-500',
  },
  {
    id: 'perfectCharm',
    name: 'Perfect Charm',
    icon: '💗',
    tag: 'Romance boost',
    description: 'Persistent romance boost — lovers stay sweet and friends stay loyal.',
    color: 'from-pink-300 to-pink-500',
  },
  {
    id: 'shadowBlade',
    name: 'Shadow Blade',
    icon: '🗡️',
    tag: 'Get away with it',
    description: 'Greatly increases your chance of getting away with violent crime.',
    color: 'from-zinc-400 to-zinc-700',
  },
];
