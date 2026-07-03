export type InputState = {
  moveX: number;
  moveY: number;
  dash: boolean;
};

type Vec = { x: number; y: number };
type UpgradeId =
  | "overclock"
  | "split"
  | "mirror"
  | "static"
  | "ricochet"
  | "frostfire"
  | "grave"
  | "gemBomb"
  | "bloodTax"
  | "vampire"
  | "orbit"
  | "parasite"
  | "recursiveGun"
  | "stormReactor"
  | "bloodEconomy"
  | "solarFrostbite"
  | "gemSingularity";

type Enemy = {
  id: number;
  x: number;
  y: number;
  r: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  burn: number;
  freeze: number;
  poison: number;
  hitFlash: number;
};

type Bullet = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  damage: number;
  life: number;
  pierce: number;
  bounces: number;
  split: number;
  crit: number;
  element: "kinetic" | "lightning" | "fire" | "ice" | "blood" | "void";
  fromOrbit?: boolean;
};

type Gem = {
  x: number;
  y: number;
  value: number;
  magnet: number;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  text?: string;
  size: number;
};

type Orbital = {
  angle: number;
  distance: number;
  damage: number;
  life: number;
  speed: number;
};

type Player = {
  x: number;
  y: number;
  r: number;
  hp: number;
  maxHp: number;
  shield: number;
  speed: number;
  fireRate: number;
  damage: number;
  crit: number;
  cooldown: number;
  reload: number;
  shots: number;
  magazine: number;
  dashCooldown: number;
  invuln: number;
  souls: number;
  orbitals: Orbital[];
};

export type Game = {
  screen: { w: number; h: number };
  player: Player;
  enemies: Enemy[];
  bullets: Bullet[];
  gems: Gem[];
  particles: Particle[];
  upgrades: Partial<Record<UpgradeId, number>>;
  time: number;
  spawnTimer: number;
  level: number;
  xp: number;
  nextXp: number;
  kills: number;
  shotCounter: number;
  idCounter: number;
  gameOver: boolean;
  ui: {
    time: string;
    level: string;
    kills: string;
    hpPct: number;
    xpPct: number;
    gameOver: boolean;
  };
};

type UpgradeDef = {
  id: UpgradeId;
  name: string;
  description: string;
  fusion?: boolean;
  requires?: UpgradeId[];
  apply: (game: Game) => void;
};

export type Choice = UpgradeDef;

const TAU = Math.PI * 2;

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const len = (x: number, y: number) => Math.hypot(x, y) || 1;
const has = (game: Game, id: UpgradeId) => (game.upgrades[id] || 0) > 0;
const count = (game: Game, id: UpgradeId) => game.upgrades[id] || 0;
const addUpgrade = (game: Game, id: UpgradeId) => {
  game.upgrades[id] = (game.upgrades[id] || 0) + 1;
};

