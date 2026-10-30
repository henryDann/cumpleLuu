const controlsToggle = document.querySelector('.controls-toggle');
const controlsPanel = document.getElementById('surprise-controls');

if (controlsToggle && controlsPanel) {
  function setControlsVisible(visible) {
    controlsPanel.hidden = !visible;
    controlsToggle.setAttribute('aria-expanded', String(visible));
    controlsToggle.setAttribute('aria-label', visible ? 'Ocultar botones' : 'Mostrar botones');
  }

  controlsToggle.hidden = false;
  controlsToggle.addEventListener('click', () => {
    setControlsVisible(controlsPanel.hidden);
  });

  controlsPanel.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    setControlsVisible(false);
    controlsToggle.focus({ preventScroll: true });
  });
}
