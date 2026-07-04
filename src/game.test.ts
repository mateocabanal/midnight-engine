import { describe, expect, it } from "vitest";
import {
  banishUpgrade,
  characterOptions,
  createGame,
  directorPhases,
  getSpriteDefinition,
  getUpgradeChoices,
  rerollUpgradeChoices,
  spriteCatalog,
  stepGame,
  weaponOptions,
  type InputState
} from "./game";

const idleInput: InputState = { moveX: 0, moveY: 0, aimX: 1, aimY: 0, firing: false, active: false };

describe("game core", () => {
  it("creates a run for every advertised character and weapon", () => {
    for (const character of characterOptions) {
      for (const weapon of weaponOptions) {
        const game = createGame({ characterId: character.id, weaponId: weapon.id });
        expect(game.player.characterId).toBe(character.id);
        expect(game.player.weaponId).toBe(weapon.id);
        expect(game.enemies.length).toBeGreaterThan(0);
        expect(game.runState).toBe("playing");
      }
    }
  });

  it("starts with a readable safety window and enemies outside immediate collision range", () => {
    const game = createGame();
    expect(game.player.invuln).toBeGreaterThan(0);
    for (const enemy of game.enemies) {
      expect(Math.hypot(enemy.x - game.player.x, enemy.y - game.player.y)).toBeGreaterThan(300);
    }
  });

  it("does not collapse an idle opening run before the player can orient", () => {
    const game = createGame();
    for (let i = 0; i < 180; i += 1) {
      stepGame(game, idleInput, 0.1);
    }
    expect(game.runState).toBe("playing");
    expect(game.player.hp).toBeGreaterThan(0);
  });

  it("advances time and updates ui while stepping", () => {
    const game = createGame();
    stepGame(game, idleInput, 1);
    expect(game.time).toBeGreaterThan(0);
    expect(game.ui.time).toBe("00:01");
  });

  it("offers exactly three unique upgrade choices on level up", () => {
    const game = createGame();
    game.level = 2;
    const choices = getUpgradeChoices(game);
    expect(choices).toHaveLength(3);
    expect(new Set(choices.map((choice) => choice.id)).size).toBe(3);
  });

  it("fires Saint active ability through the input model", () => {
    const game = createGame({ characterId: "saint", weaponId: "revolver" });
    game.player.shots = game.player.magazine;

    stepGame(game, { ...idleInput, active: true }, 0.016);

    expect(game.player.shots).toBe(0);
    expect(game.player.reload).toBe(0);
    expect(game.player.activeTimer).toBeGreaterThan(0);
    expect(game.particles.some((particle) => particle.text?.toLowerCase().includes("covenant"))).toBe(true);
  });

  it("records defeat and victory summaries", () => {
    const defeat = createGame();
    defeat.player.hp = 0;
    stepGame(defeat, idleInput, 0.016);
    expect(defeat.runState).toBe("defeat");
    expect(defeat.summary.result).toBe("defeat");

    const victory = createGame();
    victory.time = victory.objective.duration - 0.01;
    stepGame(victory, idleInput, 0.02);
    expect(victory.runState).toBe("victory");
    expect(victory.summary.result).toBe("victory");
  });

  it("uses a full 20-minute dawn objective with readable director phases", () => {
    const game = createGame();

    expect(game.objective.name).toBe("Survive Until Dawn");
    expect(game.objective.duration).toBe(20 * 60);
    expect(game.objective.finalWaveDuration).toBeGreaterThanOrEqual(60);
    expect(game.director.phaseName).toBe("Opening Dusk");
    expect(directorPhases.map((phase) => phase.name)).toEqual(
      expect.arrayContaining(["Opening Dusk", "First Swarm", "Elite Hunt", "Bullet Hell", "Final Dawn"])
    );
  });

  it("director transitions phases and introduces varied enemy archetypes", () => {
    const game = createGame();
    game.time = 6 * 60;
    game.spawnTimer = 0;
    game.enemies = [];

    stepGame(game, idleInput, 0.016);

    expect(game.director.phaseName).toBe("Elite Hunt");
    expect(game.director.threat).toBeGreaterThan(1);
    expect(game.enemies.some((enemy) => ["runner", "brute", "spitter", "charger", "elite"].includes(enemy.kind))).toBe(true);
  });

  it("draft controls support rerolls and banishes like a survival roguelite", () => {
    const game = createGame();
    const first = getUpgradeChoices(game);
    const banishedId = first[0].id;

    const afterBanish = banishUpgrade(game, banishedId);
    expect(game.draft.banishes).toBe(0);
    expect(game.draft.banished).toContain(banishedId);
    expect(afterBanish.some((choice) => choice.id === banishedId)).toBe(false);

    const beforeRerollCount = game.draft.rerolls;
    const afterReroll = rerollUpgradeChoices(game);
    expect(game.draft.rerolls).toBe(beforeRerollCount - 1);
    expect(afterReroll).toHaveLength(3);
    expect(afterReroll.every((choice) => choice.id !== banishedId)).toBe(true);
  });

  it("exposes a declarative sprite system for major game entities", () => {
    expect(Object.keys(spriteCatalog.players).length).toBeGreaterThanOrEqual(8);
    expect(Object.keys(spriteCatalog.enemies)).toEqual(expect.arrayContaining(["grunt", "runner", "brute", "spitter", "charger", "elite", "boss"]));
    expect(Object.keys(spriteCatalog.bullets)).toEqual(expect.arrayContaining(["kinetic", "fire", "ice", "lightning", "blood", "void"]));

    const saint = getSpriteDefinition("player", "saint");
    expect(saint.layers.length).toBeGreaterThan(1);
    expect(saint.palette.primary).toMatch(/^#/);
  });
});
