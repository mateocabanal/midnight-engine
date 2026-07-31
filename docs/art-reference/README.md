# Environment art source

`environment-source.png` is original pixel-horror tile art generated for Midnight Engine's graveyard floor. The runtime atlas at `public/art/environment.png` is a nearest-neighbour 4×4 crop of this sheet; it is the asset loaded by the renderer.

The remaining compact runtime atlases and PNG PWA icons are produced by `scripts/generate-art-atlases.mjs`. Regenerate them with `node scripts/generate-art-atlases.mjs` when their source geometry changes.

`sprite-detail-reference.png` is an original art-direction sheet generated for the second-resolution atlas pass. It establishes the cracked-bone, tarnished-brass, stitched-cloth, cathedral-stone, and occult-machine material vocabulary translated into the deterministic runtime generator. The production atlases remain grid-authored so every animation frame, pivot, and transparent boundary is exact.

## Character and summon coverage

All 8 characters and 9 summons have authored 48px atlas sprites with a full animation vocabulary. Characters cover `idle`, `move`, `attack`, `reload`, `active`, `hit`, `death`, and `select`; summons cover `spawn`, `idle`, `move`, `attack`, `hit`, and `death`. Each character has a distinct silhouette (halo, storm-nun hood, brood coat, mirror cloak, flame crest, crow wings, bastion plate, and staff beacon), and each summon has per-kind motion (wisp flicker, hound chomp, turret kick, drone rotor, mite legs, scythe slash, wasp wings, chakram spin, orb pulse).

At runtime the renderer plays summon `spawn` when an orbital is created and `death` with a particle burst before temporary summons are removed; the player picks `idle` when standing still instead of always looping `move`. Death/spawn offsets are clamped so no frame ever bleeds across its atlas cell.
