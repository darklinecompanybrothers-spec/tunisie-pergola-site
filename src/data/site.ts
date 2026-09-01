/**
 * Accès typé aux faits confirmés (`site.config.mjs`).
 *
 * Le contrôle ci-dessous s'exécute au build : une donnée NAP vide, un domaine
 * mal formé, une traduction manquante ou une ville retirée par erreur fait
 * échouer `astro build` au lieu de produire une page incohérente ou un JSON-LD
 * incomplet.
 */
import { SITE as RAW, BRAND as RAW_BRAND, STUDIO as RAW_STUDIO, RETIRED_PHONES as RAW_RETIRED } from './site.config.mjs';
import { LOCALES, type Bilingual, type Locale } from '../i18n/locales';

export interface SiteContact {
  readonly phoneE164: string;
  readonly phoneDisplay: string;
  readonly phoneHref: string;
  readonly whatsappHref: string;
  readonly email: string;
  readonly emailHref: string;
}

export interface SiteAddress {
  readonly street: string;
  readonly postalCode: string;
  readonly city: Bilingual;
  readonly country: Bilingual;
  readonly countryCode: string;
  readonly inline: Bilingual;
}

export interface SiteIntake {
  readonly operator: string;
  readonly inline: Bilingual;
}

export interface LeadFormConfig {
  readonly action: string;
  readonly entry: Readonly<Record<'name' | 'email' | 'phone' | 'service' | 'pack' | 'details', string>>;
  readonly servicePrefix: string;
  readonly packValue: string;
}

/** Une gamme de couverture confirmée par le client. Voir `CLIENT-BRIEF.md` §2 bis. */
export interface SiteRange {
  readonly key: 'bioclimatique' | 'toile' | 'fixe';
  readonly nom: Bilingual;
  readonly resume: Bilingual;
  readonly detail: Bilingual;
}

export interface SiteData {
  readonly origin: string;
  readonly lastReviewed: string;
  readonly name: string;
  readonly signature: Bilingual;
  readonly activity: Bilingual;
  readonly positioning: Bilingual;
  readonly journey: Bilingual<readonly string[]>;
  readonly contact: SiteContact;
  /** Adresse PHYSIQUE de Tunisie Pergola — la seule du `LocalBusiness`. */
  readonly address: SiteAddress;
  /** Agence qui reçoit et traite les demandes. Jamais une adresse d'entreprise. */
  readonly intake: SiteIntake;
  /** Ville d'implantation — jamais une coordonnée de contact. */
  readonly baseCity: Bilingual;
  readonly social: {
    readonly facebook: string;
    readonly facebookFollowers: number;
    readonly facebookFollowersLabel: Bilingual;
    readonly facebookObservedOn: Bilingual;
  };
  readonly responsePromise: Bilingual;
  readonly ranges: readonly SiteRange[];
  readonly delay: { readonly court: Bilingual; readonly phrase: Bilingual };
  readonly study: { readonly visite: Bilingual; readonly conception: Bilingual };
  readonly areaServed: readonly Bilingual[];
  readonly observedProjectPlaces: readonly Bilingual[];
  readonly audiences: Bilingual<readonly string[]>;
  readonly leadForm: LeadFormConfig;
}

function required(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`site.config.mjs — champ obligatoire vide : ${path}`);
  }
  return value;
}

/** Une valeur bilingue est complète, ou le build s'arrête. */
function bilingual(value: Bilingual | undefined, path: string): Bilingual {
  if (!value) throw new Error(`site.config.mjs — valeur bilingue absente : ${path}`);
  for (const locale of LOCALES) required(value[locale], `${path}.${locale}`);
  return value;
}

const site = RAW as unknown as SiteData;

// --- Contrôles de cohérence exécutés au build -------------------------------
if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/.test(site.origin) || site.origin.endsWith('/')) {
  throw new Error(`site.config.mjs — origin invalide : ${site.origin}`);
}
required(site.name, 'name');
required(site.contact.phoneDisplay, 'contact.phoneDisplay');
required(site.contact.email, 'contact.email');
bilingual(site.address.inline, 'address.inline');
bilingual(site.address.city, 'address.city');
bilingual(site.intake.inline, 'intake.inline');
bilingual(site.baseCity, 'baseCity');
bilingual(site.responsePromise, 'responsePromise');
bilingual(site.activity, 'activity');
bilingual(site.positioning, 'positioning');
bilingual(site.signature, 'signature');
for (const [index, city] of site.areaServed.entries()) bilingual(city, `areaServed[${index}]`);
for (const [index, place] of site.observedProjectPlaces.entries()) {
  bilingual(place, `observedProjectPlaces[${index}]`);
}
for (const range of site.ranges) {
  bilingual(range.nom, `ranges.${range.key}.nom`);
  bilingual(range.resume, `ranges.${range.key}.resume`);
  bilingual(range.detail, `ranges.${range.key}.detail`);
}
for (const locale of LOCALES) {
  if (site.journey[locale].length !== 5) {
    throw new Error(`site.config.mjs — journey.${locale} doit compter les cinq temps du parcours.`);
  }
  if (site.audiences[locale].length !== site.audiences.fr.length) {
    throw new Error(`site.config.mjs — audiences.${locale} n’a pas le même nombre d’entrées que le français.`);
  }
}