const upgradeDefs: UpgradeDef[] = [
  {
    id: "overclock",
    name: "Overclocked Cylinder",
    description: "+22% fire rate. Every stack makes the engine angrier.",
    apply: (game) => {
      addUpgrade(game, "overclock");
      game.player.fireRate *= 1.22;
    }
  },
  {
    id: "split",
    name: "Split Chamber",
    description: "Bullets split on first hit. More stacks add more child shots.",
    apply: (game) => addUpgrade(game, "split")
  },
  {
    id: "mirror",
    name: "Mirror Chamber",
    description: "Every fifth shot is copied twice with inherited modifiers.",
    apply: (game) => addUpgrade(game, "mirror")
  },
  {
    id: "static",
    name: "Static Prayer",
    description: "Reloads and dashes chain lightning through nearby enemies.",
    apply: (game) => addUpgrade(game, "static")
  },
  {
    id: "ricochet",
    name: "Hungry Ricochet",
    description: "Bullets bounce off walls. Bounced bullets hit harder.",
    apply: (game) => addUpgrade(game, "ricochet")
  },
  {
    id: "frostfire",
    name: "Frostfire Rounds",
    description: "Shots alternate burn and freeze. Burning frozen enemies detonate.",
    apply: (game) => addUpgrade(game, "frostfire")
  },
  {
    id: "grave",
    name: "Grave Interest",
    description: "Kills mint souls. Three souls become a temporary orbiting blade.",
    apply: (game) => addUpgrade(game, "grave")
  },
  {
    id: "gemBomb",
    name: "Gem Bomb",
    description: "Collected XP gems burst for damage. Chain pickups get nasty.",
    apply: (game) => addUpgrade(game, "gemBomb")
  },
  {
    id: "bloodTax",
    name: "Blood Tax",
    description: "Reloads spend a sliver of HP to fire a blood nova.",
    apply: (game) => addUpgrade(game, "bloodTax")
  },
  {
    id: "vampire",
    name: "Vampire Circuit",
    description: "Kills restore HP. Overhealing becomes a small shield.",
    apply: (game) => addUpgrade(game, "vampire")
  },
  {
    id: "orbit",
    name: "Crown of Teeth",
    description: "Gain orbiting teeth. Expired bullets may join the crown.",
    apply: (game) => {
      addUpgrade(game, "orbit");
      game.player.orbitals.push({ angle: rand(0, TAU), distance: rand(42, 62), damage: 7, life: 40, speed: rand(2.2, 3.6) });
    }
  },
  {
    id: "parasite",
    name: "Parasite Rounds",
    description: "Some kills hatch seeking blood shots toward another target.",
    apply: (game) => addUpgrade(game, "parasite")
  },
  {
    id: "recursiveGun",
    name: "Fusion: Recursive Gun",
    description: "Copied bullets can copy, split, and crit again with decay.",
    fusion: true,
    requires: ["split", "mirror", "overclock"],
    apply: (game) => addUpgrade(game, "recursiveGun")
  },
  {
    id: "stormReactor",
    name: "Fusion: Storm Reactor",
    description: "Bounces and orbit hits trigger micro-lightning.",
    fusion: true,
    requires: ["static", "ricochet", "orbit"],
    apply: (game) => addUpgrade(game, "stormReactor")
  },
  {
    id: "bloodEconomy",
    name: "Fusion: Blood Economy",
    description: "HP, souls, reloads, and shields convert into each other.",
    fusion: true,
    requires: ["bloodTax", "vampire", "grave"],
    apply: (game) => addUpgrade(game, "bloodEconomy")
  },
  {
    id: "solarFrostbite",
    name: "Fusion: Solar Frostbite",
    description: "Burn and freeze stack together, then shatter into seeking shards.",
    fusion: true,
    requires: ["frostfire", "parasite"],
    apply: (game) => addUpgrade(game, "solarFrostbite")
  },
  {
    id: "gemSingularity",
    name: "Fusion: Gem Singularity",
    description: "Gem explosions pull enemies inward and can collect more gems.",
    fusion: true,
    requires: ["gemBomb", "orbit"],
    apply: (game) => addUpgrade(game, "gemSingularity")
  }
];

export const createGame = (): Game => {
  const game: Game = {
    screen: { w: 390, h: 780 },
    player: {
      x: 195,
      y: 390,
      r: 13,
      hp: 100,
      maxHp: 100,
      shield: 0,
      speed: 188,
      fireRate: 1,
      damage: 14,
      crit: 0.08,
      cooldown: 0,
      reload: 0,
      shots: 0,
      magazine: 8,
      dashCooldown: 0,
      invuln: 0,
      souls: 0,
      orbitals: []
    },
    enemies: [],
    bullets: [],
    gems: [],
    particles: [],
    upgrades: {},
    time: 0,
    spawnTimer: 0,
    level: 1,
    xp: 0,
    nextXp: 12,
    kills: 0,
    shotCounter: 0,
    idCounter: 1,
    gameOver: false,
    ui: {
      time: "00:00",
      level: "1",
      kills: "0",
      hpPct: 100,
      xpPct: 0,
      gameOver: false
    }
  };

  for (let i = 0; i < 12; i += 1) spawnEnemy(game, true);
  updateUi(game);
  return game;
};

