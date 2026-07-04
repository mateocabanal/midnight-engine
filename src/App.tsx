import { useEffect, useRef, useState } from "react";
import {
  banishUpgrade,
  characterOptions,
  createGame,
  drawGame,
  getUpgradeChoices,
  loadProgress,
  recordRunSummary,
  rerollUpgradeChoices,
  saveSelectedLoadout,
  stepGame,
  weaponOptions,
  type CharacterId,
  type Choice,
  type Game,
  type InputState,
  type LoadoutConfig,
  type WeaponId
} from "./game";

const pointerVector = (origin: { x: number; y: number }, point: { x: number; y: number }) => {
  const dx = point.x - origin.x;
  const dy = point.y - origin.y;
  const length = Math.hypot(dx, dy);
  if (length < 4) return { x: 0, y: 0 };
  const clamped = Math.min(1, length / 54);
  return { x: (dx / length) * clamped, y: (dy / length) * clamped };
};

const makeStick = (x = 0, y = 0) => ({ activeId: -1, x, y, knobX: x, knobY: y });

const makeControls = (width = 0, height = 0) => {
  const bottom = Math.max(96, height - 92);
  return {
    move: makeStick(Math.max(86, Math.min(112, width * 0.18)), bottom),
    aim: makeStick(Math.max(width - 112, width * 0.82), bottom)
  };
};

type ControlsState = ReturnType<typeof makeControls>;

const makeInput = (): InputState => ({ moveX: 0, moveY: 0, aimX: 1, aimY: 0, firing: false, active: false });

const initialProgress = loadProgress();

const getHudStats = (game: Game) => {
  const ammo = Math.max(0, game.player.magazine - game.player.shots);
  const isReloading = game.player.reload > 0;

  return {
    ...game.ui,
    ammo: isReloading ? "Reloading" : `${ammo} / ${game.player.magazine}`,
    isReloading,
    levelProgress: `${Math.floor(game.xp)} / ${game.nextXp}`,
    summary: game.summary
  };
};

