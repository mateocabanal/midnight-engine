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
  const result = spawnSync("magick", ["svg:-", "-background", "none", `PNG32:${output}${name}.png`], { input: svg, encoding: "utf8" });
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

writePng("characters", 512, 64, characterContent());
writePng("enemies", 512, 64, enemyContent());
writePng("weapons", 512, 96, weaponContent());
writePng("summons", 512, 96, summonContent());
writePng("glyphs", 128, 32, glyphContent());

for (const size of [192, 512]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">${iconContent(size)}</svg>`;
  const result = spawnSync("magick", ["svg:-", `PNG32:${icons}icon-${size}.png`], { input: svg, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || `Unable to generate icon-${size}.png`);
}
