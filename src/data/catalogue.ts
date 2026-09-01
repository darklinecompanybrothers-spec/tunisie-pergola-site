/**
 * Le catalogue — onze familles, cinquante ouvrages.
 * =================================================
 *
 * CE QUE CE FICHIER EST
 * La liste des cinquante ouvrages confirmés par le client le 1er septembre
 * 2026 (CLIENT-BRIEF.md §2 quater), organisée en onze familles éditoriales.
 * C'est la source unique : la navigation, les pages de famille, le formulaire,
 * le plan du site, le maillage interne et le contrôle de build lisent tous
 * cette structure. Un ouvrage ajouté ici apparaît partout; un ouvrage retiré
 * disparaît partout, y compris des listes déroulantes du formulaire.
 *
 * POURQUOI ONZE PAGES ET NON CINQUANTE
 * Cinquante pages produites par permutation d'un même gabarit seraient
 * cinquante pages faibles : même intention de recherche, même contenu à un
 * nom près, aucune matière propre. Les onze familles, elles, correspondent
 * chacune à une intention distincte, à un usage distinct et à une décision
 * distincte du côté du client. Chaque ouvrage y est nommé, visible et
 * indexable — et le formulaire permet de le choisir nommément, ce qui est le
 * seul endroit où le grain fin sert réellement à quelque chose.
 *
 * Un ouvrage pourra obtenir sa propre page le jour où il aura ce qu'une page
 * exige : des photographies de chantier qui le montrent, un projet identifié,
 * des données techniques confirmées et une intention de recherche que sa
 * famille ne couvre pas déjà. La structure ci-dessous le permet sans
 * réécriture — il suffira d'ajouter une route à la famille.
 *
 * CE QUE CE FICHIER N'EST PAS
 * Un argumentaire. Aucune performance, aucun matériau non confirmé, aucun
 * délai présenté comme un engagement, aucun prix. Les seuls faits techniques
 * publiables sont ceux de `site.config.mjs`.
 */
import type { Bilingual } from '../i18n/locales';
import { FAMILY_ROUTES, PRODUCT_COUNT as SHARED_COUNT } from './routes.mjs';

/** Motif de la plaque dessinée qui ouvre une famille sans photographie. */
export type Motif =
  | 'porte'
  | 'portail'
  | 'fenetre'
  | 'garde-corps'
  | 'escalier'
  | 'pergola'
  | 'abri'
  | 'cloture'
  | 'verriere'
  | 'structure'
  | 'mobilier';

/**
 * Routes des familles, en littéraux.
 *
 * Le type est écrit à la main plutôt que dérivé du tableau : `pages.ts` en
 * a besoin AVANT que `FAMILIES` ne soit évalué, et c'est cette liste qui rend
 * les routes vérifiables par le compilateur partout ailleurs. Une famille
 * ajoutée sans sa route ici ne compile pas.
 */
export type FamilyRoute =
  | '/portes-metalliques/'
  | '/portails-metalliques/'
  | '/fenetres-grilles-metalliques/'
  | '/garde-corps-rampes/'
  | '/escaliers-metalliques/'
  | '/pergolas/'
  | '/abris/'
  | '/clotures-palissades/'
  | '/verrieres/'
  | '/structures-metalliques/'
  | '/mobilier-ferronnerie-artistique/';

/** Clés des familles, en littéraux — même raison que `FamilyRoute`. */
export type FamilyKey =
  | 'portes'
  | 'portails'
  | 'fenetres'
  | 'garde-corps'
  | 'escaliers'
  | 'pergolas'
  | 'abris'
  | 'clotures'
  | 'verrieres'
  | 'structures'
  | 'mobilier';

export interface Product {
  /** Rang dans le relevé client. Il ne bouge pas : c'est la trace de la source. */
  readonly n: number;
  readonly nom: Bilingual;
}

export interface Question {
  readonly q: Bilingual;
  readonly r: Bilingual;
}

export interface Family {
  readonly key: FamilyKey;
  /** Route française canonique. L'arabe est la même, préfixée par `/ar`. */
  readonly route: FamilyRoute;
  readonly index: string;
  readonly motif: Motif;
  /** Trame de la tête de page. */
  readonly theme: 'slats' | 'glass' | 'shelter' | 'grid' | 'forge';
  readonly nom: Bilingual;
  readonly h1: Bilingual;
  readonly lede: Bilingual;
  readonly intro: Bilingual<readonly string[]>;
  /** Titre de la section des usages — propre à la famille, jamais générique. */
  readonly usagesTitle: Bilingual;
  readonly usages: Bilingual<readonly string[]>;
  readonly products: readonly Product[];
  readonly questions: readonly Question[];
  /** Familles voisines — le maillage interne, dans les deux sens. */
  readonly voisines: readonly FamilyKey[];
  /** Facette de la galerie, quand des photographies existent pour la famille. */
  readonly gallery?: 'pergolas' | 'verrieres' | 'abris';
}

/* -------------------------------------------------------------------------
   Réponses factuelles partagées
   Elles viennent toutes de faits confirmés. Plutôt que de les recopier onze
   fois — ce qui produirait onze pages à moitié identiques — chaque famille en
   reprend au plus une, et pose ses propres questions pour le reste.
   ------------------------------------------------------------------------- */
const QUESTION_MESURE: Question = {
  q: {
    fr: 'Faut-il des cotes exactes pour demander une étude ?',
    ar: 'هل تلزم أبعاد دقيقة لطلب دراسة؟'
  },
  r: {
    fr: 'Non. Une estimation suffit pour cadrer la demande — « environ 3 m sur 2,20 m » se traite très bien. Les cotes exactes se relèvent sur place, et ce relevé fait partie de l’étude.',
    ar: 'لا. يكفي تقدير تقريبي لتأطير الطلب — «حوالي 3 م في 2,20 م» يكفي تمامًا. أمّا الأبعاد الدقيقة فتُؤخذ في الموقع، وهذا القياس جزء من الدراسة.'
  }
};

const QUESTION_POSE: Question = {
  q: {
    fr: 'La pose est-elle assurée par la même équipe ?',
    ar: 'هل يتولّى التركيب الفريق نفسه؟'
  },
  r: {
    fr: 'Oui. Conception, fabrication, finition, livraison et pose relèvent du même interlocuteur : c’est ce qui évite qu’une cote se perde entre deux corps de métier.',
    ar: 'نعم. التصميم والتصنيع والتشطيب والتسليم والتركيب كلّها لدى المخاطب نفسه: وهذا ما يمنع ضياع قياس بين حرفتين.'
  }
};

/* -------------------------------------------------------------------------
   Les onze familles
   ------------------------------------------------------------------------- */
