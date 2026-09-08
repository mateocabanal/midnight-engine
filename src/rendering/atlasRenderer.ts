import { artManifest } from "../art/manifest";
import { getAnimationFrame } from "../art/spriteResolver";
import type { LoadedAtlases } from "../art/atlasLoader";
import type { AnimationId, AtlasSpriteDefinition } from "../art/types";
import type { Game } from "../game";
import type { GameRenderControls } from "./gameRenderer";

const GRID = 2;
const STAGE_TILE = 64;
const LIGHT_RADIUS = 248;
const LIGHT_FALLOFF = 156;
const animationStates = new WeakMap<object, { state: AnimationId; startedAt: number }>();

const elementColor: Record<Game["bullets"][number]["element"], string> = {
  kinetic: "#D7E4D3",
  lightning: "#83C7A4",
  fire: "#E07A6C",
  ice: "#A7D8D2",
  blood: "#D35F66",
  void: "#A58BB8"
};

const stateElapsed = (entity: object, state: AnimationId, nowSeconds: number) => {
  const current = animationStates.get(entity);
  if (!current || current.state !== state || nowSeconds < current.startedAt) {
    animationStates.set(entity, { state, startedAt: nowSeconds });
    return 0;
  }
  return (nowSeconds - current.startedAt) * 1000;
};

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
  animation: AnimationId,
  elapsed: number,
  fallbackKind: "player" | "enemy" | "summon" | "pickup",
  alpha = 1,
  rotation = 0,
  mirrorX = false
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
    const left = -Math.round((sprite.pivot.x / sprite.logicalSize.width) * width);
    const top = -Math.round((sprite.pivot.y / sprite.logicalSize.height) * height);
    ctx.imageSmoothingEnabled = false;
    ctx.translate(px, py);
    const selectedAnimation = sprite.animations.find((candidate) => candidate.id === animation) ?? sprite.animations[0];
    if (rotation && selectedAnimation.directional !== "screen") ctx.rotate(rotation);
    if (!!sprite.flipX !== mirrorX) ctx.scale(-1, 1);
    ctx.drawImage(image, frame.x, frame.y, frame.width, frame.height, left, top, width, height);
  } else {
    ctx.translate(px, py);
    if (rotation) ctx.rotate(rotation);
    if (mirrorX) ctx.scale(-1, 1);
    drawFallback(ctx, 0, 0, size, sprite.palette, fallbackKind);
  }
  ctx.restore();
};

