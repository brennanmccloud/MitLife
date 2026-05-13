import type { Character, LifeEntry, Relationship } from '../types/Character';
import type { GameState } from '../types/GameState';
import { getCountry } from '../data/countries';
import { pickRandomEvent, type EventContext, type EventDef } from '../data/events';
import { chance, clamp, pick, rangeInt, uid } from '../utils/rand';
import { randomFirstName } from '../data/names';

export interface AgeResult {
  pendingEvent: EventDef | null;
  death?: { cause: string };
}

function ageStatus(c: Character): string {
  if (!c.alive) return `Deceased — ${c.causeOfDeath ?? 'Unknown cause'}`;
  if (c.prison.inPrison) return `Incarcerated (${c.prison.yearsRemaining}y left)`;
  if (c.age < 1) return 'Newborn';
  if (c.age < 4) return 'Toddler';
  if (c.age < 13) return `Student — ${c.education.level === 'elementary' ? 'Elementary' : c.education.level === 'middle' ? 'Middle School' : 'Child'}`;
  if (c.age < 18) {
    if (c.education.level === 'high') return 'High School Student';
    if (c.education.level === 'middle') return 'Middle School Student';
    return 'Teenager';
  }
  if (c.education.level === 'college') return 'College Student';
  if (c.education.level === 'grad') return 'Grad Student';
  if (c.job) return c.job.title;
  if (c.age >= 65) return 'Retired';
  return 'Unemployed';
}

export function recomputeStatus(c: Character): void {
  c.status = ageStatus(c);
}

function aging(c: Character): void {
  // Natural aging effects
  if (c.age > 30) c.core.health = clamp(c.core.health - (c.age > 70 ? 2 : 1));
  if (c.age > 60) c.core.appearance = clamp(c.core.appearance - 1);
  if (c.prison.inPrison) c.core.happiness = clamp(c.core.happiness - 3);
  // Drift others' ages
  for (const r of c.relationships) {
    if (r.alive) r.age += 1;
  }
}

function progressEducation(c: Character): void {
  const country = getCountry(c.country);
  if (c.age === country.startSchool && c.education.level === 'none') {
    c.education.level = 'elementary';
    c.education.yearsInLevel = 0;
    c.education.grades = clamp(50 + (c.core.intelligence - 50) * 0.2);
    c.journal.push(logEntry(c.age, 'school', '🎒', `Started school in ${c.country}.`));
  } else if (c.education.level !== 'none' && c.education.level !== 'college' && c.education.level !== 'grad') {
    c.education.yearsInLevel += 1;
    // Move up levels
    if (c.education.level === 'elementary' && c.age >= 11) {
      c.education.level = 'middle';
      c.education.yearsInLevel = 0;
      c.journal.push(logEntry(c.age, 'school', '🎒', 'Started middle school.'));
    } else if (c.education.level === 'middle' && c.age >= 14) {
      c.education.level = 'high';
      c.education.yearsInLevel = 0;
      c.journal.push(logEntry(c.age, 'school', '🎒', 'Started high school.'));
    } else if (c.education.level === 'high' && c.age >= 18) {
      c.education.graduated = c.education.grades >= 50;
      c.education.degrees.push(c.education.graduated ? 'High School Diploma' : 'Dropped Out');
      c.journal.push(
        logEntry(
          c.age,
          'school',
          c.education.graduated ? '🎓' : '📉',
          c.education.graduated ? 'Graduated high school.' : 'Did not graduate high school.',
          c.education.graduated ? 'good' : 'bad',
        ),
      );
      c.education.level = 'none';
    }
    // Grades naturally drift toward smarts + discipline
    const target = (c.core.intelligence + c.hidden.discipline) / 2;
    c.education.grades = clamp(c.education.grades + (target - c.education.grades) * 0.1);
  }

  // College / Grad progression
  if (c.education.level === 'college') {
    c.education.yearsInLevel += 1;
    if (c.education.yearsInLevel >= 4) {
      c.education.degrees.push(`Bachelor's in ${c.education.major}`);
      c.education.graduated = true;
      c.journal.push(logEntry(c.age, 'school', '🎓', `Graduated with a bachelor's in ${c.education.major}.`, 'good'));
      c.education.level = 'none';
      c.education.yearsInLevel = 0;
    }
  } else if (c.education.level === 'grad') {
    c.education.yearsInLevel += 1;
    if (c.education.yearsInLevel >= 3) {
      c.education.degrees.push(`Graduate Degree in ${c.education.major}`);
      c.journal.push(logEntry(c.age, 'school', '🎓', `Earned a graduate degree in ${c.education.major}.`, 'good'));
      c.education.level = 'none';
      c.education.yearsInLevel = 0;
    }
  }
}

