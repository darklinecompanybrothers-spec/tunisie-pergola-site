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
 *
 * BILINGUE (1er septembre 2026) : tout fait destiné à être LU porte ses deux
 * écritures, `{ fr, ar }`. Les faits techniques — numéro, domaine, adresse
 * e-mail, identifiants de formulaire — n'en ont qu'une : ce sont des valeurs,
 * pas des phrases.
 */

/** Domaine canonique. Sans `www`, sans slash final. */
const ORIGIN = 'https://tunisiepergola.tn';

/**
 * Numéro public, deux écritures pour un seul et même numéro.
 * Ligne commerciale confirmée le 1er septembre 2026. Elle remplace le numéro
 * du 27 août (+216 99 447 993), lui-même successeur du numéro historique
 * incrusté sur d'anciennes photos (+216 98 363 003). Aucun des deux ne doit
 * plus apparaître nulle part : `scripts/audit-build.mjs` les recherche
 * nommément dans le HTML produit.
 */
const PHONE_E164 = '+21658233020';
const PHONE_DISPLAY = '+216 58 233 020';

export const SITE = {
  origin: ORIGIN,
  /** Date du dernier contrôle du dossier client. */
  lastReviewed: '2026-09-01',

  name: 'Tunisie Pergola',
  /** Signature de marque — proposition identité v1, à valider. */
  signature: {
    fr: 'Le métal prend forme.',
    ar: 'المعدن يأخذ شكله.'
  },

  /**
   * Activité déclarée. Élargie le 1er septembre 2026 : le client confirme que
   * l'entreprise traite tout ce qui relève du fer, de la ferronnerie, de la
   * métallerie et des ouvrages métalliques sur mesure (CLIENT-BRIEF §2 quater).
   * Les pergolas, verrières et abris restent dans le périmètre — ils en sont
   * désormais trois familles parmi onze.
   */
  activity: {
    fr: 'Conception, fabrication et pose d’ouvrages métalliques sur mesure : portes, portails, garde-corps, escaliers, pergolas, verrières, abris, clôtures, structures et mobilier.',
    ar: 'تصميم وتصنيع وتركيب الأشغال الحديدية والمعدنية حسب الطلب: أبواب وبوابات ودرابزين وسلالم وبرغولات وأسقف زجاجية ومظلات وأسيجة وهياكل وأثاث.'
  },

  /** Positionnement court, celui des titres et du JSON-LD. */
  positioning: {
    fr: 'Ferronnerie et métallerie sur mesure en Tunisie',
    ar: 'حدادة ومعدنية حسب الطلب في تونس'
  },

  /**
   * Le parcours annoncé, en cinq temps. C'est la seule promesse de méthode du
   * site : elle décrit ce que l'entreprise fait, sans délai chiffré ni
   * engagement de résultat.
   */
  journey: {
    fr: ['Conception', 'Fabrication', 'Finition', 'Livraison', 'Pose'],
    ar: ['التصميم', 'التصنيع', 'التشطيب', 'التسليم', 'التركيب']
  },

  contact: {
    phoneE164: PHONE_E164,
    phoneDisplay: PHONE_DISPLAY,
    phoneHref: `tel:${PHONE_E164}`,
    /** Même numéro que le téléphone : WhatsApp public déclaré. */
    whatsappHref: `https://wa.me/${PHONE_E164.replace('+', '')}`,
    email: 'contact@dcbag.net',
    emailHref: 'mailto:contact@dcbag.net'
  },

  /**
   * NAP de Tunisie Pergola — l'adresse PHYSIQUE de l'entreprise, à Sousse.
   *
   * C'est elle, et elle seule, qui alimente le `LocalBusiness` : une fiche
   * locale doit porter le lieu de l'entreprise, jamais celui de l'agence qui
   * reçoit ses demandes. La confusion entre les deux avait été introduite le
   * 27 août puis corrigée ici le 1er septembre 2026.
   */
  address: {
    street: 'Rue Léopold Senghor',
    postalCode: '4000',
    city: { fr: 'Sousse', ar: 'سوسة' },
    country: { fr: 'Tunisie', ar: 'تونس' },
    countryCode: 'TN',
    /** Une seule ligne, réutilisée partout sans reformulation. */
    inline: {
      fr: 'Rue Léopold Senghor, 4000 Sousse, Tunisie',
      ar: 'نهج ليوبولد سنغور، 4000 سوسة، تونس'
    }
  },

  /**
   * Circuit de réception des demandes — DCB Authority Group.
   *
   * Ce n'est PAS une coordonnée de Tunisie Pergola : c'est l'agence qui opère
   * le site et reçoit les leads pendant la phase initiale. Son adresse est
   * publiée là où le traitement des données l'exige (page contact, politique
   * de confidentialité, à propos), et nulle part ailleurs. Elle n'entre dans
   * aucun balisage `LocalBusiness`.
   */
  intake: {
    operator: 'DCB Authority Group',
    inline: {
      fr: '41 Av. Kheireddine Pacha, 1002 Tunis, Tunisie',
      ar: '41 شارع خير الدين باشا، 1002 تونس، تونس'
    }
  },

  /**
   * Ville d'implantation de Tunisie Pergola, déclarée sur sa page Facebook et
   * confirmée par l'adresse physique ci-dessus. C'est un fait sur
   * l'ENTREPRISE : il porte les tournures « basée à », « depuis », et l'ancrage
   * local du référencement.
   */
  baseCity: { fr: 'Sousse', ar: 'سوسة' },

  social: {
    facebook: 'https://www.facebook.com/Tunisie.Pergola77',
    /** Audience observée le 21 août 2026. Jamais présentée comme des clients. */
    facebookFollowers: 19000,
    facebookFollowersLabel: { fr: '≈ 19 000 abonnés', ar: 'حوالي 19 000 متابع' },
    facebookObservedOn: { fr: '21 août 2026', ar: '21 أوت 2026' }
  },

  /** Promesse opérationnelle autorisée par DCB. */
  responsePromise: {
    fr: 'Réponse sous 24 heures',
    ar: 'ردّ في غضون 24 ساعة'
  },

  /**
   * Gammes de couverture confirmées de vive voix le 27 août 2026
   * (CLIENT-BRIEF.md §2 bis). Elles restent attachées aux pergolas : ce sont
   * des modes de couverture, pas des familles de produits.
   */
  ranges: [
    {
      key: 'bioclimatique',
      nom: { fr: 'Pergolas bioclimatiques', ar: 'برغولات بيومناخية' },
      resume: {
        fr: 'Structure 100 % aluminium et lames motorisées.',
        ar: 'هيكل من الألمنيوم بالكامل وشرائح متحركة آليًا.'
      },
      detail: {
        fr: 'La lame pivote : on ouvre au soleil, on ferme à l’averse, sans rien démonter. C’est la gamme qui transforme une terrasse en pièce utilisable toute l’année.',
        ar: 'تدور الشريحة فتُفتح في الشمس وتُغلق عند المطر دون فكّ أي قطعة. هي الفئة التي تحوّل الشرفة إلى فضاء صالح للاستعمال طوال السنة.'
      }
    },
    {
      key: 'toile',
      nom: { fr: 'Pergolas à toile acrylique', ar: 'برغولات بقماش أكريليكي' },
      resume: {
        fr: 'Structure aluminium, partie mobile en toile acrylique.',
        ar: 'هيكل من الألمنيوم وجزء متحرّك من القماش الأكريليكي.'
      },
      detail: {
        fr: 'La toile se déploie et se replie sur une structure aluminium. Une couverture plus légère, pour les portées où la lame n’est pas nécessaire.',
        ar: 'يُبسط القماش ويُطوى فوق هيكل من الألمنيوم. تغطية أخفّ للمساحات التي لا تستدعي الشرائح.'
      }
    },
    {
      key: 'fixe',
      nom: { fr: 'Solutions fixes', ar: 'حلول ثابتة' },
      resume: {
        fr: 'Tube, tôle ou panneau sandwich selon le projet.',
        ar: 'أنابيب أو صفائح أو ألواح ساندويتش حسب المشروع.'
      },
      detail: {
        fr: 'Quand l’usage demande un abri permanent plutôt qu’un ciel réglable : le mode de couverture est choisi projet par projet, pas au catalogue.',
        ar: 'حين يقتضي الاستعمال مظلة دائمة بدل سقف قابل للتعديل: يُختار نمط التغطية مشروعًا بمشروع، لا من قائمة جاهزة.'
      }
    }
  ],

  /**
   * Délai. La fourchette est publiée ENTIÈRE, toujours : le client a
   * explicitement demandé que 30 jours ne soit jamais présenté seul ni comme
   * un engagement. Le contrôle de build bloque « posé en 30 jours » et ses
   * variantes pour que la règle survive à une réécriture.
   */
  delay: {
    court: { fr: 'De 30 à 60 jours', ar: 'من 30 إلى 60 يومًا' },
    phrase: {
      fr: 'De 30 à 60 jours selon le carnet de commandes au moment de la commande.',
      ar: 'من 30 إلى 60 يومًا حسب حجم الطلبات وقت تأكيد الطلب.'
    }
  },

  /**
   * Visite et conception. Payantes avant engagement — c'est une information
   * commerciale que le client assume et qui filtre les demandes non sérieuses.
   * Aucun montant n'est publié : les chiffres cités dans le vocal ne sont pas
   * rattachés de façon sûre à ce qu'ils couvrent (CLIENT-BRIEF.md §2 ter).
   */
  study: {
    visite: {
      fr: 'La visite sur place est un service payant, facturé selon la localisation.',
      ar: 'المعاينة في الموقع خدمة بمقابل، تُحتسب حسب الموقع.'
    },
    conception: {
      fr: 'L’étude est payante avant engagement et dépend du métrage et de la nature du projet. Après signature, elle est reprise dans le contrat.',
      ar: 'الدراسة بمقابل قبل الالتزام وتتوقّف على المساحة وطبيعة المشروع. وبعد الإمضاء تُدرج ضمن العقد.'
    }
  },

  /** Villes déclarées sur Facebook. Aucune extension nationale. */
  areaServed: [
    { fr: 'Sousse', ar: 'سوسة' },
    { fr: 'Monastir', ar: 'المنستير' },
    { fr: 'Nabeul', ar: 'نابل' },
    { fr: 'Tunis', ar: 'تونس' },
    { fr: 'La Marsa', ar: 'المرسى' },
    { fr: 'Djerba', ar: 'جربة' },
    { fr: 'Sfax', ar: 'صفاقس' },
    { fr: 'Gabès', ar: 'قابس' },
    { fr: 'Médenine', ar: 'مدنين' },
    { fr: 'Tataouine', ar: 'تطاوين' }
  ],

  /** Lieux de réalisation explicitement observés dans les publications. */
  observedProjectPlaces: [
    { fr: 'Tabarka', ar: 'طبرقة' },
    { fr: 'La Marsa Nassim', ar: 'المرسى نسيم' },
    { fr: 'Jendouba', ar: 'جندوبة' }
  ],

  /**
   * Publics auxquels l'entreprise s'adresse, confirmés le 1er septembre 2026.
   * Ils servent le contenu et le balisage `audience`, jamais une statistique.
   */
  audiences: {
    fr: ['Particuliers', 'Villas', 'Entreprises', 'Architectes', 'Commerces', 'Restaurants', 'Espaces professionnels'],
    ar: ['الأفراد', 'الفيلات', 'المؤسسات', 'المهندسون المعماريون', 'المحلات التجارية', 'المطاعم', 'الفضاءات المهنية']
  },

  /**
   * Circuit de réception des demandes pendant la phase initiale.
   * L'URL publique d'un Google Form n'est pas un secret : elle est déjà
   * exposée par le site DCB. Aucune clé, aucun jeton, aucune donnée privée.
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
  anthracite: '#12171A',
  copper: '#B86F44',
  ivory: '#F4F0E8',
  sea: '#89AEC0',
  white: '#FFFFFF'
};

/**
 * Anciens numéros publics. Ils ne sont conservés que pour être INTERDITS :
 * le contrôle de build échoue si l'un d'eux réapparaît dans le HTML produit.
 */
export const RETIRED_PHONES = ['+216 99 447 993', '+21699447993', '+216 98 363 003', '+21698363003'];
