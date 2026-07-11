import { artManifest } from "../art/manifest";
import { getAnimationFrame } from "../art/spriteResolver";
import type { LoadedAtlases } from "../art/atlasLoader";
import type { AtlasSpriteDefinition } from "../art/types";
import type { Game } from "../game";
import type { GameRenderControls } from "./gameRenderer";

const TAU = Math.PI * 2;
const GRID = 2;
const STAGE_TILE = 64;
const LIGHT_RADIUS = 212;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const quantize = (value: number) => Math.round(value / GRID) * GRID;
const hash = (x: number, y: number, salt = 0) => {
  const value = Math.sin(x * 127.1 + y * 311.7 + salt * 74.7) * 43758.5453123;
  return value - Math.floor(value);
};

const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  ctx.lineTo(x + radius, y);
  ctx.lineTo(x, y + radius);
  ctx.lineTo(x - radius, y);
  ctx.closePath();
};

const drawFallback = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  palette: AtlasSpriteDefinition["palette"],
  kind: "player" | "enemy" | "summon" | "pickup"
) => {
  const half = Math.max(4, Math.floor(size / 2));
  ctx.fillStyle = "#06090A";
  ctx.fillRect(x - half - 2, y - half - 2, half * 2 + 4, half * 2 + 4);
  ctx.fillStyle = palette.primary;
  if (kind === "pickup") drawDiamond(ctx, x, y, half);
  else ctx.fillRect(x - half, y - half, half * 2, half * 2);
  ctx.fill();
  ctx.fillStyle = palette.secondary;
  ctx.fillRect(x - Math.max(1, Math.floor(half / 2)), y - Math.max(1, Math.floor(half / 2)), Math.max(2, half), Math.max(2, half));
};

const drawSprite = (
  ctx: CanvasRenderingContext2D,
  atlases: LoadedAtlases,
  sprite: AtlasSpriteDefinition | undefined,
  x: number,
  y: number,
  size: number,
  animation: "idle" | "move" | "attack" | "hit",
  elapsed: number,
  fallbackKind: "player" | "enemy" | "summon" | "pickup",
  alpha = 1
) => {
  if (!sprite) return;
  const image = atlases.get(sprite.atlasId);
  const px = quantize(x);
  const py = quantize(y);
  ctx.save();
  ctx.globalAlpha *= alpha;
  if (image) {
    const frame = getAnimationFrame(sprite, animation, elapsed);
    const height = size;
    const width = Math.round((sprite.logicalSize.width / sprite.logicalSize.height) * height);
    const left = px - Math.round((sprite.pivot.x / sprite.logicalSize.width) * width);
    const top = py - Math.round((sprite.pivot.y / sprite.logicalSize.height) * height);
    ctx.imageSmoothingEnabled = false;
    if (sprite.flipX) {
      ctx.translate(px * 2 - left - width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(image, frame.x, frame.y, frame.width, frame.height, left, top, width, height);
  } else {
    drawFallback(ctx, px, py, size, sprite.palette, fallbackKind);
  }
  ctx.restore();
};

const drawEnvironment = (ctx: CanvasRenderingContext2D, game: Game, camera: { x: number; y: number }, atlases: LoadedAtlases) => {
  ctx.fillStyle = "#06090A";
  ctx.fillRect(0, 0, game.screen.w, game.screen.h);
  const environment = atlases.get("environment");
  const worldLeft = -camera.x;
  const worldTop = -camera.y;
  const worldRight = worldLeft + game.screen.w;
  const worldBottom = worldTop + game.screen.h;
  const startX = Math.floor(worldLeft / STAGE_TILE) - 1;
  const startY = Math.floor(worldTop / STAGE_TILE) - 1;
  const endX = Math.ceil(worldRight / STAGE_TILE) + 1;
  const endY = Math.ceil(worldBottom / STAGE_TILE) + 1;

  for (let tx = startX; tx <= endX; tx += 1) {
    for (let ty = startY; ty <= endY; ty += 1) {
      const roll = hash(tx, ty);
      const index = roll < 0.55 ? 0 : roll < 0.68 ? 1 : roll < 0.78 ? 2 : roll < 0.85 ? 4 : roll < 0.9 ? 5 : roll < 0.95 ? 6 : 7;
      const sx = quantize(tx * STAGE_TILE + camera.x);
      const sy = quantize(ty * STAGE_TILE + camera.y);
      if (environment) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(environment, (index % 4) * 32, Math.floor(index / 4) * 32, 32, 32, sx, sy, STAGE_TILE, STAGE_TILE);
      } else {
        ctx.fillStyle = roll < 0.5 ? "#0D1412" : "#101A19";
        ctx.fillRect(sx, sy, STAGE_TILE, STAGE_TILE);
      }

      if (hash(tx, ty, 9) > 0.72) {
        ctx.fillStyle = "rgba(215, 228, 211, 0.1)";
        ctx.fillRect(sx + 8 + Math.floor(hash(tx, ty, 10) * 28), sy + 8 + Math.floor(hash(tx, ty, 11) * 28), 2, 2);
      }
    }
  }

  ctx.fillStyle = "rgba(6, 9, 10, 0.22)";
  for (let i = 0; i < 22; i += 1) {
    const px = hash(i, Math.floor(game.time * 0.1), 12) * game.screen.w;
    const py = hash(i, Math.floor(game.time * 0.07), 13) * game.screen.h;
    const width = 18 + Math.floor(hash(i, 4, 14) * 28);
    ctx.fillRect(quantize(px), quantize(py), width, 4);
  }
};

const drawBullet = (ctx: CanvasRenderingContext2D, bullet: Game["bullets"][number]) => {
  const effect = artManifest.effects[bullet.element];
  const x = quantize(bullet.x);
  const y = quantize(bullet.y);
  const size = Math.max(3, quantize(bullet.r));
  const angle = Math.atan2(bullet.vy, bullet.vx);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = effect.palette.primary;
  if (bullet.element === "lightning") {
    ctx.strokeStyle = effect.palette.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-size * 2, -size);
    ctx.lineTo(0, size);
    ctx.lineTo(size * 2, -size);
    ctx.stroke();
  } else if (bullet.element === "void") {
    ctx.strokeStyle = effect.palette.primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(-size, -size, size * 2, size * 2);
  } else if (bullet.element === "fire") {
    drawDiamond(ctx, 0, 0, size + 1);
    ctx.fill();
    ctx.fillStyle = effect.palette.secondary;
    ctx.fillRect(-1, -1, 3, 3);
  } else {
    ctx.fillRect(-size, -Math.max(1, Math.floor(size / 2)), size * 2 + 2, Math.max(2, size));
  }
  ctx.restore();
};

