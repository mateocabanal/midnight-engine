import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { characterOptions, weaponOptions } from "../game";
import { artManifest, allArtEntityIds } from "./manifest";
import { getAnimationFrame, frameFitsAtlas, resolveAtlasSprite } from "./spriteResolver";
import { midnightPalette } from "./types";

describe("art manifest", () => {
  it("covers every character and weapon advertised by the game core", () => {
    expect(Object.keys(artManifest.characters).sort()).toEqual(characterOptions.map(({ id }) => id).sort());
    expect(Object.keys(artManifest.weapons).sort()).toEqual(weaponOptions.map(({ id }) => id).sort());
    expect(Object.keys(artManifest.enemies).sort()).toEqual([...allArtEntityIds.enemyIds].sort());
    expect(Object.keys(artManifest.summons).sort()).toEqual([...allArtEntityIds.summonIds].sort());
    expect(Object.keys(artManifest.pickups)).toEqual(["xp"]);
  });

  it("keeps every animation frame inside its declared atlas", () => {
    const atlasSprites = [
      ...Object.values(artManifest.characters),
      ...Object.values(artManifest.enemies),
      ...Object.values(artManifest.weapons),
      ...Object.values(artManifest.summons),
      ...Object.values(artManifest.pickups)
    ];

    for (const sprite of atlasSprites) {
      const atlas = artManifest.atlases[sprite.atlasId];
      expect(atlas, `${sprite.id} references an atlas`).toBeDefined();
      for (const animation of sprite.animations) {
        expect(animation.frames.length).toBeGreaterThan(0);
        for (const frame of animation.frames) expect(frameFitsAtlas(frame, atlas)).toBe(true);
      }
    }
  });

  it("ships every declared atlas from the public bundle", () => {
    for (const atlas of Object.values(artManifest.atlases)) {
      const assetPath = atlas.src.replace(/^\//, "");
      expect(existsSync(resolve(process.cwd(), "public", assetPath)), `${atlas.id} is bundled`).toBe(true);
    }
  });

  it("uses 8-12 fps animation timing and deterministic frame selection", () => {
    const sprite = artManifest.characters.saint;
    expect(sprite.animations.flatMap((animation) => animation.frames).every((frame) => frame.durationMs >= 80 && frame.durationMs <= 125)).toBe(true);
    expect(getAnimationFrame(sprite, "idle", 0)).toEqual(sprite.animations[0].frames[0]);
    expect(getAnimationFrame(sprite, "idle", 100)).toEqual(sprite.animations[0].frames[1]);
  });

  it("uses the shared palette and chooses a procedural fallback when an atlas is absent", () => {
    expect(midnightPalette).toMatchObject({ ink: "#06090A", bone: "#D7E4D3", viridian: "#4F9A7E", danger: "#D35F66", amber: "#D8B56D" });
    expect(resolveAtlasSprite(artManifest.characters.saint, new Map()).mode).toBe("procedural-fallback");
    expect(resolveAtlasSprite(artManifest.characters.saint, new Map([["characters", {} as HTMLImageElement]])).mode).toBe("atlas");
  });
});
