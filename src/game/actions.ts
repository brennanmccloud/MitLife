import type { Character, Relationship } from '../types/Character';
import type { GameState, PowerFlags } from '../types/GameState';
import { REGULAR_CAREERS, SPECIAL_CAREERS, type CareerDef, COLLEGE_MAJORS } from '../data/careers';
import { chance, clamp, pick, rangeInt, uid } from '../utils/rand';
import { logEntry, recomputeStatus } from './ageUp';
import { randomFirstName, randomLastName } from '../data/names';
import { COUNTRIES, getCountry } from '../data/countries';

export interface ActionResult {
  ok: boolean;
  message: string;
  tone?: 'good' | 'bad' | 'neutral';
}

const C = (n: number) => clamp(n, 0, 100);

// ===== School =====
export function studyHarder(c: Character): ActionResult {
  if (c.education.level === 'none') return { ok: false, message: 'Not in school.' };
  c.education.grades = C(c.education.grades + rangeInt(3, 8));
  c.core.happiness = C(c.core.happiness - 2);
  c.core.intelligence = C(c.core.intelligence + 1);
  c.journal.push(logEntry(c.age, 'school', '📚', 'Hit the books harder this year.', 'good'));
  return { ok: true, message: 'Grades improved.', tone: 'good' };
}

export function skipSchool(c: Character): ActionResult {
  if (c.education.level === 'none') return { ok: false, message: 'Not in school.' };
  c.education.grades = C(c.education.grades - rangeInt(4, 10));
  c.core.happiness = C(c.core.happiness + 4);
  c.education.popularity = C(c.education.popularity + 4);
  c.journal.push(logEntry(c.age, 'school', '🛹', 'Skipped class. Felt free.', 'neutral'));
  return { ok: true, message: 'Skipped school.', tone: 'neutral' };
}

export function joinClub(c: Character): ActionResult {
  if (c.education.level === 'none') return { ok: false, message: 'Not in school.' };
  c.education.popularity = C(c.education.popularity + 6);
  c.core.happiness = C(c.core.happiness + 3);
  c.journal.push(logEntry(c.age, 'school', '🎭', 'Joined a school club.', 'good'));
  return { ok: true, message: 'Joined club.', tone: 'good' };
}

export function joinSport(c: Character): ActionResult {
  if (c.education.level === 'none') return { ok: false, message: 'Not in school.' };
  c.education.popularity = C(c.education.popularity + 5);
  c.core.health = C(c.core.health + 4);
  c.hidden.sportsTalent = C(c.hidden.sportsTalent + 3);
  c.journal.push(logEntry(c.age, 'school', '⚽', 'Joined a school sport.', 'good'));
  return { ok: true, message: 'Joined sport.', tone: 'good' };
}

export function applyCollege(c: Character, major: string, powers: PowerFlags): ActionResult {
  if (c.age < 18) return { ok: false, message: 'Too young.' };
  if (!c.education.degrees.some((d) => d.includes('High School'))) {
    return { ok: false, message: 'Need to finish high school first.' };
  }
  if (powers.instantDiploma) {
    c.education.degrees.push(`Bachelor's in ${major}`);
    c.education.graduated = true;
    c.journal.push(logEntry(c.age, 'school', '🎓', `Used Instant Diploma — instantly earned a degree in ${major}.`, 'good'));
    return { ok: true, message: 'Diploma granted!', tone: 'good' };
  }
  if (c.education.grades < 50 && c.core.intelligence < 50) {
    return { ok: false, message: 'College rejected your application.', tone: 'bad' };
  }
  c.education.level = 'college';
  c.education.major = major;
  c.education.yearsInLevel = 0;
  c.education.grades = clamp(50 + (c.core.intelligence - 50) * 0.2);
  c.cash -= 2000;
  c.journal.push(logEntry(c.age, 'school', '🎒', `Enrolled in college studying ${major}.`, 'good'));
  return { ok: true, message: 'Enrolled in college.', tone: 'good' };
}

export function applyGradSchool(c: Character, major: string): ActionResult {
  if (!c.education.degrees.some((d) => d.startsWith("Bachelor's"))) {
    return { ok: false, message: 'Need a bachelor\'s first.' };
  }
  c.education.level = 'grad';
  c.education.major = major;
  c.education.yearsInLevel = 0;
  c.cash -= 4000;
  c.journal.push(logEntry(c.age, 'school', '🎓', `Started graduate school in ${major}.`, 'good'));
  return { ok: true, message: 'Grad school enrolled.', tone: 'good' };
}

