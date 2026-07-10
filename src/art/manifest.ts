import { midnightPalette, type ArtManifest, type AtlasFrame, type AtlasSpriteDefinition } from "./types";

const frame = (x: number, y: number, width = 32, height = 32, durationMs = 100): AtlasFrame => ({
  x,
  y,
  width,
  height,
  durationMs
});

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
    { id: "hit", frames: [frame(x + 96, y, 32, 32, 80)] }
  ]
});

const characterIds = ["saint", "ilya", "nox", "mira", "scarlett", "corvus", "kaden", "lyra"] as const;
const enemyIds = ["grunt", "runner", "brute", "spitter", "charger", "elite", "boss"] as const;
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
    characters: { id: "characters", src: "/art/characters.png", width: 512, height: 64 },
    enemies: { id: "enemies", src: "/art/enemies.png", width: 512, height: 64 },
    weapons: { id: "weapons", src: "/art/weapons.png", width: 512, height: 96 },
    summons: { id: "summons", src: "/art/summons.png", width: 512, height: 96 },
    glyphs: { id: "glyphs", src: "/art/glyphs.png", width: 128, height: 32 }
  },
  characters: entitySprites(characterIds, "characters", {
    saint: "Saint", ilya: "Ilya", nox: "Nox", mira: "Mira", scarlett: "Scarlett", corvus: "Corvus", kaden: "Kaden", lyra: "Lyra"
  }),
  enemies: entitySprites(enemyIds, "enemies", {
    grunt: "Husk", runner: "Skitter", brute: "Grave Brute", spitter: "Venom Choir", charger: "Gore Charger", elite: "Bellguard", boss: "Cathedral Bell"
  }, { primary: midnightPalette.danger, secondary: midnightPalette.bone }),
  weapons: entitySprites(weaponIds, "weapons", {
    revolver: "Revolver", shotgun: "Shotgun", needle_smg: "Needle SMG", crossbow: "Crossbow", flame_cannon: "Flame Cannon", arc_rifle: "Arc Rifle", shard_launcher: "Shard Launcher", rail_lance: "Rail Lance", chakram: "Chakram", hive_staff: "Hive Staff", prism_launcher: "Prism Launcher", aether_spear: "Aether Spear"
  }, { primary: midnightPalette.bone, secondary: midnightPalette.amber }),
  summons: entitySprites(summonIds, "summons", {
    wisp: "Wisp", hound: "Hound", turret: "Turret", drone: "Drone", mite: "Mite", blade: "Blade", wasp: "Wasp", chakram: "Chakram", orb: "Orb"
  }),
  pickups: {
    xp: atlasSprite("xp", "Experience", "glyphs", 0, 0, { primary: midnightPalette.brightViridian, secondary: midnightPalette.bone })
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

export const allArtEntityIds = { characterIds, enemyIds, weaponIds, summonIds };
