/**
 * Contrôle du build — Tunisie Pergola
 * ====================================
 * Ce script est la dernière barrière avant qu'une page ne parte en production.
 * Il lit le HTML réellement produit dans `dist/` — pas les sources — et refuse
 * le build si l'une des règles du dossier client est enfreinte.
 *
 * Il existe pour une raison précise : sur ce projet, la vérité factuelle est
 * une contrainte technique, pas une intention. Un adjectif ajouté six mois plus
 * tard par quelqu'un qui n'a pas lu le brief doit casser le build, pas se
 * retrouver en ligne.
 *
 * BILINGUE (1er septembre 2026)
 * Le site existe en français et en arabe. Trois conséquences ici :
 *   • les routes attendues sont doublées, et l'appariement `hreflang` entre les
 *     deux versions est vérifié dans les deux sens;
 *   • les affirmations interdites ont leurs motifs ARABES. Une garantie
 *     inventée en arabe est aussi fausse qu'en français, et le contrôle qui ne
 *     saurait la lire ne protégerait que la moitié du site;
 *   • la couverture des cinquante ouvrages est comptée dans chaque langue, et
 *     l'écriture de chaque libellé est contrôlée — un ouvrage resté en français
 *     dans la version arabe est une traduction oubliée, pas une variante.
 *
 *   node scripts/audit-build.mjs
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { SITE, STUDIO, RETIRED_PHONES } from '../src/data/site.config.mjs';
import {
  ALL_ROUTES,
  FAMILY_ROUTES,
  HREFLANG,
  LEGACY_ROUTES,
  LOCALES,
  PRODUCT_COUNT,
  localePath
} from '../src/data/routes.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const DIST = join(root, 'dist');

const problems = [];
/** Le numéro attendu dans chaque adresse `wa.me`, sans le `+`. */
const waNumber = SITE.contact.phoneE164.replace('+', '');
const notes = [];
const fail = (where, message) => problems.push(`${where} — ${message}`);

/* --------------------------------------------------------------------------
   Affirmations interdites — français
   Reprises une par une de « Informations interdites tant qu'elles ne sont pas
   confirmées » (CLIENT-BRIEF.md §3). Le motif est comparé au texte visible et
   aux attributs lisibles (alt, title, aria-label, meta).

   Trois motifs ont été LEVÉS le 27 août 2026 — « bioclimatique », l'aluminium
   et la motorisation. Un quatrième groupe l'a été le 1er septembre 2026 : le
   fer, la ferronnerie, la métallerie et les cinquante ouvrages confirmés. Rien
   n'a été supprimé à la légère : chaque levée a été remplacée par un motif plus
   étroit qui continue de bloquer la part NON confirmée. Le fer et le métal sont
   admis, l'acier et l'inox — que le client n'a jamais nommés — restent
   interdits; la fabrication est admise, l'atelier propriétaire reste bloqué.
   -------------------------------------------------------------------------- */
