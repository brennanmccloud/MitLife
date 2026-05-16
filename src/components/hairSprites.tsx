import type { HairStyle } from '../types/Character';

/**
 * Pre-designed hair sprites.
 *
 * Every sprite is hand-drawn for a FIXED head:
 *   head center (50, 42), rx 21, ry 22.5
 *   crown y≈20, chin y≈64, temples x≈29 / x≈71
 *
 * Because nothing here is computed from runtime values, hair always renders
 * the same way — no drifting parts. `back` draws behind the head, `front`
 * draws on top of it. Both take only a fill color.
 */

type HairLayer = (color: string) => JSX.Element | null;

interface HairSprite {
  back: HairLayer;
  front: HairLayer;
}

const none: HairLayer = () => null;

export const HAIR_SPRITES: Record<HairStyle, HairSprite> = {
  bald: { back: none, front: none },

  short: {
    back: (c) => <path d="M32 40 C30 21 70 21 68 40 C58 31 42 31 32 40 Z" fill={c} />,
    front: (c) => (
      <path
        d="M28 45 C25 17 75 17 72 45 C70 36 63 33 57 34 C54 39 46 39 43 34 C37 33 30 36 28 45 Z"
        fill={c}
      />
    ),
  },

  crop: {
    back: (c) => <path d="M34 38 C34 25 66 25 66 38 C58 32 42 32 34 38 Z" fill={c} />,
    front: (c) => (
      <g fill={c}>
        <path d="M30 41 C29 23 71 23 70 41 C67 35 60 33 54 34 C52 36 48 36 46 34 C40 33 33 35 30 41 Z" />
        {/* faded shaved sideburns */}
        <rect x="30" y="41" width="3" height="6" rx="1.5" opacity="0.5" />
        <rect x="67" y="41" width="3" height="6" rx="1.5" opacity="0.5" />
      </g>
    ),
  },

  pixie: {
    back: (c) => <path d="M33 39 C33 22 67 22 67 39 C58 31 42 31 33 39 Z" fill={c} />,
    front: (c) => (
      <path
        d="M28 44 C26 17 74 17 72 43 C69 36 62 34 56 35 C52 45 41 46 35 40 C33 38 30 40 28 44 Z"
        fill={c}
      />
    ),
  },

  long: {
    back: (c) => (
      <g fill={c}>
        <ellipse cx="50" cy="40" rx="25" ry="25" />
        <path d="M25 40 C22 60 23 82 28 95 L40 95 C36 80 36 58 37 42 Z" />
        <path d="M75 40 C78 60 77 82 72 95 L60 95 C64 80 64 58 63 42 Z" />
      </g>
    ),
    front: (c) => (
      <path
        d="M27 46 C24 15 76 15 73 46 C71 35 63 33 55 35 C53 47 47 47 45 35 C37 33 29 35 27 46 Z"
        fill={c}
      />
    ),
  },

  wavy: {
    back: (c) => (
      <g fill={c}>
        <ellipse cx="50" cy="40" rx="24.5" ry="24.5" />
        <path d="M26 42 C24 56 27 68 22 79 C30 77 33 69 34 61 C35 53 34 47 34 42 Z" />
        <path d="M74 42 C76 56 73 68 78 79 C70 77 67 69 66 61 C65 53 66 47 66 42 Z" />
      </g>
    ),
    front: (c) => (
      <path
        d="M27 45 C24 16 76 16 73 45 C69 39 65 43 61 38 C57 43 53 38 50 43 C47 38 43 43 39 38 C35 43 31 39 27 45 Z"
        fill={c}
      />
    ),
  },

  curly: {
    back: (c) => (
      <g fill={c}>
        <circle cx="35" cy="34" r="11" />
        <circle cx="50" cy="27" r="12" />
        <circle cx="65" cy="34" r="11" />
        <circle cx="30" cy="47" r="9" />
        <circle cx="70" cy="47" r="9" />
      </g>
    ),
    front: (c) => (
      <g fill={c}>
        <circle cx="33" cy="37" r="8.5" />
        <circle cx="42" cy="28" r="8.5" />
        <circle cx="52" cy="25" r="8.5" />
        <circle cx="62" cy="28" r="8.5" />
        <circle cx="69" cy="38" r="8.5" />
        <circle cx="37" cy="45" r="6" />
        <circle cx="64" cy="45" r="6" />
      </g>
    ),
  },

  bun: {
    back: (c) => (
      <g fill={c}>
        <path d="M32 40 C32 22 68 22 68 40 C58 31 42 31 32 40 Z" />
        <circle cx="50" cy="15" r="8.5" />
      </g>
    ),
    front: (c) => (
      <g fill={c}>
        <path d="M30 42 C30 20 70 20 70 42 C66 33 58 32 50 32 C42 32 34 33 30 42 Z" />
        <circle cx="50" cy="14" r="8" />
        <circle cx="50" cy="14" r="4" fill="rgba(0,0,0,0.12)" />
      </g>
    ),
  },

  ponytail: {
    back: (c) => (
      <g fill={c}>
        <path d="M32 40 C32 21 68 21 68 40 C58 31 42 31 32 40 Z" />
        <path d="M64 28 C82 30 86 52 80 74 C76 66 73 70 70 58 C68 48 64 40 60 34 Z" />
      </g>
    ),
    front: (c) => (
      <path d="M30 42 C30 19 70 19 70 42 C66 34 58 33 50 33 C42 33 34 34 30 42 Z" fill={c} />
    ),
  },

  mohawk: {
    back: none,
    front: (c) => (
      <g fill={c}>
        <path d="M43 46 L43 13 C43 8 57 8 57 13 L57 46 C54 41 46 41 43 46 Z" />
        <path d="M45 13 L48 5 L52 9 L55 5 L55 14 Z" />
      </g>
    ),
  },

  afro: {
    back: (c) => <circle cx="50" cy="35" r="27" fill={c} />,
    front: (c) => (
      <path
        d="M23 46 C16 12 84 12 77 46 C72 33 61 31 50 31 C39 31 28 33 23 46 Z"
        fill={c}
      />
    ),
  },

  braids: {
    back: (c) => (
      <g fill={c}>
        <path d="M32 40 C32 21 68 21 68 40 C58 31 42 31 32 40 Z" />
        <path d="M30 41 C25 43 27 50 30 54 C25 58 28 66 31 70 C26 74 29 84 32 90 L38 90 C35 82 35 74 38 68 C33 62 36 56 37 50 C33 46 34 43 33 41 Z" />
        <path d="M70 41 C75 43 73 50 70 54 C75 58 72 66 69 70 C74 74 71 84 68 90 L62 90 C65 82 65 74 62 68 C67 62 64 56 63 50 C67 46 66 43 67 41 Z" />
      </g>
    ),
    front: (c) => (
      <g fill={c}>
        <path d="M30 42 C30 21 70 21 70 42 C66 34 58 33 50 33 C42 33 34 34 30 42 Z" />
        <line x1="50" y1="21" x2="50" y2="34" stroke="rgba(0,0,0,0.22)" strokeWidth="1.4" />
      </g>
    ),
  },
};
