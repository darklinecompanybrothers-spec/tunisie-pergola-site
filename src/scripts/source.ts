/**
 * Attribution de première session — première partie, sans aucun traceur.
 *
 * Le site ne charge ni analytics, ni pixel publicitaire, ni cookie tiers. Rien
 * ne quitte le navigateur. On garde simplement, pour la durée de la session,
 * d'où venait le visiteur et par quelle page il est entré, puis on joint cette
 * ligne au lead : DCB voit l'origine réelle de la demande dans la demande
 * elle-même, sans outil supplémentaire.
 *
 * Mirroir volontaire de `js/source.js` à la racine du dépôt DCB : ce projet est
 * isolé et ne doit rien importer du site DCB, mais le vocabulaire des sources
 * doit rester le même pour que les leads soient comparables.
 *
 * Aucun identifiant publicitaire n'est lu ni écrit.
 */

const KEY = 'tp_src';

/** Hôte du référent → libellé. Comparaison par fragment, sous-domaines inclus. */
const HOSTS: readonly (readonly [string, string])[] = [
  ['chatgpt.com', 'ChatGPT'],
  ['openai.com', 'ChatGPT'],
  ['perplexity.ai', 'Perplexity'],
  ['claude.ai', 'Claude'],
  ['claude.com', 'Claude'],
  ['copilot.microsoft.com', 'Copilot'],
  ['gemini.google.com', 'Gemini'],
  ['bing.com', 'Bing'],
  ['google.', 'Google'],
  ['facebook.com', 'Facebook'],
  ['l.facebook.com', 'Facebook'],
  ['instagram.com', 'Instagram'],
  ['tiktok.com', 'TikTok'],
  ['youtube.com', 'YouTube'],
  ['wa.me', 'WhatsApp'],
  ['whatsapp.com', 'WhatsApp']
];

export interface Attribution {
  label: string;
  detail: string;
  landing: string;
  at: string;
}

function labelFor(host: string): string {
  if (!host) return '';
  for (const [needle, label] of HOSTS) {
    if (host === needle || host.includes(needle)) return label;
  }
  return host;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function classify(): { label: string; detail: string } | null {
  const utm = new URLSearchParams(window.location.search).get('utm_source');
  if (utm) {
    const trimmed = utm.slice(0, 60);
    return { label: labelFor(trimmed.toLowerCase()) || trimmed, detail: `utm_source=${trimmed}` };
  }

  const referrer = document.referrer;
  if (!referrer) return { label: 'Direct', detail: '' };

  const host = hostOf(referrer);
  if (host && host === window.location.hostname.toLowerCase()) {
    // Navigation interne : la session garde son origine d'entrée.
    return null;
  }
  return { label: labelFor(host), detail: host };
}

function read(): Attribution | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}

function write(value: Attribution): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* navigation privée : on continue sans mémoire, le site fonctionne. */
  }
}

let current = read();
if (!current) {
  const classified = classify();
  if (classified) {
    current = {
      label: classified.label,
      detail: classified.detail,
      landing: window.location.pathname,
      at: new Date().toISOString()
    };
    write(current);
  }
}

/* --------------------------------------------------------------------------
   Évènements utiles — et seulement ceux-là
   Démarrage de formulaire, envoi, clic téléphone, clic WhatsApp. Ils ne sont
   envoyés nulle part : ils s'accumulent dans la session et sont joints au lead
   sous forme d'une ligne « Parcours ». C'est exactement l'information dont DCB
   a besoin pour rappeler au bon moment, sans installer d'outil de mesure.
   -------------------------------------------------------------------------- */

const EVENTS_KEY = 'tp_events';
const MAX_EVENTS = 12;

export type TrackedEvent = 'formulaire_demarre' | 'formulaire_envoye' | 'clic_telephone' | 'clic_whatsapp';

const LABELS: Record<TrackedEvent, string> = {
  formulaire_demarre: 'formulaire démarré',
  formulaire_envoye: 'formulaire envoyé',
  clic_telephone: 'appel',
  clic_whatsapp: 'WhatsApp'
};

function readEvents(): string[] {
  try {
    const raw = window.sessionStorage.getItem(EVENTS_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function track(event: TrackedEvent): void {
  const events = readEvents();
  const label = LABELS[event];
  if (events[events.length - 1] === label) return;
  events.push(label);
  try {
    window.sessionStorage.setItem(EVENTS_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  } catch {
    /* sans stockage, le parcours est simplement absent du lead. */
  }
}

/** Une ligne, sûre à joindre au champ libre d'un lead. */
export function summary(): string {
  if (!current) return '';
  return (
    `Source : ${current.label}` +
    (current.detail ? ` (${current.detail})` : '') +
    ` · page d’entrée : ${current.landing}`
  );
}

/** Parcours de la session, une ligne également. */
export function journey(): string {
  const events = readEvents();
  return events.length > 1 ? `Parcours : ${events.join(' → ')}` : '';
}

/** Branche le suivi des clics d'appel et de WhatsApp. */
export function watchContactLinks(): void {
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      if (href.startsWith('tel:')) track('clic_telephone');
      /* Le clic de devis est enregistré, mais le lien n'est PAS réécrit.
         Le message WhatsApp est celui que le prospect envoie de son propre
         compte : il doit ressembler à ce qu'il aurait écrit lui-même. Une
         ligne « Source : Google · page d'entrée : / » y serait du jargon
         d'outil, et donnerait le sentiment d'être suivi. La provenance y
         figure déjà, en clair et dans sa langue — « Depuis la page :
         Portails métalliques ». */
      else if (/^https:\/\/wa\.me\//i.test(href)) track('clic_whatsapp');
    },
    true
  );
}
