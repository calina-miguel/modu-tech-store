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
  const scrollableAncestor = (element, delta) => {
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
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || !element || reducedMotion.matches) return;
    if (document.querySelector('dialog[open], .menu-drawer[open], .cart-drawer.active, .modal--open')) { stop(); return; }
    if (element.closest('input, textarea, select, [contenteditable], iframe')) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaMode === 2 ? event.deltaY * innerHeight : event.deltaY;
    if (scrollableAncestor(element, delta)) { stop(); return; }
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
