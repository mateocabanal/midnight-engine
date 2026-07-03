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

const fusionIds = new Set(["recursiveGun", "stormReactor", "bloodEconomy", "solarFrostbite", "gemSingularity"]);

const getHudStats = (game: Game) => ({
  ...game.ui,
  hp: `${Math.ceil(game.player.hp)}/${game.player.maxHp}`,
  shield: String(Math.floor(game.player.shield)),
  xp: `${Math.floor(game.xp)}/${game.nextXp}`,
  souls: String(game.player.souls),
  upgrades: String(Object.values(game.upgrades).reduce((total, value) => total + (value || 0), 0)),
  fusions: String(Object.entries(game.upgrades).filter(([id, value]) => fusionIds.has(id) && (value || 0) > 0).length)
});

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
        await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
          scope: import.meta.env.BASE_URL
        });
      }
    };

    registerServiceWorker().catch(() => undefined);
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
          <div className="hud-primary">
            <div className="hud-cell clock">
              <strong>{stats.time}</strong>
              <span>night</span>
            </div>
            <div className="hud-cell">
              <strong>{stats.level}</strong>
              <span>level</span>
            </div>
            <div className="hud-cell">
              <strong>{stats.kills}</strong>
              <span>kills</span>
            </div>
          </div>

          <div className="hud-meters">
            <div className="meter-row">
              <span>HP {stats.hp}</span>
              <div className="bar">
                <span style={{ width: `${stats.hpPct}%` }} />
              </div>
            </div>
            <div className="meter-row">
              <span>XP {stats.xp}</span>
              <div className="bar xp">
                <span style={{ width: `${stats.xpPct}%` }} />
              </div>
            </div>
          </div>

          <div className="hud-secondary">
            <div>
              <strong>{stats.shield}</strong>
              <span>shield</span>
            </div>
            <div>
              <strong>{stats.souls}</strong>
              <span>souls</span>
            </div>
            <div>
              <strong>{stats.upgrades}</strong>
              <span>mods</span>
            </div>
            <div>
              <strong>{stats.fusions}</strong>
              <span>fusions</span>
            </div>
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
            <p>{stats.kills} enemies deleted. The best broken builds always start a little cursed.</p>
            <button type="button" onClick={restart}>
              Run It Back
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
