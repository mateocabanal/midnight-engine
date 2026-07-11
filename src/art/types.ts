export const midnightPalette = {
  ink: "#06090A",
  raisedInk: "#0D1412",
  bone: "#D7E4D3",
  viridian: "#4F9A7E",
  brightViridian: "#83C7A4",
  danger: "#D35F66",
  amber: "#D8B56D"
} as const;

export type ArtPalette = {
  primary: string;
  secondary: string;
  accent?: string;
  shadow?: string;
};

export type AtlasRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type AtlasFrame = AtlasRect & {
  durationMs: number;
};

export type AtlasAnimation = {
  id: "idle" | "move" | "attack" | "hit" | "spawn";
  frames: AtlasFrame[];
  loop?: boolean;
};

export type AtlasSpriteDefinition = {
  kind: "atlas";
  id: string;
  label: string;
  atlasId: string;
  logicalSize: { width: number; height: number };
  pivot: { x: number; y: number };
  animations: AtlasAnimation[];
  flipX?: boolean;
  palette: ArtPalette;
};

export type ProceduralEffectDefinition = {
  kind: "procedural";
  id: string;
  label: string;
  effect: "bullet" | "particle" | "ring" | "flash" | "trail" | "glyph";
  palette: ArtPalette;
};

export type SpriteDefinition = AtlasSpriteDefinition | ProceduralEffectDefinition;

export type AtlasSource = {
  id: string;
  src: string;
  width: number;
  height: number;
};

export type ArtManifest = {
  atlases: Record<string, AtlasSource>;
  characters: Record<string, AtlasSpriteDefinition>;
  enemies: Record<string, AtlasSpriteDefinition>;
  bullets: Record<string, AtlasSpriteDefinition>;
  weapons: Record<string, AtlasSpriteDefinition>;
  summons: Record<string, AtlasSpriteDefinition>;
  pickups: Record<string, AtlasSpriteDefinition>;
  effects: Record<string, ProceduralEffectDefinition>;
};