export const FAMILIES: readonly Family[] = [
  {
    key: 'portes',
    route: '/portes-metalliques/',
    index: '01',
    motif: 'porte',
    theme: 'forge',
    nom: { fr: 'Portes métalliques', ar: 'الأبواب المعدنية' },
    h1: {
      fr: 'Portes métalliques sur mesure.',
      ar: 'أبواب معدنية حسب الطلب.'
    },
    lede: {
      fr: 'Une porte se mesure à ce qu’elle sépare : une entrée de maison, un local technique, un quai de livraison. Le vantail, le cadre et la manœuvre se décident ensemble.',
      ar: 'يُقاس الباب بما يفصله: مدخل منزل، أو محلّ تقني، أو رصيف تسليم. المصراع والإطار وطريقة الفتح تُقرَّر معًا.'
    },
    intro: {
      fr: [
        'Une porte métallique est d’abord une géométrie : une ouverture existante, un sens de passage, une manœuvre possible. Battante quand la place devant est libre, coulissante quand elle ne l’est pas, sectionnelle ou basculante quand c’est la hauteur sous linteau qui commande.',
        'Chaque vantail est fabriqué pour son ouverture. Les remplissages — tôle pleine, barreaudage, panneaux, motifs de ferronnerie — se choisissent selon ce que la porte doit laisser passer : de la lumière, de l’air, un regard, ou rien.'
      ],
      ar: [
        'الباب المعدني هندسةٌ قبل كلّ شيء: فتحة قائمة، واتجاه مرور، وطريقة فتح ممكنة. مفصليّ حين تكون المساحة أمامه خالية، ومنزلق حين لا تكون، وقطاعيّ أو قلّاب حين يكون الارتفاع تحت العتبة هو الحاكم.',
        'يُصنع كلّ مصراع لفتحته. أمّا الحشوات — صفيحة كاملة أو قضبان أو ألواح أو زخارف حدادة — فتُختار حسب ما يجب أن يمرّ عبر الباب: ضوء، أو هواء، أو نظرة، أو لا شيء.'
      ]
    },
    usagesTitle: { fr: 'Là où une porte doit tenir.', ar: 'حيث يجب أن يصمد الباب.' },
    usages: {
      fr: [
        'Entrée de villa et porte de service',
        'Local technique, réserve, chaufferie',
        'Accès industriel et quai de livraison',
        'Garage individuel ou collectif'
      ],
      ar: [
        'مدخل فيلا وباب خدمة',
        'محلّ تقني ومخزن وغرفة تدفئة',
        'مدخل صناعي ورصيف تسليم',
        'مرآب فردي أو جماعي'
      ]
    },
    products: [
      { n: 1, nom: { fr: 'Portes métalliques sur mesure', ar: 'أبواب معدنية حسب الطلب' } },
      { n: 2, nom: { fr: 'Portes en fer forgé', ar: 'أبواب من الحديد المطاوع' } },
      { n: 3, nom: { fr: 'Portes d’entrée métalliques', ar: 'أبواب مداخل معدنية' } },
      { n: 4, nom: { fr: 'Portes blindées métalliques', ar: 'أبواب مصفّحة معدنية' } },
      { n: 5, nom: { fr: 'Portes coulissantes métalliques', ar: 'أبواب معدنية منزلقة' } },
      { n: 6, nom: { fr: 'Portes battantes métalliques', ar: 'أبواب معدنية مفصلية' } },
      { n: 7, nom: { fr: 'Portes industrielles métalliques', ar: 'أبواب صناعية معدنية' } },
      { n: 8, nom: { fr: 'Portes de garage métalliques', ar: 'أبواب مرآب معدنية' } },
      { n: 9, nom: { fr: 'Portes sectionnelles', ar: 'أبواب قطاعية' } },
      { n: 10, nom: { fr: 'Portes basculantes', ar: 'أبواب قلّابة' } }
    ],
    questions: [
      {
        q: {
          fr: 'Coulissante ou battante : qu’est-ce qui décide ?',
          ar: 'منزلق أم مفصليّ: ما الذي يحسم؟'
        },
        r: {
          fr: 'La place disponible, d’abord. Une porte battante a besoin d’un débattement libre devant ou derrière elle; une coulissante a besoin d’un mur de refoulement sur le côté. Quand ni l’un ni l’autre n’existe, on regarde du côté des portes sectionnelles ou basculantes.',
          ar: 'المساحة المتوفّرة أوّلًا. الباب المفصليّ يحتاج مجالًا حرًّا أمامه أو خلفه، والمنزلق يحتاج جدارًا جانبيًا ينزلق عليه. وحين لا يتوفّر أيّ منهما، نتّجه إلى الأبواب القطاعية أو القلّابة.'
        }
      },
      QUESTION_MESURE
    ],
    voisines: ['portails', 'fenetres', 'structures']
  },

  {
    key: 'portails',
    route: '/portails-metalliques/',
    index: '02',
    motif: 'portail',
    theme: 'grid',
    nom: { fr: 'Portails métalliques', ar: 'البوابات المعدنية' },
    h1: {
      fr: 'Portails métalliques et automatismes.',
      ar: 'بوابات معدنية وأنظمة فتح آلي.'
    },
    lede: {
      fr: 'Le portail est la première pièce que l’on voit d’une propriété et la plus manipulée. Sa manœuvre compte autant que son dessin.',
      ar: 'البوابة أوّل ما يُرى من الملك وأكثر ما يُستعمل. طريقة فتحها لا تقلّ أهمّية عن شكلها.'
    },
    intro: {
      fr: [
        'Un portail travaille tous les jours, souvent plusieurs fois par jour. C’est ce qui met la manœuvre au premier plan : coulissant le long d’une clôture quand l’allée est courte, battant à deux vantaux quand le recul existe, motorisé quand l’usage le demande.',
        'Le dessin vient ensuite, et il n’est pas indifférent : c’est lui qui accorde le portail à la façade et à la clôture qui le prolonge. Barreaudage vertical, tôle pleine, remplissage partiel, ferronnerie ouvragée — le choix se fait avec la clôture, pas séparément.'
      ],
      ar: [
        'تشتغل البوابة كلّ يوم، وغالبًا مرّات في اليوم. لذلك تتقدّم طريقة الفتح على ما عداها: منزلقة على امتداد السياج حين يكون الممرّ قصيرًا، ومفصلية بمصراعين حين يتوفّر التراجع، وآلية حين يقتضي الاستعمال ذلك.',
        'ثم يأتي التصميم، وهو ليس تفصيلًا: به تنسجم البوابة مع الواجهة ومع السياج الذي يمتدّ منها. قضبان عمودية، أو صفيحة كاملة، أو حشو جزئي، أو حدادة مزخرفة — ويُحسم الاختيار مع السياج لا بمعزل عنه.'
      ]
    },
    usagesTitle: { fr: 'Ce que le portail ouvre.', ar: 'ما تفتحه البوابة.' },
    usages: {
      fr: [
        'Entrée de villa et de résidence',
        'Accès de copropriété',
        'Entrée d’entreprise ou de dépôt',
        'Portail piéton accolé au portail véhicule'
      ],
      ar: [
        'مدخل فيلا وإقامة سكنية',
        'مدخل عمارة مشتركة',
        'مدخل مؤسسة أو مستودع',
        'باب للمشاة ملاصق لبوابة السيارات'
      ]
    },
    products: [
      { n: 11, nom: { fr: 'Portails métalliques', ar: 'بوابات معدنية' } },
      { n: 12, nom: { fr: 'Portails en fer forgé', ar: 'بوابات من الحديد المطاوع' } },
      { n: 13, nom: { fr: 'Portails coulissants', ar: 'بوابات منزلقة' } },
      { n: 14, nom: { fr: 'Portails battants', ar: 'بوابات مفصلية' } },
      { n: 15, nom: { fr: 'Portails automatiques', ar: 'بوابات أوتوماتيكية' } }
    ],
    questions: [
      {
        q: {
          fr: 'Un portail peut-il être motorisé après coup ?',
          ar: 'هل يمكن أتمتة البوابة لاحقًا؟'
        },
        r: {
          fr: 'C’est une question à poser avant la fabrication, pas après : un portail prévu pour recevoir une motorisation n’a pas la même ossature, ni les mêmes réservations, qu’un portail manuel. Dites-le dès la demande, même si l’installation vient plus tard.',
          ar: 'هذا سؤال يُطرح قبل التصنيع لا بعده: البوابة المهيّأة لاستقبال محرّك ليس لها الهيكل نفسه ولا التجهيزات نفسها التي للبوابة اليدوية. اذكر ذلك منذ الطلب، حتى إن جاء التركيب لاحقًا.'
        }
      },
      QUESTION_POSE
    ],
    voisines: ['portes', 'clotures', 'fenetres']
  },

  {
    key: 'fenetres',
    route: '/fenetres-grilles-metalliques/',
    index: '03',
    motif: 'fenetre',
    theme: 'glass',
    nom: { fr: 'Fenêtres et grilles métalliques', ar: 'النوافذ وحماية الفتحات' },
    h1: {
      fr: 'Fenêtres métalliques et grilles de protection.',
      ar: 'نوافذ معدنية وقضبان حماية.'
    },
    lede: {
      fr: 'Une ouverture pose deux questions à la fois : combien de lumière elle laisse entrer, et ce qu’elle laisse passer d’autre. Le métal répond aux deux.',
      ar: 'تطرح الفتحة سؤالين في آن: كم من الضوء تُدخل، وماذا تُمرّر غير ذلك. والمعدن يجيب عن الاثنين.'
    },
    intro: {
      fr: [
        'Les châssis métalliques permettent des profils fins et de grandes portées, donc plus de vitrage pour une même ouverture. C’est ce qui explique leur retour dans l’architecture contemporaine comme dans la rénovation de bâtiments anciens.',
        'Les grilles relèvent de la même famille parce qu’elles se dessinent avec l’ouverture, jamais contre elle. Une grille bien conçue se lit comme un élément de façade — pas comme un ajout posé après coup.'
      ],
      ar: [
        'تسمح الأطر المعدنية بمقاطع رفيعة ومسافات واسعة، أي زجاج أكثر لنفس الفتحة. وهذا ما يفسّر عودتها في العمارة المعاصرة كما في ترميم المباني القديمة.',
        'وتنتمي قضبان الحماية إلى العائلة نفسها لأنّها تُرسم مع الفتحة لا ضدّها. القضبان المدروسة تُقرأ كعنصر من الواجهة، لا كإضافة وُضعت بعد الإنجاز.'
      ]
    },
    usagesTitle: { fr: 'Une ouverture, deux exigences.', ar: 'فتحة واحدة، ومطلبان.' },
    usages: {
      fr: [
        'Châssis fixes et ouvrants sur mesure',
        'Protection de fenêtres en rez-de-chaussée',
        'Grilles de soupirail et de local technique',
        'Rénovation d’ouvertures existantes'
      ],
      ar: [
        'أطر ثابتة وأخرى قابلة للفتح حسب الطلب',
        'حماية نوافذ الطابق الأرضي',
        'قضبان منافذ التهوية والمحلات التقنية',
        'ترميم فتحات قائمة'
      ]
    },
    products: [
      { n: 16, nom: { fr: 'Fenêtres métalliques', ar: 'نوافذ معدنية' } },
      { n: 17, nom: { fr: 'Fenêtres en fer forgé', ar: 'نوافذ من الحديد المطاوع' } },
      { n: 18, nom: { fr: 'Fenêtres métalliques sur mesure', ar: 'نوافذ معدنية حسب الطلب' } },
      { n: 19, nom: { fr: 'Grilles de fenêtres', ar: 'قضبان حماية النوافذ' } },
      { n: 20, nom: { fr: 'Grilles de sécurité métalliques', ar: 'شبكات حماية معدنية' } }
    ],
    questions: [
      {
        q: {
          fr: 'Une grille peut-elle s’adapter à une fenêtre déjà posée ?',
          ar: 'هل يمكن تكييف قضبان الحماية مع نافذة مركّبة سلفًا؟'
        },
        r: {
          fr: 'Oui : c’est même le cas le plus fréquent. Le relevé porte alors sur le tableau de la baie, la nature du support et le sens d’ouverture du châssis existant, pour que la grille ne bloque ni la manœuvre ni le nettoyage.',
          ar: 'نعم، بل هذه هي الحالة الأكثر شيوعًا. عندئذٍ يشمل القياس حافّة الفتحة وطبيعة الحامل واتجاه فتح الإطار القائم، حتى لا تعيق القضبان لا الفتح ولا التنظيف.'
        }
      },
      QUESTION_MESURE
    ],
    voisines: ['portes', 'verrieres', 'garde-corps']
  },

  {
    key: 'garde-corps',
    route: '/garde-corps-rampes/',
    index: '04',
    motif: 'garde-corps',
    theme: 'slats',
    nom: { fr: 'Garde-corps et rampes', ar: 'الدرابزين ومساند السلالم' },
    h1: {
      fr: 'Garde-corps de balcon, d’escalier et rampes.',
      ar: 'درابزين الشرفات والسلالم ومساند اليد.'
    },
    lede: {
      fr: 'Un garde-corps borde un vide. C’est la pièce la plus touchée d’un bâtiment, et celle qui se voit depuis la rue.',
      ar: 'يحدّ الدرابزين فراغًا. وهو أكثر قطعة تُلمس في المبنى، وأكثرها ظهورًا من الشارع.'
    },
    intro: {
      fr: [
        'Balcon, terrasse, mezzanine, palier, escalier : partout où il y a une rupture de niveau, il y a un garde-corps. Sa hauteur et son remplissage se décident avec l’usage du lieu et le règlement applicable au bâtiment — ce sont des points à voir avec la maîtrise d’œuvre, projet par projet.',
        'Le dessin joue sur trois registres : les montants, le remplissage et la main courante. C’est le remplissage qui change tout — barreaudage vertical, lisses horizontales, tôle perforée, panneau plein, motif de ferronnerie — parce que c’est lui qui décide de ce que l’on voit à travers.'
      ],
      ar: [
        'شرفة، أو سطح، أو ميزانين، أو بسطة، أو سلّم: أينما وُجد فارق منسوب وُجد درابزين. ويُحدَّد ارتفاعه وحشوه حسب استعمال المكان والتراتيب المنطبقة على المبنى — وهي نقاط تُدرس مع الإشراف الهندسي، مشروعًا بمشروع.',
        'يشتغل التصميم على ثلاثة مستويات: القوائم والحشو ومسند اليد. والحشو هو الذي يغيّر كلّ شيء — قضبان عمودية أو خطوط أفقية أو صفيحة مثقّبة أو لوح كامل أو زخرفة حدادة — لأنّه هو الذي يقرّر ما يُرى من خلاله.'
      ]
    },
    usagesTitle: { fr: 'Partout où il y a un vide.', ar: 'أينما وُجد فراغ.' },
    usages: {
      fr: [
        'Balcon et loggia',
        'Terrasse accessible et rooftop',
        'Escalier intérieur et palier',
        'Mezzanine et coursive'
      ],
      ar: [
        'شرفة ولوجيا',
        'سطح قابل للاستعمال ورووف توب',
        'سلّم داخلي وبسطة',
        'ميزانين وممرّ جانبي'
      ]
    },
    products: [
      { n: 21, nom: { fr: 'Garde-corps métalliques', ar: 'درابزين معدني' } },
      { n: 22, nom: { fr: 'Garde-corps de balcon', ar: 'درابزين شرفات' } },
      { n: 23, nom: { fr: 'Garde-corps d’escalier', ar: 'درابزين سلالم' } },
      { n: 24, nom: { fr: 'Rampes d’escalier métalliques', ar: 'مساند يد معدنية للسلالم' } },
      { n: 25, nom: { fr: 'Rampes en fer forgé', ar: 'مساند يد من الحديد المطاوع' } }
    ],
    questions: [
      {
        q: {
          fr: 'Le garde-corps se pose-t-il avant ou après le sol fini ?',
          ar: 'هل يُركّب الدرابزين قبل الأرضية النهائية أم بعدها؟'
        },
        r: {
          fr: 'Cela dépend du mode de fixation retenu — sur dalle, en applique sur le nez de dalle, ou scellé. Le point se tranche au relevé, avant fabrication : c’est lui qui fixe la hauteur réelle des montants.',
          ar: 'يتوقّف ذلك على طريقة التثبيت المعتمدة — على البلاطة، أو على حافّتها، أو مثبّتًا داخلها. وتُحسم هذه النقطة عند القياس قبل التصنيع: فهي التي تضبط الارتفاع الحقيقي للقوائم.'
        }
      },
      QUESTION_POSE
    ],
    voisines: ['escaliers', 'structures', 'fenetres']
  },

  {
    key: 'escaliers',
    route: '/escaliers-metalliques/',
    index: '05',
    motif: 'escalier',
    theme: 'forge',
    nom: { fr: 'Escaliers métalliques', ar: 'السلالم المعدنية' },
    h1: {
      fr: 'Escaliers droits, hélicoïdaux et de secours.',
      ar: 'سلالم مستقيمة وحلزونية وسلالم طوارئ.'
    },
    lede: {
      fr: 'Un escalier métallique tient dans peu de place et se lit comme une pièce de structure. C’est l’ouvrage où le calcul et le dessin se rencontrent le plus.',
      ar: 'يشغل السلّم المعدني حيّزًا صغيرًا ويُقرأ كقطعة هيكلية. وهو الشغل الذي يلتقي فيه الحساب والتصميم أكثر من غيره.'
    },
    intro: {
      fr: [
        'Tout part de trois nombres : la hauteur à franchir, la longueur disponible au sol et le passage libre au-dessus. Ils décident du nombre de marches, de leur hauteur et de leur profondeur — donc du confort réel de l’escalier, bien avant son style.',
        'Le métal permet ce que d’autres matériaux rendent difficile : une volée sans limon apparent, un noyau central pour une hélicoïdale, une structure extérieure indépendante de la façade. Les marches se traitent ensuite — tôle, grille, bois rapporté — selon l’usage et l’endroit.'
      ],
      ar: [
        'كلّ شيء ينطلق من ثلاثة أرقام: الارتفاع المطلوب اجتيازه، والطول المتاح على الأرض، والمرور الحرّ في الأعلى. هذه الأرقام تحدّد عدد الدرجات وارتفاعها وعمقها — أي الراحة الفعلية للسلّم، قبل شكله بكثير.',
        'ويتيح المعدن ما يصعب بغيره: طلعة دون جانب ظاهر، أو عمود مركزي للسلّم الحلزوني، أو هيكل خارجي مستقلّ عن الواجهة. ثم تُعالَج الدرجات — صفيحة أو شبكة أو خشب مضاف — حسب الاستعمال والمكان.'
      ]
    },
    usagesTitle: { fr: 'Monter, dans peu de place.', ar: 'الصعود في حيّز ضيّق.' },
    usages: {
      fr: [
        'Escalier intérieur de villa ou de duplex',
        'Accès à une mezzanine ou à des combles',
        'Escalier extérieur de terrasse ou de rooftop',
        'Escalier de secours en façade'
      ],
      ar: [
        'سلّم داخلي لفيلا أو دوبلكس',
        'صعود إلى ميزانين أو غرفة علوية',
        'سلّم خارجي إلى سطح أو رووف توب',
        'سلّم طوارئ على الواجهة'
      ]
    },
    products: [
      { n: 26, nom: { fr: 'Escaliers métalliques', ar: 'سلالم معدنية' } },
      { n: 27, nom: { fr: 'Escaliers droits métalliques', ar: 'سلالم معدنية مستقيمة' } },
      { n: 28, nom: { fr: 'Escaliers hélicoïdaux métalliques', ar: 'سلالم معدنية حلزونية' } },
      { n: 29, nom: { fr: 'Escaliers de secours', ar: 'سلالم طوارئ' } }
    ],
    questions: [
      {
        q: {
          fr: 'Quelles informations donner pour un escalier ?',
          ar: 'ما المعلومات التي تلزم لسلّم؟'
        },
        r: {
          fr: 'Trois suffisent pour commencer : la hauteur d’un sol fini à l’autre, la place disponible au sol, et l’endroit où l’on souhaite arriver en haut. Une photo de la trémie vaut souvent une page de description.',
          ar: 'تكفي ثلاث للبداية: الارتفاع من أرضية نهائية إلى أخرى، والمساحة المتاحة على الأرض، والموضع الذي تريد الوصول إليه في الأعلى. وغالبًا ما تغني صورة للفتحة عن صفحة وصف.'
        }
      },
      QUESTION_POSE
    ],
    voisines: ['garde-corps', 'structures', 'mobilier']
  },

  {
    key: 'pergolas',
    route: '/pergolas/',
    index: '06',
    motif: 'pergola',
    theme: 'slats',
    gallery: 'pergolas',
    nom: { fr: 'Pergolas', ar: 'البرغولات' },
    h1: {
      fr: 'Pergolas adossées et indépendantes.',
      ar: 'برغولات ملاصقة وأخرى مستقلّة.'
    },
    lede: {
      fr: 'Une pergola change la manière d’occuper un extérieur : elle délimite un endroit où l’on s’installe et donne à une terrasse la présence d’une véritable pièce.',
      ar: 'تغيّر البرغولا طريقة استعمال الفضاء الخارجي: تحدّد موضعًا للجلوس وتمنح الشرفة حضور غرفة حقيقية.'
    },
    intro: {
      fr: [
        'Adossée, la structure prend appui sur la façade et prolonge la maison vers l’extérieur. Indépendante, elle tient sur ses propres poteaux et pose un espace couvert là où aucune façade ne peut servir d’appui. Bord de piscine et rooftop reprennent le même principe avec des contraintes d’accès et de levage différentes.',
        'Le mode de couverture est un choix distinct de la typologie : c’est lui qui décide de ce que vous pourrez faire sous la structure, et quand.'
      ],
      ar: [
        'حين تكون ملاصقة، يستند الهيكل إلى الواجهة ويمدّ البيت نحو الخارج. وحين تكون مستقلّة، تقوم على قوائمها الخاصّة وتُنشئ فضاءً مغطّى حيث لا واجهة تصلح سندًا. أمّا حافّة المسبح والرووف توب فيعتمدان المبدأ نفسه بإكراهات وصول ورفع مختلفة.',
        'ونمط التغطية اختيار مستقلّ عن النمط الإنشائي: فهو الذي يقرّر ما يمكنك فعله تحت الهيكل، ومتى.'
      ]
    },
    usagesTitle: { fr: 'Une pièce en plus, dehors.', ar: 'غرفة إضافية، في الخارج.' },
    usages: {
      fr: [
        'Terrasse de repas attenante au séjour',
        'Jardin et salon d’extérieur',
        'Bord de piscine',
        'Rooftop et terrasse en hauteur'
      ],
      ar: [
        'شرفة طعام ملاصقة لغرفة الجلوس',
        'حديقة وصالون خارجي',
        'حافّة مسبح',
        'رووف توب وسطح مرتفع'
      ]
    },
    products: [
      { n: 30, nom: { fr: 'Pergolas métalliques', ar: 'برغولات معدنية' } },
      { n: 31, nom: { fr: 'Pergolas sur mesure', ar: 'برغولات حسب الطلب' } },
      { n: 32, nom: { fr: 'Pergolas bioclimatiques', ar: 'برغولات بيومناخية' } }
    ],
    questions: [
      {
        q: {
          fr: 'Quelle différence entre une pergola bioclimatique et une pergola à toile ?',
          ar: 'ما الفرق بين البرغولا البيومناخية وبرغولا القماش؟'
        },
        r: {
          fr: 'La lame bioclimatique pivote : on ouvre au soleil, on ferme à l’averse, sans rien démonter. La toile acrylique se déploie et se replie sur une structure aluminium : une couverture plus légère, pour les portées où la lame n’est pas nécessaire.',
          ar: 'الشريحة البيومناخية تدور: تُفتح في الشمس وتُغلق عند المطر دون فكّ أيّ قطعة. أمّا القماش الأكريليكي فيُبسط ويُطوى فوق هيكل من الألمنيوم: تغطية أخفّ للمساحات التي لا تستدعي الشرائح.'
        }
      },
      QUESTION_POSE
    ],
    voisines: ['abris', 'verrieres', 'structures']
  },

  {
    key: 'abris',
    route: '/abris/',
    index: '07',
    motif: 'abri',
    theme: 'shelter',
    gallery: 'abris',
    nom: { fr: 'Abris, auvents et carports', ar: 'المظلات ومواقف السيارات' },
    h1: {
      fr: 'Abris, auvents et abris de voiture.',
      ar: 'مظلات وأبواب مغطّاة ومواقف سيارات.'
    },
    lede: {
      fr: 'Un abri part toujours d’un usage concret : entrer sans se mouiller, laisser du matériel dehors, garer une voiture à l’ombre.',
      ar: 'تنطلق المظلة دائمًا من استعمال ملموس: الدخول دون بلل، وترك معدّات في الخارج، وركن سيارة في الظلّ.'
    },
    intro: {
      fr: [
        'C’est l’usage qui donne les dimensions, la hauteur et l’emplacement — pas l’inverse. Un auvent d’entrée abrite l’arrivée et donne une adresse à la façade; un abri de jardin protège un rangement; un carport couvre un véhicule sans fermer un volume.',
        'La couverture se choisit projet par projet : tube, tôle ou panneau sandwich pour un abri permanent, lames ou toile quand l’ombre doit rester réglable.'
      ],
      ar: [
        'الاستعمال هو الذي يمنح الأبعاد والارتفاع والموضع، لا العكس. المظلة فوق المدخل تحمي الوصول وتمنح الواجهة عنوانًا، ومظلة الحديقة تحمي مخزنًا، وموقف السيارة يغطّي مركبة دون أن يغلق حجمًا.',
        'وتُختار التغطية مشروعًا بمشروع: أنابيب أو صفائح أو ألواح ساندويتش للمظلة الدائمة، وشرائح أو قماش حين يجب أن يبقى الظلّ قابلًا للتعديل.'
      ]
    },
    usagesTitle: { fr: 'Protéger un usage précis.', ar: 'حماية استعمال محدّد.' },
    usages: {
      fr: [
        'Auvent d’entrée et marquise',
        'Abri de jardin et rangement extérieur',
        'Abri de voiture et carport',
        'Couverture de terrasse ou de bord de piscine'
      ],
      ar: [
        'مظلة مدخل وسقيفة',
        'مظلة حديقة وفضاء تخزين خارجي',
        'مظلة سيارة وموقف مغطّى',
        'تغطية شرفة أو حافّة مسبح'
      ]
    },
    products: [
      { n: 33, nom: { fr: 'Auvents métalliques', ar: 'مظلات معدنية' } },
      { n: 34, nom: { fr: 'Abris de voiture métalliques', ar: 'مظلات سيارات معدنية' } },
      { n: 35, nom: { fr: 'Carports métalliques', ar: 'مواقف سيارات مغطّاة معدنية' } },
      { n: 41, nom: { fr: 'Marquises métalliques', ar: 'سقائف مداخل معدنية' } }
    ],
    questions: [
      {
        q: {
          fr: 'Un carport peut-il être fermé plus tard ?',
          ar: 'هل يمكن غلق موقف السيارة لاحقًا؟'
        },
        r: {
          fr: 'C’est une intention à annoncer dès le relevé : une structure prévue pour recevoir un bardage ou une fermeture partielle n’a ni la même ossature ni les mêmes appuis qu’une structure ouverte.',
          ar: 'هذه نيّة تُعلَن منذ القياس: الهيكل المهيّأ لاستقبال تكسية أو غلق جزئي ليس له الهيكل نفسه ولا نقاط الارتكاز نفسها التي للهيكل المفتوح.'
        }
      },
      QUESTION_MESURE
    ],
    voisines: ['pergolas', 'structures', 'clotures']
  },

  {
    key: 'clotures',
    route: '/clotures-palissades/',
    index: '08',
    motif: 'cloture',
    theme: 'grid',
    nom: { fr: 'Clôtures et palissades', ar: 'الأسيجة والحواجز' },
    h1: {
      fr: 'Clôtures, palissades et cloisons métalliques.',
      ar: 'أسيجة وحواجز وفواصل معدنية.'
    },
    lede: {
      fr: 'Une clôture dit où s’arrête une propriété, et combien on en voit. C’est un ouvrage de limite, donc une question de regard autant que de tracé.',
      ar: 'يقول السياج أين ينتهي الملك، وكم يُرى منه. إنّه شغل حدود، أي مسألة نظر بقدر ما هو مسألة تخطيط.'
    },
    intro: {
      fr: [
        'Le tracé vient du terrain : longueur, dénivelés, murets existants, arbres à contourner. Les panneaux se calent ensuite sur ce tracé, et c’est là que les décalages de niveau se règlent — en redans ou en suivant la pente.',
        'Le degré d’occultation est l’autre décision : barreaudage ouvert quand la vue compte, lames rapprochées ou tôle quand c’est l’intimité qui prime, et toutes les nuances entre les deux. La palissade et la cloison relèvent du même geste, à l’intérieur d’une parcelle ou d’un local.'
      ],
      ar: [
        'يأتي التخطيط من الأرض: الطول، وفوارق المناسيب، والجدران القائمة، والأشجار الواجب تفاديها. ثم تُضبط الألواح على هذا التخطيط، وهناك تُعالَج فوارق المناسيب — بتدرّج أو باتّباع الميل.',
        'ودرجة الحجب هي القرار الآخر: قضبان مفتوحة حين يهمّ المنظر، وشرائح متقاربة أو صفيحة حين تتقدّم الخصوصية، وكلّ الدرجات بينهما. والحاجز والفاصل من الحركة نفسها، داخل قطعة أرض أو داخل محلّ.'
      ]
    },
    usagesTitle: { fr: 'Dire où s’arrête un terrain.', ar: 'قول أين تنتهي الأرض.' },
    usages: {
      fr: [
        'Clôture de villa et de terrain',
        'Séparation entre deux propriétés',
        'Palissade de chantier ou d’espace commercial',
        'Cloison intérieure de local ou de dépôt'
      ],
      ar: [
        'سياج فيلا وقطعة أرض',
        'فصل بين ملكين',
        'حاجز ورشة أو فضاء تجاري',
        'فاصل داخلي لمحلّ أو مستودع'
      ]
    },
    products: [
      { n: 36, nom: { fr: 'Clôtures métalliques', ar: 'أسيجة معدنية' } },
      { n: 37, nom: { fr: 'Clôtures en fer forgé', ar: 'أسيجة من الحديد المطاوع' } },
      { n: 38, nom: { fr: 'Palissades métalliques', ar: 'حواجز معدنية' } },
      { n: 39, nom: { fr: 'Cloisons métalliques', ar: 'فواصل معدنية' } }
    ],
    questions: [
      {
        q: {
          fr: 'Comment se traite un terrain en pente ?',
          ar: 'كيف تُعالَج أرض منحدرة؟'
        },
        r: {
          fr: 'De deux façons : en redans, chaque panneau restant horizontal et rattrapant la pente par un décrochement, ou en suivant la pente, les panneaux étant alors fabriqués en parallélogramme. Le choix se fait au relevé, avec vous.',
          ar: 'بطريقتين: بالتدرّج، حيث يبقى كلّ لوح أفقيًا ويُعوَّض الميل بفارق منسوب، أو باتّباع الميل، فتُصنع الألواح حينئذٍ على شكل متوازي أضلاع. ويُحسم الاختيار عند القياس، معك.'
        }
      },
      QUESTION_POSE
    ],
    voisines: ['portails', 'abris', 'structures']
  },

  {
    key: 'verrieres',
    route: '/verrieres/',
    index: '09',
    motif: 'verriere',
    theme: 'glass',
    gallery: 'verrieres',
    nom: { fr: 'Verrières et cloisons vitrées', ar: 'الأسقف الزجاجية والفواصل' },
    h1: {
      fr: 'Verrières de couverture et de séparation.',
      ar: 'أسقف زجاجية للتغطية وفواصل للتقسيم.'
    },
    lede: {
      fr: 'Une verrière décide de la quantité de lumière qui entre, de l’endroit où elle tombe et de ce que devient l’espace en dessous.',
      ar: 'يقرّر السقف الزجاجي كمّية الضوء الداخل، وموضع سقوطه، وما يصير إليه الفضاء تحته.'
    },
    intro: {
      fr: [
        'Une verrière de couverture ferme le dessus d’un espace : patio, cage d’escalier, extension. Une verrière de séparation partage un volume sans le cloisonner : c’est le même ouvrage, posé verticalement, et il n’obéit pas aux mêmes appuis.',
        'C’est la famille la plus dépendante du lieu : un mur porteur, une retombée de dalle, une menuiserie en place fixent les appuis possibles avant même le premier tracé. Elle gagne donc à être étudiée avant d’être chiffrée.'
      ],
      ar: [
        'السقف الزجاجي للتغطية يغلق أعلى فضاء: فناء، أو بيت درج، أو توسعة. أمّا الفاصل الزجاجي فيقسم حجمًا دون أن يحجبه: هو الشغل نفسه موضوعًا عموديًا، ولا يخضع لنقاط الارتكاز نفسها.',
        'وهي أكثر العائلات ارتباطًا بالمكان: جدار حامل، أو نزول بلاطة، أو نجارة قائمة، كلّها تحدّد نقاط الارتكاز الممكنة قبل أوّل خطّ. لذلك تستفيد من الدراسة قبل التسعير.'
      ]
    },
    usagesTitle: { fr: 'La lumière comme matériau.', ar: 'الضوء بوصفه مادّة.' },
    usages: {
      fr: [
        'Couverture de patio ou de cour intérieure',
        'Cage d’escalier et puits de lumière',
        'Séparation cuisine et pièce de vie',
        'Extension et jardin d’hiver'
      ],
      ar: [
        'تغطية فناء أو صحن داخلي',
        'بيت درج ومنور',
        'فصل بين المطبخ وغرفة المعيشة',
        'توسعة وحديقة شتوية'
      ]
    },
    products: [
      { n: 40, nom: { fr: 'Verrières métalliques', ar: 'أسقف زجاجية بهيكل معدني' } }
    ],
    questions: [
      {
        q: {
          fr: 'Couvrir ou séparer : les deux se dessinent-ils pareil ?',
          ar: 'التغطية والفصل: هل يُرسمان بالطريقة نفسها؟'
        },
        r: {
          fr: 'Non. Une verrière de couverture travaille à l’horizontale et se raccorde à une couverture existante; une verrière de séparation est verticale et se cale entre sol et plafond. Dites laquelle des deux vous cherchez : c’est la première information utile.',
          ar: 'لا. السقف الزجاجي يشتغل أفقيًا ويتّصل بتغطية قائمة، أمّا الفاصل الزجاجي فعمودي ويُضبط بين الأرض والسقف. اذكر أيّهما تريد: فتلك أوّل معلومة مفيدة.'
        }
      },
      QUESTION_MESURE
    ],
    voisines: ['pergolas', 'fenetres', 'structures']
  },

  {
    key: 'structures',
    route: '/structures-metalliques/',
    index: '10',
    motif: 'structure',
    theme: 'forge',
    nom: { fr: 'Structures et construction métallique', ar: 'الهياكل والبناء المعدني' },
    h1: {
      fr: 'Structures, charpentes, hangars et mezzanines.',
      ar: 'هياكل وهياكل حاملة ومستودعات وميزانين.'
    },
    lede: {
      fr: 'Quand l’ouvrage ne borde plus un espace mais le porte, on change d’échelle : c’est la construction métallique.',
      ar: 'حين لا يعود الشغل يحدّ فضاءً بل يحمله، يتغيّر المقياس: هذا هو البناء المعدني.'
    },
    intro: {
      fr: [
        'Charpente, hangar, mezzanine, structure d’extension : ce sont des ouvrages porteurs. Leur dimensionnement relève d’une étude, et cette étude se mène avec les intervenants du projet — maîtrise d’œuvre, bureau d’études, entreprise de gros œuvre — avant toute fabrication.',
        'L’intérêt du métal ici est double : des portées longues avec peu d’appuis, et un montage rapide sur site parce que l’essentiel a été préparé avant. C’est ce qui rend possible une mezzanine dans un volume existant, ou un hangar sur une dalle déjà coulée.'
      ],
      ar: [
        'هيكل حامل، أو مستودع، أو ميزانين، أو هيكل توسعة: كلّها أشغال حاملة. وتحديد أبعادها يستوجب دراسة، وتُنجَز هذه الدراسة مع المتدخّلين في المشروع — الإشراف الهندسي، ومكتب الدراسات، ومقاول الأشغال الكبرى — قبل أيّ تصنيع.',
        'وفائدة المعدن هنا مزدوجة: مسافات طويلة بنقاط ارتكاز قليلة، وتركيب سريع في الموقع لأنّ الجزء الأكبر أُعِدّ سلفًا. وهذا ما يجعل ممكنًا إنشاء ميزانين داخل حجم قائم، أو مستودع فوق بلاطة مصبوبة سلفًا.'
      ]
    },
    usagesTitle: { fr: 'Quand l’ouvrage porte.', ar: 'حين يحمل الشغل.' },
    usages: {
      fr: [
        'Charpente de bâtiment et d’extension',
        'Hangar agricole, artisanal ou de stockage',
        'Mezzanine dans un volume existant',
        'Ossature de plancher et de passerelle'
      ],
      ar: [
        'هيكل حامل لمبنى أو لتوسعة',
        'مستودع فلاحي أو حرفي أو للتخزين',
        'ميزانين داخل حجم قائم',
        'هيكل بلاط وممرّ علوي'
      ]
    },
    products: [
      { n: 42, nom: { fr: 'Structures métalliques', ar: 'هياكل معدنية' } },
      { n: 43, nom: { fr: 'Charpentes métalliques', ar: 'هياكل معدنية حاملة' } },
      { n: 44, nom: { fr: 'Hangars métalliques', ar: 'مستودعات معدنية' } },
      { n: 45, nom: { fr: 'Mezzanines métalliques', ar: 'ميزانين معدني' } }
    ],
    questions: [
      {
        q: {
          fr: 'Faut-il des plans pour demander une structure ?',
          ar: 'هل تلزم مخطّطات لطلب هيكل؟'
        },
        r: {
          fr: 'Pas pour la première prise de contact. Les dimensions au sol, la hauteur souhaitée et l’usage prévu suffisent à cadrer la demande. Les plans et le dimensionnement viennent ensuite, avec les intervenants du projet.',
          ar: 'ليس عند الاتصال الأوّل. تكفي الأبعاد على الأرض والارتفاع المطلوب والاستعمال المرتقب لتأطير الطلب. أمّا المخطّطات وتحديد الأبعاد فيأتيان لاحقًا مع متدخّلي المشروع.'
        }
      },
      QUESTION_POSE
    ],
    voisines: ['escaliers', 'abris', 'garde-corps']
  },

  {
    key: 'mobilier',
    route: '/mobilier-ferronnerie-artistique/',
    index: '11',
    motif: 'mobilier',
    theme: 'forge',
    nom: { fr: 'Mobilier et ferronnerie artistique', ar: 'الأثاث والحدادة الفنية' },
    h1: {
      fr: 'Mobilier métallique et ferronnerie artistique.',
      ar: 'أثاث معدني وحدادة فنية.'
    },
    lede: {
      fr: 'À cette échelle, l’ouvrage se touche. Une table, un banc, une étagère : la pièce se juge à la main autant qu’à l’œil.',
      ar: 'في هذا المقياس يُلمس الشغل. طاولة أو مقعد أو رفّ: تُقاس القطعة باليد بقدر ما تُقاس بالعين.'
    },
    intro: {
      fr: [
        'Le mobilier métallique sur mesure répond à une contrainte que le commerce ne couvre pas : une longueur imposée, un angle à occuper, une hauteur d’assise particulière, une charge à porter. C’est un ouvrage de dimension avant d’être un objet de style.',
        'La ferronnerie artistique est l’autre versant : un motif, une courbe, un travail de main qui donne son caractère à une grille, une rampe ou un panneau. Les deux se rejoignent quand une pièce doit tenir et se regarder.'
      ],
      ar: [
        'يستجيب الأثاث المعدني حسب الطلب لإكراه لا يغطّيه السوق: طول مفروض، أو زاوية يجب شغلها، أو ارتفاع جلوس خاصّ، أو حمولة يجب حملها. إنّه شغل أبعاد قبل أن يكون قطعة ذوق.',
        'والحدادة الفنية هي الوجه الآخر: زخرفة، أو انحناءة، أو شغل يد يمنح طابعه لقضبان أو مسند أو لوح. ويلتقي الوجهان حين يجب أن تحمل القطعة وأن تُرى في آن.'
      ]
    },
    usagesTitle: { fr: 'À portée de main.', ar: 'في متناول اليد.' },
    usages: {
      fr: [
        'Table de repas ou plateau sur mesure',
        'Banc de jardin, de terrasse ou d’accueil',
        'Étagère, verrière d’atelier, rangement',
        'Motif de grille, de rampe ou de panneau'
      ],
      ar: [
        'طاولة طعام أو سطح حسب الطلب',
        'مقعد حديقة أو شرفة أو استقبال',
        'رفوف وفواصل وتخزين',
        'زخرفة قضبان أو مسند أو لوح'
      ]
    },
    products: [
      { n: 46, nom: { fr: 'Mobilier métallique sur mesure', ar: 'أثاث معدني حسب الطلب' } },
      { n: 47, nom: { fr: 'Tables métalliques', ar: 'طاولات معدنية' } },
      { n: 48, nom: { fr: 'Bancs métalliques', ar: 'مقاعد معدنية' } },
      { n: 49, nom: { fr: 'Étagères métalliques', ar: 'رفوف معدنية' } },
      { n: 50, nom: { fr: 'Décoration et ferronnerie artistique', ar: 'ديكور وحدادة فنية' } }
    ],
    questions: [
      {
        q: {
          fr: 'Une pièce unique se traite-t-elle comme un ouvrage de bâtiment ?',
          ar: 'هل تُعامَل القطعة الواحدة معاملة شغل بناء؟'
        },
        r: {
          fr: 'Le parcours est le même — conception, fabrication, finition, livraison, pose — mais l’échelle change tout : ici, la finition compte autant que la structure, parce que la pièce se voit de près et se touche.',
          ar: 'المسار نفسه — تصميم وتصنيع وتشطيب وتسليم وتركيب — لكنّ المقياس يغيّر كلّ شيء: هنا يوازي التشطيبُ الهيكلَ أهمّية، لأنّ القطعة تُرى عن قرب وتُلمس.'
        }
      },
      QUESTION_MESURE
    ],
    voisines: ['escaliers', 'garde-corps', 'fenetres']
  }
];

