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
 *   node scripts/audit-build.mjs
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { SITE, STUDIO } from '../src/data/site.config.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const DIST = join(root, 'dist');

const problems = [];
const notes = [];
const fail = (where, message) => problems.push(`${where} — ${message}`);

/* --------------------------------------------------------------------------
   Affirmations interdites
   Reprises une par une de « Informations interdites tant qu'elles ne sont pas
   confirmées » (CLIENT-BRIEF.md §3). Le motif est comparé au texte visible et
   aux attributs lisibles (alt, title, aria-label, meta).

   Trois motifs ont été LEVÉS le 27 août 2026 — « bioclimatique », l'aluminium
   et la motorisation — parce que le client les a confirmés de vive voix
   (CLIENT-BRIEF.md §2 bis). Ils n'ont pas été supprimés à la légère : chacun a
   été remplacé par un motif plus étroit qui continue de bloquer la part NON
   confirmée. L'aluminium est admis, l'acier et l'inox restent interdits; la
   motorisation est admise, le quatrième produit motorisé — « probablement des
   stores », intitulé non établi — reste bloqué; le délai est admis en
   fourchette, jamais comme un engagement.
   -------------------------------------------------------------------------- */
const FORBIDDEN = [
  [/\binox\b|\bacier\b/i, 'matériau non confirmé (seuls aluminium, toile acrylique, tube, tôle et panneau sandwich le sont)'],
  [/\bstores?\b/i, 'quatrième produit motorisé évoqué mais non intitulé (CLIENT-BRIEF §2 ter)'],
  [/(livr|pos|fabriqu|install|réalis)\w*\s+(en|sous)\s+\d+\s*jours?/i, 'délai présenté comme un engagement — publier la fourchette 30 à 60 jours'],
  [/\bgarantie?s?\b|\bgaranti[e]?\b/i, 'garantie non confirmée'],
  [/certifi[ée]|certification|norme\s+(nf|iso)|\blabel\s+(qualité|de)/i, 'certification ou norme non confirmée'],
  [/étanch[ée]it[ée]|\bétanche\b|résist(e|ance)\s+au\s+vent/i, 'performance technique non documentée'],
  [/devis\s+gratuit|\bgratuit(e|s)?\b/i, 'gratuité non confirmée'],
  [/€|\bTND\b|\bdinars?\b|\bDT\b(?!\s*>)|prix\s+au\s+m|à\s+partir\s+de\s+\d/i, 'tarif ou devise affichés'],
  [/\d+\s*(ans?|années?)\s+d[’']expérience|depuis\s+(19|20)\d\d/i, 'ancienneté non confirmée'],
  [/\d+\s*(projets?|chantiers?|clients?)\s+(réalisés?|satisfaits?|livrés?)/i, 'volume de projets non confirmé'],
  [/fabricat(ion|ion)\s+locale|fabriqué[es]?\s+en\s+Tunisie|notre\s+atelier|dans\s+nos\s+ateliers/i, 'fabrication ou atelier non documentés'],
  [/horaires?\s+d[’']ouverture|ouvert\s+du\s+lundi|lun\.?\s*[–-]\s*ven/i, 'horaires non confirmés'],
  [/partout\s+en\s+Tunisie|toute\s+la\s+Tunisie|couverture\s+nationale/i, 'couverture nationale non déclarée'],
  [/paiement\s+en\s+\d|facilités?\s+de\s+paiement|acompte\s+de\s+\d/i, 'modalités de paiement non confirmées'],
  [/\bTODO\b|lorem\s+ipsum|placeholder|à\s+compléter|coming\s+soon|texte\s+d[ée]finitif/i, 'texte de remplissage'],
  [/\d+\s*(avis|étoiles?)|note\s+de\s+\d[,.]\d\s*\/\s*5/i, 'avis ou note inventés']
];

/** Routes attendues dans `dist/`, et leur indexabilité. */
const EXPECTED = [
  ['index.html', '/', true],
  ['a-propos/index.html', '/a-propos/', true],
  ['pergolas/index.html', '/pergolas/', true],
  ['verrieres/index.html', '/verrieres/', true],
  ['abris/index.html', '/abris/', true],
  ['realisations/index.html', '/realisations/', true],
  ['zones-intervention/index.html', '/zones-intervention/', true],
  ['contact/index.html', '/contact/', true],
  ['politique-confidentialite/index.html', '/politique-confidentialite/', true],
  ['404.html', '/404', false]
];

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

  /* --- 1. Toutes les routes prévues existent ----------------------------- */
  for (const [relPath, route] of EXPECTED) {
    const full = join(DIST, ...relPath.split('/'));
    if (!files.includes(full)) fail(route, `page absente du build (${relPath})`);
  }

  const extra = htmlFiles.filter(
    (file) => !EXPECTED.some(([relPath]) => join(DIST, ...relPath.split('/')) === file)
  );
  for (const file of extra) {
    fail(relative(DIST, file).split(sep).join('/'), 'page produite hors des routes autorisées');
  }

  /* --- 2. Contrôles page par page ---------------------------------------- */
  for (const [relPath, route, indexable] of EXPECTED) {
    const full = join(DIST, ...relPath.split('/'));
    if (!files.includes(full)) continue;
    const html = await readFile(full, 'utf8');
    const text = readableText(html);

    // Un seul H1
    const h1s = html.match(/<h1[\s>]/g) ?? [];
    if (h1s.length !== 1) fail(route, `${h1s.length} balise(s) H1 — il en faut exactement une`);

    // Titre et description
    const title = one(html, /<title>([^<]*)<\/title>/);
    const description = one(html, /<meta name="description" content="([^"]*)"/);
    if (!title) fail(route, 'balise <title> absente');
    if (!description) fail(route, 'meta description absente');
    if (title) {
      if (titles.has(title)) fail(route, `titre identique à ${titles.get(title)}`);
      titles.set(title, route);
    }
    if (description) {
      if (descriptions.has(description)) fail(route, `description identique à ${descriptions.get(description)}`);
      descriptions.set(description, route);
    }

    // Canonical absolue sur le bon domaine
    const canonical = one(html, /<link rel="canonical" href="([^"]*)"/);
    if (!canonical) fail(route, 'canonical absente');
    else if (!canonical.startsWith(`${SITE.origin}/`)) {
      fail(route, `canonical hors domaine canonique : ${canonical}`);
    }

    // Indexabilité conforme
    const hasNoindex = /<meta name="robots"[^>]*noindex/i.test(html);
    if (indexable && hasNoindex) fail(route, 'page indexable marquée noindex');
    if (!indexable && !hasNoindex) fail(route, 'page non indexable sans meta robots noindex');

    // Langue
    if (!/<html lang="fr"/.test(html)) fail(route, 'attribut lang="fr" absent sur <html>');

    // NAP identique partout
    if (!text.includes(SITE.contact.phoneDisplay)) fail(route, 'téléphone public absent');
    if (!text.includes(SITE.contact.email)) fail(route, 'e-mail public absent');
    if (!text.includes(SITE.address.inline)) fail(route, 'adresse publique absente ou reformulée');

    // Images : texte alternatif et dimensions réservées
    for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
      if (!/\salt="/.test(img)) fail(route, `image sans attribut alt : ${img.slice(0, 90)}`);
      if (!/\swidth="\d+"/.test(img) || !/\sheight="\d+"/.test(img)) {
        fail(route, `image sans dimensions réservées : ${img.slice(0, 90)}`);
      }
      if (/\salt=""/.test(img)) {
        notes.push(`${route} — image décorative avec alt vide (voulu ?) : ${img.slice(0, 70)}`);
      }
    }

    // Aucune valeur de style en ligne : la CSP peut rester stricte
    if (/\sstyle="/.test(html)) fail(route, 'attribut style= en ligne (incompatible avec la CSP)');

    // Aucun script en ligne autre que les données structurées
    for (const script of html.match(/<script\b[^>]*>/g) ?? []) {
      const isJsonLd = /type="application\/ld\+json"/.test(script);
      const isExternal = /\ssrc="/.test(script);
      if (!isJsonLd && !isExternal) fail(route, `script en ligne : ${script.slice(0, 80)}`);
    }

    // Hôtes externes
    for (const match of html.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) {
      const host = match[1].toLowerCase();
      if (!ALLOWED_HOSTS.includes(host)) fail(route, `hôte externe non autorisé : ${host}`);
    }

    // Données structurées : syntaxe et absence de champ inventé
    for (const block of html.matchAll(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
    )) {
      let parsed;
      try {
        parsed = JSON.parse(block[1]);
      } catch (error) {
        fail(route, `JSON-LD illisible : ${String(error).slice(0, 80)}`);
        continue;
      }
      const serialized = JSON.stringify(parsed);
      for (const key of ['priceRange', 'openingHours', 'aggregateRating', 'review', 'offers', 'makesOffer']) {
        if (serialized.includes(`"${key}"`)) fail(route, `JSON-LD contient « ${key} » — donnée non confirmée`);
      }
      if (route === '/' && !serialized.includes('"LocalBusiness"')) {
        fail(route, 'JSON-LD LocalBusiness absent de l’accueil');
      }
      if (serialized.includes('"telephone"') && !serialized.includes(SITE.contact.phoneE164)) {
        fail(route, 'téléphone du JSON-LD différent du NAP');
      }
    }

    // Affirmations interdites
    for (const [pattern, why] of FORBIDDEN) {
      const hit = text.match(pattern);
      if (hit) fail(route, `${why} — « ${hit[0]} »`);
    }
  }

  /* --- 3. Sitemap et robots ---------------------------------------------- */
  const sitemapFile = files.find((file) => file.endsWith('sitemap-0.xml'));
  if (!sitemapFile) fail('sitemap', 'sitemap-0.xml absent du build');
  else {
    const sitemap = await readFile(sitemapFile, 'utf8');
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    for (const [, route, indexable] of EXPECTED) {
      const expected = new URL(route, `${SITE.origin}/`).href;
      const present = urls.includes(expected);
      if (indexable && !present) fail('sitemap', `route absente : ${route}`);
      if (!indexable && present) fail('sitemap', `route non indexable présente : ${route}`);
    }
    for (const url of urls) {
      if (!url.startsWith(`${SITE.origin}/`)) fail('sitemap', `URL hors domaine canonique : ${url}`);
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

  /* --- 4. Poids de la page d'accueil -------------------------------------- */
  const css = files.filter((file) => file.endsWith('.css'));
  const js = files.filter((file) => file.endsWith('.js'));
  let cssBytes = 0;
  let jsBytes = 0;
  for (const file of css) cssBytes += (await stat(file)).size;
  for (const file of js) jsBytes += (await stat(file)).size;
  notes.push(`CSS total ${(cssBytes / 1024).toFixed(1)} Ko · JavaScript total ${(jsBytes / 1024).toFixed(1)} Ko (non compressés)`);
  if (jsBytes > 40 * 1024) fail('performance', `budget JavaScript dépassé : ${(jsBytes / 1024).toFixed(1)} Ko > 40 Ko`);
  if (cssBytes > 90 * 1024) fail('performance', `budget CSS dépassé : ${(cssBytes / 1024).toFixed(1)} Ko > 90 Ko`);

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
    console.log(`\n✓ Contrôle du build : ${EXPECTED.length} routes conformes.`);
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