const drawEnemyProjectile = (ctx: CanvasRenderingContext2D, shot: Game["enemyProjectiles"][number]) => {
  const x = quantize(shot.x);
  const y = quantize(shot.y);
  ctx.fillStyle = "#D35F66";
  drawDiamond(ctx, x, y, Math.max(3, shot.r));
  ctx.fill();
};

const drawEliteBar = (ctx: CanvasRenderingContext2D, enemy: Game["enemies"][number]) => {
  if (enemy.kind !== "elite" && enemy.kind !== "boss") return;
  const width = enemy.kind === "boss" ? 58 : 34;
  const left = quantize(enemy.x - width / 2);
  const top = quantize(enemy.y - enemy.r - 12);
  const pct = clamp(enemy.hp / enemy.maxHp, 0, 1);
  ctx.fillStyle = "#06090A";
  ctx.fillRect(left - 1, top - 1, width + 2, 5);
  ctx.fillStyle = enemy.kind === "boss" ? "#D8B56D" : "#D35F66";
  ctx.fillRect(left, top, Math.max(1, Math.floor(width * pct)), 3);
};

const drawWorld = (ctx: CanvasRenderingContext2D, game: Game, camera: { x: number; y: number }, atlases: LoadedAtlases) => {
  ctx.save();
  ctx.translate(camera.x, camera.y);

  for (const gem of game.gems) {
    drawSprite(ctx, atlases, artManifest.pickups.xp, gem.x, gem.y, 16, "idle", game.time * 1000 + gem.value * 50, "pickup");
  }
  for (const bullet of game.bullets) drawBullet(ctx, bullet);
  for (const shot of game.enemyProjectiles) drawEnemyProjectile(ctx, shot);

  for (const orbital of game.player.orbitals) {
    const x = game.player.x + Math.cos(orbital.angle) * orbital.distance;
    const y = game.player.y + Math.sin(orbital.angle) * orbital.distance;
    drawSprite(ctx, atlases, artManifest.summons[orbital.kind], x, y, 28, "move", game.time * 1000 + orbital.angle * 100, "summon");
  }

  for (const enemy of game.enemies) {
    const animation = enemy.chargeTimer > 0 ? "attack" : "move";
    const size = enemy.kind === "boss" ? 78 : enemy.kind === "elite" ? 48 : Math.max(26, enemy.r * 2.4);
    drawSprite(ctx, atlases, artManifest.enemies[enemy.kind], enemy.x, enemy.y, size, animation, game.time * 1000 + enemy.id * 37, "enemy", enemy.hitFlash > 0 ? 0.62 : 1);
    drawEliteBar(ctx, enemy);
  }

  const player = game.player;
  drawSprite(ctx, atlases, artManifest.characters[player.characterId], player.x, player.y, 38, player.activeTimer > 0 ? "attack" : "move", game.time * 1000, "player", player.invuln > 0 ? 0.8 : 1);
  drawSprite(ctx, atlases, artManifest.weapons[player.weaponId], player.x + 14, player.y - 12, 28, "idle", game.time * 1000, "summon");

  for (const particle of game.particles) {
    ctx.globalAlpha = clamp(particle.life, 0, 1);
    ctx.fillStyle = particle.color === "#72f5ff" ? "#83C7A4" : particle.color;
    if (particle.text) {
      ctx.font = "12px Silkscreen, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(particle.text, quantize(particle.x), quantize(particle.y));
    } else {
      ctx.fillRect(quantize(particle.x), quantize(particle.y), Math.max(2, quantize(particle.size)), Math.max(2, quantize(particle.size)));
    }
  }
  ctx.globalAlpha = 1;
  ctx.restore();
};