/* -------------------------------------------------------------------------
   Accès et contrôles au build
   ------------------------------------------------------------------------- */

/** Nombre d'ouvrages confirmés par le client. Le contrôle ci-dessous le tient. */
export const PRODUCT_COUNT: number = SHARED_COUNT as number;

export const FAMILY_BY_KEY: Readonly<Record<FamilyKey, Family>> = Object.fromEntries(
  FAMILIES.map((family) => [family.key, family])
) as Readonly<Record<FamilyKey, Family>>;

/** Famille portant une route donnée. */
export const FAMILY_BY_ROUTE: Readonly<Record<FamilyRoute, Family>> = Object.fromEntries(
  FAMILIES.map((family) => [family.route, family])
) as Readonly<Record<FamilyRoute, Family>>;

/** Tous les ouvrages, dans l'ordre du relevé client. */
export const PRODUCTS: readonly (Product & { readonly family: Family })[] = FAMILIES.flatMap(
  (family) => family.products.map((product) => ({ ...product, family }))
).sort((a, b) => a.n - b.n);

// --- Contrôles exécutés au build -------------------------------------------
{
  const numbers = PRODUCTS.map((product) => product.n);
  const unique = new Set(numbers);
  if (unique.size !== numbers.length) {
    throw new Error('catalogue.ts — un rang d’ouvrage est employé deux fois.');
  }
  if (numbers.length !== PRODUCT_COUNT) {
    throw new Error(
      `catalogue.ts — ${numbers.length} ouvrages listés, ${PRODUCT_COUNT} confirmés par le client.`
    );
  }
  for (let n = 1; n <= PRODUCT_COUNT; n += 1) {
    if (!unique.has(n)) throw new Error(`catalogue.ts — l’ouvrage n° ${n} manque.`);
  }

  // Les routes déclarées ici et celles que lit le contrôle de build doivent
  // être les mêmes, dans le même ordre : c'est ce qui garantit qu'une famille
  // ajoutée sans sa route dans routes.mjs ne parte pas en production sans être
  // contrôlée.
  {
    const shared = FAMILY_ROUTES as readonly string[];
    const declared = FAMILIES.map((family) => family.route);
    if (shared.length !== declared.length || shared.some((route, index) => route !== declared[index])) {
      throw new Error(
        'catalogue.ts — les routes des familles ne correspondent plus à celles de routes.mjs.'
      );
    }
  }

  const routes = new Set<string>();
  const keys = new Set<string>();
  for (const family of FAMILIES) {
    if (routes.has(family.route)) throw new Error(`catalogue.ts — route dupliquée : ${family.route}`);
    if (keys.has(family.key)) throw new Error(`catalogue.ts — clé dupliquée : ${family.key}`);
    routes.add(family.route);
    keys.add(family.key);
    if (family.products.length === 0) {
      throw new Error(`catalogue.ts — la famille ${family.key} ne porte aucun ouvrage.`);
    }
  }
  // Le maillage doit être réel : une famille voisine inexistante produirait un
  // lien mort, et un renvoi vers soi-même une boucle inutile.
  for (const family of FAMILIES) {
    for (const voisine of family.voisines) {
      if (!keys.has(voisine)) {
        throw new Error(`catalogue.ts — ${family.key} renvoie vers une famille inconnue : ${voisine}`);
      }
      if (voisine === family.key) {
        throw new Error(`catalogue.ts — ${family.key} se renvoie à elle-même.`);
      }
    }
  }
}