function workYear(c: Character): void {
  if (!c.job || c.prison.inPrison) return;
  c.job.years += 1;
  // Salary accrual (yearly take-home)
  const take = Math.round(c.job.salary * 0.78);
  c.cash += take;
  c.taxesPaid += Math.round(c.job.salary * 0.22);
  // Performance drift
  c.job.performance = clamp(c.job.performance + (Math.random() > 0.5 ? 2 : -2));
  c.job.stress = clamp(c.job.stress + rangeInt(-4, 6));
  if (c.job.stress > 80 && chance(0.25)) {
    c.core.health = clamp(c.core.health - 3);
    c.journal.push(logEntry(c.age, 'job', '😵', `Burned out at ${c.job.title}.`, 'bad'));
  }
  if (c.job.fame) {
    c.extra.fame = clamp(c.extra.fame + rangeInt(1, 6));
  }
}

function relationshipDrift(c: Character): void {
  for (const r of c.relationships) {
    if (!r.alive) continue;
    // small drift toward 50 unless interacted with
    const driftAmount = Math.random() < 0.5 ? -1 : 0;
    r.bond = clamp(r.bond + driftAmount, -100, 100);
    // Pregnancies progressing (NPC partner)
    if (r.pregnantWeeks !== undefined) {
      r.pregnantWeeks += 52; // we tick by year
      if (r.pregnantWeeks >= 40) {
        deliverBabies(c, r);
      }
    }
    // Random old-age death of parents
    if ((r.role === 'mother' || r.role === 'father' || r.role === 'parent') && r.age > 70) {
      const p = (r.age - 70) * 0.02;
      if (chance(p)) {
        r.alive = false;
        c.journal.push(logEntry(c.age, 'family', '🕊️', `Your ${r.role} ${r.name} passed away.`, 'bad'));
        c.core.happiness = clamp(c.core.happiness - 12);
        // small inheritance
        const inh = rangeInt(2000, 40000);
        c.cash += inh;
        c.journal.push(logEntry(c.age, 'money', '📜', `Inherited $${inh.toLocaleString()}.`, 'good'));
      }
    }
  }
}

function deliverBabies(c: Character, partner: Relationship): void {
  const count = partner.pregnantBabies ?? 1;
  for (let i = 0; i < count; i++) {
    const g = partner.pregnantGender ?? pick(['female', 'male', 'nonbinary'] as const);
    const baby: Relationship = {
      id: uid('rel'),
      name: `${randomFirstName(g)} ${c.lastName}`,
      role: 'child',
      age: 0,
      alive: true,
      bond: 80,
      avatar: { hair: pick(['black', 'brown', 'blonde', 'red']), skin: c.avatar.skin, gender: g, accessory: 'none' },
      stats: {
        looks: clamp((c.core.appearance + partner.stats.looks) / 2 + rangeInt(-10, 10)),
        intelligence: clamp((c.core.intelligence + partner.stats.intelligence) / 2 + rangeInt(-10, 10)),
        money: 0,
        craziness: rangeInt(10, 60),
        loyalty: rangeInt(50, 95),
        temper: rangeInt(10, 60),
      },
      isBlood: true,
    };
    c.relationships.push(baby);
    c.journal.push(logEntry(c.age, 'baby', '👶', `${count > 1 ? `One of ${count} babies` : 'A baby'} arrived: ${baby.name}.`, 'good'));
    c.core.happiness = clamp(c.core.happiness + 6);
  }
  partner.pregnantWeeks = undefined;
  partner.pregnantBabies = undefined;
  partner.pregnantBy = undefined;
  partner.pregnantGender = undefined;
}

