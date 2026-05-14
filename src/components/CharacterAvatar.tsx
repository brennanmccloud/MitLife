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
  porcelain: { base: '#fbe4d2', shade: '#e8c4a8' },
  sand: { base: '#eccaa3', shade: '#d3a878' },
  tan: { base: '#d6a371', shade: '#b48452' },
  bronze: { base: '#b67a4c', shade: '#925d34' },
  umber: { base: '#8a5734', shade: '#683f23' },
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

// FIXED LAYOUT — head, neck, shoulders all live at the same coords regardless of age.
// Age adjusts: head size slightly, eye size, blush, wrinkles.
const HEAD_CX = 50;
const HEAD_CY = 42;
const NECK_TOP = 65; // chin
const NECK_BOTTOM = 73; // shoulder line
const NECK_LEFT = 44;
const NECK_RIGHT = 56;
// Shoulders / collar
const SHIRT_TOP = NECK_BOTTOM;
const SHIRT_BOTTOM = 100;

function stageOf(age: number) {
  if (age < 1) return 'baby' as const;
  if (age < 6) return 'toddler' as const;
  if (age < 13) return 'child' as const;
  if (age < 20) return 'teen' as const;
  if (age < 50) return 'adult' as const;
  if (age < 70) return 'older' as const;
  return 'elder' as const;
}

function headSize(stage: ReturnType<typeof stageOf>) {
  // Subtle differences so kids look chubbier without changing the layout anchors.
  switch (stage) {
    case 'baby':
      return { rx: 23, ry: 24 };
    case 'toddler':
      return { rx: 22, ry: 23 };
    case 'child':
      return { rx: 21, ry: 22 };
    case 'teen':
      return { rx: 20, ry: 22 };
    case 'adult':
      return { rx: 20, ry: 22 };
    case 'older':
      return { rx: 20, ry: 22 };
    case 'elder':
      return { rx: 19, ry: 21 };
  }
}

function HairBack({ style, color, stage, rx, ry }: { style: HairStyle; color: string; stage: ReturnType<typeof stageOf>; rx: number; ry: number }) {
  if (style === 'bald' || stage === 'baby') return null;
  const chin = HEAD_CY + ry;
  // Side-lock helper: a hair lock hanging at the side of the face/neck.
  const sideLock = (side: 1 | -1, length: number) => {
    const x = HEAD_CX + side * (rx - 1);
    return (
      <path
        d={`M ${x - 4} ${HEAD_CY - 2}
            Q ${x + side * 4} ${HEAD_CY + 4} ${x + side * 2} ${chin + length}
            Q ${x - side * 2} ${chin + length - 2} ${x - 6} ${HEAD_CY + 6}
            Q ${x - 8} ${HEAD_CY - 2} ${x - 4} ${HEAD_CY - 2} Z`}
        fill={color}
      />
    );
  };
  switch (style) {
    case 'long':
      return (
        <g fill={color}>
          <ellipse cx={HEAD_CX} cy={HEAD_CY - 1} rx={rx + 2} ry={ry + 1} />
          {sideLock(-1, 18)}
          {sideLock(1, 18)}
        </g>
      );
    case 'wavy':
      return (
        <g fill={color}>
          <ellipse cx={HEAD_CX} cy={HEAD_CY - 1} rx={rx + 2} ry={ry + 1} />
          {sideLock(-1, 8)}
          {sideLock(1, 8)}
        </g>
      );
    case 'ponytail':
      return (
        <g fill={color}>
          <ellipse cx={HEAD_CX} cy={HEAD_CY - 4} rx={rx + 1} ry={ry - 4} />
          <ellipse cx={HEAD_CX + rx + 4} cy={HEAD_CY + 4} rx={4} ry={12} transform={`rotate(22 ${HEAD_CX + rx + 4} ${HEAD_CY + 4})`} />
        </g>
      );
    case 'braids':
      return (
        <g fill={color}>
          <ellipse cx={HEAD_CX} cy={HEAD_CY - 2} rx={rx + 1} ry={ry - 2} />
          <rect x={HEAD_CX - rx - 3} y={HEAD_CY + 2} width={5} height={ry + 14} rx={2.5} />
          <rect x={HEAD_CX + rx - 2} y={HEAD_CY + 2} width={5} height={ry + 14} rx={2.5} />
        </g>
      );
    case 'afro':
      // wide and tall but never extends below the chin (no beard halo)
      return <ellipse cx={HEAD_CX} cy={HEAD_CY - 4} rx={rx + 9} ry={ry - 1} fill={color} />;
    case 'bun':
      return <ellipse cx={HEAD_CX} cy={HEAD_CY - 2} rx={rx + 1} ry={ry - 4} fill={color} />;
    case 'mohawk':
      return null;
    default:
      return <ellipse cx={HEAD_CX} cy={HEAD_CY - 3} rx={rx + 1} ry={ry - 4} fill={color} />;
  }
}

