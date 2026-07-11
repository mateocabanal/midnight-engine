import type { AtlasSpriteDefinition } from "./art/types";
import { upgradeCatalogue, upgradeTrees, type UpgradeTier, type UpgradeTreeId } from "./upgrades/catalog";

export type InputState = {
  moveX: number;
  moveY: number;
  aimX: number;
  aimY: number;
  firing: boolean;
  active: boolean;
};

type Vec = { x: number; y: number };
export type CharacterId = string;
export type WeaponId = string;
export type RunState = "playing" | "victory" | "defeat";
export type RunResult = RunState;

export type LoadoutConfig = {
  characterId: CharacterId;
  weaponId: WeaponId;
};

export type LoadoutOption<T extends string> = {
  id: T;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  tradeoff: string;
};

export type UpgradeId = string;

type EnemyKind = "grunt" | "runner" | "brute" | "spitter" | "charger" | "elite" | "boss";

type Enemy = {
  id: number;
  kind: EnemyKind;
  x: number;
  y: number;
  r: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  burn: number;
  freeze: number;
  poison: number;
  shock: number;
  bleed: number;
  curse: number;
  hitFlash: number;
  damageNoticeCooldown: number;
  attackTimer: number;
  chargeTimer: number;
};

type EnemyProjectile = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  damage: number;
  life: number;
  age: number;
  color: string;
};

type Bullet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  damage: number;
  life: number;
  age: number;
  pierce: number;
  bounces: number;
  split: number;
  crit: number;
  element: "kinetic" | "lightning" | "fire" | "ice" | "blood" | "void";
  depth: number;
  fromOrbit?: boolean;
};

type BulletMods = Partial<Pick<Bullet, "split" | "bounces" | "crit" | "pierce" | "depth">> & {
  speed?: number;
  life?: number;
  radius?: number;
  fromOrbit?: boolean;
};

type Gem = {
  x: number;
  y: number;
  value: number;
  magnet: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  text?: string;
  size: number;
};

export type Orbital = {
  angle: number;
  distance: number;
  damage: number;
  // Null is a permanent familiar; finite values are temporary summons.
  life: number | null;
  speed: number;
  // Haste drives both the firing cadence and the visible orbit cadence.
  attackSpeed?: number;
  kind: SummonKind;
  attackCooldown: number;
  attackFlash: number;
};

type SummonKind = "wisp" | "hound" | "turret" | "drone" | "mite" | "blade" | "wasp" | "chakram" | "orb";

type Player = {
  x: number;
  y: number;
  r: number;
  characterId: CharacterId;
  weaponId: WeaponId;
  hp: number;
  maxHp: number;
  shield: number;
  speed: number;
  fireRate: number;
  damage: number;
  crit: number;
  critDamage: number;
  armour: number;
  pickupRadius: number;
  activeCooldown: number;
  activeTimer: number;
  weaponSpecial: WeaponId;
  cooldown: number;
  reload: number;
  reloadDuration: number;
  shots: number;
  magazine: number;
  pellets: number;
  spread: number;
  bulletSpeed: number;
  bulletSize: number;
  bulletLife: number;
  bulletPierce: number;
  reloadSpeed: number;
  summonDamage: number;
  lightningDamage: number;
  fireDamage: number;
  frostDamage: number;
  poisonDamage: number;
  bleedDamage: number;
  curseDamage: number;
  dashCooldown: number;
  invuln: number;
  souls: number;
  orbitals: Orbital[];
};

export type Game = {
  screen: { w: number; h: number };
  player: Player;
  enemies: Enemy[];
  bullets: Bullet[];
  enemyProjectiles: EnemyProjectile[];
  gems: Gem[];
  particles: Particle[];
  upgrades: Partial<Record<UpgradeId, number>>;
  time: number;
  spawnTimer: number;
  level: number;
  xp: number;
  nextXp: number;
  kills: number;
  shotCounter: number;
  idCounter: number;
  gameOver: boolean;
  runState: RunState;
  objective: RunObjective;
  director: DirectorState;
  draft: DraftState;
  summary: RunSummary;
  activeLatch: boolean;
  screenShake: number;
  combo: { count: number; timer: number; best: number };
  ui: {
    time: string;
    level: string;
    kills: string;
    hpPct: number;
    xpPct: number;
    activePct: number;
    activeReady: boolean;
    objective: string;
    objectivePct: number;
    directorPhase: string;
    threat: number;
    rerolls: number;
    banishes: number;
    combo: number;
    runState: RunState;
    gameOver: boolean;
  };
};

type UpgradeDef = {
  id: UpgradeId;
  name: string;
  category?: string;
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary" | "law" | "fusion";
  description: string;
  fusion?: boolean;
  law?: boolean;
  requires?: UpgradeId[];
  tree?: UpgradeTreeId | "fusion";
  tier?: UpgradeTier;
  tags?: string[];
  fusionTrees?: [UpgradeTreeId, UpgradeTreeId];
  apply: (game: Game) => void;
};

type RawUpgradeDef = [
  id: UpgradeId,
  name: string,
  category: string,
  rarity: NonNullable<UpgradeDef["rarity"]>,
  description: string,
  requires?: UpgradeId[]
];

export type Choice = UpgradeDef;

export type SpriteLayer = {
  shape: "circle" | "diamond" | "polygon" | "capsule" | "ring" | "rect" | "text" | "line";
  x?: number;
  y?: number;
  r?: number;
  w?: number;
  h?: number;
  points?: Vec[];
  fill?: string;
  stroke?: string;
  lineWidth?: number;
  alpha?: number;
  rotate?: number;
  pulse?: number;
  text?: string;
  font?: string;
};

type LayeredSpriteDefinition = {
  id: string;
  label: string;
  palette: { primary: string; secondary: string; accent?: string; shadow?: string };
  layers: SpriteLayer[];
};

export type ProceduralSpriteDefinition = LayeredSpriteDefinition & {
  kind: "procedural";
};

// The runtime consumes this discriminated boundary. Layered definitions remain as
// the procedural fallback while the atlas path is brought online incrementally.
export type SpriteDefinition = AtlasSpriteDefinition | ProceduralSpriteDefinition;

export type SpriteCatalog = {
  players: Record<string, LayeredSpriteDefinition>;
  enemies: Record<EnemyKind, LayeredSpriteDefinition>;
  bullets: Record<Bullet["element"], LayeredSpriteDefinition>;
  summons: Record<SummonKind, LayeredSpriteDefinition>;
  pickups: Record<"xp", LayeredSpriteDefinition>;
};

export type RunObjective = {
  name: string;
  duration: number;
  finalWaveDuration: number;
};

export type DirectorPhase = {
  name: string;
  start: number;
  threat: number;
  spawnInterval: number;
  packSize: number;
  eliteEvery: number;
  mix: EnemyKind[];
};

export type DirectorState = {
  phaseName: string;
  threat: number;
  nextEliteAt: number;
  nextBossAt: number;
  hordeTimer: number;
  spawnedBosses: number[];
};

export type DraftState = {
  rerolls: number;
  banishes: number;
  banished: UpgradeId[];
  seen: UpgradeId[];
};

export type RunSummary = {
  result: RunResult;
  title: string;
  time: string;
  kills: number;
  level: number;
  upgrades: number;
  characterId: CharacterId;
  weaponId: WeaponId;
};

export type PersistedProgress = {
  version: 1;
  runs: number;
  victories: number;
  bestTime: string;
  bestKills: number;
  bestLevel: number;
  discoveredLoadouts: string[];
  selectedLoadout: LoadoutConfig;
  lastSummary?: RunSummary;
};

const TAU = Math.PI * 2;
const DEFAULT_LOADOUT: LoadoutConfig = { characterId: "saint", weaponId: "revolver" };

export const directorPhases: DirectorPhase[] = [
  { name: "Opening Dusk", start: 0, threat: 1, spawnInterval: 0.94, packSize: 1, eliteEvery: 95, mix: ["grunt"] },
  { name: "First Swarm", start: 120, threat: 1.35, spawnInterval: 0.74, packSize: 2, eliteEvery: 72, mix: ["grunt", "runner", "grunt", "brute"] },
  { name: "Elite Hunt", start: 300, threat: 1.85, spawnInterval: 0.58, packSize: 3, eliteEvery: 52, mix: ["grunt", "runner", "brute", "spitter", "elite"] },
  { name: "Bullet Hell", start: 540, threat: 2.45, spawnInterval: 0.46, packSize: 4, eliteEvery: 42, mix: ["runner", "spitter", "charger", "grunt", "elite"] },
  { name: "Night Terror", start: 780, threat: 3.05, spawnInterval: 0.38, packSize: 5, eliteEvery: 34, mix: ["runner", "brute", "spitter", "charger", "elite"] },
  { name: "Final Dawn", start: 1140, threat: 3.8, spawnInterval: 0.28, packSize: 7, eliteEvery: 22, mix: ["runner", "spitter", "charger", "elite", "brute"] }
];

export const getDirectorPhase = (time: number): DirectorPhase => {
  let phase = directorPhases[0];
  for (const candidate of directorPhases) {
    if (time >= candidate.start) phase = candidate;
  }
  return phase;
};

export const characterOptions: LoadoutOption<CharacterId>[] = [
  {
    id: "saint",
    name: "Saint",
    tagline: "Reload ritualist",
    description: "Active: Covenant Reload instantly reloads, emits holy bolts, and empowers post-reload damage.",
    strengths: ["Reload", "Precision", "Shield"],
    tradeoff: "Litany of Empty Hands shrinks magazine size by 15%."
  },
  {
    id: "ilya",
    name: "Ilya",
    tagline: "Lightning crit engine",
    description: "Active: Stormstep dashes through enemies and leaves a shocking lightning line.",
    strengths: ["Shock", "Dash", "Chains"],
    tradeoff: "Conductive Faith reduces direct bullet damage by 10%."
  },
  {
    id: "nox",
    name: "Nox",
    tagline: "Blood swarm starter",
    description: "Active: Brood Burst releases poison mites. Passive: overheal stores brood charges for reload spawns.",
    strengths: ["Summons", "Poison", "Overheal"],
    tradeoff: "Overflow Brood lowers max health by 20."
  },
  {
    id: "mira",
    name: "Mira",
    tagline: "Copy and split specialist",
    description: "Active: Mirror Sigil creates a firing clone. Passive: every second projectile echoes.",
    strengths: ["Echo", "Split", "Geometry"],
    tradeoff: "Echo Chamber slows reload by 12%."
  },
  {
    id: "scarlett",
    name: "Scarlett",
    tagline: "Wildfire snowball",
    description: "Active: Cinder Rite guarantees burn and flame pools on the next shots.",
    strengths: ["Burn", "Explosions", "Flame pools"],
    tradeoff: "Pyre Hunger lowers projectile speed by 10%."
  },
  {
    id: "corvus",
    name: "Corvus",
    tagline: "Crit curse assassin",
    description: "Active: Veil Cut grants stealth and a guaranteed piercing crit.",
    strengths: ["Critical hits", "Curse", "Souls"],
    tradeoff: "Marked by Night reduces shield generation."
  },
  {
    id: "kaden",
    name: "Kaden",
    tagline: "Close-range bastion",
    description: "Active: Iron Bastion reduces damage and repels enemies around you.",
    strengths: ["Armour", "Knockback", "Low ammo"],
    tradeoff: "Last Line lowers fire rate by 15%."
  },
  {
    id: "lyra",
    name: "Lyra",
    tagline: "Summon commander",
    description: "Active: Rally Beasts commands summons to a target point and enrages them.",
    strengths: ["Summons", "Rally", "Projectile inheritance"],
    tradeoff: "Choirmother lowers player projectile damage by 12%."
  }
];

export const weaponOptions: LoadoutOption<WeaponId>[] = [
  {
    id: "revolver",
    name: "Revolver",
    tagline: "Precise, steady, lethal",
    description: "Balanced single-shot weapon with strong crit value and clean reload rhythm.",
    strengths: ["High damage", "Good crit", "Reliable reloads"],
    tradeoff: "Small magazine."
  },
  {
    id: "shotgun",
    name: "Shotgun",
    tagline: "Close-range pellet wall",
    description: "Fires multiple heavy pellets with big spread and nasty close-range burst.",
    strengths: ["Pellets", "Knockback feel", "On-hit effects"],
    tradeoff: "Short range and slow reload."
  },
  {
    id: "needle_smg",
    name: "Needle SMG",
    tagline: "Status proc machine",
    description: "Low damage, huge magazine, and high fire rate. Every ninth bullet is perfectly accurate.",
    strengths: ["Fire rate", "Large magazine", "Lightning/decay setups"],
    tradeoff: "Weak single-hit damage."
  },
  {
    id: "crossbow",
    name: "Crossbow",
    tagline: "Piercing heavy bolts",
    description: "Slow, hard-hitting bolts that pierce enemies and reward careful positioning.",
    strengths: ["Pierce", "Range", "Elite damage"],
    tradeoff: "Slow fire rate."
  },
  {
    id: "flame_cannon",
    name: "Flame Cannon",
    tagline: "Burning cone control",
    description: "Short-range fuel weapon that constantly applies Burn while connecting.",
    strengths: ["Burn", "Cone damage", "Area denial"],
    tradeoff: "Very low reach."
  },
  {
    id: "arc_rifle",
    name: "Arc Rifle",
    tagline: "Shock chaining rifle",
    description: "Medium-rate lightning weapon that chains harder against shocked targets.",
    strengths: ["Shock", "Chains", "Reload fusions"],
    tradeoff: "Mediocre raw boss damage without shock."
  },
  {
    id: "shard_launcher",
    name: "Shard Launcher",
    tagline: "Splash control cannon",
    description: "Slow explosive rounds that detonate on hit or max range.",
    strengths: ["Splash", "Overkill", "Pull effects"],
    tradeoff: "Low fire density."
  },
  {
    id: "rail_lance",
    name: "Rail Lance",
    tagline: "Charged armour breaker",
    description: "Slow hitscan lance with extreme pierce and armour break fantasy.",
    strengths: ["Boss damage", "Pierce", "Critical hits"],
    tradeoff: "Execution-heavy and slow."
  },
  {
    id: "chakram",
    name: "Chakram",
    tagline: "Returning geometry weapon",
    description: "Arcing blades hit outbound and return, rewarding positioning and bounce/orbit builds.",
    strengths: ["Return path", "Orbit", "Bounce"],
    tradeoff: "Harder to pilot in crowded screens."
  },
  {
    id: "hive_staff",
    name: "Hive Staff",
    tagline: "Projectile-summon hybrid",
    description: "Every third hit spawns a temporary wasp, bridging bullet and summon builds.",
    strengths: ["Summons", "Poison", "Hybrid scaling"],
    tradeoff: "Lower raw burst without summon support."
  },
  {
    id: "prism_launcher",
    name: "Prism Launcher",
    tagline: "Split spacing weapon",
    description: "Projectiles split near max range into three shards.",
    strengths: ["Split", "Spacing", "Projectile size"],
    tradeoff: "Weak point-blank before upgrades."
  },
  {
    id: "aether_spear",
    name: "Aether Spear",
    tagline: "Delayed retarget pressure",
    description: "Spears stop, hover, then retarget the nearest enemy.",
    strengths: ["Delayed damage", "Zone control", "Shock/frost"],
    tradeoff: "Damage arrives late."
  }
];

const playerSprite = (id: string, label: string, primary: string, secondary: string, glyph: string, layers: SpriteLayer[]): LayeredSpriteDefinition => ({
  id,
  label,
  palette: { primary, secondary, accent: "#f8fafc", shadow: primary },
  layers: [
    { shape: "ring", r: 21, stroke: secondary, lineWidth: 1.4, alpha: 0.28, pulse: 1.4 },
    ...layers,
    { shape: "text", text: glyph, y: 1, fill: primary, stroke: "rgba(3, 7, 18, 0.78)", lineWidth: 3, font: "800 12px Inter, system-ui, sans-serif" }
  ]
});