const drawContactShadow = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, alpha = 0.5) => {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#010202";
  ctx.beginPath();
  ctx.ellipse(quantize(x), quantize(y + radius * 0.35), radius * 0.92, Math.max(3, radius * 0.28), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const drawTileDetails = (ctx: CanvasRenderingContext2D, tx: number, ty: number, sx: number, sy: number) => {
  const detail = hash(tx, ty, 20);
  const accent = hash(tx, ty, 21);
  ctx.save();

  if (detail > 0.955) {
    const cx = sx + 14 + Math.floor(hash(tx, ty, 22) * 34);
    const cy = sy + 16 + Math.floor(hash(tx, ty, 23) * 28);
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = accent > 0.5 ? "#4F9A7E" : "#77678E";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(quantize(cx), quantize(cy), 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(quantize(cx - 10), quantize(cy + 6));
    ctx.lineTo(quantize(cx), quantize(cy - 10));
    ctx.lineTo(quantize(cx + 10), quantize(cy + 6));
    ctx.closePath();
    ctx.stroke();
  } else if (detail > 0.88) {
    const gx = sx + 12 + Math.floor(hash(tx, ty, 24) * 34);
    const gy = sy + 14 + Math.floor(hash(tx, ty, 25) * 28);
    ctx.globalAlpha = 0.42;
    ctx.fillStyle = "#18221F";
    ctx.fillRect(quantize(gx - 7), quantize(gy + 8), 18, 4);
    ctx.fillStyle = accent > 0.68 ? "#56645C" : "#303C37";
    ctx.fillRect(quantize(gx), quantize(gy), 8, 14);
    ctx.fillRect(quantize(gx - 2), quantize(gy + 2), 12, 3);
    if (accent > 0.55) ctx.fillRect(quantize(gx + 3), quantize(gy - 5), 2, 6);
  } else if (detail > 0.72) {
    const cx = sx + 8 + Math.floor(hash(tx, ty, 26) * 44);
    const cy = sy + 8 + Math.floor(hash(tx, ty, 27) * 44);
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = "#47534E";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(quantize(cx - 9), quantize(cy - 4));
    ctx.lineTo(quantize(cx - 2), quantize(cy + 1));
    ctx.lineTo(quantize(cx - 6), quantize(cy + 8));
    ctx.moveTo(quantize(cx - 2), quantize(cy + 1));
    ctx.lineTo(quantize(cx + 8), quantize(cy + 4));
    ctx.stroke();
  } else if (detail > 0.58) {
    const gx = sx + 8 + Math.floor(hash(tx, ty, 28) * 42);
    const gy = sy + 16 + Math.floor(hash(tx, ty, 29) * 34);
    ctx.globalAlpha = 0.28;
    ctx.strokeStyle = accent > 0.5 ? "#405A50" : "#38443F";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(quantize(gx), quantize(gy + 8));
    ctx.lineTo(quantize(gx - 3), quantize(gy));
    ctx.moveTo(quantize(gx + 3), quantize(gy + 8));
    ctx.lineTo(quantize(gx + 6), quantize(gy - 2));
    ctx.moveTo(quantize(gx + 6), quantize(gy + 8));
    ctx.lineTo(quantize(gx + 10), quantize(gy + 1));
    ctx.stroke();
  }
  ctx.restore();
};

const drawEnvironment = (ctx: CanvasRenderingContext2D, game: Game, camera: { x: number; y: number }, atlases: LoadedAtlases) => {
  ctx.fillStyle = "#040707";
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
      const index = roll < 0.48 ? 0 : roll < 0.62 ? 1 : roll < 0.72 ? 2 : roll < 0.8 ? 4 : roll < 0.88 ? 5 : roll < 0.94 ? 6 : 7;
      const sx = quantize(tx * STAGE_TILE + camera.x);
      const sy = quantize(ty * STAGE_TILE + camera.y);
      if (environment) {
        ctx.imageSmoothingEnabled = false;
        ctx.globalAlpha = 0.82;
        ctx.drawImage(environment, (index % 4) * 32, Math.floor(index / 4) * 32, 32, 32, sx, sy, STAGE_TILE, STAGE_TILE);
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = roll < 0.5 ? "#0B1210" : "#0D1714";
        ctx.fillRect(sx, sy, STAGE_TILE, STAGE_TILE);
      }

      const patch = hash(tx, ty, 8);
      if (patch > 0.62) {
        ctx.fillStyle = patch > 0.86 ? "rgba(79, 154, 126, 0.06)" : "rgba(215, 228, 211, 0.025)";
        ctx.fillRect(sx, sy, STAGE_TILE, STAGE_TILE);
      }
      drawTileDetails(ctx, tx, ty, sx, sy);
    }
  }

  const fog = ctx.createLinearGradient(0, 0, game.screen.w, game.screen.h);
  fog.addColorStop(0, "rgba(79,154,126,0.03)");
  fog.addColorStop(0.52, "rgba(4,7,7,0)");
  fog.addColorStop(1, "rgba(119,103,142,0.045)");
  ctx.fillStyle = fog;
  ctx.fillRect(0, 0, game.screen.w, game.screen.h);
};

const drawProjectileTrail = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  vx: number,
  vy: number,
  color: string,
  length: number,
  width: number,
  alpha: number
) => {
  const speed = Math.hypot(vx, vy);
  if (speed < 1) return;
  const dx = (vx / speed) * length;
  const dy = (vy / speed) * length;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "square";
  ctx.beginPath();
  ctx.moveTo(quantize(x - dx), quantize(y - dy));
  ctx.lineTo(quantize(x), quantize(y));
  ctx.stroke();
  ctx.globalAlpha = alpha * 0.38;
  ctx.lineWidth = width + 4;
  ctx.stroke();
  ctx.restore();
};

const drawBullet = (ctx: CanvasRenderingContext2D, atlases: LoadedAtlases, bullet: Game["bullets"][number]) => {
  const angle = Math.atan2(bullet.vy, bullet.vx);
  const color = elementColor[bullet.element];
  drawProjectileTrail(ctx, bullet.x, bullet.y, bullet.vx, bullet.vy, color, clamp(12 + Math.hypot(bullet.vx, bullet.vy) * 0.025, 14, 30), 2, 0.72);
  drawSprite(
    ctx,
    atlases,
    artManifest.bullets[bullet.element],
    bullet.x,
    bullet.y,
    Math.max(20, quantize(bullet.r * 3.8)),
    "flight",
    bullet.age * 1000,
    "summon",
    1,
    angle
  );
};

