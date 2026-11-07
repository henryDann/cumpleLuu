// Unos pocos pétalos por toque, sin interferir con los botones o el desplazamiento.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const layer = document.createElement('div');
  layer.className = 'tap-petals';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);
  const colors = ['#ffd75e', '#fff0ae', '#f7a6b8', '#ffe6d0'];
  let touch;

  document.addEventListener('pointerdown', (event) => {
    touch = undefined;
    if (event.isPrimary === false || event.button !== 0 || reducedMotion.matches) return;
    if (event.target.closest('button, a, input, textarea, select, dialog, .surprise-tools')) return;
    touch = { id: event.pointerId, x: event.clientX, y: event.clientY, time: performance.now() };
  }, { passive: true });

  document.addEventListener('pointercancel', () => { touch = undefined; }, { passive: true });
  document.addEventListener('pointerup', (event) => {
    const start = touch;
    touch = undefined;
    if (!start || start.id !== event.pointerId || reducedMotion.matches || document.hidden) return;
    if (performance.now() - start.time > 700
      || Math.hypot(event.clientX - start.x, event.clientY - start.y) > 12) return;

    const count = Math.min(5, 30 - layer.children.length);
    for (let index = 0; index < count; index++) {
      const petal = document.createElement('span');
      petal.className = 'tap-petal';
      petal.style.setProperty('--x', `${event.clientX}px`);
      petal.style.setProperty('--y', `${event.clientY}px`);
      petal.style.setProperty('--drift', `${Math.random() * 120 - 60}px`);
      petal.style.setProperty('--rise', `${-70 - Math.random() * 100}px`);
      petal.style.setProperty('--turn', `${Math.random() * 240 - 120}deg`);
      petal.style.setProperty('--color', colors[index % colors.length]);
      petal.addEventListener('animationend', () => petal.remove(), { once: true });
      layer.appendChild(petal);
      // También se limpia si una pestaña oculta interrumpe la animación.
      window.setTimeout(() => petal.remove(), 2000);
    }
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      touch = undefined;
      layer.replaceChildren();
    }
  });
})();
