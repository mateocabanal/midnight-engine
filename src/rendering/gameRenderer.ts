import { drawGame as drawProceduralFallback, type Game } from "../game";

export type GameRenderControls = {
  move: { activeId: number; x: number; y: number; knobX: number; knobY: number };
  aim: { activeId: number; x: number; y: number; knobX: number; knobY: number };
  layout?: string;
};

// Stable boundary for the incremental renderer migration. The current implementation
// remains the procedural fallback until atlas rendering is wired in Phase 2.
export const drawGame = (ctx: CanvasRenderingContext2D, game: Game, controls: GameRenderControls) => {
  drawProceduralFallback(ctx, game, controls);
};
