# Midnight Engine Deep Systems Plan

This document is the longer-form design target for the next prototype passes. The guiding reference is 20 Minutes Till Dawn: pick a character, pick a weapon, survive a timed run, and turn a small set of clear upgrade trees into ridiculous synergies.

## Design Pillars

- Every character has a passive identity, an active button, and at least one obvious broken build path.
- Every weapon changes how the player moves, values upgrades, and survives pressure.
- Elements are damage sources, status engines, and synergy tags.
- Summons are not one tree only. They can inherit bullets, elements, reload effects, souls, curses, and gem effects.
- Bullet stats must be readable enough to compare, but flexible enough to mutate into chaos.
- Bonkers builds are allowed. Infinite loops are allowed to look infinite, but they need decay, cooldowns, caps, or escalating risk.

## Combat Tags

Each source of damage should carry tags. Upgrade logic can then ask for tags instead of hardcoding every interaction.

| Tag | Used By | Notes |
|---|---|---|
| `bullet` | Guns, split shots, copied shots | Main upgrade target for size, damage, speed, range, pierce, bounce, crit, reload, and ammo. |
| `element` | Fire, frost, lightning, blood, void, decay | Status and proc systems attach here. |
| `summon` | Familiars, turrets, orbitals, clones | Summon scaling should be separate from bullet scaling, but inheritance can bridge them. |
| `reload` | Empty-magazine effects, nova effects | Creates 20MTD-style reload builds. |
| `dash` | Active movement, afterimages | Lets mobility become a trigger engine. |
| `gem` | XP pickup explosions, magnet builds | Turns progression into a combat source. |
| `soul` | Kill currency, orbitals, sacrifice | Death economy and risk/reward builds. |
| `curse` | Penalty-as-scaling upgrades | Adds opt-in danger for stronger builds. |

## Elemental Damage Sources

Elements should be simple alone and weird together.

| Element | Base Effect | Stacking Rule | Combo Hooks |
|---|---|---|---|
| Fire | Applies burn damage over time. | More stacks increase damage and refresh duration. | Frozen burning enemies can shatter; lightning can ignite nearby burned enemies. |
| Frost | Slows enemies and can freeze after enough stacks. | Stacks build toward freeze, then decay after thaw. | Fire shatters frozen targets; bullet size bonuses make frost zones larger. |
| Lightning | Chains to nearby enemies. | Chain count or chain damage scales with stacks. | Reload, dash, orbit, and summon hits can become extra chain sources. |
| Blood | Converts HP costs and kills into damage or healing. | Blood marks can burst on kill. | Reload costs, vampire healing, soul spending, and summons all feed blood loops. |
| Void | Pulls, marks, and shares damage through clusters. | Marks intensify pull and shared-damage percentage. | Gem explosions can become singularities; slow bullets can grow while pulling enemies. |
| Decay | Poisons and weakens enemies over time. | Stacks spread on death with diminishing strength. | Summons and parasites can carry decay to create plague webs. |

## Bullet Stat Axes

Bullet upgrades should use multiplicative and additive stat channels so weapons can feel distinct.

| Stat | What It Changes | Good Synergy | Pressure Valve |
|---|---|---|---|
| Damage | Per-hit power. | Crit, pierce, slow weapons, reload bursts. | Lower fire rate, reduced proc chance, overkill waste. |
| Size | Hitbox and visual scale. | Frost zones, void pull, shotgun pellets, orbit conversion. | Lower speed, shorter range, fewer bounces. |
| Range | Lifetime before expiration. | Snipers, ricochet, expired-bullet triggers. | Lower close-range safety, delayed damage. |
| Speed | Travel speed and reach speed. | Momentum rounds, dash builds, piercing beams. | Fast bullets can be harder to exploit with pull or slow fields. |
| Fire Rate | Shots per second. | Lightning, proc engines, low-damage weapons. | Ammo starvation, more reloads, lower accuracy. |
| Magazine | Shots before reload. | Sustained guns, ramping on-shot effects. | Delays reload effects. |
| Reload | Downtime and reload triggers. | Empty-magazine novas, thunder magazine, blood tax. | More frequent vulnerability or HP cost. |
| Pierce | Targets hit per projectile. | Decay, frost, void shared damage. | Reduced damage per pierce after each target. |
| Bounce | Wall or enemy ricochet. | Lightning, orbit hits, storm crown. | Damage decay and bounce cap. |
| Split | Child projectiles. | Mirror, recursive gun, parasite kills. | Generation limits and child damage decay. |

## Summon Families

Summons should become an entire build language, not just pets.

| Family | Role | Scaling Hooks | Example Upgrades |
|---|---|---|---|
| Orbitals | Close-range defense and contact damage. | Bullet damage, element inheritance, soul count, orbit size. | Crown of Teeth, Undertaker Engine, Storm Crown. |
| Familiars | Independent targeting and status application. | Summon damage, attack speed, inherited element chance. | Ember Moth, Frost Wisp, Blood Leech. |
| Turrets | Positional damage anchors. | Reload triggers, magazine size, fire rate, gem pickups. | Clockwork Sentry, Static Tripod, Grave Cannon. |
| Clones | Temporary player echoes. | Dash, active ability, mirror/copy effects. | Afterimage, Hall of Mirrors, Blink Reactor. |
| Expendables | Short-lived bursts or kamikaze minions. | Kills, souls, parasites, decay spread. | Brood Cascade, Bone Dolls, Plague Sparks. |

