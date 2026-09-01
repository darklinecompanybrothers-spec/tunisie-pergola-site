/**
 * Carte des routes — titres, descriptions, fil d'Ariane, navigation.
 * ==================================================================
 *
 * Une seule intention de recherche par page, dans les deux langues : la
 * répartition ci-dessous évite que l'accueil, le hub des ouvrages et les onze
 * familles se disputent la même requête.
 *
 * L'unicité des titres et des descriptions est vérifiée à l'évaluation du
 * module, donc au build, LANGUE PAR LANGUE : deux pages françaises ne peuvent
 * pas partir avec la même balise, et deux pages arabes non plus. En revanche
 * un titre français et un titre arabe n'ont évidemment aucune raison de se
 * ressembler — ils ne sont pas comparés entre eux.
 *
 * Aucun contact n'est écrit en dur ici : une description qui recopie le
 * numéro le fige au jour où elle a été écrite, et le jour où la ligne change
 * la balise ment sans que rien ne le signale. Elle le LIT donc de la source
 * unique, comme le reste du site.
 */
import { SITE } from './site.config.mjs';
import { FAMILIES, type Family } from './catalogue';
import { LOCALES, type Bilingual, type Locale } from '../i18n/locales';
import { STATIC_ROUTES as SHARED_STATIC_ROUTES } from './routes.mjs';

/**
 * Routes qui ne viennent pas du catalogue.
 *
 * La liste vit dans routes.mjs — le script de contrôle du build, qui est en
 * JavaScript, doit lire exactement la même. Le contrôle ci-dessous vérifie que
 * les deux ne se sont pas désynchronisées.
 */
const STATIC_ROUTES = [
  '/',
  '/ouvrages-metalliques/',
  '/realisations/',
  '/a-propos/',
  '/zones-intervention/',
  '/contact/',
  '/politique-confidentialite/',
  '/404'
] as const;

{
  const shared = SHARED_STATIC_ROUTES as readonly string[];
  const declared = STATIC_ROUTES.filter((route) => route !== '/404');
  if (shared.length !== declared.length || shared.some((route, index) => route !== declared[index])) {
    throw new Error(
      'pages.ts — les routes fixes ne correspondent plus à celles de routes.mjs, que lit le contrôle de build.'
    );
  }
}

export type StaticRoute = (typeof STATIC_ROUTES)[number];
export type FamilyRoute = Family['route'];
export type RoutePath = StaticRoute | FamilyRoute;

export interface PageMeta {
  /** Balise `<title>` complète. */
  readonly title: string;
  /** `<meta name="description">`. */
  readonly description: string;
  /** Libellé court, utilisé par le fil d'Ariane et la navigation. */
  readonly label: string;
  /** Route parente pour le fil d'Ariane. `null` sur l'accueil. */
  readonly parent: RoutePath | null;
  /** `false` retire la page du sitemap et ajoute `noindex`. */
  readonly indexable: boolean;
}

/** Intention de recherche principale — une seule par route, en français. */
export const INTENT: Readonly<Record<RoutePath, string>> = {
  '/': 'ferronnerie métallerie Tunisie',
  '/ouvrages-metalliques/': 'ouvrages métalliques sur mesure Tunisie',
  '/portes-metalliques/': 'porte métallique Tunisie',
  '/portails-metalliques/': 'portail métallique Tunisie',
  '/fenetres-grilles-metalliques/': 'grille de sécurité fenêtre Tunisie',
  '/garde-corps-rampes/': 'garde-corps métallique Tunisie',
  '/escaliers-metalliques/': 'escalier métallique Tunisie',
  '/pergolas/': 'pergola sur mesure Tunisie',
  '/abris/': 'abri de jardin Tunisie',
  '/clotures-palissades/': 'clôture métallique Tunisie',
  '/verrieres/': 'verrière Tunisie',
  '/structures-metalliques/': 'charpente métallique Tunisie',
  '/mobilier-ferronnerie-artistique/': 'ferronnerie artistique Tunisie',
  '/realisations/': 'réalisations ferronnerie Tunisie',
  '/a-propos/': 'ferronnier métallier Sousse',
  '/zones-intervention/': 'métallerie Sousse zones',
  '/contact/': 'contact Tunisie Pergola',
  '/politique-confidentialite/': 'politique de confidentialité',
  '/404': ''
};

