# Environment art source

`environment-source.png` is original pixel-horror tile art generated for Midnight Engine's graveyard floor. The runtime atlas at `public/art/environment.png` is a nearest-neighbour 4×4 crop of this sheet; it is the asset loaded by the renderer.

The remaining compact runtime atlases and PNG PWA icons are produced by `scripts/generate-art-atlases.mjs`. Regenerate them with `node scripts/generate-art-atlases.mjs` when their source geometry changes.

`sprite-detail-reference.png` is an original art-direction sheet generated for the second-resolution atlas pass. It establishes the cracked-bone, tarnished-brass, stitched-cloth, cathedral-stone, and occult-machine material vocabulary translated into the deterministic runtime generator. The production atlases remain grid-authored so every animation frame, pivot, and transparent boundary is exact.
