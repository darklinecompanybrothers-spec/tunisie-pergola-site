# Portes de mise en production — Tunisie Pergola

**Document interne. Jamais publié** : il vit hors de `public/`, donc hors de
`dist/`, donc hors du site.

État au **1er septembre 2026** : le site est complet, bilingue (français et
arabe) et vérifiable en local — 37 pages, onze familles d’ouvrages, cinquante
intitulés confirmés.
**Il ne doit pas être mis en ligne** tant que les portes A à E restent ouvertes.

---

## A — Identité juridique et responsable du traitement · BLOQUANT

Le site collecte des données personnelles via le formulaire de projet. Trois
informations manquent, et aucune ne peut être supposée :

| Manquant | Conséquence tant que c'est absent |
|---|---|
| Identité juridique exacte de l'entreprise (raison sociale, forme, matricule fiscal, siège déclaré) | Pas de page **Mentions légales** |
| Qui est responsable du traitement : Tunisie Pergola, DCB Authority Group, ou les deux conjointement | La politique de confidentialité décrit les faits mais ne peut pas nommer un responsable |
| Contact vie privée dédié, s'il diffère de l'adresse publique | La page renvoie aujourd'hui vers l'e-mail public |

**Aucune page `/mentions-legales/` n'a été créée.** Inventer une identité
juridique serait à la fois faux et juridiquement risqué. La page reste absente,
et aucun lien n'y renvoie.

**À faire :** obtenir les informations, créer `/mentions-legales/`, l'ajouter à
`src/data/pages.ts`, au pied de page et à la liste `EXPECTED` de
`scripts/audit-build.mjs`.

## B — Durée de conservation des demandes · BLOQUANT

La politique de confidentialité indique aujourd'hui que les réponses sont
conservées « le temps du suivi de votre demande » et qu'une suppression peut
être demandée à tout moment. C'est vrai, mais imprécis.

**À faire :** arrêter une durée avec le client (proposition à valider : 24 mois
après le dernier échange), l'écrire dans
`src/pages/politique-confidentialite.astro`, et l'appliquer réellement dans la
feuille de suivi DCB. Une durée annoncée mais non appliquée est pire que pas de
durée du tout.

## C — Destinataires réels et sous-traitance · BLOQUANT

**Le circuit a changé le 2 septembre 2026.** Le site est désormais construit
autour d’un canal de conversion unique : WhatsApp, au +216 58 233 020.

| Chemin | Ce qui part | Vers qui |
|---|---|---|
| Bouton « Demander un devis » (barre, sections, barre flottante) | Un message pré-rempli — sujet et page d’origine — que le prospect envoie **de son propre compte** | Directement l’entreprise |
| Formulaire de projet | Le même message, complété des dix champs de qualification | Directement l’entreprise |
| Formulaire de projet, **copie simultanée** | Nom, téléphone, e-mail, famille · ouvrage, et le bloc de qualification complet avec l’origine de la visite | DCB, par le formulaire Google existant |

Deux conséquences à valider avec le client et avec DCB :

- **L’entreprise reçoit désormais des demandes que DCB ne voit pas** — celles
  qui partent d’un bouton de devis sans passer par le formulaire. La ligne de
  suivi de DCB ne peut donc plus être présentée comme exhaustive.
- **Le prospect doit appuyer sur « envoyer » dans WhatsApp.** Le site ouvre la
  conversation avec le message écrit; il ne l’envoie pas à sa place, et ne
  peut pas savoir s’il a été envoyé. La copie vers DCB est ce qui garantit
  qu’une demande remplie ne se perde pas si le prospect referme WhatsApp.

La page de confidentialité décrit ce circuit en toutes lettres, dans les deux
langues, y compris le fait que WhatsApp est un service tiers dont les
conditions s’appliquent à la conversation.


La page annonce : réception par DCB Authority Group pendant la phase initiale,
puis transmission à l'entreprise, avec Google comme hébergeur des réponses.

**À faire :** confirmer que cette description correspond au fonctionnement réel
après la remise du site, et notamment ce qui se passe quand DCB cesse de
recevoir les leads. Si la réception bascule vers l'entreprise, la page doit
changer *le même jour*.

## D — Validation client de l'identité v1 · BLOQUANT pour l'impression, pas pour le web

