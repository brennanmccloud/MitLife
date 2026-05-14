import type {
  AvatarLook,
  BrowShape,
  EyeColor,
  EyeShape,
  FacialHair,
  Glasses,
  HairColor,
  HairStyle,
  Lipstick,
  Outfit as OutfitName,
  SkinTone,
} from '../types/Character';

const SKIN_HEX: Record<SkinTone, { base: string; shade: string }> = {
  porcelain: { base: '#fbe4d2', shade: '#f2c8aa' },
  sand: { base: '#eccaa3', shade: '#d6a878' },
  tan: { base: '#d6a371', shade: '#b9844f' },
  bronze: { base: '#b67a4c', shade: '#925d34' },
  umber: { base: '#8a5734', shade: '#6a3f23' },
  ebony: { base: '#5c361f', shade: '#3e2110' },
};

const HAIR_HEX: Record<HairColor, string> = {
  black: '#1f2937',
  brown: '#7c4a2a',
  blonde: '#e9c46a',
  red: '#c0463a',
  gray: '#94a3b8',
  silver: '#cbd5e1',
  pink: '#f472b6',
  blue: '#60a5fa',
  auburn: '#8b3d1a',
  mint: '#86efac',
  lavender: '#c4b5fd',
};

const EYE_HEX: Record<EyeColor, string> = {
  brown: '#6b3a1a',
  blue: '#3b82f6',
  green: '#22c55e',
  hazel: '#a16207',
  gray: '#64748b',
  amber: '#d97706',
  violet: '#8b5cf6',
};

const LIPSTICK_HEX: Record<Lipstick, string | null> = {
  none: null,
  pink: '#ec4899',
  red: '#dc2626',
  plum: '#7c2d12',
  nude: '#b45309',
};

const OUTFIT_NAMES: OutfitName[] = ['casual', 'hoodie', 'tshirt', 'dress', 'suit', 'jersey', 'labCoat', 'prisonStripes', 'fitness', 'crown', 'goth'];

/**
 * Fills in any missing/invalid avatar fields with reasonable defaults so
 * old saves still render correctly after avatar schema upgrades.
 */
export function normalizeAvatar(look: Partial<AvatarLook> | undefined): AvatarLook {
  const l = (look ?? {}) as Partial<AvatarLook>;
  const pickIn = <T,>(v: T | undefined, allowed: readonly T[], fallback: T): T =>
    v !== undefined && allowed.includes(v) ? v : fallback;
  return {
    gender: l.gender ?? 'female',
    skin: pickIn(l.skin, Object.keys(SKIN_HEX) as SkinTone[], 'sand'),
    hair: pickIn(l.hair, Object.keys(HAIR_HEX) as HairColor[], 'brown'),
    hairStyle: pickIn(
      l.hairStyle,
      ['short', 'crop', 'long', 'wavy', 'curly', 'bun', 'ponytail', 'mohawk', 'bald', 'afro', 'pixie', 'braids'] as HairStyle[],
      'short',
    ),
    eyeColor: pickIn(l.eyeColor, Object.keys(EYE_HEX) as EyeColor[], 'brown'),
    eyeShape: pickIn(l.eyeShape, ['round', 'almond', 'narrow', 'wide'] as EyeShape[], 'round'),
    brow: pickIn(l.brow, ['soft', 'thick', 'arched', 'thin'] as BrowShape[], 'soft'),
    facialHair: pickIn(l.facialHair, ['none', 'stubble', 'goatee', 'mustache', 'beard', 'fullBeard'] as FacialHair[], 'none'),
    glasses: pickIn(l.glasses, ['none', 'round', 'square', 'sunglasses', 'reading'] as Glasses[], 'none'),
    earrings: pickIn(l.earrings, ['none', 'studs', 'hoops', 'drops'] as AvatarLook['earrings'][], 'none'),
    lipstick: pickIn(l.lipstick, Object.keys(LIPSTICK_HEX) as Lipstick[], 'none'),
    freckles: !!l.freckles,
    blush: !!l.blush,
    tattoo: !!l.tattoo,
    piercing: !!l.piercing,
    outfit: pickIn(l.outfit, OUTFIT_NAMES, 'casual'),
    accessory: pickIn(
      l.accessory,
      ['none', 'crown', 'shades', 'suit', 'prisonStripes', 'jersey', 'labCoat', 'gradCap'] as AvatarLook['accessory'][],
      'none',
    ),
  };
}

