# Midnight Engine

A mobile-first offline PWA roguelite prototype inspired by the upgrade-synergy chaos of games like **20 Minutes Till Dawn**.

## Live App

https://mateocabanal.github.io/midnight-engine/

## Dawn Run Loop

The current target is a full **20-minute Dawn Run**:

1. Pick a character and weapon.
2. Move, aim, fire, reload, and trigger character active abilities.
3. Collect XP gems, level up, and draft upgrade paths/fusions/laws.
4. Survive escalating director phases: Opening Dusk, First Swarm, Elite Hunt, Bullet Hell, Night Terror, and Final Dawn.
5. Fight distinct enemy archetypes: husks, runners, brutes, spitters, chargers, elites, and boss bells.
6. Win by surviving until dawn or lose with **Engine Collapsed**.
7. Review the run summary and quickly restart.

Local progress is stored in `localStorage`: selected loadout, best survival time, best kills, highest level, victories, and discovered character/weapon pairings.

## 20MTD-Style Systems

- **Director phases:** `directorPhases` in `src/game.ts` controls spawn interval, pack size, threat, elite cadence, and enemy mix across the 20-minute run.
- **Boss cadence:** miniboss bells appear at 5, 10, and 15 minutes, with the final Dawn Bell entering during the last minute.
- **Enemy archetypes:** runners pressure movement, brutes anchor swarms, spitters add bullet-hell projectiles, chargers create dodge checks, elites drop higher-value XP, and bosses fire radial patterns.
- **Draft controls:** level-up cards support rarity/category tags, rerolls, banishes, and skip-for-heal/shield.
- **Synergy drafting:** choices are weighted by rarity, prerequisite readiness, character strengths, and previous draft exposure.
- **Declarative sprites:** players, enemies, bullets, summons, and pickups are data-driven through `spriteCatalog` and `getSpriteDefinition()`.

## Controls

### Touch / Mobile

- Left stick: move.
- Right stick: aim and fire.
- **Active** button: trigger the selected character ability when ready.
- Landscape orientation is recommended for twin-stick play.

### Keyboard / Desktop

- `WASD` or arrow keys: move.
- `IJKL`: aim and fire in a direction.
- `Space` or `Enter`: fire in the current aim direction.
- `E` or `Shift`: trigger active ability.

## Scripts

```bash
npm install
npm run dev
npm run typecheck
npm test
npm run build
npm run preview
npm run e2e
```

- `npm run dev` starts the Vite dev server.
- `npm run typecheck` runs TypeScript without emitting files.
- `npm test` runs deterministic Vitest game-core coverage.
- `npm run build` creates the production PWA bundle.
- `npm run preview` serves the production build locally.
- `npm run e2e` runs the Playwright browser smoke test against the built preview.

## Deployment

The GitHub Pages workflow deploys from `main` or `master`. CI installs with `npm ci`, then runs:

1. `npm run typecheck`
2. `npm test`
3. `npm run build`
4. `npm run e2e`

Only a passing build artifact is uploaded to GitHub Pages.
