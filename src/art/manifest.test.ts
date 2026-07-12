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
    expect(Object.keys(artManifest.bullets).sort()).toEqual([...allArtEntityIds.bulletIds].sort());
    expect(Object.keys(artManifest.summons).sort()).toEqual([...allArtEntityIds.summonIds].sort());
    expect(Object.keys(artManifest.pickups)).toEqual(["xp"]);
  });

  it("keeps every animation frame inside its declared atlas", () => {
    const atlasSprites = [
      ...Object.values(artManifest.characters),
      ...Object.values(artManifest.enemies),
      ...Object.values(artManifest.bullets),
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

  it("uses authored premium timing and deterministic frame selection", () => {
    const sprite = artManifest.characters.saint;
    expect(sprite.animations.flatMap((animation) => animation.frames).every((frame) => frame.durationMs >= 45 && frame.durationMs <= 140)).toBe(true);
    expect(getAnimationFrame(sprite, "idle", 0)).toEqual(sprite.animations[0].frames[0]);
    expect(getAnimationFrame(sprite, "idle", 140)).toEqual(sprite.animations[0].frames[1]);
  });

  it("provides the complete first-wave animation vocabulary", () => {
    const actorClips = ["idle", "move", "attack", "reload", "active", "hit", "death", "select"];
    for (const id of ["saint", "ilya", "nox", "mira"] as const) {
      expect(artManifest.characters[id].animations.map(({ id: clip }) => clip)).toEqual(actorClips);
    }
    for (const id of ["wisp", "hound", "turret", "mite", "blade"] as const) {
      expect(artManifest.summons[id].animations.map(({ id: clip }) => clip)).toEqual(["spawn", "idle", "move", "attack", "hit", "death"]);
    }
    for (const sprite of Object.values(artManifest.enemies)) {
      expect(sprite.animations.map(({ id }) => id)).toEqual(["spawn", "idle", "move", "attack", "hit", "death"]);
    }
    for (const sprite of Object.values(artManifest.weapons)) {
      expect(sprite.animations.map(({ id }) => id)).toEqual(["idle", "attack", "reload", "active"]);
    }
    for (const sprite of Object.values(artManifest.bullets)) {
      expect(sprite.animations.map(({ id }) => id)).toEqual(["spawn", "flight", "impact", "expire"]);
    }
  });

  it("uses high-resolution logical frames for every normal entity family", () => {
    expect(Object.values(artManifest.characters).every(({ logicalSize }) => logicalSize.width >= 48 && logicalSize.height >= 48)).toBe(true);
    expect(Object.values(artManifest.enemies).every(({ logicalSize }) => logicalSize.width >= 64 && logicalSize.height >= 64)).toBe(true);
    expect(Object.values(artManifest.weapons).every(({ logicalSize }) => logicalSize.width >= 48 && logicalSize.height >= 48)).toBe(true);
    expect(Object.values(artManifest.summons).every(({ logicalSize }) => logicalSize.width >= 48 && logicalSize.height >= 48)).toBe(true);
    expect(Object.values(artManifest.bullets).every(({ logicalSize }) => logicalSize.width >= 32 && logicalSize.height >= 32)).toBe(true);
  });

  it("gives every summon an authored attack frame", () => {
    for (const [kind, sprite] of Object.entries(artManifest.summons)) {
      expect(sprite.animations.some((animation) => animation.id === "attack"), kind).toBe(true);
    }
  });

  it("uses the shared palette and chooses a procedural fallback when an atlas is absent", () => {
    expect(midnightPalette).toMatchObject({ ink: "#06090A", bone: "#D7E4D3", viridian: "#4F9A7E", danger: "#D35F66", amber: "#D8B56D" });
    expect(resolveAtlasSprite(artManifest.characters.saint, new Map()).mode).toBe("procedural-fallback");
    expect(resolveAtlasSprite(artManifest.characters.saint, new Map([["characters", {} as HTMLImageElement]])).mode).toBe("atlas");
  });
});
