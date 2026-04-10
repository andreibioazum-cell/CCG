// ===== FALLING PETALS =====
const canvas = document.getElementById('petals-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resizeCanvas, 250);
});

const COLORS = ['#ffb3c6', '#ff85a1', '#ffc2d4', '#ffccd5', '#ff99bb'];
const PETAL_COUNT = 15;
const petals = [];

function rnd(a, b) {
  return a + Math.random() * (b - a);
}

function makePetal(fromTop) {
  return {
    x: rnd(0, canvas.width),
    y: fromTop ? rnd(-60, -5) : rnd(0, canvas.height),
    size: rnd(6, 13),
    vy: rnd(0.5, 1.1),
    vx: rnd(-0.25, 0.25),
    rot: rnd(0, Math.PI * 2),
    rotV: rnd(-0.012, 0.012),
    alpha: rnd(0.3, 0.65),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    sway: rnd(0.2, 0.6),
    swayOff: rnd(0, Math.PI * 2),
  };
}

for (let i = 0; i < PETAL_COUNT; i++) {
  petals.push(makePetal(false));
}

let frame = 0;
let animId = null;
let active = true;

function draw() {
  if (!active) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frame++;

  const sw = Math.sin(frame * 0.007);

  for (let i = 0; i < petals.length; i++) {
    const p = petals[i];
    p.y += p.vy;
    p.x += p.vx + sw * p.sway;
    p.rot += p.rotV;

    if (p.y > canvas.height + 20) {
      petals[i] = makePetal(true);
      continue;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size / 2.5, p.size, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  animId = requestAnimationFrame(draw);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    active = false;
    if (animId) cancelAnimationFrame(animId);
  } else {
    active = true;
    draw();
  }
});

draw();

// ===== HEARTS ON CLICK (throttled) =====
const EMOJIS = ['💖', '🌸', '💕', '🌹', '💗', '🎀'];
let lastClick = 0;

document.addEventListener('click', (e) => {
  const now = Date.now();
  if (now - lastClick < 350) return;
  lastClick = now;
  spawnHeart(e.clientX, e.clientY);
});

function spawnHeart(x, y) {
  const el = document.createElement('div');
  el.className = 'floating-heart';
  el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
  el.style.left = (x - 16) + 'px';
  el.style.top  = (y - 16) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}
