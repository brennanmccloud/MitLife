import { useState } from 'react';
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
  Outfit,
  SkinTone,
} from '../types/Character';
import { CharacterAvatar } from './CharacterAvatar';

interface Props {
  look: AvatarLook;
  age?: number;
  onChange: (next: AvatarLook) => void;
  onRandomize?: () => void;
  compact?: boolean;
}

const HAIRS: HairColor[] = ['black', 'brown', 'blonde', 'red', 'auburn', 'gray', 'silver', 'pink', 'blue', 'mint', 'lavender'];
const HAIR_STYLES: HairStyle[] = ['short', 'crop', 'pixie', 'long', 'wavy', 'curly', 'bun', 'ponytail', 'braids', 'afro', 'mohawk', 'bald'];
const SKINS: SkinTone[] = ['porcelain', 'sand', 'tan', 'bronze', 'umber', 'ebony'];
const EYE_COLORS: EyeColor[] = ['brown', 'blue', 'green', 'hazel', 'gray', 'amber', 'violet'];
const EYE_SHAPES: EyeShape[] = ['round', 'almond', 'narrow', 'wide'];
const BROWS: BrowShape[] = ['soft', 'thick', 'arched', 'thin'];
const FACIAL: FacialHair[] = ['none', 'stubble', 'mustache', 'goatee', 'beard', 'fullBeard'];
const GLASSES: Glasses[] = ['none', 'round', 'square', 'reading', 'sunglasses'];
const LIPS: Lipstick[] = ['none', 'pink', 'red', 'plum', 'nude'];
const OUTFITS: Outfit[] = ['casual', 'hoodie', 'tshirt', 'dress', 'suit', 'jersey', 'labCoat', 'fitness', 'crown', 'goth'];

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

const SKIN_HEX: Record<SkinTone, string> = {
  porcelain: '#fbe4d2',
  sand: '#eccaa3',
  tan: '#d6a371',
  bronze: '#b67a4c',
  umber: '#8a5734',
  ebony: '#5c361f',
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

export function AvatarEditor({ look, age = 22, onChange, onRandomize, compact }: Props) {
  const set = <K extends keyof AvatarLook>(k: K, v: AvatarLook[K]) => onChange({ ...look, [k]: v });
  const [previewAge, setPreviewAge] = useState<number>(age);

  return (
    <div className="space-y-3">
      <div className="card flex items-center gap-3 bg-gradient-to-br from-white to-mit-50">
        <CharacterAvatar look={look} age={previewAge} size={compact ? 96 : 120} />
        <div className="flex-1 text-xs text-slate-500">
          <div className="font-bold text-slate-700 text-sm">Live preview</div>
          <div>Showing at age {previewAge}</div>
          <input
            type="range"
            min={0}
            max={90}
            value={previewAge}
            onChange={(e) => setPreviewAge(Number(e.target.value))}
            className="w-full accent-mit-500 mt-2"
            aria-label="Preview age"
          />
          {onRandomize && (
            <button
              onClick={onRandomize}
              className="mt-2 pill-btn-ghost py-1.5 px-3 text-xs"
            >
              🎲 Randomize
            </button>
          )}
        </div>
      </div>

      <Section label="Skin tone">
        {SKINS.map((s) => (
          <Swatch key={s} active={look.skin === s} onClick={() => set('skin', s)} color={SKIN_HEX[s]} title={s} />
        ))}
      </Section>

      <Section label="Hair color">
        {HAIRS.map((h) => (
          <Swatch key={h} active={look.hair === h} onClick={() => set('hair', h)} color={HAIR_HEX[h]} title={h} />
        ))}
      </Section>

      <Section label="Hair style">
        {HAIR_STYLES.map((s) => (
          <Chip key={s} active={look.hairStyle === s} onClick={() => set('hairStyle', s)} label={s} />
        ))}
      </Section>

      <Section label="Eye color">
        {EYE_COLORS.map((e) => (
          <Swatch key={e} active={look.eyeColor === e} onClick={() => set('eyeColor', e)} color={EYE_HEX[e]} title={e} />
        ))}
      </Section>

      <Section label="Eye shape">
        {EYE_SHAPES.map((e) => (
          <Chip key={e} active={look.eyeShape === e} onClick={() => set('eyeShape', e)} label={e} />
        ))}
      </Section>

      <Section label="Brows">
        {BROWS.map((b) => (
          <Chip key={b} active={look.brow === b} onClick={() => set('brow', b)} label={b} />
        ))}
      </Section>

      <Section label="Facial hair">
        {FACIAL.map((f) => (
          <Chip key={f} active={look.facialHair === f} onClick={() => set('facialHair', f)} label={f} />
        ))}
      </Section>

      <Section label="Glasses">
        {GLASSES.map((g) => (
          <Chip key={g} active={look.glasses === g} onClick={() => set('glasses', g)} label={g} />
        ))}
      </Section>

      <Section label="Lipstick">
        {LIPS.map((l) => (
          <Chip key={l} active={look.lipstick === l} onClick={() => set('lipstick', l)} label={l} />
        ))}
      </Section>

      <Section label="Earrings">
        {(['none', 'studs', 'hoops', 'drops'] as const).map((e) => (
          <Chip key={e} active={look.earrings === e} onClick={() => set('earrings', e)} label={e} />
        ))}
      </Section>

      <Section label="Outfit">
        {OUTFITS.map((o) => (
          <Chip key={o} active={look.outfit === o} onClick={() => set('outfit', o)} label={o} />
        ))}
      </Section>

      <Section label="Extras">
        <Toggle active={look.freckles} onClick={() => set('freckles', !look.freckles)} label="Freckles" />
        <Toggle active={look.blush} onClick={() => set('blush', !look.blush)} label="Blush" />
        <Toggle active={look.tattoo} onClick={() => set('tattoo', !look.tattoo)} label="Tattoo" />
        <Toggle active={look.piercing} onClick={() => set('piercing', !look.piercing)} label="Piercing" />
      </Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Swatch({ color, active, onClick, title }: { color: string; active: boolean; onClick: () => void; title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-8 h-8 rounded-full border-2 transition active:scale-90 ${active ? 'border-mit-500 ring-2 ring-mit-200 scale-110' : 'border-white shadow-card'}`}
      style={{ background: color }}
      aria-label={title}
    />
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition active:scale-95 ${
        active ? 'bg-mit-500 text-white' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {label}
    </button>
  );
}

function Toggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-bold transition active:scale-95 ${
        active ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {active ? '✓' : '○'} {label}
    </button>
  );
}
