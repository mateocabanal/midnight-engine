import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

const output = new URL("../public/art/", import.meta.url).pathname;
const icons = new URL("../public/icons/", import.meta.url).pathname;
mkdirSync(output, { recursive: true });
mkdirSync(icons, { recursive: true });

const ink = "#06090A";
const raised = "#0D1412";
const bone = "#D7E4D3";
const viridian = "#4F9A7E";
const bright = "#83C7A4";
const danger = "#D35F66";
const amber = "#D8B56D";
const violet = "#77678E";

const rect = (x, y, width, height, fill) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>`;
const line = (x1, y1, x2, y2, stroke, width = 2) => `<path d="M${x1} ${y1}H${x2}V${y2}" fill="none" stroke="${stroke}" stroke-width="${width}"/>`;

const writePng = (name, width, height, content) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">${content}</svg>`;
  const result = spawnSync("magick", ["-background", "none", "svg:-", `PNG32:${output}${name}.png`], { input: svg, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || `Unable to generate ${name}.png`);
};

const tileOrigin = (index, frame) => ({ x: (index % 4) * 128 + frame * 32, y: Math.floor(index / 4) * 32 });

const characterColors = [amber, bright, viridian, violet, danger, violet, bone, bright];
const characterContent = () => characterColors.flatMap((accent, index) => [0, 1, 2, 3].map((frame) => {
  const { x, y } = tileOrigin(index, frame);
  const step = [0, 1, 0, -1][frame];
  const gun = index % 2 === 0 ? amber : bright;
  return [
    rect(x + 7, y + 27, 18, 2, "#020404"),
    rect(x + 9 + step, y + 13, 14, 12, raised),
    rect(x + 7 + step, y + 17, 18, 8, accent),
    rect(x + 9 + step, y + 15, 14, 10, raised),
    rect(x + 10 + step, y + 5, 12, 12, accent),
    rect(x + 12 + step, y + 7, 8, 8, raised),
    rect(x + 13 + step, y + 9, 6, 5, bone),
    rect(x + 13 + step, y + 10, 2, 2, ink),
    rect(x + 17 + step, y + 10, 2, 2, ink),
    rect(x + 21 + step, y + 16, 8, 3, gun),
    rect(x + 25 + step, y + 14, 4, 2, bone),
    index === 0 ? rect(x + 15 + step, y + 1, 2, 4, bone) : "",
    index === 2 ? rect(x + 5 + step, y + 12, 3, 8, viridian) : "",
    index === 4 ? rect(x + 5 + step, y + 19, 4, 3, danger) : "",
    index === 6 ? rect(x + 8 + step, y + 24, 16, 2, bone) : ""
  ].join("");
})).join("");

const enemyContent = () => {
  const kinds = [
    { color: danger, body: [9, 8, 14, 14] },
    { color: amber, body: [6, 11, 20, 8] },
    { color: violet, body: [6, 6, 20, 20] },
    { color: viridian, body: [8, 8, 16, 16] },
    { color: danger, body: [4, 9, 24, 12] },
    { color: amber, body: [7, 6, 18, 18] },
    { color: violet, body: [4, 3, 24, 26] }
  ];
  return kinds.flatMap((kind, index) => [0, 1, 2, 3].map((frame) => {
    const { x, y } = tileOrigin(index, frame);
    const shift = [0, 1, 0, -1][frame];
    const [bodyX, bodyY, bodyW, bodyH] = kind.body;
    const horn = index === 4 || index === 6;
    return [
      rect(x + bodyX + shift - 2, y + bodyY + bodyH, bodyW + 4, 2, "#020404"),
      rect(x + bodyX + shift, y + bodyY, bodyW, bodyH, kind.color),
      rect(x + bodyX + shift + 2, y + bodyY + 2, Math.max(4, bodyW - 4), Math.max(4, bodyH - 5), raised),
      rect(x + bodyX + shift + 3, y + bodyY + 4, 3, 3, bone),
      rect(x + bodyX + shift + bodyW - 6, y + bodyY + 4, 3, 3, bone),
      rect(x + bodyX + shift + 4, y + bodyY + 5, 1, 1, ink),
      rect(x + bodyX + shift + bodyW - 5, y + bodyY + 5, 1, 1, ink),
      horn ? rect(x + bodyX + shift + 1, y + bodyY - 3, 3, 4, bone) : "",
      horn ? rect(x + bodyX + shift + bodyW - 4, y + bodyY - 3, 3, 4, bone) : "",
      index === 3 ? rect(x + bodyX + shift + 6, y + bodyY + bodyH - 2, 4, 4, bright) : "",
      index === 6 ? rect(x + bodyX + shift + 7, y + bodyY + 12, 10, 4, amber) : ""
    ].join("");
  })).join("");
};

