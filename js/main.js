/* ═══════════════════════════════════════════════════════
   AYOUB SEGHIR PORTFOLIO — main.js
   Particules, Typed text, Scroll reveal, Nav active
════════════════════════════════════════════════════════ */

'use strict';

/* ─── 1. PARTICULES CANVAS ──────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -9999, y: -9999 };
  const COUNT = 70;
  const COLOR = '180, 180, 185';
  const CONN_DIST = 120;
  const MOUSE_DIST = 140;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      // subtle repulsion from mouse
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_DIST) {
        const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.02;
        this.vx += dx * force;
        this.vy += dy * force;
      }
      // dampen
      this.vx *= 0.98; this.vy *= 0.98;
      this.x += this.vx; this.y += this.vy;
      // wrap edges
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${COLOR},${this.alpha})`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONN_DIST) {
          const alpha = (1 - d / CONN_DIST) * 0.15;
          ctx.strokeStyle = `rgba(${COLOR},${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); });
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  resize();
  createParticles();
  animate();
})();


/* ─── 2. TYPED TEXT ANIMATION ───────────────────────── */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrasesByLang = {
    fr: [
      'Étudiant BUT Informatique',
      'Data Analyst / Data Engineer',
      'Développeur Web & Data',
      'Entrepreneur · SAHYGO',
      'Disponible · Stage Avril 2026',
    ],
    en: [
      'BUT Computer Science Student',
      'Data Analyst / Data Engineer',
      'Web & Data Developer',
      'Entrepreneur · SAHYGO',
      'Available · Internship April 2026',
    ],
  };

  let pIdx = 0, cIdx = 0, isDeleting = false, timer = null;
  const TYPE_SPEED = 55;
  const DELETE_SPEED = 28;
  const PAUSE_END = 2000;
  const PAUSE_START = 400;

  function getLang() {
    return document.documentElement.getAttribute('lang') || 'fr';
  }

  function type() {
    const phrases = phrasesByLang[getLang()] || phrasesByLang.fr;
    const current = phrases[pIdx % phrases.length];
    if (!isDeleting) {
      el.textContent = current.slice(0, cIdx + 1);
      cIdx++;
      if (cIdx === current.length) {
        isDeleting = true;
        timer = setTimeout(type, PAUSE_END);
        return;
      }
    } else {
      el.textContent = current.slice(0, cIdx - 1);
      cIdx--;
      if (cIdx === 0) {
        isDeleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        timer = setTimeout(type, PAUSE_START);
        return;
      }
    }
    timer = setTimeout(type, isDeleting ? DELETE_SPEED : TYPE_SPEED);
  }

  // Expose so applyLang can reset on language switch
  window._typedReset = function () {
    clearTimeout(timer);
    cIdx = 0; isDeleting = false; pIdx = 0;
    el.textContent = '';
    timer = setTimeout(type, 400);
  };

  setTimeout(type, 800);
})();


/* ─── 3. SCROLL REVEAL ──────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling reveals
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const delay = siblings.indexOf(entry.target) * 60;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
})();


/* ─── 4. NAVBAR ─────────────────────────────────────── */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    updateActive();
  }, { passive: true });

  // Mobile menu
  btn?.addEventListener('click', () => {
    menu?.classList.toggle('open');
  });
  document.querySelectorAll('.nav-mobile-link').forEach(l => {
    l.addEventListener('click', () => menu?.classList.remove('open'));
  });

  // Active section highlight
  function updateActive() {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  }

  // ── THEME TOGGLE ──────────────────────────────────────
  const themeBtn = document.getElementById('themeToggle');
  const html = document.documentElement;
  // Restore saved preference
  const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  themeBtn?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
  });


  // ── LANGUAGE DROPDOWN ─────────────────────────────────
  const langDropdown = document.getElementById('langDropdown');
  const langTrigger = document.getElementById('langTrigger');
  const langOptions = document.querySelectorAll('.lang-option');

  // Simple approach: swap text for elements with data-fr / data-en
  function applyLang(lang) {
    html.setAttribute('lang', lang);
    localStorage.setItem('portfolio-lang', lang);
    document.querySelectorAll('[data-fr]').forEach(el => {
      el.textContent = lang === 'fr' ? el.dataset.fr : el.dataset.en;
    });
    langOptions.forEach(opt => {
      opt.classList.toggle('lang-option-active', opt.dataset.lang === lang);
    });
    // Update trigger flag
    const flagFr = document.getElementById('flag-fr');
    const flagEn = document.getElementById('flag-en');
    if (flagFr && flagEn) {
      flagFr.style.display = lang === 'fr' ? 'inline' : 'none';
      flagEn.style.display = lang === 'en' ? 'inline' : 'none';
    }
    // Reset typed animation with new language phrases
    if (typeof window._typedReset === 'function') window._typedReset();
  }

  const savedLang = localStorage.getItem('portfolio-lang') || 'fr';
  applyLang(savedLang);

  langTrigger?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = langDropdown.classList.toggle('open');
    langTrigger.setAttribute('aria-expanded', String(isOpen));
  });

  langOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      applyLang(opt.dataset.lang);
      langDropdown.classList.remove('open');
      langTrigger.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!langDropdown?.contains(e.target)) {
      langDropdown?.classList.remove('open');
      langTrigger?.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ─── 5. SMOOTH SCROLL ──────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Close mobile menu if open
    document.getElementById('mobileMenu')?.classList.remove('open');
  });
});