Le monogramme TP, le mot-symbole dessiné, la palette et la signature
« L'ombre prend forme. » sont une **proposition DCB**. Ils peuvent servir en
prévisualisation ; ils ne doivent pas être imprimés, gravés, posés sur un
véhicule ni déposés avant accord écrit du client.

Point d'ajustement unique : `src/styles/tokens.css` pour les couleurs,
`src/data/brand-marks.mjs` pour la forme. Une correction ne demande pas de
reprendre les pages.

---

## E — Relecture native de la version arabe · BLOQUANT

La version arabe a été rédigée en arabe standard moderne, avec la terminologie
du métier telle qu’elle est employée en Tunisie (« درابزين » pour un garde-corps,
« الحديد المطاوع » pour le fer forgé, « برغولا » conservé tel quel). Elle est
complète : contenu éditorial, cinquante intitulés d’ouvrages, formulaire,
messages d’erreur, textes alternatifs des soixante-huit photographies,
métadonnées et données structurées.

**Elle n’a pas été relue par un locuteur natif.** C’est la seule partie du site
dont la qualité ne peut pas être vérifiée par un contrôle automatique : le build
sait garantir qu’une traduction EXISTE et qu’elle est écrite en arabe, il ne
sait pas juger si elle sonne juste.

**À faire :** faire relire par un locuteur tunisien, en priorité :

1. les onze noms de famille et les cinquante intitulés d’ouvrages
   (`src/data/catalogue.ts`) — ce sont eux que les gens tapent dans un moteur;
2. les titres et descriptions `ar` de `src/data/pages.ts`;
3. le formulaire et ses messages (`src/i18n/ui.ts`).

Une correction se fait à un seul endroit et se répercute partout.

## Décisions soumises au client (non bloquantes)

| Sujet | Ce qui a été fait | Ce qu'il faut valider |
|---|---|---|
| Signature de marque | « L'ombre prend forme. » affichée au pied de page et sur l'image de partage | Retenue ou remplacée |
| Textes v1 | Hero, à propos, services et bloc de conversion repris de `CLIENT-BRIEF.md` §6 | Relecture par le client |
| « Pergola sur mesure » | Employé dans le titre de `/pergolas/` et une fois dans le corps | Le dossier client le liste en thème de recherche prioritaire ; à confirmer que l'entreprise l'assume |
| Photo tenue en réserve | `structure-blanche-chantier-vue-etage.jpg` produite mais non publiée | La publier ou la retirer |
| Page `/verrieres/` sans photo | La page dit explicitement qu'aucune verrière n'est encore photographiée | Fournir des photos de verrière, ou garder la formulation |
| Audience Facebook | « ≈ 19 000 abonnés le 21 août 2026 », sur `/a-propos/` uniquement, jamais présentée comme un nombre de clients | Rafraîchir la date, ou retirer |
| Lieux observés | Tabarka, La Marsa Nassim et Jendouba cités sur `/zones-intervention/` comme lieux d'intervention observés | Confirmer, et rattacher les photos correspondantes |

## Ce qui reste volontairement absent

- **Pages par ouvrage.** Les cinquante ouvrages sont nommés, visibles et
  indexables, mais aucun n’a sa propre page : il n’existe ni photographie, ni
  projet identifié, ni donnée technique qui la justifierait. L’architecture est
  prête (`catalogue.ts` porte déjà les intitulés et leur famille) ; une page
  individuelle se créera le jour où l’ouvrage aura de quoi la remplir.
- **Vidéos.** Le dossier réserve `assets/facebook/videos/` sans média. Aucune
  vidéo de stock, aucune génération, aucune animation prétendant montrer une
  réalisation n'a été mise à la place. Aucun bloc vide non plus : la place se
  crée le jour où les fichiers arrivent.
- **Téléversement de fichiers dans le formulaire.** Il ne sera ouvert que si un
  stockage sécurisé, une limite de taille, un contrôle de type et une politique
  de conservation existent réellement. La page de confidentialité le dit.
- **Mesure d'audience.** Aucun analytics, aucun pixel, aucun cookie. Les quatre
  évènements utiles (formulaire démarré, envoi, clic téléphone, clic WhatsApp)
  sont conservés dans la session et joints à la demande, sans qu'aucune requête
  ne quitte le navigateur.
- **Avis, notes, témoignages, compteurs de projets, prix.** Rien de tout cela
  n'existe dans le dossier client ; l'audit de build les refuse.
