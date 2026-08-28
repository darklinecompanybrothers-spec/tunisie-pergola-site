/**
 * Catalogue photographique — source unique.
 * =========================================
 * Ce fichier est lu par DEUX consommateurs, et c'est tout l'intérêt :
 *
 *   scripts/derive-photos.mjs      produit les dérivés publiés
 *   scripts/build-photo-pages.mjs  écrit les fiches de `src/content/realisations/`
 *
 * Une photographie décrite ici une fois est recadrée, dérivée, décrite et
 * publiée de façon cohérente partout. Il n'existe aucun autre endroit où
 * ajouter une photographie au site.
 *
 * RÈGLES, reprises de `CLIENT-BRIEF.md` :
 *   • `legende` et `alt` disent ce que MONTRE l'image. Jamais un matériau qu'on
 *     ne voit pas, jamais une performance, jamais une ville ni une date qui ne
 *     sont pas établies. Un doute se tranche en retirant l'information.
 *   • `crop` sort du cadre les anciens marquages incrustés — bandeau
 *     « Tunisie Pergola » et ancien numéro. Il n'efface rien et ne retouche
 *     rien : il cadre plus court. Le numéro incrusté est CADUC depuis le
 *     changement de ligne commerciale; en laisser passer un seul publierait un
 *     contact faux sur une image que personne ne relira.
 *   • `gamme` n'est renseignée que lorsque l'image la montre sans ambiguïté.
 *   • `vedette` marque les images assez fortes pour ouvrir une scène.
 */

/** Page source par défaut, quand la publication précise n'est pas connue. */
export const FB_PAGE = 'https://www.facebook.com/Tunisie.Pergola77';

/**
 * Originaux écartés, avec le motif. Présents ici pour que « pourquoi cette
 * photo n'est-elle pas en ligne » ait une réponse écrite plutôt qu'un oubli.
 */
export const ECARTES = [
  {
    source: 'facebook-45445454 (a vous de decider de la couleur à nous de concrétiser ).jpg',
    motif: 'Nuancier RAL — document tiers, il n’appartient pas à la marque.'
  },
  {
    source: 'facebook-conception.jpg',
    motif: 'Projection portant l’enseigne d’un autre commerce.'
  },
  {
    source: 'facebook-5245535643544722.jpg',
    motif: 'Doublon strict de facebook-4564543543521.jpg — empreinte identique.'
  }
];

/**
 * Images de PAGE — dérivées et tracées comme les autres, mais hors portfolio.
 * ===========================================================================
 * Une image d'ouverture n'est pas une réalisation. Elle habille une page; elle
 * ne prétend pas montrer un chantier livré.
 *
 * La distinction n'est pas rhétorique, elle est vérifiable : `/realisations/`
 * affirme que les photographies publiées proviennent de la page Facebook de
 * l'entreprise, et affiche leur nombre. Faire entrer ici une image d'une autre
 * origine rendrait cette phrase fausse et ce compte inexact. Ces entrées sont
 * donc dérivées et tracées comme les autres, mais ne produisent AUCUNE fiche
 * de collection : elles n'apparaissent ni dans la galerie, ni dans la rivière,
 * ni dans le décompte.
 *
 * `provenance` remplace ici l'URL de la page Facebook : chaque image dit d'où
 * elle vient réellement.
 */
export const HORS_PORTFOLIO = [
  {
    source: 'HERO.png',
    out: 'hero-pergola-lames-terrasse-piscine-crepuscule.jpg',
    provenance:
      'Visuel d’ambiance fourni par le client le 27 août 2026, hors publications Facebook. Non présenté comme une réalisation livrée.',
    legende: 'Pergola à lames au-dessus d’une terrasse de piscine, au crépuscule.',
    alt: 'Pergola à lames sombres au-dessus d’une terrasse de piscine à débordement au crépuscule, oliviers, mur en pierre et vallée en contrebas.'
  }
];

