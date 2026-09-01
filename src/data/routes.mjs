/**
 * Les routes du site — source unique, lisible par TypeScript ET par Node.
 * =======================================================================
 *
 * `src/data/pages.ts` et `src/data/catalogue.ts` s'en servent pour typer et
 * vérifier ce qu'ils déclarent; `scripts/audit-build.mjs` s'en sert pour savoir
 * ce qu'il doit trouver dans `dist/`. Sans ce fichier, la liste des routes
 * existerait en deux exemplaires — un en TypeScript, un dans le script de
 * contrôle — et le jour où l'une changerait sans l'autre, le contrôle
 * vérifierait un site qui n'existe plus.
 *
 * Il est en JavaScript simple pour la même raison que `site.config.mjs` : un
 * script Node doit pouvoir le lire sans compilation.
 */

/** Les deux langues, dans l'ordre de priorité. */
export const LOCALES = ['fr', 'ar'];

/** Langue par défaut : ses URL n'ont pas de préfixe. */
export const DEFAULT_LOCALE = 'fr';

/** Préfixe d'URL par langue. */
export const PREFIX = { fr: '', ar: '/ar' };

/** `hreflang` par langue. */
export const HREFLANG = { fr: 'fr-TN', ar: 'ar-TN' };

/** Routes qui ne viennent pas du catalogue des familles. */
export const STATIC_ROUTES = [
  '/',
  '/ouvrages-metalliques/',
  '/realisations/',
  '/a-propos/',
  '/zones-intervention/',
  '/contact/',
  '/politique-confidentialite/'
];

/**
 * Les onze familles d'ouvrages. Trois routes sont historiques et ne doivent
 * jamais changer : `/pergolas/`, `/verrieres/` et `/abris/` existaient avant
 * l'élargissement du périmètre du 1er septembre 2026 et peuvent déjà être
 * partagées ou indexées.
 */
export const FAMILY_ROUTES = [
  '/portes-metalliques/',
  '/portails-metalliques/',
  '/fenetres-grilles-metalliques/',
  '/garde-corps-rampes/',
  '/escaliers-metalliques/',
  '/pergolas/',
  '/abris/',
  '/clotures-palissades/',
  '/verrieres/',
  '/structures-metalliques/',
  '/mobilier-ferronnerie-artistique/'
];

/** Routes en place avant le 1er septembre 2026. Elles ne bougent plus. */
export const LEGACY_ROUTES = ['/pergolas/', '/verrieres/', '/abris/'];

/** Nombre d'ouvrages confirmés par le client (CLIENT-BRIEF §2 quater). */
export const PRODUCT_COUNT = 50;

/** Toutes les routes indexables, dans l'ordre de la navigation. */
export const ALL_ROUTES = [
  STATIC_ROUTES[0],
  STATIC_ROUTES[1],
  ...FAMILY_ROUTES,
  ...STATIC_ROUTES.slice(2)
];

/** Chemin réel d'une route dans une langue. */
export function localePath(route, locale) {
  if (locale === DEFAULT_LOCALE) return route;
  return route === '/' ? '/ar/' : `/ar${route}`;
}
