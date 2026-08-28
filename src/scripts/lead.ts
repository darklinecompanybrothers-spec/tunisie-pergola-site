/**
 * Adaptateur vers le circuit de réception DCB.
 *
 * Le formulaire cible n'a que six champs et leurs identifiants sont figés :
 * y ajouter une question casserait la feuille existante. La qualification
 * (ville, usage, dimensions, échéance, parcours, source) est donc repliée,
 * lisiblement, dans le champ de détails — exactement la stratégie retenue par
 * `js/lead.js` à la racine du dépôt DCB, qui n'est pas modifié.
 *
 * Le service est préfixé « Tunisie Pergola » pour que DCB distingue ces leads
 * de ceux du site DCB au premier coup d'œil.
 *
 * La réponse d'un formulaire Google en `no-cors` est opaque : impossible de la
 * lire. On annonce donc « transmise », jamais « reçue et validée ».
 */
import { summary, journey, track } from './source';

interface Entries {
  name: string;
  email: string;
  phone: string;
  service: string;
  pack: string;
  details: string;
}

interface FieldRule {
  id: string;
  label: string;
  /** Message affiché quand le champ est vide ou invalide. */
  message: string;
  validate?: (value: string) => boolean;
}

const RULES: FieldRule[] = [
  { id: 'tp-nom', label: 'Nom et prénom', message: 'Indiquez le nom à qui répondre.' },
  {
    id: 'tp-tel',
    label: 'Téléphone',
    message: 'Indiquez un numéro joignable (au moins 8 chiffres).',
    validate: (value) => (value.match(/\d/g) ?? []).length >= 8
  },
  { id: 'tp-ville', label: 'Ville', message: 'Indiquez la ville du projet.' },
  { id: 'tp-projet-type', label: 'Type de projet', message: 'Choisissez un type de projet.' },
  { id: 'tp-usage', label: 'Usage recherché', message: 'Choisissez l’usage recherché.' },
  {
    id: 'tp-dimensions',
    label: 'Dimensions approximatives',
    message: 'Une estimation suffit, par exemple « environ 4 m × 6 m ».'
  },
  {
    id: 'tp-message',
    label: 'Votre projet',
    message: 'Décrivez le projet en quelques mots (20 caractères minimum).',
    validate: (value) => value.trim().length >= 20
  },
  {
    id: 'tp-email',
    label: 'E-mail',
    message: 'Cette adresse e-mail semble incomplète.',
    validate: (value) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
  },
  {
    id: 'tp-consent',
    label: 'Consentement',
    message: 'Votre accord est nécessaire pour vous recontacter.'
  }
];

/** Champs facultatifs : ils ne sont pas exigés, seulement contrôlés s'ils sont remplis. */
const OPTIONAL = new Set(['tp-email']);

function control(form: HTMLFormElement, id: string): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null {
  const element = form.querySelector(`#${CSS.escape(id)}`);
  return element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
    ? element
    : null;
}

function valueOf(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
  if (field instanceof HTMLInputElement && field.type === 'checkbox') {
    return field.checked ? field.value || 'oui' : '';
  }
  return field.value.trim();
}

function setError(form: HTMLFormElement, id: string, message: string): void {
  const field = control(form, id);
  const slot = form.querySelector(`#${CSS.escape(id)}-err`);
  if (field) field.setAttribute('aria-invalid', message ? 'true' : 'false');
  // textContent uniquement : aucune valeur saisie n'est jamais interprétée
  // comme du HTML.
  if (slot) slot.textContent = message;
}

function validate(form: HTMLFormElement): { id: string; label: string; message: string }[] {
  const problems: { id: string; label: string; message: string }[] = [];

  for (const rule of RULES) {
    const field = control(form, rule.id);
    if (!field) continue;
    const value = valueOf(field);
    const required = !OPTIONAL.has(rule.id);
    const empty = value === '';
    const invalid = rule.validate ? !rule.validate(value) : false;

    if ((required && empty) || invalid) {
      setError(form, rule.id, rule.message);
      problems.push({ id: rule.id, label: rule.label, message: rule.message });
    } else {
      setError(form, rule.id, '');
    }
  }

  return problems;
}

/** Bloc de qualification, lisible tel quel dans la feuille de suivi. */
function composeDetails(form: HTMLFormElement): string {
  const get = (id: string) => {
    const field = control(form, id);
    return field ? valueOf(field) : '';
  };

  const lines = [
    get('tp-message'),
    '',
    `Ville : ${get('tp-ville')}`,
    `Usage : ${get('tp-usage')}`,
    `Dimensions approximatives : ${get('tp-dimensions')}`
  ];

  const echeance = get('tp-echeance');
  if (echeance) lines.push(`Échéance : ${echeance}`);

  lines.push('Consentement de contact : accordé');

  const src = summary();
  const path = journey();
  if (src || path) {
    lines.push('');
    if (src) lines.push(`— ${src}`);
    if (path) lines.push(`— ${path}`);
  }

  return lines.join('\n');
}