interface Props {
  look: AvatarLook;
  age: number;
  size?: number;
  bg?: 'sky' | 'sun' | 'rose' | 'lilac' | 'mint' | 'none';
}

function stageOf(age: number) {
  if (age < 1) return 'baby' as const;
  if (age < 6) return 'toddler' as const;
  if (age < 13) return 'child' as const;
  if (age < 20) return 'teen' as const;
  if (age < 50) return 'adult' as const;
  if (age < 70) return 'older' as const;
  return 'elder' as const;
}

function HairBack({ style, color, stage }: { style: HairStyle; color: string; stage: ReturnType<typeof stageOf> }) {
  if (style === 'bald' || stage === 'baby') return null;
  if (style === 'long') return <ellipse cx="50" cy="62" rx="34" ry="32" fill={color} />;
  if (style === 'wavy') return <ellipse cx="50" cy="58" rx="33" ry="28" fill={color} />;
  if (style === 'ponytail')
    return (
      <>
        <ellipse cx="50" cy="46" rx="30" ry="22" fill={color} />
        <ellipse cx="80" cy="52" rx="5" ry="14" fill={color} transform="rotate(20 80 52)" />
      </>
    );
  if (style === 'braids')
    return (
      <>
        <ellipse cx="50" cy="46" rx="30" ry="22" fill={color} />
        <rect x="20" y="50" width="6" height="24" rx="3" fill={color} />
        <rect x="74" y="50" width="6" height="24" rx="3" fill={color} />
      </>
    );
  if (style === 'afro') return <circle cx="50" cy="42" r="33" fill={color} />;
  if (style === 'bun') return <ellipse cx="50" cy="44" rx="30" ry="22" fill={color} />;
  if (style === 'mohawk') return <ellipse cx="50" cy="46" rx="30" ry="20" fill={color} opacity="0.0" />;
  // short/crop/pixie/curly all just have a low-profile back
  return <ellipse cx="50" cy="44" rx="31" ry="24" fill={color} />;
}

function HairFront({ style, color, stage }: { style: HairStyle; color: string; stage: ReturnType<typeof stageOf> }) {
  if (style === 'bald' || stage === 'baby') return null;
  const dyeStreak =
    color === '#f472b6' || color === '#60a5fa' || color === '#86efac' || color === '#c4b5fd';
  const baseTop = () => {
    switch (style) {
      case 'crop':
        return <path d="M 22 42 Q 50 24 78 42 L 78 38 Q 50 28 22 38 Z" fill={color} />;
      case 'short':
        return <path d="M 20 44 Q 50 20 80 44 Q 65 32 50 32 Q 35 32 20 44 Z" fill={color} />;
      case 'pixie':
        return <path d="M 22 44 Q 50 26 78 44 Q 64 34 50 34 Q 40 34 32 40 Z" fill={color} />;
      case 'long':
        return <path d="M 18 44 Q 50 22 82 44 Q 60 30 50 30 Q 40 30 18 40 Z" fill={color} />;
      case 'wavy':
        return <path d="M 20 44 Q 32 32 40 40 Q 50 30 60 40 Q 68 32 80 44 Q 50 32 20 44 Z" fill={color} />;
      case 'curly':
        return (
          <g fill={color}>
            <circle cx="28" cy="38" r="8" />
            <circle cx="40" cy="32" r="8" />
            <circle cx="50" cy="30" r="8" />
            <circle cx="60" cy="32" r="8" />
            <circle cx="72" cy="38" r="8" />
          </g>
        );
      case 'bun':
        return (
          <g fill={color}>
            <path d="M 22 44 Q 50 26 78 44 Q 50 32 22 44 Z" />
            <circle cx="50" cy="22" r="9" />
          </g>
        );
      case 'ponytail':
        return <path d="M 22 42 Q 50 22 78 42 Q 50 30 22 42 Z" fill={color} />;
      case 'mohawk':
        return (
          <g fill={color}>
            <path d="M 42 16 L 58 16 L 58 46 L 42 46 Z" />
            <path d="M 44 12 L 56 12 L 56 18 L 44 18 Z" />
          </g>
        );
      case 'afro':
        return <path d="M 16 38 Q 50 8 84 38 Q 60 24 50 24 Q 40 24 16 32 Z" fill={color} />;
      case 'braids':
        return <path d="M 22 42 Q 50 24 78 42 Q 50 32 22 42 Z" fill={color} />;
      default:
        return <path d="M 20 44 Q 50 22 80 44 Q 65 32 50 32 Q 35 32 20 44 Z" fill={color} />;
    }
  };
  return (
    <g>
      {baseTop()}
      {dyeStreak && <path d="M 46 26 Q 48 36 44 44" stroke="#fff" strokeWidth="2" fill="none" opacity="0.5" />}
    </g>
  );
}