const drawLightAperture = (ctx: CanvasRenderingContext2D, game: Game, camera: { x: number; y: number }) => {
  const playerX = quantize(game.player.x + camera.x);
  const playerY = quantize(game.player.y + camera.y);
  ctx.fillStyle = "rgba(6, 9, 10, 0.78)";
  for (let y = 0; y < game.screen.h; y += GRID) {
    const dy = y - playerY;
    if (Math.abs(dy) >= LIGHT_RADIUS) {
      ctx.fillRect(0, y, game.screen.w, GRID);
      continue;
    }
    const width = Math.floor(Math.sqrt(LIGHT_RADIUS ** 2 - dy ** 2) / GRID) * GRID;
    ctx.fillRect(0, y, Math.max(0, playerX - width), GRID);
    ctx.fillRect(playerX + width, y, Math.max(0, game.screen.w - playerX - width), GRID);
  }
};

const drawEnemyEyes = (ctx: CanvasRenderingContext2D, game: Game, camera: { x: number; y: number }) => {
  for (const enemy of game.enemies) {
    const distance = Math.hypot(enemy.x - game.player.x, enemy.y - game.player.y);
    if (distance <= LIGHT_RADIUS - 20 || distance > LIGHT_RADIUS + 260) continue;
    const x = quantize(enemy.x + camera.x);
    const y = quantize(enemy.y + camera.y);
    if (x < -10 || x > game.screen.w + 10 || y < -10 || y > game.screen.h + 10) continue;
    ctx.fillStyle = enemy.kind === "boss" || enemy.kind === "elite" ? "#D8B56D" : "#D7E4D3";
    ctx.fillRect(x - 5, y - 2, 3, 3);
    ctx.fillRect(x + 3, y - 2, 3, 3);
  }
};

const drawControls = (ctx: CanvasRenderingContext2D, controls: GameRenderControls) => {
  if (controls.layout === "keyboard-only") return;
  const drawStick = (stick: GameRenderControls["move"], label: string, color: string) => {
    const x = quantize(stick.x);
    const y = quantize(stick.y);
    ctx.save();
    ctx.globalAlpha = stick.activeId === -1 ? 0.36 : 0.68;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 48, y - 48, 96, 96);
    ctx.globalAlpha = stick.activeId === -1 ? 0.5 : 0.92;
    ctx.fillStyle = color;
    ctx.fillRect(quantize(stick.knobX) - 14, quantize(stick.knobY) - 14, 28, 28);
    ctx.fillStyle = "#06090A";
    ctx.fillRect(quantize(stick.knobX) - 6, quantize(stick.knobY) - 6, 12, 12);
    ctx.globalAlpha = 0.86;
    ctx.fillStyle = "#D7E4D3";
    ctx.font = "10px Silkscreen, monospace";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y + 66);
    ctx.restore();
  };
  drawStick(controls.move, controls.layout === "southpaw" ? "SHOOT" : "MOVE", "#83C7A4");
  drawStick(controls.aim, controls.layout === "southpaw" ? "MOVE" : "SHOOT", "#D35F66");
};

export const drawAtlasGame = (ctx: CanvasRenderingContext2D, game: Game, controls: GameRenderControls, atlases: LoadedAtlases) => {
  const shakeX = game.screenShake > 0 ? (Math.random() - 0.5) * game.screenShake : 0;
  const shakeY = game.screenShake > 0 ? (Math.random() - 0.5) * game.screenShake : 0;
  const camera = {
    x: quantize(game.screen.w / 2 - game.player.x + shakeX),
    y: quantize(game.screen.h / 2 - game.player.y + shakeY)
  };
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, game.screen.w, game.screen.h);
  drawEnvironment(ctx, game, camera, atlases);
  drawWorld(ctx, game, camera, atlases);
  drawLightAperture(ctx, game, camera);
  drawEnemyEyes(ctx, game, camera);
  drawControls(ctx, controls);
};