export const getUpgradeChoices = (game: Game): Choice[] => {
  const available = upgradeDefs.filter((upgrade) => {
    if (upgrade.fusion && has(game, upgrade.id)) return false;
    if (upgrade.requires && !upgrade.requires.every((id) => has(game, id))) return false;
    return true;
  });

  const fusions = available.filter((upgrade) => upgrade.fusion);
  const basics = available.filter((upgrade) => !upgrade.fusion);
  const pool = [...fusions, ...shuffle(basics)].slice(0, Math.max(3, fusions.length ? 2 : 3));

  return shuffle(pool).slice(0, 3);
};

export const stepGame = (game: Game, input: InputState, dt: number): boolean => {
  const player = game.player;
  game.time += dt;
  player.cooldown -= dt;
  player.reload -= dt;
  player.dashCooldown -= dt;
  player.invuln -= dt;
  game.spawnTimer -= dt;

  const moveLen = len(input.moveX, input.moveY);
  const moving = Math.abs(input.moveX) + Math.abs(input.moveY) > 0.03;
  if (moving) {
    player.x += (input.moveX / moveLen) * player.speed * dt;
    player.y += (input.moveY / moveLen) * player.speed * dt;
  }

  if (input.dash && player.dashCooldown <= 0) {
    const dashX = moving ? input.moveX / moveLen : 1;
    const dashY = moving ? input.moveY / moveLen : 0;
    player.x += dashX * 88;
    player.y += dashY * 88;
    player.dashCooldown = 1.4;
    player.invuln = 0.24;
    burst(game, player.x, player.y, "#72f5ff", 10);
    if (has(game, "static")) chainLightning(game, player.x, player.y, 88 + count(game, "static") * 24, 8 + count(game, "static") * 4);
  }
  input.dash = false;

  player.x = clamp(player.x, 18, game.screen.w - 18);
  player.y = clamp(player.y, 72, game.screen.h - 18);

  if (game.spawnTimer <= 0) {
    const amount = 1 + Math.floor(game.time / 28);
    for (let i = 0; i < amount; i += 1) spawnEnemy(game);
    game.spawnTimer = Math.max(0.22, 0.92 - game.time * 0.006);
  }

  if (player.reload <= 0 && player.cooldown <= 0) shoot(game);
  updateBullets(game, dt);
  updateEnemies(game, dt);
  updateGems(game, dt);
  updateOrbitals(game, dt);
  updateParticles(game, dt);

  const leveled = game.xp >= game.nextXp;
  if (leveled) {
    game.xp -= game.nextXp;
    game.nextXp = Math.floor(game.nextXp * 1.22 + 8);
    game.level += 1;
    player.hp = Math.min(player.maxHp, player.hp + 8);
  }

  if (player.hp <= 0) game.gameOver = true;
  updateUi(game);
  return leveled;
};