const weaponContent = () => {
  const colors = [bone, amber, bright, bone, danger, bright, amber, bone, violet, viridian, bright, bone];
  return colors.flatMap((color, index) => [0, 1, 2, 3].map((frame) => {
    const { x, y } = tileOrigin(index, frame);
    const shift = [0, 1, 0, -1][frame];
    const diagonal = index === 3 || index === 7 || index === 10 || index === 11;
    const ring = index === 8;
    return [
      diagonal ? rect(x + 8 + shift, y + 19, 4, 4, color) : rect(x + 6 + shift, y + 14, 19, 4, color),
      diagonal ? line(x + 10 + shift, y + 20, x + 23 + shift, y + 7, color, 3) : rect(x + 21 + shift, y + 12, 6, 8, color),
      rect(x + 7 + shift, y + 16, 8, 4, raised),
      ring ? `<rect x="${x + 8 + shift}" y="${y + 8}" width="15" height="15" fill="none" stroke="${color}" stroke-width="3"/>` : "",
      index === 4 ? rect(x + 25 + shift, y + 10, 3, 12, danger) : "",
      index === 5 ? rect(x + 23 + shift, y + 7, 3, 3, bright) : "",
      index === 9 ? rect(x + 24 + shift, y + 8, 4, 4, viridian) : ""
    ].join("");
  })).join("");
};

const summonContent = () => {
  const colors = [bright, amber, bone, bright, viridian, violet, amber, violet, bone];
  return colors.flatMap((color, index) => [0, 1, 2, 3].map((frame) => {
    const { x, y } = tileOrigin(index, frame);
    const bob = [0, -1, 0, 1][frame];
    return [
      rect(x + 8, y + 22, 16, 2, "#020404"),
      rect(x + 9, y + 9 + bob, 14, 13, color),
      rect(x + 11, y + 11 + bob, 10, 9, raised),
      rect(x + 14, y + 13 + bob, 4, 4, bone),
      index === 1 || index === 6 ? rect(x + 5, y + 12 + bob, 5, 3, color) : "",
      index === 2 ? rect(x + 19, y + 8 + bob, 9, 3, bone) : "",
      index === 5 || index === 7 ? `<rect x="${x + 7}" y="${y + 7 + bob}" width="18" height="18" fill="none" stroke="${color}" stroke-width="3"/>` : "",
      index === 8 ? rect(x + 12, y + 7 + bob, 8, 3, bone) : ""
    ].join("");
  })).join("");
};