/* --------------------------------------------------------------------------
   Métadonnées des onze familles
   Elles vivent ici et non dans `catalogue.ts` : le catalogue porte le contenu
   lu par un visiteur, cette carte porte ce que lit un moteur. Les deux
   changent pour des raisons différentes.
   -------------------------------------------------------------------------- */
const FAMILY_META: Readonly<Record<string, Bilingual<{ title: string; description: string }>>> = {
  portes: {
    fr: {
      title: 'Portes métalliques sur mesure en Tunisie — fer forgé, blindées',
      description:
        'Portes métalliques sur mesure : entrée, blindée, coulissante, battante, industrielle, de garage, sectionnelle ou basculante. Conception, fabrication et pose.'
    },
    ar: {
      title: 'أبواب معدنية حسب الطلب في تونس — حديد مطاوع ومصفّحة',
      description:
        'أبواب معدنية حسب الطلب: مداخل ومصفّحة ومنزلقة ومفصلية وصناعية وأبواب مرآب وقطاعية وقلّابة. تصميم وتصنيع وتركيب انطلاقًا من سوسة نحو عدّة جهات.'
    }
  },
  portails: {
    fr: {
      title: 'Portail métallique en Tunisie — coulissant, battant, automatique',
      description:
        'Portails métalliques et en fer forgé, coulissants, battants ou préparés pour une motorisation. Conception, fabrication et pose par Tunisie Pergola.'
    },
    ar: {
      title: 'بوابات معدنية في تونس — منزلقة ومفصلية وأوتوماتيكية',
      description:
        'بوابات معدنية ومن الحديد المطاوع، منزلقة أو مفصلية أو مهيّأة للفتح الآلي. تصميم وتصنيع وتركيب من طرف تونيزي برغولا، ومقرّها سوسة.'
    }
  },
  fenetres: {
    fr: {
      title: 'Fenêtres métalliques et grilles de sécurité en Tunisie',
      description:
        'Châssis métalliques sur mesure, fenêtres en fer forgé, grilles de fenêtres et grilles de sécurité métalliques. Relevé sur place, fabrication et pose.'
    },
    ar: {
      title: 'نوافذ معدنية وقضبان حماية في تونس',
      description:
        'أطر معدنية حسب الطلب، ونوافذ من الحديد المطاوع، وقضبان حماية للنوافذ وشبكات أمان معدنية. قياس في الموقع، ثمّ تصنيع وتركيب.'
    }
  },
  'garde-corps': {
    fr: {
      title: 'Garde-corps métallique en Tunisie — balcon, escalier, rampes',
      description:
        'Garde-corps de balcon, de terrasse et d’escalier, rampes métalliques et rampes en fer forgé. Relevé sur place, fabrication sur mesure et pose.'
    },
    ar: {
      title: 'درابزين معدني في تونس — شرفات وسلالم ومساند',
      description:
        'درابزين شرفات وأسطح وسلالم، ومساند يد معدنية ومن الحديد المطاوع. قياس في الموقع، وتصنيع حسب الطلب، ثمّ تركيب على عين المكان.'
    }
  },
  escaliers: {
    fr: {
      title: 'Escalier métallique en Tunisie — droit, hélicoïdal, de secours',
      description:
        'Escaliers métalliques droits, hélicoïdaux et escaliers de secours. La hauteur, l’emprise au sol et le passage libre décident du projet avant le style.'
    },
    ar: {
      title: 'سلالم معدنية في تونس — مستقيمة وحلزونية وطوارئ',
      description:
        'سلالم معدنية مستقيمة وحلزونية وسلالم طوارئ. الارتفاع والمساحة على الأرض والمرور الحرّ تحدّد المشروع قبل الشكل. تصنيع وتركيب.'
    }
  },
  pergolas: {
    fr: {
      title: 'Pergola sur mesure en Tunisie — adossée ou indépendante',
      description:
        'Pergolas adossées ou indépendantes pour terrasses, jardins, rooftops et abords de piscine. Conception, fabrication et pose par Tunisie Pergola, à Sousse.'
    },
    ar: {
      title: 'برغولا حسب الطلب في تونس — ملاصقة أو مستقلّة',
      description:
        'برغولات ملاصقة أو مستقلّة للشرفات والحدائق والأسطح وحافّات المسابح. تصميم وتصنيع وتركيب من طرف تونيزي برغولا، ومقرّها سوسة.'
    }
  },
  abris: {
    fr: {
      title: 'Abris, auvents et carports métalliques en Tunisie',
      description:
        'Auvents d’entrée, abris de jardin, abris de voiture, carports et marquises métalliques. Conception, fabrication et pose sur un lieu déjà aménagé.'
    },
    ar: {
      title: 'مظلات وسقائف ومواقف سيارات معدنية في تونس',
      description:
        'مظلات مداخل ومظلات حدائق ومظلات سيارات ومواقف مغطّاة وسقائف معدنية. تصميم وتصنيع وتركيب داخل فضاء مهيّأ سلفًا.'
    }
  },
  clotures: {
    fr: {
      title: 'Clôture métallique en Tunisie — palissades et cloisons',
      description:
        'Clôtures métalliques et en fer forgé, palissades et cloisons. Le tracé, le dénivelé et le degré d’occultation se décident au relevé, sur le terrain.'
    },
    ar: {
      title: 'أسيجة معدنية في تونس — حواجز وفواصل',
      description:
        'أسيجة معدنية ومن الحديد المطاوع، وحواجز وفواصل. التخطيط وفوارق المناسيب ودرجة الحجب تُحسم عند القياس في الأرض نفسها.'
    }
  },
  verrieres: {
    fr: {
      title: 'Verrières en Tunisie — couvrir et séparer avec la lumière',
      description:
        'Verrières de couverture et cloisons vitrées, étudiées selon l’espace, la lumière et l’usage attendu. Conception, fabrication et pose par Tunisie Pergola.'
    },
    ar: {
      title: 'أسقف زجاجية في تونس — تغطية وفصل بالضوء',
      description:
        'أسقف زجاجية بهيكل معدني للتغطية، وفواصل زجاجية للتقسيم، تُدرَس حسب الفضاء والضوء والاستعمال المنتظر. تصميم وتصنيع وتركيب.'
    }
  },
  structures: {
    fr: {
      title: 'Charpente et structure métallique en Tunisie — hangars',
      description:
        'Structures et charpentes métalliques, hangars et mezzanines. Le dimensionnement se mène avec les intervenants du projet, avant toute fabrication.'
    },
    ar: {
      title: 'هياكل وبناء معدني في تونس — مستودعات وميزانين',
      description:
        'هياكل معدنية وهياكل حاملة ومستودعات وميزانين. يُنجَز تحديد الأبعاد مع متدخّلي المشروع قبل أيّ تصنيع، ثمّ يأتي التركيب.'
    }
  },
  mobilier: {
    fr: {
      title: 'Mobilier métallique et ferronnerie artistique en Tunisie',
      description:
        'Tables, bancs, étagères et mobilier métallique sur mesure, décoration et ferronnerie artistique. Une contrainte de dimension avant un objet de style.'
    },
    ar: {
      title: 'أثاث معدني وحدادة فنية في تونس',
      description:
        'طاولات ومقاعد ورفوف وأثاث معدني حسب الطلب، وديكور وحدادة فنية. إكراه أبعاد قبل أن تكون القطعة موضوع ذوق. تصنيع وتركيب.'
    }
  }
};

