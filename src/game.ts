export type InputState = {
  moveX: number;
  moveY: number;
  aimX: number;
  aimY: number;
  firing: boolean;
};

type Vec = { x: number; y: number };
export type CharacterId = string;
export type WeaponId = string;

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

type UpgradeId = string;

type Enemy = {
  id: number;
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
};

type Bullet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  damage: number;
  life: number;
  pierce: number;
  bounces: number;
  split: number;
  crit: number;
  element: "kinetic" | "lightning" | "fire" | "ice" | "blood" | "void";
  depth: number;
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

type Orbital = {
  angle: number;
  distance: number;
  damage: number;
  life: number;
  speed: number;
  kind: SummonKind;
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
  ui: {
    time: string;
    level: string;
    kills: string;
    hpPct: number;
    xpPct: number;
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

const TAU = Math.PI * 2;
const DEFAULT_LOADOUT: LoadoutConfig = { characterId: "saint", weaponId: "revolver" };

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

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const len = (x: number, y: number) => Math.hypot(x, y) || 1;
const has = (game: Game, id: UpgradeId) => (game.upgrades[id] || 0) > 0;
const count = (game: Game, id: UpgradeId) => game.upgrades[id] || 0;
const addUpgrade = (game: Game, id: UpgradeId) => {
  game.upgrades[id] = (game.upgrades[id] || 0) + 1;
};

const rawUpgradeDefs: Omit<UpgradeDef, "apply">[] = ([
  ["heavy_caliber", "Heavy Caliber", "ballistics", "common", "+22% projectile damage, -10% fire rate."],
  ["long_barrel", "Long Barrel", "ballistics", "common", "+22% projectile speed, +18% range."],
  ["rifled_jacket", "Rifled Jacket", "ballistics", "uncommon", "+1 pierce; each pierce after the first reduces remaining damage."],
  ["buckshot", "Buckshot", "ballistics", "uncommon", "Multi-pellet weapons gain +2 pellets; single-projectile weapons gain angled side shots; -12% range."],
  ["soft_lead", "Soft Lead", "ballistics", "common", "+35% knockback, +14% projectile size, -12% projectile speed."],
  ["collateral", "Collateral", "ballistics", "rare", "Overkill deals 40% excess damage in a splash."],
  ["twin_feed", "Twin Feed", "ballistics", "rare", "+1 projectile, -18% projectile damage."],
  ["giant_killer", "Giant Killer", "ballistics", "uncommon", "+30% damage to elites, bosses, and healthy enemies."],
  ["pinpoint", "Pinpoint", "ballistics", "common", "-20% spread; distant targets take extra crit chance."],
  ["serrated_rounds", "Serrated Rounds", "ballistics", "uncommon", "Crits and pierces apply Bleed; +10% direct hit damage."],
  ["rebound", "Rebound", "ballistics", "rare", "+1 bounce; bounced projectiles deal reduced damage."],
  ["shadow_round", "Shadow Round", "ballistics", "epic", "Every fourth shot becomes ethereal, faster, and piercing."],
  ["bracer_core", "Bracer Core", "ballistics", "common", "+18% projectile size and hit radius; +10% splash radius."],
  ["momentum_shot", "Momentum Shot", "ballistics", "uncommon", "Projectile damage increases with distance travelled."],
  ["fin_stabilizer", "Fin Stabilizer", "ballistics", "common", "+14% projectile speed, +10% fire rate, -15% spread bloom."],
  ["armour_breaker", "Armour Breaker", "ballistics", "rare", "Ignore armour and deal bonus damage to plated enemies."],
  ["fast_hands", "Fast Hands", "reload", "common", "-18% reload time."],
  ["extended_magazine", "Extended Magazine", "magazine", "common", "+35% ammo capacity, -10% reload speed."],
  ["fresh_clip", "Fresh Clip", "reload", "uncommon", "First shot after reload deals +35% damage and gains size."],
  ["last_straw", "Last Straw", "magazine", "uncommon", "Final 20% of the magazine gains damage and crit chance."],
  ["bottomless_habit", "Bottomless Habit", "magazine", "rare", "18% chance to not consume ammo."],
  ["quick_rack", "Quick Rack", "reload", "common", "Move faster while reloading; moving reloads faster."],
  ["chamber_trick", "Chamber Trick", "reload", "rare", "Perfect empty reload grants a phantom high-damage round."],
  ["tactical_reload", "Tactical Reload", "reload", "uncommon", "Reloading before empty makes the next reload faster and grants speed."],
  ["backpressure", "Backpressure", "magazine", "uncommon", "Below 30% magazine, fire rate rises."],
  ["empty_chamber", "Empty Chamber", "reload", "uncommon", "Hitting 0 ammo fires a shrapnel ring."],
  ["ammo_printer", "Ammo Printer", "magazine", "rare", "Every 8 kills refund 1 ammo."],
  ["hair_trigger", "Hair Trigger", "fire_rate", "common", "+18% fire rate, +8% spread."],
  ["deadeye", "Deadeye", "critical", "common", "+10% critical chance, +8% projectile speed."],
  ["glass_eye", "Glass Eye", "critical", "rare", "+30% critical damage, -12% maximum health."],
  ["hollow_point", "Hollow Point", "critical", "uncommon", "Critical hits ignore armour and apply Bleed."],
  ["headhunter", "Headhunter", "critical", "epic", "Critting elites or bosses grants crit chance; overkill crits spawn shards."],
  ["ember_touch", "Ember Touch", "fire", "common", "+2 flat fire damage on hit; chance to apply Burn."],
  ["firestarter", "Firestarter", "fire", "uncommon", "Hits have a stronger chance to apply Burn."],
  ["lingering_flame", "Lingering Flame", "fire", "uncommon", "Kills leave flame pools."],
  ["napalm", "Napalm", "fire", "rare", "Flame pools and explosions gain radius and Burn stacks."],
  ["pyromaniac", "Pyromaniac", "fire", "uncommon", "+25% damage to burning enemies."],
  ["thermal_lance", "Thermal Lance", "fire", "rare", "Burned enemies lose armour; projectiles gain damage after passing through fire."],
  ["ash_wake", "Ash Wake", "fire", "rare", "Burning enemy deaths explode and spread Burn."],
  ["cauterize", "Cauterize", "fire", "epic", "Burn kills heal or shield you."],
  ["cold_touch", "Cold Touch", "frost", "common", "Hits apply Chill; enough Chill freezes."],
  ["deep_freeze", "Deep Freeze", "frost", "uncommon", "Freeze duration increases."],
  ["permafrost", "Permafrost", "frost", "rare", "Frozen enemies take more damage after thaw."],
  ["brittle", "Brittle", "frost", "rare", "Frozen enemies take much higher critical damage."],
  ["ice_bloom", "Ice Bloom", "frost", "uncommon", "Frozen enemy deaths release ice shards."],
  ["cold_snap", "Cold Snap", "frost", "rare", "Every fifth Chill application instantly freezes."],
  ["rime_ward", "Rime Ward", "frost", "epic", "Freezing an enemy grants shield."],
  ["snowdrift", "Snowdrift", "frost", "uncommon", "Standing still emits Chill pulses."],
  ["static_touch", "Static Touch", "shock", "common", "Hits have a chance to apply Shock."],
  ["chain_spark", "Chain Spark", "shock", "uncommon", "Shock chains to +1 target and gains range.", ["static_touch"]],
  ["overcharge", "Overcharge", "shock", "rare", "Hitting shocked enemies deals bonus damage and consumes Shock."],
  ["capacitor", "Capacitor", "shock", "rare", "Reloading zaps the nearest shocked enemies."],
  ["ionized", "Ionized", "shock", "uncommon", "Projectile speed also grants shock chance and shock damage."],
  ["thunderhead", "Thunderhead", "shock", "epic", "Shocked, frozen, or stunned deaths fire lightning jumps."],
  ["conductor", "Conductor", "shock", "rare", "Orbiting, returning, and split projectiles shock and chain harder."],
  ["stormcall", "Stormcall", "shock", "epic", "Every 18 Shock applications calls a lightning strike."],
  ["venom_tip", "Venom Tip", "poison", "common", "Hits can Poison."],
  ["neurotoxin", "Neurotoxin", "poison", "uncommon", "Poison slows enemies and can crit."],
  ["rotheart", "Rotheart", "poison", "rare", "Poisoned low-health enemies take much more damage."],
  ["hemorrhage", "Hemorrhage", "bleed", "uncommon", "Critical hits can apply Bleed."],
  ["blood_scent", "Blood Scent", "bleed", "uncommon", "Move faster and hit harder near bleeding enemies."],
  ["hex_mark", "Hex Mark", "curse", "common", "Every fifth hit on the same target applies Curse."],
  ["malediction", "Malediction", "curse", "rare", "Curse cap and damage taken increase."],
  ["corrosion", "Corrosion", "poison", "rare", "Poison reduces armour over time."],
  ["wisp_egg", "Wisp Egg", "summon", "common", "Summon 1 Wisp that fires bolts."],
  ["hound_whistle", "Hound Whistle", "summon", "common", "Summon 1 Hound that bites nearby enemies."],
  ["bone_turret", "Bone Turret", "summon", "uncommon", "On reload, deploy a temporary turret."],
  ["mender_drone", "Mender Drone", "summon", "rare", "Orbiting drone restores health or shield."],
  ["broodmother", "Broodmother", "summon", "uncommon", "Kills can spawn explosive Mites."],
  ["familiar_training", "Familiar Training", "summon", "common", "Summons gain damage and move speed."],
  ["soul_shepherd", "Soul Shepherd", "summon", "rare", "Elite and cursed kills drop Souls; Souls spawn Wisps."],
  ["pack_tactics", "Pack Tactics", "summon", "rare", "Player gains damage per active summon."],
  ["sacrificial_rite", "Sacrificial Rite", "summon", "epic", "Summon death explodes and applies your best status."],
  ["twin_spawn", "Twin Spawn", "summon", "rare", "The first summon created by a source duplicates."],
  ["leash_breaker", "Leash Breaker", "summon", "uncommon", "Summons roam farther and retarget faster."],
  ["rally_signal", "Rally Signal", "summon", "rare", "Active ability commands summons to dash and enrage."],
  ["vampiric_shell", "Vampiric Shell", "sustain", "rare", "Lifesteal direct and status damage."],
  ["bulwark", "Bulwark", "defence", "common", "+2 armour, -8% move speed."],
  ["phase_boots", "Phase Boots", "utility", "uncommon", "Dash cooldown and invulnerability improve."],
  ["greed", "Greed", "economy", "common", "Experience gems and elite Soul value increase."],
  ["magnetism", "Magnetism", "utility", "common", "Pickup radius and pull strength increase."],
  ["scholars_habit", "Scholar's Habit", "utility", "uncommon", "Gain rerolls and improve high-synergy drafting."],
  ["scavenger", "Scavenger", "economy", "rare", "Every 10 destroyed enemies drop ammo or shield."],
  ["grit", "Grit", "defence", "epic", "Survive one lethal hit per run."],
  ["afterimage", "Afterimage", "defence", "rare", "Dashing leaves a taunting clone that explodes."],
  ["battle_meditation", "Battle Meditation", "utility", "uncommon", "Standing still grants reload speed and accuracy."],
  ["soul_furnace", "Soul Furnace", "economy", "rare", "Souls grant temporary all-damage stacks."],
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
      invuln: 0,
      souls: 0,
      orbitals: []
    },
    enemies: [],
    bullets: [],
    gems: [],
    particles: [],
    upgrades: {},
    time: 0,
    spawnTimer: 0,
    level: 1,
    xp: 0,
    nextXp: 12,
    kills: 0,
    shotCounter: 0,
    idCounter: 1,
    gameOver: false,
    ui: {
      time: "00:00",
      level: "1",
      kills: "0",
      hpPct: 100,
      xpPct: 0,
      gameOver: false
    }
  };

  applyWeapon(game, loadout.weaponId);
  applyCharacter(game, loadout.characterId);
  for (let i = 0; i < 12; i += 1) spawnEnemy(game, true);
  updateUi(game);
  return game;
};

export const getUpgradeChoices = (game: Game): Choice[] => {
  const available = upgradeDefs.filter((upgrade) => {
    if ((upgrade.fusion || upgrade.law) && has(game, upgrade.id)) return false;
    if (upgrade.law && game.level < 6) return false;
    if (upgrade.requires && !upgrade.requires.every((id) => has(game, id))) return false;
    return true;
  });

  const fusions = available.filter((upgrade) => upgrade.fusion);
  const basics = available.filter((upgrade) => !upgrade.fusion);
  const pool = [...fusions, ...shuffle(basics)].slice(0, Math.max(3, fusions.length ? 2 : 3));

  return shuffle(pool).slice(0, 3);
};

function applyUpgrade(game: Game, id: UpgradeId) {
  const player = game.player;
  addUpgrade(game, id);

  switch (id) {
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
    case "familiar_training":
    case "twin_spawn":
    case "leash_breaker":
    case "rally_signal":
      player.summonDamage *= 1.18;
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
    addUpgrade(game, "fresh_clip");
  }
  if (characterId === "ilya") {
    player.damage *= 0.9;
    player.lightningDamage *= 1.18;
    player.speed *= 1.06;
    player.activeCooldown = 12;
    addUpgrade(game, "static_touch");
  }
  if (characterId === "nox") {
    player.maxHp = Math.max(55, player.maxHp - 20);
    player.hp = Math.min(player.hp, player.maxHp);
    player.summonDamage *= 1.12;
    player.poisonDamage *= 1.14;
    player.activeCooldown = 16;
    addUpgrade(game, "venom_tip");
  }
  if (characterId === "mira") {
    player.reloadSpeed *= 0.88;
    player.crit += 0.04;
    player.activeCooldown = 20;
    addUpgrade(game, "rebound");
  }
  if (characterId === "scarlett") {
    player.bulletSpeed *= 0.9;
    player.fireDamage *= 1.2;
    player.activeCooldown = 18;
    addUpgrade(game, "ember_touch");
  }
  if (characterId === "corvus") {
    player.crit += 0.08;
    player.critDamage *= 1.1;
    player.curseDamage *= 1.14;
    player.activeCooldown = 16;
    addUpgrade(game, "hex_mark");
  }
  if (characterId === "kaden") {
    player.fireRate *= 0.85;
    player.armour += 2;
    player.maxHp += 18;
    player.hp += 18;
    player.activeCooldown = 22;
    addUpgrade(game, "bulwark");
  }
  if (characterId === "lyra") {
    player.damage *= 0.88;
    player.summonDamage *= 1.25;
    player.activeCooldown = 18;
    addUpgrade(game, "hound_whistle");
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

export const stepGame = (game: Game, input: InputState, dt: number): boolean => {
  const player = game.player;
  game.time += dt;
  player.cooldown -= dt;
  player.reload = Math.max(0, player.reload - dt);
  if (player.reload <= 0) player.reloadDuration = 0;
  player.dashCooldown -= dt;
  player.invuln -= dt;
  game.spawnTimer -= dt;

  const moveLen = len(input.moveX, input.moveY);
  const moving = Math.abs(input.moveX) + Math.abs(input.moveY) > 0.03;
  if (moving) {
    player.x += (input.moveX / moveLen) * player.speed * dt;
    player.y += (input.moveY / moveLen) * player.speed * dt;
  }

  if (game.spawnTimer <= 0) {
    const amount = 1 + Math.floor(game.time / 28);
    for (let i = 0; i < amount; i += 1) spawnEnemy(game);
    game.spawnTimer = Math.max(0.22, 0.92 - game.time * 0.006);
  }

  if (input.firing && player.reload <= 0 && player.cooldown <= 0) shoot(game, input);
  updateBullets(game, dt);
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

  if (player.hp <= 0) game.gameOver = true;
  updateUi(game);
  return leveled;
};

export const drawGame = (
  ctx: CanvasRenderingContext2D,
  game: Game,
  controls: {
    move: { activeId: number; x: number; y: number; knobX: number; knobY: number };
    aim: { activeId: number; x: number; y: number; knobX: number; knobY: number };
  }
) => {
  const { w, h } = game.screen;
  const camera = {
    x: w / 2 - game.player.x,
    y: h / 2 - game.player.y
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
    ctx.fillStyle = "#a78bfa";
    diamond(ctx, gem.x, gem.y, 4 + gem.value * 0.4);
  }

  for (const bullet of game.bullets) {
    drawBullet(ctx, bullet, game.player.weaponSpecial, game.time);
  }

  for (const orbital of game.player.orbitals) {
    const x = game.player.x + Math.cos(orbital.angle) * orbital.distance;
    const y = game.player.y + Math.sin(orbital.angle) * orbital.distance;
    drawSummon(ctx, orbital, x, y, game.time, has(game, "conductor"));
  }

  for (const enemy of game.enemies) {
    const hpPct = enemy.hp / enemy.maxHp;
    ctx.beginPath();
    ctx.fillStyle = enemy.freeze > 0 ? "#7dd3fc" : enemy.burn > 0 ? "#fb923c" : "#e11d48";
    ctx.globalAlpha = enemy.hitFlash > 0 ? 0.62 : 0.92;
    ctx.arc(enemy.x, enemy.y, enemy.r, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#320715";
    ctx.fillRect(enemy.x - enemy.r, enemy.y - enemy.r - 8, enemy.r * 2, 3);
    ctx.fillStyle = "#fda4af";
    ctx.fillRect(enemy.x - enemy.r, enemy.y - enemy.r - 8, enemy.r * 2 * hpPct, 3);
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

  drawFixedJoystick(ctx, controls.move, "Move", "#93c5fd");
  drawFixedJoystick(ctx, controls.aim, "Shoot", "#fb7185");
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
  mods: Partial<Pick<Bullet, "split" | "bounces" | "crit" | "pierce" | "depth">> = {}
) => {
  const speed = game.player.bulletSpeed;
  game.bullets.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: element === "void" ? game.player.bulletSize + 2 : game.player.bulletSize,
    damage,
    life: game.player.bulletLife,
    pierce: mods.pierce ?? 0,
    bounces: mods.bounces ?? 0,
    split: mods.split ?? 0,
    crit: mods.crit ?? 0,
    element,
    depth: mods.depth ?? 0
  });
};

const updateBullets = (game: Game, dt: number) => {
  for (let i = game.bullets.length - 1; i >= 0; i -= 1) {
    const bullet = game.bullets[i];
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;

    const bounced = bounceBullet(game, bullet);
    if (bounced && (has(game, "conductor") || has(game, "recursive_gun"))) chainLightning(game, bullet.x, bullet.y, 70, 5 * game.player.lightningDamage);

    let remove = bullet.life <= 0;
    for (const enemy of game.enemies) {
      const d = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);
      if (d > enemy.r + bullet.r) continue;

      const crit = Math.random() < bullet.crit;
      const damage = bullet.damage * (crit ? game.player.critDamage : 1);
      hurtEnemy(game, enemy, damage, bullet.element);
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
          kind: "orb"
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

const updateEnemies = (game: Game, dt: number) => {
  const player = game.player;

  for (let i = game.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = game.enemies[i];
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const d = len(dx, dy);
    const freezeSlow = enemy.freeze > 0 ? 0.38 : 1;
    enemy.x += (dx / d) * enemy.speed * freezeSlow * dt;
    enemy.y += (dy / d) * enemy.speed * freezeSlow * dt;
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
      if (has(game, "gem_singularity")) {
        explode(game, gem.x, gem.y, 76 + count(game, "gem_singularity") * 14, 16 + gem.value * 2, "#a78bfa");
        pullEnemies(game, gem.x, gem.y, 108, 26);
        collectNearbyGems(game, gem.x, gem.y, 72);
      }
      game.gems.splice(i, 1);
    }
  }
};

const updateOrbitals = (game: Game, dt: number) => {
  const player = game.player;
  for (let i = player.orbitals.length - 1; i >= 0; i -= 1) {
    const orbital = player.orbitals[i];
    orbital.angle += orbital.speed * dt;
    orbital.life -= dt;
    const x = player.x + Math.cos(orbital.angle) * orbital.distance;
    const y = player.y + Math.sin(orbital.angle) * orbital.distance;
    for (const enemy of game.enemies) {
      if (Math.hypot(enemy.x - x, enemy.y - y) < enemy.r + 8) {
        hurtEnemy(game, enemy, orbital.damage * dt * 5, has(game, "conductor") ? "lightning" : "kinetic");
        if (has(game, "conductor") && Math.random() < 0.08) chainLightning(game, x, y, 66, 4 * player.lightningDamage);
      }
    }
    if (orbital.life <= 0) player.orbitals.splice(i, 1);
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

const hurtEnemy = (game: Game, enemy: Enemy, amount: number, element: Bullet["element"], flash = true) => {
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
      damageText(game, enemy, damage, bulletColor(element));
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
};

const killEnemy = (game: Game, enemy: Enemy) => {
  game.kills += 1;
  game.gems.push({ x: enemy.x, y: enemy.y, value: (enemy.maxHp > 50 ? 4 : 2) * (has(game, "greed") ? 1.15 : 1), magnet: rand(0, 16) });
  burst(game, enemy.x, enemy.y, "#fb7185", 9);

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
      game.player.orbitals.push({ angle: rand(0, TAU), distance: rand(46, 78), damage: 10, life: 16, speed: rand(3, 5), kind: "blade" });
      text(game, enemy.x, enemy.y - 20, "soul blade", "#c4b5fd");
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

const spawnEnemy = (game: Game, anywhere = false) => {
  const edge = Math.floor(rand(0, 4));
  const margin = 80;
  const halfW = game.screen.w / 2;
  const halfH = game.screen.h / 2;
  let x = game.player.x + rand(-halfW, halfW);
  let y = game.player.y + rand(-halfH, halfH);
  if (anywhere) {
    const angle = rand(0, TAU);
    const distance = rand(120, Math.max(halfW, halfH) + margin);
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
  const elite = Math.random() < Math.min(0.04 + minutes * 0.03, 0.22);
  const hp = elite ? 58 + minutes * 24 : 18 + minutes * 8;
  game.enemies.push({
    id: game.idCounter,
    x,
    y,
    r: elite ? 17 : rand(9, 13),
    hp,
    maxHp: hp,
    speed: elite ? rand(38, 58) : rand(54, 82) + minutes * 5,
    damage: elite ? 22 : 12,
    burn: 0,
    freeze: 0,
    poison: 0,
    shock: 0,
    bleed: 0,
    curse: 0,
    hitFlash: 0,
    damageNoticeCooldown: 0
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
  player.orbitals.push({
    angle: rand(0, TAU),
    distance: rand(46, has(game, "leash_breaker") ? 96 : 78),
    damage,
    life,
    speed: rand(2.8, 5.2) * (has(game, "familiar_training") ? 1.2 : 1),
    kind
  });
  if (has(game, "twin_spawn") && player.orbitals.length < cap && Math.random() < 0.5) {
    player.orbitals.push({
      angle: rand(0, TAU),
      distance: rand(46, has(game, "leash_breaker") ? 96 : 78),
      damage: damage * 0.75,
      life,
      speed: rand(2.8, 5.2),
      kind
    });
  }
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

const damageText = (game: Game, enemy: Enemy, amount: number, color: string) => {
  const value = amount < 2 ? amount.toFixed(1) : String(Math.round(amount));
  game.particles.push({
    x: enemy.x + rand(-enemy.r * 0.45, enemy.r * 0.45),
    y: enemy.y - enemy.r - 6,
    vx: rand(-14, 14),
    vy: rand(-46, -28),
    life: 0.62,
    color,
    text: value,
    size: amount > 28 ? 18 : amount > 12 ? 15 : 13
  });
};

const updateUi = (game: Game) => {
  const minutes = Math.floor(game.time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(game.time % 60)
    .toString()
    .padStart(2, "0");
  game.ui = {
    time: `${minutes}:${seconds}`,
    level: String(game.level),
    kills: String(game.kills),
    hpPct: clamp((game.player.hp / game.player.maxHp) * 100, 0, 100),
    xpPct: clamp((game.xp / game.nextXp) * 100, 0, 100),
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

const bulletColor = (element: Bullet["element"]) => {
  if (element === "lightning") return "#72f5ff";
  if (element === "fire") return "#fb923c";
  if (element === "ice") return "#93c5fd";
  if (element === "blood") return "#fb7185";
  if (element === "void") return "#c084fc";
  return "#f8fafc";
};

const hashTile = (x: number, y: number, salt = 0) => {
  const n = Math.sin(x * 127.1 + y * 311.7 + salt * 74.7) * 43758.5453123;
  return n - Math.floor(n);
};

const drawProceduralStage = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number, camera: Vec) => {
  const grid = 48;
  const tile = 96;
  const worldLeft = -camera.x;
  const worldTop = -camera.y;
  const worldRight = worldLeft + w;
  const worldBottom = worldTop + h;

  ctx.strokeStyle = "rgba(148, 163, 184, 0.055)";
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

      if (roll < 0.42) {
        ctx.fillStyle = roll < 0.2 ? "rgba(30, 41, 59, 0.18)" : "rgba(88, 28, 135, 0.08)";
        ctx.beginPath();
        ctx.roundRect(sx + 10 + roll2 * 32, sy + 12 + roll3 * 28, 28 + roll * 54, 12 + roll2 * 22, 8);
        ctx.fill();
      }

      if (roll2 > 0.73) {
        ctx.strokeStyle = "rgba(196, 181, 253, 0.12)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx + 14 + roll * 36, sy + 20);
        ctx.lineTo(sx + 38 + roll2 * 34, sy + 42 + Math.sin(time + tx) * 2);
        ctx.lineTo(sx + 22 + roll3 * 56, sy + 74);
        ctx.stroke();
      }

      if (roll3 > 0.86) {
        ctx.save();
        ctx.translate(sx + 18 + roll * 62, sy + 18 + roll2 * 62);
        ctx.rotate((tx - ty) * 0.4);
        ctx.fillStyle = "rgba(125, 211, 252, 0.12)";
        diamond(ctx, 0, 0, 5 + roll * 5);
        ctx.restore();
      }
    }
  }
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

const characterVisuals: Record<string, { primary: string; secondary: string; glyph: string }> = {
  saint: { primary: "#f8fafc", secondary: "#fde68a", glyph: "S" },
  ilya: { primary: "#72f5ff", secondary: "#2563eb", glyph: "I" },
  nox: { primary: "#86efac", secondary: "#16a34a", glyph: "N" },
  mira: { primary: "#e9d5ff", secondary: "#a78bfa", glyph: "M" },
  scarlett: { primary: "#fb923c", secondary: "#dc2626", glyph: "R" },
  corvus: { primary: "#c4b5fd", secondary: "#1f123d", glyph: "C" },
  kaden: { primary: "#fed7aa", secondary: "#92400e", glyph: "K" },
  lyra: { primary: "#f0abfc", secondary: "#7c3aed", glyph: "L" }
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

const drawCharacter = (ctx: CanvasRenderingContext2D, player: Player, time: number, reloading: boolean) => {
  const visual = characterVisuals[player.characterId] || characterVisuals.saint;
  const pulse = reloading ? Math.sin(time * 18) * 2 : Math.sin(time * 6) * 0.9;

  ctx.save();
  ctx.shadowColor = reloading ? "#fde68a" : visual.primary;
  ctx.shadowBlur = reloading ? 18 : 11;
  ctx.fillStyle = "rgba(3, 7, 18, 0.82)";
  ctx.strokeStyle = visual.secondary;
  ctx.lineWidth = 2.5;

  if (player.characterId === "kaden") {
    drawPolygon(ctx, [
      { x: 0, y: -player.r - 7 - pulse },
      { x: player.r + 9, y: -3 },
      { x: player.r + 5, y: player.r + 5 },
      { x: 0, y: player.r + 11 + pulse },
      { x: -player.r - 5, y: player.r + 5 },
      { x: -player.r - 9, y: -3 }
    ]);
  } else if (player.characterId === "corvus") {
    drawPolygon(ctx, [
      { x: 0, y: -player.r - 8 - pulse },
      { x: player.r + 14, y: player.r + 3 },
      { x: player.r * 0.32, y: player.r + 1 },
      { x: 0, y: player.r + 12 },
      { x: -player.r * 0.32, y: player.r + 1 },
      { x: -player.r - 14, y: player.r + 3 }
    ]);
  } else if (player.characterId === "scarlett") {
    drawPolygon(ctx, [
      { x: 0, y: -player.r - 11 - pulse },
      { x: player.r + 8, y: -2 },
      { x: player.r + 2, y: player.r + 10 },
      { x: 0, y: player.r + 5 },
      { x: -player.r - 2, y: player.r + 10 },
      { x: -player.r - 8, y: -2 }
    ]);
  } else if (player.characterId === "mira") {
    ctx.globalAlpha = 0.36;
    ctx.fillStyle = visual.secondary;
    diamond(ctx, -8, 2, player.r + 2);
    diamond(ctx, 8, 2, player.r + 2);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(3, 7, 18, 0.82)";
    diamond(ctx, 0, 0, player.r + 6 + pulse);
  } else if (player.characterId === "ilya") {
    drawPolygon(ctx, [
      { x: -player.r - 3, y: -player.r - 4 },
      { x: 2, y: -player.r - 4 - pulse },
      { x: -3, y: -1 },
      { x: player.r + 6, y: -1 },
      { x: -2, y: player.r + 9 + pulse },
      { x: 2, y: 4 },
      { x: -player.r - 6, y: 4 }
    ]);
  } else if (player.characterId === "lyra") {
    ctx.beginPath();
    ctx.arc(0, 0, player.r + 7 + pulse, 0.2 * Math.PI, 1.8 * Math.PI);
    ctx.closePath();
  } else if (player.characterId === "nox") {
    drawPolygon(ctx, [
      { x: 0, y: -player.r - 8 - pulse },
      { x: player.r + 6, y: -player.r * 0.35 },
      { x: player.r + 8, y: player.r * 0.55 },
      { x: player.r * 0.3, y: player.r + 11 },
      { x: -player.r * 0.3, y: player.r + 11 },
      { x: -player.r - 8, y: player.r * 0.55 },
      { x: -player.r - 6, y: -player.r * 0.35 }
    ]);
  } else {
    diamond(ctx, 0, 0, player.r + 6 + pulse);
  }

  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = visual.primary;
  ctx.strokeStyle = "rgba(3, 7, 18, 0.74)";
  ctx.lineWidth = 3;
  ctx.font = "700 12px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText(visual.glyph, 0, 1);
  ctx.fillText(visual.glyph, 0, 1);

  drawWeaponBadge(ctx, player.weaponSpecial, visual.primary);
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
  ctx.shadowBlur = bullet.element === "kinetic" ? 8 : 14;
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
  const color = charged ? "#72f5ff" : summonColor(orbital.kind);
  const bob = Math.sin(time * 8 + orbital.angle) * 1.5;

  ctx.save();
  ctx.translate(x, y + bob);
  ctx.rotate(orbital.angle + time * (orbital.kind === "chakram" ? 5 : 1.2));
  ctx.shadowColor = color;
  ctx.shadowBlur = 11;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  if (orbital.kind === "hound") {
    drawCapsule(ctx, 0, 1, 18, 9);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(9, -4, 5, 0, TAU);
    ctx.fill();
    ctx.fillRect(-7, 5, 4, 6);
    ctx.fillRect(4, 5, 4, 6);
  } else if (orbital.kind === "turret") {
    ctx.fillStyle = "rgba(3, 7, 18, 0.76)";
    ctx.fillRect(-7, -7, 14, 14);
    ctx.strokeRect(-7, -7, 14, 14);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(15, 0);
    ctx.stroke();
  } else if (orbital.kind === "drone") {
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-13, 0);
    ctx.lineTo(-6, 0);
    ctx.moveTo(6, 0);
    ctx.lineTo(13, 0);
    ctx.stroke();
  } else if (orbital.kind === "mite" || orbital.kind === "wasp") {
    drawPolygon(ctx, [
      { x: 10, y: 0 },
      { x: 0, y: -7 },
      { x: -9, y: -4 },
      { x: -5, y: 0 },
      { x: -9, y: 4 },
      { x: 0, y: 7 }
    ]);
    ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.ellipse(-1, -7, 6, 3, -0.5, 0, TAU);
    ctx.ellipse(-1, 7, 6, 3, 0.5, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
  } else if (orbital.kind === "blade" || orbital.kind === "chakram") {
    ctx.beginPath();
    ctx.arc(0, 0, orbital.kind === "chakram" ? 10 : 8, 0, TAU);
    ctx.arc(0, 0, orbital.kind === "chakram" ? 4 : 2, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-11, 0);
    ctx.lineTo(11, 0);
    ctx.stroke();
  } else if (orbital.kind === "wisp") {
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, TAU);
    ctx.stroke();
    ctx.globalAlpha = 1;
  } else {
    diamond(ctx, 0, 0, 8);
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
  ctx.globalAlpha = stick.activeId === -1 ? 0.5 : 0.86;
  ctx.fillStyle = "rgba(7, 10, 24, 0.52)";
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(stick.x, stick.y, 62, 0, TAU);
  ctx.fill();
  ctx.stroke();

  ctx.globalAlpha = stick.activeId === -1 ? 0.42 : 0.95;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(stick.knobX, stick.knobY, 24, 0, TAU);
  ctx.fill();

  ctx.globalAlpha = 0.78;
  ctx.fillStyle = "#f8fafc";
  ctx.font = "800 10px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, stick.x, stick.y + 82);
  ctx.restore();
};