// ===== Career =====
export function listAvailableJobs(c: Character, powers: PowerFlags): CareerDef[] {
  const all = [...REGULAR_CAREERS, ...(powers.careerPack ? SPECIAL_CAREERS : [])];
  return all.filter((j) => {
    if (j.minEducation === 'high' && !c.education.degrees.some((d) => d.includes('High School Diploma'))) return false;
    if (j.minEducation === 'college' && !c.education.degrees.some((d) => d.startsWith("Bachelor's"))) return false;
    if (j.minEducation === 'grad' && !c.education.degrees.some((d) => d.includes('Graduate'))) return false;
    if (j.minMajor && !j.minMajor.some((m) => c.education.degrees.some((d) => d.includes(m)))) return false;
    if (j.smartsReq && c.core.intelligence < j.smartsReq) return false;
    if (j.appearanceReq && c.core.appearance < j.appearanceReq) return false;
    return true;
  });
}

export function takeJob(c: Character, def: CareerDef, powers: PowerFlags): ActionResult {
  if (c.age < 16) return { ok: false, message: 'Too young.' };
  const fameBoost = powers.fameSpark && def.fame ? 65 : 0;
  c.job = {
    id: uid('job'),
    title: def.title,
    field: def.field,
    salary: def.baseSalary,
    performance: 50,
    stress: 30,
    years: 0,
    bossBond: rangeInt(20, 80),
    fame: def.fame,
    special: def.special,
  };
  if (fameBoost) c.extra.fame = C(c.extra.fame + fameBoost);
  c.journal.push(logEntry(c.age, 'job', '💼', `Got hired as a ${def.title}.${fameBoost ? ' Instant fame.' : ''}`, 'good'));
  return { ok: true, message: `Hired as ${def.title}.`, tone: 'good' };
}

export function workHarder(c: Character): ActionResult {
  if (!c.job) return { ok: false, message: 'No job.' };
  c.job.performance = C(c.job.performance + rangeInt(5, 12));
  c.job.stress = C(c.job.stress + 6);
  c.core.happiness = C(c.core.happiness - 2);
  c.journal.push(logEntry(c.age, 'job', '🛠️', 'Stayed late this week. Performance up.', 'good'));
  return { ok: true, message: 'Performance up.', tone: 'good' };
}

export function askForRaise(c: Character): ActionResult {
  if (!c.job) return { ok: false, message: 'No job.' };
  const p = (c.job.performance / 100) * 0.7 + 0.1;
  if (chance(p)) {
    c.job.salary = Math.round(c.job.salary * 1.12);
    c.journal.push(logEntry(c.age, 'job', '💵', `Got a raise. Salary is now $${c.job.salary.toLocaleString()}.`, 'good'));
    return { ok: true, message: 'Raise granted.', tone: 'good' };
  }
  c.job.bossBond = C((c.job.bossBond ?? 50) - 8);
  c.journal.push(logEntry(c.age, 'job', '💵', 'Boss rejected the raise request.', 'bad'));
  return { ok: true, message: 'Denied.', tone: 'bad' };
}

export function applyPromotion(c: Character): ActionResult {
  if (!c.job) return { ok: false, message: 'No job.' };
  const p = (c.job.performance / 100) * 0.5;
  if (chance(p)) {
    c.job.salary = Math.round(c.job.salary * 1.3);
    c.job.title = c.job.title.startsWith('Senior ') ? `Lead ${c.job.title.slice(7)}` : `Senior ${c.job.title}`;
    c.journal.push(logEntry(c.age, 'job', '⬆️', `Promoted to ${c.job.title}.`, 'good'));
    return { ok: true, message: 'Promoted!', tone: 'good' };
  }
  c.journal.push(logEntry(c.age, 'job', '⬆️', 'Promotion denied.', 'bad'));
  return { ok: true, message: 'Denied.', tone: 'bad' };
}

export function quitJob(c: Character): ActionResult {
  if (!c.job) return { ok: false, message: 'No job.' };
  c.journal.push(logEntry(c.age, 'job', '👋', `Quit job as ${c.job.title}.`, 'neutral'));
  c.job = null;
  return { ok: true, message: 'Quit.', tone: 'neutral' };
}

export function retire(c: Character): ActionResult {
  if (c.age < 50) return { ok: false, message: 'Too young to retire.' };
  if (c.job) {
    c.journal.push(logEntry(c.age, 'job', '🏖️', `Retired from ${c.job.title}.`, 'good'));
    c.job = null;
  } else {
    c.journal.push(logEntry(c.age, 'job', '🏖️', 'Officially retired.', 'good'));
  }
  c.core.happiness = C(c.core.happiness + 8);
  return { ok: true, message: 'Retired.', tone: 'good' };
}

// ===== Relationships =====
export function findRel(c: Character, id: string): Relationship | undefined {
  return c.relationships.find((r) => r.id === id);
}

