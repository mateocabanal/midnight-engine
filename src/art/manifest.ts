import { midnightPalette, type AnimationId, type ArtManifest, type AtlasAnimation, type AtlasFrame, type AtlasSpriteDefinition } from "./types";

const frame = (x: number, y: number, width = 32, height = 32, durationMs = 100): AtlasFrame => ({
  x,
  y,
  width,
  height,
  durationMs
});

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const atlasSprite = (
  id: string,
  label: string,
  atlasId: string,
  x: number,
  y: number,
  palette: AtlasSpriteDefinition["palette"] = { primary: midnightPalette.bone, secondary: midnightPalette.viridian }
): AtlasSpriteDefinition => ({
  kind: "atlas",
  id,
  label,
  atlasId,
  logicalSize: { width: 16, height: 16 },
  pivot: { x: 8, y: 13 },
  palette,
  animations: [
    { id: "idle", frames: [frame(x, y), frame(x + 32, y)], loop: true },
    { id: "move", frames: [frame(x, y), frame(x + 32, y), frame(x + 64, y)], loop: true },
    { id: "attack", frames: [frame(x + 64, y, 32, 32, 80), frame(x + 96, y, 32, 32, 80)] },
    { id: "hit", frames: [frame(x + 96, y, 32, 32, 80)] }
  ]
});

const bulletSprite = (
  id: string,
  label: string,
  index: number,
  palette: AtlasSpriteDefinition["palette"]
): AtlasSpriteDefinition => ({
  kind: "atlas",
  id,
  label,
  atlasId: "bullets",
  logicalSize: { width: 32, height: 32 },
  pivot: { x: 16, y: 16 },
  palette,
  animations: ([
    ["spawn", 0, 4, 55, false],
    ["flight", 1, 4, 70, true],
    ["impact", 2, 5, 45, false],
    ["expire", 3, 5, 55, false]
  ] as const).map(([animationId, row, count, durationMs, loop]) => ({
    id: animationId,
    frames: Array.from({ length: count }, (_, frameIndex) => frame(frameIndex * 32, index * 128 + row * 32, 32, 32, durationMs)),
    loop,
    playback: loop ? "loop" : "once",
    directional: id === "lightning" || id === "void" ? "screen" : "rotate"
  }))
});

const enemyAnimation = (index: number, id: AnimationId, row: number, count: number, durationMs: number, loop = false): AtlasAnimation => {
  const blockX = (index % 4) * 512;
  const blockY = Math.floor(index / 4) * 384;
  return {
    id,
    frames: Array.from({ length: count }, (_, frameIndex) => frame(blockX + frameIndex * 64, blockY + row * 64, 64, 64, durationMs)),
    loop,
    playback: loop ? "loop" : "once",
    directional: "flip-x"
  };
};

const enemySprite = (id: string, label: string, index: number): AtlasSpriteDefinition => ({
  kind: "atlas", id, label, atlasId: "enemies",
  logicalSize: { width: 64, height: 64 }, pivot: { x: 32, y: 56 },
  palette: { primary: midnightPalette.danger, secondary: midnightPalette.bone },
  animations: [
    enemyAnimation(index, "spawn", 0, 6, 85),
    enemyAnimation(index, "idle", 1, 8, 125, true),
    enemyAnimation(index, "move", 2, 8, 82, true),
    enemyAnimation(index, "attack", 3, 8, 68),
    enemyAnimation(index, "hit", 4, 4, 70),
    enemyAnimation(index, "death", 5, 8, 90)
  ]
});

const weaponAnimation = (index: number, id: AnimationId, row: number, count: number, durationMs: number, loop = false): AtlasAnimation => {
  const blockX = (index % 4) * 384;
  const blockY = Math.floor(index / 4) * 192;
  return {
    id,
    frames: Array.from({ length: count }, (_, frameIndex) => frame(blockX + frameIndex * 48, blockY + row * 48, 48, 48, durationMs)),
    loop,
    playback: loop ? "loop" : "once",
    directional: "rotate"
  };
};

const weaponSprite = (id: string, label: string, index: number): AtlasSpriteDefinition => ({
  kind: "atlas", id, label, atlasId: "weapons",
  logicalSize: { width: 48, height: 48 }, pivot: { x: 18, y: 24 },
  palette: { primary: midnightPalette.bone, secondary: midnightPalette.amber },
  animations: [
    weaponAnimation(index, "idle", 0, 6, 130, true),
    weaponAnimation(index, "attack", 1, 8, 58),
    weaponAnimation(index, "reload", 2, 8, 78),
    weaponAnimation(index, "active", 3, 8, 68)
  ]
});

