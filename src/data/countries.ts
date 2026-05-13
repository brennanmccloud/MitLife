export interface Country {
  name: string;
  flag: string;
  currency: string;
  startSchool: number; // age school begins
  costOfLiving: number; // multiplier
  vibe: string;
}

export const COUNTRIES: Country[] = [
  { name: 'Atlantia', flag: '🌊', currency: 'AT$', startSchool: 5, costOfLiving: 1.0, vibe: 'Coastal trade hub' },
  { name: 'Volkaria', flag: '🗻', currency: 'VKR', startSchool: 6, costOfLiving: 0.85, vibe: 'Mountain republic' },
  { name: 'Solmara', flag: '🌴', currency: 'SOL', startSchool: 6, costOfLiving: 0.7, vibe: 'Tropical island' },
  { name: 'Norrhavn', flag: '❄️', currency: 'NHK', startSchool: 7, costOfLiving: 1.25, vibe: 'Northern fjord nation' },
  { name: 'Tigris Plains', flag: '🌾', currency: 'TGR', startSchool: 6, costOfLiving: 0.6, vibe: 'Vast farmland empire' },
  { name: 'Cresta', flag: '🏔️', currency: 'CRT', startSchool: 6, costOfLiving: 1.1, vibe: 'Alpine principality' },
  { name: 'Marrowind', flag: '🏜️', currency: 'MRW', startSchool: 6, costOfLiving: 0.55, vibe: 'Desert federation' },
  { name: 'Verdania', flag: '🌳', currency: 'VRD', startSchool: 5, costOfLiving: 0.9, vibe: 'Forested kingdom' },
  { name: 'Pyrenea', flag: '🔥', currency: 'PYR', startSchool: 6, costOfLiving: 1.05, vibe: 'Volcanic archipelago' },
  { name: 'Glacium', flag: '🧊', currency: 'GLC', startSchool: 7, costOfLiving: 1.4, vibe: 'Tundra confederation' },
  { name: 'Aurelian States', flag: '🦅', currency: 'AUR', startSchool: 6, costOfLiving: 1.3, vibe: 'Massive republic' },
  { name: 'Lumen Bay', flag: '🌅', currency: 'LMN', startSchool: 5, costOfLiving: 1.15, vibe: 'Sunlit city-state' },
];

export function getCountry(name: string): Country {
  return COUNTRIES.find((c) => c.name === name) ?? COUNTRIES[0];
}
