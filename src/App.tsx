import { useEffect, useRef, useState } from "react";
import {
  characterOptions,
  createGame,
  drawGame,
  getUpgradeChoices,
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

const getHudStats = (game: Game) => {
  const ammo = Math.max(0, game.player.magazine - game.player.shots);
  const isReloading = game.player.reload > 0;

  return {
    ...game.ui,
    ammo: isReloading ? "Reloading" : `${ammo} / ${game.player.magazine}`,
    isReloading,
    levelProgress: `${Math.floor(game.xp)} / ${game.nextXp}`
  };
};

export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>("saint");
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponId>("revolver");
  const loadout = { characterId: selectedCharacter, weaponId: selectedWeapon };
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game>(createGame(loadout));
  const inputRef = useRef<InputState>({ moveX: 0, moveY: 0, dash: false });
  const joystickRef = useRef({ activeId: -1, x: 0, y: 0, knobX: 0, knobY: 0 });
  const [paused, setPaused] = useState(true);
  const [menu, setMenu] = useState<"main" | "character" | "weapon" | "run">("main");
  const [choices, setChoices] = useState<Choice[]>([]);
  const [stats, setStats] = useState(getHudStats(gameRef.current));

  const selectedCharacterOption = characterOptions.find((character) => character.id === selectedCharacter) || characterOptions[0];
  const selectedWeaponOption = weaponOptions.find((weapon) => weapon.id === selectedWeapon) || weaponOptions[0];

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

      drawGame(ctx, game, joystickRef.current);
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
  };

  const startRun = (nextLoadout: LoadoutConfig = loadout) => {
    gameRef.current = createGame(nextLoadout);
    inputRef.current = { moveX: 0, moveY: 0, dash: false };
    joystickRef.current = { activeId: -1, x: 0, y: 0, knobX: 0, knobY: 0 };
    setChoices([]);
    setMenu("run");
    setPaused(false);
    setStats(getHudStats(gameRef.current));
  };

  const backToMenu = () => {
    gameRef.current = createGame(loadout);
    inputRef.current = { moveX: 0, moveY: 0, dash: false };
    joystickRef.current = { activeId: -1, x: 0, y: 0, knobX: 0, knobY: 0 };
    setChoices([]);
    setPaused(true);
    setMenu("main");
    setStats(getHudStats(gameRef.current));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (point.x > rect.width * 0.55 || point.y < rect.height * 0.45) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    joystickRef.current = { activeId: event.pointerId, x: point.x, y: point.y, knobX: point.x, knobY: point.y };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const stick = joystickRef.current;
    if (stick.activeId !== event.pointerId) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const vec = pointerVector(stick, point);
    inputRef.current.moveX = vec.x;
    inputRef.current.moveY = vec.y;
    stick.knobX = stick.x + vec.x * 54;
    stick.knobY = stick.y + vec.y * 54;
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (joystickRef.current.activeId !== event.pointerId) return;
    joystickRef.current.activeId = -1;
    inputRef.current.moveX = 0;
    inputRef.current.moveY = 0;
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

          <div className={`hud-stat ammo-stat${stats.isReloading ? " is-reloading" : ""}`}>
            <span>Ammo</span>
            <strong>{stats.ammo}</strong>
          </div>
        </header>
        ) : null}

        {menu === "run" && !stats.gameOver ? (
        <button
          className="dash-button"
          type="button"
          onPointerDown={(event) => {
            event.preventDefault();
            inputRef.current.dash = true;
          }}
        >
          Dash
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
            <p className="eyebrow">Choose a mutation</p>
            <h2>Level up</h2>
            <div className="choices">
              {choices.map((choice) => (
                <button key={choice.id} type="button" onClick={() => chooseUpgrade(choice)}>
                  <strong>{choice.name}</strong>
                  <span>{choice.description}</span>
                  {choice.fusion ? <em>Fusion online</em> : null}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {stats.gameOver ? (
          <div className="modal intro" onPointerDown={(event) => event.stopPropagation()}>
            <p className="eyebrow">Engine collapsed</p>
            <h1>{stats.time} survived</h1>
            <p>The best broken builds always start a little cursed.</p>
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
      </section>
    </main>
  );
}
