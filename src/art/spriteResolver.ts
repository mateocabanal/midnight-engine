import type { LoadedAtlases } from "./atlasLoader";
import type { AnimationId, AtlasFrame, AtlasSpriteDefinition } from "./types";

export const getAnimationFrame = (
  sprite: AtlasSpriteDefinition,
  animationId: AnimationId,
  elapsedMs: number
): AtlasFrame => {
  const animation = sprite.animations.find((candidate) => candidate.id === animationId) ?? sprite.animations[0];
  const duration = animation.frames.reduce((total, frame) => total + frame.durationMs, 0);
  const loops = animation.playback === "loop" || animation.loop;
  const cycleDuration = animation.playback === "ping-pong" ? duration * 2 : duration;
  let point = loops && cycleDuration > 0 ? elapsedMs % cycleDuration : Math.min(Math.max(0, elapsedMs), Math.max(0, duration - 1));
  if (animation.playback === "ping-pong" && point >= duration) point = Math.max(0, duration * 2 - point - 1);
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
