(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const reveal = () => {
    const nodes = document.querySelectorAll('[data-modu-reveal]');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
  };
  document.addEventListener('DOMContentLoaded', reveal);
  document.addEventListener('shopify:section:load', reveal);

  if (reducedMotion.matches || window.Shopify?.designMode) return;
  let position = window.scrollY;
  let target = position;
  let previousTime = 0;
  let frame = 0;
  let programmatic = false;
  const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - innerHeight);
  const clamp = (value) => Math.min(maxScroll(), Math.max(0, value));
  const animate = (time) => {
    const elapsed = Math.min(time - (previousTime || time), 64);
    previousTime = time;
    const easing = 1 - Math.exp(-elapsed / 125);
    position += (target - position) * easing;
    if (Math.abs(target - position) < 0.5) position = target;
    programmatic = true;
    scrollTo(0, position);
    programmatic = false;
    if (position !== target) frame = requestAnimationFrame(animate);
    else { frame = 0; previousTime = 0; }
  };
  const scrollableAncestor = (element, delta) => {
    for (let node = element; node && node !== document.body; node = node.parentElement) {
      if (!(node instanceof HTMLElement)) continue;
      const style = getComputedStyle(node);
      if (!/(auto|scroll)/.test(style.overflowY)) continue;
      if (node.scrollHeight <= node.clientHeight + 2) continue;
      if ((delta > 0 && node.scrollTop < node.scrollHeight - node.clientHeight - 1) || (delta < 0 && node.scrollTop > 1)) return true;
    }
    return false;
  };
  addEventListener('wheel', (event) => {
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || reducedMotion.matches) return;
    if (document.querySelector('dialog[open], .menu-drawer[open], .cart-drawer.active, .modal--open')) return;
    if (event.target.closest('input, textarea, select, [contenteditable], iframe')) return;
    const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * innerHeight : event.deltaY;
    if (Math.abs(delta) < 40 || Math.abs(delta) > 600 || scrollableAncestor(event.target, delta)) return;
    event.preventDefault();
    if (!frame) position = window.scrollY;
    target = clamp((frame ? target : position) + delta);
    if (!frame) frame = requestAnimationFrame(animate);
  }, { passive: false });
  addEventListener('scroll', () => {
    if (!programmatic && !frame) position = target = window.scrollY;
  }, { passive: true });
  addEventListener('keydown', () => { if (frame) { cancelAnimationFrame(frame); frame = 0; previousTime = 0; position = target = window.scrollY; } });
  addEventListener('resize', () => { target = clamp(target); });
})();