export function spendTime(c: Character, id: string, powers: PowerFlags): ActionResult {
  const r = findRel(c, id);
  if (!r || !r.alive) return { ok: false, message: 'Unavailable.' };
  const boost = powers.perfectCharm ? rangeInt(6, 12) : rangeInt(3, 8);
  r.bond = clamp(r.bond + boost, -100, 100);
  c.core.happiness = C(c.core.happiness + 2);
  c.journal.push(logEntry(c.age, 'family', '🤝', `Spent time with ${r.name}.`, 'good'));
  return { ok: true, message: 'Bonded.', tone: 'good' };
}

export function compliment(c: Character, id: string, powers: PowerFlags): ActionResult {
  const r = findRel(c, id);
  if (!r || !r.alive) return { ok: false, message: 'Unavailable.' };
  const boost = powers.perfectCharm ? rangeInt(4, 9) : rangeInt(1, 6);
  r.bond = clamp(r.bond + boost, -100, 100);
  c.journal.push(logEntry(c.age, 'family', '💬', `Complimented ${r.name}.`, 'good'));
  return { ok: true, message: 'Sweet.', tone: 'good' };
}

export function insult(c: Character, id: string): ActionResult {
  const r = findRel(c, id);
  if (!r || !r.alive) return { ok: false, message: 'Unavailable.' };
  r.bond = clamp(r.bond - rangeInt(5, 15), -100, 100);
  c.journal.push(logEntry(c.age, 'family', '😡', `Insulted ${r.name}.`, 'bad'));
  return { ok: true, message: 'Harsh.', tone: 'bad' };
}

export function argue(c: Character, id: string): ActionResult {
  const r = findRel(c, id);
  if (!r || !r.alive) return { ok: false, message: 'Unavailable.' };
  r.bond = clamp(r.bond - rangeInt(3, 10), -100, 100);
  c.core.happiness = C(c.core.happiness - 3);
  c.journal.push(logEntry(c.age, 'family', '🗯️', `Got into a fight with ${r.name}.`, 'bad'));
  return { ok: true, message: 'Tense.', tone: 'bad' };
}

export function apologize(c: Character, id: string): ActionResult {
  const r = findRel(c, id);
  if (!r || !r.alive) return { ok: false, message: 'Unavailable.' };
  r.bond = clamp(r.bond + rangeInt(4, 10), -100, 100);
  c.journal.push(logEntry(c.age, 'family', '🙏', `Apologized to ${r.name}.`, 'good'));
  return { ok: true, message: 'Forgiven (mostly).', tone: 'good' };
}

export function giftMoney(c: Character, id: string, amount: number): ActionResult {
  const r = findRel(c, id);
  if (!r || !r.alive) return { ok: false, message: 'Unavailable.' };
  if (c.cash < amount) return { ok: false, message: 'Not enough cash.' };
  c.cash -= amount;
  r.bond = clamp(r.bond + Math.min(20, amount / 100), -100, 100);
  c.journal.push(logEntry(c.age, 'family', '🎁', `Gave $${amount.toLocaleString()} to ${r.name}.`, 'good'));
  return { ok: true, message: 'Generous.', tone: 'good' };
}

export function askForMoney(c: Character, id: string): ActionResult {
  const r = findRel(c, id);
  if (!r || !r.alive) return { ok: false, message: 'Unavailable.' };
  if (r.bond > 40 && chance(0.6)) {
    const amount = rangeInt(50, Math.max(200, r.stats.money * 100));
    c.cash += amount;
    r.bond = clamp(r.bond - 5, -100, 100);
    c.journal.push(logEntry(c.age, 'money', '🤲', `${r.name} gave you $${amount.toLocaleString()}.`, 'good'));
    return { ok: true, message: `Got $${amount.toLocaleString()}.`, tone: 'good' };
  }
  r.bond = clamp(r.bond - 6, -100, 100);
  c.journal.push(logEntry(c.age, 'money', '🤲', `${r.name} said no.`, 'bad'));
  return { ok: true, message: 'No dice.', tone: 'bad' };
}

export function startDating(c: Character, powers: PowerFlags): ActionResult {
  if (c.age < 14) return { ok: false, message: 'Too young to date.' };
  if (c.relationships.some((r) => r.role === 'spouse' || r.role === 'partner')) {
    return { ok: false, message: 'You\'re already in a relationship.' };
  }
  const gender = pick(['female', 'male', 'nonbinary'] as const);
  const partner: Relationship = {
    id: uid('rel'),
    name: `${randomFirstName(gender)} ${randomLastName()}`,
    role: 'partner',
    age: c.age + rangeInt(-3, 4),
    alive: true,
    bond: rangeInt(40, 70) + (powers.perfectCharm ? 20 : 0),
    avatar: { hair: pick(['black', 'brown', 'blonde', 'red', 'pink']), skin: pick(['porcelain', 'sand', 'tan', 'bronze', 'umber', 'ebony']), gender, accessory: 'none' },
    stats: {
      looks: rangeInt(30, 95),
      intelligence: rangeInt(20, 95),
      money: rangeInt(10, 80),
      craziness: rangeInt(10, 80),
      loyalty: rangeInt(40, 95),
      temper: rangeInt(10, 80),
    },
  };
  c.relationships.push(partner);
  c.core.happiness = C(c.core.happiness + 6);
  c.journal.push(logEntry(c.age, 'love', '💞', `Started dating ${partner.name}.`, 'good'));
  return { ok: true, message: `Dating ${partner.name}!`, tone: 'good' };
}

