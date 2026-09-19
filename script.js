// ---------- Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Navbar scroll state + scroll progress ----------
const navbar = document.getElementById('navbar');
const scrollProgress = document.getElementById('scrollProgress');
function updateScrollUI() {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0;
  scrollProgress.style.width = pct + '%';
}
window.addEventListener('scroll', updateScrollUI, { passive: true });
updateScrollUI();

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---------- Active nav link on scroll ----------
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => navObserver.observe(s));

// ---------- Scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// ---------- Animated counters ----------
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1600;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const value = Math.round(target * eased);
    el.textContent = prefix + value.toLocaleString('es-PE') + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const counterEls = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

// ---------- Skill bars ----------
const skillFills = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.dataset.level + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
skillFills.forEach(el => skillObserver.observe(el));

// ---------- Card spotlight (mouse-follow glow) ----------
document.querySelectorAll('.exp-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
    card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
  });
});

// ---------- Hero signal canvas (vibration waveform) ----------
const canvas = document.getElementById('signalCanvas');
const ctx = canvas.getContext('2d');
let w, h, dpr;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = canvas.clientWidth;
  h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let t = 0;

function drawWave(baseY, amp, freq1, freq2, color, lineWidth) {
  ctx.beginPath();
  for (let x = 0; x <= w; x += 4) {
    const y = baseY
      + Math.sin(x * freq1 + t) * amp
      + Math.sin(x * freq2 + t * 1.7) * (amp * 0.35);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function frame() {
  ctx.clearRect(0, 0, w, h);

  drawWave(h * 0.32, 26, 0.012, 0.031, 'rgba(99,102,241,0.35)', 1.4);
  drawWave(h * 0.55, 34, 0.009, 0.021, 'rgba(52,211,153,0.55)', 1.8);
  drawWave(h * 0.78, 18, 0.016, 0.04, 'rgba(236,72,153,0.28)', 1.2);

  t += reduceMotion ? 0 : 0.028;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
