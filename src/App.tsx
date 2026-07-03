import { useEffect, useRef, useState } from "react";
import {
  createGame,
  drawGame,
  getUpgradeChoices,
  stepGame,
  type Choice,
  type Game,
  type InputState
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game>(createGame());
  const inputRef = useRef<InputState>({ moveX: 0, moveY: 0, dash: false });
  const joystickRef = useRef({ activeId: -1, x: 0, y: 0, knobX: 0, knobY: 0 });
  const [paused, setPaused] = useState(true);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [stats, setStats] = useState(getHudStats(gameRef.current));

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

  const restart = () => {
    gameRef.current = createGame();
    inputRef.current = { moveX: 0, moveY: 0, dash: false };
    joystickRef.current = { activeId: -1, x: 0, y: 0, knobX: 0, knobY: 0 };
    setChoices([]);
    setPaused(false);
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

        {paused && !choices.length && !stats.gameOver ? (
          <div className="modal intro">
            <p className="eyebrow">Midnight Engine</p>
            <h1>Build a broken combat machine.</h1>
            <p>
              Drag the left side to move. Your engine auto-fires at the closest threat. Level up and cross-wire upgrades
              until the whole screen becomes a bad decision.
            </p>
            <button type="button" onClick={() => setPaused(false)}>
              Start Run
            </button>
          </div>
        ) : null}

        {choices.length ? (
          <div className="modal choice-modal">
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
          <div className="modal intro">
            <p className="eyebrow">Engine collapsed</p>
            <h1>{stats.time} survived</h1>
            <p>The best broken builds always start a little cursed.</p>
            <button type="button" onClick={restart}>
              Run It Back
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