/* --------------------------------------------------------------------------
   Métadonnées des routes fixes
   -------------------------------------------------------------------------- */
const STATIC_META: Readonly<
  Record<StaticRoute, Bilingual<{ title: string; description: string; label: string }>>
> = {
  '/': {
    fr: {
      title: 'Tunisie Pergola — ferronnerie et métallerie sur mesure',
      description:
        'Conception, fabrication et pose d’ouvrages métalliques sur mesure : portes, portails, garde-corps, escaliers, pergolas, verrières, abris. Basée à Sousse.',
      label: 'Accueil'
    },
    ar: {
      title: 'تونيزي برغولا — حدادة ومعدنية حسب الطلب',
      description:
        'تصميم وتصنيع وتركيب أشغال حديدية ومعدنية حسب الطلب: أبواب وبوابات ودرابزين وسلالم وبرغولات وأسقف زجاجية ومظلات. مقرّها سوسة.',
      label: 'الرئيسية'
    }
  },
  '/ouvrages-metalliques/': {
    fr: {
      title: 'Ouvrages métalliques sur mesure — onze familles, 50 ouvrages',
      description:
        'Le savoir-faire complet : portes, portails, fenêtres, garde-corps, escaliers, pergolas, abris, clôtures, verrières, structures et mobilier métallique.',
      label: 'Ouvrages métalliques'
    },
    ar: {
      title: 'أشغال معدنية حسب الطلب — إحدى عشرة عائلة و50 شغلًا',
      description:
        'كامل الاختصاص: أبواب وبوابات ونوافذ ودرابزين وسلالم وبرغولات ومظلات وأسيجة وأسقف زجاجية وهياكل وأثاث معدني حسب الطلب.',
      label: 'الأشغال المعدنية'
    }
  },
  '/realisations/': {
    fr: {
      title: 'Réalisations — structures posées et chantiers photographiés',
      description:
        'Structures terminées, détails de sous-face et étapes de pose photographiés sur les chantiers de Tunisie Pergola. Galerie filtrable, légendes factuelles.',
      label: 'Réalisations'
    },
    ar: {
      title: 'الإنجازات — هياكل مركّبة وورشات مصوّرة',
      description:
        'هياكل مكتملة وتفاصيل من تحت الأسقف ومراحل تركيب مصوّرة في ورشات تونيزي برغولا. معرض قابل للتصفية بتعليقات وصفية فقط.',
      label: 'الإنجازات'
    }
  },
  '/a-propos/': {
    fr: {
      title: 'L’entreprise — ferronnerie et métallerie à Sousse',
      description:
        'Comment Tunisie Pergola travaille : partir du lieu et de ses usages, puis concevoir, fabriquer, finir, livrer et poser. Implantation à Sousse.',
      label: 'L’entreprise'
    },
    ar: {
      title: 'المؤسسة — حدادة ومعدنية في سوسة',
      description:
        'كيف تشتغل تونيزي برغولا: الانطلاق من المكان واستعمالاته، ثمّ التصميم والتصنيع والتشطيب والتسليم والتركيب. مقرّ النشاط في سوسة.',
      label: 'المؤسسة'
    }
  },
  '/zones-intervention/': {
    fr: {
      title: 'Zones d’intervention — Sousse, Tunis, Sfax, Djerba et plus',
      description:
        'Tunisie Pergola est basée à Sousse et intervient à Monastir, Nabeul, Tunis, La Marsa, Djerba, Sfax, Gabès, Médenine et Tataouine. Adresse et contacts.',
      label: 'Zones d’intervention'
    },
    ar: {
      title: 'مناطق التدخّل — سوسة وتونس وصفاقس وجربة وغيرها',
      description:
        'مقرّ تونيزي برغولا بسوسة، وتتدخّل في المنستير ونابل وتونس والمرسى وجربة وصفاقس وقابس ومدنين وتطاوين. العنوان ووسائل الاتصال.',
      label: 'مناطق التدخّل'
    }
  },
  '/contact/': {
    fr: {
      title: 'Contact — décrire votre projet, réponse sous 24 heures',
      description: `Choisissez la famille et l’ouvrage, décrivez le lieu et les dimensions approximatives. Réponse sous 24 heures. Téléphone et WhatsApp au ${SITE.contact.phoneDisplay}.`,
      label: 'Contact'
    },
    ar: {
      title: 'اتصال — صف مشروعك، وردّ في غضون 24 ساعة',
      description: `اختر العائلة والشغل، وصف المكان والأبعاد التقريبية. ردّ في غضون 24 ساعة. الهاتف وواتساب على الرقم ${SITE.contact.phoneDisplay}.`,
      label: 'اتصال'
    }
  },
  '/politique-confidentialite/': {
    fr: {
      title: 'Politique de confidentialité — Tunisie Pergola',
      description:
        'Quelles données le formulaire de projet collecte, à quoi elles servent, qui les reçoit et comment demander leur suppression. Rédigée sur le traitement réel.',
      label: 'Politique de confidentialité'
    },
    ar: {
      title: 'سياسة الخصوصية — تونيزي برغولا',
      description:
        'ما تجمعه استمارة المشروع من بيانات، وفيم تُستعمل، ومن يتلقّاها، وكيف يُطلب حذفها. كُتبت انطلاقًا من المعالجة الفعلية لا من نموذج جاهز.',
      label: 'سياسة الخصوصية'
    }
  },
  '/404': {
    fr: {
      title: 'Page introuvable — Tunisie Pergola',
      description:
        'Cette adresse ne correspond à aucune page du site. Rejoignez les ouvrages métalliques, les réalisations ou le contact de Tunisie Pergola.',
      label: 'Page introuvable'
    },
    ar: {
      title: 'الصفحة غير موجودة — تونيزي برغولا',
      description:
        'هذا العنوان لا يوافق أيّ صفحة من الموقع. انتقل إلى الأشغال المعدنية أو إلى الإنجازات أو إلى صفحة الاتصال بتونيزي برغولا.',
      label: 'الصفحة غير موجودة'
    }
  }
};