export function propose(c: Character, id: string, powers: PowerFlags): ActionResult {
  const r = findRel(c, id);
  if (!r || !r.alive) return { ok: false, message: 'Unavailable.' };
  if (r.role !== 'partner') return { ok: false, message: 'Need to be dating first.' };
  const p = (r.bond / 100) * 0.7 + 0.1 + (powers.perfectCharm ? 0.3 : 0);
  if (chance(p)) {
    r.role = 'spouse';
    r.bond = clamp(r.bond + 15, -100, 100);
    c.core.happiness = C(c.core.happiness + 15);
    c.cash -= Math.min(c.cash, 8000);
    c.journal.push(logEntry(c.age, 'love', '💍', `Married ${r.name}.`, 'epic'));
    return { ok: true, message: 'Engaged & married!', tone: 'good' };
  }
  r.bond = clamp(r.bond - 10, -100, 100);
  c.journal.push(logEntry(c.age, 'love', '💔', `${r.name} said no to the proposal.`, 'bad'));
  return { ok: true, message: 'Rejected.', tone: 'bad' };
}

export function divorce(c: Character, id: string): ActionResult {
  const r = findRel(c, id);
  if (!r || r.role !== 'spouse') return { ok: false, message: 'Not married.' };
  r.role = 'ex';
  r.bond = -30;
  c.cash = Math.max(0, Math.round(c.cash / 2));
  c.core.happiness = C(c.core.happiness - 10);
  c.journal.push(logEntry(c.age, 'love', '📑', `Divorced ${r.name}.`, 'bad'));
  return { ok: true, message: 'Divorced.', tone: 'bad' };
}

export function tryForBaby(c: Character, partnerId: string, powers: PowerFlags, opts?: { count?: 1 | 2 | 3; gender?: 'female' | 'male' | 'nonbinary'; talent?: keyof Character['hidden'] }): ActionResult {
  const p = findRel(c, partnerId);
  if (!p || !p.alive) return { ok: false, message: 'Unavailable.' };
  if (p.role !== 'spouse' && p.role !== 'partner') return { ok: false, message: 'Need to be with them.' };
  if (c.age < 18) return { ok: false, message: 'Too young.' };
  if (p.pregnantWeeks !== undefined) return { ok: false, message: 'Already expecting.' };
  if (!powers.miracleCradle) {
    if (chance(c.hidden.fertility / 200)) {
      p.pregnantWeeks = 0;
      p.pregnantBabies = chance(0.08) ? 2 : 1;
      p.pregnantBy = c.id;
      c.journal.push(logEntry(c.age, 'baby', '🤰', `${p.name} is expecting!`, 'good'));
      return { ok: true, message: 'Pregnancy!', tone: 'good' };
    }
    c.journal.push(logEntry(c.age, 'baby', '🤰', 'No luck this time.', 'neutral'));
    return { ok: true, message: 'No luck.', tone: 'neutral' };
  }
  // Miracle Cradle guaranteed
  p.pregnantWeeks = 0;
  p.pregnantBabies = opts?.count ?? 1;
  p.pregnantGender = opts?.gender;
  p.pregnantTalent = opts?.talent;
  p.pregnantBy = c.id;
  c.journal.push(logEntry(c.age, 'baby', '🍼', `Used Miracle Cradle — ${p.name} is expecting ${opts?.count ?? 1}!`, 'epic'));
  return { ok: true, message: 'Guaranteed pregnancy!', tone: 'good' };
}

export function adopt(c: Character): ActionResult {
  if (c.age < 21) return { ok: false, message: 'Too young to adopt.' };
  if (c.cash < 8000) return { ok: false, message: 'Adoption fees are too high.' };
  c.cash -= 8000;
  const gender = pick(['female', 'male', 'nonbinary'] as const);
  const child: Relationship = {
    id: uid('rel'),
    name: `${randomFirstName(gender)} ${c.lastName}`,
    role: 'child',
    age: rangeInt(0, 5),
    alive: true,
    bond: 70,
    avatar: { hair: pick(['black', 'brown', 'blonde', 'red']), skin: pick(['porcelain', 'sand', 'tan', 'bronze', 'umber', 'ebony']), gender, accessory: 'none' },
    stats: {
      looks: rangeInt(30, 95),
      intelligence: rangeInt(30, 95),
      money: 0,
      craziness: rangeInt(10, 60),
      loyalty: rangeInt(50, 95),
      temper: rangeInt(10, 60),
    },
  };
  c.relationships.push(child);
  c.core.happiness = C(c.core.happiness + 10);
  c.journal.push(logEntry(c.age, 'baby', '👶', `Adopted ${child.name}.`, 'good'));
  return { ok: true, message: `Adopted ${child.name}.`, tone: 'good' };
}

