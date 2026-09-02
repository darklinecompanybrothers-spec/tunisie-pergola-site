/**
 * Adaptateur vers le circuit de réception DCB.
 *
 * Le formulaire cible n'a que six champs et leurs identifiants sont figés :
 * y ajouter une question casserait la feuille existante. La qualification
 * (ville, ouvrage, dimensions, échéance, parcours, source) est donc repliée,
 * lisiblement, dans le champ de détails — exactement la stratégie retenue par
 * `js/lead.js` à la racine du dépôt DCB, qui n'est pas modifié.
 *
 * Le service est composé « Tunisie Pergola — <Famille> · <Ouvrage> » pour que
 * DCB distingue ces leads de ceux du site DCB au premier coup d'œil, ET
 * reconnaisse immédiatement de quel métier relève la demande.
 *
 * AUCUNE CHAÎNE TRADUITE ICI
 * Les messages sont écrits par le gabarit dans le HTML — `data-message` sur
 * chaque emplacement d'erreur, `data-msg-*` sur le formulaire. Ce fichier ne
 * connaît donc pas les langues du site : il lit ce que la page lui donne. Une
 * troisième langue n'y changerait pas une ligne, et une traduction ne peut pas
 * diverger entre le HTML et le script.
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

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

interface FieldRule {
  id: string;
  /** Champ facultatif : contrôlé seulement s'il est rempli. */
  optional?: boolean;
  validate?: (value: string) => boolean;
}

const RULES: readonly FieldRule[] = [
  { id: 'tp-nom' },
  { id: 'tp-tel', validate: (value) => (value.match(/\d/g) ?? []).length >= 8 },
  { id: 'tp-ville' },
  { id: 'tp-famille' },
  { id: 'tp-ouvrage' },
  { id: 'tp-dimensions' },
  { id: 'tp-message', validate: (value) => value.trim().length >= 20 },
  {
    id: 'tp-email',
    optional: true,
    validate: (value) => value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
  },
  { id: 'tp-consent' }
];

function control(form: HTMLFormElement, id: string): Field | null {
  const element = form.querySelector(`#${CSS.escape(id)}`);
  return element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
    ? element
    : null;
}

function slotOf(form: HTMLFormElement, id: string): HTMLElement | null {
  return form.querySelector<HTMLElement>(`#${CSS.escape(id)}-err`);
}

/**
 * Libellé lisible du champ, lu dans son étiquette — jamais recopié ici.
 *
 * Un champ dont l'étiquette est une PHRASE — le consentement, dont le libellé
 * est la phrase d'accord elle-même — porte un libellé court sur son
 * emplacement d'erreur. Le résumé des erreurs reste alors lisible : « le
 * consentement » plutôt que la phrase entière recopiée.
 */