export const spriteCatalog: SpriteCatalog = {
  players: {
    saint: playerSprite("saint", "Saint", "#f8fafc", "#fde68a", "S", [
      { shape: "ring", r: 16, stroke: "#fde68a", lineWidth: 1, alpha: 0.28 },
      { shape: "diamond", r: 19, fill: "rgba(3, 7, 18, 0.84)", stroke: "#fde68a", lineWidth: 2.5, pulse: 1.1 },
      { shape: "ring", r: 10, stroke: "#f8fafc", lineWidth: 1.3, alpha: 0.7 },
      { shape: "circle", r: 3, x: 0, y: -8, fill: "#fde68a", alpha: 0.85 },
      { shape: "line", x: -7, y: 6, w: 14, h: 0, stroke: "#fde68a", lineWidth: 1, alpha: 0.4 }
    ]),
    ilya: playerSprite("ilya", "Ilya", "#72f5ff", "#2563eb", "I", [
      { shape: "ring", r: 16, stroke: "#72f5ff", lineWidth: 1, alpha: 0.2 },
      { shape: "polygon", fill: "rgba(3, 7, 18, 0.84)", stroke: "#72f5ff", lineWidth: 2.5, points: [
        { x: -16, y: -16 }, { x: 3, y: -16 }, { x: -3, y: -1 }, { x: 18, y: -1 }, { x: -2, y: 20 }, { x: 2, y: 5 }, { x: -18, y: 5 }
      ], pulse: 1.2 },
      { shape: "line", x: -14, y: 0, w: 22, h: 0, stroke: "#bfdbfe", lineWidth: 1.4, alpha: 0.6 },
      { shape: "circle", r: 2.5, x: -6, y: -8, fill: "#72f5ff" },
      { shape: "circle", r: 2.5, x: 8, y: 2, fill: "#72f5ff" }
    ]),
    nox: playerSprite("nox", "Nox", "#86efac", "#16a34a", "N", [
      { shape: "ring", r: 17, stroke: "#16a34a", lineWidth: 1, alpha: 0.22 },
      { shape: "polygon", fill: "rgba(3, 7, 18, 0.84)", stroke: "#86efac", lineWidth: 2.5, points: [
        { x: 0, y: -21 }, { x: 18, y: -6 }, { x: 20, y: 8 }, { x: 7, y: 22 }, { x: -7, y: 22 }, { x: -20, y: 8 }, { x: -18, y: -6 }
      ], pulse: 0.8 },
      { shape: "circle", r: 4, x: -8, y: -3, fill: "#bbf7d0" },
      { shape: "circle", r: 4, x: 8, y: -3, fill: "#bbf7d0" },
      { shape: "circle", r: 1.8, x: -8, y: -3, fill: "#16a34a" },
      { shape: "circle", r: 1.8, x: 8, y: -3, fill: "#16a34a" },
      { shape: "line", x: -6, y: 10, w: 12, h: 0, stroke: "#16a34a", lineWidth: 1, alpha: 0.5 }
    ]),
    mira: playerSprite("mira", "Mira", "#e9d5ff", "#a78bfa", "M", [
      { shape: "diamond", x: -8, y: 2, r: 16, fill: "#a78bfa", alpha: 0.18 },
      { shape: "diamond", x: 8, y: 2, r: 16, fill: "#a78bfa", alpha: 0.18 },
      { shape: "diamond", r: 19, fill: "rgba(3, 7, 18, 0.84)", stroke: "#e9d5ff", lineWidth: 2.5, pulse: 1 },
      { shape: "diamond", r: 8, fill: "#a78bfa", alpha: 0.3 },
      { shape: "circle", r: 2, x: 0, y: 0, fill: "#f5d0fe" }
    ]),
    scarlett: playerSprite("scarlett", "Scarlett", "#fb923c", "#dc2626", "R", [
      { shape: "polygon", fill: "rgba(3, 7, 18, 0.84)", stroke: "#fb923c", lineWidth: 2.5, points: [
        { x: 0, y: -24 }, { x: 19, y: -2 }, { x: 8, y: 23 }, { x: 0, y: 16 }, { x: -8, y: 23 }, { x: -19, y: -2 }
      ], pulse: 1.2 },
      { shape: "diamond", r: 7, y: -5, fill: "#fed7aa", alpha: 0.85 },
      { shape: "circle", r: 2, y: -8, fill: "#dc2626" },
      { shape: "line", x: -8, y: 8, w: 16, h: 0, stroke: "#dc2626", lineWidth: 1, alpha: 0.45 }
    ]),
    corvus: playerSprite("corvus", "Corvus", "#c4b5fd", "#1f123d", "C", [
      { shape: "ring", r: 18, stroke: "#c4b5fd", lineWidth: 1, alpha: 0.2 },
      { shape: "polygon", fill: "rgba(3, 7, 18, 0.9)", stroke: "#c4b5fd", lineWidth: 2.5, points: [
        { x: 0, y: -22 }, { x: 27, y: 16 }, { x: 7, y: 12 }, { x: 0, y: 24 }, { x: -7, y: 12 }, { x: -27, y: 16 }
      ], pulse: 0.9 },
      { shape: "circle", r: 3, x: 0, y: -6, fill: "#c4b5fd", alpha: 0.8 },
      { shape: "line", x: -18, y: 10, w: 36, h: 0, stroke: "#1f123d", lineWidth: 1, alpha: 0.5 }
    ]),
    kaden: playerSprite("kaden", "Kaden", "#fed7aa", "#92400e", "K", [
      { shape: "ring", r: 19, stroke: "#92400e", lineWidth: 1, alpha: 0.2 },
      { shape: "polygon", fill: "rgba(3, 7, 18, 0.86)", stroke: "#fed7aa", lineWidth: 3, points: [
        { x: 0, y: -22 }, { x: 22, y: -3 }, { x: 16, y: 17 }, { x: 0, y: 24 }, { x: -16, y: 17 }, { x: -22, y: -3 }
      ], pulse: 0.65 },
      { shape: "rect", w: 24, h: 8, y: 8, fill: "rgba(146, 64, 14, 0.72)", stroke: "#fed7aa", lineWidth: 1 },
      { shape: "circle", r: 2.5, x: 0, y: -8, fill: "#fed7aa" },
      { shape: "line", x: -10, y: -2, w: 20, h: 0, stroke: "#92400e", lineWidth: 1, alpha: 0.4 }
    ]),
    lyra: playerSprite("lyra", "Lyra", "#f0abfc", "#7c3aed", "L", [
      { shape: "ring", r: 20, stroke: "#f0abfc", lineWidth: 3, pulse: 1.1 },
      { shape: "ring", r: 16, stroke: "#7c3aed", lineWidth: 1.5, alpha: 0.4 },
      { shape: "circle", r: 12, fill: "rgba(3, 7, 18, 0.84)", stroke: "#f0abfc", lineWidth: 2 },
      { shape: "circle", r: 4, fill: "#f5d0fe", alpha: 0.6 },
      { shape: "line", x: -14, y: 0, w: 28, h: 0, stroke: "#f5d0fe", lineWidth: 1.4, alpha: 0.72 }
    ])
  },
  enemies: {
    grunt: { id: "grunt", label: "Husk", palette: { primary: "#e11d48", secondary: "#fb7185", shadow: "#e11d48" }, layers: [
      { shape: "circle", r: 13, fill: "#9f1239", stroke: "#fb7185", lineWidth: 2 },
      { shape: "circle", r: 10, fill: "#e11d48", alpha: 0.6 },
      { shape: "circle", r: 2.5, x: -4, y: -3, fill: "#fecdd3" },
      { shape: "circle", r: 2.5, x: 4, y: -3, fill: "#fecdd3" },
      { shape: "circle", r: 1, x: -4, y: -3, fill: "#450a0a" },
      { shape: "circle", r: 1, x: 4, y: -3, fill: "#450a0a" },
      { shape: "line", x: -4, y: 5, w: 8, h: 0, stroke: "#450a0a", lineWidth: 1.5, alpha: 0.7 }
    ]},
    runner: { id: "runner", label: "Skitter", palette: { primary: "#f59e0b", secondary: "#fde68a", shadow: "#d97706" }, layers: [
      { shape: "polygon", fill: "#78350f", stroke: "#f59e0b", lineWidth: 2, points: [{x:16,y:0},{x:2,y:-10},{x:-14,y:-6},{x:-7,y:0},{x:-14,y:6},{x:2,y:10}], pulse: 1.2 },
      { shape: "polygon", fill: "#b45309", alpha: 0.55, points: [{x:11,y:0},{x:1,y:-7},{x:-10,y:-4},{x:-5,y:0},{x:-10,y:4},{x:1,y:7}] },
      { shape: "line", x: -4, y: -9, w: 8, h: -7, stroke: "#fde68a", lineWidth: 1.2 },
      { shape: "line", x: -4, y: 9, w: 8, h: 7, stroke: "#fde68a", lineWidth: 1.2 },
      { shape: "circle", r: 1.8, x: 4, y: 0, fill: "#fef2f2" }
    ]},
    brute: { id: "brute", label: "Grave Brute", palette: { primary: "#7c3aed", secondary: "#c4b5fd", shadow: "#5b21b6" }, layers: [
      { shape: "ring", r: 21, stroke: "#4c1d95", lineWidth: 3, alpha: 0.3 },
      { shape: "circle", r: 18, fill: "#2e1065", stroke: "#7c3aed", lineWidth: 2.5 },
      { shape: "circle", r: 14, fill: "#4c1d95", alpha: 0.7 },
      { shape: "rect", w: 24, h: 7, y: 8, fill: "#5b21b6", stroke: "#c4b5fd", lineWidth: 1.1 },
      { shape: "circle", r: 3.5, x: -6, y: -4, fill: "#c4b5fd", alpha: 0.8 },
      { shape: "circle", r: 3.5, x: 6, y: -4, fill: "#c4b5fd", alpha: 0.8 },
      { shape: "circle", r: 1.5, x: -6, y: -4, fill: "#1e1b4b" },
      { shape: "circle", r: 1.5, x: 6, y: -4, fill: "#1e1b4b" }
    ]},
    spitter: { id: "spitter", label: "Venom Choir", palette: { primary: "#10b981", secondary: "#6ee7b7", shadow: "#047857" }, layers: [
      { shape: "polygon", fill: "#022c22", stroke: "#10b981", lineWidth: 2, points: [{x:0,y:-16},{x:14,y:0},{x:0,y:16},{x:-14,y:0}], pulse: 1.1 },
      { shape: "polygon", fill: "#064e3b", alpha: 0.6, points: [{x:0,y:-11},{x:10,y:0},{x:0,y:11},{x:-10,y:0}] },
      { shape: "circle", r: 5, fill: "#10b981", alpha: 0.75 },
      { shape: "circle", r: 2.5, fill: "#a7f3d0" },
      { shape: "line", x: -10, y: 10, w: 20, h: -20, stroke: "#6ee7b7", lineWidth: 1.4, alpha: 0.4 }
    ]},
    charger: { id: "charger", label: "Gore Charger", palette: { primary: "#dc2626", secondary: "#fecaca", shadow: "#991b1b" }, layers: [
      { shape: "polygon", fill: "#450a0a", stroke: "#dc2626", lineWidth: 2.5, points: [{x:24,y:0},{x:4,y:-16},{x:-16,y:-10},{x:-9,y:0},{x:-16,y:10},{x:4,y:16}], pulse: 0.9 },
      { shape: "polygon", fill: "#7f1d1d", alpha: 0.55, points: [{x:17,y:0},{x:3,y:-11},{x:-12,y:-7},{x:-6,y:0},{x:-12,y:7},{x:3,y:11}] },
      { shape: "line", x: 4, y: -11, w: 14, h: 8, stroke: "#fecaca", lineWidth: 2 },
      { shape: "line", x: 4, y: 11, w: 14, h: -8, stroke: "#fecaca", lineWidth: 2 },
      { shape: "circle", r: 2, x: 8, y: -3, fill: "#fef2f2" },
      { shape: "circle", r: 2, x: 8, y: 3, fill: "#fef2f2" }
    ]},
    elite: { id: "elite", label: "Bellguard", palette: { primary: "#f97316", secondary: "#fde68a", shadow: "#c2410c" }, layers: [
      { shape: "ring", r: 23, stroke: "#fde68a", lineWidth: 1, alpha: 0.15, pulse: 1 },
      { shape: "ring", r: 20, stroke: "#fde68a", lineWidth: 2.5, alpha: 0.5 },
      { shape: "polygon", fill: "#7c2d12", stroke: "#f97316", lineWidth: 2.5, points: [{x:0,y:-18},{x:16,y:0},{x:0,y:18},{x:-16,y:0}] },
      { shape: "polygon", fill: "#9a3412", alpha: 0.5, points: [{x:0,y:-13},{x:11,y:0},{x:0,y:13},{x:-11,y:0}] },
      { shape: "line", x: -11, y: 0, w: 22, h: 0, stroke: "#ffedd5", lineWidth: 2 },
      { shape: "circle", r: 3.5, x: 0, y: -7, fill: "#fde68a", alpha: 0.8 },
      { shape: "circle", r: 1.5, x: 0, y: -7, fill: "#7c2d12" }
    ]},
    boss: { id: "boss", label: "Cathedral Bell", palette: { primary: "#a855f7", secondary: "#fde68a", shadow: "#7e22ce" }, layers: [
      { shape: "ring", r: 40, stroke: "#fde68a", lineWidth: 1, alpha: 0.1, pulse: 2 },
      { shape: "ring", r: 34, stroke: "#fde68a", lineWidth: 3, alpha: 0.5, pulse: 2 },
      { shape: "polygon", fill: "#1e1b4b", stroke: "#c4b5fd", lineWidth: 3, points: [
        { x: 0, y: -36 }, { x: 28, y: -10 }, { x: 23, y: 24 }, { x: 0, y: 36 }, { x: -23, y: 24 }, { x: -28, y: -10 }
      ]},
      { shape: "polygon", fill: "#312e81", alpha: 0.6, points: [
        { x: 0, y: -27 }, { x: 21, y: -7 }, { x: 17, y: 18 }, { x: 0, y: 27 }, { x: -17, y: 18 }, { x: -21, y: -7 }
      ]},
      { shape: "diamond", r: 14, fill: "#fde68a", alpha: 0.12 },
      { shape: "diamond", r: 11, fill: "#fde68a", alpha: 0.35 },
      { shape: "diamond", r: 7, fill: "#fef3c7" },
      { shape: "circle", r: 2, x: 0, y: 0, fill: "#a855f7" },
      { shape: "line", x: -17, y: -15, w: 34, h: 0, stroke: "#c4b5fd", lineWidth: 1, alpha: 0.25 },
      { shape: "line", x: -17, y: 15, w: 34, h: 0, stroke: "#c4b5fd", lineWidth: 1, alpha: 0.25 }
    ]}
  },
  bullets: {
    kinetic: { id: "kinetic", label: "Kinetic", palette: { primary: "#f8fafc", secondary: "#cbd5e1" }, layers: [
      { shape: "circle", r: 5, fill: "#cbd5e1", alpha: 0.3 },
      { shape: "capsule", w: 16, h: 7, fill: "#f8fafc" },
      { shape: "circle", r: 2, x: 4, y: 0, fill: "#ffffff" }
    ]},
    lightning: { id: "lightning", label: "Lightning", palette: { primary: "#72f5ff", secondary: "#2563eb" }, layers: [
      { shape: "circle", r: 6, fill: "#72f5ff", alpha: 0.2 },
      { shape: "line", x: -10, y: -4, w: 8, h: 6, stroke: "#72f5ff", lineWidth: 2.5 },
      { shape: "line", x: -2, y: 2, w: 12, h: -6, stroke: "#72f5ff", lineWidth: 2.5 },
      { shape: "circle", r: 2, x: 4, y: 0, fill: "#ffffff" }
    ]},
    fire: { id: "fire", label: "Fire", palette: { primary: "#fb923c", secondary: "#fed7aa" }, layers: [
      { shape: "circle", r: 6, fill: "#fb923c", alpha: 0.2 },
      { shape: "polygon", fill: "#dc2626", points: [{x: 10, y:0},{x:-2,y:-7},{x:-8,y:0},{x:-2,y:7}] },
      { shape: "polygon", fill: "#fb923c", points: [{x: 8, y:0},{x:-1,y:-5},{x:-5,y:0},{x:-1,y:5}] },
      { shape: "circle", r: 2, x: 2, y: 0, fill: "#fef3c7" }
    ]},
    ice: { id: "ice", label: "Ice", palette: { primary: "#93c5fd", secondary: "#e0f2fe" }, layers: [
      { shape: "circle", r: 7, fill: "#93c5fd", alpha: 0.18 },
      { shape: "diamond", r: 8, fill: "#3b82f6", stroke: "#e0f2fe", lineWidth: 1.5 },
      { shape: "diamond", r: 5, fill: "#93c5fd" },
      { shape: "circle", r: 1.5, x: 0, y: 0, fill: "#ffffff" }
    ]},
    blood: { id: "blood", label: "Blood", palette: { primary: "#fb7185", secondary: "#fecdd3" }, layers: [
      { shape: "circle", r: 7, fill: "#fb7185", alpha: 0.2 },
      { shape: "circle", r: 6, fill: "#be123c" },
      { shape: "diamond", r: 4, x: 7, fill: "#fecdd3", alpha: 0.72 },
      { shape: "circle", r: 2, x: -1, y: 0, fill: "#fef2f2" }
    ]},
    void: { id: "void", label: "Void", palette: { primary: "#c084fc", secondary: "#581c87" }, layers: [
      { shape: "circle", r: 10, fill: "#c084fc", alpha: 0.12 },
      { shape: "ring", r: 8, stroke: "#c084fc", lineWidth: 2 },
      { shape: "ring", r: 5, stroke: "#a855f7", lineWidth: 1, alpha: 0.5 },
      { shape: "circle", r: 3, fill: "#f5d0fe" },
      { shape: "circle", r: 1, x: 0, y: 0, fill: "#ffffff" }
    ]}
  },
  summons: {
    wisp: { id: "wisp", label: "Wisp", palette: { primary: "#f0abfc", secondary: "#f5d0fe" }, layers: [
      { shape: "ring", r: 14, stroke: "#f0abfc", lineWidth: 1, alpha: 0.2 },
      { shape: "ring", r: 13, stroke: "#f0abfc", lineWidth: 1.8, alpha: 0.5 },
      { shape: "circle", r: 8, fill: "#f0abfc", alpha: 0.3 },
      { shape: "circle", r: 7, fill: "#f5d0fe" },
      { shape: "circle", r: 3, fill: "#ffffff", alpha: 0.7 }
    ]},
    hound: { id: "hound", label: "Hound", palette: { primary: "#fbbf24", secondary: "#fde68a" }, layers: [
      { shape: "capsule", w: 20, h: 10, fill: "#92400e" },
      { shape: "capsule", w: 16, h: 8, fill: "#fbbf24", x: 1, y: -1 },
      { shape: "circle", x: 10, y: -4, r: 5, fill: "#fde68a" },
      { shape: "circle", r: 1.5, x: 11, y: -5, fill: "#451a03" },
      { shape: "line", x: -8, y: -6, w: 6, h: -6, stroke: "#fbbf24", lineWidth: 2 },
      { shape: "line", x: -8, y: 6, w: 6, h: 6, stroke: "#fbbf24", lineWidth: 2 }
    ]},
    turret: { id: "turret", label: "Turret", palette: { primary: "#cbd5e1", secondary: "#94a3b8" }, layers: [
      { shape: "circle", r: 10, fill: "#1e293b", stroke: "#94a3b8", lineWidth: 1.5 },
      { shape: "rect", w: 16, h: 16, fill: "rgba(3,7,18,0.76)", stroke: "#cbd5e1", lineWidth: 2 },
      { shape: "circle", r: 4, fill: "#475569" },
      { shape: "line", x: 0, y: 0, w: 16, h: 0, stroke: "#cbd5e1", lineWidth: 2 },
      { shape: "circle", r: 1.5, x: 8, y: 0, fill: "#f8fafc" }
    ]},
    drone: { id: "drone", label: "Drone", palette: { primary: "#67e8f9", secondary: "#cffafe" }, layers: [
      { shape: "ring", r: 11, stroke: "#67e8f9", lineWidth: 1, alpha: 0.2 },
      { shape: "ring", r: 9, stroke: "#67e8f9", lineWidth: 2 },
      { shape: "line", x: -14, y: 0, w: 28, h: 0, stroke: "#cffafe", lineWidth: 1.4 },
      { shape: "circle", r: 3, fill: "#67e8f9", alpha: 0.6 },
      { shape: "circle", r: 1.5, fill: "#ffffff" }
    ]},
    mite: { id: "mite", label: "Mite", palette: { primary: "#86efac", secondary: "#bbf7d0" }, layers: [
      { shape: "circle", r: 8, fill: "#86efac", alpha: 0.15 },
      { shape: "polygon", fill: "#15803d", points: [{x:10,y:0},{x:0,y:-7},{x:-9,y:-4},{x:-5,y:0},{x:-9,y:4},{x:0,y:7}] },
      { shape: "polygon", fill: "#86efac", points: [{x:7,y:0},{x:0,y:-5},{x:-6,y:-2},{x:-3,y:0},{x:-6,y:2},{x:0,y:5}] },
      { shape: "circle", r: 1.5, x: 2, y: 0, fill: "#bbf7d0" }
    ]},
    blade: { id: "blade", label: "Soul Scythe", palette: { primary: "#c4b5fd", secondary: "#ddd6fe" }, layers: [
      { shape: "circle", r: 10, fill: "#c4b5fd", alpha: 0.12 },
      { shape: "line", x: 0, y: -13, w: 0, h: 26, stroke: "#7c3aed", lineWidth: 4 },
      { shape: "line", x: 0, y: -13, w: 0, h: 26, stroke: "#c4b5fd", lineWidth: 1.5 },
      { shape: "line", x: -11, y: -12, w: 11, h: 0, stroke: "#ddd6fe", lineWidth: 4 },
      { shape: "line", x: -13, y: -8, w: 8, h: -4, stroke: "#ddd6fe", lineWidth: 3 },
      { shape: "circle", r: 2, x: 0, y: 12, fill: "#ffffff", alpha: 0.6 }
    ]},
    wasp: { id: "wasp", label: "Wasp", palette: { primary: "#86efac", secondary: "#fef08a" }, layers: [
      { shape: "circle", r: 8, fill: "#86efac", alpha: 0.12 },
      { shape: "polygon", fill: "#15803d", points: [{x:11,y:0},{x:0,y:-7},{x:-10,y:-4},{x:-5,y:0},{x:-10,y:4},{x:0,y:7}] },
      { shape: "polygon", fill: "#86efac", points: [{x:8,y:0},{x:0,y:-5},{x:-7,y:-2},{x:-3,y:0},{x:-7,y:2},{x:0,y:5}] },
      { shape: "circle", x: -2, y: -7, r: 5, fill: "#fef08a", alpha: 0.35 },
      { shape: "circle", x: -2, y: 7, r: 5, fill: "#fef08a", alpha: 0.35 },
      { shape: "circle", r: 1.5, x: 3, y: 0, fill: "#fef08a" }
    ]},
    chakram: { id: "chakram", label: "Chakram", palette: { primary: "#c4b5fd", secondary: "#f5d0fe" }, layers: [
      { shape: "circle", r: 12, fill: "#c4b5fd", alpha: 0.1 },
      { shape: "ring", r: 10, stroke: "#7c3aed", lineWidth: 3 },
      { shape: "ring", r: 10, stroke: "#c4b5fd", lineWidth: 1.5 },
      { shape: "line", x: -11, y: 0, w: 22, h: 0, stroke: "#f5d0fe", lineWidth: 1.4 },
      { shape: "line", x: 0, y: -10, w: 0, h: 20, stroke: "#f5d0fe", lineWidth: 1, alpha: 0.5 },
      { shape: "circle", r: 1.5, fill: "#ffffff", alpha: 0.5 }
    ]},
    orb: { id: "orb", label: "Orb", palette: { primary: "#f8fafc", secondary: "#cbd5e1" }, layers: [
      { shape: "circle", r: 10, fill: "#cbd5e1", alpha: 0.12 },
      { shape: "diamond", r: 8, fill: "#94a3b8", stroke: "#cbd5e1", lineWidth: 1.4 },
      { shape: "diamond", r: 5, fill: "#f8fafc" },
      { shape: "circle", r: 1.5, fill: "#ffffff" }
    ]}
  },
  pickups: {
    xp: { id: "xp", label: "Experience", palette: { primary: "#a78bfa", secondary: "#ddd6fe" }, layers: [
      { shape: "circle", r: 8, fill: "#a78bfa", alpha: 0.12 },
      { shape: "diamond", r: 6, fill: "#7c3aed", stroke: "#ddd6fe", lineWidth: 1.2 },
      { shape: "diamond", r: 4, fill: "#a78bfa" },
      { shape: "circle", r: 1.5, fill: "#f5d0fe" }
    ]}
  }
};

