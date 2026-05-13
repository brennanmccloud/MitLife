// Original fictional first/last names for MitLife.
export const FIRST_NAMES_F = [
  'Arelia', 'Briska', 'Cellin', 'Doria', 'Elune', 'Falka', 'Greta', 'Hazel', 'Idra', 'Junalee',
  'Kestra', 'Liora', 'Mireya', 'Nuria', 'Orlea', 'Pirin', 'Quenna', 'Renza', 'Saskia', 'Tovi',
  'Uma', 'Vela', 'Wenna', 'Xanthe', 'Yara', 'Zinna', 'Calista', 'Dovey', 'Emberlyn', 'Faelin',
];

export const FIRST_NAMES_M = [
  'Alric', 'Boran', 'Cyran', 'Daven', 'Ennor', 'Fexel', 'Grell', 'Holvar', 'Ivar', 'Jaxon',
  'Korben', 'Lev', 'Mardo', 'Niko', 'Olen', 'Pell', 'Quirin', 'Rove', 'Soren', 'Talvi',
  'Urik', 'Varek', 'Welin', 'Xolen', 'Yann', 'Zoran', 'Cale', 'Devyn', 'Eldin', 'Faro',
];

export const FIRST_NAMES_N = [
  'Ash', 'Briar', 'Casen', 'Drift', 'Echo', 'Flynn', 'Glim', 'Halen', 'Iri', 'Joa',
  'Kit', 'Lior', 'Marvi', 'Neve', 'Owyn', 'Phen', 'Quin', 'Ren', 'Sage', 'Tarin',
];

export const LAST_NAMES = [
  'Aldwin', 'Brockhart', 'Cavellan', 'Drovin', 'Esterel', 'Farwick', 'Greaves', 'Holvey',
  'Ironwood', 'Jaspar', 'Kalden', 'Loring', 'Mervane', 'Nesbry', 'Othmar', 'Penrose',
  'Quarrow', 'Renholt', 'Sallow', 'Tindall', 'Ulmer', 'Vassen', 'Whitlock', 'Xandry',
  'Yorthe', 'Zellis', 'Brackmoor', 'Carron', 'Delvane', 'Embry', 'Fellowes', 'Garnek',
];

export const PET_NAMES = [
  'Biscuit', 'Pepper', 'Mango', 'Pickle', 'Noodle', 'Truffle', 'Waffle', 'Mochi', 'Olive', 'Tofu',
];

import type { Gender } from '../types/Character';

export function randomFirstName(gender: Gender): string {
  const pool = gender === 'female' ? FIRST_NAMES_F : gender === 'male' ? FIRST_NAMES_M : FIRST_NAMES_N;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function randomLastName(): string {
  return LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
}

export function randomPetName(): string {
  return PET_NAMES[Math.floor(Math.random() * PET_NAMES.length)];
}