const pickupSprite = (): AtlasSpriteDefinition => ({
  kind: "atlas", id: "xp", label: "Experience", atlasId: "glyphs",
  logicalSize: { width: 32, height: 32 }, pivot: { x: 16, y: 16 },
  palette: { primary: midnightPalette.brightViridian, secondary: midnightPalette.bone },
  animations: [
    { id: "spawn", frames: Array.from({ length: 6 }, (_, index) => frame(index * 32, 0, 32, 32, 70)) },
    { id: "idle", frames: Array.from({ length: 8 }, (_, index) => frame(index * 32, 32, 32, 32, 110)), loop: true },
    { id: "active", frames: Array.from({ length: 8 }, (_, index) => frame(index * 32, 64, 32, 32, 60)) }
  ]
});

const actorAnimation = (
  index: number,
  id: AnimationId,
  row: number,
  count: number,
  durationMs: number,
  loop = false
): AtlasAnimation => {
  const blockX = (index % 4) * 576;
  const blockY = Math.floor(index / 4) * 384;
  return {
    id,
    frames: Array.from({ length: count }, (_, frameIndex) => frame(blockX + frameIndex * 48, blockY + row * 48, 48, 48, durationMs)),
    loop,
    playback: loop ? "loop" : "once",
    directional: "flip-x"
  };
};

const characterSprite = (id: string, label: string, index: number, palette: AtlasSpriteDefinition["palette"]): AtlasSpriteDefinition => ({
  kind: "atlas", id, label, atlasId: "characters",
  logicalSize: { width: 48, height: 48 }, pivot: { x: 24, y: 42 }, palette,
  animations: [
    actorAnimation(index, "idle", 0, 6, 140, true),
    actorAnimation(index, "move", 1, 8, 90, true),
    actorAnimation(index, "attack", 2, 6, 70),
    actorAnimation(index, "reload", 3, 8, 85),
    actorAnimation(index, "active", 4, 12, 75),
    actorAnimation(index, "hit", 5, 3, 80),
    actorAnimation(index, "death", 6, 8, 100),
    actorAnimation(index, "select", 7, 8, 100)
  ]
});

const summonAnimation = (index: number, id: AnimationId, row: number, count: number, durationMs: number, loop = false): AtlasAnimation => {
  const blockX = (index % 4) * 384;
  const blockY = Math.floor(index / 4) * 288;
  return {
    id,
    frames: Array.from({ length: count }, (_, frameIndex) => frame(blockX + frameIndex * 48, blockY + row * 48, 48, 48, durationMs)),
    loop,
    playback: loop ? "loop" : "once",
    directional: "flip-x"
  };
};

const summonSprite = (id: string, label: string, index: number): AtlasSpriteDefinition => ({
  kind: "atlas", id, label, atlasId: "summons",
  logicalSize: { width: 48, height: 48 }, pivot: { x: 24, y: 40 },
  palette: { primary: midnightPalette.bone, secondary: midnightPalette.viridian },
  animations: [
    summonAnimation(index, "spawn", 0, 6, 70),
    summonAnimation(index, "idle", 1, 6, 120, true),
    summonAnimation(index, "move", 2, 8, 85, true),
    summonAnimation(index, "attack", 3, 8, 65),
    summonAnimation(index, "hit", 4, 4, 70),
    summonAnimation(index, "death", 5, 8, 75)
  ]
});

const characterIds = ["saint", "ilya", "nox", "mira", "scarlett", "corvus", "kaden", "lyra"] as const;
const enemyIds = ["grunt", "runner", "brute", "spitter", "charger", "elite", "boss"] as const;
const bulletIds = ["kinetic", "lightning", "fire", "ice", "blood", "void"] as const;
const weaponIds = ["revolver", "shotgun", "needle_smg", "crossbow", "flame_cannon", "arc_rifle", "shard_launcher", "rail_lance", "chakram", "hive_staff", "prism_launcher", "aether_spear"] as const;
const summonIds = ["wisp", "hound", "turret", "drone", "mite", "blade", "wasp", "chakram", "orb"] as const;

const entitySprites = <T extends readonly string[]>(
  ids: T,
  atlasId: string,
  labels: Record<T[number], string>,
  palette?: AtlasSpriteDefinition["palette"]
) => Object.fromEntries(ids.map((id, index) => [id, atlasSprite(id, labels[id as T[number]], atlasId, (index % 4) * 128, Math.floor(index / 4) * 32, palette)])) as Record<T[number], AtlasSpriteDefinition>;

