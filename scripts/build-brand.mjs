/**
 * Fabrique des fichiers de marque — Tunisie Pergola
 * =================================================
 * Toutes les variantes sont générées depuis la géométrie unique de
 * `src/data/brand-marks.mjs`. Aucun PNG de concept n'est agrandi ni vectorisé :
 * les rasters produits ici (favicon, icône iOS, image de partage) sont des
 * rendus du vecteur, pas l'inverse.
 *
 *   node scripts/build-brand.mjs
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import sharp from 'sharp';
import {
  MARK_VIEWBOX,
  MARK_UNIT,
  markColor,
  markMono,
  drawText,
  WORDMARK_TEXT
} from '../src/data/brand-marks.mjs';
import { BRAND, SITE } from '../src/data/site.config.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const BRAND_DIR = join(root, 'public', 'brand');
const PUBLIC_DIR = join(root, 'public');
const COVER = join(root, 'src', 'assets', 'photos', 'derived', 'pergola-anthracite-independante-terrasse.jpg');

const wordmark = drawText(WORDMARK_TEXT);

/** Dimensions du symbole, lues sur son `viewBox` — jamais réécrites à la main. */
const [MARK_W, MARK_H] = MARK_VIEWBOX.split(' ').slice(2).map(Number);
/** Zone de protection : l'épaisseur d'un poteau, sur les quatre côtés. */
const PAD = MARK_UNIT;

const NS = 'xmlns="http://www.w3.org/2000/svg"';
const CREDIT = `<!-- Tunisie Pergola — identité v1, proposition DCB à valider. Dessin original. -->`;

/** Symbole seul, dans un `viewBox` propre et avec un titre accessible. */
function symbolFile({ ink, mode }) {
  const body = mode === 'mono' ? markMono(ink) : markColor({ structure: BRAND.anthracite, lames: BRAND.copper });
  return `<svg ${NS} viewBox="${MARK_VIEWBOX}" role="img" aria-labelledby="t">
${CREDIT}
<title id="t">Tunisie Pergola — monogramme TP</title>
${body}
</svg>
`;
}

/**
 * Lockup vertical : symbole, puis mot-symbole centré sous lui.
 * La zone de protection vaut l'épaisseur d'un poteau (`MARK_UNIT`).
 */
function verticalLockup(ink) {
  // Rapports relevés sur l'affiche du concept : le mot-symbole vaut 1,374 fois
  // la largeur du symbole, et l'intervalle 0,184 fois sa hauteur.
  const wmW = MARK_W * 1.374;
  const scale = wmW / wordmark.width;
  const wmH = wordmark.height * scale;
  const gap = round(MARK_H * 0.184);
  const width = round(Math.max(MARK_W, wmW) + PAD * 2);
  const height = round(MARK_H + gap + wmH + PAD * 2);
  return `<svg ${NS} viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="t">
${CREDIT}
<title id="t">Tunisie Pergola</title>
<g color="${ink}">
<g transform="translate(${round((width - MARK_W) / 2)} ${PAD})">${markMono('currentColor')}</g>
<g transform="translate(${round((width - wmW) / 2)} ${round(PAD + MARK_H + gap)}) scale(${round(scale)})">${wordmark.markup}</g>
</g>
</svg>
`;
}

/** Lockup horizontal : symbole à gauche, mot-symbole aligné sur l'axe optique. */
function horizontalLockup(ink) {
  const wmH = MARK_H * 0.3;
  const scale = wmH / wordmark.height;
  const wmW = wordmark.width * scale;
  const gap = round(MARK_W * 0.17);
  const width = round(MARK_W + gap + wmW + PAD * 2);
  const height = round(MARK_H + PAD * 2);
  return `<svg ${NS} viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="t">
${CREDIT}
<title id="t">Tunisie Pergola</title>
<g color="${ink}">
<g transform="translate(${PAD} ${PAD})">${markMono('currentColor')}</g>
<g transform="translate(${round(PAD + MARK_W + gap)} ${round((height - wmH) / 2)}) scale(${round(scale)})">${wordmark.markup}</g>
</g>
</svg>
`;
}

/** Favicon : tuile anthracite, symbole ivoire, marges optiques égales. */
function faviconSvg() {
  const tile = 120;
  const inner = 100; // le symbole occupe 100 des 120 unités de la tuile
  const scale = inner / MARK_W;
  const height = MARK_H * scale;
  return `<svg ${NS} viewBox="0 0 ${tile} ${tile}" role="img" aria-labelledby="t">
${CREDIT}
<title id="t">Tunisie Pergola</title>
<rect width="${tile}" height="${tile}" rx="16" fill="${BRAND.anthracite}"/>
<g transform="translate(${round((tile - inner) / 2)} ${round((tile - height) / 2)}) scale(${round(scale)})">${markMono(
    BRAND.ivory
  )}</g>
</svg>
`;
}

/**
 * Panneau de gauche de l'image de partage, en vecteur : le lockup vertical,
 * aux mêmes rapports que partout ailleurs, sur la moitié anthracite. La moitié
 * droite reçoit une photographie réelle, composée par `sharp`.
 */