/** Parent de chaque route fixe. Les familles descendent toutes du hub. */
const STATIC_PARENT: Readonly<Record<StaticRoute, RoutePath | null>> = {
  '/': null,
  '/ouvrages-metalliques/': '/',
  '/realisations/': '/',
  '/a-propos/': '/',
  '/zones-intervention/': '/',
  '/contact/': '/',
  '/politique-confidentialite/': '/',
  '/404': '/'
};

/* --------------------------------------------------------------------------
   Assemblage
   -------------------------------------------------------------------------- */
function build(locale: Locale): Record<RoutePath, PageMeta> {
  const map = {} as Record<RoutePath, PageMeta>;

  for (const route of STATIC_ROUTES) {
    const meta = STATIC_META[route][locale];
    map[route] = {
      title: meta.title,
      description: meta.description,
      label: meta.label,
      parent: STATIC_PARENT[route],
      indexable: route !== '/404'
    };
  }

  for (const family of FAMILIES) {
    const meta = FAMILY_META[family.key];
    if (!meta) throw new Error(`pages.ts — métadonnées absentes pour la famille ${family.key}`);
    map[family.route] = {
      title: meta[locale].title,
      description: meta[locale].description,
      label: family.nom[locale],
      parent: '/ouvrages-metalliques/',
      indexable: true
    };
  }

  return map;
}

