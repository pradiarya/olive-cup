const menuTabs = [...document.querySelectorAll('[role="tab"]')];
const menuPanels = [...document.querySelectorAll('[role="tabpanel"]')];

// Keep the selected tab, focus target, and visible panel synchronized.
function activateTab(tab, moveFocus = false) {
  menuTabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });

  menuPanels.forEach((panel) => {
    panel.hidden = panel.id !== tab.getAttribute('aria-controls');
  });

  if (moveFocus) tab.focus();
}

menuTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % menuTabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + menuTabs.length) % menuTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = menuTabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    activateTab(menuTabs[nextIndex], true);
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavLinks = [...mobileNav.querySelectorAll('a')];

function setMobileMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileNav.setAttribute('aria-hidden', String(!open));
  mobileNav.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
}

menuToggle.addEventListener('click', () => {
  setMobileMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

mobileNavLinks.forEach((link) => {
  link.addEventListener('click', () => setMobileMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMobileMenu(false);
    menuToggle.focus();
  }
});

const revealTargets = document.querySelectorAll(
  '.hero-copy, .highlights, .section-heading, .menu-panel, .about-copy, .about-photo, .gallery-photo, .visit-grid',
);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduceMotion) {
  // Reveal each section once as it enters the viewport.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((target) => {
    target.classList.add('fade-in');
    revealObserver.observe(target);
  });
}