const actorFrame = (index, clip, frameIndex) => {
  const cell = 48;
  const blockX = (index % 4) * 576;
  const blockY = Math.floor(index / 4) * 384;
  const x = blockX + frameIndex * cell;
  const y = blockY + clip * cell;
  const phase = frameIndex % 8;
  const bob = clip === 0 ? [0, 0, -1, -1, 0, 0, 1, 1][phase] : clip === 1 ? [0, -1, -2, -1, 0, -1, -2, -1][phase] : 0;
  const stride = clip === 1 ? [-2, -1, 0, 1, 2, 1, 0, -1][phase] : 0;
  const recoil = clip === 2 ? [0, 0, -2, -4, -2, -1, 0, 0][phase] : 0;
  const hit = clip === 5 ? [0, -3, -1][frameIndex % 3] : 0;
  const death = clip === 6 ? Math.min(12, frameIndex * 2) : 0;
  const entrance = clip === 7 ? Math.max(0, 10 - frameIndex * 2) : 0;
  const ox = x + stride + recoil + hit;
  const oy = y + bob + death + entrance;
  const shadow = death < 10 ? rect(x + 10, y + 42, 28, 3, "#020404") : "";
  const active = clip === 4;
  const reload = clip === 3;
  const muzzle = clip === 2 && frameIndex === 2;

  if (index === 0) return [shadow,
    rect(ox + 16, oy + 15, 17, 25, raised), rect(ox + 12, oy + 22, 25, 18, amber),
    rect(ox + 16, oy + 22, 17, 18, raised), rect(ox + 18, oy + 7, 14, 13, bone),
    rect(ox + 20, oy + 9, 10, 9, ink), rect(ox + 22, oy + 12, 2, 2, bone),
    `<rect x="${ox + 15}" y="${oy + 2}" width="20" height="6" fill="none" stroke="${active ? bright : amber}" stroke-width="2"/>`,
    rect(ox + (reload ? 5 + phase : 30), oy + (reload ? 20 : 25), reload ? 16 : 14, 4, amber),
    muzzle ? rect(ox + 43, oy + 23, 5, 5, bone) : "",
    active ? `<rect x="${ox + 8 - phase}" y="${oy + 9 - phase}" width="32" height="32" fill="none" stroke="${bright}" stroke-width="2"/>` : ""
  ].join("");

  if (index === 1) return [shadow,
    `<path d="M${ox + 24} ${oy + 5}L${ox + 8} ${oy + 39}H${ox + 40}Z" fill="${viridian}"/>`,
    `<path d="M${ox + 24} ${oy + 9}L${ox + 14} ${oy + 36}H${ox + 34}Z" fill="${raised}"/>`,
    rect(ox + 19, oy + 10, 10, 10, bone), rect(ox + 21, oy + 13, 2, 2, ink),
    rect(ox + 35, oy + 15, 3, 25, bone),
    `<rect x="${ox + 32}" y="${oy + 29}" width="9" height="9" fill="none" stroke="${active || muzzle ? bright : amber}" stroke-width="2"/>`,
    active ? [0, 1, 2, 3].map((n) => line(ox + 24, oy + 4, ox + 8 + n * 10, oy - 3 + ((phase + n) % 3) * 4, bright, 2)).join("") : ""
  ].join("");

  if (index === 2) return [shadow,
    rect(ox + 13, oy + 21, 22, 18, danger), rect(ox + 17, oy + 17, 18, 22, raised),
    `<path d="M${ox + 14} ${oy + 18}L${ox + 24} ${oy + 5}L${ox + 36} ${oy + 20}Z" fill="${viridian}"/>`,
    rect(ox + 19, oy + 13, 11, 10, ink), rect(ox + 21, oy + 16, 2, 2, danger),
    rect(ox + 6, oy + 23, 10, 13, amber), rect(ox + 8, oy + 25, 6, 4, danger),
    (active || reload) ? [0, 1, 2].map((n) => rect(ox + 7 + n * 12, oy + 35 - ((phase + n) % 3) * 4, 5, 4, danger)).join("") : ""
  ].join("");

  if (index === 3) return [shadow,
    rect(ox + 12, oy + 18, 24, 22, violet), rect(ox + 16, oy + 17, 16, 23, raised),
    rect(ox + 16, oy + 6, 16, 15, bone), rect(ox + 18, oy + 9, 6, 9, ink), rect(ox + 26, oy + 9, 4, 9, violet),
    rect(ox + 4 - recoil, oy + 22, 15, 3, bone), rect(ox + 30 + recoil, oy + 22, 15, 3, amber),
    muzzle ? rect(ox, oy + 20, 5, 5, violet) + rect(ox + 44, oy + 20, 5, 5, amber) : "",
    active ? `<rect x="${ox + 9 - phase}" y="${oy + 4}" width="30" height="35" fill="none" stroke="${violet}" stroke-width="2" opacity=".7"/>` : ""
  ].join("");

  const accent = characterColors[index];
  return [shadow, rect(ox + 14, oy + 17, 20, 23, accent), rect(ox + 17, oy + 19, 14, 21, raised),
    rect(ox + 17, oy + 7, 14, 14, accent), rect(ox + 20, oy + 11, 8, 7, bone),
    rect(ox + 31, oy + 23, 13, 3, index % 2 ? bright : amber),
    index === 4 ? rect(ox + 9, oy + 15, 5, 20, danger) : "",
    index === 5 ? `<path d="M${ox + 15} ${oy + 8}L${ox + 8} ${oy + 18}L${ox + 17} ${oy + 16}Z" fill="${violet}"/>` : "",
    index === 6 ? rect(ox + 12, oy + 38, 24, 3, bone) : "",
    index === 7 ? rect(ox + 8, oy + 26, 8, 7, bright) : ""
  ].join("");
};