// ===== Activities =====
export function gym(c: Character): ActionResult {
  if (c.age < 8) return { ok: false, message: 'Too young.' };
  c.core.health = C(c.core.health + rangeInt(3, 6));
  c.core.appearance = C(c.core.appearance + 2);
  c.cash -= 60;
  c.journal.push(logEntry(c.age, 'health', '🏋️', 'Hit the gym.', 'good'));
  return { ok: true, message: 'Stronger.', tone: 'good' };
}
export function meditate(c: Character): ActionResult {
  c.core.happiness = C(c.core.happiness + rangeInt(3, 7));
  c.hidden.willpower = C(c.hidden.willpower + 2);
  c.journal.push(logEntry(c.age, 'health', '🧘', 'Meditated.', 'good'));
  return { ok: true, message: 'Calmed.', tone: 'good' };
}
export function library(c: Character): ActionResult {
  c.core.intelligence = C(c.core.intelligence + rangeInt(2, 5));
  c.journal.push(logEntry(c.age, 'health', '📚', 'Read all day.', 'good'));
  return { ok: true, message: 'Smarter.', tone: 'good' };
}
export function doctor(c: Character): ActionResult {
  if (c.cash < 200) return { ok: false, message: 'Need $200.' };
  c.cash -= 200;
  c.core.health = C(c.core.health + rangeInt(5, 10));
  c.journal.push(logEntry(c.age, 'health', '🩺', 'Visited the doctor.', 'good'));
  return { ok: true, message: 'Healthier.', tone: 'good' };
}
export function plasticSurgery(c: Character): ActionResult {
  if (c.age < 18) return { ok: false, message: 'Too young.' };
  if (c.cash < 5000) return { ok: false, message: 'Need $5,000.' };
  c.cash -= 5000;
  if (chance(0.8)) {
    c.core.appearance = C(c.core.appearance + rangeInt(8, 18));
    c.journal.push(logEntry(c.age, 'health', '💅', 'Plastic surgery went well.', 'good'));
    return { ok: true, message: 'Glow up.', tone: 'good' };
  }
  c.core.appearance = C(c.core.appearance - rangeInt(8, 18));
  c.journal.push(logEntry(c.age, 'health', '💅', 'Plastic surgery went wrong.', 'bad'));
  return { ok: true, message: 'Botched.', tone: 'bad' };
}
export function nightlife(c: Character): ActionResult {
  if (c.age < 18) return { ok: false, message: 'Too young.' };
  c.core.happiness = C(c.core.happiness + rangeInt(3, 8));
  c.core.health = C(c.core.health - 1);
  c.cash -= 120;
  c.journal.push(logEntry(c.age, 'health', '🍸', 'Went out for the night.', 'good'));
  return { ok: true, message: 'Fun.', tone: 'good' };
}
export function vacation(c: Character): ActionResult {
  if (c.cash < 2000) return { ok: false, message: 'Need $2,000.' };
  c.cash -= 2000;
  c.core.happiness = C(c.core.happiness + rangeInt(10, 18));
  c.journal.push(logEntry(c.age, 'health', '🏖️', 'Took a vacation.', 'good'));
  return { ok: true, message: 'Recharged.', tone: 'good' };
}
export function socialMedia(c: Character): ActionResult {
  if (c.age < 13) return { ok: false, message: 'Too young.' };
  c.extra.fame = C(c.extra.fame + rangeInt(1, 4));
  c.core.happiness = C(c.core.happiness + (chance(0.5) ? 2 : -3));
  c.journal.push(logEntry(c.age, 'fame', '📱', 'Posted online.', 'neutral'));
  return { ok: true, message: 'Posted.', tone: 'neutral' };
}
export function lottery(c: Character): ActionResult {
  if (c.age < 18) return { ok: false, message: 'Too young.' };
  if (c.cash < 5) return { ok: false, message: 'Too broke for the lottery.' };
  c.cash -= 5;
  if (chance(0.001)) {
    const win = rangeInt(100000, 5000000);
    c.cash += win;
    c.journal.push(logEntry(c.age, 'money', '🎰', `Won the lottery! +$${win.toLocaleString()}.`, 'epic'));
    return { ok: true, message: `JACKPOT $${win.toLocaleString()}!`, tone: 'good' };
  }
  return { ok: true, message: 'No win.', tone: 'neutral' };
}
export function casino(c: Character): ActionResult {
  if (c.age < 21) return { ok: false, message: 'Too young.' };
  const bet = Math.min(500, c.cash);
  if (bet < 10) return { ok: false, message: 'Too broke.' };
  c.cash -= bet;
  if (chance(0.45 + c.hidden.luck / 400)) {
    const win = bet * rangeInt(2, 4);
    c.cash += win;
    c.journal.push(logEntry(c.age, 'money', '🎲', `Won $${win.toLocaleString()} at the casino.`, 'good'));
    return { ok: true, message: `Won $${win.toLocaleString()}!`, tone: 'good' };
  }
  c.journal.push(logEntry(c.age, 'money', '🎲', `Lost $${bet.toLocaleString()} at the casino.`, 'bad'));
  return { ok: true, message: `Lost $${bet.toLocaleString()}.`, tone: 'bad' };
}
export function emigrate(c: Character, country: string, powers: PowerFlags): ActionResult {
  if (c.age < 18) return { ok: false, message: 'Too young.' };
  const target = COUNTRIES.find((co) => co.name === country);
  if (!target) return { ok: false, message: 'Country unavailable.' };
  if (!powers.globalPass && chance(0.5)) {
    return { ok: false, message: 'Visa denied.', tone: 'bad' };
  }
  c.country = target.name;
  c.countryFlag = target.flag;
  c.job = null;
  c.journal.push(logEntry(c.age, 'family', '🛫', `Moved to ${target.name}.${powers.globalPass ? ' (Global Pass used)' : ''}`, 'good'));
  return { ok: true, message: `Now living in ${target.name}.`, tone: 'good' };
}