type SpriteGroupName = keyof SpriteCatalog | "player" | "enemy" | "bullet" | "summon" | "pickup";

const proceduralSpriteCache = new WeakMap<LayeredSpriteDefinition, ProceduralSpriteDefinition>();

const proceduralSprite = (definition: LayeredSpriteDefinition): ProceduralSpriteDefinition => {
  const cached = proceduralSpriteCache.get(definition);
  if (cached) return cached;
  const resolved = { ...definition, kind: "procedural" as const };
  proceduralSpriteCache.set(definition, resolved);
  return resolved;
};

export const getSpriteDefinition = (kind: SpriteGroupName, id: string): ProceduralSpriteDefinition => {
  const normalized =
    kind === "player"
      ? "players"
      : kind === "enemy"
        ? "enemies"
        : kind === "bullet"
          ? "bullets"
          : kind === "summon"
            ? "summons"
            : kind === "pickup"
              ? "pickups"
              : kind;
  const group = spriteCatalog[normalized] as Record<string, LayeredSpriteDefinition>;
  return proceduralSprite(group[id] || group[Object.keys(group)[0]]);
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const len = (x: number, y: number) => Math.hypot(x, y) || 1;
const legacyUpgradeEquivalents: Record<string, UpgradeId[]> = {
  law_of_echoes: ["mirror_chamber", "hall_of_mirrors"],
  fresh_clip: ["static_prayer"],
  empty_chamber: ["empty_bell"],
  capacitor: ["static_prayer"],
  static_touch: ["static_prayer"],
  chain_spark: ["thunder_magazine", "tempest_crown"],
  firestarter: ["frostfire_rounds"],
  cold_touch: ["frostfire_rounds"],
  brittle: ["brittle_core"],
  hemorrhage: ["serrated_lead", "blood_tax"],
  serrated_rounds: ["serrated_lead"],
  vampiric_shell: ["red_refund"],
  cauterize: ["red_refund"],
  soul_shepherd: ["grave_interest", "soul_blade"],
  soul_furnace: ["tithe"],
  law_of_orbit: ["hungry_crown"],
  conductor: ["storm_crown", "undertaker_engine"],
  greed: ["compound_interest"],
  magnetism: ["greed_magnet", "gem_singularity"],
  broodmother: ["parasite_rounds", "brood_cascade"],
  familiar_training: ["larval_split"],
  leash_breaker: ["host_jump"],
  twin_spawn: ["brood_cascade"],
  law_of_gravity: ["void_mark", "event_horizon"],
  napalm: ["thermal_shock"],
  deep_freeze: ["brittle_core"],
  ice_bloom: ["solar_frostbite"],
  ash_wake: ["thermal_shock"]
};

const has = (game: Game, id: UpgradeId) =>
  (game.upgrades[id] || 0) > 0 || (legacyUpgradeEquivalents[id]?.some((replacement) => (game.upgrades[replacement] || 0) > 0) ?? false);
const count = (game: Game, id: UpgradeId) =>
  game.upgrades[id] || Math.max(0, ...(legacyUpgradeEquivalents[id] ?? []).map((replacement) => game.upgrades[replacement] || 0));
const addUpgrade = (game: Game, id: UpgradeId) => {
  game.upgrades[id] = (game.upgrades[id] || 0) + 1;
};

const formatRunTime = (time: number) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const createSummary = (game: Pick<Game, "player" | "time" | "kills" | "level" | "upgrades">, result: RunResult = "playing"): RunSummary => ({
  result,
  title: result === "victory" ? "Midnight Broken" : result === "defeat" ? "Engine Collapsed" : "Run in progress",
  time: formatRunTime(game.time),
  kills: game.kills,
  level: game.level,
  upgrades: Object.keys(game.upgrades).length,
  characterId: game.player.characterId,
  weaponId: game.player.weaponId
});

const finishRun = (game: Game, result: Exclude<RunResult, "playing">) => {
  if (game.runState !== "playing") return;
  game.runState = result;
  game.gameOver = true;
  game.summary = createSummary(game, result);
  text(game, game.player.x, game.player.y - 42, game.summary.title, result === "victory" ? "#fde68a" : "#fb7185");
};

const PROGRESS_STORAGE_KEY = "midnight-engine-progress-v1";

const defaultProgress = (): PersistedProgress => ({
  version: 1,
  runs: 0,
  victories: 0,
  bestTime: "00:00",
  bestKills: 0,
  bestLevel: 1,
  discoveredLoadouts: [],
  selectedLoadout: DEFAULT_LOADOUT
});

const storage = () => {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage;
  } catch {
    return undefined;
  }
};

const timeToSeconds = (time: string) => {
  const [minutes = "0", seconds = "0"] = time.split(":");
  return Number(minutes) * 60 + Number(seconds);
};

export const loadProgress = (): PersistedProgress => {
  const store = storage();
  if (!store) return defaultProgress();
  try {
    const raw = store.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return defaultProgress();
    const parsed = JSON.parse(raw) as Partial<PersistedProgress>;
    return {
      ...defaultProgress(),
      ...parsed,
      selectedLoadout: {
        characterId: parsed.selectedLoadout?.characterId || DEFAULT_LOADOUT.characterId,
        weaponId: parsed.selectedLoadout?.weaponId || DEFAULT_LOADOUT.weaponId
      },
      discoveredLoadouts: Array.isArray(parsed.discoveredLoadouts) ? parsed.discoveredLoadouts : []
    };
  } catch {
    return defaultProgress();
  }
};

const saveProgress = (progress: PersistedProgress) => {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore quota/private-mode failures; gameplay should continue.
  }
};

export const saveSelectedLoadout = (loadout: LoadoutConfig) => {
  const progress = loadProgress();
  progress.selectedLoadout = loadout;
  saveProgress(progress);
};

export const recordRunSummary = (summary: RunSummary): PersistedProgress => {
  const progress = loadProgress();
  if (summary.result === "playing") return progress;

  const loadoutKey = `${summary.characterId}:${summary.weaponId}`;
  const discoveredLoadouts = new Set(progress.discoveredLoadouts);
  discoveredLoadouts.add(loadoutKey);

  const next: PersistedProgress = {
    ...progress,
    runs: progress.runs + 1,
    victories: progress.victories + (summary.result === "victory" ? 1 : 0),
    bestTime: timeToSeconds(summary.time) > timeToSeconds(progress.bestTime) ? summary.time : progress.bestTime,
    bestKills: Math.max(progress.bestKills, summary.kills),
    bestLevel: Math.max(progress.bestLevel, summary.level),
    discoveredLoadouts: [...discoveredLoadouts].sort(),
    lastSummary: summary
  };
  saveProgress(next);
  return next;
};

const legacyRawUpgradeDefs: Omit<UpgradeDef, "apply">[] = ([
  ["heavy_caliber", "Heavy Caliber", "ballistics", "common", "+22% projectile damage, -10% fire rate."],
  ["long_barrel", "Long Barrel", "ballistics", "common", "+22% projectile speed, +18% range."],
  ["rifled_jacket", "Rifled Jacket", "ballistics", "uncommon", "+1 pierce; each pierce after the first reduces remaining damage."],
  ["buckshot", "Buckshot", "ballistics", "uncommon", "Multi-pellet weapons gain +2 pellets; single-projectile weapons gain angled side shots; -12% range."],
  ["soft_lead", "Soft Lead", "ballistics", "common", "+35% knockback, +14% projectile size, -12% projectile speed."],
  ["collateral", "Collateral", "ballistics", "rare", "Overkill deals 40% excess damage in a splash.", ["heavy_caliber"]],
  ["twin_feed", "Twin Feed", "ballistics", "rare", "+1 projectile, -18% projectile damage.", ["buckshot"]],
  ["giant_killer", "Giant Killer", "ballistics", "uncommon", "+30% damage to elites, bosses, and healthy enemies."],
  ["pinpoint", "Pinpoint", "ballistics", "common", "-20% spread; distant targets take extra crit chance."],
  ["serrated_rounds", "Serrated Rounds", "ballistics", "uncommon", "Crits and pierces apply Bleed; +10% direct hit damage."],
  ["rebound", "Rebound", "ballistics", "rare", "+1 bounce; bounced projectiles deal reduced damage."],
  ["shadow_round", "Shadow Round", "ballistics", "epic", "Every fourth shot becomes ethereal, faster, and piercing.", ["pinpoint"]],
  ["bracer_core", "Bracer Core", "ballistics", "common", "+18% projectile size and hit radius; +10% splash radius."],
  ["momentum_shot", "Momentum Shot", "ballistics", "uncommon", "Projectile damage increases with distance travelled."],
  ["fin_stabilizer", "Fin Stabilizer", "ballistics", "common", "+14% projectile speed, +10% fire rate, -15% spread bloom."],
  ["armour_breaker", "Armour Breaker", "ballistics", "rare", "Ignore armour and deal bonus damage to plated enemies.", ["rifled_jacket"]],
  ["fast_hands", "Fast Hands", "reload", "common", "-18% reload time."],
  ["extended_magazine", "Extended Magazine", "magazine", "common", "+35% ammo capacity, -10% reload speed."],
  ["fresh_clip", "Fresh Clip", "reload", "uncommon", "First shot after reload deals +35% damage and gains size."],
  ["last_straw", "Last Straw", "magazine", "uncommon", "Final 20% of the magazine gains damage and crit chance."],
  ["bottomless_habit", "Bottomless Habit", "magazine", "rare", "18% chance to not consume ammo.", ["extended_magazine"]],
  ["quick_rack", "Quick Rack", "reload", "common", "Move faster while reloading; moving reloads faster."],
  ["chamber_trick", "Chamber Trick", "reload", "rare", "Perfect empty reload grants a phantom high-damage round.", ["tactical_reload"]],
  ["tactical_reload", "Tactical Reload", "reload", "uncommon", "Reloading before empty makes the next reload faster and grants speed.", ["fast_hands"]],
  ["backpressure", "Backpressure", "magazine", "uncommon", "Below 30% magazine, fire rate rises."],
  ["empty_chamber", "Empty Chamber", "reload", "uncommon", "Hitting 0 ammo fires a shrapnel ring."],
  ["ammo_printer", "Ammo Printer", "magazine", "rare", "Every 8 kills refund 1 ammo.", ["extended_magazine"]],
  ["hair_trigger", "Hair Trigger", "fire_rate", "common", "+18% fire rate, +8% spread."],
  ["deadeye", "Deadeye", "critical", "common", "+10% critical chance, +8% projectile speed."],
  ["glass_eye", "Glass Eye", "critical", "rare", "+30% critical damage, -12% maximum health.", ["deadeye"]],
  ["hollow_point", "Hollow Point", "critical", "uncommon", "Critical hits ignore armour and apply Bleed.", ["deadeye"]],
  ["headhunter", "Headhunter", "critical", "epic", "Critting elites or bosses grants crit chance; overkill crits spawn shards.", ["hollow_point", "glass_eye"]],
  ["ember_touch", "Ember Touch", "fire", "common", "+2 flat fire damage on hit; chance to apply Burn."],
  ["firestarter", "Firestarter", "fire", "uncommon", "Hits have a stronger chance to apply Burn.", ["ember_touch"]],
  ["lingering_flame", "Lingering Flame", "fire", "uncommon", "Kills leave flame pools.", ["firestarter"]],
  ["napalm", "Napalm", "fire", "rare", "Flame pools and explosions gain radius and Burn stacks.", ["lingering_flame"]],
  ["pyromaniac", "Pyromaniac", "fire", "uncommon", "+25% damage to burning enemies.", ["firestarter"]],
  ["thermal_lance", "Thermal Lance", "fire", "rare", "Burned enemies lose armour; projectiles gain damage after passing through fire.", ["napalm"]],
  ["ash_wake", "Ash Wake", "fire", "rare", "Burning enemy deaths explode and spread Burn.", ["napalm"]],
  ["cauterize", "Cauterize", "fire", "epic", "Burn kills heal or shield you.", ["napalm", "pyromaniac"]],
  ["cold_touch", "Cold Touch", "frost", "common", "Hits apply Chill; enough Chill freezes."],
  ["deep_freeze", "Deep Freeze", "frost", "uncommon", "Freeze duration increases.", ["cold_touch"]],
  ["permafrost", "Permafrost", "frost", "rare", "Frozen enemies take more damage after thaw.", ["deep_freeze"]],
  ["brittle", "Brittle", "frost", "rare", "Frozen enemies take much higher critical damage.", ["deep_freeze"]],
  ["ice_bloom", "Ice Bloom", "frost", "uncommon", "Frozen enemy deaths release ice shards.", ["deep_freeze"]],
  ["cold_snap", "Cold Snap", "frost", "rare", "Every fifth Chill application instantly freezes.", ["deep_freeze"]],
  ["rime_ward", "Rime Ward", "frost", "epic", "Freezing an enemy grants shield.", ["permafrost", "ice_bloom"]],
  ["snowdrift", "Snowdrift", "frost", "uncommon", "Standing still emits Chill pulses."],
  ["static_touch", "Static Touch", "shock", "common", "Hits have a chance to apply Shock."],
  ["chain_spark", "Chain Spark", "shock", "uncommon", "Shock chains to +1 target and gains range.", ["static_touch"]],
  ["overcharge", "Overcharge", "shock", "rare", "Hitting shocked enemies deals bonus damage and consumes Shock.", ["chain_spark"]],
  ["capacitor", "Capacitor", "shock", "rare", "Reloading zaps the nearest shocked enemies.", ["chain_spark"]],
  ["ionized", "Ionized", "shock", "uncommon", "Projectile speed also grants shock chance and shock damage."],
  ["thunderhead", "Thunderhead", "shock", "epic", "Shocked, frozen, or stunned deaths fire lightning jumps.", ["overcharge"]],
  ["conductor", "Conductor", "shock", "rare", "Orbiting, returning, and split projectiles shock and chain harder.", ["ionized"]],
  ["stormcall", "Stormcall", "shock", "epic", "Every 18 Shock applications calls a lightning strike.", ["thunderhead", "capacitor"]],
  ["venom_tip", "Venom Tip", "poison", "common", "Hits can Poison."],
  ["neurotoxin", "Neurotoxin", "poison", "uncommon", "Poison slows enemies and can crit.", ["venom_tip"]],
  ["rotheart", "Rotheart", "poison", "rare", "Poisoned low-health enemies take much more damage.", ["neurotoxin"]],
  ["hemorrhage", "Hemorrhage", "bleed", "uncommon", "Critical hits can apply Bleed."],
  ["blood_scent", "Blood Scent", "bleed", "uncommon", "Move faster and hit harder near bleeding enemies.", ["hemorrhage"]],
  ["hex_mark", "Hex Mark", "curse", "common", "Every fifth hit on the same target applies Curse."],
  ["malediction", "Malediction", "curse", "rare", "Curse cap and damage taken increase.", ["hex_mark"]],
  ["corrosion", "Corrosion", "poison", "rare", "Poison reduces armour over time.", ["neurotoxin"]],
  ["wisp_egg", "Wisp Egg", "summon", "common", "Summon 1 Wisp that fires bolts."],
  ["hound_whistle", "Hound Whistle", "summon", "common", "Summon 1 Hound that bites nearby enemies."],
  ["bone_turret", "Bone Turret", "summon", "uncommon", "On reload, deploy a temporary turret."],
  ["mender_drone", "Mender Drone", "summon", "rare", "Orbiting drone restores health or shield."],
  ["broodmother", "Broodmother", "summon", "uncommon", "Kills can spawn explosive Mites."],
  ["familiar_training", "Familiar Training", "summon", "common", "Summons gain damage and attack speed; faster attacks also accelerate their orbit."],
  ["soul_shepherd", "Soul Shepherd", "summon", "rare", "Elite and cursed kills drop Souls; Souls spawn Wisps.", ["wisp_egg", "familiar_training"]],
  ["pack_tactics", "Pack Tactics", "summon", "rare", "Player gains damage per active summon.", ["familiar_training"]],
  ["sacrificial_rite", "Sacrificial Rite", "summon", "epic", "Summon death explodes and applies your best status.", ["pack_tactics", "broodmother"]],
  ["twin_spawn", "Twin Spawn", "summon", "rare", "The first summon created by a source duplicates.", ["familiar_training"]],
  ["leash_breaker", "Leash Breaker", "summon", "uncommon", "Summons roam farther and retarget faster."],
  ["rally_signal", "Rally Signal", "summon", "rare", "Active ability commands summons to dash and enrage.", ["leash_breaker"]],
  ["vampiric_shell", "Vampiric Shell", "sustain", "rare", "Lifesteal direct and status damage."],
  ["bulwark", "Bulwark", "defence", "common", "+2 armour, -8% move speed."],
  ["phase_boots", "Phase Boots", "utility", "uncommon", "Dash cooldown and invulnerability improve."],
  ["greed", "Greed", "economy", "common", "Experience gems and elite Soul value increase."],
  ["magnetism", "Magnetism", "utility", "common", "Pickup radius and pull strength increase."],
  ["scholars_habit", "Scholar's Habit", "utility", "uncommon", "Gain rerolls and improve high-synergy drafting."],
  ["scavenger", "Scavenger", "economy", "rare", "Every 10 destroyed enemies drop ammo or shield.", ["greed"]],
  ["grit", "Grit", "defence", "epic", "Survive one lethal hit per run.", ["bulwark", "ward_seal"]],
  ["afterimage", "Afterimage", "defence", "rare", "Dashing leaves a taunting clone that explodes.", ["phase_boots"]],
  ["battle_meditation", "Battle Meditation", "utility", "uncommon", "Standing still grants reload speed and accuracy."],
  ["soul_furnace", "Soul Furnace", "economy", "rare", "Souls grant temporary all-damage stacks.", ["scavenger", "magnetism"]],
  ["ward_seal", "Ward Seal", "defence", "uncommon", "Periodically gain shield."],
  ["law_of_echoes", "Law of Echoes", "law", "law", "Every sixth projectile creates an Echo at 40% damage."],
  ["law_of_orbit", "Law of Orbit", "law", "law", "Projectiles expiring near the player orbit briefly."],
  ["law_of_split_blood", "Law of Split Blood", "law", "law", "On death, enemies release blood motes from stored Bleed."],
  ["law_of_gravity", "Law of Gravity", "law", "law", "Slow projectiles pull enemies during the final part of their life."],
  ["law_of_sacrifice", "Law of Sacrifice", "law", "law", "Player damage rises after summon deaths."],
  ["thunder_magazine", "Thunder Magazine", "fusion", "fusion", "Reload fires 5 lightning bolts for 20 damage and applies Shock.", ["fast_hands", "fresh_clip", "chain_spark"]],
  ["solar_frostbite", "Solar Frostbite", "fusion", "fusion", "Burning frozen enemies shatter for AoE and spread Burn + Chill.", ["firestarter", "brittle", "cold_snap"]],
  ["blood_economy", "Blood Economy", "fusion", "fusion", "Overheal converts to ammo; Bleed kills grant shield.", ["hemorrhage", "vampiric_shell", "last_straw"]],
  ["gem_singularity", "Gem Singularity", "fusion", "fusion", "Gems orbit before pickup, then detonate for gem-scaled damage.", ["greed", "magnetism", "scholars_habit"]],
  ["black_hole_buckshot", "Black Hole Buckshot", "fusion", "fusion", "Centre pellets create a short vortex with heavy pull.", ["buckshot", "collateral", "law_of_gravity"]],
  ["recursive_gun", "Recursive Gun", "fusion", "fusion", "Echoed or bounced projectiles can spawn child shots, max depth 2.", ["twin_feed", "rebound", "law_of_echoes"]],
  ["hive_engine", "Hive Engine", "fusion", "fusion", "New summons fire a mini copy of your weapon and gain haste.", ["wisp_egg", "twin_spawn", "rally_signal"]]
] satisfies RawUpgradeDef[]).map(([id, name, category, rarity, description, requires]) => ({
  id,
  name,
  category,
  rarity,
  description,
  requires,
  fusion: rarity === "fusion",
  law: rarity === "law"
}));