export const CATALOGUE = [
  /* ---- Réalisations à lames --------------------------------------------- */
  {
    source: 'facebook-1167612642050835545.jpg',
    out: 'pergola-lames-terrasse-repas-piscine.jpg',
    legende:
      'Pergola à lames au-dessus d’une terrasse aménagée en salle à manger et en salon, en bordure de piscine.',
    alt: 'Pergola à lames au-dessus d’une longue table et d’un salon d’extérieur, piscine à gauche et jardin en pente à l’arrière-plan.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique',
    vedette: true
  },
  {
    source: 'facebook-1167612642050835365.jpg',
    out: 'lames-contre-plongee-ciel.jpg',
    legende: 'Toiture à lames vue en contre-plongée, ossature et lames se détachant sur le ciel.',
    alt: 'Vue en contre-plongée d’une toiture à lames claires montrant l’ossature et l’espacement régulier des lames sur fond de ciel bleu.',
    categories: ['realisations', 'details'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-1167612642050835.jpg',
    out: 'cour-couverte-lames-eclairage-mural.jpg',
    legende:
      'Cour couverte par un plafond à lames sombres, avec bardage vertical et éclairage mural en applique.',
    alt: 'Cour couverte d’un plafond à lames sombres, bardage vertical à lattes sur les murs, appliques allumées et bacs plantés.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-117644254783451154.jpg',
    out: 'pergola-lames-salon-exterieur.jpg',
    crop: { left: 0, top: 0, width: 720, height: 740 },
    legende:
      'Pergola à lames au-dessus d’un salon d’extérieur, en prolongement direct de la pièce de vie.',
    alt: 'Pergola à lames sombres couvrant un salon d’extérieur en mobilier clair, ouvert sur une pièce de vie par de larges baies vitrées.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-1176442547834511534.jpg',
    out: 'terrasse-couverte-immeuble-soiree.jpg',
    crop: { left: 0, top: 0, width: 720, height: 592 },
    legende: 'Terrasse couverte au pied d’un immeuble résidentiel, en fin de journée.',
    alt: 'Terrasse de rez-de-chaussée couverte par une structure sombre le long d’un immeuble, mobilier tressé et éclairages allumés en fin de journée.',
    categories: ['realisations'],
    services: ['pergolas']
  },
  {
    source: 'facebook-134310890116787445.jpg',
    out: 'pergola-lames-salon-brasero.jpg',
    legende: 'Pergola à lames au-dessus d’un salon d’extérieur avec braséro, ouverte sur la pelouse.',
    alt: 'Pergola à lames sombres couvrant un salon d’extérieur avec canapés et table-braséro, mur sombre à gauche et pelouse arborée au fond.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-117644267450116554364.jpg',
    out: 'patio-lames-bois-banquettes.jpg',
    legende:
      'Patio fermé de murs blancs, couvert par une structure sombre à lames aspect bois, avec banquettes maçonnées.',
    alt: 'Patio aux murs blancs couvert d’une structure sombre à lames aspect bois, banquettes maçonnées plantées en bordure et sol en lames de bois.',
    categories: ['realisations'],
    services: ['pergolas']
  },
  {
    source: 'facebook-1179114280900671.jpg',
    out: 'sous-face-lames-bois-bord-bassin.jpg',
    legende: 'Sous-face à lames aspect bois vue depuis la terrasse, bassin en contrebas.',
    alt: 'Sous-face d’une couverture à lames aspect bois vue depuis le sol, poteau blanc au premier plan et petit bassin bleu en contrebas.',
    categories: ['realisations'],
    services: ['pergolas']
  },
  {
    source: 'facebook-1179114327567333.jpg',
    out: 'auvent-lames-bois-terrasse-volets.jpg',
    legende: 'Auvent à lames aspect bois au-dessus d’une terrasse, façade équipée de volets roulants.',
    alt: 'Vue en contre-plongée d’un auvent à lames aspect bois au-dessus d’une terrasse, façade blanche à volets roulants et mobilier de jardin.',
    categories: ['realisations'],
    services: ['abris']
  },
  {
    source: 'facebook-11791143275673331.jpg',
    out: 'plafond-lames-eclairage-integre.jpg',
    legende: 'Plafond à lames vu du dessous, avec bande lumineuse intégrée en périphérie.',
    alt: 'Plafond à lames sombres vu du dessous dans une courette, bande lumineuse intégrée en périphérie et façades blanches sur les côtés.',
    categories: ['realisations', 'details'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-1176442547834511425.jpg',
    out: 'pergola-lames-nuit-eclairee.jpg',
    legende: 'Pergola à lames claires éclairée de nuit, en limite d’une pièce de vie vitrée.',
    alt: 'Pergola à lames claires éclairée par en dessous à la tombée de la nuit, adossée à une maison dont les baies vitrées sont allumées.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique',
    vedette: true
  },
  {
    source: 'facebook-1180791237399642111.jpg',
    out: 'pergola-lames-nuit-jardin.jpg',
    legende: 'Pergola à lames éclairée en soirée, côté jardin.',
    alt: 'Pergola à lames sombres éclairée par une ligne lumineuse périphérique en soirée, adossée à une maison, pelouse au premier plan.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-1252423345.jpg',
    out: 'pergola-lames-claires-nuit-baies.jpg',
    legende: 'Pergola à lames claires éclairée de nuit devant une pièce de vie entièrement vitrée.',
    alt: 'Pergola à lames claires avec éclairage périphérique, de nuit, devant une pièce de vie vitrée et éclairée, gazon synthétique au sol.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-12174646370656351.jpg',
    out: 'espace-couvert-lames-eclairage-couleur.jpg',
    legende: 'Grand espace couvert par un plafond à lames, éclairage de couleur en soirée.',
    alt: 'Grand espace couvert par un plafond à lames sombres avec éclairage bleu en périphérie et sol éclairé en rose, arbres en bac de part et d’autre.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-45645435435225.jpg',
    out: 'salle-couverte-lames-eclairage-bleu.jpg',
    legende: 'Salle couverte par un plafond à lames, éclairage bleu intégré et façade vitrée.',
    alt: 'Salle couverte par un plafond à lames sombres avec éclairage bleu intégré, sol clair éclairé en violet, plantes en bac et façade vitrée au fond.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-456454354352.jpg',
    out: 'terrasse-restaurant-lames-claires.jpg',
    crop: { left: 0, top: 0, width: 720, height: 718 },
    legende: 'Terrasse de restaurant couverte par un plafond à lames claires, avec éclairage intégré.',
    alt: 'Terrasse de restaurant couverte d’un plafond à lames claires avec éclairage chaud intégré, tables et chaises en bois sur un sol en terre cuite.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-456454354352212.jpg',
    out: 'grande-terrasse-restaurant-lames.jpg',
    legende: 'Grande terrasse de restaurant couverte par une toiture à lames claires, en service.',
    alt: 'Grande terrasse de restaurant couverte par une toiture à lames claires, nombreuses tables et chaises occupées, haies taillées en bordure.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-4564543543521.jpg',
    out: 'terrasse-lames-bois-salon-vitre.jpg',
    legende:
      'Terrasse couverte par des lames aspect bois avec éclairage en corniche, ouverte sur un salon vitré.',
    alt: 'Terrasse couverte par un plafond à lames aspect bois avec éclairage en corniche, ouverte sur un salon vitré, immeubles à l’arrière-plan.',
    categories: ['realisations'],
    services: ['pergolas']
  },
  {
    source: 'facebook-4564543543522121.jpg',
    out: 'rooftop-lames-panneaux-vitres-mer.jpg',
    legende: 'Terrasse en toiture couverte par des lames, fermée par des panneaux vitrés, face à la mer.',
    alt: 'Terrasse en toiture couverte par une toiture à lames sombres et fermée par des panneaux vitrés teintés, avec vue sur la mer.',
    categories: ['realisations'],
    services: ['pergolas', 'verrieres'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-page-cover.jpg',
    out: 'pergola-lames-rooftop-terrasse-bois.jpg',
    legende: 'Pergola à lames indépendante sur une terrasse en toiture, avec panneaux latéraux vitrés.',
    alt: 'Pergola à lames sombres indépendante à deux travées sur une terrasse en toiture, panneaux latéraux vitrés et sol en lames de bois.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-52455356435412.jpg',
    out: 'terrasse-bois-lames-palmier-mer.jpg',
    legende: 'Terrasse en bois couverte par une toiture à lames, ouverte sur un palmier et la mer.',
    alt: 'Terrasse en lames de bois couverte par une toiture à lames claires portée par des poteaux sombres, ouverte sur un palmier et la mer.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-5245535643541.jpg',
    out: 'maison-deux-pergolas-lames-blanches.jpg',
    legende: 'Maison contemporaine équipée de deux pergolas à lames blanches au-dessus de ses ouvertures.',
    alt: 'Façade de maison contemporaine blanche équipée de deux pergolas à lames blanches au-dessus des ouvertures, pelouse au premier plan.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-524553564354.jpg',
    out: 'toiture-lames-bois-vue-dessus.jpg',
    legende: 'Toiture à lames aspect bois vue depuis l’étage supérieur.',
    alt: 'Toiture à lames aspect bois vue de dessus depuis un étage, montrant l’alignement des lames et les bâtiments voisins à l’arrière-plan.',
    categories: ['realisations', 'details'],
    services: ['pergolas']
  },
  {
    source: 'facebook-1235797128565719_.jpg',
    out: 'auvent-lames-balcon-ombres.jpg',
    legende: 'Auvent à lames au-dessus d’un balcon, dessinant des ombres régulières sur la façade.',
    alt: 'Auvent à lames blanches au-dessus d’un balcon à balustres, projetant des ombres régulières sur la façade blanche.',
    categories: ['realisations'],
    services: ['abris']
  },
  {
    source: 'facebook-1339318721546892.jpg',
    out: 'pergola-adossee-lames-terrasse-repas.jpg',
    crop: { left: 0, top: 0, width: 1200, height: 1120 },
    legende: 'Pergola adossée à lames claires au-dessus d’une terrasse repas.',
    alt: 'Pergola sombre adossée à une maison, lames claires vues par en dessous, au-dessus d’une terrasse repas.',
    categories: ['realisations'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },
  {
    source: 'facebook-1433944625417634.jpg',
    out: 'auvent-entree-sous-face-bois.jpg',
    crop: { left: 0, top: 0, width: 1533, height: 1560 },
    legende: 'Auvent d’entrée à sous-face couleur bois, avec structure verticale décorative.',
    alt: 'Auvent d’entrée sombre avec sous-face couleur bois et structure verticale décorative devant la porte d’une maison.',
    categories: ['realisations'],
    services: ['abris']
  },
  {
    source: 'facebook-1380841577394606.jpg',
    out: 'detail-sous-face-bois-auvent.jpg',
    crop: { left: 0, top: 292, width: 571, height: 500 },
    legende: 'Détail d’un auvent à sous-face aspect bois et poteaux décoratifs.',
    alt: 'Détail d’un auvent sombre avec sous-face à aspect bois et poteaux décoratifs ajourés.',
    categories: ['details'],
    services: ['abris']
  },

  /* ---- Vérandas et parois vitrées ---------------------------------------- */
  {
    source: 'facebook-12121212123345.jpg',
    out: 'veranda-vitree-lames-salon.jpg',
    legende:
      'Véranda vitrée coiffée d’une toiture à lames, aménagée en salon et ouverte sur le bassin.',
    alt: 'Véranda entièrement vitrée coiffée d’une toiture à lames sombres, salon en résine tressée, tronc de palmier au premier plan et bassin au fond.',
    categories: ['realisations'],
    services: ['verrieres'],
    gamme: 'verriere',
    vedette: true
  },
  {
    source: 'facebook-121212121233451.jpg',
    out: 'veranda-vitree-interieur-lames.jpg',
    legende: 'Intérieur d’une véranda vitrée sous toiture à lames, ouverte sur le jardin et le bassin.',
    alt: 'Intérieur d’une véranda vitrée sous une toiture à lames sombres, canapé en résine tressée à coussins orange, baies ouvertes sur un bassin.',
    categories: ['realisations'],
    services: ['verrieres'],
    gamme: 'verriere'
  },
  {
    source: 'facebook-1212121212334511.jpg',
    out: 'veranda-vitree-ombres-lames-sol.jpg',
    legende:
      'Véranda vitrée sous toiture à lames, les lames dessinant des ombres régulières sur le sol.',
    alt: 'Véranda vitrée sous une toiture à lames sombres, ombres régulières des lames sur le sol carrelé, galets et pas japonais à l’extérieur.',
    categories: ['realisations'],
    services: ['verrieres'],
    gamme: 'verriere'
  },
  {
    source: 'facebook-22452354354345.jpg',
    out: 'veranda-ossature-sombre-baies-coulissantes.jpg',
    legende: 'Véranda à ossature sombre et baies coulissantes, coiffée d’une toiture à lames claires.',
    alt: 'Véranda à ossature sombre fermée par des baies coulissantes vitrées, toiture à lames claires, claustra de bois à l’intérieur et champ au fond.',
    categories: ['realisations', 'chantiers'],
    services: ['verrieres'],
    gamme: 'verriere'
  },
  {
    source: 'facebook-117911432756733312.jpg',
    out: 'veranda-claustras-bois-en-cours.jpg',
    legende: 'Véranda à ossature sombre et claustras de bois, en cours d’aménagement.',
    alt: 'Véranda à ossature sombre avec plafond à lames claires et claustras de bois verticaux, madriers posés au sol pendant l’aménagement.',
    categories: ['chantiers'],
    services: ['verrieres'],
    gamme: 'verriere'
  },

  /* ---- Toiles tendues et parties mobiles --------------------------------- */
  {
    source: 'facebook-1246196570859108.jpg',
    out: 'toile-plissee-ossature-bois.jpg',
    legende: 'Toile plissée tendue sur une ossature, vue par en dessous.',
    alt: 'Toile beige plissée en accordéon tendue sur une ossature, vue par en dessous sur fond de ciel bleu et de nuages.',
    categories: ['realisations', 'details'],
    services: ['pergolas'],
    gamme: 'toile',
    vedette: true
  },
  {
    source: 'facebook-1180791237399642.jpg',
    out: 'voile-tendue-entre-murs.jpg',
    legende: 'Voile tendue entre deux murs au-dessus d’une terrasse.',
    alt: 'Voile d’ombrage beige tendue en pointe entre deux murs blancs au-dessus d’une terrasse, vue en contre-plongée.',
    categories: ['realisations'],
    services: ['abris'],
    gamme: 'toile'
  },
  {
    source: 'facebook-1180987314046701.jpg',
    out: 'toile-tendue-angle-terrasse.jpg',
    legende: 'Toile tendue couvrant l’angle d’une terrasse, le long d’une façade à volets.',
    alt: 'Toile claire tendue couvrant l’angle d’une terrasse le long d’une façade blanche à volet roulant, vue en contre-plongée.',
    categories: ['realisations'],
    services: ['abris'],
    gamme: 'toile'
  },
  {
    source: 'facebook-1179114280900671212.jpg',
    out: 'toile-tendue-passage-lateral.jpg',
    legende: 'Toile tendue couvrant un passage latéral entre le mur et le jardin.',
    alt: 'Toile claire tendue sur une ossature couvrant un passage latéral le long d’un mur blanc, olivier et bande de gazon au premier plan.',
    categories: ['realisations'],
    services: ['abris'],
    gamme: 'toile'
  },
  {
    source: 'facebook-4564543543522.jpg',
    out: 'toile-repliable-sur-rails.jpg',
    legende: 'Couverture en toile repliable sur rails, vue par en dessous en position déployée.',
    alt: 'Couverture en toile sombre repliable sur rails vue par en dessous en position déployée, au-dessus d’un passage commercial.',
    categories: ['realisations', 'details'],
    services: ['pergolas'],
    gamme: 'toile'
  },
  {
    source: 'facebook-45645435435221.jpg',
    out: 'toile-repliee-corniche-lumineuse.jpg',
    legende: 'Toile repliée en attente, sous une corniche lumineuse.',
    alt: 'Couverture en toile sombre repliée le long de son rail sous une corniche lumineuse, écran enroulable descendu sur le côté droit.',
    categories: ['details'],
    services: ['pergolas'],
    gamme: 'toile'
  },
  {
    source: 'facebook-1176442674501165544.jpg',
    out: 'marquise-cintree-passage-jardin.jpg',
    legende: 'Marquise cintrée fixée en façade au-dessus d’un passage de jardin.',
    alt: 'Marquise cintrée translucide fixée en façade au-dessus d’un passage dallé, jardin et pelouse de part et d’autre.',
    categories: ['realisations'],
    services: ['abris']
  },
  {
    source: 'facebook-117911428090067112.jpg',
    out: 'marquise-cintree-entree-principale.jpg',
    legende: 'Marquise cintrée au-dessus de l’allée menant à l’entrée principale.',
    alt: 'Marquise cintrée translucide couvrant l’allée qui mène à une porte d’entrée en bois, mur blanc et pelouse de part et d’autre.',
    categories: ['realisations', 'chantiers'],
    services: ['abris']
  },

  /* ---- Couvertures pleines ----------------------------------------------- */
  {
    source: 'facebook-11244545453.jpg',
    out: 'couverture-pleine-pose-toiture.jpg',
    legende: 'Pose d’une couverture pleine sur une ossature, en toiture.',
    alt: 'Deux personnes posant des panneaux de couverture nervurés sur une ossature métallique en toiture, ville à l’horizon.',
    categories: ['chantiers'],
    services: ['abris'],
    gamme: 'fixe'
  },
  {
    source: 'facebook-11809873140467011.jpg',
    out: 'couverture-pleine-terrasse-toiture.jpg',
    legende: 'Couverture pleine en cours de pose sur une terrasse en toiture.',
    alt: 'Ouvrier debout sur une couverture pleine nervurée en cours de pose sur une terrasse en toiture, ville à l’horizon.',
    categories: ['chantiers'],
    services: ['abris'],
    gamme: 'fixe'
  },
  {
    source: 'facebook-1436625815149515.jpg',
    out: 'pose-couverture-bord-de-piscine.jpg',
    crop: { left: 0, top: 0, width: 1152, height: 1430 },
    legende: 'Pose d’une couverture à sous-face bois au bord d’une piscine, avec engin de levage.',
    alt: 'Pose d’une couverture sombre à sous-face bois au bord d’une piscine, engin de levage et ouvriers sur la structure.',
    categories: ['chantiers'],
    services: ['abris']
  },
  {
    source: 'facebook-1235797691898996.jpg',
    out: 'auvent-lames-balcon-en-cours.jpg',
    legende: 'Auvent à lames en cours de pose au-dessus d’un balcon.',
    alt: 'Auvent à lames blanches en cours de pose au-dessus d’un balcon, échelles appuyées contre la façade de l’immeuble.',
    categories: ['chantiers'],
    services: ['abris']
  },

  /* ---- Chantiers --------------------------------------------------------- */
  {
    source: 'facebook-1317571683721596.jpg',
    out: 'structure-en-cours-de-pose-cour.jpg',
    legende: 'Structure en cours de pose dans une cour, équipe et matériel visibles.',
    alt: 'Structure sombre en cours de pose dans une cour, étais, échelle et membres de l’équipe autour du chantier.',
    categories: ['chantiers'],
    services: ['pergolas']
  },
  {
    source: 'facebook-1343108901167874.jpg',
    out: 'grande-structure-claire-vue-large.jpg',
    crop: { left: 0, top: 0, width: 2040, height: 830 },
    legende: 'Grande structure claire en cours de pose, vue large.',
    alt: 'Grande structure claire en cours de pose au-dessus d’une cour, vue large horizontale montrant toute la portée.',
    categories: ['chantiers'],
    services: ['pergolas']
  },
  {
    source: 'facebook-1343108934501204.jpg',
    out: 'structure-claire-vue-etage.jpg',
    crop: { left: 0, top: 0, width: 1533, height: 1640 },
    legende: 'Structure claire vue depuis un étage pendant le chantier.',
    alt: 'Structure claire à lames vue depuis un étage pendant le chantier, au-dessus d’une cour en travaux.',
    categories: ['chantiers'],
    services: ['pergolas']
  },
  {
    source: 'facebook-1343108994501198.jpg',
    out: 'detail-structure-claire-chantier.jpg',
    crop: { left: 0, top: 0, width: 1533, height: 1560 },
    legende: 'Détail sous une grande structure claire, chantier en cours.',
    alt: 'Détail sous une grande structure claire à lames, échelle et matériel de chantier visibles au sol.',
    categories: ['chantiers', 'details'],
    services: ['pergolas']
  },
  {
    source: 'facebook-1176442547834511.jpg',
    out: 'ossature-claire-terrasse-villa.jpg',
    legende: 'Ossature claire posée au-dessus de la terrasse d’une villa.',
    alt: 'Ossature claire à lames posée au-dessus de la terrasse d’une villa, échelles en place et ciel dégagé.',
    categories: ['chantiers'],
    services: ['pergolas']
  },
  {
    source: 'facebook-1176442674501165.jpg',
    out: 'ossature-claire-palmiers-en-cours.jpg',
    legende: 'Ossature claire en cours de pose, dans un jardin planté de palmiers.',
    alt: 'Ossature claire à lames en cours de pose au-dessus d’une terrasse, palmiers et bâtiment à l’arrière-plan, échelle appuyée à la structure.',
    categories: ['chantiers'],
    services: ['pergolas']
  },
  {
    source: 'facebook-1176442674501165474.jpg',
    out: 'montage-ossature-echafaudage.jpg',
    legende: 'Montage d’une ossature claire depuis un échafaudage roulant.',
    alt: 'Montage d’une ossature claire depuis un échafaudage roulant, palmiers et espace planté à l’arrière-plan.',
    categories: ['chantiers'],
    services: ['pergolas']
  },
  {
    source: 'facebook-1190229206455845.jpg',
    out: 'pose-structure-claire-jardin-hotel.jpg',
    legende: 'Pose d’une structure claire au-dessus d’une terrasse, dans un jardin planté.',
    alt: 'Pose d’une structure claire au-dessus d’une longue terrasse, ouvriers sur la toiture et sur une échelle, palmiers et transats sur la pelouse.',
    categories: ['chantiers'],
    services: ['pergolas']
  },
  {
    source: 'facebook-1207881681357264.jpg',
    out: 'pose-ossature-terrasse-immeuble.jpg',
    legende: 'Pose d’une ossature claire sur la terrasse d’un immeuble.',
    alt: 'Ouvrier posant une ossature claire sur la terrasse d’un immeuble, jardinière plantée en bordure et façades voisines à l’arrière-plan.',
    categories: ['chantiers'],
    services: ['pergolas']
  },
  {
    source: 'facebook-11807912373996421.jpg',
    out: 'assemblage-ossature-toiture-ville.jpg',
    legende: 'Assemblage d’une ossature en toiture, au-dessus de la ville.',
    alt: 'Deux personnes assemblant une ossature métallique sur une terrasse en toiture, ville et voie rapide à l’arrière-plan.',
    categories: ['chantiers'],
    services: ['pergolas']
  },
  {
    source: 'facebook-1217464637065635.jpg',
    out: 'pose-auvent-facade-ancienne.jpg',
    legende: 'Pose d’un auvent clair contre une façade ancienne.',
    alt: 'Ouvrier sur une échelle posant un auvent clair contre une façade ancienne à moulures, unité de climatisation fixée au mur.',
    categories: ['chantiers'],
    services: ['abris']
  },
  {
    source: 'facebook-1217473703731395.jpg',
    out: 'pose-structure-patio-arcades.jpg',
    legende: 'Pose d’une structure dans un patio à arcades.',
    alt: 'Ouvrier sur une échelle posant une structure dans un patio à arcades, plantes en pot au premier plan.',
    categories: ['chantiers'],
    services: ['abris']
  },
  {
    source: 'facebook-332323231.jpg',
    out: 'pose-pergola-lames-claires-jardin.jpg',
    legende: 'Pergola à lames claires en cours de pose au-dessus d’une terrasse de jardin.',
    alt: 'Pergola à lames claires en cours de pose au-dessus d’une terrasse, caisse à outils et matériel posés sur la couverture.',
    categories: ['chantiers'],
    services: ['pergolas']
  },
  {
    source: 'facebook-1176442547834511142.jpg',
    out: 'structure-lames-bois-protections.jpg',
    legende: 'Structure à sous-face bois en fin de pose, poteaux encore sous protection.',
    alt: 'Structure sombre à sous-face aspect bois en fin de pose, poteaux encore enveloppés de film de protection devant un mur en parpaings.',
    categories: ['chantiers'],
    services: ['pergolas']
  },
  {
    source: 'facebook-117911432756733321.jpg',
    out: 'ossature-cintree-avant-levage.jpg',
    legende: 'Ossature cintrée posée au sol avant levage.',
    alt: 'Ossature cintrée claire posée au sol sur une pelouse avant levage, échelle rouge appuyée contre le mur.',
    categories: ['chantiers'],
    services: ['abris']
  },

  /* ---- Préparation et détails techniques --------------------------------- */
  {
    source: 'facebook-116761264205083544.jpg',
    out: 'ensemble-lames-avant-pose.jpg',
    legende: 'Ensemble de lames assemblé à plat, avant transport et pose.',
    alt: 'Ensemble de lames claires assemblé à plat au sol dans un local, rayonnages et matériel rangés à l’arrière-plan.',
    categories: ['chantiers', 'details'],
    services: ['pergolas']
  },
  {
    source: 'facebook-1176442674501165445.jpg',
    out: 'ensemble-lames-a-plat-local.jpg',
    legende: 'Ensemble de lames posé à plat, prêt à être repris.',
    alt: 'Grand ensemble de lames métalliques posé à plat au sol dans un local, mur sombre et étagères à l’arrière-plan.',
    categories: ['chantiers', 'details'],
    services: ['pergolas']
  },
  {
    source: 'facebook-11791142809006711.jpg',
    out: 'profiles-avant-assemblage.jpg',
    legende: 'Profilés rangés avant assemblage.',
    alt: 'Faisceau de profilés sombres rangés côte à côte avant assemblage, vus en enfilade.',
    categories: ['details'],
    services: ['pergolas']
  },
  {
    source: 'facebook-11809873140467014545.jpg',
    out: 'detail-articulation-lame.jpg',
    legende: 'Détail de l’articulation d’une lame et de la tringle qui la commande.',
    alt: 'Détail en noir et blanc de l’articulation boulonnée d’une lame et de la tringle qui commande son basculement.',
    categories: ['details'],
    services: ['pergolas'],
    gamme: 'bioclimatique',
    vedette: true
  },
  {
    source: 'facebook-5245535643542.jpg',
    out: 'detail-lames-ciel.jpg',
    legende: 'Détail des lames et de leur profil, vues à contre-jour.',
    alt: 'Détail rapproché de lames claires vues à contre-jour sur fond de ciel bleu, au-dessus d’une couverture nervurée sombre.',
    categories: ['details'],
    services: ['pergolas'],
    gamme: 'bioclimatique'
  },

  /* ---- Conception -------------------------------------------------------- */
  {
    source: 'facebook-plan.jpg',
    out: 'etude-relevee-sur-site.jpg',
    legende: 'Étude tracée sur une vue du site existant, avec les cotes relevées.',
    alt: 'Étude au trait tracée par-dessus une photographie du site existant, montrant l’implantation de la structure et les cotes relevées.',
    categories: ['conception'],
    services: [],
    gamme: 'conception',
    vedette: true
  },
  {
    source: 'facebook-52455356435447.jpg',
    out: 'projection-structure-longue-terrasse.jpg',
    legende: 'Projection d’une structure longue au-dessus d’une terrasse, avant réalisation.',
    alt: 'Projection en volume d’une structure sombre à lames couvrant une longue terrasse avec banquettes, le long d’un bâtiment clair.',
    categories: ['conception'],
    services: [],
    gamme: 'conception'
  },
  {
    source: 'facebook-524553564354471.jpg',
    out: 'projection-abri-jardin-banquettes.jpg',
    legende: 'Projection d’un abri au-dessus d’un espace de repos en jardin.',
    alt: 'Projection en volume d’un abri sombre à couverture pleine au-dessus d’un espace de repos avec banquettes, sur une pelouse plantée de palmiers.',
    categories: ['conception'],
    services: [],
    gamme: 'conception'
  },
  {
    source: 'facebook-524553564354472.jpg',
    out: 'projection-structure-espace-partage.jpg',
    legende: 'Projection d’une structure au-dessus d’un espace partagé.',
    alt: 'Projection en volume d’une structure sombre à lames au-dessus d’un espace partagé avec bancs et cheminements, haies et palmiers en bordure.',
    categories: ['conception'],
    services: [],
    gamme: 'conception'
  }
];

export default CATALOGUE;