// ===== Crime =====
export interface CrimeDef {
  id: string;
  name: string;
  minAge: number;
  baseSuccess: number;
  baseArrest: number;
  rewardMin: number;
  rewardMax: number;
  sentence: [number, number];
  notoriety: number;
  karma: number;
  lethal?: boolean;
}

export const CRIMES: CrimeDef[] = [
  { id: 'shoplift', name: 'Shoplift', minAge: 10, baseSuccess: 0.6, baseArrest: 0.3, rewardMin: 5, rewardMax: 200, sentence: [0, 1], notoriety: 2, karma: -2 },
  { id: 'pickpocket', name: 'Pickpocket', minAge: 12, baseSuccess: 0.5, baseArrest: 0.35, rewardMin: 20, rewardMax: 500, sentence: [0, 2], notoriety: 3, karma: -3 },
  { id: 'cartheft', name: 'Steal Car', minAge: 16, baseSuccess: 0.4, baseArrest: 0.45, rewardMin: 2000, rewardMax: 30000, sentence: [1, 5], notoriety: 8, karma: -8 },
  { id: 'burglary', name: 'Burgle House', minAge: 16, baseSuccess: 0.45, baseArrest: 0.4, rewardMin: 1000, rewardMax: 50000, sentence: [2, 8], notoriety: 10, karma: -10 },
  { id: 'bank', name: 'Rob Bank', minAge: 18, baseSuccess: 0.25, baseArrest: 0.6, rewardMin: 50000, rewardMax: 1500000, sentence: [5, 20], notoriety: 25, karma: -15 },
  { id: 'scam', name: 'Run a Scam', minAge: 18, baseSuccess: 0.5, baseArrest: 0.3, rewardMin: 500, rewardMax: 20000, sentence: [1, 5], notoriety: 6, karma: -6 },
  { id: 'hack', name: 'Hack', minAge: 14, baseSuccess: 0.45, baseArrest: 0.35, rewardMin: 1000, rewardMax: 80000, sentence: [2, 7], notoriety: 8, karma: -6 },
  { id: 'extort', name: 'Extort', minAge: 18, baseSuccess: 0.4, baseArrest: 0.4, rewardMin: 2000, rewardMax: 60000, sentence: [3, 10], notoriety: 12, karma: -10 },
  { id: 'assault', name: 'Assault', minAge: 14, baseSuccess: 0.6, baseArrest: 0.4, rewardMin: 0, rewardMax: 0, sentence: [1, 8], notoriety: 12, karma: -15 },
  { id: 'murder', name: 'Murder', minAge: 16, baseSuccess: 0.45, baseArrest: 0.7, rewardMin: 0, rewardMax: 0, sentence: [25, 60], notoriety: 50, karma: -50, lethal: true },
  { id: 'train', name: 'Train Heist', minAge: 18, baseSuccess: 0.2, baseArrest: 0.7, rewardMin: 80000, rewardMax: 2500000, sentence: [10, 25], notoriety: 30, karma: -18 },
  { id: 'blackmarket', name: 'Black Market', minAge: 18, baseSuccess: 0.55, baseArrest: 0.35, rewardMin: 3000, rewardMax: 90000, sentence: [3, 10], notoriety: 10, karma: -8 },
];

export interface CrimeResult {
  ok: boolean;
  message: string;
  outcome: 'success' | 'caught' | 'killed';
  reward?: number;
  sentence?: number;
}