// The legacy table remains temporarily as a migration reference for effect
// parity, but only the structured catalogue below is exposed to the game.
void legacyRawUpgradeDefs;

const rawUpgradeDefs: Omit<UpgradeDef, "apply">[] = upgradeCatalogue.map((upgrade) => ({
  ...upgrade,
  category: upgrade.tree,
  fusion: upgrade.tier === "fusion",
  law: false
}));

export type SkillTreeNode = {
  id: UpgradeId;
  name: string;
  category: string;
  rarity: NonNullable<UpgradeDef["rarity"]>;
  description: string;
  requires: UpgradeId[];
  fusion: boolean;
  law: boolean;
  tree: UpgradeTreeId | "fusion";
  tier: UpgradeTier;
  tags: string[];
};

export type SkillTreeCategory = {
  name: string;
  nodes: SkillTreeNode[];
};

export const getSkillTree = (): SkillTreeCategory[] => {
  const groups = [...upgradeTrees, { id: "fusion" as const, nodes: upgradeCatalogue.filter((upgrade) => upgrade.tree === "fusion") }];
  return groups.map((group) => ({
    name: group.id,
    nodes: group.nodes.map((def) => ({
      id: def.id,
      name: def.name,
      category: def.tree,
      rarity: def.rarity,
      description: def.description,
      requires: def.requires,
      fusion: def.tier === "fusion",
      law: false,
      tree: def.tree,
      tier: def.tier,
      tags: def.tags
    }))
  }));
};

export const isUpgradeUnlocked = (game: Game, upgrade: { requires: UpgradeId[] }): boolean => {
  return upgrade.requires.length === 0 || upgrade.requires.every((id) => has(game, id));
};

export type AcquiredUpgrade = {
  id: UpgradeId;
  name: string;
  category: string;
  rarity: NonNullable<UpgradeDef["rarity"]>;
  description: string;
  requires: UpgradeId[];
  fusion: boolean;
  law: boolean;
};

export const getAcquiredUpgrades = (game: Game): AcquiredUpgrade[] => {
  const result: AcquiredUpgrade[] = [];
  for (const def of rawUpgradeDefs) {
    if (has(game, def.id)) {
      result.push({
        id: def.id,
        name: def.name,
        category: def.category!,
        rarity: def.rarity!,
        description: def.description,
        requires: def.requires ?? [],
        fusion: !!def.fusion,
        law: !!def.law
      });
    }
  }
  return result;
};

const upgradeDefs: UpgradeDef[] = rawUpgradeDefs.map((upgrade) => ({
  ...upgrade,
  apply: (game) => applyUpgrade(game, upgrade.id)
}));

export const createGame = (loadout: LoadoutConfig = DEFAULT_LOADOUT): Game => {
  const game: Game = {
    screen: { w: 390, h: 780 },
    player: {
      x: 0,
      y: 0,
      r: 13,
      characterId: loadout.characterId,
      weaponId: loadout.weaponId,
      hp: 100,
      maxHp: 100,
      shield: 0,
      speed: 188,
      fireRate: 1,
      damage: 14,
      crit: 0.08,
      critDamage: 2.2,
      armour: 0,
      pickupRadius: 82,
      activeCooldown: 0,
      activeTimer: 0,
      weaponSpecial: loadout.weaponId,
      cooldown: 0,
      reload: 0,
      reloadDuration: 0,
      shots: 0,
      magazine: 8,
      pellets: 1,
      spread: 0.08,
      bulletSpeed: 410,
      bulletSize: 5,
      bulletLife: 1.25,
      bulletPierce: 0,
      reloadSpeed: 1,
      summonDamage: 1,
      lightningDamage: 1,
      fireDamage: 1,
      frostDamage: 1,
      poisonDamage: 1,
      bleedDamage: 1,
      curseDamage: 1,
      dashCooldown: 0,
      invuln: 22.5,
      souls: 0,
      orbitals: []
    },
    enemies: [],
    bullets: [],
    enemyProjectiles: [],
    gems: [],
    particles: [],
    upgrades: {},
    time: 0,
    spawnTimer: 2.4,
    level: 1,
    xp: 0,
    nextXp: 12,
    kills: 0,
    shotCounter: 0,
    idCounter: 1,
    gameOver: false,
    runState: "playing",
    objective: {
      name: "Survive Until Dawn",
      duration: 20 * 60,
      finalWaveDuration: 60
    },
    director: {
      phaseName: directorPhases[0].name,
      threat: directorPhases[0].threat,
      nextEliteAt: 95,
      nextBossAt: 5 * 60,
      hordeTimer: 26,
      spawnedBosses: []
    },
    draft: {
      rerolls: 1,
      banishes: 1,
      banished: [],
      seen: []
    },
    summary: {
      result: "playing",
      title: "Run in progress",
      time: "00:00",
      kills: 0,
      level: 1,
      upgrades: 0,
      characterId: loadout.characterId,
      weaponId: loadout.weaponId
    },
    activeLatch: false,
    screenShake: 0,
    combo: { count: 0, timer: 0, best: 0 },
    ui: {
      time: "00:00",
      level: "1",
      kills: "0",
      hpPct: 100,
      xpPct: 0,
      activePct: 100,
      activeReady: true,
      objective: "Survive Until Dawn",
      objectivePct: 0,
      directorPhase: directorPhases[0].name,
      threat: directorPhases[0].threat,
      rerolls: 1,
      banishes: 1,
      combo: 0,
      runState: "playing",
      gameOver: false
    }
  };

  applyWeapon(game, loadout.weaponId);
  applyCharacter(game, loadout.characterId);
  for (let i = 0; i < 8; i += 1) spawnEnemy(game, true);
  updateUi(game);
  return game;
};

export const getUpgradeChoices = (game: Game): Choice[] => {
  const available = upgradeDefs.filter((upgrade) => {
    if (game.draft.banished.includes(upgrade.id)) return false;
    if ((upgrade.fusion || upgrade.law) && has(game, upgrade.id)) return false;
    if (upgrade.law && game.level < 6) return false;
    if (upgrade.requires && !upgrade.requires.every((id) => has(game, id))) return false;
    return true;
  });

  const fusions = available.filter((upgrade) => upgrade.fusion);
  const basics = available.filter((upgrade) => !upgrade.fusion && !upgrade.law);
  const guaranteed = fusions.slice(0, 1);
  const weighted = pickWeightedChoices(game, basics, 3 - guaranteed.length);
  const choices = shuffle([...guaranteed, ...weighted]).slice(0, 3);

  for (const choice of choices) {
    if (!game.draft.seen.includes(choice.id)) game.draft.seen.push(choice.id);
  }

  return choices;
};

export const rerollUpgradeChoices = (game: Game): Choice[] => {
  if (game.draft.rerolls > 0) {
    game.draft.rerolls -= 1;
    text(game, game.player.x, game.player.y - 48, "reroll", "#93c5fd");
  }
  return getUpgradeChoices(game);
};

export const banishUpgrade = (game: Game, id: UpgradeId): Choice[] => {
  if (game.draft.banishes > 0 && !game.draft.banished.includes(id)) {
    game.draft.banishes -= 1;
    game.draft.banished.push(id);
    text(game, game.player.x, game.player.y - 48, "banished", "#fb7185");
  }
  return getUpgradeChoices(game);
};

const rarityWeight = (rarity: UpgradeDef["rarity"] = "common") => {
  if (rarity === "common") return 8;
  if (rarity === "uncommon") return 5;
  if (rarity === "rare") return 2.8;
  if (rarity === "epic") return 1.4;
  if (rarity === "legendary") return 0.7;
  return 1;
};

