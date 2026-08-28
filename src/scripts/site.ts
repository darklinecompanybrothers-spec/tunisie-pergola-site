/**
 * Améliorations progressives.
 *
 * Tout ce que fait ce fichier existe déjà sans lui :
 *   • le menu mobile s'ouvre et se ferme par `:target`;
 *   • le sous-menu Services est un `<details>` natif;
 *   • les révélations sont des animations CSS liées au défilement;
 *   • le formulaire poste en HTML pur vers le circuit DCB.
 *
 * Le script ajoute ce que le HTML ne sait pas faire seul : fermeture par Échap,
 * clic extérieur, arrière-plan rendu inerte, retour du focus, envoi discret du
 * formulaire.
 */
import { initLeadForm } from './lead';
import { watchContactLinks } from './source';
import { initScenes } from './scene';

/* --------------------------------------------------------------------------
   Menu mobile
   -------------------------------------------------------------------------- */
function initMenu(): void {
  const menu = document.querySelector<HTMLElement>('#tp-menu');
  const openers = document.querySelectorAll<HTMLAnchorElement>('[data-menu-open]');
  const closers = document.querySelectorAll<HTMLAnchorElement>('[data-menu-close]');
  if (!menu || openers.length === 0) return;
  const panel = menu;

  const main = document.querySelector<HTMLElement>('#tp-main');
  const footer = document.querySelector<HTMLElement>('#tp-footer');
  const header = document.querySelector<HTMLElement>('.tp-header');
  let lastFocused: HTMLElement | null = null;

  // Le lien devient un vrai bouton : son état déployé est désormais exposé.
  for (const opener of openers) {
    opener.setAttribute('role', 'button');
    opener.setAttribute('aria-expanded', 'false');
    opener.setAttribute('aria-controls', 'tp-menu');
  }

  function setBackgroundInert(inert: boolean): void {
    for (const region of [main, footer, header]) {
      if (!region) continue;
      if (inert) region.setAttribute('inert', '');
      else region.removeAttribute('inert');
    }
  }

  function open(trigger: HTMLElement): void {
    lastFocused = trigger;
    panel.dataset['open'] = '';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    for (const opener of openers) opener.setAttribute('aria-expanded', 'true');
    setBackgroundInert(true);
    document.documentElement.classList.add('tp-locked');
    panel.querySelector<HTMLElement>('[data-menu-close]')?.focus();
  }

  function close(): void {
    if (!('open' in panel.dataset)) return;
    delete panel.dataset['open'];
    panel.removeAttribute('role');
    panel.removeAttribute('aria-modal');
    for (const opener of openers) opener.setAttribute('aria-expanded', 'false');
    setBackgroundInert(false);
    document.documentElement.classList.remove('tp-locked');
    lastFocused?.focus();
    lastFocused = null;
  }

  for (const opener of openers) {
    opener.addEventListener('click', (event) => {
      event.preventDefault();
      open(opener);
    });
    opener.addEventListener('keydown', (event) => {
      // `role="button"` doit répondre à la barre d'espace comme un bouton.
      if (event.key === ' ') {
        event.preventDefault();
        open(opener);
      }
    });
  }

  for (const closer of closers) {
    closer.addEventListener('click', (event) => {
      event.preventDefault();
      close();
    });
  }

  // Suivre un lien du menu ferme le menu, sans laisser le panneau en place.
  menu.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest('a[href^="/"]')) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  // Piège de focus : le panneau étant modal, la tabulation y reste.
  menu.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !('open' in menu.dataset)) return;
    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // Le panneau n'a pas de raison d'être ouvert quand la navigation large
  // reprend la main.
  window.matchMedia('(min-width: 62rem)').addEventListener('change', (event) => {
    if (event.matches) close();
  });
}

/* --------------------------------------------------------------------------
   Sous-menu Services
   -------------------------------------------------------------------------- */
function initNavDisclosure(): void {
  const groups = document.querySelectorAll<HTMLDetailsElement>('.tp-nav__group');
  if (groups.length === 0) return;

  document.addEventListener('click', (event) => {
    for (const group of groups) {
      if (!group.open) continue;
      const target = event.target;
      if (target instanceof Node && !group.contains(target)) group.open = false;
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    for (const group of groups) {
      if (!group.open) continue;
      group.open = false;
      group.querySelector<HTMLElement>('summary')?.focus();
    }
  });

  // Suivre un lien referme le panneau avant la navigation.
  for (const group of groups) {
    group.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest('a[href]')) group.open = false;
    });
  }
}

initMenu();
initNavDisclosure();
initScenes();
watchContactLinks();
initLeadForm();
