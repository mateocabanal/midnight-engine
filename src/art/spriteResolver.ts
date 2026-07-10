import type { LoadedAtlases } from "./atlasLoader";
import type { AtlasFrame, AtlasSpriteDefinition } from "./types";

export const getAnimationFrame = (
  sprite: AtlasSpriteDefinition,
  animationId: AtlasSpriteDefinition["animations"][number]["id"],
  elapsedMs: number
): AtlasFrame => {
  const animation = sprite.animations.find((candidate) => candidate.id === animationId) ?? sprite.animations[0];
  const duration = animation.frames.reduce((total, frame) => total + frame.durationMs, 0);
  const point = animation.loop && duration > 0 ? elapsedMs % duration : Math.min(elapsedMs, duration - 1);
  let elapsed = 0;

  for (const frame of animation.frames) {
    elapsed += frame.durationMs;
    if (point < elapsed) return frame;
  }

  return animation.frames[animation.frames.length - 1];
};

export const frameFitsAtlas = (frame: AtlasFrame, atlas: { width: number; height: number }) =>
  frame.x >= 0 && frame.y >= 0 && frame.width > 0 && frame.height > 0 && frame.x + frame.width <= atlas.width && frame.y + frame.height <= atlas.height;

export type ResolvedAtlasSprite =
  | { mode: "atlas"; sprite: AtlasSpriteDefinition; image: HTMLImageElement }
  | { mode: "procedural-fallback"; sprite: AtlasSpriteDefinition };

export const resolveAtlasSprite = (sprite: AtlasSpriteDefinition, atlases: LoadedAtlases): ResolvedAtlasSprite => {
  const image = atlases.get(sprite.atlasId);
  return image ? { mode: "atlas", sprite, image } : { mode: "procedural-fallback", sprite };
};