export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>(initialProgress.selectedLoadout.characterId);
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponId>(initialProgress.selectedLoadout.weaponId);
  const loadout = { characterId: selectedCharacter, weaponId: selectedWeapon };
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game>(createGame(loadout));
  const inputRef = useRef<InputState>(makeInput());
  const controlsRef = useRef<ControlsState>(makeControls());
  const keysRef = useRef<Set<string>>(new Set());
  const [paused, setPaused] = useState(true);
  const [menu, setMenu] = useState<"main" | "character" | "weapon" | "run">("main");
  const [choices, setChoices] = useState<Choice[]>([]);
  const [stats, setStats] = useState(getHudStats(gameRef.current));
  const [progress, setProgress] = useState(initialProgress);
  const savedSummaryKeyRef = useRef("");

  const selectedCharacterOption = characterOptions.find((character) => character.id === selectedCharacter) || characterOptions[0];
  const selectedWeaponOption = weaponOptions.find((weapon) => weapon.id === selectedWeapon) || weaponOptions[0];

  useEffect(() => {
    saveSelectedLoadout(loadout);
  }, [loadout.characterId, loadout.weaponId]);

  useEffect(() => {
    if (!stats.gameOver || stats.summary.result === "playing") return;
    const summaryKey = `${stats.summary.result}:${stats.summary.time}:${stats.summary.kills}:${stats.summary.level}`;
    if (savedSummaryKeyRef.current === summaryKey) return;
    savedSummaryKeyRef.current = summaryKey;
    setProgress(recordRunSummary(stats.summary));
  }, [stats.gameOver, stats.summary]);

  useEffect(() => {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator && import.meta.env.PROD) {
        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });

        const registration = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
          scope: import.meta.env.BASE_URL
        });

        const activateWaitingWorker = () => {
          registration.waiting?.postMessage({ type: "SKIP_WAITING" });
        };

        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          if (!worker) return;

          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" && navigator.serviceWorker.controller) {
              worker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });

        activateWaitingWorker();

        const checkForUpdate = () => {
          if (!document.hidden) {
            registration.update().catch(() => undefined);
          }
        };

        const updateTimer = window.setInterval(checkForUpdate, 15 * 60 * 1000);
        window.addEventListener("focus", checkForUpdate);
        document.addEventListener("visibilitychange", checkForUpdate);

        return () => {
          window.clearInterval(updateTimer);
          window.removeEventListener("focus", checkForUpdate);
          document.removeEventListener("visibilitychange", checkForUpdate);
        };
      }

      return undefined;
    };

    let cleanup: (() => void) | undefined;
    registerServiceWorker()
      .then((dispose) => {
        cleanup = dispose;
      })
      .catch(() => undefined);

    return () => cleanup?.();
  }, []);

  useEffect(() => {
    const gameplayEnabled = menu === "run" && !paused && !choices.length && !stats.gameOver;

    const updateFromKeys = () => {
      const keys = keysRef.current;
      const moveX = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("arrowleft") ? 1 : 0);
      const moveY = (keys.has("s") || keys.has("arrowdown") ? 1 : 0) - (keys.has("w") || keys.has("arrowup") ? 1 : 0);
      const aimX = (keys.has("l") ? 1 : 0) - (keys.has("j") ? 1 : 0);
      const aimY = (keys.has("k") ? 1 : 0) - (keys.has("i") ? 1 : 0);
      const aiming = Math.abs(aimX) + Math.abs(aimY) > 0;

      inputRef.current.moveX = moveX;
      inputRef.current.moveY = moveY;
      if (aiming) {
        inputRef.current.aimX = aimX;
        inputRef.current.aimY = aimY;
      } else if (moveX || moveY) {
        inputRef.current.aimX = moveX;
        inputRef.current.aimY = moveY;
      }
      inputRef.current.firing = aiming || keys.has(" ") || keys.has("enter");
      inputRef.current.active = keys.has("e") || keys.has("shift");
    };

    const isGameplayKey = (key: string) =>
      ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "i", "j", "k", "l", " ", "enter", "e", "shift"].includes(key);

    const onKeyDown = (event: KeyboardEvent) => {
      if (!gameplayEnabled) return;
      const key = event.key.toLowerCase();
      if (!isGameplayKey(key)) return;
      event.preventDefault();
      keysRef.current.add(key);
      updateFromKeys();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!isGameplayKey(key)) return;
      event.preventDefault();
      keysRef.current.delete(key);
      updateFromKeys();
    };

    const clearKeys = () => {
      keysRef.current.clear();
      inputRef.current = makeInput();
    };

    if (!gameplayEnabled) clearKeys();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearKeys);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearKeys);
    };
  }, [choices.length, menu, paused, stats.gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let statTimer = 0;

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gameRef.current.screen.w = rect.width;
      gameRef.current.screen.h = rect.height;
      const previous = controlsRef.current;
      controlsRef.current = makeControls(rect.width, rect.height);
      if (previous.move.activeId !== -1) controlsRef.current.move.activeId = previous.move.activeId;
      if (previous.aim.activeId !== -1) controlsRef.current.aim.activeId = previous.aim.activeId;
    };

    resize();
    window.addEventListener("resize", resize);

    const frame = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      const game = gameRef.current;
      if (!paused && !choices.length && !game.gameOver) {
        const levelUp = stepGame(game, inputRef.current, dt);
        if (levelUp) {
          setChoices(getUpgradeChoices(game));
        }
      }

      drawGame(ctx, game, controlsRef.current);
      statTimer += dt;
      if (statTimer > 0.08) {
        setStats(getHudStats(game));
        statTimer = 0;
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [paused, choices.length]);

  const chooseUpgrade = (choice: Choice) => {
    choice.apply(gameRef.current);
    setChoices([]);
    setStats(getHudStats(gameRef.current));
  };

  const rerollChoices = () => {
    setChoices(rerollUpgradeChoices(gameRef.current));
    setStats(getHudStats(gameRef.current));
  };

  const banishChoice = (choice: Choice) => {
    setChoices(banishUpgrade(gameRef.current, choice.id));
    setStats(getHudStats(gameRef.current));
  };

  const skipUpgrade = () => {
    const game = gameRef.current;
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + 12);
    game.player.shield = Math.min(75, game.player.shield + 4);
    setChoices([]);
    setStats(getHudStats(game));
  };

  const resetInput = () => {
    inputRef.current = makeInput();
    keysRef.current.clear();
    controlsRef.current = makeControls(gameRef.current.screen.w, gameRef.current.screen.h);
  };

  const startRun = (nextLoadout: LoadoutConfig = loadout) => {
    const screen = gameRef.current.screen;
    gameRef.current = createGame(nextLoadout);
    gameRef.current.screen = screen;
    savedSummaryKeyRef.current = "";
    resetInput();
    setChoices([]);
    setMenu("run");
    setPaused(false);
    setStats(getHudStats(gameRef.current));
  };

  const backToMenu = () => {
    const screen = gameRef.current.screen;
    gameRef.current = createGame(loadout);
    gameRef.current.screen = screen;
    resetInput();
    setChoices([]);
    setPaused(true);
    setMenu("main");
    setStats(getHudStats(gameRef.current));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (menu !== "run" || paused || choices.length || stats.gameOver) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const controls = controlsRef.current;
    const stick = point.x < rect.width / 2 ? controls.move : controls.aim;
    if (stick.activeId !== -1) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    stick.activeId = event.pointerId;
    const vec = pointerVector(stick, point);
    stick.knobX = stick.x + vec.x * 54;
    stick.knobY = stick.y + vec.y * 54;

    if (stick === controls.move) {
      inputRef.current.moveX = vec.x;
      inputRef.current.moveY = vec.y;
    } else {
      inputRef.current.aimX = vec.x;
      inputRef.current.aimY = vec.y;
      inputRef.current.firing = Math.hypot(vec.x, vec.y) > 0.12;
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const controls = controlsRef.current;
    const stick = controls.move.activeId === event.pointerId ? controls.move : controls.aim.activeId === event.pointerId ? controls.aim : undefined;
    if (!stick) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const vec = pointerVector(stick, point);
    stick.knobX = stick.x + vec.x * 54;
    stick.knobY = stick.y + vec.y * 54;

    if (stick === controls.move) {
      inputRef.current.moveX = vec.x;
      inputRef.current.moveY = vec.y;
    } else {
      inputRef.current.aimX = vec.x;
      inputRef.current.aimY = vec.y;
      inputRef.current.firing = Math.hypot(vec.x, vec.y) > 0.12;
    }
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const controls = controlsRef.current;
    const stick = controls.move.activeId === event.pointerId ? controls.move : controls.aim.activeId === event.pointerId ? controls.aim : undefined;
    if (!stick) return;
    stick.activeId = -1;
    stick.knobX = stick.x;
    stick.knobY = stick.y;

    if (stick === controls.move) {
      inputRef.current.moveX = 0;
      inputRef.current.moveY = 0;
    } else {
      inputRef.current.aimX = 0;
      inputRef.current.aimY = 0;
      inputRef.current.firing = false;
    }
  };

  return (
    <main className="app-shell">
      <section
        className="game-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <canvas ref={canvasRef} className="game-canvas" aria-label="Midnight Engine game canvas" />

        {menu === "run" ? (
          <header className="hud" aria-label="Run status">
            <div className="hud-stat timer-stat">
              <span>Timer</span>
              <strong>{stats.time}</strong>
            </div>

            <div className="level-stat">
              <div className="level-line">
                <span>Level {stats.level}</span>
                <em>Experience {stats.levelProgress}</em>
              </div>
              <div className="bar xp" aria-label={`Level ${stats.level} experience ${stats.levelProgress}`}>
                <span style={{ width: `${stats.xpPct}%` }} />
              </div>
            </div>

            <div className="level-stat objective-stat">
              <div className="level-line">
                <span>{stats.objective}</span>
                <em>{stats.directorPhase} · T{stats.threat}</em>
              </div>
              <div className="bar objective" aria-label={`${stats.objective} ${Math.round(stats.objectivePct)} percent`}>
                <span style={{ width: `${stats.objectivePct}%` }} />
              </div>
            </div>

            <div className={`hud-stat active-stat${stats.activeReady ? " is-ready" : ""}`}>
              <span>Active</span>
              <strong>{stats.activeReady ? "Ready" : `${Math.round(stats.activePct)}%`}</strong>
            </div>

            <div className={`hud-stat ammo-stat${stats.isReloading ? " is-reloading" : ""}`}>
              <span>Ammo</span>
              <strong>{stats.ammo}</strong>
            </div>
          </header>
        ) : null}

        {menu === "run" && !stats.gameOver ? (
          <button
            type="button"
            className={`active-button${stats.activeReady ? " is-ready" : ""}`}
            onPointerDown={(event) => {
              event.stopPropagation();
              inputRef.current.active = true;
            }}
            onPointerUp={(event) => {
              event.stopPropagation();
              inputRef.current.active = false;
            }}
            onPointerCancel={(event) => {
              event.stopPropagation();
              inputRef.current.active = false;
            }}
            onPointerLeave={() => {
              inputRef.current.active = false;
            }}
          >
            <i style={{ width: `${stats.activePct}%` }} />
            <span>{stats.activeReady ? "Tap / E" : "Charging"}</span>
            <strong>Active</strong>
          </button>
        ) : null}

        {menu === "main" && !stats.gameOver ? (
          <div className="modal menu-modal" onPointerDown={(event) => event.stopPropagation()}>
            <p className="eyebrow">Midnight Engine</p>
            <h1>Choose your engine.</h1>
            <div className="loadout-summary">
              <div>
                <span>Character</span>
                <strong>{selectedCharacterOption.name}</strong>
                <em>{selectedCharacterOption.tagline}</em>
              </div>
              <div>
                <span>Weapon</span>
                <strong>{selectedWeaponOption.name}</strong>
                <em>{selectedWeaponOption.tagline}</em>
              </div>
            </div>
            <div className="progress-summary" aria-label="Local progress summary">
              <span>Best {progress.bestTime}</span>
              <span>{progress.bestKills} kills</span>
              <span>{progress.victories} clears</span>
            </div>
            <div className="menu-actions">
              <button type="button" onClick={() => startRun()}>
                Start Run
              </button>
              <button type="button" onClick={() => setMenu("character")}>
                Character Select
              </button>
              <button type="button" onClick={() => setMenu("weapon")}>
                Weapon Select
              </button>
            </div>
          </div>
        ) : null}

        {menu === "character" ? (
          <div className="modal select-modal" onPointerDown={(event) => event.stopPropagation()}>
            <div className="select-header">
              <div>
                <p className="eyebrow">Character Select</p>
                <h2>Pick a pilot.</h2>
              </div>
              <button type="button" onClick={() => setMenu("main")}>
                Back
              </button>
            </div>
            <div className="select-grid">
              {characterOptions.map((character) => (
                <button
                  className={character.id === selectedCharacter ? "selected" : ""}
                  key={character.id}
                  type="button"
                  onClick={() => setSelectedCharacter(character.id)}
                >
                  <strong>{character.name}</strong>
                  <em>{character.tagline}</em>
                  <span>{character.description}</span>
                  <small>{character.strengths.join(" / ")}</small>
                  <b>{character.tradeoff}</b>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {menu === "weapon" ? (
          <div className="modal select-modal" onPointerDown={(event) => event.stopPropagation()}>
            <div className="select-header">
              <div>
                <p className="eyebrow">Weapon Select</p>
                <h2>Pick a weapon.</h2>
              </div>
              <button type="button" onClick={() => setMenu("main")}>
                Back
              </button>
            </div>
            <div className="select-grid weapon-grid">
              {weaponOptions.map((weapon) => (
                <button
                  className={weapon.id === selectedWeapon ? "selected" : ""}
                  key={weapon.id}
                  type="button"
                  onClick={() => setSelectedWeapon(weapon.id)}
                >
                  <strong>{weapon.name}</strong>
                  <em>{weapon.tagline}</em>
                  <span>{weapon.description}</span>
                  <small>{weapon.strengths.join(" / ")}</small>
                  <b>{weapon.tradeoff}</b>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {choices.length ? (
          <div className="modal choice-modal" onPointerDown={(event) => event.stopPropagation()}>
            <div className="choice-header">
              <div>
                <p className="eyebrow">Choose a mutation</p>
                <h2>Level up</h2>
              </div>
              <div className="draft-actions" aria-label="Draft controls">
                <button type="button" onClick={rerollChoices} disabled={stats.rerolls <= 0}>
                  Reroll {stats.rerolls}
                </button>
                <button type="button" onClick={skipUpgrade}>
                  Skip + Heal
                </button>
              </div>
            </div>
            <div className="choices">
              {choices.map((choice) => (
                <article key={choice.id} className={`choice-card rarity-${choice.rarity || "common"}`}>
                  <button className="choice-pick" type="button" onClick={() => chooseUpgrade(choice)}>
                    <span className="choice-meta">
                      <i>{choice.rarity || "common"}</i>
                      <i>{choice.category || "mutation"}</i>
                    </span>
                    <strong>{choice.name}</strong>
                    <span>{choice.description}</span>
                    {choice.fusion ? <em>Fusion online</em> : choice.law ? <em>Law mutation</em> : null}
                  </button>
                  <button className="banish-button" type="button" onClick={() => banishChoice(choice)} disabled={stats.banishes <= 0}>
                    Banish {stats.banishes}
                  </button>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {stats.gameOver ? (
          <div className="modal intro summary-modal" onPointerDown={(event) => event.stopPropagation()}>
            <p className="eyebrow">{stats.summary.result === "victory" ? "Midnight Broken" : "Engine collapsed"}</p>
            <h1>{stats.summary.time}</h1>
            <p>{stats.summary.result === "victory" ? "The Cathedral Bell cracked. The engine lives to run again." : "The best broken builds always start a little cursed."}</p>
            <div className="run-summary-grid">
              <div><span>Kills</span><strong>{stats.summary.kills}</strong></div>
              <div><span>Level</span><strong>{stats.summary.level}</strong></div>
              <div><span>Upgrades</span><strong>{stats.summary.upgrades}</strong></div>
            </div>
            <div className="menu-actions">
              <button type="button" onClick={() => startRun()}>
                Run It Back
              </button>
              <button type="button" onClick={backToMenu}>
                Main Menu
              </button>
            </div>
          </div>
        ) : null}

        <div className="rotate-lock" aria-hidden="true">
          <div>
            <strong>Rotate to landscape</strong>
            <span>Midnight Engine uses twin-stick controls.</span>
          </div>
        </div>
      </section>
    </main>
  );
}