function HairFront({ style, color, stage, rx, ry }: { style: HairStyle; color: string; stage: ReturnType<typeof stageOf>; rx: number; ry: number }) {
  if (style === 'bald' || stage === 'baby') return null;
  const top = HEAD_CY - ry;
  const browLine = HEAD_CY - ry / 4;
  const leftX = HEAD_CX - rx;
  const rightX = HEAD_CX + rx;
  const dyeStreak = color === '#f472b6' || color === '#60a5fa' || color === '#86efac' || color === '#c4b5fd';

  // Standard cap: a filled hair shape covering the top of the head
  // from the brow up over the crown. Drawn as half-ellipse-ish shape
  // sitting on top of the head ellipse so no thin stripes anymore.
  const cap = (extend: number = 0) => (
    <path
      d={`M ${leftX - extend} ${browLine + 1}
          Q ${leftX - extend} ${top - extend} ${HEAD_CX} ${top - extend - 1}
          Q ${rightX + extend} ${top - extend} ${rightX + extend} ${browLine + 1}
          Q ${HEAD_CX} ${browLine + 5} ${leftX - extend} ${browLine + 1} Z`}
      fill={color}
    />
  );

  // Style-specific extras drawn on top of the cap
  let extras: JSX.Element | null = null;
  switch (style) {
    case 'crop':
      extras = null;
      break;
    case 'short':
      extras = null;
      break;
    case 'pixie':
      // small swept fringe across forehead
      extras = (
        <path
          d={`M ${leftX} ${browLine + 1} Q ${HEAD_CX - 2} ${browLine + 6} ${HEAD_CX + 6} ${browLine + 2}`}
          stroke={color}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
      );
      break;
    case 'long':
    case 'wavy':
      // soft side fringe peek
      extras = (
        <path
          d={`M ${HEAD_CX - rx + 4} ${browLine} Q ${HEAD_CX - 6} ${browLine + 4} ${HEAD_CX + 4} ${browLine + 2}`}
          stroke={color}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
      );
      break;
    case 'curly':
      extras = (
        <g fill={color}>
          <circle cx={leftX + 4} cy={top + 4} r={4.5} />
          <circle cx={leftX + 11} cy={top - 1} r={4.5} />
          <circle cx={HEAD_CX - 2} cy={top - 3} r={4.5} />
          <circle cx={HEAD_CX + 7} cy={top - 1} r={4.5} />
          <circle cx={rightX - 5} cy={top + 1} r={4.5} />
          <circle cx={rightX - 2} cy={top + 6} r={4.5} />
        </g>
      );
      break;
    case 'bun':
      extras = <circle cx={HEAD_CX} cy={top - 5} r={6} fill={color} />;
      break;
    case 'ponytail':
      // slick-back: just the cap, no fringe
      extras = null;
      break;
    case 'mohawk':
      // narrow strip down the center, plus a tall spike
      return (
        <g fill={color}>
          <rect x={HEAD_CX - 5} y={top - 2} width={10} height={ry + 4} rx={2} />
          <path
            d={`M ${HEAD_CX - 4} ${top - 2}
                L ${HEAD_CX - 4} ${top - 12}
                L ${HEAD_CX + 4} ${top - 12}
                L ${HEAD_CX + 4} ${top - 2} Z`}
          />
        </g>
      );
    case 'afro':
      // afro is mostly the back ellipse — add a soft front halo
      extras = (
        <ellipse
          cx={HEAD_CX}
          cy={top + 1}
          rx={rx + 6}
          ry={6}
          fill={color}
        />
      );
      break;
    case 'braids':
      // tight flat top, parted in the middle
      extras = (
        <line x1={HEAD_CX} y1={top + 1} x2={HEAD_CX} y2={browLine} stroke="rgba(0,0,0,0.18)" strokeWidth={0.8} />
      );
      break;
    default:
      extras = null;
  }

  return (
    <g>
      {cap()}
      {extras}
      {dyeStreak && (
        <path
          d={`M ${HEAD_CX - 6} ${browLine - 2} Q ${HEAD_CX - 4} ${browLine + 4} ${HEAD_CX - 8} ${browLine + 8}`}
          stroke="#fff"
          strokeWidth={1.6}
          fill="none"
          opacity="0.55"
        />
      )}
    </g>
  );
}

