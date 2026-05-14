import type { AvatarLook, BrowShape, EyeColor, EyeShape, FacialHair, Glasses, HairColor, HairStyle, Lipstick, Outfit, SkinTone } from '../types/Character';

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
  if (style === 'long') return <ellipse cx="50" cy="60" rx="36" ry="34" fill={color} />;
  if (style === 'wavy') return <ellipse cx="50" cy="58" rx="34" ry="30" fill={color} />;
  if (style === 'ponytail')
    return (
      <>
        <ellipse cx="50" cy="44" rx="30" ry="22" fill={color} />
        <ellipse cx="78" cy="50" rx="6" ry="14" fill={color} transform="rotate(20 78 50)" />
      </>
    );
  if (style === 'braids')
    return (
      <>
        <ellipse cx="50" cy="44" rx="30" ry="22" fill={color} />
        <rect x="20" y="48" width="6" height="22" rx="3" fill={color} />
        <rect x="74" y="48" width="6" height="22" rx="3" fill={color} />
      </>
    );
  if (style === 'afro') return <circle cx="50" cy="40" r="34" fill={color} />;
  return <ellipse cx="50" cy="40" rx="32" ry="26" fill={color} />;
}

function HairFront({ style, color, stage }: { style: HairStyle; color: string; stage: ReturnType<typeof stageOf> }) {
  if (style === 'bald' || stage === 'baby') return null;
  const dyeStreak =
    color === '#f472b6' || color === '#60a5fa' || color === '#86efac' || color === '#c4b5fd';
  const baseTop = () => {
    switch (style) {
      case 'crop':
        return <path d="M 22 42 Q 50 18 78 42 L 78 36 Q 50 22 22 36 Z" fill={color} />;
      case 'short':
        return <path d="M 20 44 Q 50 16 80 44 Q 65 28 50 28 Q 35 28 20 44 Z" fill={color} />;
      case 'pixie':
        return <path d="M 22 42 Q 50 22 78 42 Q 64 32 50 32 Q 40 32 32 38 Z" fill={color} />;
      case 'long':
        return <path d="M 18 44 Q 50 18 82 44 Q 60 28 50 28 Q 40 28 18 38 Z" fill={color} />;
      case 'wavy':
        return <path d="M 20 44 Q 32 30 40 38 Q 50 28 60 38 Q 68 30 80 44 Q 50 30 20 44 Z" fill={color} />;
      case 'curly':
        return (
          <g fill={color}>
            <circle cx="28" cy="36" r="8" />
            <circle cx="40" cy="30" r="8" />
            <circle cx="50" cy="28" r="8" />
            <circle cx="60" cy="30" r="8" />
            <circle cx="72" cy="36" r="8" />
          </g>
        );
      case 'bun':
        return (
          <g fill={color}>
            <path d="M 22 42 Q 50 22 78 42 Q 50 30 22 42 Z" />
            <circle cx="50" cy="20" r="9" />
          </g>
        );
      case 'ponytail':
        return <path d="M 22 42 Q 50 20 78 42 Q 50 28 22 42 Z" fill={color} />;
      case 'mohawk':
        return (
          <g fill={color}>
            <path d="M 42 14 L 58 14 L 58 44 L 42 44 Z" />
          </g>
        );
      case 'afro':
        return <path d="M 18 38 Q 50 8 82 38 Q 60 22 50 22 Q 40 22 18 32 Z" fill={color} />;
      case 'braids':
        return <path d="M 22 42 Q 50 22 78 42 Q 50 30 22 42 Z" fill={color} />;
      default:
        return null;
    }
  };
  return (
    <g>
      {baseTop()}
      {dyeStreak && <path d="M 46 24 Q 48 36 44 44" stroke="#fff" strokeWidth="2" fill="none" opacity="0.5" />}
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
      {/* eyebrows */}
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
      {/* eye whites */}
      <ellipse cx={42} cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#ffffff" />
      <ellipse cx={58} cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#ffffff" />
      {/* iris */}
      <circle cx={42} cy={eyeY} r={irisR} fill={color} />
      <circle cx={58} cy={eyeY} r={irisR} fill={color} />
      {/* pupil */}
      <circle cx={42} cy={eyeY} r={irisR * 0.5} fill="#0f172a" />
      <circle cx={58} cy={eyeY} r={irisR * 0.5} fill="#0f172a" />
      {/* sparkle */}
      <circle cx={43} cy={eyeY - 0.6} r={0.5} fill="#fff" />
      <circle cx={59} cy={eyeY - 0.6} r={0.5} fill="#fff" />
      {/* glasses */}
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

function Outfit({ outfit, accessory, skin }: { outfit: Outfit; accessory: AvatarLook['accessory']; skin: { base: string; shade: string } }) {
  // accessory takes precedence visually for clearer status
  const effective: Outfit = accessory === 'prisonStripes' ? 'prisonStripes' : accessory === 'jersey' ? 'jersey' : accessory === 'labCoat' ? 'labCoat' : accessory === 'suit' ? 'suit' : outfit;
  const neckY = 86;
  const shirt = (color: string, accent?: string) => (
    <g>
      <path d="M 22 100 L 38 84 L 50 88 L 62 84 L 78 100 Z" fill={color} />
      {accent && <path d="M 50 88 L 50 100" stroke={accent} strokeWidth="1.2" />}
    </g>
  );
  switch (effective) {
    case 'hoodie':
      return (
        <g>
          {shirt('#475569')}
          <path d="M 36 86 Q 50 78 64 86" fill="none" stroke="#334155" strokeWidth="1.4" />
          <line x1="48" y1="92" x2="48" y2="100" stroke="#1e293b" strokeWidth="0.8" />
          <line x1="52" y1="92" x2="52" y2="100" stroke="#1e293b" strokeWidth="0.8" />
        </g>
      );
    case 'tshirt':
      return shirt('#0ea5b7');
    case 'dress':
      return (
        <g>
          <path d="M 24 100 L 36 84 L 50 88 L 64 84 L 76 100 Z" fill="#ec4899" />
          <path d="M 36 84 L 50 88 L 64 84" stroke="#fff" strokeWidth="1" fill="none" />
        </g>
      );
    case 'suit':
      return (
        <g>
          <path d="M 22 100 L 38 84 L 50 88 L 62 84 L 78 100 Z" fill="#1e293b" />
          <path d="M 38 84 L 50 100 L 62 84" stroke="#e2e8f0" strokeWidth="1" fill="none" />
          <rect x="48" y="86" width="4" height="8" fill="#dc2626" />
        </g>
      );
    case 'jersey':
      return (
        <g>
          {shirt('#0ea5b7')}
          <text x="50" y="98" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">7</text>
        </g>
      );
    case 'labCoat':
      return (
        <g>
          {shirt('#f8fafc', '#cbd5e1')}
          <rect x="44" y="90" width="3" height="4" fill="#dc2626" />
          <rect x="55" y="91" width="2" height="2" fill="#3b82f6" />
        </g>
      );
    case 'prisonStripes':
      return (
        <g>
          <path d="M 22 100 L 38 84 L 50 88 L 62 84 L 78 100 Z" fill="#fde68a" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="22" y1={86 + i * 4} x2="78" y2={86 + i * 4} stroke="#1f2937" strokeWidth="1.5" />
          ))}
        </g>
      );
    case 'fitness':
      return shirt('#10b981');
    case 'crown':
      return (
        <g>
          {shirt('#6d28d9', '#fbbf24')}
          <rect x="42" y="91" width="16" height="3" fill="#fbbf24" />
        </g>
      );
    case 'goth':
      return (
        <g>
          {shirt('#111827')}
          <circle cx="50" cy="90" r="1.5" fill="#dc2626" />
        </g>
      );
    case 'casual':
    default:
      return shirt('#fde68a');
  }
  // unreachable — for TS
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _n = neckY;
  return null;
}