const FORBIDDEN_FR = [
  [/\binox\b|\bacier\b/i, 'alliage non confirmé (le client a nommé le fer, le métal, l’aluminium, la toile acrylique, le tube, la tôle et le panneau sandwich — pas l’acier ni l’inox)'],
  [/\bstores?\b/i, 'quatrième produit motorisé évoqué mais non intitulé (CLIENT-BRIEF §2 ter)'],
  [/(livr|pos|fabriqu|install|réalis)\w*\s+(en|sous)\s+\d+\s*jours?/i, 'délai présenté comme un engagement — publier la fourchette 30 à 60 jours'],
  [/\bgarantie?s?\b|\bgaranti[e]?\b/i, 'garantie non confirmée'],
  [/certifi[ée]|certification|norme\s+(nf|iso)|\blabel\s+(qualité|de)/i, 'certification ou norme non confirmée'],
  [/étanch[ée]it[ée]|\bétanche\b|résist(e|ance)\s+au\s+vent/i, 'performance technique non documentée'],
  [/devis\s+gratuit|\bgratuit(e|s)?\b/i, 'gratuité non confirmée'],
  [/€|\bTND\b|\bdinars?\b|\bDT\b(?!\s*>)|prix\s+au\s+m|à\s+partir\s+de\s+\d/i, 'tarif ou devise affichés'],
  [/\d+\s*(ans?|années?)\s+d[’']expérience|depuis\s+(19|20)\d\d/i, 'ancienneté non confirmée'],
  [/\d+\s*(projets?|chantiers?|clients?)\s+(réalisés?|satisfaits?|livrés?)/i, 'volume de projets non confirmé'],
  [/fabricat(ion|ion)\s+locale|fabriqué[es]?\s+en\s+Tunisie|notre\s+atelier|dans\s+nos\s+ateliers/i, 'atelier propriétaire non documenté'],
  [/horaires?\s+d[’']ouverture|ouvert\s+du\s+lundi|lun\.?\s*[–-]\s*ven/i, 'horaires non confirmés'],
  [/partout\s+en\s+Tunisie|toute\s+la\s+Tunisie|couverture\s+nationale/i, 'couverture nationale non déclarée'],
  [/paiement\s+en\s+\d|facilités?\s+de\s+paiement|acompte\s+de\s+\d/i, 'modalités de paiement non confirmées'],
  [/\bTODO\b|lorem\s+ipsum|placeholder|à\s+compléter|coming\s+soon|texte\s+d[ée]finitif/i, 'texte de remplissage'],
  [/\d+\s*(avis|étoiles?)|note\s+de\s+\d[,.]\d\s*\/\s*5/i, 'avis ou note inventés']
];

/* --------------------------------------------------------------------------
   Affirmations interdites — arabe
   Mêmes règles, autres mots. La liste n'est pas une traduction mécanique de la
   précédente : elle vise les tournures que l'arabe emploierait réellement pour
   dire la même chose.

   Un motif a été volontairement ÉCARTÉ : « ستائر » (stores). Le mot apparaît
   légitimement dans des textes alternatifs qui décrivent les volets roulants
   d'une façade photographiée; l'interdire bloquerait une description exacte au
   lieu d'une affirmation commerciale. Le produit non intitulé reste bloqué par
   son motif français, qui est celui du relevé client.
   -------------------------------------------------------------------------- */
const FORBIDDEN_AR = [
  [/فولاذ|ستانلس|إينوكس|الصلب المقاوم/, 'alliage non confirmé (acier ou inox)'],
  [/ضمان|كفالة/, 'garantie non confirmée'],
  [/شهادة مطابقة|معتمد رسمي|مواصفة إيزو|آيزو|أيزو/, 'certification ou norme non confirmée'],
  [/عازل للماء|مقاوم للرياح|إحكام ضدّ|مقاومة الرياح/, 'performance technique non documentée'],
  [/مجّان|مجاني|بالمجان|دراسة مجّانية/, 'gratuité non confirmée'],
  [/دينار|د\.ت|الأسعار|السعر|بالمتر المربّع|ابتداء من \d/, 'tarif ou devise affichés'],
  [/منذ (19|20)\d\d|\d+\s*(سنة|سنوات)\s*(من\s*)?الخبرة/, 'ancienneté non confirmée'],
  [/\d+\s*(مشروع|حريف|زبون|ورشة)\s*(منجز|راضٍ|مسلّم)/, 'volume de projets non confirmé'],
  [/ورشتنا|مصنعنا|معملنا/, 'atelier propriétaire non documenté'],
  [/أوقات العمل|مفتوح من الاثنين|ساعات الفتح/, 'horaires non confirmés'],
  [/كامل تونس|كلّ تونس|التراب التونسي كامل|تغطية وطنية/, 'couverture nationale non déclarée'],
  [/تقسيط|دفع على \d|تسبقة قدرها/, 'modalités de paiement non confirmées'],
  [/\d+\s*(تقييم|نجمة|نجوم)/, 'avis ou note inventés']
];

/** Routes attendues dans `dist/`, et leur indexabilité. */
const EXPECTED = [];
for (const locale of LOCALES) {
  for (const route of ALL_ROUTES) {
    const path = localePath(route, locale);
    const relPath = path === '/' ? 'index.html' : `${path.replace(/^\/|\/$/g, '')}/index.html`;
    EXPECTED.push({ relPath, path, route, locale, indexable: true });
  }
}
EXPECTED.push({ relPath: '404.html', path: '/404', route: '/404', locale: 'fr', indexable: false });

/**
 * Hôtes externes autorisés à apparaître dans le HTML produit.
 * L'hôte du studio est lu depuis `site.config.mjs` plutôt que recopié : si
 * l'adresse de la signature change, la liste blanche suit, et elle ne peut pas
 * autoriser un domaine différent de celui réellement posé dans le pied de page.
 */
const ALLOWED_HOSTS = [
  'tunisiepergola.tn',
  'docs.google.com', // circuit de réception DCB (adresse publique, aucun secret)
  'wa.me', // WhatsApp du numéro public
  'www.facebook.com', // page officielle
  'schema.org', // vocabulaire des données structurées
  STUDIO.host // signature du studio, pied de page
];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/** Texte lisible d'une page : contenu visible + attributs porteurs de sens. */
function readableText(html) {
  const attrs = [];
  for (const match of html.matchAll(/\s(?:alt|title|aria-label|content|placeholder)="([^"]*)"/g)) {
    attrs.push(match[1]);
  }
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  return decode(`${body} ${attrs.join(' ')}`).replace(/\s+/g, ' ');
}

function decode(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'");
}

function one(html, pattern) {
  const found = html.match(pattern);
  return found ? found[1] : null;
}

const ARABIC = /[؀-ۿ]/;
const LATIN = /[A-Za-zÀ-ÿ]/;

async function main() {
  try {
    await stat(DIST);
  } catch {
    fail('dist/', 'aucun build à contrôler — lancez `astro build` d’abord.');
    return report();
  }

  const files = await walk(DIST);
  const htmlFiles = files.filter((file) => file.endsWith('.html'));
  const titles = new Map();
  const descriptions = new Map();
  /** Libellés d'ouvrages relevés sur le hub, par langue. */
  const works = { fr: [], ar: [] };

  /* --- 1. Toutes les routes prévues existent ----------------------------- */
  for (const { relPath, path } of EXPECTED) {
    const full = join(DIST, ...relPath.split('/'));
    if (!files.includes(full)) fail(path, `page absente du build (${relPath})`);
  }

  const extra = htmlFiles.filter(
    (file) => !EXPECTED.some(({ relPath }) => join(DIST, ...relPath.split('/')) === file)
  );
  for (const file of extra) {
    fail(relative(DIST, file).split(sep).join('/'), 'page produite hors des routes autorisées');
  }

  // Les trois routes historiques ne doivent jamais disparaître : elles peuvent
  // déjà être partagées, indexées ou imprimées sur un document.
  for (const legacy of LEGACY_ROUTES) {
    if (!EXPECTED.some((entry) => entry.route === legacy && entry.locale === 'fr')) {
      fail(legacy, 'route historique retirée — elle doit rester servie');
    }
  }

  /* --- 2. Contrôles page par page ---------------------------------------- */
  for (const { relPath, path, route, locale, indexable } of EXPECTED) {
    const full = join(DIST, ...relPath.split('/'));
    if (!files.includes(full)) continue;
    const html = await readFile(full, 'utf8');
    const text = readableText(html);

    // Un seul H1
    const h1s = html.match(/<h1[\s>]/g) ?? [];
    if (h1s.length !== 1) fail(path, `${h1s.length} balise(s) H1 — il en faut exactement une`);

    // Titre et description
    const title = one(html, /<title>([^<]*)<\/title>/);
    const description = one(html, /<meta name="description" content="([^"]*)"/);
    if (!title) fail(path, 'balise <title> absente');
    if (!description) fail(path, 'meta description absente');
    if (title) {
      if (titles.has(title)) fail(path, `titre identique à ${titles.get(title)}`);
      titles.set(title, path);
    }
    if (description) {
      if (descriptions.has(description)) fail(path, `description identique à ${descriptions.get(description)}`);
      descriptions.set(description, path);
    }

    // Canonical absolue, sur le bon domaine ET sur son propre chemin : une
    // page arabe qui pointerait vers son équivalent français se retirerait
    // elle-même de l'index.
    const canonical = one(html, /<link rel="canonical" href="([^"]*)"/);
    const expectedCanonical = `${SITE.origin}${path}`;
    if (!canonical) fail(path, 'canonical absente');
    else if (canonical !== expectedCanonical) {
      fail(path, `canonical inattendue : ${canonical} au lieu de ${expectedCanonical}`);
    }

    // Indexabilité conforme
    const hasNoindex = /<meta name="robots"[^>]*noindex/i.test(html);
    if (indexable && hasNoindex) fail(path, 'page indexable marquée noindex');
    if (!indexable && !hasNoindex) fail(path, 'page non indexable sans meta robots noindex');

    // Langue et sens de lecture
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    if (!new RegExp(`<html lang="${locale}"`).test(html)) {
      fail(path, `attribut lang="${locale}" absent sur <html>`);
    }
    if (!new RegExp(`<html[^>]*dir="${dir}"`).test(html)) {
      fail(path, `attribut dir="${dir}" absent sur <html>`);
    }

    // Alternatives de langue — présence, réciprocité et x-default
    if (indexable) {
      for (const other of LOCALES) {
        const href = `${SITE.origin}${localePath(route, other)}`;
        const tag = new RegExp(
          `<link rel="alternate" hreflang="${HREFLANG[other]}" href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`
        );
        if (!tag.test(html)) fail(path, `alternative hreflang ${HREFLANG[other]} absente ou erronée`);
      }
      const xdefault = `${SITE.origin}${localePath(route, 'fr')}`;
      if (!html.includes(`hreflang="x-default" href="${xdefault}"`)) {
        fail(path, 'x-default absent ou ne pointant pas vers la version française');
      }
    }

    // NAP identique partout, dans la langue de la page
    if (!text.includes(SITE.contact.phoneDisplay)) fail(path, 'téléphone public absent');
    if (!text.includes(SITE.contact.email)) fail(path, 'e-mail public absent');
    if (!text.includes(SITE.address.inline[locale])) {
      fail(path, 'adresse publique absente ou reformulée');
    }
    /* Conversion : la page offre-t-elle un chemin ?
       Le site a été refait autour d'un canal unique — WhatsApp, avec le
       message déjà écrit. Une page qui perdrait son bouton de devis ne
       casserait rien de visible : elle cesserait simplement de convertir, en
       silence, jusqu’à ce que quelqu’un s’en aperçoive. Le contrôle rend cet
       oubli impossible. */
    const waLinks = [...html.matchAll(/href="https:\/\/wa\.me\/([^"?]+)(\?text=[^"]*)?"/g)];
    if (waLinks.length === 0) {
      fail(path, 'aucun lien WhatsApp — la page n’offre aucun chemin de conversion');
    }
    if (!waLinks.some((link) => link[2])) {
      fail(path, 'aucun lien WhatsApp avec message pré-rempli — un lien nu ouvre une conversation vide');
    }
    for (const link of waLinks) {
      if (link[1] !== waNumber) fail(path, `lien WhatsApp vers un autre numéro : ${link[1]}`);
    }

    // Les anciens numéros ne doivent plus exister nulle part.
    for (const retired of RETIRED_PHONES) {
      if (html.includes(retired)) fail(path, `ancien numéro encore présent : ${retired}`);
    }

    // Images : texte alternatif et dimensions réservées
    for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
      if (!/\salt="/.test(img)) fail(path, `image sans attribut alt : ${img.slice(0, 90)}`);
      if (!/\swidth="\d+"/.test(img) || !/\sheight="\d+"/.test(img)) {
        fail(path, `image sans dimensions réservées : ${img.slice(0, 90)}`);
      }
    }
    // Un texte alternatif français sur une page arabe est une traduction
    // oubliée : le lecteur d'écran arabophone entendrait du français.
    if (locale === 'ar') {
      for (const alt of html.matchAll(/<img\b[^>]*\salt="([^"]+)"/g)) {
        const value = decode(alt[1]);
        if (!ARABIC.test(value)) fail(path, `texte alternatif non traduit : « ${value.slice(0, 60)} »`);
      }
    }

    // Aucune valeur de style en ligne : la CSP peut rester stricte
    if (/\sstyle="/.test(html)) fail(path, 'attribut style= en ligne (incompatible avec la CSP)');

    // Aucun script en ligne autre que les données structurées
    for (const script of html.match(/<script\b[^>]*>/g) ?? []) {
      const isJsonLd = /type="application\/ld\+json"/.test(script);
      const isExternal = /\ssrc="/.test(script);
      if (!isJsonLd && !isExternal) fail(path, `script en ligne : ${script.slice(0, 80)}`);
    }

    // Hôtes externes
    for (const match of html.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) {
      const host = match[1].toLowerCase();
      if (!ALLOWED_HOSTS.includes(host)) fail(path, `hôte externe non autorisé : ${host}`);
    }

    // Données structurées : syntaxe et absence de champ inventé
    for (const block of html.matchAll(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
    )) {
      let parsed;
      try {
        parsed = JSON.parse(block[1]);
      } catch (error) {
        fail(path, `JSON-LD illisible : ${String(error).slice(0, 80)}`);
        continue;
      }
      const serialized = JSON.stringify(parsed);
      for (const key of ['priceRange', 'openingHours', 'aggregateRating', 'review', 'offers', 'makesOffer']) {
        if (serialized.includes(`"${key}"`)) fail(path, `JSON-LD contient « ${key} » — donnée non confirmée`);
      }
      if (path === '/' && !serialized.includes('"LocalBusiness"')) {
        fail(path, 'JSON-LD LocalBusiness absent de l’accueil');
      }
      if (serialized.includes('"telephone"') && !serialized.includes(SITE.contact.phoneE164)) {
        fail(path, 'téléphone du JSON-LD différent du NAP');
      }
      // Le LocalBusiness décrit l'ENTREPRISE : son adresse est celle de Sousse,
      // jamais celle de l'agence qui reçoit les demandes.
      if (serialized.includes('"LocalBusiness"')) {
        if (!serialized.includes(SITE.address.street)) {
          fail(path, 'LocalBusiness sans l’adresse physique de l’entreprise');
        }
        if (serialized.includes(SITE.intake.inline.fr) || serialized.includes(SITE.intake.inline.ar)) {
          fail(path, 'LocalBusiness portant l’adresse de l’agence au lieu de celle de l’entreprise');
        }
      }
    }

    // Affirmations interdites, dans la langue de la page
    for (const [pattern, why] of locale === 'ar' ? FORBIDDEN_AR : FORBIDDEN_FR) {
      const hit = text.match(pattern);
      if (hit) fail(path, `${why} — « ${hit[0]} »`);
    }

    // Le hub porte les cinquante ouvrages : on les relève ici pour les compter.
    if (route === '/ouvrages-metalliques/') {
      const list = html.match(/<ul class="tp-index-list__works"[^>]*>([\s\S]*?)<\/ul>/g) ?? [];
      for (const block of list) {
        for (const item of block.matchAll(/<li>([^<]+)<\/li>/g)) {
          works[locale].push(decode(item[1]).trim());
        }
      }
    }
  }

  /* --- 2 bis. Les cinquante ouvrages, dans les deux langues --------------- */
  for (const locale of LOCALES) {
    const found = works[locale];
    if (found.length !== PRODUCT_COUNT) {
      fail(
        `/ouvrages-metalliques/ [${locale}]`,
        `${found.length} ouvrages listés au lieu des ${PRODUCT_COUNT} confirmés par le client`
      );
    }
    const unique = new Set(found);
    if (unique.size !== found.length) {
      fail(`/ouvrages-metalliques/ [${locale}]`, 'un libellé d’ouvrage apparaît deux fois');
    }
    for (const label of found) {
      const written = locale === 'ar' ? ARABIC.test(label) : LATIN.test(label);
      if (!written) fail(`/ouvrages-metalliques/ [${locale}]`, `libellé non traduit : « ${label} »`);
    }
  }
  // Le même ouvrage ne peut pas porter le même libellé dans les deux écritures.
  const shared = works.fr.filter((label) => works.ar.includes(label));
  if (shared.length > 0) {
    fail('/ouvrages-metalliques/', `libellé identique en français et en arabe : « ${shared[0]} »`);
  }
  notes.push(`Catalogue : ${works.fr.length} ouvrages en français, ${works.ar.length} en arabe.`);

  /* --- 2 ter. Chaque famille est atteignable depuis chaque page ----------- */
  {
    const home = await readFile(join(DIST, 'index.html'), 'utf8');
    for (const familyRoute of FAMILY_ROUTES) {
      if (!home.includes(`href="${familyRoute}"`)) {
        fail('/', `la famille ${familyRoute} n’est atteignable depuis aucun lien de l’accueil`);
      }
    }
  }

  /* --- 3. Sitemap et robots ---------------------------------------------- */
  const sitemapFile = files.find((file) => file.endsWith('sitemap-0.xml'));
  if (!sitemapFile) fail('sitemap', 'sitemap-0.xml absent du build');
  else {
    const sitemap = await readFile(sitemapFile, 'utf8');
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    for (const { path, indexable } of EXPECTED) {
      const expected = `${SITE.origin}${path}`;
      const present = urls.includes(expected);
      if (indexable && !present) fail('sitemap', `route absente : ${path}`);
      if (!indexable && present) fail('sitemap', `route non indexable présente : ${path}`);
    }
    for (const url of urls) {
      if (!url.startsWith(`${SITE.origin}/`)) fail('sitemap', `URL hors domaine canonique : ${url}`);
    }
    // Sitemap bilingue : chaque URL doit annoncer son équivalent.
    for (const hreflang of Object.values(HREFLANG)) {
      if (!sitemap.includes(`hreflang="${hreflang}"`)) {
        fail('sitemap', `aucune alternative ${hreflang} — le sitemap n’est pas bilingue`);
      }
    }
  }

  const robotsPath = join(DIST, 'robots.txt');
  if (!files.includes(robotsPath)) fail('robots.txt', 'absent du build');
  else {
    const robots = await readFile(robotsPath, 'utf8');
    if (!robots.includes(`${SITE.origin}/sitemap-index.xml`)) {
      fail('robots.txt', 'la ligne Sitemap ne pointe pas vers le domaine canonique');
    }
  }

  /* --- 3 bis. La CSP déclarée est-elle tenable par ce build ? --------------
     On ne se contente pas d'écrire une CSP stricte : on vérifie que le HTML
     produit la respecte encore. Les deux déclarations d'en-têtes doivent en
     outre rester identiques, sinon l'hébergeur choisi déciderait du niveau de
     sécurité. */
  const headersPath = join(DIST, '_headers');
  let csp = '';
  if (!files.includes(headersPath)) {
    fail('_headers', 'absent du build — aucune politique de sécurité livrée');
  } else {
    const headers = await readFile(headersPath, 'utf8');
    csp = (headers.match(/Content-Security-Policy:\s*(.+)/) ?? [])[1]?.trim() ?? '';
    if (!csp) fail('_headers', 'aucune Content-Security-Policy déclarée');

    const required = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'"
    ];
    for (const directive of required) {
      if (!csp.includes(directive)) fail('_headers', `directive manquante : ${directive}`);
    }
    if (/unsafe-eval|unsafe-inline/.test(csp)) {
      fail('_headers', 'la CSP contient unsafe-eval ou unsafe-inline');
    }
    if (!/form-action[^;]*docs\.google\.com/.test(csp)) {
      fail('_headers', 'form-action n’autorise pas l’envoi du formulaire sans JavaScript');
    }
    if (!/connect-src[^;]*docs\.google\.com/.test(csp)) {
      fail('_headers', 'connect-src n’autorise pas l’envoi du formulaire en JavaScript');
    }

    const vercel = JSON.parse(await readFile(join(root, 'vercel.json'), 'utf8'));
    const vercelCsp = vercel.headers
      ?.flatMap((rule) => rule.headers)
      .find((header) => header.key === 'Content-Security-Policy')?.value;
    if (vercelCsp !== csp) {
      fail('vercel.json', 'la CSP diffère de celle de `_headers`');
    }
  }

  // `style-src 'self'` sans 'unsafe-inline' interdit `<style>` ET `style=`.
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    const route = relative(DIST, file).split(sep).join('/');
    if (/<style[\s>]/i.test(html)) fail(route, '<style> en ligne — incompatible avec la CSP déclarée');
    if (/\son[a-z]+=["']/i.test(html)) fail(route, 'gestionnaire d’évènement en ligne (onclick, onload…)');
  }

  /* --- 4. Budgets ---------------------------------------------------------
     Le budget CSS est passé de 90 à 118 Ko le 1er septembre 2026. Ce n'est pas
     un assouplissement de confort : le site porte désormais onze familles
     d'ouvrages, une planche de motifs, un panneau de navigation déployé et une
     seconde direction de lecture. Le budget JavaScript, lui, n'a pas bougé —
     et il ne devait pas : rien de tout cela n'est du script. */
  const css = files.filter((file) => file.endsWith('.css'));
  const js = files.filter((file) => file.endsWith('.js'));
  const fonts = files.filter((file) => file.endsWith('.woff2'));
  let cssBytes = 0;
  let jsBytes = 0;
  let fontBytes = 0;
  for (const file of css) cssBytes += (await stat(file)).size;
  for (const file of js) jsBytes += (await stat(file)).size;
  for (const file of fonts) fontBytes += (await stat(file)).size;
  notes.push(
    `CSS total ${(cssBytes / 1024).toFixed(1)} Ko · JavaScript total ${(jsBytes / 1024).toFixed(1)} Ko · fontes ${(fontBytes / 1024).toFixed(1)} Ko (non compressés)`
  );
  if (jsBytes > 40 * 1024) fail('performance', `budget JavaScript dépassé : ${(jsBytes / 1024).toFixed(1)} Ko > 40 Ko`);
  if (cssBytes > 118 * 1024) fail('performance', `budget CSS dépassé : ${(cssBytes / 1024).toFixed(1)} Ko > 118 Ko`);

  /* --- 5. Aucune image originale non recadrée publiée --------------------- */
  const leaked = files.filter((file) => /facebook-\d+\.jpg$|facebook-page-cover\.jpg$/.test(file));
  for (const file of leaked) {
    fail('assets', `original Facebook publié tel quel : ${relative(DIST, file).split(sep).join('/')}`);
  }

  report();
}

function report() {
  for (const note of notes) console.log(`  · ${note}`);
  if (problems.length === 0) {
    console.log(`\n✓ Contrôle du build : ${EXPECTED.length} routes conformes, deux langues.`);
    return;
  }
  console.error(`\n✗ ${problems.length} problème(s) :`);
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
