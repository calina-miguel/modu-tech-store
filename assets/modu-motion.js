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

  // Native browser scrolling avoids wheel-event interception and frame rounding.
})();
