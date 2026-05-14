import { useState } from 'react';
import type { Character, HairColor, HairStyle, Lipstick, Outfit } from '../types/Character';
import type { PowerFlags } from '../types/GameState';
import { ActionCard } from '../components/ActionCard';
import { Modal } from '../components/Modal';
import {
  ActionResult,
  CRIMES,
  adoptPet,
  appealSentence,
  applyCollege,
  applyGradSchool,
  attendService,
  casino,
  checkup,
  code,
  commitCrime,
  concert,
  dayTrade,
  dentist,
  doctor,
  donate,
  dyeHair,
  emigrate,
  escapeAttempt,
  festival,
  fishing,
  fortuneTeller,
  getLicense,
  getPiercing,
  getTattoo,
  gym,
  haircut,
  hiking,
  jog,
  joinClub,
  joinSport,
  library,
  lottery,
  makeover,
  meditate,
  newOutfit,
  nightlife,
  paint,
  photography,
  plasticSurgery,
  postViralVideo,
  practiceMusic,
  rehab,
  runForOffice,
  skipSchool,
  sleepIn,
  socialMedia,
  spa,
  sportsBet,
  streamOnline,
  studyHarder,
  therapy,
  useJailbreak,
  vacation,
  volunteer,
  writeStory,
  yoga,
} from '../game/actions';
import { COLLEGE_MAJORS } from '../data/careers';
import { COUNTRIES } from '../data/countries';

interface Props {
  character: Character;
  powers: PowerFlags;
  onAction: (mutator: (c: Character) => ActionResult) => void;
}

type Section =
  | 'home'
  | 'mindBody'
  | 'medical'
  | 'salon'
  | 'hobbies'
  | 'nightlife'
  | 'gambling'
  | 'travel'
  | 'civic'
  | 'fame'
  | 'school'
  | 'crime';

const HAIR_COLORS_ALL: HairColor[] = ['black', 'brown', 'blonde', 'red', 'auburn', 'gray', 'silver', 'pink', 'blue', 'mint', 'lavender'];
const HAIR_STYLES_ALL: HairStyle[] = ['short', 'crop', 'pixie', 'long', 'wavy', 'curly', 'bun', 'ponytail', 'braids', 'afro', 'mohawk', 'bald'];
const LIPS_ALL: Lipstick[] = ['none', 'pink', 'red', 'plum', 'nude'];
const OUTFITS_ALL: Outfit[] = ['casual', 'hoodie', 'tshirt', 'dress', 'suit', 'jersey', 'fitness', 'goth'];

