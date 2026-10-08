const nav = document.querySelector('#site-nav');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('nav a');
const sections = [...document.querySelectorAll('main section[id]')];

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = document.querySelector('.navbar').classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    document.querySelector('.navbar').classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Buka menu');
  }));
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => observer.observe(section));

// Concept dashboard tabs
const dashTabs = document.querySelectorAll('.dash-tab');
const conceptStage = document.querySelector('.concept-stage');
dashTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.dashboard;
    dashTabs.forEach(item => {
      const active = item === tab;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
    });
    if (conceptStage) {
      conceptStage.dataset.conceptView = target;
      conceptStage.classList.toggle('umkm-focus', target === 'umkm');
    }
  });
});

// Micro-interactions: lightweight ripple on pointer/tap without relying on hover.
document.querySelectorAll('.btn,.nav-cta,.device-button,.round-arrow,.dash-tab').forEach((el) => {
  el.addEventListener('pointerdown', (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });
});


// V15 motion: reveal sections and staggered content when they enter the viewport.
const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionOK && 'IntersectionObserver' in window) {
  const revealItems = document.querySelectorAll('main section, .problem-grid, .workflow-track, .business-flow, .revenue-panel, .business-proof, .about-panel, .dashboard-showcase');
  revealItems.forEach((el) => {
    if (el.closest('.concept-stage') && el.classList.contains('concept-stage')) return;
    el.classList.add('reveal');
  });

  document.querySelectorAll('.problem-grid, .workflow-track, .business-flow, .revenue-list, .business-proof, .vision-row').forEach(el => el.classList.add('reveal-stagger'));

  const motionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => motionObserver.observe(el));
} else {
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => el.classList.add('is-visible'));
}
