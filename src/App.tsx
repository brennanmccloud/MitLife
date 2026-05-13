import { useEffect, useMemo, useRef, useState } from 'react';
import type { Character, Gender, HiddenStats } from './types/Character';
import type { GameState, PendingEvent, PowerFlags, Screen, ToastMessage } from './types/GameState';
import { DEFAULT_POWERS } from './types/GameState';
import { StartScreen } from './screens/StartScreen';
import { NewLifeScreen, type NewLifeForm } from './screens/NewLifeScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { RelationshipsScreen } from './screens/RelationshipsScreen';
import { ActivitiesScreen } from './screens/ActivitiesScreen';
import { CareerScreen } from './screens/CareerScreen';
import { AssetsScreen } from './screens/AssetsScreen';
import { SpecialScreen } from './screens/SpecialScreen';
import { DeathScreen } from './screens/DeathScreen';
import { CreditsScreen } from './screens/CreditsScreen';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { EventModal } from './components/EventModal';
import { Toasts } from './components/Toasts';
import { MiracleCradleModal } from './screens/MiracleCradleModal';
import { continueAsChild, createCharacter } from './game/createCharacter';
import { ageUp, applyEvent } from './game/ageUp';
import {
  ActionResult,
  applyYearlyAssetIncome,
  legacyTitle,
  rewindYear,
  tryForBaby,
} from './game/actions';
import { deleteSave, loadGame, loadPowers, savePowers, saveGame } from './game/saveSystem';
import { uid } from './utils/rand';

function clampStats(c: Character) {
  c.core.happiness = Math.max(0, Math.min(100, c.core.happiness));
  c.core.health = Math.max(0, Math.min(100, c.core.health));
  c.core.intelligence = Math.max(0, Math.min(100, c.core.intelligence));
  c.core.appearance = Math.max(0, Math.min(100, c.core.appearance));
}