const synergyWeight = (game: Game, upgrade: UpgradeDef) => {
  let weight = rarityWeight(upgrade.rarity);
  const strengths = characterOptions.find((character) => character.id === game.player.characterId)?.strengths.join(" ").toLowerCase() || "";
  const textValue = `${upgrade.category || ""} ${upgrade.name} ${upgrade.description}`.toLowerCase();
  for (const token of strengths.split(/\s+|\//).filter(Boolean)) {
    if (token.length > 3 && textValue.includes(token)) weight *= 1.25;
  }
  if (upgrade.requires?.some((id) => has(game, id))) weight *= 1.6;
  const ownedInTree = upgrade.tree && upgrade.tree !== "fusion"
    ? rawUpgradeDefs.some((candidate) => candidate.tree === upgrade.tree && has(game, candidate.id))
    : false;
  if (game.level <= 3 && upgrade.tier === "root") weight *= 2.4;
  if (game.level <= 3 && upgrade.tier === "capstone") weight *= 0.2;
  if (ownedInTree && upgrade.tier === "branch") weight *= 1.75;
  if (ownedInTree && upgrade.tier === "capstone") weight *= 2.1;
  if (game.draft.seen.includes(upgrade.id)) weight *= 0.65;
  return weight;
};

const pickWeightedChoices = (game: Game, pool: UpgradeDef[], amount: number): UpgradeDef[] => {
  const selected: UpgradeDef[] = [];
  const remaining = [...pool];
  while (selected.length < amount && remaining.length) {
    const total = remaining.reduce((sum, upgrade) => sum + synergyWeight(game, upgrade), 0);
    let roll = Math.random() * total;
    let index = 0;
    for (; index < remaining.length; index += 1) {
      roll -= synergyWeight(game, remaining[index]);
      if (roll <= 0) break;
    }
    const [choice] = remaining.splice(Math.min(index, remaining.length - 1), 1);
    selected.push(choice);
  }
  return selected;
};

function applyUpgrade(game: Game, id: UpgradeId) {
  const player = game.player;
  addUpgrade(game, id);

  switch (id) {
    case "split_chamber":
      player.bulletPierce += 1;
      break;
    case "serrated_lead":
      player.bleedDamage *= 1.22;
      player.bulletPierce += 1;
      break;
    case "powder_wake":
      player.bulletLife *= 1.15;
      player.damage *= 1.08;
      break;
    case "mirror_chamber":
      player.fireRate *= 1.06;
      break;
    case "polished_bore":
      player.crit += 0.1;
      player.bulletSpeed *= 1.12;
      break;
    case "phantom_copy":
      player.damage *= 1.08;
      break;
    case "hall_of_mirrors":
      player.critDamage *= 1.18;
      break;
    case "static_prayer":
      player.lightningDamage *= 1.16;
      break;
    case "quick_hands":
      player.reloadSpeed *= 1.22;
      break;
    case "empty_bell":
      player.reloadSpeed *= 1.08;
      player.damage *= 1.06;
      break;
    case "frostfire_rounds":
      player.fireDamage *= 1.12;
      player.frostDamage *= 1.12;
      break;
    case "thermal_shock":
      player.fireDamage *= 1.18;
      break;
    case "brittle_core":
      player.frostDamage *= 1.16;
      player.critDamage *= 1.12;
      break;
    case "blood_tax":
      player.bleedDamage *= 1.18;
      break;
    case "clot_armour":
      player.shield = Math.min(70, player.shield + 18);
      break;
    case "red_refund":
      player.maxHp += 8;
      player.hp = Math.min(player.maxHp, player.hp + 12);
      break;
    case "grave_interest":
      player.souls += 1;
      break;
    case "soul_blade":
      spawnOrbital(game, 12 * player.summonDamage, 20, "blade");
      break;
    case "tithe":
      player.souls += 2;
      player.summonDamage *= 1.1;
      break;
    case "undertaker_engine":
      player.summonDamage *= 1.24;
      break;
    case "crown_of_teeth":
      spawnOrbital(game, 14 * player.summonDamage, 24, "blade");
      break;
    case "wider_crown":
      player.summonDamage *= 1.2;
      for (const orbital of player.orbitals) orbital.distance *= 1.16;
      break;
    case "hungry_crown":
    case "storm_crown":
      player.summonDamage *= 1.18;
      break;
    case "gem_bomb":
      player.pickupRadius *= 1.15;
      break;
    case "greed_magnet":
      player.pickupRadius *= 1.45;
      break;
    case "compound_interest":
      player.pickupRadius *= 1.1;
      break;
    case "parasite_rounds":
      player.summonDamage *= 1.12;
      spawnOrbital(game, 10 * player.summonDamage, 16, "mite");
      break;
    case "larval_split":
    case "host_jump":
      player.summonDamage *= 1.2;
      break;
    case "brood_cascade":
      player.summonDamage *= 1.25;
      spawnOrbital(game, 14 * player.summonDamage, 20, "mite");
      break;
    case "void_mark":
      player.curseDamage *= 1.18;
      break;
    case "event_horizon":
      player.damage *= 1.1;
      player.curseDamage *= 1.12;
      break;
    case "deep_chamber":
      player.bulletLife *= 1.25;
      player.bulletSize *= 1.15;
      player.bulletSpeed *= 0.9;
      break;
    case "recursive_arsenal":
      player.pellets += 1;
      player.bulletPierce += 1;
      break;
    case "echoing_thunder":
    case "tempest_crown":
      player.lightningDamage *= 1.3;
      player.summonDamage *= 1.12;
      break;
    case "frozen_brood":
    case "elemental_undertaker":
    case "shattered_horizon":
      player.fireDamage *= 1.2;
      player.frostDamage *= 1.2;
      player.summonDamage *= 1.12;
      break;
    case "sanguine_tithe":
      player.maxHp += 10;
      player.souls += 3;
      break;
    case "hungry_singularity":
      player.pickupRadius *= 1.25;
      player.curseDamage *= 1.22;
      break;
    case "crimson_brood":
      player.bleedDamage *= 1.24;
      player.summonDamage *= 1.24;
      break;
    case "phantom_crown":
      player.summonDamage *= 1.3;
      player.fireRate *= 1.08;
      break;
    case "heavy_caliber":
      player.damage *= 1.22;
      player.fireRate *= 0.9;
      break;
    case "long_barrel":
      player.bulletSpeed *= 1.22;
      player.bulletLife *= 1.18;
      break;
    case "rifled_jacket":
      player.bulletPierce += 1;
      break;
    case "buckshot":
      player.pellets += player.pellets > 1 ? 2 : 2;
      player.spread = Math.max(player.spread, 0.28);
      player.bulletLife *= 0.88;
      break;
    case "soft_lead":
      player.bulletSize *= 1.14;
      player.bulletSpeed *= 0.88;
      break;
    case "twin_feed":
      player.pellets += 1;
      player.damage *= 0.82;
      player.spread = Math.max(player.spread, 0.18);
      break;
    case "pinpoint":
      player.spread *= 0.8;
      player.crit += 0.05;
      break;
    case "serrated_rounds":
      player.damage *= 1.1;
      break;
    case "rebound":
      break;
    case "shadow_round":
      player.bulletSpeed *= 1.08;
      player.bulletPierce += 1;
      break;
    case "bracer_core":
      player.bulletSize *= 1.18;
      break;
    case "momentum_shot":
      player.bulletLife *= 1.1;
      break;
    case "fin_stabilizer":
      player.bulletSpeed *= 1.14;
      player.fireRate *= 1.1;
      player.spread *= 0.85;
      break;
    case "armour_breaker":
    case "giant_killer":
      player.damage *= 1.12;
      break;
    case "fast_hands":
      player.reloadSpeed *= 1.18;
      break;
    case "extended_magazine":
      player.magazine = Math.max(player.magazine + 1, Math.round(player.magazine * 1.35));
      player.reloadSpeed *= 0.9;
      break;
    case "fresh_clip":
      player.damage *= 1.08;
      break;
    case "last_straw":
      player.crit += 0.04;
      break;
    case "quick_rack":
      player.reloadSpeed *= 1.08;
      player.speed *= 1.06;
      break;
    case "chamber_trick":
      player.damage *= 1.08;
      player.reloadSpeed *= 1.05;
      break;
    case "tactical_reload":
      player.reloadSpeed *= 1.12;
      player.speed *= 1.05;
      break;
    case "backpressure":
      player.fireRate *= 1.12;
      break;
    case "ammo_printer":
      player.magazine += 1;
      break;
    case "hair_trigger":
      player.fireRate *= 1.18;
      player.spread *= 1.08;
      break;
    case "deadeye":
      player.crit += 0.1;
      player.bulletSpeed *= 1.08;
      break;
    case "glass_eye":
      player.critDamage *= 1.3;
      player.maxHp *= 0.88;
      player.hp = Math.min(player.hp, player.maxHp);
      break;
    case "hollow_point":
      player.crit += 0.04;
      break;
    case "headhunter":
      player.crit += 0.08;
      player.critDamage *= 1.12;
      break;
    case "ember_touch":
    case "firestarter":
    case "lingering_flame":
    case "napalm":
    case "pyromaniac":
    case "thermal_lance":
    case "ash_wake":
      player.fireDamage *= 1.1;
      break;
    case "cauterize":
      player.fireDamage *= 1.16;
      player.shield = Math.min(70, player.shield + 10);
      break;
    case "cold_touch":
    case "deep_freeze":
    case "permafrost":
    case "brittle":
    case "ice_bloom":
    case "cold_snap":
      player.frostDamage *= 1.1;
      break;
    case "rime_ward":
      player.frostDamage *= 1.12;
      player.shield = Math.min(70, player.shield + 12);
      break;
    case "snowdrift":
      player.frostDamage *= 1.08;
      player.speed *= 0.98;
      break;
    case "static_touch":
    case "chain_spark":
    case "overcharge":
    case "capacitor":
    case "ionized":
    case "thunderhead":
    case "conductor":
    case "stormcall":
      player.lightningDamage *= 1.1;
      break;
    case "venom_tip":
    case "neurotoxin":
    case "rotheart":
    case "corrosion":
      player.poisonDamage *= 1.1;
      break;
    case "hemorrhage":
    case "blood_scent":
      player.bleedDamage *= 1.1;
      break;
    case "hex_mark":
    case "malediction":
      player.curseDamage *= 1.1;
      break;
    case "wisp_egg":
      spawnOrbital(game, 10 * player.summonDamage, 18, "wisp");
      break;
    case "hound_whistle":
      spawnOrbital(game, 14 * player.summonDamage, 18, "hound");
      break;
    case "bone_turret":
      player.reloadSpeed *= 1.06;
      spawnOrbital(game, 8 * player.summonDamage, 14, "turret");
      break;
    case "mender_drone":
      player.shield = Math.min(70, player.shield + 18);
      spawnOrbital(game, 5 * player.summonDamage, 24, "drone");
      break;
    case "broodmother":
    case "twin_spawn":
    case "leash_breaker":
    case "rally_signal":
      player.summonDamage *= 1.18;
      break;
    case "familiar_training":
      player.summonDamage *= 1.18;
      for (const orbital of player.orbitals) orbital.attackSpeed = (orbital.attackSpeed ?? 1) * 1.18;
      break;
    case "pack_tactics":
      player.summonDamage *= 1.12;
      player.damage *= 1.08;
      break;
    case "sacrificial_rite":
      player.summonDamage *= 1.22;
      player.fireDamage *= 1.06;
      player.poisonDamage *= 1.06;
      break;
    case "soul_shepherd":
      player.souls += 1;
      spawnOrbital(game, 11 * player.summonDamage, 18, "blade");
      break;
    case "vampiric_shell":
      player.maxHp += 8;
      player.hp = Math.min(player.maxHp, player.hp + 8);
      break;
    case "bulwark":
      player.armour += 2;
      player.speed *= 0.92;
      break;
    case "phase_boots":
      player.speed *= 1.1;
      break;
    case "greed":
      player.pickupRadius *= 1.08;
      break;
    case "magnetism":
      player.pickupRadius *= 1.35;
      break;
    case "scholars_habit":
      player.crit += 0.03;
      player.reloadSpeed *= 1.04;
      break;
    case "scavenger":
      player.magazine += 2;
      player.shield = Math.min(70, player.shield + 8);
      break;
    case "grit":
      player.maxHp += 16;
      player.hp += 16;
      break;
    case "afterimage":
      player.speed *= 1.08;
      break;
    case "battle_meditation":
      player.reloadSpeed *= 1.12;
      player.spread *= 0.9;
      break;
    case "soul_furnace":
      player.damage *= 1.08;
      player.souls += 2;
      break;
    case "ward_seal":
      player.shield = Math.min(70, player.shield + 18);
      break;
    case "law_of_echoes":
    case "law_of_orbit":
    case "law_of_split_blood":
    case "law_of_gravity":
    case "law_of_sacrifice":
      player.damage *= 1.06;
      break;
    case "thunder_magazine":
      player.lightningDamage *= 1.24;
      player.reloadSpeed *= 1.08;
      break;
    case "solar_frostbite":
      player.fireDamage *= 1.18;
      player.frostDamage *= 1.18;
      break;
    case "blood_economy":
      player.bleedDamage *= 1.16;
      player.maxHp += 8;
      break;
    case "gem_singularity":
      player.pickupRadius *= 1.18;
      break;
    case "black_hole_buckshot":
      player.pellets += 2;
      player.spread = Math.max(player.spread, 0.36);
      break;
    case "recursive_gun":
      player.pellets += 1;
      player.bulletPierce += 1;
      break;
    case "hive_engine":
      player.summonDamage *= 1.28;
      spawnOrbital(game, 16 * player.summonDamage, 22, "wasp");
      break;
  }
}

const applyCharacter = (game: Game, characterId: CharacterId) => {
  const player = game.player;
  if (characterId === "saint") {
    player.magazine = Math.max(1, Math.round(player.magazine * 0.85));
    player.reloadSpeed *= 1.15;
    player.crit += 0.03;
    player.activeCooldown = 14;
    addUpgrade(game, "static_prayer");
  }
  if (characterId === "ilya") {
    player.damage *= 0.9;
    player.lightningDamage *= 1.18;
    player.speed *= 1.06;
    player.activeCooldown = 12;
    addUpgrade(game, "static_prayer");
  }
  if (characterId === "nox") {
    player.maxHp = Math.max(55, player.maxHp - 20);
    player.hp = Math.min(player.hp, player.maxHp);
    player.summonDamage *= 1.12;
    player.poisonDamage *= 1.14;
    player.activeCooldown = 16;
    addUpgrade(game, "parasite_rounds");
  }
  if (characterId === "mira") {
    player.reloadSpeed *= 0.88;
    player.crit += 0.04;
    player.activeCooldown = 20;
    addUpgrade(game, "mirror_chamber");
  }
  if (characterId === "scarlett") {
    player.bulletSpeed *= 0.9;
    player.fireDamage *= 1.2;
    player.activeCooldown = 18;
    addUpgrade(game, "frostfire_rounds");
  }
  if (characterId === "corvus") {
    player.crit += 0.08;
    player.critDamage *= 1.1;
    player.curseDamage *= 1.14;
    player.activeCooldown = 16;
    addUpgrade(game, "void_mark");
  }
  if (characterId === "kaden") {
    player.fireRate *= 0.85;
    player.armour += 2;
    player.maxHp += 18;
    player.hp += 18;
    player.activeCooldown = 22;
    addUpgrade(game, "crown_of_teeth");
  }
  if (characterId === "lyra") {
    player.damage *= 0.88;
    player.summonDamage *= 1.25;
    player.activeCooldown = 18;
    addUpgrade(game, "parasite_rounds");
    spawnOrbital(game, 12 * player.summonDamage, 18, "hound");
  }
};

const applyWeapon = (game: Game, weaponId: WeaponId) => {
  const player = game.player;
  player.weaponSpecial = weaponId;
  if (weaponId === "revolver") {
    player.damage = 34;
    player.fireRate = 3;
    player.magazine = 6;
    player.reloadSpeed = 1;
    player.bulletSpeed = 520;
    player.bulletLife = 2.7;
    player.spread = 0.02;
    player.pellets = 1;
    player.bulletPierce = 0;
    player.crit += 0.15;
  }
  if (weaponId === "shotgun") {
    player.damage = 10;
    player.fireRate = 1.2;
    player.magazine = 2;
    player.reloadSpeed = 0.74;
    player.bulletSpeed = 430;
    player.bulletLife = 1.1;
    player.spread = 0.42;
    player.pellets = 7;
    player.bulletPierce = 0;
  }
  if (weaponId === "needle_smg") {
    player.damage = 9;
    player.fireRate = 12;
    player.magazine = 28;
    player.reloadSpeed = 0.72;
    player.bulletSpeed = 500;
    player.bulletLife = 1.9;
    player.spread = 0.16;
    player.bulletSize = 4;
    player.pellets = 1;
    player.bulletPierce = 0;
    player.crit = Math.max(0.02, player.crit - 0.03);
  }
  if (weaponId === "crossbow") {
    player.damage = 62;
    player.fireRate = 1.1;
    player.magazine = 1;
    player.reloadSpeed = 1.05;
    player.bulletSpeed = 600;
    player.bulletLife = 2.6;
    player.spread = 0;
    player.pellets = 1;
    player.bulletPierce = 2;
    player.bulletSize = 6;
  }
  if (weaponId === "flame_cannon") {
    player.damage = 7;
    player.fireRate = 14;
    player.magazine = 60;
    player.reloadSpeed = 0.5;
    player.bulletSpeed = 300;
    player.bulletLife = 0.75;
    player.spread = 0.28;
    player.pellets = 3;
    player.bulletPierce = 99;
    player.bulletSize = 5;
  }
  if (weaponId === "arc_rifle") {
    player.damage = 26;
    player.fireRate = 2.2;
    player.magazine = 8;
    player.reloadSpeed = 0.78;
    player.bulletSpeed = 700;
    player.bulletLife = 1.7;
    player.spread = 0.02;
    player.pellets = 1;
    player.bulletPierce = 1;
    player.lightningDamage *= 1.1;
  }
  if (weaponId === "shard_launcher") {
    player.damage = 70;
    player.fireRate = 0.8;
    player.magazine = 4;
    player.reloadSpeed = 0.56;
    player.bulletSpeed = 360;
    player.bulletLife = 2.3;
    player.spread = 0.03;
    player.pellets = 1;
    player.bulletPierce = 0;
    player.bulletSize = 8;
  }
  if (weaponId === "rail_lance") {
    player.damage = 120;
    player.fireRate = 0.65;
    player.magazine = 3;
    player.reloadSpeed = 0.62;
    player.bulletSpeed = 900;
    player.bulletLife = 2.4;
    player.spread = 0;
    player.pellets = 1;
    player.bulletPierce = 99;
    player.bulletSize = 4;
  }
  if (weaponId === "chakram") {
    player.damage = 28;
    player.fireRate = 1.8;
    player.magazine = 3;
    player.reloadSpeed = 0.66;
    player.bulletSpeed = 420;
    player.bulletLife = 1.6;
    player.spread = 0.12;
    player.pellets = 1;
    player.bulletPierce = 4;
    player.bulletSize = 7;
  }
  if (weaponId === "hive_staff") {
    player.damage = 18;
    player.fireRate = 1.6;
    player.magazine = 5;
    player.reloadSpeed = 0.84;
    player.bulletSpeed = 450;
    player.bulletLife = 2.2;
    player.spread = 0.05;
    player.pellets = 1;
    player.bulletPierce = 0;
    player.poisonDamage *= 1.08;
  }
  if (weaponId === "prism_launcher") {
    player.damage = 24;
    player.fireRate = 2;
    player.magazine = 9;
    player.reloadSpeed = 0.69;
    player.bulletSpeed = 420;
    player.bulletLife = 1.55;
    player.spread = 0.03;
    player.pellets = 1;
    player.bulletPierce = 0;
    player.bulletSize = 6;
  }
  if (weaponId === "aether_spear") {
    player.damage = 24;
    player.fireRate = 2.4;
    player.magazine = 6;
    player.reloadSpeed = 0.74;
    player.bulletSpeed = 360;
    player.bulletLife = 1.8;
    player.spread = 0.02;
    player.pellets = 1;
    player.bulletPierce = 1;
    player.bulletSize = 6;
  }
};

const updateDirector = (game: Game, dt: number): DirectorPhase => {
  const phase = getDirectorPhase(game.time);
  const levelPressure = Math.min(0.55, Math.max(0, game.level - 1) * 0.035);
  const killPressure = Math.min(0.5, game.kills / 450);
  const nextThreat = phase.threat + levelPressure + killPressure;

  if (game.director.phaseName !== phase.name) {
    text(game, game.player.x, game.player.y - 62, phase.name, phase.name === "Final Dawn" ? "#fde68a" : "#93c5fd");
    burst(game, game.player.x, game.player.y, phase.name === "Final Dawn" ? "#fde68a" : "#93c5fd", 26, 4);
  }

  game.director.phaseName = phase.name;
  game.director.threat = nextThreat;
  game.director.hordeTimer -= dt;

  if (game.time >= game.director.nextEliteAt) {
    spawnEnemy(game, true, "elite");
    game.director.nextEliteAt += Math.max(18, phase.eliteEvery - Math.min(18, game.level));
    text(game, game.player.x, game.player.y - 56, "elite hunt", "#fb923c");
  }

  const bossMarks = [5 * 60, 10 * 60, 15 * 60, game.objective.duration - game.objective.finalWaveDuration];
  for (const mark of bossMarks) {
    if (game.time >= mark && !game.director.spawnedBosses.includes(mark)) {
      game.director.spawnedBosses.push(mark);
      spawnEnemy(game, true, "boss");
      text(game, game.player.x, game.player.y - 66, mark >= game.objective.duration - game.objective.finalWaveDuration ? "The Dawn Bell" : "mini-boss", "#fde68a");
      burst(game, game.player.x, game.player.y, "#fde68a", 32, 5);
      addShake(game, 8);
    }
  }

  if (game.director.hordeTimer <= 0) {
    const hordeSize = Math.min(14, phase.packSize + Math.floor(nextThreat * 2));
    for (let i = 0; i < hordeSize; i += 1) spawnEnemy(game, false, pickEnemyKind(game, phase, i));
    game.director.hordeTimer = Math.max(11, 28 - nextThreat * 3.2);
    text(game, game.player.x, game.player.y - 52, "horde", "#fb7185");
  }

  return phase;
};

const pickEnemyKind = (game: Game, phase: DirectorPhase, index: number): EnemyKind => {
  if (phase.name === "Final Dawn" && index === 0) return "charger";
  const slot = Math.abs(Math.floor(game.time * 10) + game.kills + game.enemies.length + index) % phase.mix.length;
  return phase.mix[slot];
};

export const stepGame = (game: Game, input: InputState, dt: number): boolean => {
  const player = game.player;

  if (game.runState !== "playing") {
    updateParticles(game, dt);
    updateUi(game);
    return false;
  }

  game.time += dt;
  game.screenShake = Math.max(0, game.screenShake - dt * 30);
  if (game.combo.timer > 0) {
    game.combo.timer -= dt;
    if (game.combo.timer <= 0) game.combo.count = 0;
  }
  player.cooldown -= dt;
  player.reload = Math.max(0, player.reload - dt);
  if (player.reload <= 0) player.reloadDuration = 0;
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  player.activeTimer = Math.max(0, player.activeTimer - dt);
  game.spawnTimer -= dt;

  const moveLen = len(input.moveX, input.moveY);
  const moving = Math.abs(input.moveX) + Math.abs(input.moveY) > 0.03;
  if (moving) {
    player.x += (input.moveX / moveLen) * player.speed * dt;
    player.y += (input.moveY / moveLen) * player.speed * dt;
  }

  const activePressed = input.active && !game.activeLatch;
  if (activePressed && player.activeTimer <= 0) triggerActiveAbility(game, input);
  game.activeLatch = input.active;

  const phase = updateDirector(game, dt);

  if (game.spawnTimer <= 0) {
    const amount = phase.packSize + Math.floor(game.director.threat * 0.65);
    for (let i = 0; i < amount; i += 1) spawnEnemy(game, false, pickEnemyKind(game, phase, i));
    game.spawnTimer = Math.max(0.16, phase.spawnInterval / Math.sqrt(game.director.threat));
  }

  if (input.firing && player.reload <= 0 && player.cooldown <= 0) shoot(game, input);
  updateBullets(game, dt);
  updateEnemyProjectiles(game, dt);
  updateEnemies(game, dt);
  updateGems(game, dt);
  updateOrbitals(game, dt);
  updateParticles(game, dt);

  const leveled = game.xp >= game.nextXp;
  if (leveled) {
    game.xp -= game.nextXp;
    game.nextXp = Math.floor(game.nextXp * 1.22 + 8);
    game.level += 1;
    player.hp = Math.min(player.maxHp, player.hp + 8);
  }

  if (player.hp <= 0) finishRun(game, "defeat");
  else if (game.time >= game.objective.duration) finishRun(game, "victory");

  game.summary = createSummary(game, game.runState);
  updateUi(game);
  return leveled;
};

const triggerActiveAbility = (game: Game, input: InputState) => {
  const player = game.player;
  const aimLen = Math.hypot(input.aimX, input.aimY);
  const moveLen = Math.hypot(input.moveX, input.moveY);
  const angle = aimLen > 0.1 ? Math.atan2(input.aimY, input.aimX) : moveLen > 0.1 ? Math.atan2(input.moveY, input.moveX) : -Math.PI / 2;
  player.activeTimer = Math.max(4, player.activeCooldown || 12);

  if (player.characterId === "saint") {
    player.shots = 0;
    player.reload = 0;
    player.reloadDuration = 0;
    player.shield = Math.min(75, player.shield + 10);
    for (let i = 0; i < 6; i += 1) fireBullet(game, player.x, player.y, angle + (i - 2.5) * 0.28, player.damage * 0.72, "void", { pierce: 1, crit: player.crit + 0.2 });
    burst(game, player.x, player.y, "#fde68a", 18, 4);
    text(game, player.x, player.y - 32, "Covenant Reload", "#fde68a");
    return;
  }

  if (player.characterId === "ilya") {
    const dashDistance = 112;
    player.x += Math.cos(angle) * dashDistance;
    player.y += Math.sin(angle) * dashDistance;
    player.invuln = Math.max(player.invuln, 0.48);
    player.dashCooldown = Math.max(player.dashCooldown, 0.8);
    chainLightning(game, player.x, player.y, 170, 18 * player.lightningDamage);
    burst(game, player.x, player.y, "#72f5ff", 20, 3.5);
    text(game, player.x, player.y - 34, "Stormstep", "#72f5ff");
    return;
  }

  if (player.characterId === "nox") {
    for (let i = 0; i < 5; i += 1) {
      spawnOrbital(game, 9 * player.summonDamage, 8, "mite");
      fireBullet(game, player.x, player.y, angle + (i - 2) * 0.48, 12 * player.poisonDamage, "blood", { pierce: 1, crit: 0.08 });
    }
    burst(game, player.x, player.y, "#86efac", 22, 3.8);
    text(game, player.x, player.y - 34, "Brood Burst", "#86efac");
    return;
  }

  if (player.characterId === "mira") {
    for (let i = 0; i < 8; i += 1) fireBullet(game, player.x + Math.cos(angle + Math.PI / 2) * 16, player.y + Math.sin(angle + Math.PI / 2) * 16, angle + (i - 3.5) * 0.18, player.damage * 0.62, selectShotElement(game), { split: 1, bounces: 1, crit: player.crit + 0.1 });
    burst(game, player.x, player.y, "#c084fc", 20, 4);
    text(game, player.x, player.y - 34, "Mirror Sigil", "#e9d5ff");
    return;
  }

  if (player.characterId === "scarlett") {
    explode(game, player.x, player.y, 120, 24 * player.fireDamage, "#fb923c");
    for (let i = 0; i < 10; i += 1) fireBullet(game, player.x, player.y, i * (TAU / 10), player.damage * 0.52, "fire", { pierce: 1, crit: player.crit });
    text(game, player.x, player.y - 34, "Cinder Rite", "#fb923c");
    return;
  }

  if (player.characterId === "corvus") {
    player.invuln = Math.max(player.invuln, 1.25);
    for (let i = 0; i < 4; i += 1) fireBullet(game, player.x, player.y, angle + (i - 1.5) * 0.08, player.damage * 1.35, "void", { pierce: 4, crit: 1 });
    pullEnemies(game, player.x, player.y, 120, 20);
    text(game, player.x, player.y - 34, "Veil Cut", "#c4b5fd");
    return;
  }

  if (player.characterId === "kaden") {
    player.shield = Math.min(90, player.shield + 24);
    player.invuln = Math.max(player.invuln, 0.7);
    for (const enemy of game.enemies) {
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const d = Math.hypot(dx, dy);
      if (d < 140) {
        enemy.x += (dx / (d || 1)) * 54;
        enemy.y += (dy / (d || 1)) * 54;
        hurtEnemy(game, enemy, 16, "kinetic");
      }
    }
    burst(game, player.x, player.y, "#fed7aa", 24, 4.5);
    text(game, player.x, player.y - 34, "Iron Bastion", "#fed7aa");
    return;
  }

  for (let i = 0; i < 3; i += 1) spawnOrbital(game, 15 * player.summonDamage, 14, "hound");
  for (const orbital of player.orbitals) {
    orbital.damage *= 1.18;
    if (orbital.life !== null) orbital.life += 4;
    orbital.attackSpeed = (orbital.attackSpeed ?? 1) * 1.18;
  }
  burst(game, player.x, player.y, "#f0abfc", 24, 4);
  text(game, player.x, player.y - 34, "Rally Beasts", "#f0abfc");
};

export const drawGame = (
  ctx: CanvasRenderingContext2D,
  game: Game,
  controls: {
    move: { activeId: number; x: number; y: number; knobX: number; knobY: number };
    aim: { activeId: number; x: number; y: number; knobX: number; knobY: number };
    layout?: string;
  }
) => {
  const { w, h } = game.screen;
  const shakeX = game.screenShake > 0 ? (Math.random() - 0.5) * game.screenShake : 0;
  const shakeY = game.screenShake > 0 ? (Math.random() - 0.5) * game.screenShake : 0;
  const camera = {
    x: w / 2 - game.player.x + shakeX,
    y: h / 2 - game.player.y + shakeY
  };
  ctx.clearRect(0, 0, w, h);

  const gradient = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, Math.max(w, h) * 0.78);
  gradient.addColorStop(0, "#171a34");
  gradient.addColorStop(0.62, "#0b0d18");
  gradient.addColorStop(1, "#03040a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  drawProceduralStage(ctx, w, h, game.time, camera);

  ctx.save();
  ctx.translate(camera.x, camera.y);

  for (const gem of game.gems) {
    ctx.save();
    ctx.translate(gem.x, gem.y);
    drawSpriteDefinition(ctx, getSpriteDefinition("pickups", "xp"), game.time + gem.value, 0.7 + gem.value * 0.04);
    ctx.restore();
  }

  for (const bullet of game.bullets) {
    drawBullet(ctx, bullet, game.player.weaponSpecial, game.time);
  }

  for (const shot of game.enemyProjectiles) {
    drawEnemyProjectile(ctx, shot);
  }

  for (const orbital of game.player.orbitals) {
    const x = game.player.x + Math.cos(orbital.angle) * orbital.distance;
    const y = game.player.y + Math.sin(orbital.angle) * orbital.distance;
    drawSummon(ctx, orbital, x, y, game.time, has(game, "conductor"));
  }

  for (const enemy of game.enemies) {
    drawEnemy(ctx, enemy, game.time);
  }

  for (const particle of game.particles) {
    ctx.globalAlpha = clamp(particle.life, 0, 1);
    if (particle.text) {
      ctx.save();
      ctx.font = `${particle.size}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(3, 7, 18, 0.86)";
      ctx.strokeText(particle.text, particle.x, particle.y);
      ctx.fillStyle = particle.color;
      ctx.fillText(particle.text, particle.x, particle.y);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.fillStyle = particle.color;
      ctx.arc(particle.x, particle.y, particle.size, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  const p = game.player;
  const reloadPct = p.reloadDuration > 0 ? clamp(1 - p.reload / p.reloadDuration, 0, 1) : 0;
  const reloading = p.reload > 0;
  ctx.save();
  ctx.translate(p.x, p.y);
  drawCharacter(ctx, p, game.time, reloading);
  if (reloading) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(250, 204, 21, 0.86)";
    ctx.lineWidth = 2;
    ctx.arc(0, 0, p.r + 15 + Math.sin(game.time * 14) * 2, -Math.PI / 2, -Math.PI / 2 + reloadPct * TAU);
    ctx.stroke();
  }
  ctx.restore();

  if (reloading) drawReloadBar(ctx, p.x, p.y - p.r - 24, reloadPct);

  if (p.shield > 0) {
    ctx.beginPath();
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2;
    ctx.arc(p.x, p.y, p.r + 9 + Math.sin(game.time * 8) * 2, 0, TAU);
    ctx.stroke();
  }

  ctx.restore();

  if (controls.layout !== "keyboard-only") {
    const moveLabel = controls.layout === "southpaw" ? "Shoot" : "Move";
    const aimLabel = controls.layout === "southpaw" ? "Move" : "Shoot";
    drawFixedJoystick(ctx, controls.move, moveLabel, "#93c5fd");
    drawFixedJoystick(ctx, controls.aim, aimLabel, "#fb7185");
  }
};

const shoot = (game: Game, input: InputState) => {
  const player = game.player;
  if (player.reload > 0) return;

  if (player.shots >= player.magazine) {
    const reloadTime = Math.max(0.18, 0.72 / player.reloadSpeed);
    player.reload = reloadTime;
    player.reloadDuration = reloadTime;
    player.shots = 0;
    onReload(game);
    return;
  }

  const aimLen = len(input.aimX, input.aimY);
  const angle = Math.atan2(input.aimY / aimLen, input.aimX / aimLen);
  const lowAmmo = player.shots / Math.max(1, player.magazine) > 0.8;
  const freshClip = has(game, "fresh_clip") && player.shots === 0;
  const baseDamage =
    player.damage *
    (freshClip ? 1.35 : 1) *
    (lowAmmo && has(game, "last_straw") ? 1.25 : 1) *
    (has(game, "pack_tactics") ? 1 + Math.min(0.3, player.orbitals.length * 0.1) : 1);
  const element = selectShotElement(game);
  const consumeAmmo = !has(game, "bottomless_habit") || Math.random() > 0.18;

  for (let i = 0; i < player.pellets; i += 1) {
    const pelletOffset = player.pellets === 1 ? rand(-player.spread, player.spread) : (i - (player.pellets - 1) / 2) * (player.spread / Math.max(1, player.pellets - 1));
    fireBullet(game, player.x, player.y, angle + pelletOffset + rand(-player.spread * 0.18, player.spread * 0.18), baseDamage, element, {
      split: player.weaponSpecial === "prism_launcher" || (has(game, "buckshot") && player.weaponSpecial === "prism_launcher") ? 1 : 0,
      bounces: count(game, "rebound"),
      pierce: player.bulletPierce + (game.shotCounter % 4 === 3 && has(game, "shadow_round") ? 1 : 0),
      crit: player.crit + (lowAmmo && has(game, "last_straw") ? 0.15 : 0) + (freshClip ? 0.04 : 0)
    });
  }

  game.shotCounter += 1;
  if (consumeAmmo) player.shots += 1;
  player.cooldown = Math.max(0.07, 0.32 / player.fireRate);

  // Muzzle flash
  const muzzleX = player.x + Math.cos(angle) * (player.r + 8);
  const muzzleY = player.y + Math.sin(angle) * (player.r + 8);
  const flashColor = element === "fire" ? "#fb923c" : element === "lightning" ? "#72f5ff" : element === "ice" ? "#7dd3fc" : element === "void" ? "#c084fc" : element === "blood" ? "#86efac" : "#fef08a";
  burst(game, muzzleX, muzzleY, flashColor, 4, 2.5);
  game.particles.push({ x: muzzleX, y: muzzleY, vx: Math.cos(angle) * 40, vy: Math.sin(angle) * 40, life: 0.08, color: flashColor, size: 6 });

  if ((player.characterId === "mira" || has(game, "law_of_echoes")) && game.shotCounter % 6 === 0) {
    const copies = has(game, "recursive_gun") ? 4 : 2;
    for (let i = 0; i < copies; i += 1) {
      const offset = (i - (copies - 1) / 2) * 0.22;
      fireBullet(game, player.x, player.y, angle + offset, baseDamage * 0.72, element, {
        split: has(game, "recursive_gun") ? 1 : 0,
        bounces: count(game, "rebound"),
        pierce: Math.max(0, player.bulletPierce - 1),
        crit: player.crit + 0.16
      });
    }
    burst(game, player.x, player.y, "#c084fc", 7);
  }

  if (player.weaponSpecial === "hive_staff" && game.shotCounter % 3 === 0) spawnOrbital(game, 8 * player.summonDamage, 5, "wasp");
  if (player.weaponSpecial === "arc_rifle" && game.shotCounter % 3 === 0) chainLightning(game, player.x, player.y, 110, 5 * player.lightningDamage);
  if (player.weaponSpecial === "chakram" && game.shotCounter % 3 === 0) spawnOrbital(game, player.damage * 0.4, 2.5, "chakram");
  if (has(game, "empty_chamber") && player.shots >= player.magazine) explode(game, player.x, player.y, 72, 10, "#f8fafc");
};

const selectShotElement = (game: Game): Bullet["element"] => {
  const { weaponSpecial } = game.player;
  if (weaponSpecial === "flame_cannon") return "fire";
  if (weaponSpecial === "arc_rifle") return "lightning";
  if (weaponSpecial === "hive_staff") return "blood";
  if (has(game, "solar_frostbite") || (has(game, "firestarter") && has(game, "cold_touch"))) return game.shotCounter % 2 === 0 ? "fire" : "ice";
  if (has(game, "static_touch") && Math.random() < 0.35) return "lightning";
  if ((has(game, "ember_touch") || has(game, "firestarter")) && Math.random() < (has(game, "firestarter") ? 0.42 : 0.24)) return "fire";
  if (has(game, "cold_touch") && Math.random() < 0.32) return "ice";
  if (has(game, "venom_tip") && Math.random() < 0.34) return "blood";
  if (has(game, "hex_mark") && game.shotCounter % 5 === 0) return "void";
  return "kinetic";
};

const fireBullet = (
  game: Game,
  x: number,
  y: number,
  angle: number,
  damage: number,
  element: Bullet["element"],
  mods: BulletMods = {}
) => {
  // The default combat language favours chunky, legible projectiles over
  // needle-speed streaks. Individual weapon and upgrade values still scale
  // from these shared defaults.
  const speed = (mods.speed ?? game.player.bulletSpeed) * 0.78;
  const radius = (mods.radius ?? (element === "void" ? game.player.bulletSize + 3 : game.player.bulletSize + 1)) * 1.5;
  game.bullets.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: radius,
    damage,
    life: mods.life ?? game.player.bulletLife,
    age: 0,
    pierce: mods.pierce ?? 0,
    bounces: mods.bounces ?? 0,
    split: mods.split ?? 0,
    crit: mods.crit ?? 0,
    element,
    depth: mods.depth ?? 0,
    fromOrbit: mods.fromOrbit
  });
};

const updateBullets = (game: Game, dt: number) => {
  for (let i = game.bullets.length - 1; i >= 0; i -= 1) {
    const bullet = game.bullets[i];
    // Bullet trail particle
    if (Math.random() < 0.5) {
      game.particles.push({ x: bullet.x, y: bullet.y, vx: 0, vy: 0, life: 0.15, color: bulletColor(bullet.element), size: Math.max(1.5, bullet.r * 0.5) });
    }
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.age += dt;
    bullet.life -= dt;

    const bounced = bounceBullet(game, bullet);
    if (bounced && (has(game, "conductor") || has(game, "recursive_gun"))) chainLightning(game, bullet.x, bullet.y, 70, 5 * game.player.lightningDamage);

    let remove = bullet.life <= 0;
    for (const enemy of game.enemies) {
      const d = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);
      if (d > enemy.r + bullet.r) continue;

      const crit = Math.random() < bullet.crit;
      const damage = bullet.damage * (crit ? game.player.critDamage : 1);
      hurtEnemy(game, enemy, damage, bullet.element, true, crit);
      burst(game, bullet.x, bullet.y, crit ? "#fef08a" : bulletColor(bullet.element), crit ? 8 : 4);

      if (bullet.split > 0) splitBullet(game, bullet);
      if (game.player.weaponSpecial === "shard_launcher" || has(game, "collateral")) explode(game, bullet.x, bullet.y, has(game, "napalm") ? 92 : 64, bullet.damage * 0.45, "#fb7185");
      if (has(game, "black_hole_buckshot") || has(game, "law_of_gravity")) pullEnemies(game, bullet.x, bullet.y, has(game, "black_hole_buckshot") ? 120 : 78, 18);
      if (bullet.pierce > 0) bullet.pierce -= 1;
      else remove = true;
      break;
    }

    if (remove) {
      if (bullet.life <= 0 && game.player.weaponSpecial === "prism_launcher" && bullet.split > 0) splitBullet(game, bullet);
      if (bullet.life <= 0 && game.player.weaponSpecial === "shard_launcher") explode(game, bullet.x, bullet.y, 72, bullet.damage * 0.55, "#fb7185");
      if (bullet.life <= 0 && game.player.weaponSpecial === "aether_spear" && bullet.depth === 0) {
        const target = nearestEnemy(game, bullet.x, bullet.y);
        const angle = target ? Math.atan2(target.y - bullet.y, target.x - bullet.x) : Math.atan2(bullet.vy, bullet.vx);
        fireBullet(game, bullet.x, bullet.y, angle, bullet.damage * 0.72, bullet.element, {
          pierce: bullet.pierce,
          crit: bullet.crit,
          depth: 1
        });
      }
      if (has(game, "law_of_orbit") && !bullet.fromOrbit && Math.random() < 0.18 + count(game, "law_of_orbit") * 0.08) {
        game.player.orbitals.push({
          angle: rand(0, TAU),
          distance: rand(44, 72),
          damage: Math.max(5, bullet.damage * 0.42),
          life: 12,
          speed: rand(2.2, 4.2),
          kind: "orb",
          attackCooldown: 0,
          attackFlash: 0
        });
      }
      game.bullets.splice(i, 1);
    }
  }
};

const bounceBullet = (game: Game, bullet: Bullet) => {
  if (bullet.bounces <= 0 || bullet.life > 0.16) return false;
  const target = nearestEnemy(game, bullet.x, bullet.y);
  const speed = Math.hypot(bullet.vx, bullet.vy) || game.player.bulletSpeed;
  const angle = target ? Math.atan2(target.y - bullet.y, target.x - bullet.x) : Math.atan2(bullet.vy, bullet.vx) + rand(-0.95, 0.95);
  bullet.vx = Math.cos(angle) * speed;
  bullet.vy = Math.sin(angle) * speed;
  bullet.life += 0.42;
  bullet.bounces -= 1;
  bullet.damage *= has(game, "recursive_gun") ? 0.92 : 0.85;
  return true;
};

const splitBullet = (game: Game, bullet: Bullet) => {
  if (bullet.depth >= 2) return;
  const angle = Math.atan2(bullet.vy, bullet.vx);
  const childCount = has(game, "recursive_gun") ? 3 : 2;
  for (let i = 0; i < childCount; i += 1) {
    const offset = (i - (childCount - 1) / 2) * 0.62;
    fireBullet(game, bullet.x, bullet.y, angle + offset, bullet.damage * 0.45, bullet.element, {
      split: has(game, "recursive_gun") ? bullet.split - 1 : 0,
      bounces: Math.max(0, bullet.bounces - 1),
      crit: bullet.crit * 0.8,
      depth: bullet.depth + 1
    });
  }
  bullet.split = 0;
};

const fireEnemyProjectile = (game: Game, enemy: Enemy, angle: number, speed: number, damage: number, color = "#86efac") => {
  game.enemyProjectiles.push({
    x: enemy.x,
    y: enemy.y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: enemy.kind === "boss" ? 7 : 5,
    damage,
    life: enemy.kind === "boss" ? 4.2 : 3.2,
    age: 0,
    color
  });
};

const updateEnemyProjectiles = (game: Game, dt: number) => {
  const player = game.player;
  for (let i = game.enemyProjectiles.length - 1; i >= 0; i -= 1) {
    const shot = game.enemyProjectiles[i];
    shot.x += shot.vx * dt;
    shot.y += shot.vy * dt;
    shot.age += dt;
    shot.life -= dt;
    if (Math.hypot(player.x - shot.x, player.y - shot.y) < player.r + shot.r) {
      hurtPlayer(game, shot.damage);
      burst(game, shot.x, shot.y, shot.color, 7, 2.4);
      game.enemyProjectiles.splice(i, 1);
      continue;
    }
    if (shot.life <= 0) game.enemyProjectiles.splice(i, 1);
  }
};

const updateEnemies = (game: Game, dt: number) => {
  const player = game.player;

  for (let i = game.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = game.enemies[i];
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const d = len(dx, dy);
    const angle = Math.atan2(dy, dx);
    const freezeSlow = enemy.freeze > 0 ? 0.38 : 1;
    enemy.attackTimer -= dt;
    enemy.chargeTimer -= dt;

    let moveDirection = 1;
    let speedMultiplier = 1;
    if (enemy.kind === "spitter") {
      moveDirection = d < 210 ? -1 : d > 320 ? 1 : 0.12;
      if (enemy.attackTimer <= 0 && d < 620) {
        fireEnemyProjectile(game, enemy, angle, 190 + game.director.threat * 16, enemy.damage * 0.72, "#86efac");
        enemy.attackTimer = Math.max(1.1, 2.15 - game.director.threat * 0.18);
        burst(game, enemy.x, enemy.y, "#86efac", 5, 2);
      }
    } else if (enemy.kind === "charger") {
      if (enemy.chargeTimer <= 0 && d < 520) {
        enemy.chargeTimer = Math.max(1.0, 2.6 - game.director.threat * 0.16);
        enemy.attackTimer = 0.38;
        text(game, enemy.x, enemy.y - enemy.r - 14, "!", "#fef2f2");
        burst(game, enemy.x, enemy.y, "#fca5a5", 8, 3);
      }
      // Telegraph ring while charging
      if (enemy.attackTimer > 0 && enemy.kind === "charger") {
        game.particles.push({ x: enemy.x, y: enemy.y, vx: 0, vy: 0, life: 0.05, color: "#fca5a5", size: enemy.r + 4 + Math.sin(game.time * 30) * 3 });
      }
      speedMultiplier = enemy.attackTimer > 0 ? 3.2 : 0.95;
    } else if (enemy.kind === "boss") {
      const enrage = enemy.hp / enemy.maxHp < 0.3;
      speedMultiplier = enrage ? (d > 200 ? 1.4 : 0.4) : (d > 260 ? 1 : 0.22);
      if (enemy.attackTimer <= 0) {
        const spokes = (enrage ? 12 : 8) + Math.min(8, game.director.spawnedBosses.length * 2);
        for (let shot = 0; shot < spokes; shot += 1) {
          fireEnemyProjectile(game, enemy, shot * (TAU / spokes) + game.time * 0.2, (enrage ? 185 : 145) + game.director.threat * 15, enemy.damage * 0.38, enrage ? "#fca5a5" : "#c084fc");
        }
        enemy.attackTimer = Math.max(enrage ? 0.9 : 1.45, 3 - game.director.threat * 0.2);
        if (enrage) {
          burst(game, enemy.x, enemy.y, "#fca5a5", 8, 4);
          addShake(game, 2);
        }
      }
      // Enrage aura
      if (enrage && Math.random() < 0.3) {
        game.particles.push({ x: enemy.x + rand(-enemy.r, enemy.r), y: enemy.y + rand(-enemy.r, enemy.r), vx: 0, vy: -20, life: 0.3, color: "#fca5a5", size: 3 });
      }
    } else if (enemy.kind === "runner") {
      speedMultiplier = 1.2;
    } else if (enemy.kind === "brute") {
      speedMultiplier = 0.72;
    }

    enemy.x += (dx / d) * enemy.speed * speedMultiplier * moveDirection * freezeSlow * dt;
    enemy.y += (dy / d) * enemy.speed * speedMultiplier * moveDirection * freezeSlow * dt;
    enemy.hitFlash -= dt;
    enemy.damageNoticeCooldown -= dt;

    if (enemy.burn > 0) {
      enemy.burn -= dt;
      hurtEnemy(game, enemy, (has(game, "solar_frostbite") ? 5 : 3) * game.player.fireDamage * dt, "fire", false);
    }
    if (enemy.poison > 0) {
      enemy.poison -= dt;
      hurtEnemy(game, enemy, 4 * game.player.poisonDamage * dt, "blood", false);
    }
    if (enemy.bleed > 0) {
      enemy.bleed -= dt;
      hurtEnemy(game, enemy, 5 * game.player.bleedDamage * dt, "blood", false);
    }
    enemy.shock -= dt;
    enemy.curse -= dt;
    enemy.freeze -= dt;

    if (Math.hypot(player.x - enemy.x, player.y - enemy.y) < player.r + enemy.r) {
      hurtPlayer(game, enemy.damage * dt * 1.8);
    }

    if (enemy.hp <= 0) {
      killEnemy(game, enemy);
      game.enemies.splice(i, 1);
    }
  }
};

const updateGems = (game: Game, dt: number) => {
  const player = game.player;
  for (let i = game.gems.length - 1; i >= 0; i -= 1) {
    const gem = game.gems[i];
    const dx = player.x - gem.x;
    const dy = player.y - gem.y;
    const d = Math.hypot(dx, dy);
    const magnetRange = player.pickupRadius + gem.magnet + count(game, "gem_singularity") * 24;
    if (d < magnetRange) {
      gem.x += (dx / (d || 1)) * (240 + magnetRange) * dt;
      gem.y += (dy / (d || 1)) * (240 + magnetRange) * dt;
    }
    if (d < player.r + 10) {
      game.xp += gem.value;
      burst(game, gem.x, gem.y, "#93c5fd", 4, 2);
      game.particles.push({ x: player.x, y: player.y - player.r - 8, vx: 0, vy: -30, life: 0.4, color: "#93c5fd", text: `+${gem.value}`, size: 11 });
      if (has(game, "gem_singularity")) {
        explode(game, gem.x, gem.y, 76 + count(game, "gem_singularity") * 14, 16 + gem.value * 2, "#a78bfa");
        pullEnemies(game, gem.x, gem.y, 108, 26);
        collectNearbyGems(game, gem.x, gem.y, 72);
      }
      game.gems.splice(i, 1);
    }
  }
};

const summonAttackProfiles: Record<SummonKind, {
  cooldown: number;
  damageMultiplier: number;
  speed: number;
  life: number;
  radius: number;
  pierce?: number;
  element: Bullet["element"];
}> = {
  wisp: { cooldown: 0.54, damageMultiplier: 0.9, speed: 460, life: 0.8, radius: 3, element: "lightning" },
  hound: { cooldown: 0.72, damageMultiplier: 1.05, speed: 500, life: 0.58, radius: 4, element: "kinetic" },
  turret: { cooldown: 0.3, damageMultiplier: 0.72, speed: 660, life: 0.72, radius: 3, element: "kinetic" },
  drone: { cooldown: 0.88, damageMultiplier: 0.52, speed: 400, life: 0.75, radius: 3, element: "ice" },
  mite: { cooldown: 0.58, damageMultiplier: 0.62, speed: 520, life: 0.5, radius: 3, element: "blood" },
  blade: { cooldown: 0.46, damageMultiplier: 0.82, speed: 560, life: 0.5, radius: 4, pierce: 1, element: "kinetic" },
  wasp: { cooldown: 0.36, damageMultiplier: 0.56, speed: 580, life: 0.54, radius: 3, element: "blood" },
  chakram: { cooldown: 0.52, damageMultiplier: 0.92, speed: 520, life: 0.66, radius: 4, pierce: 1, element: "void" },
  orb: { cooldown: 0.66, damageMultiplier: 1, speed: 380, life: 0.86, radius: 4, element: "void" }
};

export const permanentSummonKinds = new Set<SummonKind>(["wisp", "hound", "turret", "drone", "blade"]);
const SCYTHE_ORBIT_SPEED = 2;
const SUMMON_ORBIT_SPEED = { min: 1.6, max: 2.7 };

const isPermanentSummon = (kind: SummonKind) => permanentSummonKinds.has(kind);

export const arrangeScytheFormation = (orbitals: Orbital[], phase: number) => {
  const scythes = orbitals.filter((orbital) => orbital.kind === "blade");
  if (scythes.length === 0) return;
  const radius = scythes.reduce((total, scythe) => total + scythe.distance, 0) / scythes.length;
  for (const [index, scythe] of scythes.entries()) {
    scythe.distance = radius;
    scythe.speed = SCYTHE_ORBIT_SPEED;
    scythe.angle = phase + (TAU * index) / scythes.length;
  }
};

const fireSummonAttack = (game: Game, orbital: Orbital, x: number, y: number, target: Enemy) => {
  const profile = summonAttackProfiles[orbital.kind];
  const angle = Math.atan2(target.y - y, target.x - x);
  fireBullet(game, x, y, angle, orbital.damage * profile.damageMultiplier, profile.element, {
    speed: profile.speed,
    life: profile.life,
    radius: profile.radius,
    pierce: profile.pierce ?? 0,
    crit: game.player.crit * 0.2,
    fromOrbit: true
  });
  orbital.attackCooldown = profile.cooldown / (orbital.attackSpeed ?? 1);
  orbital.attackFlash = 0.14;
};

const updateOrbitals = (game: Game, dt: number) => {
  const player = game.player;
  const scythes = player.orbitals.filter((orbital) => orbital.kind === "blade");
  const scytheHaste = scythes.length === 0
    ? 1
    : scythes.reduce((total, orbital) => total + (orbital.attackSpeed ?? 1), 0) / scythes.length;
  arrangeScytheFormation(player.orbitals, game.time * SCYTHE_ORBIT_SPEED * scytheHaste);
  for (let i = player.orbitals.length - 1; i >= 0; i -= 1) {
    const orbital = player.orbitals[i];
    orbital.angle += orbital.speed * (orbital.attackSpeed ?? 1) * dt;
    if (orbital.life !== null) orbital.life -= dt;
    orbital.attackCooldown = Math.max(0, orbital.attackCooldown - dt);
    orbital.attackFlash = Math.max(0, orbital.attackFlash - dt);
    const x = player.x + Math.cos(orbital.angle) * orbital.distance;
    const y = player.y + Math.sin(orbital.angle) * orbital.distance;
    const target = nearestEnemy(game, x, y);
    if (target && orbital.attackCooldown <= 0) fireSummonAttack(game, orbital, x, y, target);
    for (const enemy of game.enemies) {
      if (Math.hypot(enemy.x - x, enemy.y - y) < enemy.r + 8) {
        hurtEnemy(game, enemy, orbital.damage * dt * 5, has(game, "conductor") ? "lightning" : "kinetic");
        if (has(game, "conductor") && Math.random() < 0.08) chainLightning(game, x, y, 66, 4 * player.lightningDamage);
      }
    }
    if (orbital.life !== null && orbital.life <= 0) player.orbitals.splice(i, 1);
  }
};

const updateParticles = (game: Game, dt: number) => {
  for (let i = game.particles.length - 1; i >= 0; i -= 1) {
    const p = game.particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    if (p.life <= 0) game.particles.splice(i, 1);
  }
};

const onReload = (game: Game) => {
  const player = game.player;
  if (has(game, "capacitor") || has(game, "thunder_magazine")) {
    chainLightning(game, player.x, player.y, has(game, "thunder_magazine") ? 160 : 108, (has(game, "thunder_magazine") ? 20 : 10) * player.lightningDamage);
  }

  if (has(game, "bone_turret")) spawnOrbital(game, 9 * player.summonDamage, 6, "turret");
  if (has(game, "hive_engine")) {
    spawnOrbital(game, 12 * player.summonDamage, 8, "wasp");
    fireBullet(game, player.x, player.y, rand(0, TAU), player.damage * 0.35, selectShotElement(game), { pierce: 1, crit: player.crit });
  }

  if (has(game, "blood_economy")) {
    hurtPlayer(game, 1.2, true);
    explode(game, player.x, player.y, 76, 12, "#fb7185");
    if (has(game, "blood_economy")) {
      player.shield = Math.min(55, player.shield + 3 + player.souls);
      player.souls = Math.max(0, player.souls - 1);
    }
  }
};

const hurtEnemy = (game: Game, enemy: Enemy, amount: number, element: Bullet["element"], flash = true, crit = false) => {
  const curseMult = enemy.curse > 0 ? 1 + (has(game, "malediction") ? 0.14 : 0.06) * Math.min(5, count(game, "hex_mark") + 1) : 1;
  const statusMult =
    (element === "fire" ? game.player.fireDamage : 1) *
    (element === "ice" ? game.player.frostDamage : 1) *
    (element === "blood" ? Math.max(game.player.poisonDamage, game.player.bleedDamage) : 1) *
    (element === "lightning" ? game.player.lightningDamage : 1) *
    (element === "void" ? game.player.curseDamage : 1);
  const damage = amount * curseMult * statusMult;
  enemy.hp -= damage;
  if (flash) {
  enemy.hitFlash = 0.08;
  if (enemy.damageNoticeCooldown <= 0) {
    damageText(game, enemy, damage, bulletColor(element), crit);
    enemy.damageNoticeCooldown = 0.12;
  }
  }

  if (element === "fire") enemy.burn = Math.max(enemy.burn, has(game, "napalm") ? 3.2 : 2.3);
  if (element === "ice") {
    enemy.freeze = Math.max(enemy.freeze, has(game, "deep_freeze") ? 1.9 : 1.4);
    if (has(game, "rime_ward") && Math.random() < 0.08) game.player.shield = Math.min(70, game.player.shield + 3);
  }
  if (element === "blood") {
    enemy.poison = Math.max(enemy.poison, has(game, "neurotoxin") ? 2.4 : 1.8);
    if (has(game, "hemorrhage") || has(game, "serrated_rounds")) enemy.bleed = Math.max(enemy.bleed, 2.6);
  }
  if (element === "void") enemy.curse = Math.max(enemy.curse, has(game, "malediction") ? 7 : 5);
  if (element === "lightning") {
    enemy.shock = Math.max(enemy.shock, 2);
    if (Math.random() < (has(game, "chain_spark") ? 0.32 : 0.18)) chainLightning(game, enemy.x, enemy.y, has(game, "chain_spark") ? 104 : 78, 4 * game.player.lightningDamage);
  }

  if (has(game, "solar_frostbite") && enemy.burn > 0 && enemy.freeze > 0) {
    enemy.burn = 0;
    enemy.freeze = 0;
    explode(game, enemy.x, enemy.y, 92, 24, "#38bdf8");
    for (let i = 0; i < 5; i += 1) {
      const target = nearestEnemy(game, enemy.x, enemy.y);
      const angle = target ? Math.atan2(target.y - enemy.y, target.x - enemy.x) + rand(-0.4, 0.4) : rand(0, TAU);
      fireBullet(game, enemy.x, enemy.y, angle, 8, "ice", { pierce: 1, crit: 0.12 });
    }
  }
};

const hurtPlayer = (game: Game, amount: number, selfInflicted = false) => {
  const player = game.player;
  if (!selfInflicted && player.invuln > 0) return;
  let damage = amount;
  if (player.shield > 0) {
    const blocked = Math.min(player.shield, damage);
    player.shield -= blocked;
    damage -= blocked;
  }
  player.hp -= Math.max(0.1, damage - player.armour * 0.25);
  if (!selfInflicted) addShake(game, 4);
};

const killEnemy = (game: Game, enemy: Enemy) => {
  game.kills += 1;
  game.combo.count += 1;
  game.combo.timer = 2.5;
  game.combo.best = Math.max(game.combo.best, game.combo.count);
  const comboBonus = Math.min(0.5, game.combo.count * 0.02);
  game.gems.push({ x: enemy.x, y: enemy.y, value: Math.round((enemy.maxHp > 50 ? 4 : 2) * (has(game, "greed") ? 1.15 : 1) * (1 + comboBonus)), magnet: rand(0, 16) });
  burst(game, enemy.x, enemy.y, "#fb7185", 9);
  if (enemy.kind === "boss" || enemy.kind === "elite") addShake(game, 6);
  if (game.combo.count >= 10 && game.combo.count % 10 === 0) {
    text(game, game.player.x, game.player.y - 48, `${game.combo.count}x COMBO!`, "#fde68a");
    addShake(game, 2);
  }

  if ((has(game, "vampiric_shell") || has(game, "cauterize")) && (has(game, "vampiric_shell") || enemy.burn > 0)) {
    const heal = has(game, "blood_economy") ? 3.2 : 1.6;
    const oldHp = game.player.hp;
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + heal);
    const over = Math.max(0, oldHp + heal - game.player.maxHp);
    game.player.shield = Math.min(60, game.player.shield + over + (has(game, "blood_economy") ? 0.45 : 0));
  }

  if (has(game, "soul_shepherd") || enemy.curse > 0) {
    game.player.souls += 1 + (has(game, "soul_furnace") && Math.random() < 0.35 ? 1 : 0);
    if (game.player.souls >= 3) {
      game.player.souls -= 3;
      spawnOrbital(game, 10 * game.player.summonDamage, 16, "blade");
      text(game, enemy.x, enemy.y - 20, "soul scythe", "#c4b5fd");
    }
  }

  if (has(game, "broodmother") && Math.random() < 0.32 + count(game, "broodmother") * 0.08) {
    const target = nearestEnemy(game, enemy.x, enemy.y);
    const angle = target ? Math.atan2(target.y - enemy.y, target.x - enemy.x) : rand(0, TAU);
    fireBullet(game, enemy.x, enemy.y, angle, 12 * game.player.summonDamage + count(game, "broodmother") * 3, "blood", { pierce: has(game, "solar_frostbite") ? 1 : 0 });
  }

  if (has(game, "ash_wake") && enemy.burn > 0) {
    explode(game, enemy.x, enemy.y, has(game, "napalm") ? 86 : 64, 18 * game.player.fireDamage, "#fb923c");
  }
  if (has(game, "ice_bloom") && enemy.freeze > 0) {
    for (let i = 0; i < 6; i += 1) fireBullet(game, enemy.x, enemy.y, rand(0, TAU), 8 * game.player.frostDamage, "ice", { pierce: 1 });
  }
  if (has(game, "thunderhead") && enemy.shock > 0) {
    chainLightning(game, enemy.x, enemy.y, 120, 10 * game.player.lightningDamage);
  }
  if (has(game, "law_of_split_blood") && enemy.bleed > 0) {
    for (let i = 0; i < 3; i += 1) fireBullet(game, enemy.x, enemy.y, rand(0, TAU), 12 * game.player.bleedDamage, "blood", { pierce: 1 });
  }
  if (has(game, "ammo_printer") && game.kills % 8 === 0) {
    game.player.shots = Math.max(0, game.player.shots - 1);
  }
  if (has(game, "scavenger") && game.kills % 10 === 0) {
    game.player.shots = Math.max(0, game.player.shots - 2);
    game.player.shield = Math.min(70, game.player.shield + 4);
  }
};

const spawnEnemy = (game: Game, anywhere = false, forcedKind?: EnemyKind) => {
  const edge = Math.floor(rand(0, 4));
  const margin = 80;
  const halfW = game.screen.w / 2;
  const halfH = game.screen.h / 2;
  let x = game.player.x + rand(-halfW, halfW);
  let y = game.player.y + rand(-halfH, halfH);
  if (anywhere) {
    const angle = rand(0, TAU);
    const distance = rand(360, Math.max(halfW, halfH) + margin + 220);
    x = game.player.x + Math.cos(angle) * distance;
    y = game.player.y + Math.sin(angle) * distance;
  } else if (edge === 0) {
    x = game.player.x - halfW - margin;
    y = game.player.y + rand(-halfH - margin, halfH + margin);
  } else if (edge === 1) {
    x = game.player.x + halfW + margin;
    y = game.player.y + rand(-halfH - margin, halfH + margin);
  } else if (edge === 2) {
    x = game.player.x + rand(-halfW - margin, halfW + margin);
    y = game.player.y - halfH - margin;
  } else {
    x = game.player.x + rand(-halfW - margin, halfW + margin);
    y = game.player.y + halfH + margin;
  }

  const minutes = game.time / 60;
  const phase = getDirectorPhase(game.time);
  const threat = game.director?.threat || phase.threat;
  const elite = forcedKind ? forcedKind !== "grunt" : Math.random() < Math.min(0.03 + minutes * 0.018, 0.18);
  const kind: EnemyKind = forcedKind || (elite ? "elite" : pickEnemyKind(game, phase, 0));
  const baseHp = 18 + minutes * 7 + threat * 3;
  const profile: Record<EnemyKind, { hp: number; r: number; speed: number; damage: number; attackTimer: number; chargeTimer: number }> = {
    grunt: { hp: baseHp, r: rand(9, 13), speed: rand(54, 82) + minutes * 3.8, damage: 11 + threat, attackTimer: rand(0.4, 1.2), chargeTimer: rand(0.6, 1.5) },
    runner: { hp: baseHp * 0.68, r: 9.5, speed: 104 + minutes * 5.2, damage: 9 + threat, attackTimer: rand(0.2, 0.9), chargeTimer: rand(0.5, 1.4) },
    brute: { hp: baseHp * 2.7, r: 20, speed: 42 + minutes * 2.1, damage: 21 + threat * 1.8, attackTimer: rand(0.6, 1.5), chargeTimer: rand(1, 2) },
    spitter: { hp: baseHp * 1.18, r: 14, speed: 50 + minutes * 2.2, damage: 13 + threat * 1.2, attackTimer: rand(0.4, 1.2), chargeTimer: rand(0.8, 1.8) },
    charger: { hp: baseHp * 1.55, r: 15.5, speed: 72 + minutes * 3.8, damage: 17 + threat * 1.6, attackTimer: rand(0.1, 0.8), chargeTimer: rand(0.5, 1.5) },
    elite: { hp: 70 + minutes * 28 + threat * 18, r: 17, speed: rand(42, 62) + minutes * 2.2, damage: 22 + threat * 2, attackTimer: rand(0.3, 1), chargeTimer: rand(0.8, 1.8) },
    boss: { hp: 560 + minutes * 88 + threat * 75, r: 30, speed: 30 + minutes * 0.9, damage: 34 + threat * 3, attackTimer: 0.8, chargeTimer: 1.5 }
  };
  const stats = profile[kind];
  const hp = stats.hp;
  // Spawn warning flash
  burst(game, x, y, kind === "boss" ? "#fde68a" : kind === "elite" ? "#fb923c" : "#f87171", kind === "boss" ? 12 : 6, 3);

  game.enemies.push({
    id: game.idCounter,
    kind,
    x,
    y,
    r: stats.r,
    hp,
    maxHp: hp,
    speed: stats.speed,
    damage: stats.damage,
    burn: 0,
    freeze: 0,
    poison: 0,
    shock: 0,
    bleed: 0,
    curse: 0,
    hitFlash: 0,
    damageNoticeCooldown: 0,
    attackTimer: stats.attackTimer,
    chargeTimer: stats.chargeTimer
  });
  game.idCounter += 1;
};

const nearestEnemy = (game: Game, x: number, y: number) => {
  let best: Enemy | undefined;
  let bestD = Infinity;
  for (const enemy of game.enemies) {
    const d = (enemy.x - x) ** 2 + (enemy.y - y) ** 2;
    if (d < bestD) {
      best = enemy;
      bestD = d;
    }
  }
  return best;
};

const explode = (game: Game, x: number, y: number, radius: number, damage: number, color: string) => {
  const element: Bullet["element"] = color === "#72f5ff" || color === "#38bdf8" ? "lightning" : color === "#fb923c" ? "fire" : "blood";
  for (const enemy of game.enemies) {
    const d = Math.hypot(enemy.x - x, enemy.y - y);
    if (d < radius) hurtEnemy(game, enemy, damage * (1 - d / radius) + damage * 0.35, element);
  }
  burst(game, x, y, color, 18, radius * 0.08);
};

const chainLightning = (game: Game, x: number, y: number, radius: number, damage: number) => {
  const targets = game.enemies
    .filter((enemy) => Math.hypot(enemy.x - x, enemy.y - y) < radius)
    .sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))
    .slice(0, 4 + count(game, "chain_spark"));

  for (const enemy of targets) {
    hurtEnemy(game, enemy, damage, "lightning");
    game.particles.push({
      x: (x + enemy.x) / 2,
      y: (y + enemy.y) / 2,
      vx: rand(-8, 8),
      vy: rand(-8, 8),
      life: 0.16,
      color: "#72f5ff",
      size: 3
    });
  }
};

const spawnOrbital = (game: Game, damage: number, life: number, kind: SummonKind = "orb") => {
  const player = game.player;
  const existing = player.orbitals.length;
  const cap = has(game, "hive_engine") ? 12 : has(game, "twin_spawn") ? 10 : 8;
  if (existing >= cap) player.orbitals.shift();
  const existingScythe = kind === "blade" ? player.orbitals.find((orbital) => orbital.kind === "blade") : undefined;
  const distance = kind === "blade" ? existingScythe?.distance ?? 62 : rand(46, has(game, "leash_breaker") ? 96 : 78);
  player.orbitals.push({
    angle: rand(0, TAU),
    distance,
    damage,
    life: isPermanentSummon(kind) ? null : life,
    speed: kind === "blade" ? SCYTHE_ORBIT_SPEED : rand(SUMMON_ORBIT_SPEED.min, SUMMON_ORBIT_SPEED.max),
    attackSpeed: (has(game, "familiar_training") ? 1.18 : 1) * (has(game, "hive_engine") ? 1.18 : 1),
    kind,
    attackCooldown: 0,
    attackFlash: 0
  });
  if (has(game, "twin_spawn") && player.orbitals.length < cap && Math.random() < 0.5) {
    player.orbitals.push({
      angle: rand(0, TAU),
      distance,
      damage: damage * 0.75,
      life: isPermanentSummon(kind) ? null : life,
      speed: kind === "blade" ? SCYTHE_ORBIT_SPEED : rand(SUMMON_ORBIT_SPEED.min, SUMMON_ORBIT_SPEED.max),
      attackSpeed: (has(game, "familiar_training") ? 1.18 : 1) * (has(game, "hive_engine") ? 1.18 : 1),
      kind,
      attackCooldown: 0,
      attackFlash: 0
    });
  }
  arrangeScytheFormation(player.orbitals, game.time * SCYTHE_ORBIT_SPEED);
};

const pullEnemies = (game: Game, x: number, y: number, radius: number, strength: number) => {
  for (const enemy of game.enemies) {
    const dx = x - enemy.x;
    const dy = y - enemy.y;
    const d = Math.hypot(dx, dy);
    if (d < radius) {
      enemy.x += (dx / (d || 1)) * strength;
      enemy.y += (dy / (d || 1)) * strength;
    }
  }
};

const collectNearbyGems = (game: Game, x: number, y: number, radius: number) => {
  for (const gem of game.gems) {
    if (Math.hypot(gem.x - x, gem.y - y) < radius) {
      gem.x = game.player.x;
      gem.y = game.player.y;
    }
  }
};

const burst = (game: Game, x: number, y: number, color: string, amount: number, size = 3) => {
  for (let i = 0; i < amount; i += 1) {
    const angle = rand(0, TAU);
    const speed = rand(18, 130);
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: rand(0.18, 0.55),
      color,
      size: rand(size * 0.6, size * 1.4)
    });
  }
};

const text = (game: Game, x: number, y: number, value: string, color: string) => {
  game.particles.push({ x, y, vx: 0, vy: -22, life: 0.8, color, text: value, size: 13 });
};

const addShake = (game: Game, amount: number) => {
  game.screenShake = Math.min(18, game.screenShake + amount);
};

const damageText = (game: Game, enemy: Enemy, amount: number, color: string, crit = false) => {
  const value = amount < 2 ? amount.toFixed(1) : String(Math.round(amount));
  game.particles.push({
    x: enemy.x + rand(-enemy.r * 0.45, enemy.r * 0.45),
    y: enemy.y - enemy.r - 6,
    vx: rand(-14, 14),
    vy: rand(-46, -28),
    life: crit ? 0.8 : 0.62,
    color: crit ? "#fef08a" : color,
    text: crit ? `${value}!` : value,
    size: crit ? 20 : amount > 28 ? 18 : amount > 12 ? 15 : 13
  });
};

const updateUi = (game: Game) => {
  const objectivePct = clamp((game.time / game.objective.duration) * 100, 0, 100);
  const finalWaveStarted = game.time >= game.objective.duration - game.objective.finalWaveDuration;
  game.ui = {
    time: formatRunTime(game.time),
    level: String(game.level),
    kills: String(game.kills),
    hpPct: clamp((game.player.hp / game.player.maxHp) * 100, 0, 100),
    xpPct: clamp((game.xp / game.nextXp) * 100, 0, 100),
    activePct: game.player.activeCooldown > 0 ? clamp(100 - (game.player.activeTimer / game.player.activeCooldown) * 100, 0, 100) : 100,
    activeReady: game.player.activeTimer <= 0,
    objective: finalWaveStarted ? "Final Dawn" : game.objective.name,
    objectivePct,
    directorPhase: game.director.phaseName,
    threat: Number(game.director.threat.toFixed(1)),
    rerolls: game.draft.rerolls,
    banishes: game.draft.banishes,
    combo: game.combo.count,
    runState: game.runState,
    gameOver: game.gameOver
  };
};

const shuffle = <T,>(values: T[]) => {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const bulletColor = (element: Bullet["element"]) => getSpriteDefinition("bullets", element).palette.primary;

const hashTile = (x: number, y: number, salt = 0) => {
  const n = Math.sin(x * 127.1 + y * 311.7 + salt * 74.7) * 43758.5453123;
  return n - Math.floor(n);
};

const drawProceduralStage = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number, camera: Vec) => {
  const grid = 56;
  const tile = 112;
  const worldLeft = -camera.x;
  const worldTop = -camera.y;
  const worldRight = worldLeft + w;
  const worldBottom = worldTop + h;

  // Subtle floor grid — slightly brighter for depth perception
  ctx.strokeStyle = "rgba(99, 102, 241, 0.06)";
  ctx.lineWidth = 1;
  const startGridX = Math.floor(worldLeft / grid) * grid;
  const startGridY = Math.floor(worldTop / grid) * grid;
  for (let x = startGridX; x < worldRight + grid; x += grid) {
    const sx = x + camera.x;
    ctx.beginPath();
    ctx.moveTo(sx, 0);
    ctx.lineTo(sx, h);
    ctx.stroke();
  }
  for (let y = startGridY; y < worldBottom + grid; y += grid) {
    const sy = y + camera.y;
    ctx.beginPath();
    ctx.moveTo(0, sy);
    ctx.lineTo(w, sy);
    ctx.stroke();
  }

  // Floor detail tiles — fewer, bigger, darker for readability
  const minTileX = Math.floor(worldLeft / tile) - 1;
  const maxTileX = Math.floor(worldRight / tile) + 1;
  const minTileY = Math.floor(worldTop / tile) - 1;
  const maxTileY = Math.floor(worldBottom / tile) + 1;

  for (let tx = minTileX; tx <= maxTileX; tx += 1) {
    for (let ty = minTileY; ty <= maxTileY; ty += 1) {
      const sx = tx * tile + camera.x;
      const sy = ty * tile + camera.y;
      const roll = hashTile(tx, ty);
      const roll2 = hashTile(tx, ty, 2);
      const roll3 = hashTile(tx, ty, 3);

      // Subtle floor plate
      if (roll < 0.3) {
        ctx.fillStyle = "rgba(30, 27, 75, 0.12)";
        ctx.beginPath();
        ctx.roundRect(sx + 12 + roll2 * 28, sy + 14 + roll3 * 24, 32 + roll * 48, 14 + roll2 * 20, 6);
        ctx.fill();
      }

      // Faint accent dot
      if (roll3 > 0.9) {
        ctx.fillStyle = "rgba(125, 211, 252, 0.08)";
        ctx.beginPath();
        ctx.arc(sx + 20 + roll * 60, sy + 20 + roll2 * 60, 2 + roll * 3, 0, TAU);
        ctx.fill();
      }
    }
  }

  // Screen edge vignette for focus
  const vignette = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.75);
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.4)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
};

const diamond = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r, y);
  ctx.closePath();
  ctx.fill();
};


const drawPolygon = (ctx: CanvasRenderingContext2D, points: Vec[]) => {
  if (!points.length) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (const point of points.slice(1)) ctx.lineTo(point.x, point.y);
  ctx.closePath();
};

const drawCapsule = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius = h / 2) => {
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y - h / 2, w, h, radius);
};

const drawSpriteDefinition = (ctx: CanvasRenderingContext2D, sprite: ProceduralSpriteDefinition, time: number, scale = 1) => {
  ctx.save();
  ctx.shadowColor = sprite.palette.shadow || sprite.palette.primary;
  ctx.shadowBlur = 10 * scale;

  for (const layer of sprite.layers) {
    const layerScale = scale * (1 + Math.sin(time * 6) * 0.035 * (layer.pulse || 0));
    const x = (layer.x || 0) * layerScale;
    const y = (layer.y || 0) * layerScale;
    const r = (layer.r || 0) * layerScale;
    const w = (layer.w || 0) * layerScale;
    const h = (layer.h || 0) * layerScale;

    ctx.save();
    ctx.globalAlpha *= layer.alpha ?? 1;
    ctx.rotate(layer.rotate || 0);
    ctx.fillStyle = layer.fill || sprite.palette.primary;
    ctx.strokeStyle = layer.stroke || sprite.palette.secondary;
    ctx.lineWidth = (layer.lineWidth || 1.8) * layerScale;

    if (layer.shape === "circle") {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      if (layer.fill) ctx.fill();
      if (layer.stroke) ctx.stroke();
    } else if (layer.shape === "diamond") {
      if (layer.fill) ctx.fillStyle = layer.fill;
      diamond(ctx, x, y, r);
      if (layer.stroke) ctx.stroke();
    } else if (layer.shape === "polygon") {
      drawPolygon(
        ctx,
        (layer.points || []).map((point) => ({ x: point.x * layerScale + x, y: point.y * layerScale + y }))
      );
      if (layer.fill) ctx.fill();
      if (layer.stroke) ctx.stroke();
    } else if (layer.shape === "capsule") {
      drawCapsule(ctx, x, y, w, h, Math.max(1, Math.min(w, h) / 2));
      if (layer.fill) ctx.fill();
      if (layer.stroke) ctx.stroke();
    } else if (layer.shape === "ring") {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.stroke();
    } else if (layer.shape === "rect") {
      ctx.beginPath();
      ctx.roundRect(x - w / 2, y - h / 2, w, h, Math.min(6 * layerScale, Math.min(w, h) / 2));
      if (layer.fill) ctx.fill();
      if (layer.stroke) ctx.stroke();
    } else if (layer.shape === "line") {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y + h);
      ctx.stroke();
    } else if (layer.shape === "text") {
      ctx.shadowBlur = 0;
      ctx.font = layer.font || `${Math.round(12 * layerScale)}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (layer.stroke) ctx.strokeText(layer.text || "", x, y);
      if (layer.fill) ctx.fillText(layer.text || "", x, y);
    }

    ctx.restore();
  }

  ctx.restore();
};

const drawEnemyProjectile = (ctx: CanvasRenderingContext2D, shot: EnemyProjectile) => {
  const speed = Math.hypot(shot.vx, shot.vy);
  const angle = Math.atan2(shot.vy, shot.vx);
  ctx.save();
  ctx.translate(shot.x, shot.y);
  ctx.rotate(angle);
  ctx.shadowColor = shot.color;
  ctx.shadowBlur = 12;
  ctx.fillStyle = shot.color;
  drawCapsule(ctx, 0, 0, Math.max(shot.r * 2.8, speed * 0.018), shot.r * 1.25);
  ctx.fill();
  ctx.restore();
};

const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: Enemy, time: number) => {
  const hpPct = clamp(enemy.hp / enemy.maxHp, 0, 1);
  const sprite = getSpriteDefinition("enemies", enemy.kind);
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  ctx.globalAlpha = enemy.hitFlash > 0 ? 0.64 : 0.96;
  if (enemy.freeze > 0) ctx.globalAlpha *= 0.82;
  drawSpriteDefinition(ctx, sprite, time + enemy.id * 0.11, enemy.r / (enemy.kind === "boss" ? 30 : enemy.kind === "elite" ? 17 : 12));
  if (enemy.burn > 0 || enemy.freeze > 0 || enemy.poison > 0 || enemy.shock > 0 || enemy.curse > 0) {
    ctx.beginPath();
    ctx.strokeStyle = enemy.freeze > 0 ? "#7dd3fc" : enemy.burn > 0 ? "#fb923c" : enemy.shock > 0 ? "#72f5ff" : enemy.curse > 0 ? "#c084fc" : "#86efac";
    ctx.lineWidth = 2;
    ctx.arc(0, 0, enemy.r + 6 + Math.sin(time * 8) * 1.5, 0, TAU);
    ctx.stroke();
  }
  ctx.restore();

  ctx.fillStyle = "rgba(3, 7, 18, 0.72)";
  ctx.fillRect(enemy.x - enemy.r - 1, enemy.y - enemy.r - 10, enemy.r * 2 + 2, 5.5);
  ctx.fillStyle = enemy.kind === "boss" ? "#fde68a" : enemy.kind === "elite" ? "#fb923c" : "#fda4af";
  ctx.fillRect(enemy.x - enemy.r, enemy.y - enemy.r - 9, enemy.r * 2 * hpPct, 3.5);
};

