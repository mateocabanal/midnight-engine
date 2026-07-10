import { describe, expect, it } from "vitest";
import { createGame } from "../game";
import { projectHud } from "./hudProjection";

describe("HUD projection", () => {
  it("exposes exact health, maximum health, and shield without leaking the whole runtime", () => {
    const game = createGame();
    game.player.hp = 37.5;
    game.player.maxHp = 122;
    game.player.shield = 14;

    expect(projectHud(game)).toMatchObject({ hp: 37.5, maxHp: 122, shield: 14 });
  });
});
