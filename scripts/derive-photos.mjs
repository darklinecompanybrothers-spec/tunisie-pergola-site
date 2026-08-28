/**
 * Dérivés photo — Tunisie Pergola
 * ================================
 * Les originaux du dossier client ne sont jamais modifiés. Ils sont copiés tels
 * quels dans `src/assets/photos/source/`, puis ce script produit les images
 * publiées dans `src/assets/photos/derived/`.
 *
 * Ce qu'il fait, et rien d'autre :
 *   1. il vérifie que chaque original est bien celui qu'on croit (empreinte);
 *   2. il applique le recadrage déclaré au catalogue — dont la seule raison
 *      d'être est de SORTIR DU CADRE les anciens marquages incrustés, bandeau
 *      « Tunisie Pergola » et ancien numéro de téléphone;
 *   3. il borne la définition et réencode;
 *   4. il écrit `PROVENANCE.json`, qui devient la pièce justificative.
 *
 * LE CONTRÔLE D'EMPREINTE
 * `photos.lock.json` associe chaque original à son empreinte. Un original
 * ABSENT du verrou y est ajouté et signalé — c'est le cas normal d'un nouvel
 * envoi client. Un original DÉJÀ connu dont l'empreinte a changé fait échouer
 * le script : quelqu'un a remplacé ou retouché une image, et la provenance
 * inscrite sur le site ne la décrit plus. Mieux vaut ne rien publier.
 *
 * POURQUOI LE RECADRAGE N'EST PAS COSMÉTIQUE
 * Plusieurs originaux portent l'ANCIEN numéro commercial incrusté dans les
 * pixels. Depuis le changement de ligne, ce numéro est faux. Une image n'est
 * pas relue comme un texte : elle ne serait corrigée par personne. Le
 * recadrage est donc la seule barrière, et c'est pour cela qu'il vit ici, dans
 * le chemin de production, et pas dans une consigne.
 *
 *   node scripts/derive-photos.mjs
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import sharp from 'sharp';

import { CATALOGUE, ECARTES, HORS_PORTFOLIO, FB_PAGE } from '../src/data/photos.catalogue.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const SOURCE_DIR = join(root, 'src', 'assets', 'photos', 'source');
const DERIVED_DIR = join(root, 'src', 'assets', 'photos', 'derived');
const PROVENANCE = join(root, 'src', 'assets', 'photos', 'PROVENANCE.json');
const LOCK = join(root, 'src', 'assets', 'photos', 'photos.lock.json');

/** Au-delà, on ne gagne plus rien à l'écran et on alourdit le dépôt. */
const MAX_EDGE = 2048;
const QUALITY = 86;

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

