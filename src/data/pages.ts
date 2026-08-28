/**
 * Carte des routes — titres, descriptions, fil d'Ariane, navigation.
 *
 * Une seule intention par page et un seul mot-clé principal par page : la
 * répartition ci-dessous évite que l'accueil, `/pergolas/` et `/realisations/`
 * se disputent la même requête.
 *
 * L'unicité des titres et des descriptions est vérifiée à l'évaluation du
 * module, donc au build : deux pages ne peuvent pas partir en production avec
 * la même balise.
 *
 * Aucun contact n'est écrit en dur ici : une description qui recopie le
 * numéro le fige au jour où elle a été écrite, et le jour où la ligne change
 * la balise ment sans que rien ne le signale. Elle le LIT donc de la source
 * unique, comme le reste du site.
 */
import { SITE } from './site.config.mjs';

export type RoutePath =
  | '/'
  | '/a-propos/'
  | '/pergolas/'
  | '/verrieres/'
  | '/abris/'
  | '/realisations/'
  | '/zones-intervention/'
  | '/contact/'
  | '/politique-confidentialite/'
  | '/404';

export interface PageMeta {
  /** Balise `<title>` complète. */
  readonly title: string;
  /** `<meta name="description">` — 120 à 165 caractères. */
  readonly description: string;
  /** Libellé court, utilisé par le fil d'Ariane et la navigation. */
  readonly label: string;
  /** Intention de recherche principale, une seule par page. */
  readonly intent: string;
  /** Route parente pour le fil d'Ariane. `null` sur l'accueil. */
  readonly parent: RoutePath | null;
  /** `false` retire la page du sitemap et ajoute `noindex`. */
  readonly indexable: boolean;
}

export const PAGES = {
  '/': {
    title: 'Tunisie Pergola — pergolas, verrières et abris | Sousse et régions',
    description:
      'Conception, fourniture et pose de pergolas, verrières, abris et abris de jardin. Basée à Sousse, Tunisie Pergola intervient dans plusieurs régions de Tunisie.',
    label: 'Accueil',
    intent: 'pergola Tunisie',
    parent: null,
    indexable: true
  },
  '/a-propos/': {
    title: 'À propos — Tunisie Pergola, conception et pose à Sousse',
    description:
      'Comment Tunisie Pergola travaille : partir du lieu, de ses usages et de sa lumière, puis concevoir, fournir et poser la structure. Implantation à Sousse.',
    label: 'À propos',
    intent: 'installateur pergola Sousse',
    parent: '/',
    indexable: true
  },
  '/pergolas/': {
    title: 'Pergola sur mesure en Tunisie — adossée ou indépendante',
    description:
      'Pergolas adossées ou indépendantes pour terrasses, jardins, rooftops et abords de piscine. Conception, fourniture et pose par Tunisie Pergola, basée à Sousse.',
    label: 'Pergolas',
    intent: 'pergola sur mesure Tunisie',
    parent: '/',
    indexable: true
  },
  '/verrieres/': {
    title: 'Verrières en Tunisie — couvrir et séparer avec la lumière',
    description:
      'Verrières de couverture et de séparation, étudiées selon l’espace, la lumière et l’usage attendu. Conception, fourniture et pose par Tunisie Pergola.',
    label: 'Verrières',
    intent: 'verrière Tunisie',
    parent: '/',
    indexable: true
  },
  '/abris/': {
    title: 'Abris et abris de jardin en Tunisie — auvents et couvertures',
    description:
      'Abris, abris de jardin et auvents d’entrée conçus pour protéger un usage et s’intégrer à l’existant. Conception, fourniture et pose par Tunisie Pergola.',
    label: 'Abris',
    intent: 'abri jardin Tunisie',
    parent: '/',
    indexable: true
  },
  '/realisations/': {
    title: 'Réalisations — pergolas, auvents et chantiers de pose',
    description:
      'Structures terminées, détails de sous-face et étapes de pose photographiés sur les chantiers de Tunisie Pergola. Galerie filtrable, légendes factuelles.',
    label: 'Réalisations',
    intent: 'réalisations pergola Tunisie',
    parent: '/',
    indexable: true
  },
  '/zones-intervention/': {
    title: 'Zones d’intervention — Sousse, Tunis, Sfax, Djerba et plus',
    description:
      'Tunisie Pergola est basée à Sousse et intervient à Monastir, Nabeul, Tunis, La Marsa, Djerba, Sfax, Gabès, Médenine et Tataouine. Adresse et contacts directs.',
    label: 'Zones d’intervention',
    intent: 'pergola Sousse zones',
    parent: '/',
    indexable: true
  },
  '/contact/': {
    title: 'Contact — décrire votre projet, réponse sous 24 heures',
    description: `Décrivez le lieu, les dimensions approximatives et l’usage recherché. Réponse sous 24 heures. Téléphone et WhatsApp au ${SITE.contact.phoneDisplay}, e-mail et adresse.`,
    label: 'Contact',
    intent: 'contact Tunisie Pergola',
    parent: '/',
    indexable: true
  },
  '/politique-confidentialite/': {
    title: 'Politique de confidentialité — Tunisie Pergola',
    description:
      'Quelles données le formulaire de projet collecte, à quoi elles servent, qui les reçoit et comment demander leur suppression. Rédigée sur le traitement réel.',
    label: 'Politique de confidentialité',
    intent: 'politique de confidentialité',
    parent: '/',
    indexable: true
  },
  '/404': {
    title: 'Page introuvable — Tunisie Pergola',
    description:
      'Cette adresse ne correspond à aucune page du site. Rejoignez les réalisations, les services ou le contact de Tunisie Pergola.',
    label: 'Page introuvable',
    intent: '',
    parent: '/',
    indexable: false
  }
} as const satisfies Record<RoutePath, PageMeta>;