function labelOf(form: HTMLFormElement, id: string): string {
  const short = slotOf(form, id)?.dataset['label'];
  if (short) return short;
  const label = form.querySelector<HTMLElement>(`label[for="${CSS.escape(id)}"]`);
  if (!label) return id;
  const clone = label.cloneNode(true) as HTMLElement;
  for (const extra of clone.querySelectorAll('.tp-field__optional, .tp-error, a')) extra.remove();
  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * Le deux-points de la langue de la page.
 *
 * Le français met une espace insécable devant, l'arabe le colle au mot. Le
 * gabarit écrit la bonne forme dans le HTML; ce fichier la lit, comme il lit
 * déjà tous ses autres textes. Sans cela, chaque ligne d'un message arabe
 * porterait une ponctuation française.
 */
function sepOf(form: HTMLFormElement): string {
  return form.dataset['msgSep'] ?? ' : ';
}

function valueOf(field: Field): string {
  if (field instanceof HTMLInputElement && field.type === 'checkbox') {
    return field.checked ? field.value || 'oui' : '';
  }
  return field.value.trim();
}

/** Texte affiché de l'option retenue — c'est lui qui doit partir, pas la clé. */
function chosenLabel(field: Field | null): string {
  if (field instanceof HTMLSelectElement) {
    return field.selectedOptions[0]?.textContent?.trim() ?? '';
  }
  return field ? valueOf(field) : '';
}

function setError(form: HTMLFormElement, id: string, show: boolean): string {
  const field = control(form, id);
  const slot = slotOf(form, id);
  const message = slot?.dataset['message'] ?? '';
  if (field) field.setAttribute('aria-invalid', show ? 'true' : 'false');
  // textContent uniquement : aucune valeur saisie n'est jamais interprétée
  // comme du HTML.
  if (slot) slot.textContent = show ? message : '';
  return message;
}

interface Problem {
  id: string;
  label: string;
  message: string;
}

function validate(form: HTMLFormElement): Problem[] {
  const problems: Problem[] = [];

  for (const rule of RULES) {
    const field = control(form, rule.id);
    if (!field) continue;
    const value = valueOf(field);
    const empty = value === '';
    const invalid = rule.validate ? !rule.validate(value) : false;
    const broken = (!rule.optional && empty) || invalid;
    const message = setError(form, rule.id, broken);
    if (broken) problems.push({ id: rule.id, label: labelOf(form, rule.id), message });
  }

  return problems;
}

/* --------------------------------------------------------------------------
   La liste des ouvrages suit la famille
   Les cinquante ouvrages sont TOUS dans le HTML, groupés par famille. Sans
   JavaScript, le prospect les parcourt tous — c'est utilisable. Avec, on ne
   laisse visible que le groupe qui correspond à la famille choisie, plus le
   groupe « autre ». Masquer un `<optgroup>` ne suffit pas partout : on le
   désactive AUSSI, ce qui le retire de la navigation clavier dans les moteurs
   qui ignorent `hidden` sur ces éléments.
   -------------------------------------------------------------------------- */
function linkFamilyToProduct(form: HTMLFormElement): void {
  const famille = form.querySelector<HTMLSelectElement>('#tp-famille');
  const ouvrage = form.querySelector<HTMLSelectElement>('#tp-ouvrage');
  if (!famille || !ouvrage) return;
  const groups = [...ouvrage.querySelectorAll<HTMLOptGroupElement>('optgroup[data-famille]')];

  function apply(): void {
    const key = famille!.value;
    const showAll = key === '' || key === 'indecis';
    for (const group of groups) {
      const own = group.dataset['famille'];
      const visible = showAll || own === key || own === '*';
      group.hidden = !visible;
      group.disabled = !visible;
    }
    // Une option devenue invisible ne doit pas rester sélectionnée : elle
    // partirait dans la demande sans que personne ne la voie à l'écran.
    const chosen = ouvrage!.selectedOptions[0];
    const parent = chosen?.parentElement;
    if (parent instanceof HTMLOptGroupElement && parent.hidden) ouvrage!.value = '';
  }

  famille.addEventListener('change', apply);
  apply();
}

/** Bloc de qualification, lisible tel quel dans la feuille de suivi. */
function composeDetails(form: HTMLFormElement): string {
  const get = (id: string) => {
    const field = control(form, id);
    return field ? valueOf(field) : '';
  };
  const label = (id: string) => labelOf(form, id);
  const sep = sepOf(form);

  const lines = [
    get('tp-message'),
    '',
    `${label('tp-ville')}${sep}${get('tp-ville')}`,
    `${label('tp-famille')}${sep}${chosenLabel(control(form, 'tp-famille'))}`,
    `${label('tp-ouvrage')}${sep}${chosenLabel(control(form, 'tp-ouvrage'))}`,
    `${label('tp-dimensions')}${sep}${get('tp-dimensions')}`
  ];

  const echeance = get('tp-echeance');
  if (echeance) lines.push(`${label('tp-echeance')}${sep}${echeance}`);

  lines.push(form.dataset['msgConsent'] ?? '');

  const src = summary();
  const path = journey();
  if (src || path) {
    lines.push('');
    if (src) lines.push(`— ${src}`);
    if (path) lines.push(`— ${path}`);
  }

  return lines.join('\n');
}

/**
 * La demande, écrite dans un message WhatsApp.
 *
 * Ce n'est plus un repli : c'est la SORTIE du formulaire. Le prospect remplit
 * ses champs, et la conversation s'ouvre avec sa demande déjà rédigée — il n'a
 * plus qu'à appuyer sur envoyer. C'est le canal que l'entreprise relève le plus
 * vite, et le seul où la réponse peut être immédiate.
 *
 * Les libellés viennent des étiquettes du formulaire, donc de la langue de la
 * page : le message part en français ou en arabe selon le visiteur, sans une
 * seule chaîne traduite dans ce fichier.
 */
function composeWhatsapp(form: HTMLFormElement, base: string, intro: string): string {
  const get = (id: string) => {
    const field = control(form, id);
    return field ? valueOf(field) : '';
  };
  const label = (id: string) => labelOf(form, id);
  const sep = sepOf(form);

  const lines = [
    intro,
    '',
    `${label('tp-nom')}${sep}${get('tp-nom')}`,
    `${label('tp-tel')}${sep}${get('tp-tel')}`,
    `${label('tp-ville')}${sep}${get('tp-ville')}`,
    `${label('tp-famille')}${sep}${chosenLabel(control(form, 'tp-famille'))}`,
    `${label('tp-ouvrage')}${sep}${chosenLabel(control(form, 'tp-ouvrage'))}`,
    `${label('tp-dimensions')}${sep}${get('tp-dimensions')}`
  ];

  const echeance = get('tp-echeance');
  if (echeance) lines.push(`${label('tp-echeance')}${sep}${echeance}`);
  const email = get('tp-email');
  if (email) lines.push(`${label('tp-email')}${sep}${email}`);

  lines.push('', get('tp-message'));

  /* L'ORIGINE DE LA VISITE N'EST PAS ICI, ET C'EST VOULU.
     Ce message est celui que le PROSPECT envoie de son propre compte : il doit
     ressembler à ce qu'il aurait écrit lui-même. Une ligne « Source : Google ·
     page d’entrée : / » y serait du jargon d'outil — en français dans un
     message arabe de surcroît — et donnerait le sentiment d'être suivi.

     L'attribution existe, entière, dans la copie qui part vers DCB
     (`composeDetails`). C'est le bon endroit : elle sert l'entreprise, pas la
     conversation. */

  return `${base}?text=${encodeURIComponent(lines.join('\n'))}`;
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
  const prefix = form.dataset['servicePrefix'] ?? '';
  const whatsappBase = form.dataset['whatsapp'] ?? '';
  const phoneDisplay = form.dataset['phone'] ?? '';
  const phoneHref = form.dataset['phoneHref'] ?? '';
  const msg = {
    one: form.dataset['msgOne'] ?? '',
    many: form.dataset['msgMany'] ?? '',
    wa: form.dataset['msgWa'] ?? '',
    call: form.dataset['msgCall'] ?? '',
    intro: form.dataset['msgIntro'] ?? '',
    consent: form.dataset['msgConsent'] ?? ''
  };

  const status = form.querySelector<HTMLElement>('[data-status]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const summaryBox = form.querySelector<HTMLElement>('#tp-form-erreurs');
  const summaryList = summaryBox?.querySelector('ul') ?? null;
  const sentPanel = document.querySelector<HTMLElement>('[data-sent-panel]');
  /* Le lien de secours du panneau de confirmation : il reçoit la même adresse
     WhatsApp que l'onglet ouvert, pour le cas où celui-ci a été bloqué. */
  const sentLink = sentPanel?.querySelector<HTMLAnchorElement>('a.tp-btn') ?? null;

  linkFamilyToProduct(form);

  // La validation est reprise en main : messages dans la langue de la page,
  // résumé navigable, focus maîtrisé. Sans JavaScript, la validation native
  // reste active et le formulaire poste directement.
  form.noValidate = true;

  let started = false;
  form.addEventListener('input', () => {
    if (started) return;
    started = true;
    track('formulaire_demarre');
  });

  // Un champ corrigé efface son erreur immédiatement.
  form.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.id && target.getAttribute('aria-invalid') === 'true') {
      setError(form, target.id, false);
    }
  });

  function say(message: string, tone: 'busy' | 'error' | 'done' | ''): void {
    if (!status) return;
    status.textContent = message;
    if (tone) status.dataset['tone'] = tone;
    else delete status.dataset['tone'];
  }

  function showProblems(problems: Problem[]): void {
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

  /**
   * Le navigateur a refusé d'ouvrir l'onglet WhatsApp.
   *
   * Cela arrive quand un bloqueur juge le geste trop indirect. Le message est
   * prêt et l'adresse aussi : on la donne en clair, plutôt que de laisser le
   * prospect devant un panneau qui affirme qu'il s'est passé quelque chose.
   */
  function offerFallback(waUrl: string): void {
    if (!status) return;
    const line = document.createElement('span');
    const wa = document.createElement('a');
    wa.href = waUrl;
    wa.rel = 'noopener noreferrer';
    wa.target = '_blank';
    wa.textContent = msg.wa;
    const tel = document.createElement('a');
    tel.href = phoneHref;
    tel.textContent = phoneDisplay;
    line.append(wa, document.createTextNode(msg.call), tel);
    status.append(line);
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const problems = validate(form);
    if (problems.length > 0) {
      say(`${problems.length} ${problems.length > 1 ? msg.many : msg.one}`, 'error');
      showProblems(problems);
      return;
    }
    hideProblems();

    const payload = new FormData();
    const get = (id: string) => {
      const field = control(form, id);
      return field ? valueOf(field) : '';
    };

    const famille = chosenLabel(control(form, 'tp-famille'));
    const ouvrage = chosenLabel(control(form, 'tp-ouvrage'));

    /* --- 1. WhatsApp, SYNCHRONEMENT --------------------------------------
       L'ouverture doit se produire DANS le geste de l'utilisateur. Après le
       moindre `await`, le navigateur ne la rattache plus au clic et le
       bloqueur d'onglets l'arrête. C'est toute la raison pour laquelle la
       copie vers DCB part après, et non l'inverse. */
    const waUrl = composeWhatsapp(form, whatsappBase, msg.intro);
    if (sentLink) sentLink.href = waUrl;
    const opened = whatsappBase ? window.open(waUrl, '_blank', 'noopener,noreferrer') : null;

    /* --- 2. La copie vers le circuit DCB ---------------------------------
       Elle part sans bloquer et sans rien annoncer. Un prospect qui a déjà sa
       conversation ouverte n'a que faire du sort d'une copie — et la trace
       écrite existe même s'il referme WhatsApp sans envoyer, ce qui est
       exactement ce qu'on attend d'une copie.

       `no-cors` : la réponse est opaque par conception. Le site n'annonce
       donc jamais « reçue », seulement « partie ». */
    payload.append(entries.name, get('tp-nom'));
    payload.append(entries.email, get('tp-email'));
    payload.append(entries.phone, get('tp-tel'));
    payload.append(entries.service, `${prefix} — ${famille} · ${ouvrage}`);
    payload.append(entries.pack, form.querySelector<HTMLInputElement>(`input[name="${entries.pack}"]`)?.value ?? '');
    payload.append(entries.details, composeDetails(form));
    void fetch(action, { method: 'POST', mode: 'no-cors', body: payload }).catch(() => {
      /* Sans effet visible : la demande est déjà partie par l'autre canal. */
    });

    /* --- 3. Le panneau ---------------------------------------------------- */
    track('formulaire_envoye');
    if (submit) {
      submit.setAttribute('aria-disabled', 'true');
      submit.disabled = true;
    }
    say('', '');
    form.hidden = true;
    if (sentPanel) {
      sentPanel.hidden = false;
      sentPanel.focus();
    }
    if (!opened) offerFallback(waUrl);
  });
}