export default function App() {
  const initialPowers = useMemo(() => loadPowers(), []);
  const initialSave = useMemo(() => loadGame(), []);
  const [character, setCharacter] = useState<Character | null>(null);
  const [previousCharacter, setPreviousCharacter] = useState<Character | null>(null);
  const [history, setHistory] = useState<Character[]>([]);
  const [powers, setPowers] = useState<PowerFlags>({ ...DEFAULT_POWERS, ...initialPowers });
  const [screen, setScreen] = useState<Screen>('start');
  const [pendingEvent, setPendingEvent] = useState<PendingEvent | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [cradleFor, setCradleFor] = useState<string | null>(null);
  const [hasSave] = useState<boolean>(!!initialSave?.character);
  const flashRef = useRef<HTMLDivElement | null>(null);

  // Persist powers
  useEffect(() => savePowers(powers), [powers]);

  // Toasts auto-clear
  useEffect(() => {
    if (toasts.length === 0) return;
    const t = setTimeout(() => setToasts((arr) => arr.slice(1)), 1800);
    return () => clearTimeout(t);
  }, [toasts]);

  const pushToast = (text: string, tone: ToastMessage['tone'] = 'neutral') => {
    setToasts((arr) => [...arr, { id: uid('toast'), text, tone }]);
  };

  const flashAge = () => {
    if (!flashRef.current) return;
    flashRef.current.classList.remove('opacity-0');
    flashRef.current.classList.add('opacity-100');
    setTimeout(() => {
      flashRef.current?.classList.remove('opacity-100');
      flashRef.current?.classList.add('opacity-0');
    }, 240);
  };

  const beginLife = (form: NewLifeForm) => {
    const customStats: Partial<import('./types/Character').CoreStats & HiddenStats> = {};
    if (form.creator) {
      for (const [k, v] of Object.entries(form.custom)) {
        (customStats as Record<string, number>)[k] = v;
      }
    }
    const c = createCharacter({
      firstName: form.firstName,
      lastName: form.lastName,
      gender: form.gender,
      country: form.country,
      hair: form.hair,
      skin: form.skin,
      wealth: form.wealth,
      talent: form.talent,
      customStats,
      powers,
    });
    setCharacter(c);
    setPreviousCharacter(null);
    setScreen('dashboard');
  };

  const onAgeUp = () => {
    if (!character || pendingEvent || !character.alive) return;
    // Snapshot for Rewind Token
    setPreviousCharacter(JSON.parse(JSON.stringify(character)));
    const next = JSON.parse(JSON.stringify(character)) as Character;
    const state: GameState = {
      character: next,
      previousCharacter: character,
      powers,
      screen,
      pendingEvent: null,
      toasts: [],
      history,
    };
    applyYearlyAssetIncome(next);
    const result = ageUp(state);
    clampStats(next);
    setCharacter(next);
    flashAge();

    if (result.death) {
      next.legacyTitle = legacyTitle(next);
      setHistory((h) => [next, ...h]);
      setScreen('death');
      return;
    }
    if (result.pendingEvent) {
      const def = result.pendingEvent;
      const pe: PendingEvent = {
        id: def.id,
        title: def.title,
        icon: def.icon,
        description: def.description(next),
        tone: def.tone,
        category: def.category,
        choices: def.choices.map((ch, idx) => ({
          id: `${def.id}_${idx}`,
          label: ch.label,
          risk: ch.risk,
          resolve: () => {
            const msg = applyEvent(state, def, idx);
            clampStats(next);
            setCharacter({ ...next });
            pushToast(msg, def.tone === 'good' ? 'good' : def.tone === 'bad' ? 'bad' : 'neutral');
            setPendingEvent(null);
          },
        })),
      };
      setPendingEvent(pe);
    }
  };

  const doAction = (mutator: (c: Character) => ActionResult) => {
    if (!character) return;
    const next = JSON.parse(JSON.stringify(character)) as Character;
    const res = mutator(next);
    clampStats(next);
    if (res.ok) setCharacter(next);
    pushToast(res.message, res.tone ?? 'neutral');
  };

  const handleMiracleCradle = (partnerId: string) => {
    setCradleFor(partnerId);
  };

  const confirmMiracleCradle = (count: 1 | 2 | 3, gender: Gender, talent?: keyof HiddenStats) => {
    if (!character || !cradleFor) return;
    const partnerId = cradleFor;
    doAction((c) => tryForBaby(c, partnerId, powers, { count, gender, talent }));
    setCradleFor(null);
  };

  const togglePower = (id: keyof PowerFlags) => {
    setPowers((p) => ({ ...p, [id]: !p[id] }));
  };

  const onSave = () => {
    saveGame({ character, history, savedAt: Date.now() });
    pushToast('Saved.', 'good');
  };
  const onContinue = () => {
    const data = loadGame();
    if (data?.character) {
      setCharacter(data.character);
      setHistory(data.history ?? []);
      setScreen(data.character.alive ? 'dashboard' : 'death');
    }
  };

  const onNewLifeFlow = () => {
    setScreen('newLife');
    setPendingEvent(null);
  };

  const onContinueChild = () => {
    if (!character) return;
    const child = continueAsChild(character, powers);
    if (!child) {
      pushToast('No living children to continue as.', 'bad');
      return;
    }
    setCharacter(child);
    setPreviousCharacter(null);
    setPendingEvent(null);
    setScreen('dashboard');
  };

  // ===== render =====
  if (screen === 'start') {
    return (
      <div className="phone-frame">
        <StartScreen
          hasSave={hasSave}
          onNewLife={onNewLifeFlow}
          onContinue={onContinue}
          onSpecial={() => {
            if (!character) {
              const stub = createCharacter({ powers });
              setCharacter(stub);
            }
            setScreen('special');
          }}
          onCredits={() => setScreen('credits')}
        />
      </div>
    );
  }
  if (screen === 'newLife') {
    return (
      <div className="phone-frame">
        <NewLifeScreen onBack={() => setScreen('start')} onBegin={beginLife} />
      </div>
    );
  }
  if (screen === 'credits') {
    return (
      <div className="phone-frame">
        <CreditsScreen onBack={() => setScreen('start')} />
      </div>
    );
  }
  if (screen === 'death' && character) {
    return (
      <div className="phone-frame">
        <DeathScreen character={character} onNewLife={onNewLifeFlow} onContinueChild={onContinueChild} />
      </div>
    );
  }
  if (!character) {
    return (
      <div className="phone-frame">
        <StartScreen
          hasSave={hasSave}
          onNewLife={onNewLifeFlow}
          onContinue={onContinue}
          onSpecial={() => setScreen('credits')}
          onCredits={() => setScreen('credits')}
        />
      </div>
    );
  }

  const cradlePartner = cradleFor;

  return (
    <div className="phone-frame relative pb-2">
      <Header
        character={character}
        onSave={onSave}
        onSettings={() => {
          if (confirm('Return to start menu? Your current life will be saved.')) {
            onSave();
            setScreen('start');
          }
        }}
      />
      <main className="relative">
        {screen === 'dashboard' && <DashboardScreen character={character} />}
        {screen === 'relationships' && (
          <RelationshipsScreen
            character={character}
            powers={powers}
            onAction={doAction}
            onMiracleCradle={handleMiracleCradle}
          />
        )}
        {screen === 'activities' && (
          <ActivitiesScreen character={character} powers={powers} onAction={doAction} />
        )}
        {screen === 'career' && (
          <CareerScreen character={character} powers={powers} onAction={doAction} />
        )}
        {screen === 'assets' && <AssetsScreen character={character} onAction={doAction} />}
        {screen === 'special' && (
          <SpecialScreen
            powers={powers}
            state={{
              character,
              previousCharacter,
              powers,
              screen,
              pendingEvent: null,
              toasts,
              history,
            }}
            onToggle={togglePower}
            onRewind={() => {
              const s: GameState = {
                character,
                previousCharacter,
                powers,
                screen,
                pendingEvent: null,
                toasts,
                history,
              };
              const res = rewindYear(s);
              if (res.ok && s.character) {
                setCharacter(s.character);
                setPreviousCharacter(null);
                pushToast('Year rewound.', 'good');
              } else {
                pushToast(res.message, 'bad');
              }
            }}
          />
        )}
      </main>

      <BottomNav
        active={screen as Screen}
        onChange={(s) => setScreen(s)}
        onAgeUp={onAgeUp}
        ageUpDisabled={!!pendingEvent || !character.alive}
      />

      <Toasts toasts={toasts} />
      {pendingEvent && <EventModal event={pendingEvent} onChoose={(idx) => pendingEvent.choices[idx].resolve()} />}
      {cradlePartner && (
        <MiracleCradleModal onClose={() => setCradleFor(null)} onConfirm={confirmMiracleCradle} />
      )}

      <div
        ref={flashRef}
        className="pointer-events-none fixed inset-0 bg-mit-200 opacity-0 transition-opacity duration-200 z-20"
      />
    </div>
  );
}