const drawEnemyProjectile = (ctx: CanvasRenderingContext2D, atlases: LoadedAtlases, shot: Game["enemyProjectiles"][number]) => {
  drawProjectileTrail(ctx, shot.x, shot.y, shot.vx, shot.vy, "#D35F66", 16, 2, 0.48);
  drawSprite(
    ctx,
    atlases,
    artManifest.bullets.blood,
    shot.x,
    shot.y,
    Math.max(12, quantize(shot.r * 3)),
    "flight",
    shot.age * 1000,
    "summon",
    1,
    Math.atan2(shot.vy, shot.vx)
  );
};

const drawEliteBar = (ctx: CanvasRenderingContext2D, enemy: Game["enemies"][number]) => {
  if (enemy.kind !== "elite" && enemy.kind !== "boss") return;
  const width = enemy.kind === "boss" ? 62 : 36;
  const left = quantize(enemy.x - width / 2);
  const top = quantize(enemy.y - enemy.r - (enemy.kind === "boss" ? 18 : 13));
  const pct = clamp(enemy.hp / enemy.maxHp, 0, 1);
  ctx.fillStyle = "rgba(1,2,2,.82)";
  ctx.fillRect(left - 2, top - 2, width + 4, 7);
  ctx.fillStyle = enemy.kind === "boss" ? "#D8B56D" : "#D35F66";
  ctx.fillRect(left, top, Math.max(1, Math.floor(width * pct)), 3);
  ctx.fillStyle = "rgba(215,228,211,.36)";
  ctx.fillRect(left, top + 4, width, 1);
};

const drawAura = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, alpha: number) => {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.35, color);
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = alpha;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

