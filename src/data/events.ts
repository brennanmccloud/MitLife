// Original MitLife life events. Original writing — no copied text.
import type { GameState } from '../types/GameState';
import type { Character } from '../types/Character';

export interface EventChoiceDef {
  label: string;
  risk?: 'low' | 'med' | 'high' | 'epic';
  apply: (ctx: EventContext) => string; // returns a short outcome message
}

export interface EventContext {
  character: Character;
  state: GameState;
  rand: () => number;
  log: (entry: { type: import('../types/Character').LifeEntryType; icon: string; text: string; tone?: 'good' | 'bad' | 'neutral' | 'epic' }) => void;
  patch: (patcher: (c: Character) => void) => void;
}

export interface EventDef {
  id: string;
  title: string;
  icon: string;
  description: (c: Character) => string;
  tone: 'good' | 'bad' | 'neutral' | 'epic';
  category: string;
  minAge: number;
  maxAge?: number;
  weight: number;
  guard?: (c: Character, s: GameState) => boolean;
  choices: EventChoiceDef[];
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));

export const EVENTS: EventDef[] = [
  // ===== CHILDHOOD =====
  {
    id: 'firstWords',
    title: 'First Words!',
    icon: '🍼',
    tone: 'good',
    category: 'Childhood',
    minAge: 1, maxAge: 2,
    weight: 6,
    description: (c) => `Your parents huddle around you, phone in hand. Looks like ${c.firstName} is about to talk for the first time…`,
    choices: [
      { label: 'Say "mama"', apply: ({ patch, log }) => { patch((c) => { c.core.happiness = clamp(c.core.happiness + 4); }); log({ type: 'family', icon: '🍼', text: 'Said the magic word: "mama". The room exploded.' , tone: 'good'}); return 'Family in tears.'; } },
      { label: 'Say "no"', risk: 'low', apply: ({ patch, log }) => { patch((c) => { c.core.happiness = clamp(c.core.happiness + 1); c.hidden.willpower = clamp(c.hidden.willpower + 4); }); log({ type: 'family', icon: '🍼', text: 'First word: "no". A future is taking shape.', tone: 'neutral' }); return 'Iconic.'; } },
      { label: 'Gurgle dramatically', apply: ({ patch, log }) => { patch((c) => { c.core.happiness = clamp(c.core.happiness + 2); }); log({ type: 'family', icon: '🍼', text: 'Mostly gurgled but the gurgling was very theatrical.', tone: 'good' }); return 'Critics call it stunning.'; } },
    ],
  },
  {
    id: 'birthdayParty',
    title: 'Birthday Party',
    icon: '🎂',
    tone: 'good',
    category: 'Childhood',
    minAge: 3, maxAge: 12,
    weight: 4,
    description: (c) => `Your parents throw you a small birthday party with cake, streamers, and exactly one suspicious clown.`,
    choices: [
      { label: 'Enjoy the cake', apply: ({ patch, log }) => { patch((c) => { c.core.happiness = clamp(c.core.happiness + 5); }); log({ type: 'family', icon: '🎂', text: 'Had cake. Felt seen.', tone: 'good' }); return 'Sugar high acquired.'; } },
      { label: 'Stare at the clown', risk: 'low', apply: ({ patch, log, rand }) => { if (rand() < 0.3) { patch((c) => { c.core.happiness = clamp(c.core.happiness - 6); c.hidden.craziness = clamp(c.hidden.craziness + 6); }); log({ type: 'family', icon: '🎂', text: 'The clown winked. You are not okay.', tone: 'bad' }); return 'Lifelong fear unlocked.'; } else { patch((c) => { c.core.happiness = clamp(c.core.happiness + 1); }); log({ type: 'family', icon: '🎂', text: 'Clown turned out to be fine. Probably.', tone: 'neutral' }); return 'Crisis averted.'; } } },
    ],
  },
  {
    id: 'imaginaryFriend',
    title: 'Imaginary Friend',
    icon: '👻',
    tone: 'neutral',
    category: 'Childhood',
    minAge: 4, maxAge: 9,
    weight: 3,
    description: () => `You start chatting to a small invisible friend who lives behind the couch.`,
    choices: [
      { label: 'Be best friends', apply: ({ patch, log }) => { patch((c) => { c.core.happiness = clamp(c.core.happiness + 4); c.hidden.craziness = clamp(c.hidden.craziness + 3); }); log({ type: 'friend', icon: '👻', text: 'You and your imaginary friend run a tight ship.', tone: 'neutral' }); return 'You have a confidant.'; } },
      { label: 'Tell them to leave', apply: ({ patch, log }) => { patch((c) => { c.core.happiness = clamp(c.core.happiness - 1); c.hidden.discipline = clamp(c.hidden.discipline + 2); }); log({ type: 'friend', icon: '👻', text: 'You evicted the imaginary tenant. Cold but fair.', tone: 'neutral' }); return 'Boundary set.'; } },
    ],
  },
  // ===== SCHOOL =====
  {
    id: 'pickedOn',
    title: 'Picked On',
    icon: '😢',
    tone: 'bad',
    category: 'School',
    minAge: 7, maxAge: 17,
    weight: 5,
    guard: (c) => c.education.level !== 'none' && c.education.level !== 'college' && c.education.level !== 'grad',
    description: (c) => `A classmate keeps making fun of ${c.firstName}'s lunch.`,
    choices: [
      { label: 'Tell a teacher', apply: ({ patch, log, rand }) => { if (rand() < 0.6) { patch((c) => { c.education.popularity = clamp(c.education.popularity - 5); c.core.happiness = clamp(c.core.happiness + 2); }); log({ type: 'school', icon: '🧑‍🏫', text: 'Teacher stepped in. Bully grounded.', tone: 'good' }); return 'Handled.'; } else { patch((c) => { c.education.popularity = clamp(c.education.popularity - 10); c.core.happiness = clamp(c.core.happiness - 6); }); log({ type: 'school', icon: '🧑‍🏫', text: 'Teacher did nothing. Snitch tax applied.', tone: 'bad' }); return 'Worse now.'; } } },
      { label: 'Fight back', risk: 'med', apply: ({ patch, log, rand }) => { if (rand() < 0.5) { patch((c) => { c.education.popularity = clamp(c.education.popularity + 10); c.core.happiness = clamp(c.core.happiness + 4); }); log({ type: 'school', icon: '👊', text: 'You decked the bully. Folk hero status.', tone: 'good' }); return 'Folk hero.'; } else { patch((c) => { c.core.health = clamp(c.core.health - 8); c.education.popularity = clamp(c.education.popularity - 6); }); log({ type: 'school', icon: '👊', text: 'Got pummeled. Worth it though?', tone: 'bad' }); return 'Ouch.'; } } },
      { label: 'Ignore it', apply: ({ patch, log }) => { patch((c) => { c.core.happiness = clamp(c.core.happiness - 4); c.hidden.willpower = clamp(c.hidden.willpower + 3); }); log({ type: 'school', icon: '😢', text: 'Took the high road. Cost you.', tone: 'bad' }); return 'Took the high road.'; } },
    ],
  },
  {
    id: 'crushSpotted',
    title: 'Heart Flutter',
    icon: '💘',
    tone: 'good',
    category: 'School',
    minAge: 12, maxAge: 17,
    weight: 4,
    description: () => `Someone in your class smiles at you across the room. Your stomach does a backflip.`,
    choices: [
      { label: 'Smile back', apply: ({ patch, log }) => { patch((c) => { c.core.happiness = clamp(c.core.happiness + 4); c.education.popularity = clamp(c.education.popularity + 4); }); log({ type: 'love', icon: '💘', text: 'A small smile. Big consequences.', tone: 'good' }); return 'Mutual.'; } },
      { label: 'Pretend you didn\'t see', apply: ({ patch, log }) => { patch((c) => { c.core.happiness = clamp(c.core.happiness - 2); }); log({ type: 'love', icon: '💘', text: 'You looked away. You will think about this in bed tonight.', tone: 'neutral' }); return 'Avoided.'; } },
    ],
  },
  // ===== HEALTH =====
  {
    id: 'fluSeason',
    title: 'Down With the Flu',
    icon: '🤒',
    tone: 'bad',
    category: 'Health',
    minAge: 2,
    weight: 3,
    description: () => `Your nose runs, your head pounds. Classic flu season.`,
    choices: [
      { label: 'Rest at home', apply: ({ patch, log }) => { patch((c) => { c.core.health = clamp(c.core.health - 3); }); log({ type: 'health', icon: '🤒', text: 'Slept through it. Recovered eventually.', tone: 'neutral' }); return 'Rested.'; } },
      { label: 'See a doctor', apply: ({ patch, log }) => { patch((c) => { c.core.health = clamp(c.core.health + 4); c.cash -= 250; }); log({ type: 'health', icon: '🩺', text: 'Doctor patched you up. Wallet not so much.', tone: 'neutral' }); return 'Healed.'; } },
      { label: 'Tough it out', risk: 'med', apply: ({ patch, log, rand }) => { if (rand() < 0.35) { patch((c) => { c.core.health = clamp(c.core.health - 14); }); log({ type: 'health', icon: '🤒', text: 'You toughed it out and it became pneumonia. Brave!', tone: 'bad' }); return 'Bad call.'; } else { patch((c) => { c.core.health = clamp(c.core.health - 1); c.hidden.willpower = clamp(c.hidden.willpower + 2); }); log({ type: 'health', icon: '💪', text: 'Walked it off. Hero stuff.', tone: 'good' }); return 'Walked it off.'; } } },
    ],
  },
  // ===== ADULT =====
  {
    id: 'loseWallet',
    title: 'Lost Wallet',
    icon: '👛',
    tone: 'bad',
    category: 'Money',
    minAge: 16,
    weight: 2,
    description: () => `You can't find your wallet. It was just here. Wasn't it?`,
    choices: [
      { label: 'Search frantically', apply: ({ patch, log, rand }) => { if (rand() < 0.5) { log({ type: 'money', icon: '👛', text: 'Found the wallet under the couch. Mild victory.', tone: 'good' }); return 'Found it!'; } else { patch((c) => { c.cash -= Math.min(c.cash, 200); }); log({ type: 'money', icon: '👛', text: 'Wallet gone. Cash gone. Card cancelled.', tone: 'bad' }); return 'Gone.'; } } },
      { label: 'Cancel cards', apply: ({ patch, log }) => { patch((c) => { c.cash -= Math.min(c.cash, 60); }); log({ type: 'money', icon: '💳', text: 'Cancelled the cards. Lost some cash but slept fine.', tone: 'neutral' }); return 'Cancelled.'; } },
    ],
  },
  {
    id: 'datingApp',
    title: 'Dating App Buzz',
    icon: '📱',
    tone: 'good',
    category: 'Love',
    minAge: 18, maxAge: 80,
    weight: 3,
    guard: (c) => !c.relationships.some((r) => r.role === 'spouse' || r.role === 'partner'),
    description: () => `Someone interesting just liked your profile.`,
    choices: [
      { label: 'Message them', apply: ({ patch, log, rand, state }) => { const ok = rand() < (state.powers.perfectCharm ? 0.85 : 0.55); if (ok) { patch((c) => { c.core.happiness = clamp(c.core.happiness + 4); }); log({ type: 'love', icon: '📱', text: 'A great first chat. You exchanged numbers.', tone: 'good' }); return 'New connection.'; } log({ type: 'love', icon: '📱', text: 'They ghosted you. Classic.', tone: 'bad' }); return 'Ghosted.'; } },
      { label: 'Swipe past', apply: ({ log }) => { log({ type: 'love', icon: '📱', text: 'You closed the app and touched grass.', tone: 'neutral' }); return 'Touched grass.'; } },
    ],
  },
  {
    id: 'raiseChance',
    title: 'Surprise Raise',
    icon: '💸',
    tone: 'good',
    category: 'Career',
    minAge: 18,
    weight: 3,
    guard: (c) => !!c.job && !c.prison.inPrison,
    description: (c) => `Your boss wants to see you. ${c.firstName} braces for the worst.`,
    choices: [
      { label: 'Stay cool', apply: ({ patch, log, rand }) => { if (rand() < 0.55) { patch((c) => { if (c.job) c.job.salary = Math.round(c.job.salary * 1.08); }); log({ type: 'job', icon: '💸', text: 'It was a raise. Cool prevails.', tone: 'good' }); return 'Raise.'; } else { log({ type: 'job', icon: '💸', text: 'It was just a meeting about meetings.', tone: 'neutral' }); return 'Meeting.'; } } },
    ],
  },
  // ===== CHAOS =====
  {
    id: 'streetMagician',
    title: 'Street Magician',
    icon: '🎩',
    tone: 'neutral',
    category: 'Chaos',
    minAge: 4,
    weight: 2,
    description: () => `A street magician asks you to pick a card. Any card.`,
    choices: [
      { label: 'Pick a card', apply: ({ patch, log, rand }) => { if (rand() < 0.5) { patch((c) => { c.core.happiness = clamp(c.core.happiness + 3); }); log({ type: 'chaos', icon: '🎩', text: 'They got it right. You gasped audibly.', tone: 'good' }); return 'Amazing.'; } else { patch((c) => { c.core.happiness = clamp(c.core.happiness + 1); }); log({ type: 'chaos', icon: '🎩', text: 'They got it wrong then ran. Strange day.', tone: 'neutral' }); return 'Strange.'; } } },
      { label: 'Walk away', apply: ({ log }) => { log({ type: 'chaos', icon: '🎩', text: 'You walked. Wisely.', tone: 'neutral' }); return 'Wise.'; } },
    ],
  },
  {
    id: 'inheritance',
    title: 'Inheritance Letter',
    icon: '📜',
    tone: 'good',
    category: 'Money',
    minAge: 25,
    weight: 1,
    description: (c) => `A distant relative of the ${c.lastName} family left you something in their will.`,
    choices: [
      { label: 'Read it', apply: ({ patch, log, rand }) => { const amount = Math.round(2000 + rand() * 75000); patch((c) => { c.cash += amount; }); log({ type: 'money', icon: '📜', text: `An aunt you never met left you $${amount.toLocaleString()}.`, tone: 'good' }); return `+$${amount.toLocaleString()}`; } },
    ],
  },
];

export function pickRandomEvent(c: Character, s: GameState, rand: () => number): EventDef | null {
  const eligible = EVENTS.filter((e) => c.age >= e.minAge && (e.maxAge === undefined || c.age <= e.maxAge) && (!e.guard || e.guard(c, s)));
  if (eligible.length === 0) return null;
  const total = eligible.reduce((s, e) => s + e.weight, 0);
  let r = rand() * total;
  for (const e of eligible) {
    r -= e.weight;
    if (r <= 0) return e;
  }
  return eligible[eligible.length - 1];
}