const drawCharacter = (ctx: CanvasRenderingContext2D, player: Player, time: number, reloading: boolean) => {
  const sprite = getSpriteDefinition("players", player.characterId);
  const cooldownPulse = player.activeTimer <= 0 ? 1 + Math.sin(time * 8) * 0.04 : 1;

  ctx.save();

  // Strong ground shadow for depth
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(0, player.r * 0.7, player.r * 1.1, player.r * 0.4, 0, 0, TAU);
  ctx.fill();

  // White contrast outline ring
  ctx.strokeStyle = "rgba(248, 250, 252, 0.55)";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(0, 0, player.r + 4, 0, TAU);
  ctx.stroke();

  if (player.invuln > 0) {
    ctx.globalAlpha = 0.72 + Math.sin(time * 28) * 0.18;
  }
  drawSpriteDefinition(ctx, sprite, time + (reloading ? 3 : 0), (player.r / 13) * cooldownPulse);

  if (player.activeTimer <= 0) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(253, 230, 138, 0.72)";
    ctx.lineWidth = 1.4;
    ctx.arc(0, 0, player.r + 18 + Math.sin(time * 7) * 2, 0, TAU);
    ctx.stroke();
  }

  drawWeaponBadge(ctx, player.weaponSpecial, sprite.palette.primary);
  ctx.restore();
};

