import { useEffect, useRef, useState } from "react";
import {
  banishUpgrade,
  characterOptions,
  createGame,
  drawGame,
  getSkillTree,
  getAcquiredUpgrades,
  isUpgradeUnlocked,
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
  type SkillTreeCategory,
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

type ControlLayout = "twin-stick" | "southpaw" | "keyboard-only";

const controlLayoutOptions: { id: ControlLayout; name: string; description: string }[] = [
  { id: "twin-stick", name: "Twin Stick", description: "Move left, aim right (default). Best for two thumbs." },
  { id: "southpaw", name: "Southpaw", description: "Move right, aim left. For left-handed players." },
  { id: "keyboard-only", name: "Keyboard Only", description: "Hides touch controls. Use WASD + IJKL on desktop." }
];

const defaultStickPositions = (width: number, height: number, layout: ControlLayout) => {
  const bottom = Math.max(96, height - 92);
  if (layout === "southpaw") {
    return {
      moveX: Math.max(width - 112, width * 0.82),
      moveY: bottom,
      aimX: Math.max(86, Math.min(112, width * 0.18)),
      aimY: bottom
    };
  }
  return {
    moveX: Math.max(86, Math.min(112, width * 0.18)),
    moveY: bottom,
    aimX: Math.max(width - 112, width * 0.82),
    aimY: bottom
  };
};

const DEFAULT_ACTIVE_BUTTON_X = -1; // right anchor
const DEFAULT_ACTIVE_BUTTON_Y = -1; // bottom anchor

const makeControls = (width = 0, height = 0, layout: ControlLayout = "twin-stick", positions: CustomPositions = null) => {
  const defaults = defaultStickPositions(width, height, layout);
  const moveX = positions?.moveX ?? defaults.moveX;
  const moveY = positions?.moveY ?? defaults.moveY;
  const aimX = positions?.aimX ?? defaults.aimX;
  const aimY = positions?.aimY ?? defaults.aimY;
  return {
    move: makeStick(moveX, moveY),
    aim: makeStick(aimX, aimY),
    layout
  };
};

type ControlsState = ReturnType<typeof makeControls>;

type CustomPositions = {
  moveX: number; moveY: number;
  aimX: number; aimY: number;
  activeX: number; activeY: number;
} | null;

const POSITIONS_KEY = "midnight-engine-custom-positions";

const loadCustomPositions = (): CustomPositions => {
  try {
    const stored = localStorage.getItem(POSITIONS_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (typeof parsed?.moveX === "number" && typeof parsed?.moveY === "number" &&
        typeof parsed?.aimX === "number" && typeof parsed?.aimY === "number" &&
        typeof parsed?.activeX === "number" && typeof parsed?.activeY === "number") {
      return parsed as CustomPositions;
    }
  } catch { /* ignore */ }
  return null;
};

const saveCustomPositions = (positions: CustomPositions) => {
  try {
    if (positions) localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
    else localStorage.removeItem(POSITIONS_KEY);
  } catch { /* ignore */ }
};

const CONTROL_LAYOUT_KEY = "midnight-engine-control-layout";

const loadControlLayout = (): ControlLayout => {
  try {
    const stored = localStorage.getItem(CONTROL_LAYOUT_KEY);
    if (stored === "twin-stick" || stored === "southpaw" || stored === "keyboard-only") return stored;
  } catch { /* ignore */ }
  return "twin-stick";
};

const saveControlLayout = (layout: ControlLayout) => {
  try { localStorage.setItem(CONTROL_LAYOUT_KEY, layout); } catch { /* ignore */ }
};

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
  const controlsRef = useRef<ControlsState>(makeControls(0, 0, loadControlLayout(), loadCustomPositions()));
  const keysRef = useRef<Set<string>>(new Set());
  const [paused, setPaused] = useState(true);
  const [menu, setMenu] = useState<"main" | "character" | "weapon" | "options" | "run">("main");
  const [controlLayout, setControlLayout] = useState<ControlLayout>(loadControlLayout());
  const [choices, setChoices] = useState<Choice[]>([]);
  const [stats, setStats] = useState(getHudStats(gameRef.current));
  const [progress, setProgress] = useState(initialProgress);
  const savedSummaryKeyRef = useRef("");
  const [customPositions, setCustomPositions] = useState<CustomPositions>(loadCustomPositions());
  const [editMode, setEditMode] = useState(false);
  const [editPositions, setEditPositions] = useState<{ moveX: number; moveY: number; aimX: number; aimY: number; activeX: number; activeY: number }>(() => {
    const saved = loadCustomPositions();
    if (saved) return saved;
    const screen = { w: typeof window !== "undefined" ? window.innerWidth : 390, h: typeof window !== "undefined" ? window.innerHeight : 780 };
    const defaults = defaultStickPositions(screen.w, screen.h, "twin-stick");
    return { ...defaults, activeX: -1, activeY: -1 };
  });
  const editDragRef = useRef<"move" | "aim" | "active" | null>(null);
  const [showPause, setShowPause] = useState(false);
  const [skillTreeTab, setSkillTreeTab] = useState(0);
  const skillTreeData = useRef(getSkillTree());

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
    const gameplayEnabled = menu === "run" && !paused && !choices.length && !stats.gameOver && !showPause;

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
      controlsRef.current = makeControls(rect.width, rect.height, controlLayout, customPositions);
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
  }, [paused, choices.length, showPause]);

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

  const handleControlLayoutChange = (layout: ControlLayout) => {
    setControlLayout(layout);
    saveControlLayout(layout);
    controlsRef.current = makeControls(gameRef.current.screen.w, gameRef.current.screen.h, layout, customPositions);
  };

  const resetControlPositions = () => {
    setCustomPositions(null);
    saveCustomPositions(null);
    const screen = gameRef.current.screen;
    const defaults = defaultStickPositions(screen.w, screen.h, controlLayout);
    setEditPositions({ ...defaults, activeX: -1, activeY: -1 });
    controlsRef.current = makeControls(screen.w, screen.h, controlLayout, null);
  };

  const openLayoutEditor = () => {
    const saved = loadCustomPositions();
    const screen = gameRef.current.screen;
    const defaults = defaultStickPositions(screen.w, screen.h, controlLayout);
    if (saved) {
      setEditPositions(saved);
    } else {
      setEditPositions({ ...defaults, activeX: -1, activeY: -1 });
    }
    setEditMode(true);
  };

  const saveLayoutEditor = () => {
    const next: NonNullable<CustomPositions> = {
      moveX: editPositions.moveX,
      moveY: editPositions.moveY,
      aimX: editPositions.aimX,
      aimY: editPositions.aimY,
      activeX: editPositions.activeX,
      activeY: editPositions.activeY
    };
    setCustomPositions(next);
    saveCustomPositions(next);
    controlsRef.current = makeControls(gameRef.current.screen.w, gameRef.current.screen.h, controlLayout, next);
    setEditMode(false);
  };

  const cancelLayoutEditor = () => {
    setEditMode(false);
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
    controlsRef.current = makeControls(gameRef.current.screen.w, gameRef.current.screen.h, controlLayout, customPositions);
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
    setShowPause(false);
    setStats(getHudStats(gameRef.current));
  };

  const togglePause = () => {
    if (menu !== "run" || stats.gameOver || choices.length) return;
    setShowPause((prev) => !prev);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (menu !== "run" || paused || choices.length || stats.gameOver || showPause) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const controls = controlsRef.current;
    const leftStick = controlLayout === "southpaw" ? controls.aim : controls.move;
    const rightStick = controlLayout === "southpaw" ? controls.move : controls.aim;
    const stick = point.x < rect.width / 2 ? leftStick : rightStick;
    if (stick.activeId !== -1) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    stick.activeId = event.pointerId;
    const vec = pointerVector(stick, point);
    stick.knobX = stick.x + vec.x * 54;
    stick.knobY = stick.y + vec.y * 54;

    const isMoveStick = stick === (controlLayout === "southpaw" ? controls.aim : controls.move);
    if (isMoveStick) {
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

    const isMoveStick = stick === (controlLayout === "southpaw" ? controls.aim : controls.move);
    if (isMoveStick) {
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

    const isMoveStick = stick === (controlLayout === "southpaw" ? controls.aim : controls.move);
    if (isMoveStick) {
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
            style={customPositions && customPositions.activeX >= 0 ? {
              right: "auto",
              bottom: "auto",
              left: customPositions.activeX - 41,
              top: customPositions.activeY - 41
            } : undefined}
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

        {menu === "run" && !stats.gameOver && !choices.length ? (
          <button
            type="button"
            className="pause-button"
            onPointerDown={(event) => {
              event.stopPropagation();
              togglePause();
            }}
            aria-label="Pause"
          >
            <span>{showPause ? "▶" : "❚❚"}</span>
          </button>
        ) : null}

        {showPause && menu === "run" ? (() => {
          const acquired = getAcquiredUpgrades(gameRef.current);
          const acquiredIds = new Set(acquired.map((a) => a.id));
          const tree = skillTreeData.current;
          const tab = Math.min(skillTreeTab, tree.length - 1);
          const category = tree[tab];
          return (
            <div className="modal pause-modal" onPointerDown={(event) => event.stopPropagation()}>
              <div className="pause-header">
                <div>
                  <p className="eyebrow">Paused</p>
                  <h2>Skill Tree</h2>
                </div>
                <button type="button" onClick={togglePause}>Resume</button>
              </div>
              <div className="skill-tree-tabs">
                {tree.map((cat, i) => {
                  const acquiredInCat = cat.nodes.filter((n) => acquiredIds.has(n.id)).length;
                  return (
                    <button
                      key={cat.name}
                      className={i === tab ? "selected" : ""}
                      type="button"
                      onClick={() => setSkillTreeTab(i)}
                    >
                      <strong>{cat.name}</strong>
                      <span>{acquiredInCat}/{cat.nodes.length}</span>
                    </button>
                  );
                })}
              </div>
              <div className="skill-tree-nodes">
                {category.nodes.map((node) => {
                  const acquired = acquiredIds.has(node.id);
                  const unlocked = isUpgradeUnlocked(gameRef.current, node);
                  const missingReqs = node.requires.filter((r) => !acquiredIds.has(r));
                  return (
                    <div
                      key={node.id}
                      className={`skill-node rarity-${node.rarity}${acquired ? " acquired" : ""}${!acquired && !unlocked ? " locked" : ""}`}
                    >
                      <div className="skill-node-header">
                        <strong>{node.name}</strong>
                        <i>{node.rarity}</i>
                      </div>
                      <p>{node.description}</p>
                      {missingReqs.length > 0 ? (
                        <div className="skill-reqs">
                          <span>Requires:</span>
                          {missingReqs.map((req) => {
                            const reqDef = tree.flatMap((c) => c.nodes).find((n) => n.id === req);
                            return <em key={req}>{reqDef?.name ?? req}</em>;
                          })}
                        </div>
                      ) : null}
                      {acquired ? <em className="skill-acquired-tag">Acquired</em> : null}
                    </div>
                  );
                })}
              </div>
              <div className="pause-actions">
                <button type="button" onClick={togglePause}>Resume</button>
                <button type="button" onClick={backToMenu}>Quit Run</button>
              </div>
            </div>
          );
        })() : null}

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
              <button type="button" onClick={() => setMenu("options")}>
                Options
              </button>
            </div>
          </div>
        ) : null}

        {menu === "options" && !editMode ? (
          <div className="modal options-modal" onPointerDown={(event) => event.stopPropagation()}>
            <div className="select-header">
              <div>
                <p className="eyebrow">Options</p>
                <h2>Control layout</h2>
              </div>
              <button type="button" onClick={() => setMenu("main")}>
                Back
              </button>
            </div>
            <div className="select-grid layout-grid">
              {controlLayoutOptions.map((layout) => (
                <button
                  className={layout.id === controlLayout ? "selected" : ""}
                  key={layout.id}
                  type="button"
                  onClick={() => handleControlLayoutChange(layout.id)}
                >
                  <strong>{layout.name}</strong>
                  <span>{layout.description}</span>
                </button>
              ))}
            </div>
            <div className="menu-actions">
              <button type="button" onClick={openLayoutEditor}>
                Edit control positions
              </button>
            </div>
            {customPositions ? (
              <button type="button" className="reset-positions-button" onClick={resetControlPositions}>
                Reset control positions
              </button>
            ) : null}
          </div>
        ) : null}

        {menu === "options" && editMode ? (
          <div className="layout-editor" onPointerDown={(event) => event.stopPropagation()} onPointerMove={(event) => event.stopPropagation()}>
            <header className="editor-header">
              <div>
                <p className="eyebrow">Layout Editor</p>
                <h2>Drag controls to reposition</h2>
              </div>
              <div className="editor-actions">
                <button type="button" className="editor-cancel" onClick={cancelLayoutEditor}>
                  Cancel
                </button>
                <button type="button" className="editor-save" onClick={saveLayoutEditor}>
                  Save
                </button>
              </div>
            </header>
            <div className="editor-stage" onPointerDown={(event) => event.stopPropagation()}>
              {/* Move stick preview */}
              {controlLayout !== "keyboard-only" && (
                <div
                  className="editor-stick"
                  style={{ left: editPositions.moveX - 54, top: editPositions.moveY - 54 }}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    event.currentTarget.setPointerCapture(event.pointerId);
                    editDragRef.current = "move";
                  }}
                  onPointerMove={(event) => {
                    if (editDragRef.current !== "move") return;
                    event.stopPropagation();
                    const rect2 = (event.currentTarget.parentElement!).getBoundingClientRect();
                    setEditPositions((prev) => ({
                      ...prev,
                      moveX: Math.max(50, Math.min(rect2.width - 50, event.clientX - rect2.left)),
                      moveY: Math.max(80, Math.min(rect2.height - 50, event.clientY - rect2.top)),
                    }));
                  }}
                  onPointerUp={() => { editDragRef.current = null; }}
                  onPointerCancel={() => { editDragRef.current = null; }}
                >
                  <span className="editor-stick-label">Move</span>
                </div>
              )}
              {/* Aim stick preview */}
              {controlLayout !== "keyboard-only" && (
                <div
                  className="editor-stick editor-aim-stick"
                  style={{ left: editPositions.aimX - 54, top: editPositions.aimY - 54 }}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    event.currentTarget.setPointerCapture(event.pointerId);
                    editDragRef.current = "aim";
                  }}
                  onPointerMove={(event) => {
                    if (editDragRef.current !== "aim") return;
                    event.stopPropagation();
                    const rect2 = (event.currentTarget.parentElement!).getBoundingClientRect();
                    setEditPositions((prev) => ({
                      ...prev,
                      aimX: Math.max(50, Math.min(rect2.width - 50, event.clientX - rect2.left)),
                      aimY: Math.max(80, Math.min(rect2.height - 50, event.clientY - rect2.top)),
                    }));
                  }}
                  onPointerUp={() => { editDragRef.current = null; }}
                  onPointerCancel={() => { editDragRef.current = null; }}
                >
                  <span className="editor-stick-label">Shoot</span>
                </div>
              )}
              {/* Active button preview */}
              <div
                className="editor-active-button"
                style={{
                  left: editPositions.activeX >= 0 ? editPositions.activeX - 41 : undefined,
                  right: editPositions.activeX < 0 ? undefined : undefined,
                  bottom: editPositions.activeY < 0 ? 26 : undefined,
                  top: editPositions.activeY >= 0 ? editPositions.activeY - 41 : undefined,
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  editDragRef.current = "active";
                }}
                onPointerMove={(event) => {
                  if (editDragRef.current !== "active") return;
                  event.stopPropagation();
                  const rect2 = (event.currentTarget.parentElement!).getBoundingClientRect();
                  setEditPositions((prev) => ({
                    ...prev,
                    activeX: Math.max(40, Math.min(rect2.width - 40, event.clientX - rect2.left)),
                    activeY: Math.max(40, Math.min(rect2.height - 40, event.clientY - rect2.top)),
                  }));
                }}
                onPointerUp={() => { editDragRef.current = null; }}
                onPointerCancel={() => { editDragRef.current = null; }}
              >
                <span>Active</span>
              </div>
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
