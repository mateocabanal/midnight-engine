# Visual baselines

`pre-revamp/main-menu-960x540.png` and `pre-revamp/run-hud-960x540.png` preserve the original glass/neon baseline before the screen compositions are replaced.

The development-only harness accepts `?visual=main-menu` or `?visual=run-hud`. Add `&baseline=pre` only when recapturing the legacy comparison images; the normal harness renders the current visual contract.

The repeatable desktop and Pixel 7 landscape snapshots live beside [the visual test](../../tests/e2e/visual.spec.ts) and run with `npm run visual:check`.