// --- Contrôles au build ------------------------------------------------------
{
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const [path, meta] of Object.entries(PAGES)) {
    if (titles.has(meta.title)) {
      throw new Error(`pages.ts — titre dupliqué sur ${path} : « ${meta.title} »`);
    }
    if (descriptions.has(meta.description)) {
      throw new Error(`pages.ts — description dupliquée sur ${path}`);
    }
    if (meta.title.length > 70) {
      throw new Error(`pages.ts — titre trop long (${meta.title.length}) sur ${path}`);
    }
    if (meta.description.length < 110 || meta.description.length > 175) {
      throw new Error(
        `pages.ts — description hors gabarit (${meta.description.length}) sur ${path}`
      );
    }
    titles.add(meta.title);
    descriptions.add(meta.description);
  }
}

export function meta(path: RoutePath): PageMeta {
  return PAGES[path];
}

/** Chaîne du fil d'Ariane, de l'accueil à la page courante. */
export function trail(path: RoutePath): { path: RoutePath; label: string }[] {
  const chain: { path: RoutePath; label: string }[] = [];
  let current: RoutePath | null = path;
  while (current) {
    const page: PageMeta = PAGES[current];
    chain.unshift({ path: current, label: page.label });
    current = page.parent;
  }
  return chain;
}

/* --------------------------------------------------------------------------
   Navigation
   Minimale par intention : la marque, les preuves, les services, l'entreprise,
   le contact, et un seul appel à l'action.
   -------------------------------------------------------------------------- */

export interface NavLink {
  readonly href: RoutePath;
  readonly label: string;
}

export const SERVICE_LINKS: readonly NavLink[] = [
  { href: '/pergolas/', label: 'Pergolas' },
  { href: '/verrieres/', label: 'Verrières' },
  { href: '/abris/', label: 'Abris' }
];

export const PRIMARY_LINKS: readonly NavLink[] = [
  { href: '/realisations/', label: 'Réalisations' },
  { href: '/a-propos/', label: 'À propos' },
  { href: '/contact/', label: 'Contact' }
];

/** Menu mobile : tout est à plat, rien n'est caché derrière un déploiement. */
export const MOBILE_LINKS: readonly NavLink[] = [
  { href: '/realisations/', label: 'Réalisations' },
  ...SERVICE_LINKS,
  { href: '/a-propos/', label: 'À propos' },
  { href: '/zones-intervention/', label: 'Zones d’intervention' },
  { href: '/contact/', label: 'Contact' }
];

export const FOOTER_SERVICES: readonly NavLink[] = SERVICE_LINKS;

export const FOOTER_SITE: readonly NavLink[] = [
  { href: '/realisations/', label: 'Réalisations' },
  { href: '/a-propos/', label: 'À propos' },
  { href: '/zones-intervention/', label: 'Zones d’intervention' },
  { href: '/contact/', label: 'Contact' },
  { href: '/politique-confidentialite/', label: 'Politique de confidentialité' }
];
