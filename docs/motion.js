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
  if (reduced.matches) return;
  let position = scrollY, target = scrollY, previousTime = 0, frame = 0, programmatic = false;
  const clamp = value => Math.min(Math.max(0, document.documentElement.scrollHeight - innerHeight), Math.max(0, value));
  const animate = time => {
    const elapsed = Math.min(time - (previousTime || time), 64);
    previousTime = time;
    const easing = 1 - Math.exp(-elapsed / 125);
    position += (target - position) * easing;
    if (Math.abs(target - position) < .5) position = target;
    programmatic = true;
    scrollTo(0, position);
    programmatic = false;
    if (position !== target) frame = requestAnimationFrame(animate);
    else { frame = 0; previousTime = 0; }
  };
  addEventListener('wheel', event => {
    if (event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select, [contenteditable]')) return;
    const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * innerHeight : event.deltaY;
    if (Math.abs(delta) < 40 || Math.abs(delta) > 600) return;
    event.preventDefault();
    if (!frame) position = scrollY;
    target = clamp((frame ? target : position) + delta);
    if (!frame) frame = requestAnimationFrame(animate);
  }, { passive: false });
  addEventListener('scroll', () => { if (!programmatic && !frame) position = target = scrollY; }, { passive: true });
  addEventListener('keydown', () => { if (frame) { cancelAnimationFrame(frame); frame = 0; previousTime = 0; position = target = scrollY; } });
})();