export function ActivitiesScreen({ character: c, powers, onAction }: Props) {
  const [section, setSection] = useState<Section>('home');
  const [crimeOpen, setCrimeOpen] = useState(false);
  const [collegeOpen, setCollegeOpen] = useState(false);
  const [emigrateOpen, setEmigrateOpen] = useState(false);
  const [salonOpen, setSalonOpen] = useState<'hair' | 'dye' | 'outfit' | 'makeover' | null>(null);
  const [licenseOpen, setLicenseOpen] = useState(false);
  const [petOpen, setPetOpen] = useState(false);
  const [betOpen, setBetOpen] = useState<'sports' | 'day' | null>(null);
  const adult = c.age >= 18;
  const teen = c.age >= 13;

  if (c.prison.inPrison) {
    return (
      <div className="px-3 pb-32 pt-2 space-y-3">
        <div className="card bg-gradient-to-br from-slate-200 to-slate-300">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">Incarcerated</div>
          <div className="font-extrabold text-2xl text-slate-800">Cell Block {c.prison.security.toUpperCase()}</div>
          <div className="text-sm text-slate-700 mt-1">{c.prison.yearsRemaining} years remaining of {c.prison.totalSentence}.</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ActionCard icon="🙌" label="Behave" sub="Lower sentence chance" tone="emerald" onClick={() => onAction((cc) => { cc.prison.reputation = Math.max(0, cc.prison.reputation - 4); cc.core.happiness = Math.max(0, cc.core.happiness - 2); return { ok: true, message: 'Kept your head down.', tone: 'neutral' }; })} />
          <ActionCard icon="🥊" label="Fight Inmate" tone="rose" onClick={() => onAction((cc) => { cc.prison.reputation = Math.min(100, cc.prison.reputation + 10); cc.core.health = Math.max(0, cc.core.health - 8); return { ok: true, message: 'Bloody knuckles. Reputation up.', tone: 'neutral' }; })} />
          <ActionCard icon="⚖️" label="Appeal" tone="amber" onClick={() => onAction(appealSentence)} />
          <ActionCard icon="🏃" label="Escape" tone="plum" onClick={() => onAction(escapeAttempt)} />
          {powers.jailbreakCard && (
            <ActionCard icon="🗝️" label="Jailbreak Card" sub="Walk out free" tone="amber" onClick={() => onAction(useJailbreak)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 pb-32 pt-2 space-y-3">
      {section === 'home' ? (
        <>
          <div className="card">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Activities</div>
            <div className="grid grid-cols-3 gap-2">
              <CategoryCard icon="🧘" label="Mind & Body" tone="emerald" onClick={() => setSection('mindBody')} />
              <CategoryCard icon="🩺" label="Medical" tone="emerald" onClick={() => setSection('medical')} />
              <CategoryCard icon="💅" label="Salon & Style" tone="plum" onClick={() => setSection('salon')} />
              <CategoryCard icon="🎨" label="Hobbies" tone="amber" onClick={() => setSection('hobbies')} />
              <CategoryCard icon="🎉" label="Nightlife" tone="plum" onClick={() => setSection('nightlife')} locked={!teen} />
              <CategoryCard icon="🎰" label="Gambling" tone="rose" onClick={() => setSection('gambling')} locked={!adult} />
              <CategoryCard icon="✈️" label="Travel" tone="mit" onClick={() => setSection('travel')} />
              <CategoryCard icon="🕊️" label="Civic" tone="emerald" onClick={() => setSection('civic')} />
              <CategoryCard icon="🌟" label="Fame" tone="amber" onClick={() => setSection('fame')} locked={!teen} />
              {c.education.level !== 'none' || c.age >= 18 ? (
                <CategoryCard icon="🎓" label="School" tone="mit" onClick={() => setSection('school')} />
              ) : null}
              <CategoryCard icon="🦹" label="Crime" tone="rose" onClick={() => setSection('crime')} locked={c.age < 10} />
              <CategoryCard icon="🐶" label="Pets" tone="amber" onClick={() => setPetOpen(true)} locked={c.age < 6} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="card flex items-center justify-between">
            <button onClick={() => setSection('home')} className="text-mit-700 font-bold text-sm">← Back</button>
            <div className="font-extrabold text-slate-800 capitalize">{labelOf(section)}</div>
            <div className="w-12" />
          </div>

          {section === 'mindBody' && (
            <div className="grid grid-cols-3 gap-2">
              <ActionCard icon="🏋️" label="Gym" sub="$60" tone="emerald" onClick={() => onAction(gym)} locked={c.age < 8} />
              <ActionCard icon="🏃" label="Jog" tone="emerald" onClick={() => onAction(jog)} locked={c.age < 6} />
              <ActionCard icon="🧘" label="Meditate" tone="emerald" onClick={() => onAction(meditate)} />
              <ActionCard icon="🧎" label="Yoga" tone="emerald" onClick={() => onAction(yoga)} />
              <ActionCard icon="📚" label="Library" tone="mit" onClick={() => onAction(library)} />
              <ActionCard icon="🛋️" label="Therapy" sub="$180" tone="plum" onClick={() => onAction(therapy)} locked={c.age < 12} />
              <ActionCard icon="😴" label="Sleep In" tone="mit" onClick={() => onAction(sleepIn)} />
              <ActionCard icon="🌿" label="Rehab" sub="$3,500" tone="emerald" onClick={() => onAction(rehab)} locked={c.age < 16} />
              <ActionCard icon="💆" label="Spa Day" sub="$220" tone="plum" onClick={() => onAction(spa)} locked={c.age < 14} />
            </div>
          )}

          {section === 'medical' && (
            <div className="grid grid-cols-3 gap-2">
              <ActionCard icon="🩺" label="Doctor" sub="$200" tone="emerald" onClick={() => onAction(doctor)} />
              <ActionCard icon="🩹" label="Checkup" sub="$80" tone="emerald" onClick={() => onAction(checkup)} />
              <ActionCard icon="🦷" label="Dentist" sub="$150" tone="emerald" onClick={() => onAction(dentist)} />
              <ActionCard icon="💉" label="Cosmetic" sub="$5,000" tone="plum" onClick={() => onAction(plasticSurgery)} locked={!adult} />
            </div>
          )}

          {section === 'salon' && (
            <div className="grid grid-cols-3 gap-2">
              <ActionCard icon="💇" label="Haircut" sub="$40" tone="plum" onClick={() => setSalonOpen('hair')} />
              <ActionCard icon="🎨" label="Dye Hair" sub="$90" tone="plum" onClick={() => setSalonOpen('dye')} />
              <ActionCard icon="👗" label="New Outfit" sub="$120" tone="plum" onClick={() => setSalonOpen('outfit')} />
              <ActionCard icon="💄" label="Makeover" sub="$75" tone="plum" onClick={() => setSalonOpen('makeover')} locked={c.age < 12} />
              <ActionCard icon="🖊️" label="Tattoo" sub="$280" tone="rose" onClick={() => onAction(getTattoo)} locked={c.age < 14} />
              <ActionCard icon="💎" label="Piercing" sub="$60" tone="rose" onClick={() => onAction(getPiercing)} locked={c.age < 12} />
            </div>
          )}

          {section === 'hobbies' && (
            <div className="grid grid-cols-3 gap-2">
              <ActionCard icon="🎨" label="Paint" tone="amber" onClick={() => onAction(paint)} />
              <ActionCard icon="🎸" label="Music" tone="amber" onClick={() => onAction(practiceMusic)} />
              <ActionCard icon="✍️" label="Write" tone="amber" onClick={() => onAction(writeStory)} />
              <ActionCard icon="💻" label="Code" tone="mit" onClick={() => onAction(code)} locked={c.age < 8} />
              <ActionCard icon="📷" label="Photo" tone="amber" onClick={() => onAction(photography)} />
              <ActionCard icon="🎣" label="Fish" tone="emerald" onClick={() => onAction(fishing)} locked={c.age < 6} />
              <ActionCard icon="🥾" label="Hike" tone="emerald" onClick={() => onAction(hiking)} locked={c.age < 4} />
            </div>
          )}

          {section === 'nightlife' && (
            <div className="grid grid-cols-3 gap-2">
              <ActionCard icon="🍸" label="Club Night" sub="$120" tone="plum" onClick={() => onAction(nightlife)} locked={!adult} />
              <ActionCard icon="🎤" label="Concert" sub="$180" tone="plum" onClick={() => onAction(concert)} locked={c.age < 12} />
              <ActionCard icon="🎪" label="Festival" sub="$320" tone="plum" onClick={() => onAction(festival)} locked={c.age < 14} />
            </div>
          )}

          {section === 'gambling' && (
            <div className="grid grid-cols-3 gap-2">
              <ActionCard icon="🎰" label="Lottery" sub="$5" tone="amber" onClick={() => onAction(lottery)} locked={!adult} />
              <ActionCard icon="🎲" label="Casino" tone="rose" onClick={() => onAction(casino)} locked={c.age < 21} />
              <ActionCard icon="🏈" label="Sports Bet" tone="rose" onClick={() => setBetOpen('sports')} locked={!adult} />
              <ActionCard icon="📊" label="Day Trade" tone="amber" onClick={() => setBetOpen('day')} locked={!adult} />
            </div>
          )}

          {section === 'travel' && (
            <div className="grid grid-cols-3 gap-2">
              <ActionCard icon="🏖️" label="Vacation" sub="$2,000" tone="amber" onClick={() => onAction(vacation)} />
              <ActionCard icon="🛂" label="Emigrate" tone="mit" onClick={() => setEmigrateOpen(true)} locked={!adult} />
              <ActionCard icon="🪪" label="Licenses" tone="mit" onClick={() => setLicenseOpen(true)} />
            </div>
          )}

          {section === 'civic' && (
            <div className="grid grid-cols-3 gap-2">
              <ActionCard icon="🤲" label="Donate $200" tone="emerald" onClick={() => onAction((cc) => donate(cc, 200))} />
              <ActionCard icon="💸" label="Donate $5,000" tone="emerald" onClick={() => onAction((cc) => donate(cc, 5000))} />
              <ActionCard icon="🌱" label="Volunteer" tone="emerald" onClick={() => onAction(volunteer)} locked={c.age < 12} />
              <ActionCard icon="🕊️" label="Service" tone="mit" onClick={() => onAction(attendService)} />
              <ActionCard icon="🔮" label="Fortune Teller" sub="$40" tone="plum" onClick={() => onAction(fortuneTeller)} locked={c.age < 10} />
              <ActionCard icon="🏛️" label="Run for Office" sub="$50,000" tone="amber" onClick={() => onAction(runForOffice)} locked={c.age < 25} />
            </div>
          )}

          {section === 'fame' && (
            <div className="grid grid-cols-3 gap-2">
              <ActionCard icon="📱" label="Post" tone="plum" onClick={() => onAction(socialMedia)} locked={!teen} />
              <ActionCard icon="📹" label="Viral Video" tone="amber" onClick={() => onAction(postViralVideo)} locked={!teen} />
              <ActionCard icon="🎮" label="Stream" tone="plum" onClick={() => onAction(streamOnline)} locked={!teen} />
            </div>
          )}

          {section === 'school' && (
            <SchoolPanel character={c} powers={powers} onAction={onAction} onOpenCollege={() => setCollegeOpen(true)} />
          )}

          {section === 'crime' && (
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setCrimeOpen(true)}
                className="card text-left active:scale-[0.99] transition bg-gradient-to-br from-rose-50 to-pink-50"
              >
                <div className="text-2xl">🦹</div>
                <div className="font-extrabold text-slate-800 mt-1">Pick a Crime</div>
                <div className="text-xs text-slate-500">Twelve options, all wonderfully bad ideas.</div>
              </button>
            </div>
          )}
        </>
      )}

      {crimeOpen && (
        <Modal title="Crime" onClose={() => setCrimeOpen(false)} size="lg">
          <p className="text-xs text-slate-500 mb-2">Pick your poison. Risk and reward.</p>
          <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
            {CRIMES.filter((cr) => c.age >= cr.minAge).map((cr) => (
              <button
                key={cr.id}
                className="text-left p-3 rounded-2xl bg-rose-50 border border-rose-200 active:scale-95 transition"
                onClick={() => {
                  onAction((cc) => {
                    const res = commitCrime(cc, cr, powers);
                    return { ok: res.ok, message: res.message, tone: res.outcome === 'success' ? 'good' : 'bad' };
                  });
                  setCrimeOpen(false);
                }}
              >
                <div className="font-extrabold text-slate-800 text-sm">{cr.name}</div>
                <div className="text-[11px] text-slate-600">
                  reward ${cr.rewardMin}–${cr.rewardMax.toLocaleString()} · sentence {cr.sentence[0]}–{cr.sentence[1]}y
                </div>
                {cr.lethal && (
                  <div className="text-[10px] text-rose-600 font-bold mt-0.5">
                    {powers.shadowBlade ? '🗡️ Shadow Blade active' : '☠️ Lethal'}
                  </div>
                )}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {collegeOpen && (
        <Modal title="Pick a major" onClose={() => setCollegeOpen(false)} size="lg">
          <div className="grid grid-cols-2 gap-2">
            {COLLEGE_MAJORS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  const hasBachelor = c.education.degrees.some((d) => d.startsWith("Bachelor's"));
                  onAction((cc) => (hasBachelor ? applyGradSchool(cc, m) : applyCollege(cc, m, powers)));
                  setCollegeOpen(false);
                }}
                className="p-3 rounded-2xl bg-mit-50 border border-mit-200 text-sm font-bold text-mit-700 text-left active:scale-95"
              >
                {m}
              </button>
            ))}
          </div>
          {powers.instantDiploma && (
            <div className="mt-3 text-xs text-slate-500 text-center">🎓 Instant Diploma is active — picking a major awards the degree instantly.</div>
          )}
        </Modal>
      )}

      {emigrateOpen && (
        <Modal title="Move where?" onClose={() => setEmigrateOpen(false)} size="lg">
          <div className="grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
            {COUNTRIES.filter((co) => co.name !== c.country).map((co) => (
              <button
                key={co.name}
                className="p-3 rounded-2xl bg-mit-50 border border-mit-200 text-left active:scale-95"
                onClick={() => {
                  onAction((cc) => emigrate(cc, co.name, powers));
                  setEmigrateOpen(false);
                }}
              >
                <div className="text-2xl">{co.flag}</div>
                <div className="font-extrabold text-slate-800 text-sm">{co.name}</div>
                <div className="text-[11px] text-slate-500">{co.vibe}</div>
              </button>
            ))}
          </div>
          {powers.globalPass && <div className="mt-3 text-xs text-slate-500 text-center">🛂 Global Pass active — guaranteed approval.</div>}
        </Modal>
      )}

      {salonOpen === 'hair' && (
        <Modal title="Pick a haircut" onClose={() => setSalonOpen(null)} size="lg">
          <div className="grid grid-cols-3 gap-2">
            {HAIR_STYLES_ALL.map((s) => (
              <button
                key={s}
                onClick={() => { onAction((cc) => haircut(cc, s)); setSalonOpen(null); }}
                className="p-3 rounded-2xl bg-mit-50 border border-mit-200 text-sm font-bold text-mit-700 capitalize active:scale-95"
              >
                {s}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {salonOpen === 'dye' && (
        <Modal title="Pick a color" onClose={() => setSalonOpen(null)} size="lg">
          <div className="grid grid-cols-3 gap-2">
            {HAIR_COLORS_ALL.map((co) => (
              <button
                key={co}
                onClick={() => { onAction((cc) => dyeHair(cc, co)); setSalonOpen(null); }}
                className="p-3 rounded-2xl bg-mit-50 border border-mit-200 text-sm font-bold text-mit-700 capitalize active:scale-95"
              >
                {co}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {salonOpen === 'outfit' && (
        <Modal title="Pick an outfit" onClose={() => setSalonOpen(null)} size="lg">
          <div className="grid grid-cols-3 gap-2">
            {OUTFITS_ALL.map((o) => (
              <button
                key={o}
                onClick={() => { onAction((cc) => newOutfit(cc, o)); setSalonOpen(null); }}
                className="p-3 rounded-2xl bg-mit-50 border border-mit-200 text-sm font-bold text-mit-700 capitalize active:scale-95"
              >
                {o}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {salonOpen === 'makeover' && (
        <Modal title="Pick a lipstick" onClose={() => setSalonOpen(null)} size="lg">
          <div className="grid grid-cols-3 gap-2">
            {LIPS_ALL.map((l) => (
              <button
                key={l}
                onClick={() => { onAction((cc) => makeover(cc, l)); setSalonOpen(null); }}
                className="p-3 rounded-2xl bg-mit-50 border border-mit-200 text-sm font-bold text-mit-700 capitalize active:scale-95"
              >
                {l}
              </button>
            ))}
          </div>
        </Modal>
      )}

      {licenseOpen && (
        <Modal title="Get a license" onClose={() => setLicenseOpen(false)} size="lg">
          <div className="grid grid-cols-2 gap-2">
            {(['driver', 'boat', 'pilot', 'fishing', 'hunting', 'gun'] as const).map((k) => (
              <button
                key={k}
                onClick={() => { onAction((cc) => getLicense(cc, k)); setLicenseOpen(false); }}
                className="p-3 rounded-2xl bg-mit-50 border border-mit-200 text-left active:scale-95"
              >
                <div className="font-extrabold text-slate-800 text-sm capitalize">{k} license</div>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {petOpen && (
        <Modal title="Adopt a pet" onClose={() => setPetOpen(false)} size="lg">
          <div className="grid grid-cols-3 gap-2">
            {(['dog', 'cat', 'rabbit', 'bird', 'fish', 'lizard'] as const).map((k) => (
              <button
                key={k}
                onClick={() => { onAction((cc) => adoptPet(cc, k)); setPetOpen(false); }}
                className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center active:scale-95"
              >
                <div className="text-3xl">{{ dog: '🐶', cat: '🐱', rabbit: '🐰', bird: '🐦', fish: '🐠', lizard: '🦎' }[k]}</div>
                <div className="text-xs font-bold text-slate-700 capitalize mt-1">{k}</div>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {betOpen && (
        <Modal title={betOpen === 'sports' ? 'Place a sports bet' : 'Day-trade size'} onClose={() => setBetOpen(null)} size="sm">
          <div className="grid grid-cols-3 gap-2">
            {[100, 500, 2000, 10000, 25000, 100000].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  const a = betOpen;
                  onAction((cc) => a === 'sports' ? sportsBet(cc, amt) : dayTrade(cc, amt));
                  setBetOpen(null);
                }}
                className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-sm font-bold text-rose-700 active:scale-95"
                disabled={c.cash < amt}
              >
                ${amt.toLocaleString()}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

function labelOf(s: Section): string {
  return ({
    home: 'Home',
    mindBody: 'Mind & Body',
    medical: 'Medical',
    salon: 'Salon & Style',
    hobbies: 'Hobbies',
    nightlife: 'Nightlife',
    gambling: 'Gambling',
    travel: 'Travel',
    civic: 'Civic & Spirit',
    fame: 'Fame',
    school: 'School',
    crime: 'Crime',
  } as Record<Section, string>)[s];
}

function CategoryCard({ icon, label, tone, onClick, locked }: { icon: string; label: string; tone: 'mit' | 'plum' | 'rose' | 'amber' | 'emerald' | 'slate'; onClick: () => void; locked?: boolean }) {
  return <ActionCard icon={icon} label={label} tone={tone} onClick={onClick} locked={locked} />;
}

function SchoolPanel({ character: c, powers, onAction, onOpenCollege }: { character: Character; powers: PowerFlags; onAction: Props['onAction']; onOpenCollege: () => void }) {
  if (c.education.level === 'none' && c.age >= 18) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <ActionCard icon="🎓" label="College" tone="mit" onClick={onOpenCollege} />
        <ActionCard
          icon="🎓"
          label="Grad School"
          tone="plum"
          onClick={onOpenCollege}
          disabled={!c.education.degrees.some((d) => d.startsWith("Bachelor's"))}
        />
      </div>
    );
  }
  if (c.education.level === 'none') {
    return <div className="card text-sm text-slate-500 text-center">Not enrolled.</div>;
  }
  return (
    <div className="space-y-2">
      <div className="card text-sm text-slate-700">
        Currently in {c.education.level === 'college' ? `College — ${c.education.major}` : c.education.level === 'grad' ? `Grad school — ${c.education.major}` : c.education.level} · grades {Math.round(c.education.grades)} · popularity {Math.round(c.education.popularity)}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <ActionCard icon="📖" label="Study Harder" tone="mit" onClick={() => onAction(studyHarder)} />
        <ActionCard icon="🛹" label="Skip School" tone="amber" onClick={() => onAction(skipSchool)} />
        <ActionCard icon="🎭" label="Join Club" tone="plum" onClick={() => onAction(joinClub)} />
        <ActionCard icon="⚽" label="Join Sport" tone="emerald" onClick={() => onAction(joinSport)} />
      </div>
    </div>
  );
}
