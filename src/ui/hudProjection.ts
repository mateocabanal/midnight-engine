import type { Game } from "../game";

export type HudProjection = Game["ui"] & {
  hp: number;
  maxHp: number;
  shield: number;
  ammo: string;
  isReloading: boolean;
  levelProgress: string;
  summary: Game["summary"];
};

export const projectHud = (game: Game): HudProjection => {
  const ammo = Math.max(0, game.player.magazine - game.player.shots);
  const isReloading = game.player.reload > 0;

  return {
    ...game.ui,
    hp: game.player.hp,
    maxHp: game.player.maxHp,
    shield: game.player.shield,
    ammo: isReloading ? "Reloading" : `${ammo} / ${game.player.magazine}`,
    isReloading,
    levelProgress: `${Math.floor(game.xp)} / ${game.nextXp}`,
    summary: game.summary
  };
};