const drawWeaponBadge = (ctx: CanvasRenderingContext2D, weaponId: WeaponId, color: string) => {
  ctx.save();
  ctx.translate(18, -13);
  ctx.strokeStyle = color;
  ctx.fillStyle = "rgba(3, 7, 18, 0.82)";
  ctx.lineWidth = 2.2;

  if (weaponId === "shotgun") {
    drawCapsule(ctx, 0, -3, 24, 5);
    ctx.stroke();
    drawCapsule(ctx, 0, 4, 24, 5);
    ctx.stroke();
  } else if (weaponId === "needle_smg") {
    drawCapsule(ctx, 0, 0, 25, 6);
    ctx.stroke();
    ctx.fillRect(-5, 4, 7, 8);
  } else if (weaponId === "crossbow") {
    ctx.beginPath();
    ctx.moveTo(-11, 0);
    ctx.lineTo(12, 0);
    ctx.moveTo(-6, -9);
    ctx.quadraticCurveTo(-12, 0, -6, 9);
    ctx.moveTo(2, -9);
    ctx.quadraticCurveTo(10, 0, 2, 9);
    ctx.stroke();
  } else if (weaponId === "flame_cannon") {
    drawCapsule(ctx, -2, 0, 21, 8);
    ctx.stroke();
    ctx.fillStyle = "#fb923c";
    diamond(ctx, 12, 0, 5);
  } else if (weaponId === "arc_rifle") {
    drawCapsule(ctx, -2, 0, 23, 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(11, -7);
    ctx.lineTo(17, 0);
    ctx.lineTo(11, 7);
    ctx.stroke();
  } else if (weaponId === "shard_launcher") {
    drawPolygon(ctx, [
      { x: -11, y: -7 },
      { x: 12, y: -4 },
      { x: 15, y: 3 },
      { x: -8, y: 8 }
    ]);
    ctx.stroke();
  } else if (weaponId === "rail_lance") {
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(18, 0);
    ctx.moveTo(10, -5);
    ctx.lineTo(18, 0);
    ctx.lineTo(10, 5);
    ctx.stroke();
  } else if (weaponId === "chakram") {
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, TAU);
    ctx.arc(0, 0, 4, 0, TAU);
    ctx.stroke();
  } else if (weaponId === "hive_staff") {
    ctx.beginPath();
    ctx.moveTo(-10, 8);
    ctx.lineTo(8, -8);
    ctx.arc(10, -9, 5, 0, TAU);
    ctx.stroke();
  } else if (weaponId === "prism_launcher") {
    drawPolygon(ctx, [
      { x: -9, y: 7 },
      { x: 0, y: -10 },
      { x: 11, y: 7 }
    ]);
    ctx.stroke();
  } else if (weaponId === "aether_spear") {
    ctx.beginPath();
    ctx.moveTo(-11, 8);
    ctx.lineTo(14, -9);
    ctx.moveTo(14, -9);
    ctx.lineTo(10, 1);
    ctx.stroke();
  } else {
    drawCapsule(ctx, 0, 0, 22, 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-9, 6, 4, 0, TAU);
    ctx.stroke();
  }

  ctx.restore();
};

