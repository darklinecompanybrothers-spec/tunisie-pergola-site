# Tunisie Pergola — site

Site statique de prévisualisation pour `tunisiepergola.tn`.
**Non déployé.** La mise en production est bloquée : voir
[`docs/RELEASE-GATES.md`](docs/RELEASE-GATES.md).

Source de vérité du contenu :
`docs/clients/tunisie-pergola/` à la racine du dépôt DCB. Rien de ce qui est
publié ici n'en sort.

---

## Commandes

```bash
npm install
npm run photos:derive   # recadrages + vérification SHA-256 des originaux
npm run brand           # SVG de marque, favicon, image de partage
npm run dev             # serveur de développement
npm run verify          # typecheck + astro check + build + audit
npm run preview         # sert le build de production
```

`npm run build` enchaîne `astro build` puis `scripts/audit-build.mjs`. **L'audit
échoue le build** ; il n'est pas informatif.

## Ce que l'audit refuse de laisser passer

`scripts/audit-build.mjs` lit le HTML produit, pas les sources.

| Contrôle | Pourquoi |
|---|---|
| 16 familles d'affirmations interdites (garantie, matériau, prix, ancienneté, motorisation, étanchéité, horaires, couverture nationale…) | `CLIENT-BRIEF.md` §3 : ces informations ne sont pas confirmées |
| Un seul `<h1>`, titre et description uniques, canonical absolue | Cannibalisation et duplication |
| NAP identique sur toutes les pages | Cohérence avec la fiche Google Business Profile à venir |
| `alt`, `width` et `height` sur chaque image | Accessibilité et CLS |
| Aucun `style=`, `<style>`, `onclick`, ni script en ligne | La CSP stricte doit rester tenable |
| Hôtes externes limités à une liste blanche | Aucun CDN, aucun traceur |
| JSON-LD parsable, sans `priceRange`, `openingHours`, `aggregateRating`, `review`, `offers` | Balisage trompeur pour Google, et faux |
| CSP de `_headers` identique à celle de `vercel.json` | L'hébergeur ne doit pas décider du niveau de sécurité |
| Budgets : 40 Ko de JavaScript, 90 Ko de CSS | Core Web Vitals |
| Aucun original Facebook publié tel quel | Les anciens marquages incrustés doivent rester hors cadre |

Test de non-régression de l'audit lui-même : injecter une phrase interdite dans
une page de `dist/` et relancer `npm run audit` — il doit sortir en code 1.

## Dépendances, et pourquoi

| Paquet | Rôle | Justification |
|---|---|---|
| `astro` | Génération statique | Le HTML est produit au build ; aucun runtime d'interface n'est envoyé au navigateur |
| `@astrojs/sitemap` | `sitemap-index.xml` | Généré depuis les canonicals réelles, jamais à la main |
| `@astrojs/check` | Diagnostics des fichiers `.astro` | Complète `tsc`, qui ne lit pas les templates |
| `typescript` | TypeScript strict | `astro/tsconfigs/strictest` |
| `@fontsource-variable/syne`, `-manrope` | Source des fichiers de police | Deux `woff2` variables copiés dans `public/fonts/`, licences OFL incluses. Les paquets ne sont pas chargés à l'exécution |

Aucune bibliothèque d'animation, aucun *smooth scroll*, aucun framework
d'interface, aucun CDN. Le mouvement est fait de CSS et de deux modules
TypeScript, 9 Ko au total, non compressés.

## Architecture

```
src/
  data/site.config.mjs   Faits confirmés — SOURCE UNIQUE (NAP, zones, circuit de lead)
  data/site.ts           Accès typé + contrôles exécutés au build
  data/pages.ts          Routes, titres, descriptions, fil d'Ariane, navigation
  data/brand-marks.mjs   Géométrie du monogramme et alphabet du mot-symbole
  content.config.ts      Schéma strict des réalisations
  content/realisations/  Une fiche par photographie publiée
  assets/photos/source/  Originaux Facebook, non modifiés
  assets/photos/derived/ Recadrages publiés (générés)
  components/            Primitives réutilisables
  layouts/Base.astro     Gabarit unique
  pages/                 10 routes
  scripts/               Améliorations progressives (TypeScript)
  styles/                Couches CSS : reset, tokens, base, layout, components, utilities
scripts/                 Outils de build (photos, marque, audit)
docs/                    Documents internes — jamais publiés
```

