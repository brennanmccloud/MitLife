import type { AvatarLook } from '../types/Character';

const SKIN_HEX: Record<AvatarLook['skin'], string> = {
  porcelain: '#f7e0cf',
  sand: '#eccaa3',
  tan: '#d6a371',
  bronze: '#b67a4c',
  umber: '#8a5734',
  ebony: '#5c361f',
};

const HAIR_HEX: Record<AvatarLook['hair'], string> = {
  black: '#1f2937',
  brown: '#7c4a2a',
  blonde: '#e9c46a',
  red: '#c0463a',
  gray: '#94a3b8',
  pink: '#f472b6',
  blue: '#60a5fa',
};

interface Props {
  look: AvatarLook;
  age: number;
  size?: number;
}

export function CharacterAvatar({ look, age, size = 96 }: Props) {
  const skin = SKIN_HEX[look.skin];
  const hair = HAIR_HEX[look.hair];

  // Age stage influences face proportions
  const stage =
    age < 1 ? 'baby' : age < 13 ? 'child' : age < 20 ? 'teen' : age < 50 ? 'adult' : age < 70 ? 'older' : 'elder';

  const headR = stage === 'baby' ? 36 : stage === 'child' ? 33 : 30;
  const eyeY = stage === 'baby' ? 55 : 50;
  const showWrinkles = stage === 'older' || stage === 'elder';
  const grayHair = stage === 'elder';
  const lipsY = stage === 'baby' ? 70 : 65;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-label="avatar">
      <defs>
        <radialGradient id="bg" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#bg)" />
      {/* hair back */}
      <ellipse cx="50" cy="38" rx="32" ry="28" fill={grayHair ? '#cbd5e1' : hair} />
      {/* face */}
      <ellipse cx="50" cy="52" rx={headR} ry={headR + 2} fill={skin} />
      {/* hair top */}
      {stage !== 'baby' && (
        <path d={`M ${50 - headR} ${42} Q 50 ${20} ${50 + headR} ${42} Q 50 ${30} 50 30 Z`} fill={grayHair ? '#cbd5e1' : hair} />
      )}
      {/* eyes */}
      <circle cx={42} cy={eyeY} r={stage === 'baby' ? 3 : 2.4} fill="#1f2937" />
      <circle cx={58} cy={eyeY} r={stage === 'baby' ? 3 : 2.4} fill="#1f2937" />
      {/* blush for baby */}
      {stage === 'baby' && (
        <>
          <circle cx={36} cy={62} r={3.5} fill="#f9a8d4" opacity="0.7" />
          <circle cx={64} cy={62} r={3.5} fill="#f9a8d4" opacity="0.7" />
        </>
      )}
      {/* mouth */}
      <path
        d={`M 44 ${lipsY} Q 50 ${lipsY + 4} 56 ${lipsY}`}
        stroke="#9b2c2c"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      {/* wrinkles */}
      {showWrinkles && (
        <>
          <path d="M 38 58 Q 42 60 46 58" stroke="#a16207" strokeWidth="0.6" fill="none" opacity="0.5" />
          <path d="M 54 58 Q 58 60 62 58" stroke="#a16207" strokeWidth="0.6" fill="none" opacity="0.5" />
          <path d="M 35 76 Q 50 80 65 76" stroke="#a16207" strokeWidth="0.6" fill="none" opacity="0.4" />
        </>
      )}

      {/* accessories */}
      {look.accessory === 'shades' && (
        <g>
          <rect x={34} y={eyeY - 4} width={14} height={6} rx={3} fill="#0f172a" />
          <rect x={52} y={eyeY - 4} width={14} height={6} rx={3} fill="#0f172a" />
          <rect x={48} y={eyeY - 2} width={4} height={2} fill="#0f172a" />
        </g>
      )}
      {look.accessory === 'crown' && (
        <g>
          <path d="M 30 30 L 38 22 L 45 30 L 50 18 L 55 30 L 62 22 L 70 30 Z" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
          <circle cx="50" cy="28" r="2" fill="#dc2626" />
        </g>
      )}
      {look.accessory === 'gradCap' && (
        <g>
          <rect x="32" y="28" width="36" height="6" fill="#0f172a" />
          <polygon points="50,20 78,30 50,40 22,30" fill="#0f172a" />
          <line x1="74" y1="29" x2="80" y2="40" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="80" cy="41" r="2" fill="#fbbf24" />
        </g>
      )}
      {look.accessory === 'suit' && (
        <g>
          <path d="M 25 85 L 50 75 L 75 85 L 75 100 L 25 100 Z" fill="#1e293b" />
          <path d="M 50 75 L 50 95" stroke="#e2e8f0" strokeWidth="1" />
          <rect x="48" y="80" width="4" height="6" fill="#dc2626" />
        </g>
      )}
      {look.accessory === 'prisonStripes' && (
        <g>
          <rect x="22" y="80" width="56" height="20" fill="#fde68a" />
          <rect x="22" y="83" width="56" height="3" fill="#1f2937" />
          <rect x="22" y="90" width="56" height="3" fill="#1f2937" />
          <rect x="22" y="97" width="56" height="3" fill="#1f2937" />
        </g>
      )}
      {look.accessory === 'jersey' && (
        <g>
          <path d="M 25 85 L 50 78 L 75 85 L 75 100 L 25 100 Z" fill="#0ea5b7" />
          <text x="50" y="95" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">7</text>
        </g>
      )}
      {look.accessory === 'labCoat' && (
        <g>
          <path d="M 25 85 L 50 78 L 75 85 L 75 100 L 25 100 Z" fill="#f8fafc" stroke="#cbd5e1" />
          <rect x="48" y="84" width="4" height="6" fill="#dc2626" />
        </g>
      )}
    </svg>
  );
}

export function MiniAvatar({ look, age, size = 44 }: Props) {
  return <CharacterAvatar look={look} age={age} size={size} />;
}
