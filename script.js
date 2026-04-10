/* ============================================================
   script.js  —  Сайт поздравления для мамы 💕
   ============================================================ */

// ── 1. ПАДАЮЩИЕ ЛЕПЕСТКИ ──────────────────────────────────
(function initPetals() {
  const canvas = document.getElementById('petals-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H;
  const PETAL_COUNT = 38;
  const petals = [];

  const COLORS = [
    'rgba(255,182,213,0.75)',
    'rgba(255,150,190,0.65)',
    'rgba(255,210,230,0.70)',
    'rgba(255,110,180,0.55)',
    'rgba(255,240,248,0.80)',
    'rgba(255,100,170,0.50)',
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function randomPetal(fromTop) {
    return {
      x:      Math.random() * W,
      y:      fromTop ? -20 : Math.random() * H,
      r:      5 + Math.random() * 9,
      color:  COLORS[Math.floor(Math.random() * COLORS.length)],
      speedY: 0.6 + Math.random() * 1.2,
      speedX: (Math.random() - 0.5) * 0.6,
      angle:  Math.random() * Math.PI * 2,
      spin:   (Math.random() - 0.5) * 0.04,
      swing:  Math.random() * Math.PI * 2,
      swingSpeed: 0.012 + Math.random() * 0.018,
      swingAmp:   18 + Math.random() * 30,
    };
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    petals.push(randomPetal(false));
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.beginPath();
    ctx.ellipse(0, 0, p.r * 0.55, p.r, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowColor = 'rgba(255,100,180,0.3)';
    ctx.shadowBlur  = 6;
    ctx.fill();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    petals.forEach(p => {
      p.swing += p.swingSpeed;
      p.x     += p.speedX + Math.sin(p.swing) * 0.5;
      p.y     += p.speedY;
      p.angle += p.spin;

      if (p.y > H + 30) {
        Object.assign(p, randomPetal(true));
      }
      drawPetal(p);
    });
    requestAnimationFrame(tick);
  }
  tick();
})();


// ── 2. ТАЙМЕР / СЧЁТЧИК (дней с её дня рождения) ──────────
(function initCounter() {
  const birthdayEl = document.getElementById('birthday-counter');
  if (!birthdayEl) return;

  // Дата рождения мамы — пример: 15 марта 1965
  const BIRTHDAY = new Date(1965, 2, 15); // месяц 0-indexed

  function getDaysSince(date) {
    const now  = new Date();
    const diff = now - date;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  function formatNumber(n) {
    return n.toLocaleString('ru-RU');
  }

  function update() {
    const days   = getDaysSince(BIRTHDAY);
    const hours  = new Date().getHours();
    const mins   = new Date().getMinutes();
    const secs   = new Date().getSeconds();
    const totalSecs = days * 86400 + hours * 3600 + mins * 60 + secs;

    birthdayEl.innerHTML = `
      <div class="counter-row">
        <div class="counter-item">
          <span class="counter-num">${formatNumber(days)}</span>
          <span class="counter-label">дней</span>
        </div>
        <div class="counter-item">
          <span class="counter-num">${String(hours).padStart(2,'0')}</span>
          <span class="counter-label">часов</span>
        </div>
        <div class="counter-item">
          <span class="counter-num">${String(mins).padStart(2,'0')}</span>
          <span class="counter-label">минут</span>
        </div>
        <div class="counter-item">
          <span class="counter-num">${String(secs).padStart(2,'0')}</span>
          <span class="counter-label">секунд</span>
        </div>
      </div>
      <p class="counter-caption">ты согреваешь нашу жизнь 💖</p>
    `;
  }

  update();
  setInterval(update, 1000);
})();


// ── 3. СЮРПРИЗ (popup) ────────────────────────────────────
(function initSurprise() {
  const btn     = document.getElementById('surprise-btn');
  const overlay = document.getElementById('popup-overlay');
  const closeBtn= document.getElementById('popup-close');
  if (!btn || !overlay) return;

  const messages = [
    { emoji: '🌹', text: 'Ты — самый красивый цветок в нашем саду жизни. Расцветай!' },
    { emoji: '🎀', text: 'Твоя доброта и любовь — бесценный подарок для всей нашей семьи!' },
    { emoji: '✨', text: 'Ты наш главный источник тепла, света и вдохновения. Любим тебя!' },
    { emoji: '🍰', text: 'Пусть каждый день будет таким же сладким, как торт с клубникой!' },
    { emoji: '🦋', text: 'С тобой рядом всё превращается в чудо. Спасибо, что ты есть!' },
  ];

  let idx = 0;

  function showPopup() {
    const m = messages[idx % messages.length];
    idx++;
    overlay.querySelector('.pop-emoji').textContent  = m.emoji;
    overlay.querySelector('.pop-text').textContent   = m.text;
    overlay.classList.add('active');
  }

  function hidePopup() {
    overlay.classList.remove('active');
  }

  btn.addEventListener('click', showPopup);
  closeBtn.addEventListener('click', hidePopup);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) hidePopup();
  });
})();


// ── 4. HOVER-СЕРДЕЧКИ ─────────────────────────────────────
(function initHoverHearts() {
  const bursts = ['💖', '💕', '🌸', '💗', '✨', '🌷', '💓'];

  document.addEventListener('click', function(e) {
    const el = document.createElement('span');
    el.textContent = bursts[Math.floor(Math.random() * bursts.length)];
    el.style.cssText = `
      position: fixed;
      left: ${e.clientX - 16}px;
      top:  ${e.clientY - 16}px;
      font-size: 1.6rem;
      pointer-events: none;
      z-index: 9999;
      animation: clickFloat 0.9s ease forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  });

  // keyframe injection
  if (!document.getElementById('click-float-style')) {
    const s = document.createElement('style');
    s.id = 'click-float-style';
    s.textContent = `
      @keyframes clickFloat {
        0%   { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-70px) scale(1.5); }
      }
    `;
    document.head.appendChild(s);
  }
})();


// ── 5. ПЛАВНОЕ ПОЯВЛЕНИЕ СЕКЦИЙ ───────────────────────────
(function initReveal() {
  const targets = document.querySelectorAll('.card, .wish-item, .quote-card, .photo-frame');

  if (!('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(40px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    obs.observe(el);
  });
})();