### Décisions structurantes

**Tout fonctionne sans JavaScript.** Ce n'est pas une intention, c'est vérifiable :
le sous-menu Services est un `<details>` natif ; le menu mobile s'ouvre par
`:target` ; le filtre de la galerie est un groupe de boutons radio et une règle
`:has()` ; le formulaire poste en HTML pur vers le circuit DCB. Le JavaScript
n'ajoute que ce que le HTML ne sait pas faire : Échap, clic extérieur, `inert`,
retour du focus, envoi discret.

**Aucune animation ne peut rester bloquée.** L'état écrit par défaut est toujours
l'état *final* : le rideau d'ouverture est `opacity: 0; visibility: hidden` et
n'est animé que dans un bloc `prefers-reduced-motion: no-preference`, sans
`animation-fill-mode` ; les cinq lames du hero sont `translate: 0 -101%` au repos
et n'utilisent `backwards` que pour couvrir leur délai ; les révélations au
défilement passent par `animation-timeline: view()`, sous `@supports`. Script
bloqué, moteur ancien, mouvement réduit : le pire cas est un site sans animation.

**La couleur de marque n'est jamais écrite en dur hors de `tokens.css`.** Le cuivre
`#B86F44` porte une étiquette anthracite sur les boutons — 4,51:1 mesuré, donc
conforme AA sur fond clair comme sur fond sombre, sans altérer la couleur. Une
variante assombrie `--tp-copper-ink` (#9A5733, 4,88:1 sur ivoire) sert au texte
courant, où le cuivre de marque ne passerait pas.

**Le mot-symbole est dessiné, pas composé.** `src/data/brand-marks.mjs` contient un
alphabet géométrique au trait. Le logo ne dépend donc d'aucune police : il reste
identique si le chargement des webfonts échoue, et les fichiers remis au client
sont autonomes.

**Aucune page ville.** Une page locale ne sera créée que lorsqu'une réalisation
identifiée, ses photographies et ses données validées la rendront utile. Le
chemin prévu est une entrée dans `src/content/realisations/`, jamais une
permutation de noms de villes.

## Photographies

Les originaux Facebook sont copiés sans modification dans
`src/assets/photos/source/`. `npm run photos:derive` vérifie le SHA-256 de
chacun contre `ASSET-MANIFEST.md` — un fichier remplacé fait échouer le
script — puis produit les recadrages publiés et
`src/assets/photos/PROVENANCE.json`.

Deux raisons de recadrer, et deux seulement : sortir du cadre l'ancien marquage
« Tunisie Pergola / 98 363 003 » incrusté sur sept des neuf photos, et donner à
chaque image le rapport de forme de la scène qui l'accueille. Rien n'est effacé,
retouché ni ajouté sur un chantier.

Neuf photos tracées, huit publiées. `structure-blanche-chantier-vue-etage.jpg`
est produite et documentée mais tenue en réserve : le manifeste demande
d'employer la série blanche « avec parcimonie », et cette vue montre surtout
l'encombrement des toitures voisines.

## Réception des demandes

Le formulaire vise le formulaire DCB déjà utilisé par le site DCB. `js/lead.js`
et `js/source.js` à la racine du dépôt n'ont pas été modifiés ; l'adaptateur de
ce projet (`src/scripts/lead.ts`) reprend la même adresse publique et les mêmes
identifiants de champs, et applique la même stratégie : le formulaire cible n'a
que six champs figés, donc la qualification (ville, usage, dimensions, échéance,
source, parcours) est repliée lisiblement dans le champ de détails.

Deux marqueurs permettent à DCB d'isoler ces demandes :
`service = « Tunisie Pergola — <type> »` et `pack = « Site tunisiepergola.tn »`.

Aucune clé, aucun jeton, aucune donnée privée n'entre dans le bundle.

## Licences

Polices Syne et Manrope sous SIL Open Font License 1.1 — textes de licence dans
`public/fonts/`. Photographies : propriété du client, usage autorisé par DCB
pour ce projet, voir `src/assets/photos/PROVENANCE.json`.