export function CharacterAvatar({ look, age, size = 96, bg = 'sun' }: Props) {
  const skin = SKIN_HEX[look.skin];
  const hair = HAIR_HEX[look.hair];
  const stage = stageOf(age);
  const grayHair = stage === 'elder';
  const hairColor = grayHair ? HAIR_HEX.silver : hair;

  const headR = stage === 'baby' ? 36 : stage === 'toddler' ? 34 : stage === 'child' ? 32 : 30;
  const ears = stage !== 'baby';

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
        <clipPath id="headClip">
          <ellipse cx="50" cy="54" rx={headR} ry={headR + 2} />
        </clipPath>
      </defs>
      {bg !== 'none' && <circle cx="50" cy="50" r="48" fill="url(#bgGrad)" />}

      <HairBack style={look.hairStyle} color={hairColor} stage={stage} />

      {/* ears */}
      {ears && (
        <g>
          <ellipse cx={50 - headR} cy={56} rx="3" ry="5" fill={skin.shade} />
          <ellipse cx={50 + headR} cy={56} rx="3" ry="5" fill={skin.shade} />
        </g>
      )}

      {/* face */}
      <ellipse cx="50" cy="54" rx={headR} ry={headR + 2} fill={skin.base} />

      {/* neck (only adult/older) */}
      {(stage === 'teen' || stage === 'adult' || stage === 'older' || stage === 'elder') && (
        <rect x="44" y={54 + headR - 4} width="12" height="10" fill={skin.shade} />
      )}

      {/* freckles */}
      {look.freckles && (
        <g fill={skin.shade} opacity="0.75">
          <circle cx="42" cy="60" r="0.6" />
          <circle cx="46" cy="58" r="0.6" />
          <circle cx="54" cy="58" r="0.6" />
          <circle cx="58" cy="60" r="0.6" />
          <circle cx="50" cy="62" r="0.6" />
        </g>
      )}
      {/* blush */}
      {(look.blush || stage === 'baby') && (
        <g opacity="0.55">
          <circle cx={36} cy={64} r={3.5} fill="#f9a8d4" />
          <circle cx={64} cy={64} r={3.5} fill="#f9a8d4" />
        </g>
      )}

      <HairFront style={look.hairStyle} color={hairColor} stage={stage} />

      {/* facial hair (skip kids/teens for realism unless explicitly set on adult+) */}
      {(stage === 'adult' || stage === 'older' || stage === 'elder') && (
        <Beard kind={look.facialHair} color={grayHair ? '#cbd5e1' : hair} />
      )}

      {/* nose */}
      <path d={`M 49 ${stage === 'baby' ? 63 : 60} Q 50 ${stage === 'baby' ? 66 : 65} 51 ${stage === 'baby' ? 63 : 60}`} stroke={skin.shade} strokeWidth="1.2" fill="none" strokeLinecap="round" />

      <Eyes shape={look.eyeShape} color={EYE_HEX[look.eyeColor]} brow={look.brow} stage={stage} glasses={look.glasses} />
      <Mouth lipstick={look.lipstick} stage={stage} age={age} />

      {/* wrinkles */}
      {(stage === 'older' || stage === 'elder') && (
        <g stroke="#a16207" strokeWidth="0.6" fill="none" opacity="0.45">
          <path d="M 36 58 Q 40 60 44 58" />
          <path d="M 56 58 Q 60 60 64 58" />
          <path d="M 35 78 Q 50 82 65 78" />
          {stage === 'elder' && <path d="M 38 50 Q 42 49 46 50" />}
        </g>
      )}

      {/* earrings */}
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

      {/* face piercing */}
      {look.piercing && stage !== 'baby' && (
        <circle cx={52} cy={66} r="0.7" fill="#cbd5e1" />
      )}

      {/* outfit */}
      <Outfit outfit={look.outfit} accessory={look.accessory} skin={skin} />

      {/* status accessories on top */}
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
          <rect x={35} y={(stage === 'baby' ? 56 : 52) - 4} width={14} height={7} rx={2} />
          <rect x={51} y={(stage === 'baby' ? 56 : 52) - 4} width={14} height={7} rx={2} />
          <rect x={48.5} y={(stage === 'baby' ? 56 : 52) - 2} width={3} height={2} />
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

      {/* tattoo on neck */}
      {look.tattoo && (stage === 'teen' || stage === 'adult' || stage === 'older' || stage === 'elder') && (
        <path d="M 45 84 Q 48 82 51 84" stroke="#0f172a" strokeWidth="0.8" fill="none" />
      )}
    </svg>
  );
}

export function MiniAvatar({ look, age, size = 44, bg = 'sun' }: Props) {
  return <CharacterAvatar look={look} age={age} size={size} bg={bg} />;
}
