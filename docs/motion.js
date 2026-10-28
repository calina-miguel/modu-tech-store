(() => {
  document.getElementById('year').textContent = new Date().getFullYear();
  const menu = document.querySelector('.menu-toggle');
  const mobile = document.querySelector('.mobile-nav');
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    menu.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    mobile.hidden = open;
  });
  mobile.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      mobile.hidden = true;
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open menu');
    }
  });
  const desktopExplore = document.querySelector('.nav-dropdown');
  document.addEventListener('click', (event) => {
    if (!desktopExplore.contains(event.target)) desktopExplore.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const wasMobileOpen = !mobile.hidden;
      desktopExplore.open = false;
      document.querySelector('.mobile-explore').open = false;
      mobile.hidden = true;
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open menu');
      if (wasMobileOpen) menu.focus();
    }
  });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const nodes = document.querySelectorAll('.reveal');
  if (reduced.matches || !('IntersectionObserver' in window)) nodes.forEach(node => node.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    nodes.forEach(node => observer.observe(node));
  }
  // Leave wheel, trackpad, touch, and keyboard scrolling to the browser.
})();