function Eyes({ shape, color, brow, stage, glasses }: { shape: EyeShape; color: string; brow: BrowShape; stage: ReturnType<typeof stageOf>; glasses: Glasses }) {
  const big = stage === 'baby' || stage === 'toddler';
  const eyeY = big ? 56 : 52;
  const eyeRx = shape === 'narrow' ? 2.2 : shape === 'wide' ? 3.6 : shape === 'almond' ? 3 : 3;
  const eyeRy = shape === 'narrow' ? 1.4 : shape === 'wide' ? 2.6 : shape === 'almond' ? 1.8 : 3;
  const irisR = big ? 2.2 : 1.6;

  const browWidth = brow === 'thick' ? 8 : brow === 'thin' ? 5 : 7;
  const browStroke = brow === 'thick' ? 2.2 : brow === 'thin' ? 1.2 : 1.6;
  const browY = eyeY - 6;
  const browDip = brow === 'arched' ? 2 : 0.5;

  return (
    <g>
      <path
        d={`M ${42 - browWidth / 2} ${browY + browDip} Q 42 ${browY - browDip} ${42 + browWidth / 2} ${browY + browDip}`}
        stroke="#1f2937"
        strokeWidth={browStroke}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${58 - browWidth / 2} ${browY + browDip} Q 58 ${browY - browDip} ${58 + browWidth / 2} ${browY + browDip}`}
        stroke="#1f2937"
        strokeWidth={browStroke}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx={42} cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#ffffff" />
      <ellipse cx={58} cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#ffffff" />
      <circle cx={42} cy={eyeY} r={irisR} fill={color} />
      <circle cx={58} cy={eyeY} r={irisR} fill={color} />
      <circle cx={42} cy={eyeY} r={irisR * 0.5} fill="#0f172a" />
      <circle cx={58} cy={eyeY} r={irisR * 0.5} fill="#0f172a" />
      <circle cx={43} cy={eyeY - 0.6} r={0.5} fill="#fff" />
      <circle cx={59} cy={eyeY - 0.6} r={0.5} fill="#fff" />
      {glasses === 'round' && (
        <g stroke="#0f172a" strokeWidth="1.2" fill="none">
          <circle cx={42} cy={eyeY} r={5.5} />
          <circle cx={58} cy={eyeY} r={5.5} />
          <line x1={47.5} y1={eyeY} x2={52.5} y2={eyeY} />
        </g>
      )}
      {glasses === 'square' && (
        <g stroke="#0f172a" strokeWidth="1.2" fill="none">
          <rect x={36} y={eyeY - 4.5} width={12} height={9} rx={1.5} />
          <rect x={52} y={eyeY - 4.5} width={12} height={9} rx={1.5} />
          <line x1={48} y1={eyeY} x2={52} y2={eyeY} />
        </g>
      )}
      {glasses === 'reading' && (
        <g stroke="#92400e" strokeWidth="1" fill="none">
          <rect x={36} y={eyeY - 3.5} width={12} height={7} rx={3} />
          <rect x={52} y={eyeY - 3.5} width={12} height={7} rx={3} />
          <line x1={48} y1={eyeY} x2={52} y2={eyeY} />
        </g>
      )}
      {glasses === 'sunglasses' && (
        <g fill="#0f172a">
          <rect x={35} y={eyeY - 4} width={14} height={7} rx={2} />
          <rect x={51} y={eyeY - 4} width={14} height={7} rx={2} />
          <rect x={48.5} y={eyeY - 2} width={3} height={2} />
        </g>
      )}
    </g>
  );
}

function Mouth({ lipstick, stage, age }: { lipstick: Lipstick; stage: ReturnType<typeof stageOf>; age: number }) {
  const y = stage === 'baby' ? 72 : 70;
  const color = LIPSTICK_HEX[lipstick];
  if (color) {
    return (
      <g>
        <path d={`M 43 ${y} Q 50 ${y + 4} 57 ${y}`} stroke={color} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d={`M 44 ${y - 0.5} Q 50 ${y - 2.5} 56 ${y - 0.5}`} stroke={color} strokeWidth="1.4" fill="none" opacity="0.6" />
      </g>
    );
  }
  if (age >= 70) {
    return <path d={`M 44 ${y} Q 50 ${y + 1.5} 56 ${y}`} stroke="#7c2d12" strokeWidth="1.4" fill="none" strokeLinecap="round" />;
  }
  return <path d={`M 44 ${y} Q 50 ${y + 3.5} 56 ${y}`} stroke="#9b2c2c" strokeWidth="1.6" fill="none" strokeLinecap="round" />;
}

function Beard({ kind, color }: { kind: FacialHair; color: string }) {
  if (kind === 'none') return null;
  if (kind === 'stubble') return <ellipse cx="50" cy="74" rx="14" ry="6" fill={color} opacity="0.35" />;
  if (kind === 'mustache') return <path d="M 42 68 Q 50 72 58 68 Q 50 66 42 68 Z" fill={color} />;
  if (kind === 'goatee') return <ellipse cx="50" cy="80" rx="5" ry="4" fill={color} />;
  if (kind === 'beard')
    return (
      <g fill={color}>
        <path d="M 32 70 Q 50 92 68 70 Q 70 80 60 86 Q 50 92 40 86 Q 30 80 32 70 Z" />
      </g>
    );
  if (kind === 'fullBeard')
    return (
      <g fill={color}>
        <path d="M 28 66 Q 32 88 50 94 Q 68 88 72 66 Q 64 80 50 80 Q 36 80 28 66 Z" />
        <path d="M 42 68 Q 50 72 58 68 Q 50 66 42 68 Z" />
      </g>
    );
  return null;
}

function OutfitLayer({ outfit, accessory, neckY }: { outfit: OutfitName; accessory: AvatarLook['accessory']; neckY: number }) {
  // Accessory overrides (status outfits)
  const effective: OutfitName =
    accessory === 'prisonStripes'
      ? 'prisonStripes'
      : accessory === 'jersey'
      ? 'jersey'
      : accessory === 'labCoat'
      ? 'labCoat'
      : accessory === 'suit'
      ? 'suit'
      : outfit;
  // Shirt is drawn from neckY (where the chin meets the body) downward to 100.
  // Collar widens out at the bottom.
  const t = neckY; // top of shirt collar
  const dip = t + 4; // V-neck dip
  const shoulder = t - 2; // shoulder line (slightly above collar)
  const leftX = 18;
  const rightX = 82;
  const innerL = 36;
  const innerR = 64;
  const shirtPath = `M ${leftX} 100 L ${innerL} ${shoulder} L 50 ${dip} L ${innerR} ${shoulder} L ${rightX} 100 Z`;

  switch (effective) {
    case 'hoodie':
      return (
        <g>
          <path d={shirtPath} fill="#475569" />
          <path d={`M ${innerL - 2} ${shoulder + 2} Q 50 ${t - 4} ${innerR + 2} ${shoulder + 2}`} fill="none" stroke="#334155" strokeWidth="1.4" />
          <line x1="48" y1={dip + 2} x2="48" y2="100" stroke="#1e293b" strokeWidth="0.8" />
          <line x1="52" y1={dip + 2} x2="52" y2="100" stroke="#1e293b" strokeWidth="0.8" />
        </g>
      );
    case 'tshirt':
      return <path d={shirtPath} fill="#0ea5b7" />;
    case 'dress':
      return (
        <g>
          <path d={shirtPath} fill="#ec4899" />
          <path d={`M ${innerL} ${shoulder} L 50 ${dip} L ${innerR} ${shoulder}`} stroke="#fff" strokeWidth="1" fill="none" />
        </g>
      );
    case 'suit':
      return (
        <g>
          <path d={shirtPath} fill="#1e293b" />
          <path d={`M ${innerL} ${shoulder} L 50 100 L ${innerR} ${shoulder}`} stroke="#e2e8f0" strokeWidth="1" fill="none" />
          <rect x="48" y={dip + 1} width="4" height="8" fill="#dc2626" />
        </g>
      );
    case 'jersey':
      return (
        <g>
          <path d={shirtPath} fill="#0ea5b7" />
          <text x="50" y="98" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">7</text>
        </g>
      );
    case 'labCoat':
      return (
        <g>
          <path d={shirtPath} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="50" y1={dip} x2="50" y2="100" stroke="#cbd5e1" strokeWidth="0.6" />
          <rect x={innerL + 2} y={dip + 3} width="3" height="4" fill="#dc2626" />
          <rect x={innerR - 6} y={dip + 4} width="2" height="2" fill="#3b82f6" />
        </g>
      );
    case 'prisonStripes':
      return (
        <g>
          <path d={shirtPath} fill="#fde68a" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={leftX + 4} y1={t + 2 + i * 4} x2={rightX - 4} y2={t + 2 + i * 4} stroke="#1f2937" strokeWidth="1.5" />
          ))}
        </g>
      );
    case 'fitness':
      return <path d={shirtPath} fill="#10b981" />;
    case 'crown':
      return (
        <g>
          <path d={shirtPath} fill="#6d28d9" />
          <path d={`M ${innerL} ${shoulder} L 50 ${dip} L ${innerR} ${shoulder}`} stroke="#fbbf24" strokeWidth="1" fill="none" />
        </g>
      );
    case 'goth':
      return (
        <g>
          <path d={shirtPath} fill="#111827" />
          <circle cx="50" cy={dip + 4} r="1.5" fill="#dc2626" />
        </g>
      );
    case 'casual':
    default:
      return <path d={shirtPath} fill="#fbbf24" />;
  }
}

export function CharacterAvatar({ look: rawLook, age, size = 96, bg = 'sun' }: Props) {
  const look = normalizeAvatar(rawLook);
  const skin = SKIN_HEX[look.skin];
  const hair = HAIR_HEX[look.hair];
  const stage = stageOf(age);
  const grayHair = stage === 'elder';
  const hairColor = grayHair ? HAIR_HEX.silver : hair;

  const headR = stage === 'baby' ? 36 : stage === 'toddler' ? 34 : stage === 'child' ? 32 : 30;
  const ears = stage !== 'baby';

  // Compute where the chin/neck meets the body so clothes don't float or clip into the face.
  const headBottom = 54 + (headR + 2); // y coordinate of chin
  const neckY = Math.min(headBottom + 1, 90); // top of shirt collar, slightly below chin

  const bgGrad = {
    sun: ['#fef3c7', '#fde68a'],
    sky: ['#dbeafe', '#bfdbfe'],
    rose: ['#fce7f3', '#fbcfe8'],
    lilac: ['#ede9fe', '#ddd6fe'],
    mint: ['#dcfce7', '#bbf7d0'],
    none: ['transparent', 'transparent'],
  }[bg];

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-label="avatar">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor={bgGrad[0]} />
          <stop offset="100%" stopColor={bgGrad[1]} />
        </radialGradient>
      </defs>
      {bg !== 'none' && <circle cx="50" cy="50" r="48" fill="url(#bgGrad)" />}

      <HairBack style={look.hairStyle} color={hairColor} stage={stage} />

      {ears && (
        <g>
          <ellipse cx={50 - headR} cy={56} rx="3" ry="5" fill={skin.shade} />
          <ellipse cx={50 + headR} cy={56} rx="3" ry="5" fill={skin.shade} />
        </g>
      )}

      <ellipse cx="50" cy="54" rx={headR} ry={headR + 2} fill={skin.base} />

      {(stage === 'teen' || stage === 'adult' || stage === 'older' || stage === 'elder') && (
        <rect x="44" y={headBottom - 2} width="12" height="8" fill={skin.shade} />
      )}

      {look.freckles && (
        <g fill={skin.shade} opacity="0.75">
          <circle cx="42" cy="60" r="0.6" />
          <circle cx="46" cy="58" r="0.6" />
          <circle cx="54" cy="58" r="0.6" />
          <circle cx="58" cy="60" r="0.6" />
          <circle cx="50" cy="62" r="0.6" />
        </g>
      )}
      {(look.blush || stage === 'baby') && (
        <g opacity="0.55">
          <circle cx={36} cy={64} r={3.5} fill="#f9a8d4" />
          <circle cx={64} cy={64} r={3.5} fill="#f9a8d4" />
        </g>
      )}

      <HairFront style={look.hairStyle} color={hairColor} stage={stage} />

      {(stage === 'adult' || stage === 'older' || stage === 'elder') && (
        <Beard kind={look.facialHair} color={grayHair ? '#cbd5e1' : hair} />
      )}

      <path
        d={`M 49 ${stage === 'baby' ? 63 : 60} Q 50 ${stage === 'baby' ? 66 : 65} 51 ${stage === 'baby' ? 63 : 60}`}
        stroke={skin.shade}
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />

      <Eyes shape={look.eyeShape} color={EYE_HEX[look.eyeColor]} brow={look.brow} stage={stage} glasses={look.glasses} />
      <Mouth lipstick={look.lipstick} stage={stage} age={age} />

      {(stage === 'older' || stage === 'elder') && (
        <g stroke="#a16207" strokeWidth="0.6" fill="none" opacity="0.45">
          <path d="M 36 58 Q 40 60 44 58" />
          <path d="M 56 58 Q 60 60 64 58" />
          <path d="M 35 78 Q 50 82 65 78" />
          {stage === 'elder' && <path d="M 38 50 Q 42 49 46 50" />}
        </g>
      )}

      {look.earrings !== 'none' && ears && (
        <g fill="#fbbf24">
          {look.earrings === 'studs' && (
            <>
              <circle cx={50 - headR} cy={60} r="1.2" />
              <circle cx={50 + headR} cy={60} r="1.2" />
            </>
          )}
          {look.earrings === 'hoops' && (
            <>
              <circle cx={50 - headR} cy={62} r="2.2" fill="none" stroke="#fbbf24" strokeWidth="1" />
              <circle cx={50 + headR} cy={62} r="2.2" fill="none" stroke="#fbbf24" strokeWidth="1" />
            </>
          )}
          {look.earrings === 'drops' && (
            <>
              <line x1={50 - headR} y1={60} x2={50 - headR} y2={66} stroke="#fbbf24" strokeWidth="1" />
              <circle cx={50 - headR} cy={67} r="1.5" />
              <line x1={50 + headR} y1={60} x2={50 + headR} y2={66} stroke="#fbbf24" strokeWidth="1" />
              <circle cx={50 + headR} cy={67} r="1.5" />
            </>
          )}
        </g>
      )}

      {look.piercing && stage !== 'baby' && <circle cx={52} cy={66} r="0.7" fill="#cbd5e1" />}

      <OutfitLayer outfit={look.outfit} accessory={look.accessory} neckY={neckY} />

      {look.accessory === 'crown' && (
        <g>
          <path d="M 32 32 L 40 22 L 47 32 L 50 16 L 53 32 L 60 22 L 68 32 Z" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
          <circle cx="50" cy="26" r="1.6" fill="#dc2626" />
          <circle cx="40" cy="32" r="1.2" fill="#34d399" />
          <circle cx="60" cy="32" r="1.2" fill="#3b82f6" />
        </g>
      )}
      {look.accessory === 'shades' && look.glasses === 'none' && (
        <g fill="#0f172a">
          <rect x={35} y={(stage === 'baby' || stage === 'toddler' ? 56 : 52) - 4} width={14} height={7} rx={2} />
          <rect x={51} y={(stage === 'baby' || stage === 'toddler' ? 56 : 52) - 4} width={14} height={7} rx={2} />
          <rect x={48.5} y={(stage === 'baby' || stage === 'toddler' ? 56 : 52) - 2} width={3} height={2} />
        </g>
      )}
      {look.accessory === 'gradCap' && (
        <g>
          <rect x="32" y="30" width="36" height="5" fill="#0f172a" />
          <polygon points="50,22 76,32 50,42 24,32" fill="#0f172a" />
          <line x1="72" y1="31" x2="78" y2="42" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="78" cy="43" r="1.6" fill="#fbbf24" />
        </g>
      )}

      {look.tattoo && (stage === 'teen' || stage === 'adult' || stage === 'older' || stage === 'elder') && (
        <path d={`M 45 ${neckY + 3} Q 48 ${neckY + 1} 51 ${neckY + 3}`} stroke="#0f172a" strokeWidth="0.8" fill="none" />
      )}
    </svg>
  );
}

export function MiniAvatar({ look, age, size = 44, bg = 'sun' }: Props) {
  return <CharacterAvatar look={look} age={age} size={size} bg={bg} />;
}