export const PAGES: Readonly<Record<Locale, Record<RoutePath, PageMeta>>> = {
  fr: build('fr'),
  ar: build('ar')
};

/** Toutes les routes du site, dans l'ordre de la navigation. */
export const ALL_ROUTES: readonly RoutePath[] = [
  '/',
  '/ouvrages-metalliques/',
  ...FAMILIES.map((family) => family.route),
  '/realisations/',
  '/a-propos/',
  '/zones-intervention/',
  '/contact/',
  '/politique-confidentialite/',
  '/404'
];

// --- Contrôles au build ------------------------------------------------------
{
  // Les descriptions arabes sont plus courtes à information égale : l'écriture
  // arabe porte davantage par caractère. Le gabarit n'est donc pas le même.
  const BOUNDS: Record<Locale, { min: number; max: number }> = {
    fr: { min: 110, max: 175 },
    ar: { min: 80, max: 175 }
  };

  for (const locale of LOCALES) {
    const titles = new Map<string, RoutePath>();
    const descriptions = new Map<string, RoutePath>();
    for (const route of ALL_ROUTES) {
      const meta = PAGES[locale][route];
      if (titles.has(meta.title)) {
        throw new Error(`pages.ts [${locale}] — titre dupliqué sur ${route} et ${titles.get(meta.title)}`);
      }
      if (descriptions.has(meta.description)) {
        throw new Error(
          `pages.ts [${locale}] — description dupliquée sur ${route} et ${descriptions.get(meta.description)}`
        );
      }
      if (meta.title.length > 70) {
        throw new Error(`pages.ts [${locale}] — titre trop long (${meta.title.length}) sur ${route}`);
      }
      const bounds = BOUNDS[locale];
      if (meta.description.length < bounds.min || meta.description.length > bounds.max) {
        throw new Error(
          `pages.ts [${locale}] — description hors gabarit (${meta.description.length}) sur ${route}`
        );
      }
      titles.set(meta.title, route);
      descriptions.set(meta.description, route);
    }
  }

  // Une intention par route, et aucune intention partagée : c'est la règle qui
  // empêche deux pages de se disputer la même requête.
  const intents = new Map<string, RoutePath>();
  for (const route of ALL_ROUTES) {
    const intent = INTENT[route];
    if (!intent) continue;
    if (intents.has(intent)) {
      throw new Error(`pages.ts — intention partagée par ${route} et ${intents.get(intent)} : « ${intent} »`);
    }
    intents.set(intent, route);
  }
}