async function main() {
  await mkdir(DERIVED_DIR, { recursive: true });

  const lock = existsSync(LOCK) ? JSON.parse(await readFile(LOCK, 'utf8')) : {};
  const problems = [];
  const nouveaux = [];
  const photos = [];
  const pages = [];

  // Les deux jeux passent par la même chaîne — même contrôle d'empreinte, même
  // recadrage, même réencodage — et se séparent seulement à l'écriture.
  const tout = [
    ...CATALOGUE.map((e) => ({ entry: e, portfolio: true })),
    ...HORS_PORTFOLIO.map((e) => ({ entry: e, portfolio: false }))
  ];

  for (const { entry, portfolio } of tout) {
    const sourcePath = join(SOURCE_DIR, entry.source);
    if (!existsSync(sourcePath)) {
      problems.push(`${entry.source} — original absent de src/assets/photos/source/`);
      continue;
    }

    const original = await readFile(sourcePath);
    const empreinte = sha256(original);

    if (lock[entry.source] === undefined) {
      lock[entry.source] = empreinte;
      nouveaux.push(entry.source);
    } else if (lock[entry.source] !== empreinte) {
      problems.push(
        `${entry.source} — l'original a changé depuis son enregistrement. ` +
          `Attendu ${lock[entry.source].slice(0, 12)}…, trouvé ${empreinte.slice(0, 12)}…`
      );
      continue;
    }

    let pipeline = sharp(original);
    const meta = await pipeline.metadata();

    if (entry.crop) {
      const { left, top, width, height } = entry.crop;
      if (left + width > meta.width || top + height > meta.height) {
        problems.push(
          `${entry.source} — recadrage hors cadre : ${width}×${height} à (${left},${top}) ` +
            `dans un original de ${meta.width}×${meta.height}`
        );
        continue;
      }
      pipeline = pipeline.extract(entry.crop);
    }

    const cropW = entry.crop ? entry.crop.width : meta.width;
    const cropH = entry.crop ? entry.crop.height : meta.height;
    if (Math.max(cropW, cropH) > MAX_EDGE) {
      pipeline = pipeline.resize({
        width: cropW >= cropH ? MAX_EDGE : null,
        height: cropH > cropW ? MAX_EDGE : null,
        withoutEnlargement: true
      });
    }

    const out = await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();
    const outMeta = await sharp(out).metadata();
    await writeFile(join(DERIVED_DIR, entry.out), out);

    const commun = {
      file: entry.out,
      width: outMeta.width,
      height: outMeta.height,
      legende: entry.legende,
      alt: entry.alt,
      source: {
        file: entry.source,
        sha256: empreinte,
        originalSize: `${meta.width}×${meta.height}`
      },
      crop: entry.crop ?? null,
      cropReason: entry.crop
        ? 'Ancien marquage incrusté — dont un numéro de téléphone caduc — sorti du cadre.'
        : null
    };

    if (portfolio) {
      photos.push({
        ...commun,
        categories: entry.categories,
        services: entry.services,
        gamme: entry.gamme ?? null,
        vedette: entry.vedette === true,
        source: { ...commun.source, url: FB_PAGE }
      });
    } else {
      // Pas d'URL Facebook ici : cette image n'en vient pas, et lui en donner
      // une serait exactement l'erreur que cette séparation existe pour éviter.
      pages.push({ ...commun, provenance: entry.provenance });
    }
  }

  if (problems.length > 0) {
    console.error('\nDérivation interrompue :');
    for (const p of problems) console.error(`  · ${p}`);
    process.exitCode = 1;
    return;
  }

  await writeFile(LOCK, `${JSON.stringify(lock, null, 2)}\n`, 'utf8');
  await writeFile(
    PROVENANCE,
    `${JSON.stringify(
      {
        note:
          'Provenance des photographies publiées. Originaux non modifiés dans ' +
          'src/assets/photos/source/, copiés depuis ' +
          'docs/clients/tunisie-pergola/assets/facebook/photos/original/. Le recadrage, quand ' +
          'il existe, sort du cadre un ancien marquage incrusté — bandeau de marque ou numéro ' +
          'de téléphone caduc — sans rien effacer ni retoucher. Fichier écrit par ' +
          'scripts/derive-photos.mjs : ne pas le modifier à la main.',
        sourcePage: FB_PAGE,
        generatedOn: new Date().toISOString().slice(0, 10),
        published: photos.length,
        excluded: ECARTES,
        photos,
        pageImagesNote:
          'Images d’habillage de page. Elles ne sont PAS des réalisations, ne proviennent pas ' +
          'nécessairement des publications Facebook, et n’entrent ni dans la galerie ni dans le ' +
          'nombre annoncé sur /realisations/. Chacune porte sa propre provenance.',
        pageImages: pages
      },
      null,
      2
    )}\n`,
    'utf8'
  );

  // Un dérivé qui traîne sans entrée au catalogue serait publiable sans
  // provenance : on le signale plutôt que de le laisser dormir.
  const attendus = new Set([...CATALOGUE, ...HORS_PORTFOLIO].map((e) => e.out));
  const orphelins = (await readdir(DERIVED_DIR)).filter(
    (f) => f.endsWith('.jpg') && !attendus.has(f)
  );

  console.log(
    `${photos.length} dérivés de portfolio · ${pages.length} image(s) de page · ` +
      `${ECARTES.length} originaux écartés`
  );
  if (nouveaux.length > 0) {
    console.log(`${nouveaux.length} nouvel(s) original(aux) enregistré(s) au verrou d'empreintes.`);
  }
  const recadres = photos.filter((p) => p.crop !== null).length;
  console.log(`${recadres} recadrages appliqués pour sortir un ancien marquage du cadre.`);
  if (orphelins.length > 0) {
    console.warn(`\nDérivés sans entrée au catalogue (à supprimer) :`);
    for (const f of orphelins) console.warn(`  · ${f}`);
  }
}

await main();
