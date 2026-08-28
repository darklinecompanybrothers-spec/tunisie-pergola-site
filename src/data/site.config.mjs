/**
 * Tunisie Pergola — faits confirmés, source unique.
 * =================================================
 * Ce fichier est volontairement en JavaScript simple : il est lu par
 * `astro.config.mjs`, par les scripts Node (`scripts/*.mjs`) et par le module
 * TypeScript `src/data/site.ts` qui le valide et le type.
 *
 * RÈGLE : rien n'entre ici sans figurer dans
 * `docs/clients/tunisie-pergola/CLIENT-BRIEF.md`. Aucune ancienneté, aucun
 * nombre de projets, aucun prix, aucun horaire, aucune garantie, aucune
 * caractéristique technique. Une information absente reste absente du site.
 */

/** Domaine canonique. Sans `www`, sans slash final. */
const ORIGIN = 'https://tunisiepergola.tn';

/**
 * Numéro public, deux écritures pour un seul et même numéro.
 * Ligne commerciale ouverte le 27 août 2026 : les demandes sont reçues et
 * traitées par DCB Authority Group, qui porte aussi l'adresse e-mail. Le
 * numéro historique du client (et celui incrusté sur d'anciennes photos) n'a
 * plus cours nulle part sur le site.
 */
const PHONE_E164 = '+21699447993';
const PHONE_DISPLAY = '+216 99 447 993';