function logEntry(age: number, type: LifeEntry['type'], icon: string, text: string, tone: LifeEntry['tone'] = 'neutral'): LifeEntry {
  return { id: uid('log'), age, type, icon, text, tone };
}

function prisonTick(c: Character): void {
  if (!c.prison.inPrison) return;
  c.prison.yearsRemaining -= 1;
  c.core.happiness = clamp(c.core.happiness - 5);
  c.core.health = clamp(c.core.health - 1);
  c.extra.notoriety = clamp(c.extra.notoriety + 2);
  if (c.prison.yearsRemaining <= 0) {
    c.prison.inPrison = false;
    c.prison.yearsRemaining = 0;
    c.journal.push(logEntry(c.age, 'prison', '🚪', 'Served your sentence and walked out a free person.', 'good'));
  }
}

function ageStageAccessory(c: Character): void {
  if (c.prison.inPrison) {
    c.avatar.accessory = 'prisonStripes';
    return;
  }
  if (c.job?.special === 'actor' || c.job?.special === 'influencer' || c.job?.special === 'musician') {
    c.avatar.accessory = 'shades';
    return;
  }
  if (c.job?.field === 'Finance' || c.job?.field === 'Business' || c.job?.special === 'business' || c.job?.special === 'politician') {
    c.avatar.accessory = 'suit';
    return;
  }
  if (c.job?.special === 'athlete') {
    c.avatar.accessory = 'jersey';
    return;
  }
  if (c.job?.field === 'Health' && c.job?.title === 'Doctor') {
    c.avatar.accessory = 'labCoat';
    return;
  }
  if (c.education.level === 'college' || c.education.level === 'grad') {
    c.avatar.accessory = 'gradCap';
    return;
  }
  if (c.extra.respect > 70) {
    c.avatar.accessory = 'crown';
    return;
  }
  c.avatar.accessory = 'none';
}

function checkDeath(c: Character): string | null {
  if (!c.alive) return null;
  // Old age
  const oldAgeP = c.age > 70 ? (c.age - 65) * 0.005 + (100 - c.core.health) * 0.0008 : 0;
  if (chance(oldAgeP)) return 'Old age';
  if (c.core.health <= 0) return 'Health gave out';
  if (c.age >= 122) return 'Old age';
  return null;
}

export function ageUp(state: GameState): AgeResult {
  const c = state.character;
  if (!c || !c.alive) return { pendingEvent: null };
  c.age += 1;
  aging(c);
  prisonTick(c);
  progressEducation(c);
  workYear(c);
  relationshipDrift(c);
  ageStageAccessory(c);
  recomputeStatus(c);

  const death = checkDeath(c);
  if (death) {
    c.alive = false;
    c.causeOfDeath = death;
    c.journal.push(logEntry(c.age, 'death', '🕯️', `Passed away at age ${c.age}. Cause: ${death}.`, 'bad'));
    return { pendingEvent: null, death: { cause: death } };
  }

  // Random yearly event
  const ev = pickRandomEvent(c, state, Math.random);
  return { pendingEvent: ev };
}

export function applyEvent(state: GameState, ev: EventDef, choiceIdx: number): string {
  const c = state.character!;
  const choice = ev.choices[choiceIdx];
  const ctx: EventContext = {
    character: c,
    state,
    rand: Math.random,
    log: (entry) => {
      c.journal.push(logEntry(c.age, entry.type, entry.icon, entry.text, entry.tone));
    },
    patch: (patcher) => patcher(c),
  };
  return choice.apply(ctx);
}

export { logEntry };
