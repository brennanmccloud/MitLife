export type AgeStage = 'baby' | 'child' | 'teen' | 'adult' | 'older' | 'elder';
export type Gender = 'female' | 'male' | 'nonbinary';
export type HairColor = 'black' | 'brown' | 'blonde' | 'red' | 'gray' | 'pink' | 'blue';
export type SkinTone = 'porcelain' | 'sand' | 'tan' | 'bronze' | 'umber' | 'ebony';

export type AvatarAccessory =
  | 'none'
  | 'crown'
  | 'shades'
  | 'suit'
  | 'prisonStripes'
  | 'jersey'
  | 'labCoat'
  | 'gradCap';

export interface AvatarLook {
  hair: HairColor;
  skin: SkinTone;
  gender: Gender;
  accessory: AvatarAccessory;
}

export interface CoreStats {
  happiness: number;
  health: number;
  intelligence: number;
  appearance: number;
}

export interface ExtraStats {
  fame: number;
  influence: number;
  respect: number;
  notoriety: number;
  business: number;
}

export interface HiddenStats {
  discipline: number;
  luck: number;
  willpower: number;
  karma: number;
  craziness: number;
  fertility: number;
  crimeTalent: number;
  musicTalent: number;
  actingTalent: number;
  sportsTalent: number;
  businessTalent: number;
}

export type RelationshipRole =
  | 'mother'
  | 'father'
  | 'parent'
  | 'sibling'
  | 'halfSibling'
  | 'friend'
  | 'bestFriend'
  | 'enemy'
  | 'partner'
  | 'spouse'
  | 'ex'
  | 'child'
  | 'stepChild'
  | 'pet'
  | 'classmate'
  | 'coworker'
  | 'boss'
  | 'crush';

export interface RelationshipStats {
  looks: number;
  intelligence: number;
  money: number;
  craziness: number;
  loyalty: number;
  temper: number;
}

export interface Relationship {
  id: string;
  name: string;
  role: RelationshipRole;
  age: number;
  alive: boolean;
  bond: number; // -100..100 relationship meter (mapped to 0..100 in UI)
  avatar: AvatarLook;
  stats: RelationshipStats;
  notes?: string;
  isBlood?: boolean;
  pregnantBy?: string;
  pregnantWeeks?: number;
  pregnantBabies?: number;
  pregnantGender?: Gender;
  pregnantTalent?: keyof HiddenStats;
}

export type SchoolLevel =
  | 'none'
  | 'preK'
  | 'elementary'
  | 'middle'
  | 'high'
  | 'college'
  | 'grad';

export interface Education {
  level: SchoolLevel;
  major?: string;
  grades: number; // 0..100
  popularity: number; // 0..100
  yearsInLevel: number;
  graduated: boolean;
  degrees: string[];
}

export interface Job {
  id: string;
  title: string;
  field: string;
  salary: number;
  performance: number; // 0..100
  stress: number; // 0..100
  years: number;
  bossBond?: number;
  fame?: boolean;
  special?:
    | 'actor'
    | 'musician'
    | 'athlete'
    | 'politician'
    | 'business'
    | 'criminal'
    | 'influencer'
    | 'astronaut';
}

export interface Asset {
  id: string;
  kind: 'house' | 'car' | 'jewelry' | 'business' | 'plane' | 'boat' | 'stock' | 'crypto';
  name: string;
  value: number;
  paid: number;
  yield?: number;
  notes?: string;
}

export type CrimeRecordEntry = {
  age: number;
  crime: string;
  outcome: 'caught' | 'escaped' | 'killed';
};

export interface PrisonState {
  inPrison: boolean;
  yearsRemaining: number;
  totalSentence: number;
  security: 'minimum' | 'medium' | 'max';
  reputation: number; // 0..100
  inGang: boolean;
}

export type LifeEntryType =
  | 'birth'
  | 'family'
  | 'school'
  | 'friend'
  | 'love'
  | 'baby'
  | 'job'
  | 'money'
  | 'asset'
  | 'health'
  | 'crime'
  | 'prison'
  | 'fame'
  | 'business'
  | 'chaos'
  | 'death';

export interface LifeEntry {
  id: string;
  age: number;
  type: LifeEntryType;
  icon: string;
  text: string;
  tone?: 'good' | 'bad' | 'neutral' | 'epic';
}

export interface Character {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  country: string;
  countryFlag: string;
  birthYear: number;
  age: number;
  alive: boolean;
  causeOfDeath?: string;
  avatar: AvatarLook;
  core: CoreStats;
  extra: ExtraStats;
  hidden: HiddenStats;
  cash: number;
  debt: number;
  taxesPaid: number;
  education: Education;
  job: Job | null;
  assets: Asset[];
  relationships: Relationship[];
  journal: LifeEntry[];
  prison: PrisonState;
  crimes: CrimeRecordEntry[];
  status: string;
  talent?: keyof HiddenStats;
  generation: number;
  legacyTitle?: string;
}