const drawBullet = (ctx: CanvasRenderingContext2D, bullet: Bullet, weaponId: WeaponId, time: number) => {
  const color = bulletColor(bullet.element);
  const angle = Math.atan2(bullet.vy, bullet.vx);
  const speed = Math.hypot(bullet.vx, bullet.vy);

  ctx.save();
  ctx.translate(bullet.x, bullet.y);
  ctx.rotate(angle);
  ctx.shadowColor = color;
  ctx.shadowBlur = bullet.element === "kinetic" ? 12 : 18;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  if (weaponId === "rail_lance" || speed > 780) {
    drawCapsule(ctx, 0, 0, bullet.r * 5.6, Math.max(3, bullet.r * 0.85));
    ctx.fill();
  } else if (weaponId === "crossbow" || weaponId === "aether_spear") {
    drawPolygon(ctx, [
      { x: bullet.r * 2.8, y: 0 },
      { x: -bullet.r, y: -bullet.r * 0.85 },
      { x: -bullet.r * 0.2, y: 0 },
      { x: -bullet.r, y: bullet.r * 0.85 }
    ]);
    ctx.fill();
  } else if (weaponId === "shotgun" || weaponId === "needle_smg" || weaponId === "revolver") {
    drawCapsule(ctx, 0, 0, bullet.r * 2.2, bullet.r * 1.2);
    ctx.fill();
  } else if (weaponId === "flame_cannon") {
    drawPolygon(ctx, [
      { x: bullet.r * 2.2, y: 0 },
      { x: -bullet.r * 0.4, y: -bullet.r * 1.4 },
      { x: -bullet.r * 1.3, y: 0 },
      { x: -bullet.r * 0.4, y: bullet.r * 1.4 }
    ]);
    ctx.globalAlpha = 0.86 + Math.sin(time * 20) * 0.08;
    ctx.fill();
    ctx.globalAlpha = 1;
  } else if (weaponId === "arc_rifle") {
    ctx.beginPath();
    ctx.moveTo(-bullet.r * 2, -bullet.r * 0.8);
    ctx.lineTo(-bullet.r * 0.3, bullet.r * 0.2);
    ctx.lineTo(bullet.r * 0.5, -bullet.r * 0.3);
    ctx.lineTo(bullet.r * 2, bullet.r * 0.8);
    ctx.stroke();
  } else if (weaponId === "shard_launcher") {
    drawPolygon(ctx, [
      { x: bullet.r * 1.6, y: -bullet.r * 0.5 },
      { x: bullet.r * 0.35, y: bullet.r * 1.25 },
      { x: -bullet.r * 1.5, y: bullet.r * 0.6 },
      { x: -bullet.r * 1.1, y: -bullet.r * 1.25 }
    ]);
    ctx.fill();
  } else if (weaponId === "chakram") {
    ctx.beginPath();
    ctx.arc(0, 0, bullet.r * 1.55, 0, TAU);
    ctx.arc(0, 0, bullet.r * 0.62, 0, TAU);
    ctx.stroke();
  } else if (weaponId === "prism_launcher") {
    drawPolygon(ctx, [
      { x: bullet.r * 1.6, y: 0 },
      { x: -bullet.r * 0.8, y: -bullet.r * 1.15 },
      { x: -bullet.r * 0.8, y: bullet.r * 1.15 }
    ]);
    ctx.fill();
  } else if (weaponId === "hive_staff") {
    drawPolygon(ctx, [
      { x: bullet.r * 1.4, y: 0 },
      { x: 0, y: -bullet.r },
      { x: -bullet.r * 1.2, y: -bullet.r * 0.45 },
      { x: -bullet.r * 1.2, y: bullet.r * 0.45 },
      { x: 0, y: bullet.r }
    ]);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, bullet.r, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
};

const drawSummon = (ctx: CanvasRenderingContext2D, orbital: Orbital, x: number, y: number, time: number, charged: boolean) => {
  const sprite = getSpriteDefinition("summons", orbital.kind);
  const bob = Math.sin(time * 8 + orbital.angle) * 1.5;

  ctx.save();
  ctx.translate(x, y + bob);
  ctx.rotate(orbital.angle + time * (orbital.kind === "chakram" ? 5 : 1.2));
  drawSpriteDefinition(ctx, sprite, time + orbital.angle, charged ? 1.18 : 1);
  if (charged) {
    ctx.beginPath();
    ctx.strokeStyle = "#72f5ff";
    ctx.lineWidth = 1.6;
    ctx.arc(0, 0, 15, 0, TAU);
    ctx.stroke();
  }
  ctx.restore();
};

const summonColor = (kind: SummonKind) => {
  if (kind === "hound") return "#fbbf24";
  if (kind === "turret") return "#cbd5e1";
  if (kind === "drone") return "#67e8f9";
  if (kind === "mite" || kind === "wasp") return "#86efac";
  if (kind === "blade" || kind === "chakram") return "#c4b5fd";
  if (kind === "wisp") return "#f0abfc";
  return "#f8fafc";
};

const drawReloadBar = (ctx: CanvasRenderingContext2D, x: number, y: number, progress: number) => {
  const width = 48;
  const height = 5;
  const left = x - width / 2;
  ctx.save();
  ctx.fillStyle = "rgba(3, 7, 18, 0.82)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.22)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(left, y, width, height, height / 2);
  ctx.fill();
  ctx.stroke();
  const fillWidth = width * progress;
  if (fillWidth > 0.5) {
    ctx.fillStyle = "#fde68a";
    ctx.beginPath();
    ctx.roundRect(left, y, fillWidth, height, Math.min(height / 2, fillWidth / 2));
    ctx.fill();
  }
  ctx.restore();
};

const drawFixedJoystick = (
  ctx: CanvasRenderingContext2D,
  stick: { activeId: number; x: number; y: number; knobX: number; knobY: number },
  label: string,
  color: string
) => {
  ctx.save();

  // Backdrop dimming circle — separates control zone from gameplay
  ctx.globalAlpha = stick.activeId === -1 ? 0.42 : 0.72;
  ctx.fillStyle = "rgba(3, 7, 18, 0.7)";
  ctx.beginPath();
  ctx.arc(stick.x, stick.y, 66, 0, TAU);
  ctx.fill();

  // Outer ring
  ctx.globalAlpha = stick.activeId === -1 ? 0.5 : 0.9;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(stick.x, stick.y, 62, 0, TAU);
  ctx.stroke();

  // Inner directional cross
  ctx.globalAlpha = stick.activeId === -1 ? 0.12 : 0.25;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(stick.x - 50, stick.y);
  ctx.lineTo(stick.x + 50, stick.y);
  ctx.moveTo(stick.x, stick.y - 50);
  ctx.lineTo(stick.x, stick.y + 50);
  ctx.stroke();

  // Knob
  ctx.globalAlpha = stick.activeId === -1 ? 0.5 : 0.95;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(stick.knobX, stick.knobY, 24, 0, TAU);
  ctx.fill();

  // Knob highlight
  ctx.globalAlpha = 0.4;
  ctx.fillStyle = "#f8fafc";
  ctx.beginPath();
  ctx.arc(stick.knobX - 6, stick.knobY - 6, 8, 0, TAU);
  ctx.fill();

  // Label
  ctx.globalAlpha = 0.78;
  ctx.fillStyle = "#f8fafc";
  ctx.font = "800 10px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, stick.x, stick.y + 82);
  ctx.restore();
};
