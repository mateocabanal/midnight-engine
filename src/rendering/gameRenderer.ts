import { drawGame as drawProceduralFallback, type Game } from "../game";
import type { LoadedAtlases } from "../art/atlasLoader";
import { drawAtlasGame } from "./atlasRenderer";

export type GameRenderControls = {
  move: { activeId: number; x: number; y: number; knobX: number; knobY: number };
  aim: { activeId: number; x: number; y: number; knobX: number; knobY: number };
  layout?: string;
};

// Stable boundary for the renderer migration. Atlas rendering is the primary path;
// the legacy game renderer remains available when preloading fails.
export const drawGame = (ctx: CanvasRenderingContext2D, game: Game, controls: GameRenderControls, atlases: LoadedAtlases) => {
  if (!atlases.size) {
    drawProceduralFallback(ctx, game, controls);
    return;
  }
  drawAtlasGame(ctx, game, controls, atlases);
};
