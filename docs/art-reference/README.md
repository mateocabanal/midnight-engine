# Environment art source

`environment-source.png` is original pixel-horror tile art generated for Midnight Engine's graveyard floor. The runtime atlas at `public/art/environment.png` is a nearest-neighbour 4×4 crop of this sheet; it is the asset loaded by the renderer.

The remaining compact runtime atlases and PNG PWA icons are produced by `scripts/generate-art-atlases.mjs`. Regenerate them with `node scripts/generate-art-atlases.mjs` when their source geometry changes.
