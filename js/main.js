(() => {
  'use strict';

  /* =========================================================
     01. DOM REFERENCES
     ========================================================= */
  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  /* =========================================================
     02. MOBILE NAVIGATION
     ========================================================= */
  const closeMenu = () => {
    nav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    const open = nav?.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(Boolean(open)));
    document.body.classList.toggle('menu-open', Boolean(open));
  });

  nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});


/* CLOSE MENU WHEN CLICKING OUTSIDE */
document.addEventListener('click', (event) => {

  if (!nav?.classList.contains('is-open')) return;

  const clickedInsideNav = nav.contains(event.target);
  const clickedToggle = menuToggle?.contains(event.target);

  if (!clickedInsideNav && !clickedToggle) {
    closeMenu();
  }

});

  /* =========================================================
     03. HEADER SCROLL STATE
     ========================================================= */
  if (header?.dataset.enableScrollHeader === 'true') {
    const threshold = Number(header.dataset.scrollThreshold || 12);
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > threshold);
    }, { passive: true });
  }

  /* =========================================================
     04. HERO SLIDER
     ========================================================= */
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dots = [...document.querySelectorAll('.hero-dots button')];
  const prev = document.querySelector('.hero-arrow.prev');
  const next = document.querySelector('.hero-arrow.next');
  const hero = document.querySelector('.hero');
  let current = 0;
  let timer = null;
  const interval = 6500;

  const showSlide = (index) => {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  };

  const restartSlider = () => {
    clearInterval(timer);
    if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = setInterval(() => showSlide(current + 1), interval);
    }
  };

  prev?.addEventListener('click', () => { showSlide(current - 1); restartSlider(); });
  next?.addEventListener('click', () => { showSlide(current + 1); restartSlider(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); restartSlider(); }));

  document.addEventListener('keydown', event => {
    if (!hero || !document.activeElement || !hero.contains(document.activeElement)) return;
    if (event.key === 'ArrowLeft') { showSlide(current - 1); restartSlider(); }
    if (event.key === 'ArrowRight') { showSlide(current + 1); restartSlider(); }
  });

  let touchStartX = 0;
  hero?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  hero?.addEventListener('touchend', e => {
    const distance = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) < 50) return;
    showSlide(current + (distance < 0 ? 1 : -1));
    restartSlider();
  }, { passive: true });

  showSlide(0);
  restartSlider();

  /* =========================================================
     05. FAQ
     ========================================================= */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        const icon = other.querySelector('.faq-question b');
        if (icon) icon.textContent = '+';
      });
      if (!isOpen) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        const icon = question.querySelector('b');
        if (icon) icon.textContent = '−';
      }
    });
  });

  /* =========================================================
     06. SCROLL REVEAL
     ========================================================= */
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('visible'));
  }

  /* =========================================================
     07. STATS
     ========================================================= */
  const counters = document.querySelectorAll('.stat strong[data-target]');
  const format = n => n.toLocaleString('en-IN');
  const animateCounter = el => {
    const target = Number(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format(Math.floor(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const stats = document.querySelector('.stats');
  if (stats && counters.length) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      counters.forEach(el => { el.textContent = format(Number(el.dataset.target)) + (el.dataset.suffix || ''); });
    } else if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          counters.forEach(animateCounter);
          observer.disconnect();
        }
      }, { threshold: 0.4 });
      observer.observe(stats);
    }
  }

  /* =========================================================
     08. FOOTER YEAR
     ========================================================= */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

/* =========================================================
   PREMIUM FEATURE CARD CURSOR EFFECT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".feature");

    cards.forEach((card) => {

        card.addEventListener("mousemove", (event) => {

            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const mx = (x / rect.width) * 100;
            const my = (y / rect.height) * 100;

            card.style.setProperty("--mx", `${mx}%`);
            card.style.setProperty("--my", `${my}%`);

        });

        card.addEventListener("mouseleave", () => {

            card.style.removeProperty("--mx");
            card.style.removeProperty("--my");

        });

    });

});