const premiumCharacterContent = () => characterColors.flatMap((_, index) =>
  Array.from({ length: 8 }, (_, clip) => Array.from({ length: 12 }, (_, frameIndex) => actorFrame(index, clip, frameIndex)).join("")).join("")
).join("");

const summonFrame = (index, clip, frameIndex) => {
  const blockX = (index % 4) * 384;
  const blockY = Math.floor(index / 4) * 288;
  const x = blockX + frameIndex * 48;
  const y = blockY + clip * 48;
  const phase = frameIndex % 8;
  const bob = clip === 1 || clip === 2 ? [0, -1, -2, -1, 0, 1, 2, 1][phase] : clip === 0 ? Math.max(0, 8 - frameIndex * 2) : 0;
  const lunge = clip === 3 ? [0, 1, 3, 6, 4, 2, 0, 0][phase] : 0;
  const collapse = clip === 5 ? Math.min(14, frameIndex * 2) : 0;
  const ox = x + lunge;
  const oy = y + bob + collapse;
  const shadow = rect(x + 10, y + 40, 28, 3, "#020404");
  if (index === 0) return [shadow, `<path d="M${ox + 24} ${oy + 7}L${ox + 11} ${oy + 29}L${ox + 18} ${oy + 39}H${ox + 30}L${ox + 37} ${oy + 29}Z" fill="${bright}"/>`, rect(ox + 17, oy + 15, 14, 17, raised), rect(ox + 20, oy + 20, 2, 2, bone), rect(ox + 27, oy + 20, 2, 2, bone), clip === 3 ? rect(ox + 35, oy + 21, 9, 4, bone) : ""].join("");
  if (index === 1) return [shadow, rect(ox + 8, oy + 24, 29, 12, bone), rect(ox + 13, oy + 20, 18, 14, raised), rect(ox + 31, oy + 20, 10, 10, bone), rect(ox + 36, oy + 24, 3, 3, danger), rect(ox + 11 + (phase % 2) * 4, oy + 35, 4, 6, bone), rect(ox + 27 - (phase % 2) * 4, oy + 35, 4, 6, bone)].join("");
  if (index === 2) return [shadow, rect(ox + 12, oy + 27, 24, 11, amber), rect(ox + 15, oy + 17, 18, 14, raised), rect(ox + 20, oy + 13, 8, 7, bone), rect(ox + 9, oy + 36, 5, 5, bone), rect(ox + 34, oy + 36, 5, 5, bone), clip === 3 ? rect(ox + 33, oy + 20, 13, 4, amber) : ""].join("");
  if (index === 4) return [shadow, rect(ox + 11, oy + 24, 26, 10, danger), [0,1,2,3,4,5].map((n) => rect(ox + 10 + n * 5, oy + 33 + ((phase + n) % 2) * 3, 3, 7, bone)).join(""), rect(ox + 31, oy + 20, 8, 7, danger), clip === 5 ? `<rect x="${ox + 5}" y="${oy + 15}" width="38" height="24" fill="none" stroke="${danger}" stroke-width="3"/>` : ""].join("");
  if (index === 5) return [shadow, `<path d="M${ox + 24} ${oy + 6}L${ox + 29} ${oy + 22}L${ox + 42} ${oy + 24}L${ox + 29} ${oy + 28}L${ox + 24} ${oy + 43}L${ox + 19} ${oy + 28}L${ox + 6} ${oy + 24}L${ox + 19} ${oy + 22}Z" fill="${bone}"/>`, rect(ox + 21, oy + 20, 6, 8, danger)].join("");
  const color = [bright, amber, bone, bright, danger, bone, amber, violet, bright][index];
  return [shadow, rect(ox + 11, oy + 15, 26, 24, color), rect(ox + 15, oy + 19, 18, 16, raised), rect(ox + 21, oy + 24, 6, 6, bone), index === 7 ? `<rect x="${ox + 7}" y="${oy + 11}" width="34" height="32" fill="none" stroke="${violet}" stroke-width="3"/>` : ""].join("");
};

