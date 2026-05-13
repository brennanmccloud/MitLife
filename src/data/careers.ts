export interface CareerDef {
  id: string;
  title: string;
  field: string;
  minEducation: 'none' | 'high' | 'college' | 'grad';
  minMajor?: string[];
  baseSalary: number;
  smartsReq?: number;
  appearanceReq?: number;
  special?: 'actor' | 'musician' | 'athlete' | 'politician' | 'business' | 'criminal' | 'influencer' | 'astronaut';
  fame?: boolean;
}

export const REGULAR_CAREERS: CareerDef[] = [
  { id: 'retail', title: 'Retail Clerk', field: 'Retail', minEducation: 'none', baseSalary: 22000 },
  { id: 'barista', title: 'Barista', field: 'Hospitality', minEducation: 'none', baseSalary: 24000 },
  { id: 'janitor', title: 'Janitor', field: 'Services', minEducation: 'none', baseSalary: 26000 },
  { id: 'driver', title: 'Truck Driver', field: 'Logistics', minEducation: 'high', baseSalary: 48000 },
  { id: 'mechanic', title: 'Mechanic', field: 'Trades', minEducation: 'high', baseSalary: 42000 },
  { id: 'chef', title: 'Chef', field: 'Hospitality', minEducation: 'high', baseSalary: 46000 },
  { id: 'sales', title: 'Salesperson', field: 'Sales', minEducation: 'high', baseSalary: 38000, appearanceReq: 40 },
  { id: 'reporter', title: 'Reporter', field: 'Media', minEducation: 'college', baseSalary: 52000 },
  { id: 'writer', title: 'Writer', field: 'Media', minEducation: 'college', baseSalary: 44000 },
  { id: 'teacher', title: 'Teacher', field: 'Education', minEducation: 'college', minMajor: ['Education'], baseSalary: 55000 },
  { id: 'realtor', title: 'Real Estate Agent', field: 'Sales', minEducation: 'high', baseSalary: 62000, appearanceReq: 45 },
  { id: 'accountant', title: 'Accountant', field: 'Finance', minEducation: 'college', minMajor: ['Business', 'Finance'], baseSalary: 68000 },
  { id: 'analyst', title: 'Financial Analyst', field: 'Finance', minEducation: 'college', minMajor: ['Finance', 'Business'], baseSalary: 78000, smartsReq: 60 },
  { id: 'engineer', title: 'Engineer', field: 'Tech', minEducation: 'college', minMajor: ['Engineering'], baseSalary: 92000, smartsReq: 65 },
  { id: 'dev', title: 'Software Developer', field: 'Tech', minEducation: 'college', minMajor: ['Computer Science', 'Engineering'], baseSalary: 105000, smartsReq: 65 },
  { id: 'nurse', title: 'Nurse', field: 'Health', minEducation: 'college', minMajor: ['Nursing'], baseSalary: 72000 },
  { id: 'doctor', title: 'Doctor', field: 'Health', minEducation: 'grad', minMajor: ['Medicine', 'Biology'], baseSalary: 210000, smartsReq: 80 },
  { id: 'lawyer', title: 'Lawyer', field: 'Law', minEducation: 'grad', minMajor: ['Law', 'Political Science'], baseSalary: 165000, smartsReq: 75 },
  { id: 'cop', title: 'Police Officer', field: 'Public Safety', minEducation: 'high', baseSalary: 58000 },
  { id: 'soldier', title: 'Soldier', field: 'Military', minEducation: 'high', baseSalary: 44000 },
  { id: 'pilot', title: 'Pilot', field: 'Aviation', minEducation: 'college', baseSalary: 145000, smartsReq: 60 },
];

export const SPECIAL_CAREERS: CareerDef[] = [
  { id: 'actor', title: 'Actor', field: 'Entertainment', minEducation: 'none', baseSalary: 35000, special: 'actor', fame: true, appearanceReq: 55 },
  { id: 'musician', title: 'Musician', field: 'Entertainment', minEducation: 'none', baseSalary: 30000, special: 'musician', fame: true },
  { id: 'athlete', title: 'Pro Athlete', field: 'Sports', minEducation: 'high', baseSalary: 80000, special: 'athlete', fame: true },
  { id: 'politician', title: 'Politician', field: 'Government', minEducation: 'college', baseSalary: 95000, special: 'politician', fame: true },
  { id: 'business', title: 'Founder', field: 'Business', minEducation: 'high', baseSalary: 0, special: 'business' },
  { id: 'criminal', title: 'Crew Underboss', field: 'Underworld', minEducation: 'none', baseSalary: 60000, special: 'criminal' },
  { id: 'influencer', title: 'Influencer', field: 'Media', minEducation: 'none', baseSalary: 28000, special: 'influencer', fame: true, appearanceReq: 50 },
  { id: 'astronaut', title: 'Astronaut', field: 'Aerospace', minEducation: 'grad', minMajor: ['Engineering', 'Biology', 'Computer Science'], baseSalary: 130000, special: 'astronaut', smartsReq: 80 },
];

export const COLLEGE_MAJORS = [
  'Business',
  'Computer Science',
  'Engineering',
  'Biology',
  'Nursing',
  'Medicine',
  'Law',
  'Political Science',
  'Education',
  'Music',
  'Theater',
  'Finance',
  'Criminal Justice',
];