function shareOverlay() {
  const markW = 356;
  const markScale = markW / MARK_W;
  const markH = round(MARK_H * markScale);
  const markY = 132;
  const wmW = round(markW * 1.374);
  const wmScale = wmW / wordmark.width;
  const wmY = markY + markH + 74;
  const ruleY = round(wmY + wordmark.height * wmScale + 34);
  return `<svg ${NS} viewBox="0 0 1200 630" width="1200" height="630">
<rect width="600" height="630" fill="${BRAND.anthracite}"/>
<rect x="600" y="0" width="3" height="630" fill="${BRAND.copper}"/>
<g transform="translate(80 ${markY}) scale(${round(markScale)})">${markColor({
    structure: BRAND.ivory,
    lames: BRAND.copper
  })}</g>
<g transform="translate(80 ${wmY}) scale(${round(wmScale)})" color="${BRAND.ivory}">${wordmark.markup}</g>
<rect x="80" y="${ruleY}" width="${wmW}" height="3" fill="${BRAND.copper}"/>
</svg>
`;
}

function round(n) {
  return Math.round(n * 100) / 100;
}

async function main() {
  await mkdir(BRAND_DIR, { recursive: true });

  const files = {
    'tp-symbole.svg': symbolFile({ mode: 'color' }),
    'tp-symbole-mono-sombre.svg': symbolFile({ mode: 'mono', ink: BRAND.anthracite }),
    'tp-symbole-mono-clair.svg': symbolFile({ mode: 'mono', ink: BRAND.ivory }),
    'tp-logo-vertical-sombre.svg': verticalLockup(BRAND.anthracite),
    'tp-logo-vertical-clair.svg': verticalLockup(BRAND.ivory),
    'tp-logo-horizontal-sombre.svg': horizontalLockup(BRAND.anthracite),
    'tp-logo-horizontal-clair.svg': horizontalLockup(BRAND.ivory)
  };

  for (const [name, content] of Object.entries(files)) {
    await writeFile(join(BRAND_DIR, name), content, 'utf8');
    console.log(`✓ brand/${name}`);
  }

  const favicon = faviconSvg();
  await writeFile(join(PUBLIC_DIR, 'favicon.svg'), favicon, 'utf8');
  console.log('✓ favicon.svg');

  // Rasters de secours : rendus du même vecteur, pour les contextes qui
  // n'acceptent pas encore le SVG (onglets anciens, écran d'accueil iOS).
  const faviconBuf = Buffer.from(favicon);
  await sharp(faviconBuf, { density: 384 }).resize(32, 32).png().toFile(join(PUBLIC_DIR, 'favicon-32.png'));
  await sharp(faviconBuf, { density: 384 }).resize(180, 180).png().toFile(join(PUBLIC_DIR, 'apple-touch-icon.png'));
  console.log('✓ favicon-32.png + apple-touch-icon.png');

  // Image de partage : moitié marque, moitié photographie réelle.
  const photo = await sharp(COVER).resize(600, 630, { fit: 'cover', position: 'centre' }).toBuffer();
  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: BRAND.anthracite }
  })
    .composite([
      { input: photo, left: 600, top: 0 },
      { input: Buffer.from(shareOverlay()), left: 0, top: 0 }
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(join(BRAND_DIR, 'og-tunisie-pergola.jpg'));
  console.log('✓ brand/og-tunisie-pergola.jpg  1200×630');

  await writeFile(
    join(BRAND_DIR, 'README.md'),
    `# Fichiers de marque — Tunisie Pergola

Identité **v1**, proposition DCB : elle attend la validation du client avant
toute impression, enseigne ou dépôt.

Tous ces fichiers sont générés par \`npm run brand\` depuis une seule source de
géométrie, \`src/data/brand-marks.mjs\`. Ne les modifiez pas à la main : corrigez
la géométrie, relancez, et le site comme les fichiers remis restent identiques.

| Fichier | Usage |
|---|---|
| \`tp-symbole.svg\` | Symbole bicolore, fond clair garantissant le contraste du cuivre |
| \`tp-symbole-mono-sombre.svg\` | Symbole une encre anthracite, fond clair |
| \`tp-symbole-mono-clair.svg\` | Symbole une encre ivoire, fond sombre ou photo |
| \`tp-logo-vertical-sombre.svg\` / \`-clair\` | Lockup vertical |
| \`tp-logo-horizontal-sombre.svg\` / \`-clair\` | Lockup horizontal |
| \`../favicon.svg\` | Onglet navigateur |
| \`../favicon-32.png\`, \`../apple-touch-icon.png\` | Secours raster |
| \`og-tunisie-pergola.jpg\` | Image de partage 1200 × 630 |

## Règles

- **Zone de protection** : l'épaisseur d'un poteau, soit ${MARK_UNIT} unités du
  \`viewBox\` du symbole (\`${MARK_VIEWBOX}\`), sur les quatre côtés.
- **Monochrome obligatoire** dès que le fond ne garantit pas le contraste du
  cuivre-bois : photo, gravure, marquage une couleur, très petites tailles.
- **Ne jamais** recomposer le mot-symbole dans une police : il est dessiné.
- Couleurs : anthracite \`${BRAND.anthracite}\`, cuivre-bois \`${BRAND.copper}\`,
  ivoire chaud \`${BRAND.ivory}\`, bleu méditerranéen \`${BRAND.sea}\`.
- Signature : « ${SITE.signature} »
`,
    'utf8'
  );
  console.log('✓ brand/README.md');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
