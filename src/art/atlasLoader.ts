import type { AtlasSource } from "./types";

export type LoadedAtlases = Map<string, HTMLImageElement>;

const loadAtlas = (atlas: AtlasSource) => new Promise<[string, HTMLImageElement] | null>((resolve) => {
  const image = new Image();
  const timeout = window.setTimeout(() => resolve(null), 1_500);
  const settle = (result: [string, HTMLImageElement] | null) => {
    window.clearTimeout(timeout);
    resolve(result);
  };
  image.decoding = "async";
  image.onload = () => settle([atlas.id, image]);
  image.onerror = () => settle(null);
  image.src = atlas.src;
});

export const preloadAtlases = async (atlases: Record<string, AtlasSource>): Promise<LoadedAtlases> => {
  const loaded = await Promise.all(Object.values(atlases).map(loadAtlas));
  return new Map(loaded.filter((entry): entry is [string, HTMLImageElement] => entry !== null));
};

export const preloadFonts = async () => {
  if (!document.fonts) return;
  await Promise.all([
    document.fonts.load("700 16px Pixelify Sans"),
    document.fonts.load("400 12px Silkscreen")
  ]);
};
