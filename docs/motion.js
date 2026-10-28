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
  let target = scrollY;
  let previousTime = 0;
  let frame = 0;
  const clamp = value => Math.min(Math.max(0, document.documentElement.scrollHeight - innerHeight), Math.max(0, value));
  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    target = scrollY;
  };
  const animate = time => {
    const elapsed = Math.min(time - (previousTime || time - 16), 50);
    previousTime = time;
    const position = scrollY;
    const easing = 1 - Math.exp(-elapsed / 125);
    const next = position + (target - position) * easing;
    if (Math.abs(target - position) < 0.75 || Math.abs(next - position) < 1) {
      scrollTo(0, target);
      frame = 0;
      previousTime = 0;
      return;
    }
    scrollTo(0, next);
    frame = requestAnimationFrame(animate);
  };
  const hasScrollableParent = (element, delta) => {
    for (let node = element; node && node !== document.body; node = node.parentElement) {
      if (!(node instanceof HTMLElement)) continue;
      const style = getComputedStyle(node);
      if (!/(auto|scroll)/.test(style.overflowY) || node.scrollHeight <= node.clientHeight + 2) continue;
      if ((delta > 0 && node.scrollTop < node.scrollHeight - node.clientHeight - 1) || (delta < 0 && node.scrollTop > 1)) return true;
    }
    return false;
  };
  addEventListener('wheel', event => {
    const element = event.target instanceof Element ? event.target : null;
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || !element || reduced.matches) return;
    if (element.closest('input, textarea, select, [contenteditable], iframe')) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * innerHeight : event.deltaY;
    if (hasScrollableParent(element, delta)) { stop(); return; }
    // Fine trackpad gestures stay native. Discrete wheel steps use the easing loop.
    if (event.deltaMode === 0 && (Math.abs(delta) < 80 || Math.abs(delta) > 500)) { stop(); return; }
    if (!delta) return;
    const nextTarget = clamp((frame ? target : scrollY) + Math.max(-260, Math.min(260, delta)));
    if (nextTarget === scrollY && !frame) return;
    event.preventDefault();
    target = nextTarget;
    if (!frame) frame = requestAnimationFrame(animate);
  }, { passive: false });
  addEventListener('keydown', stop, { passive: true });
  addEventListener('touchstart', stop, { passive: true });
  addEventListener('pointerdown', stop, { passive: true });
  addEventListener('hashchange', stop, { passive: true });
  addEventListener('resize', () => { target = clamp(target); }, { passive: true });
})();