export const artManifest: ArtManifest = {
  atlases: {
    characters: { id: "characters", src: publicAsset("art/characters.png"), width: 2304, height: 768 },
    enemies: { id: "enemies", src: publicAsset("art/enemies.png"), width: 2048, height: 768 },
    bullets: { id: "bullets", src: publicAsset("art/bullets.png"), width: 160, height: 768 },
    weapons: { id: "weapons", src: publicAsset("art/weapons.png"), width: 1536, height: 576 },
    summons: { id: "summons", src: publicAsset("art/summons.png"), width: 1536, height: 864 },
    glyphs: { id: "glyphs", src: publicAsset("art/glyphs.png"), width: 256, height: 96 },
    environment: { id: "environment", src: publicAsset("art/environment.png"), width: 128, height: 128 }
  },
  characters: Object.fromEntries(characterIds.map((id, index) => [id, characterSprite(id, {
    saint: "Saint", ilya: "Ilya", nox: "Nox", mira: "Mira", scarlett: "Scarlett", corvus: "Corvus", kaden: "Kaden", lyra: "Lyra"
  }[id], index, { primary: [midnightPalette.amber, midnightPalette.brightViridian, midnightPalette.danger, "#77678E", midnightPalette.danger, "#77678E", midnightPalette.bone, midnightPalette.brightViridian][index], secondary: midnightPalette.bone })])) as Record<typeof characterIds[number], AtlasSpriteDefinition>,
  enemies: Object.fromEntries(enemyIds.map((id, index) => [id, enemySprite(id, {
    grunt: "Husk", runner: "Skitter", brute: "Grave Brute", spitter: "Venom Choir", charger: "Gore Charger", elite: "Bellguard", boss: "Cathedral Bell"
  }[id], index)])) as Record<typeof enemyIds[number], AtlasSpriteDefinition>,
  bullets: {
    kinetic: bulletSprite("kinetic", "Kinetic round", 0, { primary: midnightPalette.bone, secondary: midnightPalette.raisedInk }),
    lightning: bulletSprite("lightning", "Lightning spark", 1, { primary: midnightPalette.brightViridian, secondary: midnightPalette.bone }),
    fire: bulletSprite("fire", "Cinder round", 2, { primary: midnightPalette.danger, secondary: midnightPalette.amber }),
    ice: bulletSprite("ice", "Frost shard", 3, { primary: midnightPalette.brightViridian, secondary: midnightPalette.bone }),
    blood: bulletSprite("blood", "Blood thorn", 4, { primary: midnightPalette.danger, secondary: midnightPalette.bone }),
    void: bulletSprite("void", "Void shard", 5, { primary: midnightPalette.amber, secondary: midnightPalette.viridian })
  },
  weapons: Object.fromEntries(weaponIds.map((id, index) => [id, weaponSprite(id, {
    revolver: "Revolver", shotgun: "Shotgun", needle_smg: "Needle SMG", crossbow: "Crossbow", flame_cannon: "Flame Cannon", arc_rifle: "Arc Rifle", shard_launcher: "Shard Launcher", rail_lance: "Rail Lance", chakram: "Chakram", hive_staff: "Hive Staff", prism_launcher: "Prism Launcher", aether_spear: "Aether Spear"
  }[id], index)])) as Record<typeof weaponIds[number], AtlasSpriteDefinition>,
  summons: Object.fromEntries(summonIds.map((id, index) => [id, summonSprite(id, {
    wisp: "Wisp", hound: "Hound", turret: "Turret", drone: "Drone", mite: "Mite", blade: "Soul Scythe", wasp: "Wasp", chakram: "Chakram", orb: "Orb"
  }[id], index)])) as Record<typeof summonIds[number], AtlasSpriteDefinition>,
  pickups: {
    xp: pickupSprite()
  },
  effects: {
    kinetic: { kind: "procedural", id: "kinetic", label: "Kinetic shot", effect: "bullet", palette: { primary: midnightPalette.bone, secondary: midnightPalette.raisedInk } },
    lightning: { kind: "procedural", id: "lightning", label: "Lightning arc", effect: "trail", palette: { primary: midnightPalette.brightViridian, secondary: midnightPalette.bone } },
    fire: { kind: "procedural", id: "fire", label: "Cinder burst", effect: "particle", palette: { primary: midnightPalette.danger, secondary: midnightPalette.amber } },
    ice: { kind: "procedural", id: "ice", label: "Frost shard", effect: "bullet", palette: { primary: midnightPalette.brightViridian, secondary: midnightPalette.bone } },
    blood: { kind: "procedural", id: "blood", label: "Blood shot", effect: "particle", palette: { primary: midnightPalette.danger, secondary: midnightPalette.bone } },
    void: { kind: "procedural", id: "void", label: "Void ring", effect: "ring", palette: { primary: midnightPalette.amber, secondary: midnightPalette.viridian } }
  }
};

export const allArtEntityIds = { characterIds, enemyIds, bulletIds, weaponIds, summonIds };
