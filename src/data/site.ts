/**
 * Accès typé aux faits confirmés (`site.config.mjs`).
 *
 * Le contrôle ci-dessous s'exécute au build : une donnée NAP vide, un domaine
 * mal formé ou une ville retirée par erreur fait échouer `astro build` au lieu
 * de produire une page incohérente ou un JSON-LD incomplet.
 */
import { SITE as RAW, BRAND as RAW_BRAND, STUDIO as RAW_STUDIO } from './site.config.mjs';

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
  readonly city: string;
  readonly country: string;
  readonly countryCode: string;
  readonly inline: string;
}

export interface LeadFormConfig {
  readonly action: string;
  readonly entry: Readonly<Record<'name' | 'email' | 'phone' | 'service' | 'pack' | 'details', string>>;
  readonly servicePrefix: string;
  readonly packValue: string;
}

/** Une gamme confirmée par le client. Voir `CLIENT-BRIEF.md` §2 bis. */
export interface SiteRange {
  readonly key: 'bioclimatique' | 'toile' | 'fixe';
  readonly nom: string;
  readonly resume: string;
  readonly detail: string;
}

export interface SiteData {
  readonly origin: string;
  readonly locale: string;
  readonly lang: string;
  readonly lastReviewed: string;
  readonly name: string;
  readonly signature: string;
  readonly activity: string;
  readonly contact: SiteContact;
  readonly address: SiteAddress;
  readonly social: {
    readonly facebook: string;
    readonly facebookFollowers: number;
    readonly facebookFollowersLabel: string;
    readonly facebookObservedOn: string;
  };
  readonly responsePromise: string;
  readonly ranges: readonly SiteRange[];
  readonly delay: { readonly court: string; readonly phrase: string };
  readonly study: { readonly visite: string; readonly conception: string };
  readonly areaServed: readonly string[];
  readonly observedProjectPlaces: readonly string[];
  readonly leadForm: LeadFormConfig;
}

function required(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`site.config.mjs — champ obligatoire vide : ${path}`);
  }
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
required(site.address.inline, 'address.inline');
required(site.responsePromise, 'responsePromise');
if (!site.contact.phoneE164.startsWith('+216')) {
  throw new Error('site.config.mjs — le téléphone doit être au format E.164 tunisien.');
}
if (!site.contact.whatsappHref.includes(site.contact.phoneE164.replace('+', ''))) {
  throw new Error('site.config.mjs — WhatsApp et téléphone doivent porter le même numéro.');
}
if (
  !site.address.inline.includes(site.address.street) ||
  !site.address.inline.includes(site.address.city) ||
  !site.address.inline.includes(site.address.postalCode)
) {
  throw new Error('site.config.mjs — address.inline doit reprendre exactement le NAP.');
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
