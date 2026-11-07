const title = document.querySelector('.title');
const text = 'Te tengo un regalo';

if (title) {
  title.setAttribute('aria-label', text);
  const letters = document.createDocumentFragment();

  for (const character of text) {
    const letter = document.createElement('span');
    letter.setAttribute('aria-hidden', 'true');
    letter.textContent = character;
    letter.style.animationDelay = `${Math.random() * 3}s`;
    letters.appendChild(letter);
  }

  title.replaceChildren(letters);
}

// Mantener la portada como documento principal evita perder el audio al navegar.
const openButton = document.querySelector('a.btn[href="flower.html"]');
let surpriseFrame;
let openingTimer;
const introPageTitle = document.title;

function resetGiftOpening() {
  window.clearTimeout(openingTimer);
  openingTimer = undefined;
  openButton.classList.remove('is-opening');
  openButton.removeAttribute('aria-disabled');
}

function sendMusicState() {
  if (!surpriseFrame?.contentWindow) return;
  surpriseFrame.contentWindow.postMessage({
    type: 'birthday-music-state',
    playing: window.birthdayMusic?.playing === true,
    error: window.birthdayMusic?.error || ''
  }, '*');
}

function showSurprise(startMusic) {
  if (surpriseFrame) return;
  surpriseFrame = document.createElement('iframe');
  surpriseFrame.className = 'surprise-frame';
  surpriseFrame.title = 'Sorpresa de cumpleaños para Luu';
  surpriseFrame.src = openButton.href;
  surpriseFrame.addEventListener('load', () => {
    sendMusicState();
    surpriseFrame?.focus();
  });
  document.body.appendChild(surpriseFrame);
  document.body.classList.add('surprise-open');
  document.title = 'Feliz Cumpleaños Luu';
  // Se invoca en el propio evento del clic, antes de cualquier espera.
  if (startMusic) window.birthdayMusic?.start();
}

if (openButton) {
  openButton.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (!window.birthdayMusic) return;
    event.preventDefault();
    if (surpriseFrame || openingTimer !== undefined) return;
    history.pushState(null, '', '#sorpresa');
    // El audio se inicia durante el clic, antes de la animación de apertura.
    window.birthdayMusic.start();
    openButton.classList.add('is-opening');
    openButton.setAttribute('aria-disabled', 'true');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    openingTimer = window.setTimeout(() => {
      resetGiftOpening();
      showSurprise(false);
    }, reducedMotion ? 0 : 850);
  });

  window.addEventListener('birthday-music-state', sendMusicState);
  window.addEventListener('message', (event) => {
    if (!surpriseFrame || event.source !== surpriseFrame.contentWindow) return;
    if (event.data?.type === 'birthday-music-ready') sendMusicState();
    if (event.data?.type === 'birthday-music-toggle') window.birthdayMusic?.toggle();
  });

  window.addEventListener('popstate', () => {
    resetGiftOpening();
    if (location.hash === '#sorpresa') {
      showSurprise(false);
    } else {
      surpriseFrame?.remove();
      surpriseFrame = undefined;
      document.body.classList.remove('surprise-open');
      document.title = introPageTitle;
      window.birthdayMusic?.pause().catch(() => {});
      openButton.focus();
    }
  });

  // Una recarga conserva la sorpresa; el control permite reactivar el audio.
  if (location.hash === '#sorpresa') showSurprise(false);
}
