import { useEffect, useState } from "react";
import { preloadAtlases, preloadFonts, type LoadedAtlases } from "../art/atlasLoader";
import { artManifest } from "../art/manifest";

export type ArtPreloadState = {
  ready: boolean;
  atlases: LoadedAtlases;
};

export const useArtPreload = (): ArtPreloadState => {
  const [state, setState] = useState<ArtPreloadState>({ ready: false, atlases: new Map() });

  useEffect(() => {
    let current = true;
    const fallbackTimer = window.setTimeout(() => {
      if (current) setState({ ready: true, atlases: new Map() });
    }, 1_750);
    void Promise.all([preloadFonts(), preloadAtlases(artManifest.atlases)])
      .then(([, atlases]) => {
        window.clearTimeout(fallbackTimer);
        if (current) setState({ ready: true, atlases });
      })
      .catch(() => {
        window.clearTimeout(fallbackTimer);
        // Font and atlas loading must never make the game unusable; renderers resolve to their procedural fallback.
        if (current) setState({ ready: true, atlases: new Map() });
      });

    return () => {
      current = false;
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  return state;
};
