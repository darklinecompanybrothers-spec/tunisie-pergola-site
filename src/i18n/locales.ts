/**
 * Les deux langues du site.
 * =========================
 *
 * Le français est la langue par défaut : ses URL sont celles qui existent
 * depuis la première version et elles ne bougent pas. L'arabe vit sous le
 * préfixe `/ar/`, avec exactement la même arborescence — un chemin français
 * et son équivalent arabe ne diffèrent que par ce préfixe.
 *
 * POURQUOI LE SLUG RESTE FRANÇAIS SOUS `/ar/`
 * Un slug arabe serait percent-encodé dans toutes les URL (`/ar/%D8%A3%D8%A8…`),
 * illisible dans un partage WhatsApp — le premier canal du client — et
 * fragile au copier-coller. Le contenu, lui, est intégralement en arabe : c'est
 * lui que les moteurs lisent. La correspondance entre les deux versions reste
 * donc calculable sans table, ce qui rend le `hreflang`, le sitemap et le
 * sélecteur de langue impossibles à désynchroniser.
 *
 * Aucune redirection automatique n'existe : ni par IP, ni par en-tête
 * `Accept-Language`. Le visiteur choisit, et son choix est une vraie
 * navigation vers une vraie URL.
 */

export const LOCALES = ['fr', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'fr';

export interface LocaleInfo {
  /** Valeur de l'attribut `lang` sur `<html>`. */
  readonly htmlLang: string;
  /** Valeur de l'attribut `dir` sur `<html>`. */
  readonly dir: 'ltr' | 'rtl';
  /** Valeur `hreflang`, ciblée sur la Tunisie. */
  readonly hreflang: string;
  /** `og:locale`. */
  readonly ogLocale: string;
  /** Nom de la langue dans sa propre écriture — pour le sélecteur. */
  readonly nativeName: string;
  /** Code court affiché dans le sélecteur. */
  readonly short: string;
  /** Préfixe d'URL, vide pour la langue par défaut. */
  readonly prefix: string;
}

export const LOCALE_INFO: Readonly<Record<Locale, LocaleInfo>> = {
  fr: {
    htmlLang: 'fr',
    dir: 'ltr',
    hreflang: 'fr-TN',
    ogLocale: 'fr_TN',
    nativeName: 'Français',
    short: 'FR',
    prefix: ''
  },
  ar: {
    htmlLang: 'ar',
    dir: 'rtl',
    hreflang: 'ar-TN',
    ogLocale: 'ar_TN',
    nativeName: 'العربية',
    short: 'ع',
    prefix: '/ar'
  }
};

/** Une chaîne écrite dans les deux langues. Le type refuse une traduction oubliée. */
export type Bilingual<T = string> = Readonly<Record<Locale, T>>;

/** Lit la variante d'une valeur bilingue. */
export function t<T>(value: Bilingual<T>, locale: Locale): T {
  return value[locale];
}

/**
 * URL d'une route dans une langue donnée.
 * `route` est toujours le chemin FRANÇAIS canonique (`/contact/`).
 */
export function localePath(route: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return route;
  return route === '/' ? '/ar/' : `/ar${route}`;
}

/**
 * Langue d'un chemin réel. Sert au sélecteur de langue et aux composants qui
 * ne reçoivent pas la langue en propriété.
 */
export function localeOf(pathname: string): Locale {
  return pathname === '/ar' || pathname.startsWith('/ar/') ? 'ar' : 'fr';
}

/** Le chemin français canonique correspondant à un chemin réel. */
export function routeOf(pathname: string): string {
  if (pathname === '/ar' || pathname === '/ar/') return '/';
  return pathname.startsWith('/ar/') ? pathname.slice(3) : pathname;
}