/** Reprend la demande dans un message WhatsApp prérempli, sans rien perdre. */
function whatsappFallback(form: HTMLFormElement, base: string): string {
  const get = (id: string) => {
    const field = control(form, id);
    return field ? valueOf(field) : '';
  };
  const text = [
    'Bonjour, je souhaite parler d’un projet.',
    `Nom : ${get('tp-nom')}`,
    `Ville : ${get('tp-ville')}`,
    `Projet : ${get('tp-projet-type')}`,
    `Usage : ${get('tp-usage')}`,
    `Dimensions : ${get('tp-dimensions')}`,
    '',
    get('tp-message')
  ].join('\n');
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function initLeadForm(): void {
  const found = document.querySelector<HTMLFormElement>('form[data-lead-form]');
  if (!found) return;
  const form: HTMLFormElement = found;

  const entries: Entries = {
    name: form.dataset['entryName'] ?? '',
    email: form.dataset['entryEmail'] ?? '',
    phone: form.dataset['entryPhone'] ?? '',
    service: form.dataset['entryService'] ?? '',
    pack: form.dataset['entryPack'] ?? '',
    details: form.dataset['entryDetails'] ?? ''
  };
  const action = form.dataset['action'] ?? form.action;
  const whatsappBase = form.dataset['whatsapp'] ?? '';
  const phoneDisplay = form.dataset['phone'] ?? '';
  const phoneHref = form.dataset['phoneHref'] ?? '';

  const status = form.querySelector<HTMLElement>('[data-status]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const summaryBox = form.querySelector<HTMLElement>('#tp-form-erreurs');
  const summaryList = summaryBox?.querySelector('ul') ?? null;
  const sentPanel = document.querySelector<HTMLElement>('[data-sent-panel]');

  // La validation est reprise en main : messages en français, résumé
  // navigable, focus maîtrisé. Sans JavaScript, la validation native reste
  // active et le formulaire poste directement.
  form.noValidate = true;

  let started = false;
  form.addEventListener(
    'input',
    () => {
      if (started) return;
      started = true;
      track('formulaire_demarre');
    },
    { once: false }
  );

  // Un champ corrigé efface son erreur immédiatement.
  form.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.id && target.getAttribute('aria-invalid') === 'true') {
      setError(form, target.id, '');
    }
  });

  function say(message: string, tone: 'busy' | 'error' | 'done' | ''): void {
    if (!status) return;
    status.textContent = message;
    if (tone) status.dataset['tone'] = tone;
    else delete status.dataset['tone'];
  }

  function showProblems(problems: { id: string; label: string; message: string }[]): void {
    if (!summaryBox || !summaryList) return;
    summaryList.replaceChildren();
    for (const problem of problems) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${problem.id}`;
      link.textContent = `${problem.label} — ${problem.message}`;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        control(form, problem.id)?.focus();
      });
      item.append(link);
      summaryList.append(item);
    }
    summaryBox.dataset['visible'] = '';
    summaryBox.focus();
  }

  function hideProblems(): void {
    if (!summaryBox || !summaryList) return;
    delete summaryBox.dataset['visible'];
    summaryList.replaceChildren();
  }

  function offerFallback(): void {
    if (!status || !whatsappBase) return;
    const line = document.createElement('span');
    const wa = document.createElement('a');
    wa.href = whatsappFallback(form, whatsappBase);
    wa.rel = 'noopener noreferrer';
    wa.target = '_blank';
    wa.textContent = 'Envoyer la même demande sur WhatsApp';
    const tel = document.createElement('a');
    tel.href = phoneHref;
    tel.textContent = phoneDisplay;
    line.append(wa, document.createTextNode(' · appeler le '), tel);
    status.append(line);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const problems = validate(form);
    if (problems.length > 0) {
      say(`${problems.length} champ${problems.length > 1 ? 's' : ''} à compléter.`, 'error');
      showProblems(problems);
      return;
    }
    hideProblems();

    const payload = new FormData();
    const get = (id: string) => {
      const field = control(form, id);
      return field ? valueOf(field) : '';
    };

    payload.append(entries.name, get('tp-nom'));
    payload.append(entries.email, get('tp-email'));
    payload.append(entries.phone, get('tp-tel'));
    payload.append(entries.service, get('tp-projet-type'));
    payload.append(entries.pack, form.querySelector<HTMLInputElement>(`input[name="${entries.pack}"]`)?.value ?? '');
    payload.append(entries.details, composeDetails(form));

    if (submit) {
      submit.setAttribute('aria-disabled', 'true');
      submit.disabled = true;
    }
    say('Envoi en cours…', 'busy');

    // `no-cors` : la réponse est opaque par conception. Un rejet signale un
    // vrai échec réseau; une résolution signale que la requête est partie.
    void fetch(action, { method: 'POST', mode: 'no-cors', body: payload })
      .then(() => {
        track('formulaire_envoye');
        say('', '');
        form.hidden = true;
        if (sentPanel) {
          sentPanel.hidden = false;
          sentPanel.focus();
        }
      })
      .catch(() => {
        if (submit) {
          submit.removeAttribute('aria-disabled');
          submit.disabled = false;
        }
        say(
          'La demande n’a pas pu partir — vos réponses sont conservées ci-dessus. Réessayez, ou passez par : ',
          'error'
        );
        offerFallback();
      });
  });
}