export function commitCrime(c: Character, crime: CrimeDef, powers: PowerFlags): CrimeResult {
  if (c.age < crime.minAge) return { ok: false, message: 'Too young.', outcome: 'caught' };
  const talentBoost = c.hidden.crimeTalent / 200;
  const luckBoost = c.hidden.luck / 400;
  let arrest = crime.baseArrest - talentBoost - luckBoost;
  if (crime.lethal && powers.shadowBlade) arrest -= 0.6;
  arrest = Math.max(0.03, Math.min(0.95, arrest));
  const success = chance(crime.baseSuccess + talentBoost);
  c.hidden.karma = clamp(c.hidden.karma + crime.karma, 0, 100);

  if (crime.lethal && chance(0.05)) {
    // Self gets killed
    c.alive = false;
    c.causeOfDeath = `Killed while attempting ${crime.name.toLowerCase()}`;
    c.journal.push(logEntry(c.age, 'crime', '☠️', `Killed while attempting ${crime.name.toLowerCase()}.`, 'bad'));
    return { ok: true, message: 'You were killed.', outcome: 'killed' };
  }

  if (chance(arrest)) {
    const sentence = rangeInt(crime.sentence[0], crime.sentence[1]);
    if (sentence > 0) {
      c.prison.inPrison = true;
      c.prison.yearsRemaining = sentence;
      c.prison.totalSentence = sentence;
      c.prison.security = sentence > 10 ? 'max' : sentence > 4 ? 'medium' : 'minimum';
    }
    c.crimes.push({ age: c.age, crime: crime.name, outcome: 'caught' });
    c.journal.push(logEntry(c.age, 'crime', '🚓', `Caught attempting ${crime.name.toLowerCase()}. Sentenced to ${sentence}y.`, 'bad'));
    return { ok: true, message: `Caught. ${sentence}y.`, outcome: 'caught', sentence };
  }

  if (!success) {
    c.journal.push(logEntry(c.age, 'crime', '😤', `Failed to ${crime.name.toLowerCase()} but escaped.`, 'neutral'));
    c.crimes.push({ age: c.age, crime: crime.name, outcome: 'escaped' });
    return { ok: true, message: 'Failed but escaped.', outcome: 'success' };
  }

  const reward = rangeInt(crime.rewardMin, crime.rewardMax);
  c.cash += reward;
  c.extra.notoriety = clamp(c.extra.notoriety + crime.notoriety, 0, 100);
  c.crimes.push({ age: c.age, crime: crime.name, outcome: 'escaped' });
  c.journal.push(logEntry(c.age, 'crime', '🦹', `Got away with ${crime.name.toLowerCase()}. +$${reward.toLocaleString()}.`, 'good'));
  return { ok: true, message: `Score: +$${reward.toLocaleString()}.`, outcome: 'success', reward };
}

export function useJailbreak(c: Character): ActionResult {
  if (!c.prison.inPrison) return { ok: false, message: 'Not in prison.' };
  c.prison.inPrison = false;
  c.prison.yearsRemaining = 0;
  c.prison.totalSentence = 0;
  c.crimes = [];
  c.journal.push(logEntry(c.age, 'prison', '🗝️', 'Used Jailbreak Card. Walked out a free person. Record erased.', 'epic'));
  return { ok: true, message: 'Freedom.', tone: 'good' };
}

export function appealSentence(c: Character): ActionResult {
  if (!c.prison.inPrison) return { ok: false, message: 'Not in prison.' };
  if (chance(0.3)) {
    const cut = rangeInt(1, Math.max(1, Math.floor(c.prison.yearsRemaining / 2)));
    c.prison.yearsRemaining = Math.max(0, c.prison.yearsRemaining - cut);
    c.journal.push(logEntry(c.age, 'prison', '⚖️', `Appeal succeeded — ${cut} years off.`, 'good'));
    return { ok: true, message: `-${cut}y.`, tone: 'good' };
  }
  c.journal.push(logEntry(c.age, 'prison', '⚖️', 'Appeal denied.', 'bad'));
  return { ok: true, message: 'Denied.', tone: 'bad' };
}

export function escapeAttempt(c: Character): ActionResult {
  if (!c.prison.inPrison) return { ok: false, message: 'Not in prison.' };
  const p = 0.18 + c.hidden.luck / 500;
  if (chance(p)) {
    c.prison.inPrison = false;
    c.prison.yearsRemaining = 0;
    c.journal.push(logEntry(c.age, 'prison', '🏃', 'Escaped from prison!', 'good'));
    return { ok: true, message: 'Escaped!', tone: 'good' };
  }
  c.prison.yearsRemaining += 2;
  c.journal.push(logEntry(c.age, 'prison', '🏃', 'Escape failed. +2y added.', 'bad'));
  return { ok: true, message: 'Failed. +2y.', tone: 'bad' };
}

