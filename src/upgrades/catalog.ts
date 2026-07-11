export const upgradeTreeIds = [
  "gunpowder", "mirror", "reload", "frostfire", "blood",
  "souls", "crown", "gemcraft", "brood", "void"
] as const;

export type UpgradeTreeId = typeof upgradeTreeIds[number];
export type UpgradeTier = "root" | "branch" | "capstone" | "fusion";
export type UpgradeRarity = "common" | "uncommon" | "rare" | "epic" | "fusion";

export type UpgradeSpec = {
  id: string;
  name: string;
  tree: UpgradeTreeId | "fusion";
  tier: UpgradeTier;
  rarity: UpgradeRarity;
  description: string;
  requires: string[];
  tags: string[];
  fusionTrees?: [UpgradeTreeId, UpgradeTreeId];
};

const node = (
  id: string,
  name: string,
  tree: UpgradeTreeId,
  tier: Exclude<UpgradeTier, "fusion">,
  description: string,
  requires: string[] = [],
  tags: string[] = []
): UpgradeSpec => ({
  id, name, tree, tier, description, requires, tags,
  rarity: tier === "root" ? "common" : tier === "branch" ? "uncommon" : "epic"
});

const fusion = (
  id: string,
  name: string,
  trees: [UpgradeTreeId, UpgradeTreeId],
  description: string,
  requires: string[],
  tags: string[]
): UpgradeSpec => ({ id, name, tree: "fusion", tier: "fusion", rarity: "fusion", description, requires, tags, fusionTrees: trees });