export function meta(route: RoutePath, locale: Locale): PageMeta {
  return PAGES[locale][route];
}

/** Chaîne du fil d'Ariane, de l'accueil à la page courante. */
export function trail(route: RoutePath, locale: Locale): { path: RoutePath; label: string }[] {
  const chain: { path: RoutePath; label: string }[] = [];
  let current: RoutePath | null = route;
  while (current) {
    const page: PageMeta = PAGES[locale][current];
    chain.unshift({ path: current, label: page.label });
    current = page.parent;
  }
  return chain;
}

/* --------------------------------------------------------------------------
   Navigation
   Onze familles ne tiennent pas dans une barre horizontale : elles vivent dans
   un panneau déployé, et la barre ne porte que quatre entrées.
   -------------------------------------------------------------------------- */

export interface NavLink {
  readonly href: RoutePath;
  readonly label: Bilingual;
}

/** Entrées de la barre, hors panneau des familles. */
export const PRIMARY_LINKS: readonly RoutePath[] = ['/realisations/', '/a-propos/', '/contact/'];

/** Menu mobile : tout est à plat, rien n'est caché derrière un déploiement. */
export const MOBILE_LINKS: readonly RoutePath[] = [
  '/ouvrages-metalliques/',
  '/realisations/',
  '/a-propos/',
  '/zones-intervention/',
  '/contact/'
];

export const FOOTER_SITE: readonly RoutePath[] = [
  '/ouvrages-metalliques/',
  '/realisations/',
  '/a-propos/',
  '/zones-intervention/',
  '/contact/',
  '/politique-confidentialite/'
];