// La ville d'implantation doit figurer dans les zones desservies : une
// entreprise qui n'interviendrait pas là où elle est implantée signalerait
// une donnée périmée, pas une stratégie.
if (!site.areaServed.some((city) => city.fr === site.baseCity.fr)) {
  throw new Error(`site.config.mjs — baseCity (${site.baseCity.fr}) doit figurer dans areaServed.`);
}
// Et l'adresse physique doit être DANS la ville d'implantation : c'est ce qui
// garantit que le `LocalBusiness` décrit bien l'entreprise, et non l'agence.
if (site.address.city.fr !== site.baseCity.fr) {
  throw new Error(
    `site.config.mjs — address.city (${site.address.city.fr}) et baseCity (${site.baseCity.fr}) divergent : le LocalBusiness ne décrirait plus l’entreprise.`
  );
}
if (!site.contact.phoneE164.startsWith('+216')) {
  throw new Error('site.config.mjs — le téléphone doit être au format E.164 tunisien.');
}
if (!site.contact.whatsappHref.includes(site.contact.phoneE164.replace('+', ''))) {
  throw new Error('site.config.mjs — WhatsApp et téléphone doivent porter le même numéro.');
}
// Le numéro affiché et le numéro technique sont le même nombre écrit deux fois.
if (site.contact.phoneDisplay.replace(/\s/g, '') !== site.contact.phoneE164) {
  throw new Error('site.config.mjs — phoneDisplay et phoneE164 ne désignent pas le même numéro.');
}
if (
  !site.address.inline.fr.includes(site.address.street) ||
  !site.address.inline.fr.includes(site.address.city.fr) ||
  !site.address.inline.fr.includes(site.address.postalCode)
) {
  throw new Error('site.config.mjs — address.inline.fr doit reprendre exactement le NAP.');
}
if (site.areaServed.length === 0) {
  throw new Error('site.config.mjs — areaServed ne peut pas être vide.');
}
for (const key of ['name', 'email', 'phone', 'service', 'pack', 'details'] as const) {
  if (!/^entry\.\d+$/.test(site.leadForm.entry[key])) {
    throw new Error(`site.config.mjs — identifiant de champ invalide : leadForm.entry.${key}`);
  }
}

export const SITE: SiteData = site;

/** Anciens numéros, conservés pour être interdits dans le HTML produit. */
export const RETIRED_PHONES: readonly string[] = RAW_RETIRED as readonly string[];

// Un ancien numéro qui redeviendrait le numéro courant serait un retour en
// arrière silencieux : le contrôle l'attrape ici, avant même le build des pages.
if (RETIRED_PHONES.includes(site.contact.phoneE164) || RETIRED_PHONES.includes(site.contact.phoneDisplay)) {
  throw new Error('site.config.mjs — le numéro public figure dans la liste des numéros retirés.');
}

export interface StudioData {
  readonly name: string;
  readonly href: string;
  readonly host: string;
}

const studio = RAW_STUDIO as StudioData;

// L'adresse du studio est le seul lien sortant qui ne soit ni le client ni le
// circuit de réception : elle doit rester absolue, en HTTPS, et l'hôte déclaré
// doit être exactement celui du lien — c'est lui que le contrôle de build
// compare à sa liste blanche.
if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}\/?$/.test(studio.href)) {
  throw new Error(`site.config.mjs — STUDIO.href invalide : ${studio.href}`);
}
if (new URL(studio.href).host !== studio.host) {
  throw new Error(
    `site.config.mjs — STUDIO.host (${studio.host}) ne correspond pas à STUDIO.href (${studio.href}).`
  );
}
required(studio.name, 'STUDIO.name');

export const STUDIO: StudioData = studio;

export const BRAND = RAW_BRAND as Readonly<Record<'anthracite' | 'copper' | 'ivory' | 'sea' | 'white', string>>;

/** URL absolue à partir d'un chemin interne (`/contact/`). */
export function absolute(path: string): string {
  return new URL(path, `${SITE.origin}/`).href;
}

/** Identifiant stable de l'entité de marque, unique sur tout le site. */
export const ENTITY_ID = `${SITE.origin}/#tunisie-pergola`;

/** Villes desservies, dans une langue. */
export function areaServed(locale: Locale): readonly string[] {
  return SITE.areaServed.map((city) => city[locale]);
}