const premiumSummonContent = () => Array.from({ length: 9 }, (_, index) =>
  Array.from({ length: 6 }, (_, clip) => Array.from({ length: 8 }, (_, frameIndex) => summonFrame(index, clip, frameIndex)).join("")).join("")
).join("");

const bulletContent = () => Array.from({ length: 6 }, (_, index) => Array.from({ length: 4 }, (_, clip) =>
  Array.from({ length: 5 }, (_, frameIndex) => {
    const x = frameIndex * 24;
    const y = index * 96 + clip * 24;
    const phase = frameIndex % 4;
    const grow = clip === 0 ? Math.min(3, frameIndex) : clip >= 2 ? Math.max(1, 4 - frameIndex) : 3;
    if (index === 0) return rect(x + 4, y + 10, 12 + grow, 4, bone) + rect(x + 6 + phase, y + 9, 5, 1, amber) + (clip >= 2 ? rect(x + 15, y + 7, 2, 10, bone) : "");
    if (index === 1) return rect(x + 3, y + 12, 6, 3, bright) + rect(x + 7 + phase, y + 8, 5, 5, bright) + rect(x + 10, y + 11, 5, 4, bone) + rect(x + 13 + phase, y + 5, 5, 7, bright) + rect(x + 16, y + 9, 5, 3, bright);
    if (index === 2) return `<path d="M${x + 4} ${y + 12}L${x + 13 + grow} ${y + 5 - phase}L${x + 20} ${y + 12}L${x + 12 + grow} ${y + 19 + phase}Z" fill="${danger}"/>` + rect(x + 8, y + 10, 8, 4, amber);
    if (index === 3) return `<path d="M${x + 3} ${y + 12}L${x + 13 + grow} ${y + 4}L${x + 20} ${y + 12}L${x + 13 + grow} ${y + 20}Z" fill="${bone}"/>` + rect(x + 10, y + 8 + phase, 5, 8, bright);
    if (index === 4) return `<path d="M${x + 3} ${y + 12}L${x + 14 + grow} ${y + 5}L${x + 21} ${y + 12}L${x + 14 + grow} ${y + 19}Z" fill="${danger}"/>` + rect(x + 9 + phase, y + 9, 5, 6, bone);
    return rect(x + 4 + phase, y + 4 + phase, 16 - phase * 2, 16 - phase * 2, violet) + rect(x + 7 + phase, y + 7 + phase, 10 - phase * 2, 10 - phase * 2, ink) + rect(x + 10, y + 10, 4, 4, amber);
  }).join("")
).join("")).join("");

const glyphContent = () => [0, 1, 2, 3].map((frame) => {
  const x = frame * 32;
  const glow = frame % 2 === 0 ? bright : viridian;
  return [
    rect(x + 13, 4, 6, 24, glow),
    rect(x + 6, 13, 20, 6, glow),
    rect(x + 11, 11, 10, 10, bone),
    rect(x + 14, 14, 4, 4, ink)
  ].join("");
}).join("");

const iconContent = (size) => {
  const unit = size / 32;
  const scale = (value) => value * unit;
  return [
    rect(0, 0, size, size, ink),
    rect(scale(5), scale(25), scale(22), scale(2), "#020404"),
    rect(scale(8), scale(12), scale(16), scale(13), viridian),
    rect(scale(10), scale(6), scale(12), scale(12), amber),
    rect(scale(12), scale(8), scale(8), scale(8), raised),
    rect(scale(13), scale(10), scale(6), scale(4), bone),
    rect(scale(13), scale(11), scale(2), scale(2), ink),
    rect(scale(17), scale(11), scale(2), scale(2), ink),
    rect(scale(15), scale(1), scale(2), scale(5), bone)
  ].join("");
};

writePng("characters", 2304, 768, premiumCharacterContent());
writePng("enemies", 512, 64, enemyContent());
writePng("weapons", 512, 96, weaponContent());
writePng("summons", 1536, 864, premiumSummonContent());
writePng("bullets", 120, 576, bulletContent());
writePng("glyphs", 128, 32, glyphContent());

for (const size of [192, 512]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">${iconContent(size)}</svg>`;
  const result = spawnSync("magick", ["svg:-", `PNG32:${icons}icon-${size}.png`], { input: svg, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || `Unable to generate icon-${size}.png`);
}
