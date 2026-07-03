# Midnight Engine Skill Tree Plan

This plan follows the 20 Minutes Till Dawn style: small upgrade trees, readable first picks, strong internal identity, and capstones that become absurd when combined with other trees.

## Upgrade Rules

- Each tree has 1 root, 2 branch upgrades, and 1 capstone.
- Root upgrades can appear early.
- Branch upgrades require the root.
- Capstones require both branch upgrades from the same tree.
- Fusions require capstones or key upgrades from two different trees.
- A run should offer 3 choices per level, with at least one choice biased toward the player's current build.
- Every tree must support at least one direct build and one cross-tree abuse case.

## Core Trees

| Tree | Root | Branch A | Branch B | Capstone |
|---|---|---|---|---|
| Guncraft | Split Chamber: bullets split once on hit | Fracture Angle: child bullets spread wider and pierce once | Lead Echo: split bullets inherit 40% more damage | Recursive Gun: copied or split bullets can trigger one more split cycle |
| Mirror | Mirror Chamber: every 5th shot copies twice | Polished Bore: copied shots gain crit chance | Phantom Copy: copied shots count as new shots | Hall of Mirrors: every copied shot can trigger on-shot effects |
| Reload | Static Prayer: reloads emit lightning | Quick Hands: reload faster after kills | Empty Click: reloading at empty magazine emits a nova | Thunder Magazine: reload effects can trigger chain effects twice |
| Frostfire | Frostfire Rounds: alternate burn and freeze | Thermal Shock: burning frozen enemies explode | Brittle Core: frozen enemies take more crit damage | Solar Frostbite: burn and freeze coexist before shattering into shards |
| Blood | Blood Tax: reloads cost HP and fire blood nova | Clot Armor: self-damage grants shield | Red Refund: blood kills restore HP | Blood Economy: HP, shield, and reloads convert into each other |
| Souls | Grave Interest: kills mint souls | Soul Blade: 3 souls create an orbital | Tithe: elites drop bonus souls | Undertaker Engine: soul orbitals inherit bullet elements |
| Orbit | Crown of Teeth: gain orbiting blades | Wider Crown: orbitals expand and hit harder | Hungry Crown: expired bullets can become orbitals | Storm Crown: orbit hits can trigger on-hit effects |
| Gemcraft | Gem Bomb: XP gems explode on pickup | Greed Magnet: gems pull in from farther away | Compound Interest: uncollected gems grow in value | Gem Singularity: gem explosions pull enemies and vacuum nearby gems |
| Parasite | Parasite Rounds: some kills spawn seeking blood shots | Larval Split: parasite shots split on kill | Host Jump: parasite shots seek new targets after impact | Brood Cascade: parasite kills can create temporary summons |
| Void | Void Mark: every 7th shot pulls enemies inward | Event Horizon: pulled enemies share damage | Deep Chamber: void shots grow while traveling | Black Hole Buckshot: pellets collapse into a damaging singularity |
| Dash | Phase Step: dash cooldown reduced | Afterimage: dash leaves damaging clone | Momentum Rounds: shots after dash gain speed | Blink Reactor: dash effects trigger reload effects |
| Curse | Bad Omen: +enemy count, +damage dealt | Debt Collector: delayed damage grows over time | Revenge Circuit: taking damage emits a nova | Cursed Dividend: penalties become scaling rewards |

## Fusion Routes

| Fusion | Requirements | Effect |
|---|---|---|
| Recursive Gun | Guncraft capstone + Mirror capstone | Split and copied bullets can recursively create weaker children once per generation. |
| Thunder Magazine | Reload capstone + Mirror root | Reload effects are copied, but copied reload effects deal reduced damage. |
| Solar Frostbite | Frostfire capstone + Parasite root | Shatter explosions fire seeking ice-blood shards. |
| Blood Economy | Blood capstone + Souls root | Souls can pay HP costs; overheal becomes shield; shield breaks emit blood nova. |
| Storm Crown | Orbit capstone + Reload root | Orbit hits have a small chance to trigger lightning chains. |
| Gem Singularity | Gemcraft capstone + Void root | Gem explosions pull enemies inward and count as void hits. |
| Blink Reactor | Dash capstone + Reload root | Dashing triggers reload effects without resetting the magazine. |
| Cursed Interest | Curse capstone + Gemcraft branch | Gems grow faster while cursed penalties are active. |
| Black Hole Buckshot | Void capstone + Guncraft root | Split bullets collapse toward a shared center before exploding. |
| Undertaker Engine | Souls capstone + Frostfire root | Soul orbitals alternate fire and ice, enabling shatter loops. |

## Character Synergy Hooks

| Character | Tree Bias | Build Fantasy |
|---|---|---|
| Saint, the Empty Gun | Reload, Blood | One bullet, constant reload detonation, HP-as-ammo loops. |
| Ilya, the Storm Nun | Reload, Orbit | Lightning chains from every indirect hit. |
| Nox, the Parasite Kid | Blood, Parasite | Kills hatch more kills. |
| Voss, the Undertaker | Souls, Curse | Death economy, soul blades, risky scaling. |
| June, the Gambler | Gemcraft, Curse | Reward spikes from unsafe choices. |
| Mira, the Twin Shot | Guncraft, Mirror | Copy/split recursion and crit bursts. |

## First Implementation Pass

1. Represent each upgrade with `id`, `tree`, `tier`, `requires`, `tags`, `description`, and `apply`.
2. Add a choice generator that weights:
   - missing roots at low levels
   - branches for owned roots
   - capstones for completed branches
   - fusions when requirements are met
3. Replace hardcoded fusion checks with tag-based triggers:
   - `onShot`
   - `onHit`
   - `onKill`
   - `onReload`
   - `onDash`
   - `onGemCollect`
   - `onBulletExpire`
4. Add a skill tree codex screen after the run ends so players can see what they discovered.

## Balance Targets

- Root upgrades should feel useful immediately.
- Capstones should feel build-defining, not just stronger.
- Fusions should be rare enough to feel discovered, but common enough that a focused run can force one by level 7-10.
- Recursive effects need decay: every generated child should lose damage, proc chance, or lifetime.
- The game should allow broken-looking loops, but each loop needs a pressure valve: cooldown, generation limit, chance decay, HP cost, or enemy scaling.
