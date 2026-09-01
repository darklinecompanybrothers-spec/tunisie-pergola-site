# SEO local — plan de mise en service

**Document interne. Jamais publié.**
Rien ici ne s'exécute avant que les portes de
[`RELEASE-GATES.md`](RELEASE-GATES.md) soient fermées.

Toutes les dates sont des jalons relatifs à **J**, le jour de la mise en ligne.
Le site est prêt côté technique : ce document ne décrit que ce qui exige un
accès que DCB n'a pas encore.

---

## J−7 — DNS et hébergement

- [ ] Récupérer l'accès au registrar de `tunisiepergola.tn` (propriété client).
- [ ] Déployer le build sur l'hébergeur retenu. Les en-têtes sont déjà écrits :
      `public/_headers` (Cloudflare Pages / Netlify) et `vercel.json` (Vercel).
      **Les deux déclarent la même politique** ; `scripts/audit-build.mjs`
      échoue si elles divergent.
- [ ] Faire pointer l'apex `tunisiepergola.tn` vers l'hébergeur.
- [ ] Rediriger `www.tunisiepergola.tn` en **301** vers l'apex. Le canonique du
      site est `https://tunisiepergola.tn`, sans `www` — c'est la seule valeur
      dans `src/data/site.config.mjs`.
- [ ] Forcer HTTPS. `Strict-Transport-Security` est déjà déclaré à un an.
- [ ] Vérifier après propagation : `https://tunisiepergola.tn/robots.txt`,
      `/sitemap-index.xml`, `/404` (page personnalisée, pas celle de
      l'hébergeur).

## J — Search Console et Bing

- [ ] **Google Search Console** : ajouter la propriété **de domaine**
      (validation DNS TXT) — elle couvre l'apex, `www` et tous les protocoles
      d'un coup.
- [ ] Soumettre `https://tunisiepergola.tn/sitemap-index.xml`. Il est
      **bilingue** : chaque URL y déclare son équivalent dans l’autre langue
      (`xhtml:link`), et le `<head>` de chaque page déclare les mêmes
      `hreflang` — le contrôle de build vérifie les deux.
- [ ] Dans Search Console, contrôler le rapport **Ciblage international** : il
      ne doit signaler aucune balise `hreflang` sans retour. La réciprocité est
      vérifiée au build, mais Google la revérifie sur les URL réellement
      servies.
- [ ] Inspecter et demander l'indexation des trois pages qui portent
      l'acquisition : `/`, `/pergolas/`, `/realisations/`.
- [ ] **Bing Webmaster Tools** : importer depuis Search Console (deux clics),
      puis soumettre le même sitemap. Bing alimente Copilot ; ce n'est plus
      accessoire.
- [ ] Contrôler dans les deux outils qu'aucune page n'est signalée
      « Explorée, actuellement non indexée » au bout de 14 jours.

## J — Google Business Profile

DCB reçoit l'accès **après** la création du site. Rien ne doit être modifié
avant la remise formelle.

- [ ] Vérifier que le NAP de la fiche est **exactement** celui du site :

      Tunisie Pergola
      Rue Léopold Senghor, 4000 Sousse, Tunisie
      +216 58 233 020
      contact@dcbag.net

      C’est l’adresse PHYSIQUE de l’entreprise, à Sousse — pas celle de DCB,
      qui reçoit les demandes du site. Le `LocalBusiness` du site porte la
      même, et le contrôle de build refuse le contraire.

      Une virgule ou une abréviation de différence suffit à affaiblir le
      rapprochement d'entité. La source unique est `src/data/site.config.mjs`.
- [ ] Renseigner le site : `https://tunisiepergola.tn` (sans `www`, avec HTTPS).
- [ ] Catégorie principale : celle qui correspond à la pose de pergolas et
      d'abris. **Ne pas** cocher de catégorie que l'activité déclarée ne couvre
      pas.
- [ ] Zones desservies : les dix villes déclarées, ni plus ni moins —
      Sousse, Monastir, Nabeul, Tunis, La Marsa, Djerba, Sfax, Gabès, Médenine,
      Tataouine.
- [ ] **Ne pas** renseigner d'horaires, de fourchette de prix ni d'attribut non
      confirmé. Une donnée fausse sur la fiche contredirait le site, et Google
      compare.
- [ ] Publier les photos déjà recadrées de `src/assets/photos/derived/` — celles
      dont l'ancien bandeau de contact est hors cadre.

## J+1 — Cohérence NAP hors du site

Le rapprochement local se joue sur la répétition à l'identique.

- [ ] Page Facebook : aligner l'adresse et le téléphone sur la formulation du
      site, et ajouter le lien vers `https://tunisiepergola.tn`.
- [ ] **Retirer l'indicateur `€€`** de la page Facebook : il n'est ni précis, ni
      adapté à un marché en TND. Le site n'affiche aucun prix.
- [ ] Recenser les annuaires tunisiens où l'entreprise apparaît déjà et corriger
      chaque NAP divergent avant d'en créer de nouveaux.

## J+1 — Attribution et suivi des conversions

Le site n'embarque **aucun** outil de mesure : ni analytics, ni pixel, ni
cookie. C'est un choix, pas un oubli.

Ce qui existe déjà, sans requête sortante : l'origine de la première visite et
le parcours de contact sont conservés dans le stockage de session et **joints à
la demande elle-même**. DCB lit donc la source réelle dans la ligne du lead —
« Source : Google · page d'entrée : /pergolas/ » — sans aucun outil.

- [ ] Utiliser des UTM sur les publications Facebook payantes :
      `?utm_source=facebook&utm_medium=social&utm_campaign=<campagne>`.
      Le paramètre `utm_source` est déjà lu et prioritaire sur le référent.
- [ ] Si une mesure d'audience devient nécessaire : elle exige une bannière de
      consentement, une mise à jour de la politique de confidentialité et une
      révision de la CSP (`connect-src`). Ne pas l'ajouter en passant.

## J+7 → continu — Publication des réalisations

C'est le seul levier qui fera vraiment progresser le site, et il ne demande
aucun développement.

Chaque nouvelle réalisation = un fichier dans `src/content/realisations/`. Le
schéma est strict : sans provenance, empreinte SHA-256, légende et texte
alternatif, **le build échoue**. C'est voulu.

- [ ] Une réalisation publiée par mois, minimum.
- [ ] Quand une réalisation a une ville confirmée, des photos qui lui sont
      rattachées et un contexte propre, elle peut devenir une **page locale** —
      Sousse d'abord, puis La Marsa, Jendouba, Tabarka.
- [ ] **Ne jamais** créer de page ville par permutation de nom. C'est le schéma
      de pages satellites que Google sanctionne, et il n'apporterait rien à un
      visiteur.

## Suivi mensuel

| Indicateur | Où | Seuil d'alerte |
|---|---|---|
| Pages indexées | Search Console → Pages | < 36 |
| Impressions « pergola Tunisie », « pergola Sousse » | Search Console → Performances | Aucune impression après 60 jours |
| Clics vers `/contact/` | Search Console + lignes de lead | Aucun lead sur 30 jours |
| Sources des leads | Ligne « Source : » de chaque demande | Part « Direct » > 80 % (signe d'un suivi cassé) |
| Core Web Vitals terrain | Search Console → Signaux web essentiels | Une URL hors du vert |

## Mots-clés — une intention par page, sans recouvrement

Dix-huit routes indexables, dans deux langues. Une seule intention par route :
l’unicité est vérifiée au build (`src/data/pages.ts`, constante `INTENT`), et
un doublon fait échouer `astro build`.

| Route | Intention principale |
|---|---|
| `/` | ferronnerie métallerie Tunisie |
| `/ouvrages-metalliques/` | ouvrages métalliques sur mesure Tunisie |
| `/portes-metalliques/` | porte métallique Tunisie |
| `/portails-metalliques/` | portail métallique Tunisie |
| `/fenetres-grilles-metalliques/` | grille de sécurité fenêtre Tunisie |
| `/garde-corps-rampes/` | garde-corps métallique Tunisie |
| `/escaliers-metalliques/` | escalier métallique Tunisie |
| `/pergolas/` | pergola sur mesure Tunisie |
| `/abris/` | abri de jardin Tunisie |
| `/clotures-palissades/` | clôture métallique Tunisie |
| `/verrieres/` | verrière Tunisie |
| `/structures-metalliques/` | charpente métallique Tunisie |
| `/mobilier-ferronnerie-artistique/` | ferronnerie artistique Tunisie |
| `/realisations/` | réalisations ferronnerie Tunisie |
| `/a-propos/` | ferronnier métallier Sousse |
| `/zones-intervention/` | métallerie Sousse zones |
| `/contact/` | contact Tunisie Pergola |
| `/politique-confidentialite/` | politique de confidentialité |

Les routes `/ar/…` visent les mêmes intentions dans leur terminologie arabe —
« حدادة », « بوابات معدنية », « درابزين », « سلالم معدنية », « برغولا ». Elles ne
concurrencent pas les françaises : Google les sépare par la langue déclarée.

Cette répartition est déclarée dans `src/data/pages.ts` (champ `intent`) et
l'unicité des titres et descriptions est vérifiée au build.

**Requête « prix pergola Tunisie » :** volontairement non traitée. Le dossier
client interdit tout tarif, et un guide sur les facteurs de coût écrit sans
donnée réelle produirait exactement les approximations que le brief refuse. À
rouvrir quand le client fournit des fourchettes réelles en TND.