## Characters

Each character gets an active, passive, bias, and downside. The active should be strong enough to plan around, not just a panic button.

| Character | Passive | Active | Bias | Downside |
|---|---|---|---|---|
| Saint, the Empty Gun | Reload effects are 25% stronger. | Empty Chamber: force a reload nova and refill 1 ammo. | Reload, Blood | Smaller magazine on all weapons. |
| Ilya, the Storm Nun | Lightning chains can crit. | Thunder Bell: next 5 hits chain lightning. | Lightning, Orbit | Lower bullet damage. |
| Nox, the Parasite Kid | Overhealing creates parasite eggs. | Brood Call: hatch all eggs into seeking minions. | Blood, Parasite | Lower max HP. |
| Voss, the Undertaker | Every 6th kill mints a soul. | Harvest Rite: spend souls for orbiting blades. | Souls, Curse | Slower XP magnet range. |
| June, the Gambler | Every level offers one risky bonus pick. | Double Down: reroll choices and add a curse reward. | Gemcraft, Curse | More elites spawn. |
| Mira, the Twin Shot | Every 7th bullet is copied. | Reflection: copied bullets inherit all current elements for 4 seconds. | Mirror, Split | Copied bullets deal less base damage. |
| Ash, the Lantern Bearer | Fire and frost stacks last longer. | Lantern Bloom: pulse fire outward and frost inward. | Frostfire, Auras | Lower movement speed. |
| Kade, the Night Courier | Dash reloads 1 ammo. | Phase Drop: blink and leave a damaging clone. | Dash, Reload | Shorter bullet range. |

## Weapons

Weapons must create different upgrade priorities. A good weapon should make some upgrades feel amazing and others feel awkward.

| Weapon | Identity | Advantages | Disadvantages | Best Synergies |
|---|---|---|---|---|
| Revolver | Clean precision sidearm. | High damage, high crit, reliable reload cadence. | Small magazine. | Reload, crit, mirror. |
| Shotgun | Short-range pellet wall. | Huge close burst, knockback, many hit checks. | Short range and slow reload. | Size, frost, split, blood. |
| SMG | Proc engine. | Very high fire rate and large magazine. | Low damage and weak stagger. | Lightning, decay, on-hit summons. |
| Crossbow | Heavy piercing bolts. | Pierces naturally and hits hard. | Slow fire rate and slow reload. | Void, damage, range, crit. |
| Railgun | Beam-like overpenetration. | Long range, line clear, elite damage. | Tiny magazine and recoil pause. | Reload, pierce, lightning. |
| Spell Lantern | Elemental aura weapon. | Passive aura damage and status coverage. | Weak direct shots. | Fire, frost, summon inheritance. |
| Bone Scythe | Close melee arc. | Wide cleave, lifesteal hooks, defensive orbit synergy. | Dangerous range requirement. | Blood, souls, orbitals. |
| Grenade Pistol | Explosive area weapon. | Area burst and crowd control. | Slow projectile, self-risk, low ammo. | Size, void, gem bombs. |
| Twin Needles | Dual alternating streams. | Two elements or two proc lanes at once. | Low single-hit damage. | Mirror, frostfire, parasite. |
| Void Cannon | Slow singularity shots. | Pulls enemies and scales with range/lifetime. | Very slow shots and tiny magazine. | Void, size, range, reload. |

## Skill Tree Shape

The existing skill-tree plan should become the codex. The run choice generator should use this shape:

1. Pick character and weapon before the run.
2. Early levels prefer roots from the character and weapon bias.
3. Mid levels prefer branches from owned roots.
4. Capstones appear when both branch requirements are met.
5. Fusions appear when cross-tree requirements are met and should be visually louder than normal choices.
6. Summon, elemental, and bullet-stat tags let off-tree upgrades interact without bespoke code for every pair.

## Implementation Roadmap

| Pass | Goal | Player-Facing Result |
|---|---|---|
| 1 | Character and weapon selection data. | Runs start with distinct identity and tradeoffs. |
| 2 | Bullet stat model refactor. | Damage, size, range, speed, ammo, and reload modifiers show on HUD/debug. |
| 3 | Element/status engine. | Fire, frost, lightning, blood, void, and decay become reusable damage sources. |
| 4 | Summon registry. | Orbitals, familiars, turrets, clones, and expendables can inherit tags. |
| 5 | Tree/capstone/fusion choice generator. | Level-up choices start feeling like 20MTD. |
| 6 | Codex and balance pass. | Players can discover and chase broken build routes intentionally. |

## Loop Controls

These controls let the game feel absurd without crashing balance or performance.

- Generated projectiles lose damage, lifetime, or proc chance per generation.
- Summons have family-specific caps, then upgrades raise or transform those caps.
- Chain lightning has a target memory list and a max chain budget.
- Void pull has per-enemy force caps so it stays readable.
- Gem and soul loops have pickup or spend cooldowns.
- Blood loops can overheal into shield, but shield conversion has a burst cap.
- The UI should expose ammo, level progress, active cooldown, and the currently equipped weapon/character once selection exists.
