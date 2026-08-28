# Portes de mise en production — Tunisie Pergola

**Document interne. Jamais publié** : il vit hors de `public/`, donc hors de
`dist/`, donc hors du site.

État au **21 août 2026** : le site est complet et vérifiable en local.
**Il ne doit pas être mis en ligne** tant que les portes A à D restent ouvertes.

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