function Face({ stage, ry, look }: { stage: ReturnType<typeof stageOf>; ry: number; look: AvatarLook }) {
  const big = stage === 'baby' || stage === 'toddler';
  const eyeY = HEAD_CY + (big ? 3 : 1);
  const eyeRx = look.eyeShape === 'narrow' ? 2.2 : look.eyeShape === 'wide' ? 3.6 : look.eyeShape === 'almond' ? 3 : 3;
  const eyeRy = look.eyeShape === 'narrow' ? 1.4 : look.eyeShape === 'wide' ? 2.6 : look.eyeShape === 'almond' ? 1.8 : 3;
  const irisR = big ? 2.2 : 1.6;
  const browWidth = look.brow === 'thick' ? 8 : look.brow === 'thin' ? 5 : 7;
  const browStroke = look.brow === 'thick' ? 2.2 : look.brow === 'thin' ? 1.2 : 1.6;
  const browY = eyeY - 6;
  const browDip = look.brow === 'arched' ? 2 : 0.5;
  const noseY = HEAD_CY + (big ? 6 : 5);
  const mouthY = HEAD_CY + ry - 8;
  const lipColor = LIPSTICK_HEX[look.lipstick];

  return (
    <g>
      {/* eyebrows */}
      <path d={`M ${42 - browWidth / 2} ${browY + browDip} Q 42 ${browY - browDip} ${42 + browWidth / 2} ${browY + browDip}`} stroke="#1f2937" strokeWidth={browStroke} fill="none" strokeLinecap="round" />
      <path d={`M ${58 - browWidth / 2} ${browY + browDip} Q 58 ${browY - browDip} ${58 + browWidth / 2} ${browY + browDip}`} stroke="#1f2937" strokeWidth={browStroke} fill="none" strokeLinecap="round" />
      {/* eyes */}
      <ellipse cx={42} cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#fff" />
      <ellipse cx={58} cy={eyeY} rx={eyeRx} ry={eyeRy} fill="#fff" />
      <circle cx={42} cy={eyeY} r={irisR} fill={EYE_HEX[look.eyeColor]} />
      <circle cx={58} cy={eyeY} r={irisR} fill={EYE_HEX[look.eyeColor]} />
      <circle cx={42} cy={eyeY} r={irisR * 0.5} fill="#0f172a" />
      <circle cx={58} cy={eyeY} r={irisR * 0.5} fill="#0f172a" />
      <circle cx={43} cy={eyeY - 0.6} r={0.5} fill="#fff" />
      <circle cx={59} cy={eyeY - 0.6} r={0.5} fill="#fff" />
      {/* glasses */}
      {look.glasses === 'round' && (
        <g stroke="#0f172a" strokeWidth="1.2" fill="none">
          <circle cx={42} cy={eyeY} r={5.5} />
          <circle cx={58} cy={eyeY} r={5.5} />
          <line x1={47.5} y1={eyeY} x2={52.5} y2={eyeY} />
        </g>
      )}
      {look.glasses === 'square' && (
        <g stroke="#0f172a" strokeWidth="1.2" fill="none">
          <rect x={36} y={eyeY - 4.5} width={12} height={9} rx={1.5} />
          <rect x={52} y={eyeY - 4.5} width={12} height={9} rx={1.5} />
          <line x1={48} y1={eyeY} x2={52} y2={eyeY} />
        </g>
      )}
      {look.glasses === 'reading' && (
        <g stroke="#92400e" strokeWidth="1" fill="none">
          <rect x={36} y={eyeY - 3.5} width={12} height={7} rx={3} />
          <rect x={52} y={eyeY - 3.5} width={12} height={7} rx={3} />
          <line x1={48} y1={eyeY} x2={52} y2={eyeY} />
        </g>
      )}
      {look.glasses === 'sunglasses' && (
        <g fill="#0f172a">
          <rect x={35} y={eyeY - 4} width={14} height={7} rx={2} />
          <rect x={51} y={eyeY - 4} width={14} height={7} rx={2} />
          <rect x={48.5} y={eyeY - 2} width={3} height={2} />
        </g>
      )}
      {/* nose */}
      <path d={`M 49 ${noseY} Q 50 ${noseY + 3} 51 ${noseY}`} stroke="#9b2c2c" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.55" />
      {/* mouth */}
      {lipColor ? (
        <g>
          <path d={`M 44 ${mouthY} Q 50 ${mouthY + 3} 56 ${mouthY}`} stroke={lipColor} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d={`M 45 ${mouthY - 0.5} Q 50 ${mouthY - 2} 55 ${mouthY - 0.5}`} stroke={lipColor} strokeWidth="1.4" fill="none" opacity="0.6" />
        </g>
      ) : (
        <path d={`M 44 ${mouthY} Q 50 ${mouthY + (stage === 'elder' ? 1.5 : 3)} 56 ${mouthY}`} stroke="#9b2c2c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      )}
    </g>
  );
}

function Beard({ kind, color, ry }: { kind: FacialHair; color: string; ry: number }) {
  if (kind === 'none') return null;
  const jawCy = HEAD_CY + ry - 4;
  if (kind === 'stubble') return <ellipse cx={HEAD_CX} cy={jawCy} rx={14} ry={5} fill={color} opacity="0.3" />;
  if (kind === 'mustache') return <path d={`M ${HEAD_CX - 7} ${jawCy - 4} Q ${HEAD_CX} ${jawCy - 1} ${HEAD_CX + 7} ${jawCy - 4} Q ${HEAD_CX} ${jawCy - 6} ${HEAD_CX - 7} ${jawCy - 4} Z`} fill={color} />;
  if (kind === 'goatee') return <ellipse cx={HEAD_CX} cy={jawCy + 2} rx={4} ry={3.5} fill={color} />;
  if (kind === 'beard')
    return (
      <path d={`M ${HEAD_CX - 16} ${jawCy - 4} Q ${HEAD_CX} ${jawCy + 10} ${HEAD_CX + 16} ${jawCy - 4} Q ${HEAD_CX + 14} ${jawCy + 5} ${HEAD_CX} ${jawCy + 8} Q ${HEAD_CX - 14} ${jawCy + 5} ${HEAD_CX - 16} ${jawCy - 4} Z`} fill={color} />
    );
  if (kind === 'fullBeard')
    return (
      <g fill={color}>
        <path d={`M ${HEAD_CX - 19} ${jawCy - 10} Q ${HEAD_CX - 16} ${jawCy + 8} ${HEAD_CX} ${jawCy + 12} Q ${HEAD_CX + 16} ${jawCy + 8} ${HEAD_CX + 19} ${jawCy - 10} Q ${HEAD_CX + 12} ${jawCy + 2} ${HEAD_CX} ${jawCy + 2} Q ${HEAD_CX - 12} ${jawCy + 2} ${HEAD_CX - 19} ${jawCy - 10} Z`} />
        <path d={`M ${HEAD_CX - 7} ${jawCy - 4} Q ${HEAD_CX} ${jawCy - 1} ${HEAD_CX + 7} ${jawCy - 4} Q ${HEAD_CX} ${jawCy - 6} ${HEAD_CX - 7} ${jawCy - 4} Z`} />
      </g>
    );
  return null;
}

function Body({ outfit, accessory }: { outfit: OutfitName; accessory: AvatarLook['accessory'] }) {
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
  const SHOULDER_L = 22;
  const SHOULDER_R = 78;
  const NECK_L = NECK_LEFT;
  const NECK_R = NECK_RIGHT;
  const collarTop = NECK_BOTTOM - 1;
  const collarDip = NECK_BOTTOM + 4;
  const shirtPath = `M ${SHOULDER_L} ${SHIRT_BOTTOM} L ${SHOULDER_L} ${SHIRT_TOP + 6} Q ${SHOULDER_L + 4} ${SHIRT_TOP} ${NECK_L} ${collarTop} L ${HEAD_CX} ${collarDip} L ${NECK_R} ${collarTop} Q ${SHOULDER_R - 4} ${SHIRT_TOP} ${SHOULDER_R} ${SHIRT_TOP + 6} L ${SHOULDER_R} ${SHIRT_BOTTOM} Z`;

  const renderShirt = (fill: string, stroke?: string) => (
    <path d={shirtPath} fill={fill} stroke={stroke ?? 'none'} strokeWidth={stroke ? 0.8 : 0} />
  );

  switch (effective) {
    case 'hoodie':
      return (
        <g>
          {renderShirt('#475569')}
          <path d={`M ${NECK_L - 4} ${collarTop + 1} Q ${HEAD_CX} ${collarDip - 6} ${NECK_R + 4} ${collarTop + 1}`} fill="none" stroke="#334155" strokeWidth="1.4" />
          <line x1={HEAD_CX - 2} y1={collarDip + 3} x2={HEAD_CX - 2} y2={SHIRT_BOTTOM} stroke="#1e293b" strokeWidth="0.8" />
          <line x1={HEAD_CX + 2} y1={collarDip + 3} x2={HEAD_CX + 2} y2={SHIRT_BOTTOM} stroke="#1e293b" strokeWidth="0.8" />
        </g>
      );
    case 'tshirt':
      return renderShirt('#0ea5b7');
    case 'dress':
      return (
        <g>
          {renderShirt('#ec4899')}
          <path d={`M ${NECK_L} ${collarTop} L ${HEAD_CX} ${collarDip} L ${NECK_R} ${collarTop}`} stroke="#fff" strokeWidth="1" fill="none" />
        </g>
      );
    case 'suit':
      return (
        <g>
          {renderShirt('#1e293b')}
          <path d={`M ${NECK_L + 1} ${collarTop + 1} L ${HEAD_CX} ${SHIRT_BOTTOM} L ${NECK_R - 1} ${collarTop + 1}`} stroke="#e2e8f0" strokeWidth="1" fill="none" />
          <rect x={HEAD_CX - 2} y={collarDip + 2} width={4} height={8} fill="#dc2626" />
        </g>
      );
    case 'jersey':
      return (
        <g>
          {renderShirt('#0ea5b7')}
          <text x={HEAD_CX} y={SHIRT_BOTTOM - 4} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">7</text>
        </g>
      );
    case 'labCoat':
      return (
        <g>
          {renderShirt('#f8fafc', '#cbd5e1')}
          <line x1={HEAD_CX} y1={collarDip + 2} x2={HEAD_CX} y2={SHIRT_BOTTOM} stroke="#cbd5e1" strokeWidth="0.6" />
          <rect x={HEAD_CX - 12} y={collarDip + 5} width={3} height={4} fill="#dc2626" />
          <rect x={HEAD_CX + 8} y={collarDip + 6} width={2.5} height={2.5} fill="#3b82f6" />
        </g>
      );
    case 'prisonStripes':
      return (
        <g>
          {renderShirt('#fde68a')}
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={26} y1={SHIRT_TOP + 4 + i * 5} x2={74} y2={SHIRT_TOP + 4 + i * 5} stroke="#1f2937" strokeWidth="1.4" />
          ))}
        </g>
      );
    case 'fitness':
      return (
        <g>
          {renderShirt('#10b981')}
          <path d={`M ${HEAD_CX - 6} ${SHIRT_BOTTOM - 8} L ${HEAD_CX + 6} ${SHIRT_BOTTOM - 8}`} stroke="#fff" strokeWidth="1" />
        </g>
      );
    case 'crown':
      return (
        <g>
          {renderShirt('#6d28d9')}
          <path d={`M ${NECK_L} ${collarTop} L ${HEAD_CX} ${collarDip} L ${NECK_R} ${collarTop}`} stroke="#fbbf24" strokeWidth="1" fill="none" />
        </g>
      );
    case 'goth':
      return (
        <g>
          {renderShirt('#111827')}
          <circle cx={HEAD_CX} cy={collarDip + 4} r="1.5" fill="#dc2626" />
        </g>
      );
    case 'casual':
    default:
      return renderShirt('#fbbf24');
  }
}