const drawWorld = (ctx: CanvasRenderingContext2D, game: Game, camera: { x: number; y: number }, atlases: LoadedAtlases) => {
  ctx.save();
  ctx.translate(camera.x, camera.y);

  if (game.player.orbitals.length > 0) {
    const radius = game.player.orbitals.reduce((sum, orbital) => sum + orbital.distance, 0) / game.player.orbitals.length;
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = "#83C7A4";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 12]);
    ctx.beginPath();
    ctx.arc(quantize(game.player.x), quantize(game.player.y), quantize(radius), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  for (const gem of game.gems) {
    drawContactShadow(ctx, gem.x, gem.y + 4, 6, 0.24);
    drawAura(ctx, gem.x, gem.y, 24, "rgba(131,199,164,0.9)", 0.16);
    drawSprite(ctx, atlases, artManifest.pickups.xp, gem.x, gem.y, 22, "idle", game.time * 1000 + gem.value * 50, "pickup");
  }
  for (const bullet of game.bullets) drawBullet(ctx, atlases, bullet);
  for (const shot of game.enemyProjectiles) drawEnemyProjectile(ctx, atlases, shot);

  for (const orbital of game.player.orbitals) {
    const x = game.player.x + Math.cos(orbital.angle) * orbital.distance;
    const y = game.player.y + Math.sin(orbital.angle) * orbital.distance;
    const spawnElapsed = orbital.spawnedAt === undefined ? Number.POSITIVE_INFINITY : (game.time - orbital.spawnedAt) * 1000;
    const animation = orbital.dying !== undefined ? "death" : orbital.attackFlash > 0 ? "attack" : spawnElapsed < 420 ? "spawn" : "move";
    const size = orbital.kind === "blade" ? 72 : 50;
    drawContactShadow(ctx, x, y, Math.max(8, size * 0.22), 0.3);
    if (orbital.attackFlash > 0) drawAura(ctx, x, y, 32, "rgba(131,199,164,0.9)", 0.24);
    drawSprite(ctx, atlases, artManifest.summons[orbital.kind], x, y, size, animation, stateElapsed(orbital, animation, game.time), "summon", 1, orbital.kind === "blade" || orbital.kind === "chakram" ? orbital.angle : 0);
  }

  for (const enemy of game.enemies) {
    const animation = enemy.hitFlash > 0 ? "hit" : enemy.chargeTimer > 0 ? "attack" : "move";
    const size = enemy.kind === "boss" ? 108 : enemy.kind === "elite" ? 68 : Math.max(38, enemy.r * 3);
    drawContactShadow(ctx, enemy.x, enemy.y, Math.max(10, enemy.r * 1.15), enemy.kind === "boss" ? 0.7 : 0.5);
    if (enemy.kind === "boss") drawAura(ctx, enemy.x, enemy.y - 10, 86, "rgba(216,181,109,0.92)", 0.16);
    else if (enemy.kind === "elite") drawAura(ctx, enemy.x, enemy.y - 6, 54, "rgba(211,95,102,0.9)", 0.12);
    drawSprite(
      ctx,
      atlases,
      artManifest.enemies[enemy.kind],
      enemy.x,
      enemy.y,
      size,
      animation,
      stateElapsed(enemy, animation, game.time),
      "enemy",
      enemy.hitFlash > 0 ? 0.72 : 1,
      0,
      game.player.x < enemy.x
    );
    if (enemy.hitFlash > 0) {
      ctx.save();
      ctx.globalAlpha = clamp(enemy.hitFlash * 7, 0, 0.72);
      ctx.strokeStyle = "#F4F0DF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(quantize(enemy.x), quantize(enemy.y - 4), Math.max(10, enemy.r + 5), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    drawEliteBar(ctx, enemy);
  }

  const player = game.player;
  const playerAnimation: AnimationId = player.activeTimer > 0 ? "active" : player.reload > 0 ? "reload" : player.cooldown > 0 ? "attack" : player.moving ? "move" : "idle";
  drawContactShadow(ctx, player.x, player.y, 16, 0.62);
  if (player.shield > 0 || player.activeTimer > 0) {
    const auraColor = player.activeTimer > 0 ? "rgba(216,181,109,0.95)" : "rgba(131,199,164,0.9)";
    drawAura(ctx, player.x, player.y - 6, player.activeTimer > 0 ? 62 : 48, auraColor, player.activeTimer > 0 ? 0.2 : 0.11);
    ctx.save();
    ctx.globalAlpha = player.activeTimer > 0 ? 0.5 : 0.28;
    ctx.strokeStyle = player.activeTimer > 0 ? "#D8B56D" : "#83C7A4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(quantize(player.x), quantize(player.y - 4), 22 + Math.sin(game.time * 5) * 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  drawSprite(
    ctx,
    atlases,
    artManifest.characters[player.characterId],
    player.x,
    player.y,
    50,
    playerAnimation,
    stateElapsed(player, playerAnimation, game.time),
    "player",
    player.invuln > 0 ? 0.84 : 1,
    0,
    Math.cos(player.facingAngle) < 0
  );

  const weaponAnimation: AnimationId = player.activeTimer > 0 ? "active" : player.reload > 0 ? "reload" : player.cooldown > 0 ? "attack" : "idle";
  const weaponDistance = player.reload > 0 ? 12 : 18;
  const weaponX = player.x + Math.cos(player.facingAngle) * weaponDistance;
  const weaponY = player.y - 14 + Math.sin(player.facingAngle) * weaponDistance;
  drawSprite(
    ctx,
    atlases,
    artManifest.weapons[player.weaponId],
    weaponX,
    weaponY,
    40,
    weaponAnimation,
    stateElapsed(player, weaponAnimation, game.time),
    "summon",
    1,
    player.facingAngle
  );

  for (const particle of game.particles) {
    const alpha = clamp(particle.life, 0, 1);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = particle.color === "#72f5ff" ? "#83C7A4" : particle.color;
    if (particle.text) {
      ctx.font = "12px Silkscreen, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "#06090A";
      ctx.shadowBlur = 0;
      ctx.fillText(particle.text, quantize(particle.x + 1), quantize(particle.y + 2));
      ctx.globalAlpha = Math.min(1, alpha * 1.2);
      ctx.fillStyle = particle.color === "#72f5ff" ? "#A9E8C8" : particle.color;
      ctx.fillText(particle.text, quantize(particle.x), quantize(particle.y));
    } else {
      const size = Math.max(2, quantize(particle.size));
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = alpha * 0.18;
      ctx.fillRect(quantize(particle.x - size), quantize(particle.y - size), size * 2, size * 2);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = alpha;
      ctx.fillRect(quantize(particle.x), quantize(particle.y), size, size);
    }
    ctx.restore();
  }
  ctx.restore();
};

const drawLighting = (ctx: CanvasRenderingContext2D, game: Game, camera: { x: number; y: number }) => {
  const playerX = quantize(game.player.x + camera.x);
  const playerY = quantize(game.player.y + camera.y - 8);

  const darkness = ctx.createRadialGradient(playerX, playerY, LIGHT_RADIUS * 0.38, playerX, playerY, LIGHT_RADIUS + LIGHT_FALLOFF);
  darkness.addColorStop(0, "rgba(2,4,4,0.02)");
  darkness.addColorStop(0.46, "rgba(2,4,4,0.08)");
  darkness.addColorStop(0.72, "rgba(2,4,4,0.46)");
  darkness.addColorStop(1, "rgba(1,2,2,0.9)");
  ctx.fillStyle = darkness;
  ctx.fillRect(0, 0, game.screen.w, game.screen.h);

  const halo = ctx.createRadialGradient(playerX, playerY, 4, playerX, playerY, 118);
  halo.addColorStop(0, "rgba(131,199,164,0.10)");
  halo.addColorStop(0.55, "rgba(79,154,126,0.035)");
  halo.addColorStop(1, "rgba(0,0,0,0)");
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = halo;
  ctx.fillRect(playerX - 120, playerY - 120, 240, 240);
  ctx.restore();

  const progress = clamp(game.time / game.objective.duration, 0, 1);
  if (progress > 0.76) {
    const dawn = ctx.createLinearGradient(0, 0, 0, game.screen.h * 0.62);
    const strength = ((progress - 0.76) / 0.24) * 0.17;
    dawn.addColorStop(0, `rgba(216,181,109,${strength})`);
    dawn.addColorStop(1, "rgba(216,181,109,0)");
    ctx.fillStyle = dawn;
    ctx.fillRect(0, 0, game.screen.w, game.screen.h * 0.62);
  }

  const vignette = ctx.createRadialGradient(game.screen.w / 2, game.screen.h / 2, Math.min(game.screen.w, game.screen.h) * 0.28, game.screen.w / 2, game.screen.h / 2, Math.max(game.screen.w, game.screen.h) * 0.72);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(0.74, "rgba(0,0,0,0.05)");
  vignette.addColorStop(1, "rgba(0,0,0,0.46)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, game.screen.w, game.screen.h);
};

const drawEnemyEyes = (ctx: CanvasRenderingContext2D, game: Game, camera: { x: number; y: number }) => {
  for (const enemy of game.enemies) {
    const distance = Math.hypot(enemy.x - game.player.x, enemy.y - game.player.y);
    if (distance <= LIGHT_RADIUS + 10 || distance > LIGHT_RADIUS + LIGHT_FALLOFF + 190) continue;
    const x = quantize(enemy.x + camera.x);
    const y = quantize(enemy.y + camera.y);
    if (x < -10 || x > game.screen.w + 10 || y < -10 || y > game.screen.h + 10) continue;
    const alpha = clamp(1 - (distance - LIGHT_RADIUS) / (LIGHT_FALLOFF + 190), 0.15, 0.7);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = enemy.kind === "boss" || enemy.kind === "elite" ? "#D8B56D" : "#D7E4D3";
    ctx.fillRect(x - 5, y - 2, 3, 3);
    ctx.fillRect(x + 3, y - 2, 3, 3);
    ctx.restore();
  }
};

const drawScreenTexture = (ctx: CanvasRenderingContext2D, game: Game) => {
  ctx.save();
  ctx.globalAlpha = 0.055;
  ctx.fillStyle = "#D7E4D3";
  const timeKey = Math.floor(game.time * 4);
  for (let i = 0; i < 34; i += 1) {
    const x = quantize(hash(i, timeKey, 70) * game.screen.w);
    const y = quantize(hash(i, timeKey, 71) * game.screen.h);
    const size = hash(i, timeKey, 72) > 0.8 ? 2 : 1;
    ctx.fillRect(x, y, size, size);
  }
  ctx.restore();
};

const drawControls = (ctx: CanvasRenderingContext2D, controls: GameRenderControls) => {
  if (controls.layout === "keyboard-only") return;
  const drawStick = (stick: GameRenderControls["move"], label: string, color: string) => {
    const x = quantize(stick.x);
    const y = quantize(stick.y);
    ctx.save();
    ctx.globalAlpha = stick.activeId === -1 ? 0.24 : 0.52;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 46, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = stick.activeId === -1 ? 0.4 : 0.82;
    ctx.fillStyle = "rgba(6,9,10,.82)";
    ctx.beginPath();
    ctx.arc(quantize(stick.knobX), quantize(stick.knobY), 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.globalAlpha = 0.82;
    ctx.fillStyle = "#D7E4D3";
    ctx.font = "10px Silkscreen, monospace";
    ctx.textAlign = "center";
    ctx.fillText(label, x, y + 64);
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
  drawLighting(ctx, game, camera);
  drawEnemyEyes(ctx, game, camera);
  drawScreenTexture(ctx, game);
  drawControls(ctx, controls);
};
