/**
 * Fiches de réalisation — écrites depuis le catalogue.
 * ====================================================
 * Une fiche de `src/content/realisations/` n'est pas de la prose : c'est la
 * projection d'une entrée du catalogue, plus les dimensions et l'empreinte
 * relevées sur le dérivé réellement produit. L'écrire à la main, soixante-huit
 * fois, garantirait qu'une empreinte finisse par ne plus correspondre à son
 * image sans que personne ne s'en aperçoive.
 *
 * Le corps Markdown reste vide, comme avant : chaque réalisation deviendra une
 * page éditoriale le jour où la ville, l'usage et le contexte seront confirmés
 * par le client. Ce script ne l'écrase donc jamais s'il a été rempli — il ne
 * réécrit que l'en-tête.
 *
 *   node scripts/derive-photos.mjs && node scripts/build-photo-pages.mjs
 */
import { readFile, writeFile, readdir, unlink, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

import { CATALOGUE, FB_PAGE } from '../src/data/photos.catalogue.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const CONTENT_DIR = join(root, 'src', 'content', 'realisations');
const PROVENANCE = join(root, 'src', 'assets', 'photos', 'PROVENANCE.json');

/**
 * Rapports de forme que la galerie sait cadrer. On retient le plus proche du
 * dérivé réel : le cadre porte l'`aspect-ratio`, l'image le remplit en
 * `cover`, donc un écart léger recadre à l'affichage sans jamais déformer.
 */
const RATIOS = [
  ['1-1', 1], ['4-3', 4 / 3], ['3-4', 3 / 4], ['4-5', 4 / 5],
  ['3-2', 3 / 2], ['16-9', 16 / 9], ['21-9', 21 / 9]
];

const nearestRatio = (w, h) => {
  const r = w / h;
  let best = RATIOS[0];
  for (const candidate of RATIOS) {
    if (Math.abs(Math.log(candidate[1] / r)) < Math.abs(Math.log(best[1] / r))) best = candidate;
  }
  return best[0];
};

/**
 * Emprise dans la grille. Une vedette prend deux fois plus de place; une image
 * franchement horizontale s'étale plutôt que d'être rognée; le reste tient le
 * rythme. La grille elle-même redistribue ensuite selon sa propre cadence.
 */
function emprise(entry, w, h) {
  if (entry.vedette) return w / h >= 1.6 ? 'wide' : 'half';
  if (w / h >= 1.9) return 'wide';
  return 'third';
}

/** YAML minimal, et volontairement strict sur l'échappement des apostrophes. */
const yamlString = (value) => `'${String(value).replace(/'/g, "''")}'`;
const yamlList = (values) => `[${values.map((v) => `'${v}'`).join(', ')}]`;

async function main() {
  if (!existsSync(PROVENANCE)) {
    console.error('PROVENANCE.json absent — lancer scripts/derive-photos.mjs d’abord.');
    process.exitCode = 1;
    return;
  }
  await mkdir(CONTENT_DIR, { recursive: true });

  const provenance = JSON.parse(await readFile(PROVENANCE, 'utf8'));
  const parProvenance = new Map(provenance.photos.map((p) => [p.file, p]));

  const attendus = new Set();
  let ecrits = 0;

  for (const [index, entry] of CATALOGUE.entries()) {
    const p = parProvenance.get(entry.out);
    if (!p) {
      console.error(`${entry.out} — absent de PROVENANCE.json, dérivation incomplète.`);
      process.exitCode = 1;
      return;
    }

    const slug = entry.out.replace(/\.jpg$/, '');
    const file = join(CONTENT_DIR, `${slug}.md`);
    attendus.add(`${slug}.md`);

    // Un corps rédigé à la main est conservé : le script ne possède que l'en-tête.
    let corps = '';
    if (existsSync(file)) {
      const existant = await readFile(file, 'utf8');
      const fin = existant.indexOf('\n---', 4);
      if (fin !== -1) corps = existant.slice(fin + 4).replace(/^\n+/, '');
    }

    const lignes = [
      '---',
      `ordre: ${index + 1}`,
      `legende: ${yamlString(entry.legende)}`,
      `alt: ${yamlString(entry.alt)}`,
      `photo: ../../assets/photos/derived/${entry.out}`,
      `categories: ${yamlList(entry.categories)}`,
      `services: ${yamlList(entry.services)}`,
      ...(entry.gamme ? [`gamme: '${entry.gamme}'`] : []),
      `vedette: ${entry.vedette === true}`,
      `format: ${emprise(entry, p.width, p.height)}`,
      `ratio: ${nearestRatio(p.width, p.height)}`,
      `source: ${yamlString(FB_PAGE)}`,
      `sha256: ${p.source.sha256}`,
      `recadree: ${p.crop !== null}`,
      '---',
      ''
    ];

    await writeFile(file, `${lignes.join('\n')}${corps ? `\n${corps}` : ''}`, 'utf8');
    ecrits += 1;
  }

  // Une fiche qui ne correspond plus à aucune entrée publierait une photo que
  // le catalogue ne décrit plus. Elle est retirée.
  const perimees = (await readdir(CONTENT_DIR)).filter(
    (f) => f.endsWith('.md') && !attendus.has(f)
  );
  for (const f of perimees) await unlink(join(CONTENT_DIR, f));

  console.log(`${ecrits} fiches écrites${perimees.length ? ` · ${perimees.length} fiche(s) périmée(s) retirée(s)` : ''}`);
}

await main();