export function CharacterAvatar({ look: rawLook, age, size = 96, bg = 'sun' }: Props) {
  const look = normalizeAvatar(rawLook);
  const skin = SKIN_HEX[look.skin];
  const hair = HAIR_HEX[look.hair];
  const stage = stageOf(age);
  const grayHair = stage === 'elder';
  const hairColor = grayHair ? HAIR_HEX.silver : hair;
  const { rx, ry } = headSize(stage);

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
        <radialGradient id="mit-bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor={bgGrad[0]} />
          <stop offset="100%" stopColor={bgGrad[1]} />
        </radialGradient>
      </defs>
      {bg !== 'none' && <circle cx="50" cy="50" r="48" fill="url(#mit-bg)" />}

      {/* Body first so head sits in front */}
      <Body outfit={look.outfit} accessory={look.accessory} />

      {/* Neck (visible above shirt collar, behind head) */}
      <rect x={NECK_LEFT} y={NECK_TOP - 2} width={NECK_RIGHT - NECK_LEFT} height={NECK_BOTTOM - NECK_TOP + 2} fill={skin.shade} />

      {/* Back hair behind head */}
      <HairBack style={look.hairStyle} color={hairColor} stage={stage} rx={rx} ry={ry} />

      {/* Ears */}
      {stage !== 'baby' && (
        <g>
          <ellipse cx={HEAD_CX - rx} cy={HEAD_CY + 2} rx={3} ry={5} fill={skin.shade} />
          <ellipse cx={HEAD_CX + rx} cy={HEAD_CY + 2} rx={3} ry={5} fill={skin.shade} />
        </g>
      )}

      {/* Head */}
      <ellipse cx={HEAD_CX} cy={HEAD_CY} rx={rx} ry={ry} fill={skin.base} />

      {/* Freckles */}
      {look.freckles && (
        <g fill={skin.shade} opacity="0.75">
          <circle cx={42} cy={HEAD_CY + 6} r={0.6} />
          <circle cx={46} cy={HEAD_CY + 5} r={0.6} />
          <circle cx={54} cy={HEAD_CY + 5} r={0.6} />
          <circle cx={58} cy={HEAD_CY + 6} r={0.6} />
          <circle cx={50} cy={HEAD_CY + 8} r={0.6} />
        </g>
      )}

      {/* Blush */}
      {(look.blush || stage === 'baby') && (
        <g opacity="0.55">
          <circle cx={HEAD_CX - 10} cy={HEAD_CY + 8} r={3.5} fill="#f9a8d4" />
          <circle cx={HEAD_CX + 10} cy={HEAD_CY + 8} r={3.5} fill="#f9a8d4" />
        </g>
      )}

      {/* Front hair on top of head */}
      <HairFront style={look.hairStyle} color={hairColor} stage={stage} rx={rx} ry={ry} />

      {/* Beard */}
      {(stage === 'adult' || stage === 'older' || stage === 'elder') && (
        <Beard kind={look.facialHair} color={grayHair ? '#cbd5e1' : hair} ry={ry} />
      )}

      {/* Face */}
      <Face stage={stage} ry={ry} look={look} />

      {/* Wrinkles */}
      {(stage === 'older' || stage === 'elder') && (
        <g stroke="#a16207" strokeWidth="0.6" fill="none" opacity="0.45">
          <path d={`M ${HEAD_CX - 14} ${HEAD_CY + 6} Q ${HEAD_CX - 10} ${HEAD_CY + 8} ${HEAD_CX - 6} ${HEAD_CY + 6}`} />
          <path d={`M ${HEAD_CX + 6} ${HEAD_CY + 6} Q ${HEAD_CX + 10} ${HEAD_CY + 8} ${HEAD_CX + 14} ${HEAD_CY + 6}`} />
          <path d={`M ${HEAD_CX - 12} ${HEAD_CY + ry - 12} Q ${HEAD_CX} ${HEAD_CY + ry - 8} ${HEAD_CX + 12} ${HEAD_CY + ry - 12}`} />
        </g>
      )}

      {/* Earrings */}
      {look.earrings !== 'none' && stage !== 'baby' && (
        <g fill="#fbbf24">
          {look.earrings === 'studs' && (
            <>
              <circle cx={HEAD_CX - rx} cy={HEAD_CY + 6} r={1.2} />
              <circle cx={HEAD_CX + rx} cy={HEAD_CY + 6} r={1.2} />
            </>
          )}
          {look.earrings === 'hoops' && (
            <>
              <circle cx={HEAD_CX - rx} cy={HEAD_CY + 8} r={2.2} fill="none" stroke="#fbbf24" strokeWidth="1" />
              <circle cx={HEAD_CX + rx} cy={HEAD_CY + 8} r={2.2} fill="none" stroke="#fbbf24" strokeWidth="1" />
            </>
          )}
          {look.earrings === 'drops' && (
            <>
              <line x1={HEAD_CX - rx} y1={HEAD_CY + 6} x2={HEAD_CX - rx} y2={HEAD_CY + 11} stroke="#fbbf24" strokeWidth="1" />
              <circle cx={HEAD_CX - rx} cy={HEAD_CY + 12} r={1.5} />
              <line x1={HEAD_CX + rx} y1={HEAD_CY + 6} x2={HEAD_CX + rx} y2={HEAD_CY + 11} stroke="#fbbf24" strokeWidth="1" />
              <circle cx={HEAD_CX + rx} cy={HEAD_CY + 12} r={1.5} />
            </>
          )}
        </g>
      )}

      {/* Face piercing */}
      {look.piercing && stage !== 'baby' && <circle cx={HEAD_CX + 2} cy={HEAD_CY + 12} r={0.7} fill="#cbd5e1" />}

      {/* Status accessories */}
      {look.accessory === 'crown' && (
        <g>
          <path d={`M ${HEAD_CX - 16} ${HEAD_CY - ry - 4} L ${HEAD_CX - 10} ${HEAD_CY - ry - 14} L ${HEAD_CX - 5} ${HEAD_CY - ry - 4} L ${HEAD_CX} ${HEAD_CY - ry - 18} L ${HEAD_CX + 5} ${HEAD_CY - ry - 4} L ${HEAD_CX + 10} ${HEAD_CY - ry - 14} L ${HEAD_CX + 16} ${HEAD_CY - ry - 4} Z`} fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
          <circle cx={HEAD_CX} cy={HEAD_CY - ry - 10} r={1.6} fill="#dc2626" />
        </g>
      )}
      {look.accessory === 'shades' && look.glasses === 'none' && (
        <g fill="#0f172a">
          {(() => {
            const eyeY = HEAD_CY + (stage === 'baby' || stage === 'toddler' ? 3 : 1);
            return (
              <>
                <rect x={35} y={eyeY - 4} width={14} height={7} rx={2} />
                <rect x={51} y={eyeY - 4} width={14} height={7} rx={2} />
                <rect x={48.5} y={eyeY - 2} width={3} height={2} />
              </>
            );
          })()}
        </g>
      )}
      {look.accessory === 'gradCap' && (
        <g>
          <rect x={HEAD_CX - 18} y={HEAD_CY - ry - 6} width={36} height={5} fill="#0f172a" />
          <polygon points={`${HEAD_CX},${HEAD_CY - ry - 14} ${HEAD_CX + 26},${HEAD_CY - ry - 4} ${HEAD_CX},${HEAD_CY - ry + 6} ${HEAD_CX - 26},${HEAD_CY - ry - 4}`} fill="#0f172a" />
          <line x1={HEAD_CX + 22} y1={HEAD_CY - ry - 5} x2={HEAD_CX + 28} y2={HEAD_CY - ry + 6} stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx={HEAD_CX + 28} cy={HEAD_CY - ry + 7} r={1.6} fill="#fbbf24" />
        </g>
      )}

      {/* Tattoo on neck */}
      {look.tattoo && stage !== 'baby' && (
        <path d={`M ${HEAD_CX - 4} ${NECK_TOP + 4} Q ${HEAD_CX} ${NECK_TOP + 2} ${HEAD_CX + 4} ${NECK_TOP + 4}`} stroke="#0f172a" strokeWidth="0.8" fill="none" />
      )}
    </svg>
  );
}

export function MiniAvatar({ look, age, size = 44, bg = 'sun' }: Props) {
  return <CharacterAvatar look={look} age={age} size={size} bg={bg} />;
}
