import type {
  AvatarLook,
  BrowShape,
  Character,
  CoreStats,
  EyeColor,
  EyeShape,
  ExtraStats,
  FacialHair,
  Gender,
  Glasses,
  HairColor,
  HairStyle,
  HiddenStats,
  Lipstick,
  Outfit,
  Relationship,
  RelationshipStats,
  SkinTone,
} from '../types/Character';
import type { GameState, PowerFlags } from '../types/GameState';
import { COUNTRIES, getCountry } from '../data/countries';
import { randomFirstName, randomLastName } from '../data/names';
import { clamp, pick, rangeInt, uid } from '../utils/rand';

export interface NewLifeOptions {
  random?: boolean;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  country?: string;
  hair?: HairColor;
  hairStyle?: HairStyle;
  skin?: SkinTone;
  eyeColor?: EyeColor;
  eyeShape?: EyeShape;
  brow?: BrowShape;
  facialHair?: FacialHair;
  glasses?: Glasses;
  outfit?: Outfit;
  wealth?: 'poor' | 'middle' | 'rich';
  talent?: keyof HiddenStats;
  customStats?: Partial<CoreStats & HiddenStats>;
  fullAvatar?: AvatarLook;
  powers: PowerFlags;
}

export const HAIRS: HairColor[] = ['black', 'brown', 'blonde', 'red', 'gray', 'silver', 'auburn', 'pink', 'blue', 'mint', 'lavender'];
export const HAIR_STYLES: HairStyle[] = ['short', 'crop', 'long', 'wavy', 'curly', 'bun', 'ponytail', 'mohawk', 'bald', 'afro', 'pixie', 'braids'];
export const SKINS: SkinTone[] = ['porcelain', 'sand', 'tan', 'bronze', 'umber', 'ebony'];
export const EYE_COLORS: EyeColor[] = ['brown', 'blue', 'green', 'hazel', 'gray', 'amber', 'violet'];
export const EYE_SHAPES: EyeShape[] = ['round', 'almond', 'narrow', 'wide'];
export const BROWS: BrowShape[] = ['soft', 'thick', 'arched', 'thin'];
export const FACIAL_HAIRS: FacialHair[] = ['none', 'stubble', 'goatee', 'mustache', 'beard', 'fullBeard'];
export const GLASSES_OPTIONS: Glasses[] = ['none', 'round', 'square', 'sunglasses', 'reading'];
export const OUTFITS: Outfit[] = ['casual', 'hoodie', 'tshirt', 'dress', 'suit', 'jersey', 'labCoat', 'fitness', 'crown', 'goth'];

export function randomAvatar(gender: Gender): AvatarLook {
  return {
    hair: pick(HAIRS),
    hairStyle: pick(HAIR_STYLES.filter((s) => s !== 'bald')),
    skin: pick(SKINS),
    gender,
    eyeColor: pick(EYE_COLORS),
    eyeShape: pick(EYE_SHAPES),
    brow: pick(BROWS),
    facialHair: gender === 'male' && Math.random() < 0.35 ? pick(FACIAL_HAIRS) : 'none',
    glasses: Math.random() < 0.2 ? pick(GLASSES_OPTIONS) : 'none',
    earrings: Math.random() < 0.3 ? pick(['studs', 'hoops', 'drops'] as const) : 'none',
    lipstick: gender !== 'male' && Math.random() < 0.4 ? pick(['pink', 'red', 'plum', 'nude'] as const) : 'none',
    freckles: Math.random() < 0.25,
    blush: false,
    tattoo: false,
    piercing: Math.random() < 0.1,
    outfit: 'casual',
    accessory: 'none',
  };
}

function makeRelStats(): RelationshipStats {
  return {
    looks: rangeInt(20, 90),
    intelligence: rangeInt(20, 90),
    money: rangeInt(10, 80),
    craziness: rangeInt(5, 80),
    loyalty: rangeInt(40, 95),
    temper: rangeInt(10, 80),
  };
}

