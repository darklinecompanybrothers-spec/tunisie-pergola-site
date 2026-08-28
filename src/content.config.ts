import { defineCollection } from 'astro:content';
// zod est réexporté par Astro sous `astro/zod` : on l'utilise directement,
// l'alias historique `z` de `astro:content` étant déprécié en Astro 7.
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Réalisations publiées.
 *
 * Le schéma est volontairement sévère. Une entrée sans provenance, sans
 * empreinte, sans texte alternatif ou sans légende **fait échouer le build** :
 * il est impossible de publier une photographie dont on ne peut pas démontrer
 * l'origine, ou de mettre en ligne une carte vide en attendant mieux.
 *
 * Le corps Markdown est libre. Il est vide pour l'instant : chaque réalisation
 * deviendra une page éditoriale le jour où la ville, l'usage et le contexte
 * seront confirmés par le client. C'est le seul chemin prévu pour créer des
 * pages locales — jamais par permutation de noms de villes.
 */
const realisations = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/realisations' }),
  schema: ({ image }) =>
    z.object({
      /** Ordre d'affichage dans la galerie. */
      ordre: z.number().int().positive(),
      /** Ce que montre la photo, sans adjectif ni performance technique. */
      legende: z.string().min(24).max(180),
      /** Texte alternatif factuel et spécifique. */
      alt: z.string().min(24).max(180),
      photo: image(),
      /** Facettes réellement attribuables depuis le manifeste d'assets. */
      categories: z
        .array(z.enum(['realisations', 'chantiers', 'details', 'conception']))
        .nonempty(),
      /** Familles de service auxquelles la photo peut honnêtement se rattacher. */
      services: z.array(z.enum(['pergolas', 'verrieres', 'abris'])).default([]),
      /**
       * Gamme confirmée par le client (CLIENT-BRIEF.md §2 bis), et seulement
       * quand l'image la montre sans ambiguïté. Une photo où l'on ne distingue
       * pas le mode de couverture n'en porte aucune : c'est le seul moyen de
       * ne pas transformer une ressemblance en affirmation.
       */
      gamme: z.enum(['bioclimatique', 'toile', 'fixe', 'verriere', 'conception']).optional(),
      /** Image assez forte pour ouvrir une scène plutôt que remplir une case. */
      vedette: z.boolean().default(false),
      /** Emprise dans la grille de la galerie. */
      format: z.enum(['third', 'half', 'wide', 'full']),
      ratio: z.enum(['1-1', '4-3', '3-4', '4-5', '3-2', '16-9', '21-9']),
      /** Publication source stable (permalien Facebook). */
      source: z.url(),
      /** Empreinte de l'original, identique à `ASSET-MANIFEST.md`. */
      sha256: z.string().regex(/^[0-9a-f]{64}$/),
      /** `true` si un ancien marquage incrusté a été sorti du cadre. */
      recadree: z.boolean()
    })
});

export const collections = { realisations };
