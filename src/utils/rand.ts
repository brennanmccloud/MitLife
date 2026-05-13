export const rand = Math.random;

export function chance(p: number): boolean {
  return Math.random() < p;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function range(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function rangeInt(min: number, max: number): number {
  return Math.floor(range(min, max + 1));
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

export function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, n));
}