export function createCharacter(opts: NewLifeOptions): Character {
  const gender: Gender = opts.gender ?? pick<Gender>(['female', 'male', 'nonbinary']);
  const firstName = opts.firstName?.trim() || randomFirstName(gender);
  const lastName = opts.lastName?.trim() || randomLastName();
  const country = opts.country && COUNTRIES.find((c) => c.name === opts.country)
    ? opts.country
    : pick(COUNTRIES).name;
  const countryDef = getCountry(country);

  const core: CoreStats = {
    happiness: rangeInt(55, 95),
    health: rangeInt(80, 100),
    intelligence: rangeInt(20, 95),
    appearance: rangeInt(15, 95),
    ...opts.customStats,
  };
  const extra: ExtraStats = {
    fame: 0, influence: 0, respect: 0, notoriety: 0, business: 0,
  };
  const hidden: HiddenStats = {
    discipline: rangeInt(20, 80),
    luck: rangeInt(20, 80),
    willpower: rangeInt(20, 80),
    karma: 50,
    craziness: rangeInt(10, 70),
    fertility: rangeInt(30, 90),
    crimeTalent: rangeInt(5, 70),
    musicTalent: rangeInt(5, 70),
    actingTalent: rangeInt(5, 70),
    sportsTalent: rangeInt(5, 70),
    businessTalent: rangeInt(5, 70),
    ...opts.customStats,
  };
  if (opts.talent) {
    hidden[opts.talent] = clamp(95, 0, 100);
  }

  const wealth = opts.wealth ?? pick(['poor', 'middle', 'middle', 'middle', 'rich'] as const);
  let cash =
    wealth === 'poor' ? rangeInt(0, 200) : wealth === 'rich' ? rangeInt(50000, 250000) : rangeInt(500, 8000);
  if (opts.powers.fortuneSeed) cash = Math.max(cash, 1_000_000);

  const baseAvatar: AvatarLook = opts.fullAvatar
    ? { ...opts.fullAvatar, gender }
    : {
        ...randomAvatar(gender),
        ...(opts.hair ? { hair: opts.hair } : {}),
        ...(opts.skin ? { skin: opts.skin } : {}),
        ...(opts.hairStyle ? { hairStyle: opts.hairStyle } : {}),
        ...(opts.eyeColor ? { eyeColor: opts.eyeColor } : {}),
        ...(opts.eyeShape ? { eyeShape: opts.eyeShape } : {}),
        ...(opts.brow ? { brow: opts.brow } : {}),
        ...(opts.facialHair ? { facialHair: opts.facialHair } : {}),
        ...(opts.glasses ? { glasses: opts.glasses } : {}),
        ...(opts.outfit ? { outfit: opts.outfit } : {}),
      };
  const avatar: AvatarLook = baseAvatar;

  const motherFirst = randomFirstName('female');
  const fatherFirst = randomFirstName('male');
  const mother: Relationship = {
    id: uid('rel'),
    name: `${motherFirst} ${lastName}`,
    role: 'mother',
    age: rangeInt(22, 44),
    alive: true,
    bond: rangeInt(40, 90),
    avatar: { ...randomAvatar('female'), skin: avatar.skin },
    stats: makeRelStats(),
    isBlood: true,
  };
  const father: Relationship = {
    id: uid('rel'),
    name: `${fatherFirst} ${lastName}`,
    role: 'father',
    age: rangeInt(24, 50),
    alive: true,
    bond: rangeInt(30, 85),
    avatar: { ...randomAvatar('male'), skin: avatar.skin },
    stats: makeRelStats(),
    isBlood: true,
  };

  const relationships: Relationship[] = [mother, father];
  const siblingCount = rangeInt(0, 3);
  for (let i = 0; i < siblingCount; i++) {
    const sg = pick<Gender>(['female', 'male', 'nonbinary']);
    relationships.push({
      id: uid('rel'),
      name: `${randomFirstName(sg)} ${lastName}`,
      role: 'sibling',
      age: rangeInt(0, 18),
      alive: true,
      bond: rangeInt(20, 90),
      avatar: { ...randomAvatar(sg), skin: avatar.skin },
      stats: makeRelStats(),
      isBlood: true,
    });
  }

  const character: Character = {
    id: uid('char'),
    firstName,
    lastName,
    gender,
    country,
    countryFlag: countryDef.flag,
    birthYear: new Date().getFullYear(),
    age: 0,
    alive: true,
    avatar,
    core,
    extra,
    hidden,
    cash,
    debt: 0,
    taxesPaid: 0,
    education: {
      level: 'none',
      grades: 0,
      popularity: 50,
      yearsInLevel: 0,
      graduated: false,
      degrees: [],
    },
    job: null,
    assets: [],
    relationships,
    journal: [
      {
        id: uid('log'),
        age: 0,
        type: 'birth',
        icon: '👶',
        text: `Born in ${country} to the ${lastName} family.`,
        tone: 'good',
      },
    ],
    prison: {
      inPrison: false,
      yearsRemaining: 0,
      totalSentence: 0,
      security: 'minimum',
      reputation: 0,
      inGang: false,
    },
    crimes: [],
    status: 'Newborn',
    talent: opts.talent,
    generation: 1,
  };

  return character;
}

export function continueAsChild(prev: Character, powers: PowerFlags): Character | null {
  const child = prev.relationships.find((r) => r.role === 'child' && r.alive);
  if (!child) return null;
  const inheritance = Math.max(0, Math.round(prev.cash * 0.6));
  const newChar = createCharacter({
    powers,
    firstName: child.name.split(' ')[0],
    lastName: prev.lastName,
    gender: child.avatar.gender,
    country: prev.country,
    hair: child.avatar.hair,
    skin: child.avatar.skin,
    wealth: 'middle',
  });
  newChar.cash = inheritance + (powers.fortuneSeed ? 1_000_000 : 0);
  newChar.generation = prev.generation + 1;
  newChar.journal.unshift({
    id: uid('log'),
    age: 0,
    type: 'family',
    icon: '🧬',
    text: `Inherited $${inheritance.toLocaleString()} from ${prev.firstName} ${prev.lastName}.`,
    tone: 'good',
  });
  return newChar;
}
