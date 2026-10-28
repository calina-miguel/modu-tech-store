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
})();

(() => {
  const easeTime = 125;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const parallaxItems = document.querySelectorAll('.parallax');
  let position = window.scrollY;
  let target = position;
  let previousTime = 0;
  let frame = 0;

  function updateParallax() {
    if (reducedMotion.matches) return;
    for (const item of parallaxItems) {
      const speed = Number(item.dataset.speed || 0.18);
      const section = item.closest('section') || item;
      const distance = -section.getBoundingClientRect().top;
      item.style.transform = `translate3d(0, ${distance * speed}px, 0)`;
    }
  }

  function animate(time) {
    const elapsed = Math.min(time - (previousTime || time), 64);
    previousTime = time;
    const easing = 1 - Math.exp(-elapsed / easeTime);
    position += (target - position) * easing;
    if (Math.abs(target - position) < 0.5) position = target;
    window.scrollTo(0, position);
    updateParallax();
    if (position !== target) frame = requestAnimationFrame(animate);
    else { frame = 0; previousTime = 0; }
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    position = target = window.scrollY;
  }

  window.addEventListener('wheel', event => {
    const element = event.target instanceof Element ? event.target : null;
    if (reducedMotion.matches || event.defaultPrevented || event.ctrlKey || event.metaKey || !element) return;
    if (element.closest('input, textarea, select, [data-native-scroll]')) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    event.preventDefault();
    const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    target = Math.max(0, Math.min(maxScroll, target + event.deltaY * multiplier));
    if (!frame) {
      position = window.scrollY;
      frame = requestAnimationFrame(animate);
    }
  }, { passive: false });

  window.addEventListener('scroll', () => {
    if (!frame) {
      position = window.scrollY;
      target = position;
      updateParallax();
    }
  }, { passive: true });
  window.addEventListener('resize', updateParallax, { passive: true });
  window.addEventListener('pointerdown', stop, { passive: true });
  window.addEventListener('touchstart', stop, { passive: true });
  window.addEventListener('keydown', stop, { passive: true });
  reducedMotion.addEventListener('change', () => {
    stop();
    if (reducedMotion.matches) parallaxItems.forEach(item => item.style.removeProperty('transform'));
    else updateParallax();
  });

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
  } else {
    document.querySelectorAll('.reveal').forEach(item => item.classList.add('is-visible'));
  }
  updateParallax();
})();
