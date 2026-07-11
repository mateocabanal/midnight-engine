import { createGame, stepGame, type Game, type InputState } from "../game";

export type VisualState = "main-menu" | "run-hud" | "stress";

const idleInput: InputState = { moveX: 0, moveY: 0, aimX: 1, aimY: 0, firing: false, active: false };

const withSeededRandom = <T,>(seed: number, run: () => T): T => {
  const originalRandom = Math.random;
  let state = seed >>> 0;
  Math.random = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x1_0000_0000;
  };

  try {
    return run();
  } finally {
    Math.random = originalRandom;
  }
};

export const getVisualState = (): VisualState | null => {
  const value = new URLSearchParams(window.location.search).get("visual");
  return value === "main-menu" || value === "run-hud" || value === "stress" ? value : null;
};

export const applyRequestedVisualStyle = async () => {
  if (new URLSearchParams(window.location.search).get("baseline") !== "pre") return;

  const css = await fetch("/src/styles/legacy.css?raw").then((response) => response.text());
  const style = document.createElement("style");
  style.dataset.visualBaseline = "pre-revamp";
  style.textContent = css;
  document.head.append(style);
  document.documentElement.dataset.visualBaseline = "pre-revamp";
};

export const createVisualGame = (state: VisualState): Game => withSeededRandom(0x4d49444e, () => {
  const game = createGame({ characterId: "saint", weaponId: "revolver" });
  if (state === "main-menu") return game;

  game.time = 9 * 60 + 12;
  game.level = 9;
  game.xp = 68;
  game.nextXp = 110;
  game.kills = 127;
  game.spawnTimer = 999;
  game.player.hp = 24;
  game.player.shield = 18;
  game.player.shots = game.player.magazine;
  game.player.reload = game.player.reloadDuration = 1.25;
  game.player.activeTimer = game.player.activeCooldown * 0.45;
  game.combo = { count: 13, timer: 999, best: 13 };
  stepGame(game, idleInput, 0);
  // Keep the intentionally busy combat composition, but eliminate the random
  // camera shake that the director transition would otherwise introduce.
  game.screenShake = 0;

  if (state === "stress") {
    const enemyKinds = ["grunt", "runner", "brute", "spitter", "charger", "elite", "boss"] as const;
    const seedEnemy = game.enemies[0];
    game.enemies = Array.from({ length: 200 }, (_, index) => ({
      ...seedEnemy,
      id: index + 1,
      kind: enemyKinds[index % enemyKinds.length],
      x: ((index * 47) % 1100) - 550,
      y: ((index * 89) % 740) - 370,
      r: 12 + (index % 5) * 2,
      hp: 100,
      maxHp: 100,
      hitFlash: 0
    }));
    game.bullets = Array.from({ length: 400 }, (_, index) => ({
      x: ((index * 71) % 1000) - 500,
      y: ((index * 43) % 700) - 350,
      vx: 220,
      vy: 80,
      r: 4,
      damage: 12,
      life: 1,
      pierce: 0,
      bounces: 0,
      split: 0,
      crit: 0,
      element: (["kinetic", "lightning", "fire", "ice", "blood", "void"] as const)[index % 6],
      depth: 0
    }));
    game.particles = [];
  }
  return game;
});