export const SITE = {
  origin: ORIGIN,
  locale: 'fr-TN',
  lang: 'fr',
  /** Date du dernier contrôle du dossier client (ASSET-MANIFEST.md). */
  lastReviewed: '2026-08-21',

  name: 'Tunisie Pergola',
  /** Signature de marque — proposition identité v1, à valider. */
  signature: 'L’ombre prend forme.',
  /** Activité déclarée sur la page Facebook, reformulée sans ajout. */
  activity:
    'Conception, fourniture et pose de pergolas, verrières, abris et abris de jardin.',

  contact: {
    phoneE164: PHONE_E164,
    phoneDisplay: PHONE_DISPLAY,
    phoneHref: `tel:${PHONE_E164}`,
    /** Même numéro que le téléphone : WhatsApp public déclaré. */
    whatsappHref: `https://wa.me/${PHONE_E164.replace('+', '')}`,
    email: 'contact@dcbag.net',
    emailHref: 'mailto:contact@dcbag.net'
  },

  /** NAP — identique dans le contenu, le footer, le contact et le JSON-LD. */
  address: {
    street: 'Rue Léopold Senghor',
    postalCode: '4000',
    city: 'Sousse',
    country: 'Tunisie',
    countryCode: 'TN',
    /** Une seule ligne, réutilisée partout sans reformulation. */
    inline: 'Rue Léopold Senghor, 4000 Sousse, Tunisie'
  },

  social: {
    facebook: 'https://www.facebook.com/Tunisie.Pergola77',
    /** Audience observée le 21 août 2026. Jamais présentée comme des clients. */
    facebookFollowers: 19000,
    facebookFollowersLabel: '≈ 19 000 abonnés',
    facebookObservedOn: '21 août 2026'
  },

  /** Promesse opérationnelle autorisée par DCB. */
  responsePromise: 'Réponse sous 24 heures',

  /**
   * Gammes confirmées de vive voix par le client le 27 août 2026
   * (CLIENT-BRIEF.md §2 bis). Chaque libellé est repris mot pour mot du
   * relevé : ni « sur mesure », ni « haut de gamme », ni performance ajoutée.
   *
   * Un quatrième produit motorisé a été évoqué dans le même message — sans
   * intitulé établi. Il n'est pas ici, et le contrôle de build bloque le mot
   * qui le désignerait, pour qu'il ne puisse pas entrer par une autre porte.
   */
  ranges: [
    {
      key: 'bioclimatique',
      nom: 'Pergolas bioclimatiques',
      resume: 'Structure 100 % aluminium et lames motorisées.',
      detail:
        'La lame pivote : on ouvre au soleil, on ferme à l’averse, sans rien démonter. C’est la gamme qui transforme une terrasse en pièce utilisable toute l’année.'
    },
    {
      key: 'toile',
      nom: 'Pergolas à toile acrylique',
      resume: 'Structure aluminium, partie mobile en toile acrylique.',
      detail:
        'La toile se déploie et se replie sur une structure aluminium. Une couverture plus légère, pour les portées où la lame n’est pas nécessaire.'
    },
    {
      key: 'fixe',
      nom: 'Solutions fixes',
      resume: 'Tube, tôle ou panneau sandwich selon le projet.',
      detail:
        'Quand l’usage demande un abri permanent plutôt qu’un ciel réglable : le mode de couverture est choisi projet par projet, pas au catalogue.'
    }
  ],

  /**
   * Délai. La fourchette est publiée ENTIÈRE, toujours : le client a
   * explicitement demandé que 30 jours ne soit jamais présenté seul ni comme
   * un engagement. Le contrôle de build bloque « posé en 30 jours » et ses
   * variantes pour que la règle survive à une réécriture.
   */
  delay: {
    court: 'De 30 à 60 jours',
    phrase: 'De 30 à 60 jours selon le carnet de commandes au moment de la commande.'
  },

  /**
   * Visite et conception. Payantes avant engagement — c'est une information
   * commerciale que le client assume et qui filtre les demandes non sérieuses.
   * Aucun montant n'est publié : les chiffres cités dans le vocal ne sont pas
   * rattachés de façon sûre à ce qu'ils couvrent (CLIENT-BRIEF.md §2 ter).
   */
  study: {
    visite: 'La visite sur place est un service payant, facturé selon la localisation.',
    conception:
      'L’étude est payante avant engagement et dépend du métrage et de la nature du projet. Après signature, elle est reprise dans le contrat.'
  },

  /** Villes déclarées sur Facebook. Aucune extension nationale. */
  areaServed: [
    'Sousse',
    'Monastir',
    'Nabeul',
    'Tunis',
    'La Marsa',
    'Djerba',
    'Sfax',
    'Gabès',
    'Médenine',
    'Tataouine'
  ],

  /** Lieux de réalisation explicitement observés dans les publications. */
  observedProjectPlaces: ['Tabarka', 'La Marsa Nassim', 'Jendouba'],

  /**
   * Circuit de réception des demandes pendant la phase initiale.
   * L'URL publique d'un Google Form n'est pas un secret : elle est déjà
   * exposée par le site DCB. Aucune clé, aucun jeton, aucune donnée privée.
   * Reflet exact de `js/lead.js` à la racine du dépôt (non modifié).
   */
  leadForm: {
    action:
      'https://docs.google.com/forms/d/e/1FAIpQLSckb4PZBDy-TVAV9_I48kjIZUaatVKvx_IJfwOaiA7OBbg_tg/formResponse',
    entry: {
      name: 'entry.1253088086',
      email: 'entry.2105363255',
      phone: 'entry.940423864',
      service: 'entry.843420390',
      pack: 'entry.17735681',
      details: 'entry.1254506406'
    },
    /** Marqueurs qui permettent à DCB d'isoler les leads de ce site. */
    servicePrefix: 'Tunisie Pergola',
    packValue: 'Site tunisiepergola.tn'
  }
};

/**
 * Le studio qui conçoit et développe le site.
 *
 * Ce n'est pas une donnée du client : c'est la signature de l'atelier, posée
 * dans le pied de page. Elle vit ici pour la même raison que le reste — une
 * seule source, aucun fait écrit en dur dans un composant — et parce que
 * l'hôte doit rester cohérent avec la liste blanche du contrôle de build.
 */
export const STUDIO = {
  name: 'DARKLINE',
  href: 'https://dcbag.net/',
  /** Hôte attendu dans le HTML produit, sans slash ni protocole. */
  host: 'dcbag.net'
};

/** Palette identité v1 — source unique des couleurs de marque. */
export const BRAND = {
  anthracite: '#151A1C',
  copper: '#B86F44',
  ivory: '#F4F0E8',
  sea: '#89AEC0',
  white: '#FFFFFF'
};
