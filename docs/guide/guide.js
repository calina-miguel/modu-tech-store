(() => {
  const steps = [...document.querySelectorAll('.step')];
  const nav = document.getElementById('step-nav');
  const boxes = [...document.querySelectorAll('[data-step]')];
  const key = 'modu-build-guide-progress-v1';
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(key) || '[]'); } catch {}
  boxes.forEach(box => {
    box.checked = saved.includes(box.dataset.step);
    box.addEventListener('change', updateProgress);
  });
  function updateProgress() {
    const completed = boxes.filter(box => box.checked).map(box => box.dataset.step);
    try { localStorage.setItem(key, JSON.stringify(completed)); } catch {}
    document.getElementById('count').textContent = completed.length + ' / ' + boxes.length;
    document.getElementById('fill').style.width = completed.length / boxes.length * 100 + '%';
    document.querySelector('.track').setAttribute('aria-valuenow', String(completed.length));
  }
  updateProgress();
  steps.forEach((step, index) => {
    const link = document.createElement('a');
    link.href = '#' + step.id;
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    link.append(number, document.createTextNode(step.dataset.title));
    nav.append(link);
  });
  document.getElementById('search').addEventListener('input', event => {
    const query = event.target.value.trim().toLowerCase();
    steps.forEach((step, index) => {
      const visible = !query || step.textContent.toLowerCase().includes(query);
      step.hidden = !visible;
      nav.children[index].hidden = !visible;
    });
  });
  document.getElementById('reset').addEventListener('click', () => {
    boxes.forEach(box => { box.checked = false; });
    updateProgress();
  });
  const layerText = [
    'Dawn is the Shopify foundation. Its Liquid templates render products, variants, collections, search, cart, and checkout links using Shopify services.',
    'MODU sections are Liquid files with schemas. Shopify reads those schemas to expose editable text, links, and benefit blocks in the theme editor.',
    'Theme settings, MODU CSS, and the motion script apply the visual design and interactions across the Shopify storefront.',
    'GitHub Pages serves the public HTML, CSS, and JavaScript site. It shares the visual identity but cannot run Shopify Liquid or checkout.'
  ];
  const detail = document.getElementById('layer-detail');
  detail.textContent = layerText[0];
  document.querySelectorAll('[data-layer]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-layer]').forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
    detail.textContent = layerText[Number(button.dataset.layer)];
  }));
  document.querySelectorAll('.codebox').forEach(box => {
    box.querySelectorAll('[data-tab]').forEach(button => button.addEventListener('click', () => {
      box.querySelectorAll('[data-tab]').forEach(item => item.classList.toggle('selected', item === button));
      box.querySelectorAll('.panel').forEach(panel => panel.classList.toggle('selected', panel.id === button.dataset.tab));
    }));
  });
  document.querySelectorAll('.copy').forEach(button => button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.nextElementSibling.textContent);
      button.textContent = 'Copied';
      setTimeout(() => { button.textContent = 'Copy'; }, 1500);
    } catch { button.textContent = 'Select text to copy'; }
  }));
  document.querySelectorAll('.files a').forEach(link => {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        nav.querySelectorAll('a').forEach(link => link.classList.toggle('active', link.hash === '#' + entry.target.id));
      }
    }), { rootMargin: '-10% 0px -75% 0px' });
    steps.forEach(step => observer.observe(step));
  }
})();
