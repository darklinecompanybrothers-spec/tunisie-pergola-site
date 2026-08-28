// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/data/site.config.mjs';

/**
 * Tunisie Pergola — build statique.
 *
 * `SITE.origin` est l'unique source du domaine canonique : le sitemap, les
 * canonicals, les métadonnées Open Graph et le JSON-LD en dépendent tous.
 * Le changer ici met tout le site à jour.
 */
export default defineConfig({
  site: SITE.origin,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Toutes les feuilles de style restent externes : la CSP peut donc
    // interdire `style-src 'unsafe-inline'` sans casser le rendu.
    inlineStylesheets: 'never'
  },
  image: {
    // Aucun service distant : toutes les images sont locales et optimisées
    // au build. Les formats modernes sont générés par `astro:assets`.
    responsiveStyles: false
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      changefreq: 'monthly',
      lastmod: new Date(SITE.lastReviewed)
    })
  ],
  devToolbar: { enabled: false },
  vite: {
    build: {
      // Un seul point d'entrée JS par page, sans chunk vide.
      assetsInlineLimit: 0
    }
  }
});