// ===== Assets =====
export interface AssetTemplate {
  kind: import('../types/Character').Asset['kind'];
  name: string;
  price: number;
  yield?: number;
  emoji: string;
}

export const ASSET_CATALOG: AssetTemplate[] = [
  { kind: 'car', name: 'Used Hatchback', price: 4500, emoji: '🚗' },
  { kind: 'car', name: 'Sport Sedan', price: 38000, emoji: '🚙' },
  { kind: 'car', name: 'Hyper Coupe', price: 280000, emoji: '🏎️' },
  { kind: 'house', name: 'Tiny Apartment', price: 75000, yield: 600, emoji: '🏠' },
  { kind: 'house', name: 'Suburban House', price: 320000, yield: 1800, emoji: '🏡' },
  { kind: 'house', name: 'Mansion', price: 2400000, yield: 12000, emoji: '🏰' },
  { kind: 'jewelry', name: 'Diamond Necklace', price: 18000, emoji: '💎' },
  { kind: 'jewelry', name: 'Heirloom Watch', price: 65000, emoji: '⌚' },
  { kind: 'plane', name: 'Private Jet', price: 7500000, emoji: '✈️' },
  { kind: 'boat', name: 'Yacht', price: 3400000, emoji: '🛥️' },
  { kind: 'business', name: 'Small Cafe', price: 90000, yield: 2400, emoji: '☕' },
  { kind: 'business', name: 'Tech Startup', price: 500000, yield: 24000, emoji: '💻' },
  { kind: 'stock', name: 'Index Fund Shares', price: 5000, yield: 350, emoji: '📈' },
  { kind: 'crypto', name: 'Volatile Coin Stash', price: 10000, yield: 0, emoji: '🪙' },
];

export function buyAsset(c: Character, t: AssetTemplate): ActionResult {
  if (c.cash < t.price) return { ok: false, message: 'Not enough cash.' };
  c.cash -= t.price;
  c.assets.push({ id: uid('asset'), kind: t.kind, name: t.name, value: t.price, paid: t.price, yield: t.yield });
  c.journal.push(logEntry(c.age, 'asset', t.emoji, `Bought a ${t.name} for $${t.price.toLocaleString()}.`, 'good'));
  return { ok: true, message: `Bought ${t.name}.`, tone: 'good' };
}
export function sellAsset(c: Character, id: string): ActionResult {
  const idx = c.assets.findIndex((a) => a.id === id);
  if (idx < 0) return { ok: false, message: 'Asset not found.' };
  const a = c.assets[idx];
  const factor = a.kind === 'crypto' ? (Math.random() < 0.4 ? rangeInt(2, 8) : rangeInt(20, 70) / 100) : rangeInt(70, 110) / 100;
  const price = Math.max(0, Math.round(a.value * factor));
  c.cash += price;
  c.assets.splice(idx, 1);
  c.journal.push(logEntry(c.age, 'asset', '💵', `Sold ${a.name} for $${price.toLocaleString()}.`, 'neutral'));
  return { ok: true, message: `Sold for $${price.toLocaleString()}.`, tone: 'neutral' };
}

// ===== Special powers =====
export function rewindYear(state: GameState): ActionResult {
  if (!state.previousCharacter) return { ok: false, message: 'Nothing to rewind.' };
  state.character = JSON.parse(JSON.stringify(state.previousCharacter));
  return { ok: true, message: 'Rewound a year.', tone: 'good' };
}

export function netWorth(c: Character): number {
  const assetSum = c.assets.reduce((s, a) => s + a.value, 0);
  return c.cash + assetSum - c.debt;
}

export function applyYearlyAssetIncome(c: Character): void {
  let income = 0;
  for (const a of c.assets) {
    if (a.yield) income += a.yield * 12;
  }
  if (income > 0) {
    c.cash += income;
    c.journal.push(logEntry(c.age, 'asset', '🏦', `Assets earned $${income.toLocaleString()} this year.`, 'good'));
  }
}

export { recomputeStatus };

// helper to compute legacy title
export function legacyTitle(c: Character): string {
  const nw = netWorth(c);
  if (nw >= 1_000_000_000) return 'The Mogul';
  if (nw >= 100_000_000) return 'The Billionaire';
  if (c.extra.fame >= 80) return 'The Celebrity';
  if (c.extra.respect >= 80) return 'The Royal';
  if (c.crimes.length >= 8) return 'The Criminal';
  if (c.education.degrees.some((d) => d.startsWith('Graduate'))) return 'The Scholar';
  if (c.job?.special === 'athlete') return 'The Athlete';
  if (c.relationships.filter((r) => r.role === 'child').length >= 4) return 'The Family Hero';
  if (c.age >= 95) return 'The Survivor';
  if (nw <= 0 && c.crimes.length > 0) return 'The Disaster';
  if (nw >= 10_000_000) return 'The Legend';
  return 'The Nobody';
}