export const upgradeCatalogue: UpgradeSpec[] = [
  node("split_chamber", "Split Chamber", "gunpowder", "root", "Hits release two weaker fragments.", [], ["onHit", "projectile", "generated"]),
  node("serrated_lead", "Serrated Lead", "gunpowder", "branch", "Fragments pierce once and inflict Bleed.", ["split_chamber"], ["onHit", "bleed", "pierce"]),
  node("powder_wake", "Powder Wake", "gunpowder", "branch", "Expired shots leave a damaging powder cloud.", ["split_chamber"], ["onBulletExpire", "area"]),
  node("recursive_gun", "Recursive Gun", "gunpowder", "capstone", "Fragments can split one additional generation with reduced damage.", ["serrated_lead", "powder_wake"], ["generated", "generationLimit"]),

  node("mirror_chamber", "Mirror Chamber", "mirror", "root", "Every sixth shot creates a weaker echo.", [], ["onShot", "echo"]),
  node("polished_bore", "Polished Bore", "mirror", "branch", "Echoes gain critical chance and projectile speed.", ["mirror_chamber"], ["echo", "critical"]),
  node("phantom_copy", "Phantom Copy", "mirror", "branch", "Echoes count as independent shots for triggered effects.", ["mirror_chamber"], ["echo", "onShot"]),
  node("hall_of_mirrors", "Hall of Mirrors", "mirror", "capstone", "Echoes inherit all elemental and on-shot effects.", ["polished_bore", "phantom_copy"], ["echo", "inheritance"]),

  node("static_prayer", "Static Prayer", "reload", "root", "Completing a reload strikes nearby enemies with lightning.", [], ["onReload", "lightning"]),
  node("quick_hands", "Quick Hands", "reload", "branch", "Kills accelerate the current reload and improve reload speed.", ["static_prayer"], ["onKill", "reload"]),
  node("empty_bell", "Empty Bell", "reload", "branch", "Reloading an empty weapon emits a larger nova.", ["static_prayer"], ["onReload", "area"]),
  node("thunder_magazine", "Thunder Magazine", "reload", "capstone", "Reload effects repeat once at reduced power.", ["quick_hands", "empty_bell"], ["onReload", "repeat"]),

  node("frostfire_rounds", "Frostfire Rounds", "frostfire", "root", "Shots alternate between Burn and Chill.", [], ["fire", "frost", "onHit"]),
  node("thermal_shock", "Thermal Shock", "frostfire", "branch", "Burning frozen targets erupt when struck.", ["frostfire_rounds"], ["fire", "frost", "area"]),
  node("brittle_core", "Brittle Core", "frostfire", "branch", "Frozen enemies take substantially more critical damage.", ["frostfire_rounds"], ["frost", "critical"]),
  node("solar_frostbite", "Solar Frostbite", "frostfire", "capstone", "Burn and Freeze coexist, then shatter into elemental shards.", ["thermal_shock", "brittle_core"], ["fire", "frost", "generated"]),

  node("blood_tax", "Blood Tax", "blood", "root", "Empty reloads spend health to release a blood nova.", [], ["blood", "onReload", "selfDamage"]),
  node("clot_armour", "Clot Armour", "blood", "branch", "Self-damage grants temporary shield.", ["blood_tax"], ["blood", "shield"]),
  node("red_refund", "Red Refund", "blood", "branch", "Blood-effect kills restore health.", ["blood_tax"], ["blood", "onKill", "healing"]),
  node("blood_economy", "Blood Economy", "blood", "capstone", "Healing, shield and reload costs convert into one another.", ["clot_armour", "red_refund"], ["blood", "conversion"]),

  node("grave_interest", "Grave Interest", "souls", "root", "Every sixth kill creates a Soul.", [], ["onKill", "soul"]),
  node("soul_blade", "Soul Blade", "souls", "branch", "Collected Souls create temporary orbiting blades.", ["grave_interest"], ["soul", "summon", "orbital"]),
  node("tithe", "Tithe", "souls", "branch", "Elite and cursed enemies create additional Souls.", ["grave_interest"], ["soul", "elite"]),
  node("undertaker_engine", "Undertaker Engine", "souls", "capstone", "Soul weapons inherit your projectile elements.", ["soul_blade", "tithe"], ["soul", "inheritance"]),

  node("crown_of_teeth", "Crown of Teeth", "crown", "root", "Gain an orbiting ritual blade.", [], ["summon", "orbital"]),
  node("wider_crown", "Wider Crown", "crown", "branch", "Orbit radius, impact size and damage increase.", ["crown_of_teeth"], ["orbital", "size"]),
  node("hungry_crown", "Hungry Crown", "crown", "branch", "Expired projectiles can briefly join the crown.", ["crown_of_teeth"], ["orbital", "onBulletExpire"]),
  node("storm_crown", "Storm Crown", "crown", "capstone", "Orbital hits trigger your on-hit effects at reduced power.", ["wider_crown", "hungry_crown"], ["orbital", "onHit"]),

  node("gem_bomb", "Gem Bomb", "gemcraft", "root", "Collected experience gems burst around the player.", [], ["onGemCollect", "area"]),
  node("greed_magnet", "Greed Magnet", "gemcraft", "branch", "Pickup distance and pull force increase.", ["gem_bomb"], ["pickup", "utility"]),
  node("compound_interest", "Compound Interest", "gemcraft", "branch", "Uncollected gems grow in value over time.", ["gem_bomb"], ["pickup", "economy"]),
  node("gem_singularity", "Gem Singularity", "gemcraft", "capstone", "Gem bursts pull enemies and nearby gems inward.", ["greed_magnet", "compound_interest"], ["pickup", "void", "area"]),

  node("parasite_rounds", "Parasite Rounds", "brood", "root", "Some kills hatch seeking blood larvae.", [], ["onKill", "summon", "blood"]),
  node("larval_split", "Larval Split", "brood", "branch", "Larva kills can hatch one weaker larva.", ["parasite_rounds"], ["summon", "generated"]),
  node("host_jump", "Host Jump", "brood", "branch", "Surviving larvae retarget after impact.", ["parasite_rounds"], ["summon", "retarget"]),
  node("brood_cascade", "Brood Cascade", "brood", "capstone", "Parasite chains create temporary Mites.", ["larval_split", "host_jump"], ["summon", "onKill"]),

  node("void_mark", "Void Mark", "void", "root", "Every seventh shot creates a pulling void pulse.", [], ["onShot", "void", "area"]),
  node("event_horizon", "Event Horizon", "void", "branch", "Enemies caught together share a portion of incoming damage.", ["void_mark"], ["void", "sharedDamage"]),
  node("deep_chamber", "Deep Chamber", "void", "branch", "Slow projectiles grow larger and stronger during travel.", ["void_mark"], ["void", "projectile", "size"]),
  node("black_hole_buckshot", "Black Hole Buckshot", "void", "capstone", "Nearby projectiles collapse into a short-lived singularity.", ["event_horizon", "deep_chamber"], ["void", "area", "projectile"]),

  fusion("recursive_arsenal", "Recursive Arsenal", ["gunpowder", "mirror"], "Echoed fragments recursively create weaker copies once per generation.", ["recursive_gun", "hall_of_mirrors"], ["echo", "generated"]),
  fusion("echoing_thunder", "Echoing Thunder", ["reload", "mirror"], "Reload lightning is mirrored into two weaker strikes.", ["thunder_magazine", "hall_of_mirrors"], ["reload", "lightning", "echo"]),
  fusion("frozen_brood", "Frozen Brood", ["frostfire", "brood"], "Shatters hatch seeking ice-blood larvae.", ["solar_frostbite", "brood_cascade"], ["frost", "summon"]),
  fusion("sanguine_tithe", "Sanguine Tithe", ["blood", "souls"], "Souls can pay blood costs and excess healing mints Souls.", ["blood_economy", "undertaker_engine"], ["blood", "soul"]),
  fusion("tempest_crown", "Tempest Crown", ["crown", "reload"], "Orbit hits can invoke reduced reload lightning.", ["storm_crown", "thunder_magazine"], ["orbital", "reload", "lightning"]),
  fusion("hungry_singularity", "Hungry Singularity", ["gemcraft", "void"], "Gem singularities consume projectiles and release their damage.", ["gem_singularity", "black_hole_buckshot"], ["gem", "void"]),
  fusion("elemental_undertaker", "Elemental Undertaker", ["souls", "frostfire"], "Soul blades alternate fire and frost and can trigger shatters.", ["undertaker_engine", "solar_frostbite"], ["soul", "fire", "frost"]),
  fusion("crimson_brood", "Crimson Brood", ["blood", "brood"], "Blood healing hatches larvae; larva deaths grant Clot Armour.", ["blood_economy", "brood_cascade"], ["blood", "summon"]),
  fusion("shattered_horizon", "Shattered Horizon", ["frostfire", "void"], "Void clusters detonate all Freeze stacks as a shared shatter.", ["solar_frostbite", "black_hole_buckshot"], ["frost", "void"]),
  fusion("phantom_crown", "Phantom Crown", ["mirror", "crown"], "Mirrored shots become temporary orbitals when they expire.", ["hall_of_mirrors", "storm_crown"], ["echo", "orbital"])
];

export const upgradeById = new Map(upgradeCatalogue.map((upgrade) => [upgrade.id, upgrade]));

export const upgradeTrees = upgradeTreeIds.map((id) => ({
  id,
  nodes: upgradeCatalogue.filter((upgrade) => upgrade.tree === id)
}));
