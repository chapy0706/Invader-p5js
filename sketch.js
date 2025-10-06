'use strict';

// --- ゲーム設定 ---
const CFG = {
  w: 640, h: 480,
  player: { w: 42, h: 14, speed: 5.2 },
  bullet: { w: 4, h: 10, speed: 7.0, cooldown: 200 }, // ms
  enemy: { rows: 4, cols: 9, w: 30, h: 18, xGap: 50, yGap: 40, speed: 1.0, drop: 14 },
  colors: {
    player: [100, 220, 255],
    bullet: [255, 240, 120],
    enemy:  [120, 255, 160],
    text:   [240, 250, 255],
  }
};

// --- 状態 ---
let player;
let bullets = [];
let enemies = [];
let enemyDir = 1;      // 1:右, -1:左
let gameState = 'play'; // 'play' | 'win' | 'over'
let lastShotAt = 0;

// --- p5 lifecycle ---
function setup() {
  const cnv = createCanvas(CFG.w, CFG.h);
  const parent = document.querySelector('#canvas-container');
  if (parent) cnv.parent(parent);
  rectMode(CENTER);
  noStroke();
  initGame();
}

function initGame() {
  player = { x: width/2, y: height - 28, w: CFG.player.w, h: CFG.player.h };
  bullets = [];
  enemies = [];
  enemyDir = 1;
  gameState = 'play';

  const startX = 60, startY = 60;
  for (let r = 0; r < CFG.enemy.rows; r++) {
    for (let c = 0; c < CFG.enemy.cols; c++) {
      enemies.push({
        x: startX + c * CFG.enemy.xGap,
        y: startY + r * CFG.enemy.yGap,
        w: CFG.enemy.w, h: CFG.enemy.h,
        alive: true
      });
    }
  }
}

function draw() {
  background(16, 18, 24);

  if (gameState !== 'play') {
    drawAll();
    drawMessage(gameState === 'win' ? 'YOU WIN!' : 'GAME OVER');
    return;
  }

  // 入力
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65))  player.x -= CFG.player.speed; // A
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) player.x += CFG.player.speed; // D
  player.x = constrain(player.x, player.w/2, width - player.w/2);

  // 敵の移動（端で折返し＋段下げ）
  let hitEdge = false;
  let aliveCount = 0;
  for (const e of enemies) {
    if (!e.alive) continue;
    aliveCount++;
    e.x += enemyDir * CFG.enemy.speed;
    if (e.x < 20 || e.x > width - 20) hitEdge = true;
  }
  if (hitEdge) {
    enemyDir *= -1;
    for (const e of enemies) if (e.alive) e.y += CFG.enemy.drop;
  }

  // 弾の移動＆当たり判定
  for (const b of bullets) {
    b.y -= CFG.bullet.speed;
    for (const e of enemies) {
      if (!e.alive) continue;
      if (collide(b, e)) { e.alive = false; b.dead = true; break; }
    }
  }
  bullets = bullets.filter(b => !b.dead && b.y > -10);

  // クリア / ゲームオーバー
  if (aliveCount === 0) gameState = 'win';
  for (const e of enemies) {
    if (e.alive && e.y >= player.y - 20) { gameState = 'over'; break; }
  }

  drawAll();
}

function keyPressed() {
  if (key === ' ') {
    const now = millis();
    if (now - lastShotAt >= CFG.bullet.cooldown && gameState === 'play') {
      bullets.push({ x: player.x, y: player.y - 20, w: CFG.bullet.w, h: CFG.bullet.h });
      lastShotAt = now;
    }
  }
  if (key === 'r' || key === 'R') initGame();
}

// --- 描画/ユーティリティ ---
function drawAll() {
  // プレイヤー
  fill(...CFG.colors.player);
  rect(player.x, player.y, player.w, player.h, 3);

  // 弾
  fill(...CFG.colors.bullet);
  for (const b of bullets) rect(b.x, b.y, CFG.bullet.w, CFG.bullet.h, 2);

  // 敵
  fill(...CFG.colors.enemy);
  for (const e of enemies) if (e.alive) rect(e.x, e.y, e.w, e.h, 4);
}

function drawMessage(msg) {
  push();
  textAlign(CENTER, CENTER);
  textSize(40);
  fill(...CFG.colors.text);
  text(msg, width/2, height/2 - 12);
  textSize(16);
  text('Press R to restart', width/2, height/2 + 20);
  pop();
}

// AABBの矩形当たり判定（中心基準）
function collide(a, b) {
  return Math.abs(a.x - b.x) < (a.w/2 + b.w/2) &&
         Math.abs(a.y - b.y) < (a.h/2 + b.h/2);
}