export const drawGame = (
  ctx: CanvasRenderingContext2D,
  game: Game,
  joystick: { activeId: number; x: number; y: number; knobX: number; knobY: number }
) => {
  const { w, h } = game.screen;
  ctx.clearRect(0, 0, w, h);

  const gradient = ctx.createRadialGradient(game.player.x, game.player.y, 20, game.player.x, game.player.y, Math.max(w, h) * 0.78);
  gradient.addColorStop(0, "#171a34");
  gradient.addColorStop(0.62, "#0b0d18");
  gradient.addColorStop(1, "#03040a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  drawGrid(ctx, w, h, game.time);

  for (const gem of game.gems) {
    ctx.fillStyle = "#a78bfa";
    diamond(ctx, gem.x, gem.y, 4 + gem.value * 0.4);
  }

  for (const bullet of game.bullets) {
    ctx.beginPath();
    ctx.fillStyle = bulletColor(bullet.element);
    ctx.shadowColor = bulletColor(bullet.element);
    ctx.shadowBlur = 12;
    ctx.arc(bullet.x, bullet.y, bullet.r, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  for (const orbital of game.player.orbitals) {
    const x = game.player.x + Math.cos(orbital.angle) * orbital.distance;
    const y = game.player.y + Math.sin(orbital.angle) * orbital.distance;
    ctx.fillStyle = has(game, "stormReactor") ? "#72f5ff" : "#f8fafc";
    diamond(ctx, x, y, 8);
  }

  for (const enemy of game.enemies) {
    const hpPct = enemy.hp / enemy.maxHp;
    ctx.beginPath();
    ctx.fillStyle = enemy.freeze > 0 ? "#7dd3fc" : enemy.burn > 0 ? "#fb923c" : "#e11d48";
    ctx.globalAlpha = enemy.hitFlash > 0 ? 0.62 : 0.92;
    ctx.arc(enemy.x, enemy.y, enemy.r, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#320715";
    ctx.fillRect(enemy.x - enemy.r, enemy.y - enemy.r - 8, enemy.r * 2, 3);
    ctx.fillStyle = "#fda4af";
    ctx.fillRect(enemy.x - enemy.r, enemy.y - enemy.r - 8, enemy.r * 2 * hpPct, 3);
  }

  for (const particle of game.particles) {
    ctx.globalAlpha = clamp(particle.life, 0, 1);
    if (particle.text) {
      ctx.font = `${particle.size}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = particle.color;
      ctx.fillText(particle.text, particle.x, particle.y);
    } else {
      ctx.beginPath();
      ctx.fillStyle = particle.color;
      ctx.arc(particle.x, particle.y, particle.size, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  const p = game.player;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(game.time * 3);
  ctx.fillStyle = p.invuln > 0 ? "#72f5ff" : "#f8fafc";
  diamond(ctx, 0, 0, p.r + 4);
  ctx.restore();

  if (p.shield > 0) {
    ctx.beginPath();
    ctx.strokeStyle = "#67e8f9";
    ctx.lineWidth = 2;
    ctx.arc(p.x, p.y, p.r + 9 + Math.sin(game.time * 8) * 2, 0, TAU);
    ctx.stroke();
  }

  if (joystick.activeId !== -1) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.arc(joystick.x, joystick.y, 62, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.arc(joystick.knobX, joystick.knobY, 24, 0, TAU);
    ctx.fill();
  }
};

const shoot = (game: Game) => {
  const player = game.player;
  if (player.reload > 0) return;

  if (player.shots >= player.magazine) {
    player.reload = Math.max(0.22, 0.72 - count(game, "overclock") * 0.04);
    player.shots = 0;
    onReload(game);
    return;
  }

  const target = nearestEnemy(game, player.x, player.y);
  const angle = target ? Math.atan2(target.y - player.y, target.x - player.x) : -Math.PI / 2;
  const spread = 0.08;
  const baseDamage = player.damage * (1 + count(game, "overclock") * 0.04);
  const element = has(game, "frostfire") ? (game.shotCounter % 2 === 0 ? "fire" : "ice") : has(game, "bloodTax") ? "blood" : "kinetic";

  fireBullet(game, player.x, player.y, angle + rand(-spread, spread), baseDamage, element, {
    split: count(game, "split"),
    bounces: count(game, "ricochet"),
    crit: player.crit + count(game, "mirror") * 0.02
  });

  game.shotCounter += 1;
  player.shots += 1;
  player.cooldown = Math.max(0.07, 0.32 / player.fireRate);

  if (has(game, "mirror") && game.shotCounter % 5 === 0) {
    const copies = has(game, "recursiveGun") ? 4 : 2;
    for (let i = 0; i < copies; i += 1) {
      const offset = (i - (copies - 1) / 2) * 0.22;
      fireBullet(game, player.x, player.y, angle + offset, baseDamage * 0.72, element, {
        split: has(game, "recursiveGun") ? count(game, "split") : 0,
        bounces: count(game, "ricochet"),
        crit: player.crit + 0.16
      });
    }
    burst(game, player.x, player.y, "#c084fc", 7);
  }
};

const fireBullet = (
  game: Game,
  x: number,
  y: number,
  angle: number,
  damage: number,
  element: Bullet["element"],
  mods: Partial<Pick<Bullet, "split" | "bounces" | "crit" | "pierce">> = {}
) => {
  const speed = 410 + count(game, "overclock") * 20;
  game.bullets.push({
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: element === "void" ? 7 : 5,
    damage,
    life: 1.25,
    pierce: mods.pierce ?? 0,
    bounces: mods.bounces ?? 0,
    split: mods.split ?? 0,
    crit: mods.crit ?? 0,
    element
  });
};

const updateBullets = (game: Game, dt: number) => {
  for (let i = game.bullets.length - 1; i >= 0; i -= 1) {
    const bullet = game.bullets[i];
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;

    const bounced = bounceBullet(game, bullet);
    if (bounced && has(game, "stormReactor")) chainLightning(game, bullet.x, bullet.y, 70, 5);

    let remove = bullet.life <= 0;
    for (const enemy of game.enemies) {
      const d = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);
      if (d > enemy.r + bullet.r) continue;

      const crit = Math.random() < bullet.crit;
      const damage = bullet.damage * (crit ? 2.2 : 1);
      hurtEnemy(game, enemy, damage, bullet.element);
      burst(game, bullet.x, bullet.y, crit ? "#fef08a" : bulletColor(bullet.element), crit ? 8 : 4);

      if (bullet.split > 0) splitBullet(game, bullet);
      if (bullet.pierce > 0) bullet.pierce -= 1;
      else remove = true;
      break;
    }

    if (remove) {
      if (has(game, "orbit") && !bullet.fromOrbit && Math.random() < 0.18 + count(game, "orbit") * 0.08) {
        game.player.orbitals.push({
          angle: rand(0, TAU),
          distance: rand(44, 72),
          damage: Math.max(5, bullet.damage * 0.42),
          life: 12,
          speed: rand(2.2, 4.2)
        });
      }
      game.bullets.splice(i, 1);
    }
  }
};

const bounceBullet = (game: Game, bullet: Bullet) => {
  let bounced = false;
  if (bullet.bounces <= 0) return false;
  if (bullet.x < 8 || bullet.x > game.screen.w - 8) {
    bullet.vx *= -1;
    bullet.x = clamp(bullet.x, 8, game.screen.w - 8);
    bounced = true;
  }
  if (bullet.y < 64 || bullet.y > game.screen.h - 8) {
    bullet.vy *= -1;
    bullet.y = clamp(bullet.y, 64, game.screen.h - 8);
    bounced = true;
  }
  if (bounced) {
    bullet.bounces -= 1;
    bullet.damage *= 1.18;
  }
  return bounced;
};

const splitBullet = (game: Game, bullet: Bullet) => {
  const angle = Math.atan2(bullet.vy, bullet.vx);
  const childCount = has(game, "recursiveGun") ? 3 : 2;
  for (let i = 0; i < childCount; i += 1) {
    const offset = (i - (childCount - 1) / 2) * 0.62;
    fireBullet(game, bullet.x, bullet.y, angle + offset, bullet.damage * 0.45, bullet.element, {
      split: has(game, "recursiveGun") ? bullet.split - 1 : 0,
      bounces: Math.max(0, bullet.bounces - 1),
      crit: bullet.crit * 0.8
    });
  }
  bullet.split = 0;
};

const updateEnemies = (game: Game, dt: number) => {
  const player = game.player;

  for (let i = game.enemies.length - 1; i >= 0; i -= 1) {
    const enemy = game.enemies[i];
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const d = len(dx, dy);
    const freezeSlow = enemy.freeze > 0 ? 0.38 : 1;
    enemy.x += (dx / d) * enemy.speed * freezeSlow * dt;
    enemy.y += (dy / d) * enemy.speed * freezeSlow * dt;
    enemy.hitFlash -= dt;

    if (enemy.burn > 0) {
      enemy.burn -= dt;
      hurtEnemy(game, enemy, (has(game, "solarFrostbite") ? 5 : 3) * dt, "fire", false);
    }
    if (enemy.poison > 0) {
      enemy.poison -= dt;
      hurtEnemy(game, enemy, 4 * dt, "blood", false);
    }
    enemy.freeze -= dt;

    if (Math.hypot(player.x - enemy.x, player.y - enemy.y) < player.r + enemy.r) {
      hurtPlayer(game, enemy.damage * dt * 1.8);
    }

    if (enemy.hp <= 0) {
      killEnemy(game, enemy);
      game.enemies.splice(i, 1);
    }
  }
};

const updateGems = (game: Game, dt: number) => {
  const player = game.player;
  for (let i = game.gems.length - 1; i >= 0; i -= 1) {
    const gem = game.gems[i];
    const dx = player.x - gem.x;
    const dy = player.y - gem.y;
    const d = Math.hypot(dx, dy);
    const magnetRange = 82 + gem.magnet + count(game, "gemBomb") * 24;
    if (d < magnetRange) {
      gem.x += (dx / (d || 1)) * (240 + magnetRange) * dt;
      gem.y += (dy / (d || 1)) * (240 + magnetRange) * dt;
    }
    if (d < player.r + 10) {
      game.xp += gem.value;
      if (has(game, "gemBomb")) {
        explode(game, gem.x, gem.y, 62 + count(game, "gemBomb") * 14, 10 + gem.value * 1.5, "#a78bfa");
        if (has(game, "gemSingularity")) {
          pullEnemies(game, gem.x, gem.y, 108, 26);
          collectNearbyGems(game, gem.x, gem.y, 72);
        }
      }
      game.gems.splice(i, 1);
    }
  }
};

const updateOrbitals = (game: Game, dt: number) => {
  const player = game.player;
  for (let i = player.orbitals.length - 1; i >= 0; i -= 1) {
    const orbital = player.orbitals[i];
    orbital.angle += orbital.speed * dt;
    orbital.life -= dt;
    const x = player.x + Math.cos(orbital.angle) * orbital.distance;
    const y = player.y + Math.sin(orbital.angle) * orbital.distance;
    for (const enemy of game.enemies) {
      if (Math.hypot(enemy.x - x, enemy.y - y) < enemy.r + 8) {
        hurtEnemy(game, enemy, orbital.damage * dt * 5, has(game, "stormReactor") ? "lightning" : "kinetic");
        if (has(game, "stormReactor") && Math.random() < 0.08) chainLightning(game, x, y, 66, 4);
      }
    }
    if (orbital.life <= 0) player.orbitals.splice(i, 1);
  }
};

const updateParticles = (game: Game, dt: number) => {
  for (let i = game.particles.length - 1; i >= 0; i -= 1) {
    const p = game.particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    if (p.life <= 0) game.particles.splice(i, 1);
  }
};

const onReload = (game: Game) => {
  const player = game.player;
  if (has(game, "static")) chainLightning(game, player.x, player.y, 96 + count(game, "static") * 20, 8 + count(game, "static") * 4);

  if (has(game, "bloodTax")) {
    hurtPlayer(game, has(game, "bloodEconomy") ? 1.2 : 2.8, true);
    explode(game, player.x, player.y, 76 + count(game, "bloodTax") * 16, 12 + count(game, "bloodTax") * 6, "#fb7185");
    if (has(game, "bloodEconomy")) {
      player.shield = Math.min(55, player.shield + 3 + player.souls);
      player.souls = Math.max(0, player.souls - 1);
    }
  }
};

const hurtEnemy = (game: Game, enemy: Enemy, amount: number, element: Bullet["element"], flash = true) => {
  enemy.hp -= amount;
  if (flash) enemy.hitFlash = 0.08;

  if (element === "fire") enemy.burn = Math.max(enemy.burn, 2.3);
  if (element === "ice") enemy.freeze = Math.max(enemy.freeze, 1.4);
  if (element === "blood") enemy.poison = Math.max(enemy.poison, 1.8);
  if (element === "lightning" && Math.random() < 0.18) chainLightning(game, enemy.x, enemy.y, 78, 4);

  if (has(game, "frostfire") && enemy.burn > 0 && enemy.freeze > 0) {
    enemy.burn = 0;
    enemy.freeze = 0;
    explode(game, enemy.x, enemy.y, has(game, "solarFrostbite") ? 92 : 58, has(game, "solarFrostbite") ? 24 : 14, "#38bdf8");
    if (has(game, "solarFrostbite")) {
      for (let i = 0; i < 5; i += 1) {
        const target = nearestEnemy(game, enemy.x, enemy.y);
        const angle = target ? Math.atan2(target.y - enemy.y, target.x - enemy.x) + rand(-0.4, 0.4) : rand(0, TAU);
        fireBullet(game, enemy.x, enemy.y, angle, 8, "ice", { pierce: 1, crit: 0.12 });
      }
    }
  }
};

const hurtPlayer = (game: Game, amount: number, selfInflicted = false) => {
  const player = game.player;
  if (!selfInflicted && player.invuln > 0) return;
  let damage = amount;
  if (player.shield > 0) {
    const blocked = Math.min(player.shield, damage);
    player.shield -= blocked;
    damage -= blocked;
  }
  player.hp -= damage;
};

const killEnemy = (game: Game, enemy: Enemy) => {
  game.kills += 1;
  game.gems.push({ x: enemy.x, y: enemy.y, value: enemy.maxHp > 50 ? 4 : 2, magnet: rand(0, 16) });
  burst(game, enemy.x, enemy.y, "#fb7185", 9);

  if (has(game, "vampire")) {
    const heal = has(game, "bloodEconomy") ? 3.2 : 1.6;
    const oldHp = game.player.hp;
    game.player.hp = Math.min(game.player.maxHp, game.player.hp + heal);
    const over = Math.max(0, oldHp + heal - game.player.maxHp);
    game.player.shield = Math.min(60, game.player.shield + over + (has(game, "bloodEconomy") ? 0.45 : 0));
  }

  if (has(game, "grave")) {
    game.player.souls += 1 + (has(game, "bloodEconomy") && Math.random() < 0.35 ? 1 : 0);
    if (game.player.souls >= 3) {
      game.player.souls -= 3;
      game.player.orbitals.push({ angle: rand(0, TAU), distance: rand(46, 78), damage: 10, life: 16, speed: rand(3, 5) });
      text(game, enemy.x, enemy.y - 20, "soul blade", "#c4b5fd");
    }
  }

  if (has(game, "parasite") && Math.random() < 0.32 + count(game, "parasite") * 0.08) {
    const target = nearestEnemy(game, enemy.x, enemy.y);
    const angle = target ? Math.atan2(target.y - enemy.y, target.x - enemy.x) : rand(0, TAU);
    fireBullet(game, enemy.x, enemy.y, angle, 12 + count(game, "parasite") * 3, "blood", { pierce: has(game, "solarFrostbite") ? 1 : 0 });
  }
};

const spawnEnemy = (game: Game, anywhere = false) => {
  const edge = Math.floor(rand(0, 4));
  const margin = 28;
  let x = rand(0, game.screen.w);
  let y = rand(82, game.screen.h);
  if (!anywhere) {
    if (edge === 0) x = -margin;
    if (edge === 1) x = game.screen.w + margin;
    if (edge === 2) y = 62;
    if (edge === 3) y = game.screen.h + margin;
  }

  const minutes = game.time / 60;
  const elite = Math.random() < Math.min(0.04 + minutes * 0.03, 0.22);
  const hp = elite ? 58 + minutes * 24 : 18 + minutes * 8;
  game.enemies.push({
    id: game.idCounter,
    x,
    y,
    r: elite ? 17 : rand(9, 13),
    hp,
    maxHp: hp,
    speed: elite ? rand(38, 58) : rand(54, 82) + minutes * 5,
    damage: elite ? 22 : 12,
    burn: 0,
    freeze: 0,
    poison: 0,
    hitFlash: 0
  });
  game.idCounter += 1;
};

const nearestEnemy = (game: Game, x: number, y: number) => {
  let best: Enemy | undefined;
  let bestD = Infinity;
  for (const enemy of game.enemies) {
    const d = (enemy.x - x) ** 2 + (enemy.y - y) ** 2;
    if (d < bestD) {
      best = enemy;
      bestD = d;
    }
  }
  return best;
};

const explode = (game: Game, x: number, y: number, radius: number, damage: number, color: string) => {
  for (const enemy of game.enemies) {
    const d = Math.hypot(enemy.x - x, enemy.y - y);
    if (d < radius) hurtEnemy(game, enemy, damage * (1 - d / radius) + damage * 0.35, color === "#72f5ff" ? "lightning" : "blood");
  }
  burst(game, x, y, color, 18, radius * 0.08);
};

const chainLightning = (game: Game, x: number, y: number, radius: number, damage: number) => {
  const targets = game.enemies
    .filter((enemy) => Math.hypot(enemy.x - x, enemy.y - y) < radius)
    .sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y))
    .slice(0, 4 + count(game, "static"));

  for (const enemy of targets) {
    hurtEnemy(game, enemy, damage, "lightning");
    game.particles.push({
      x: (x + enemy.x) / 2,
      y: (y + enemy.y) / 2,
      vx: rand(-8, 8),
      vy: rand(-8, 8),
      life: 0.16,
      color: "#72f5ff",
      size: 3
    });
  }
};

const pullEnemies = (game: Game, x: number, y: number, radius: number, strength: number) => {
  for (const enemy of game.enemies) {
    const dx = x - enemy.x;
    const dy = y - enemy.y;
    const d = Math.hypot(dx, dy);
    if (d < radius) {
      enemy.x += (dx / (d || 1)) * strength;
      enemy.y += (dy / (d || 1)) * strength;
    }
  }
};

const collectNearbyGems = (game: Game, x: number, y: number, radius: number) => {
  for (const gem of game.gems) {
    if (Math.hypot(gem.x - x, gem.y - y) < radius) {
      gem.x = game.player.x;
      gem.y = game.player.y;
    }
  }
};

const burst = (game: Game, x: number, y: number, color: string, amount: number, size = 3) => {
  for (let i = 0; i < amount; i += 1) {
    const angle = rand(0, TAU);
    const speed = rand(18, 130);
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: rand(0.18, 0.55),
      color,
      size: rand(size * 0.6, size * 1.4)
    });
  }
};

const text = (game: Game, x: number, y: number, value: string, color: string) => {
  game.particles.push({ x, y, vx: 0, vy: -22, life: 0.8, color, text: value, size: 13 });
};

const updateUi = (game: Game) => {
  const minutes = Math.floor(game.time / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(game.time % 60)
    .toString()
    .padStart(2, "0");
  game.ui = {
    time: `${minutes}:${seconds}`,
    level: String(game.level),
    kills: String(game.kills),
    hpPct: clamp((game.player.hp / game.player.maxHp) * 100, 0, 100),
    xpPct: clamp((game.xp / game.nextXp) * 100, 0, 100),
    gameOver: game.gameOver
  };
};

const shuffle = <T,>(values: T[]) => {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const bulletColor = (element: Bullet["element"]) => {
  if (element === "lightning") return "#72f5ff";
  if (element === "fire") return "#fb923c";
  if (element === "ice") return "#93c5fd";
  if (element === "blood") return "#fb7185";
  if (element === "void") return "#c084fc";
  return "#f8fafc";
};

const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
  ctx.strokeStyle = "rgba(148, 163, 184, 0.06)";
  ctx.lineWidth = 1;
  const gap = 36;
  const offset = (time * 10) % gap;
  for (let x = -gap; x < w + gap; x += gap) {
    ctx.beginPath();
    ctx.moveTo(x + offset, 64);
    ctx.lineTo(x + offset, h);
    ctx.stroke();
  }
  for (let y = 64 - gap; y < h + gap; y += gap) {
    ctx.beginPath();
    ctx.moveTo(0, y + offset);
    ctx.lineTo(w, y + offset);
    ctx.stroke();
  }
};

const diamond = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.lineTo(x + r, y);
  ctx.lineTo(x, y + r);
  ctx.lineTo(x - r, y);
  ctx.closePath();
  ctx.fill();
};
