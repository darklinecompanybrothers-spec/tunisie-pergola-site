/**
 * Contenu éditorial des pages qui ne viennent pas du catalogue.
 * =============================================================
 *
 * Accueil, entreprise, hub des ouvrages, réalisations, zones, contact,
 * confidentialité, page introuvable. Tout y est écrit dans les deux langues,
 * dans la même structure : le gabarit `.astro` ne porte plus une seule phrase.
 *
 * C'est ce qui rend la parité vérifiable. Une section ajoutée en français sans
 * son arabe ne compile pas — `Bilingual` exige les deux clés — et le contrôle
 * de build compare ensuite ce qui est réellement sorti dans `dist/`.
 *
 * RÈGLE INCHANGÉE : aucune affirmation qui ne soit pas dans
 * `docs/clients/tunisie-pergola/CLIENT-BRIEF.md`. Pas d'ancienneté, pas de
 * volume de projets, pas de prix, pas de performance technique, pas d'atelier
 * propriétaire. La liste complète est au §3 du brief, et
 * `scripts/audit-build.mjs` la fait respecter dans les deux langues.
 */
import type { Bilingual } from '../i18n/locales';

/* ==========================================================================
   Le parcours en cinq temps — confirmé le 1er septembre 2026
   Il est cité par la page entreprise ET par les onze pages de famille. Une
   seule source, donc une seule formulation : c'est aussi ce qui évite que onze
   pages disent la même chose de onze façons différentes, ce qui se lirait
   comme du remplissage.
   ========================================================================== */
export interface JourneyStep {
  readonly index: string;
  readonly titre: Bilingual;
  readonly texte: Bilingual;
}

export const JOURNEY: readonly JourneyStep[] = [
  {
    index: '01',
    titre: { fr: 'Conception', ar: 'التصميم' },
    texte: {
      fr: 'Lire le lieu, relever les cotes, arrêter la forme et le mode de fonctionnement avec vous.',
      ar: 'قراءة المكان، ورفع القياسات، وضبط الشكل وطريقة الاشتغال معك.'
    }
  },
  {
    index: '02',
    titre: { fr: 'Fabrication', ar: 'التصنيع' },
    texte: {
      fr: 'Préparer les éléments de l’ouvrage aux dimensions relevées, et non à des dimensions de catalogue.',
      ar: 'تحضير قطع الشغل بالأبعاد المرفوعة، لا بأبعاد قائمة جاهزة.'
    }
  },
  {
    index: '03',
    titre: { fr: 'Finition', ar: 'التشطيب' },
    texte: {
      fr: 'Traiter les surfaces et arrêter l’aspect final avant que l’ouvrage ne quitte l’établi.',
      ar: 'معالجة الأسطح وضبط المظهر النهائي قبل أن يغادر الشغل طاولة العمل.'
    }
  },
  {
    index: '04',
    titre: { fr: 'Livraison', ar: 'التسليم' },
    texte: {
      fr: 'Amener l’ouvrage sur place, avec les moyens que l’accès impose.',
      ar: 'نقل الشغل إلى الموقع بالوسائل التي يفرضها المدخل.'
    }
  },
  {
    index: '05',
    titre: { fr: 'Pose', ar: 'التركيب' },
    texte: {
      fr: 'Monter, régler, et laisser le lieu dans l’état où on l’a trouvé.',
      ar: 'التركيب والضبط، وترك المكان كما وُجد.'
    }
  }
];

/* ==========================================================================
   Accueil
   ========================================================================== */
export const HOME = {
  heroEyebrow: { fr: 'Conception · Fabrication · Pose', ar: 'تصميم · تصنيع · تركيب' },
  heroTitleBefore: { fr: 'Conçu, fabriqué et posé pour un seul ', ar: 'مُصمَّم ومُصنَّع ومُركَّب لمكانٍ ' },
  heroTitleAccent: { fr: 'lieu', ar: 'واحد' },
  heroTitleAfter: { fr: '.', ar: '.' },
  heroLede: {
    fr: 'Portes, portails, garde-corps, escaliers, pergolas, verrières, abris, clôtures, structures et mobilier. Onze familles d’ouvrages métalliques, fabriquées sur mesure depuis Sousse pour plusieurs régions de Tunisie.',
    ar: 'أبواب وبوابات ودرابزين وسلالم وبرغولات وأسقف زجاجية ومظلات وأسيجة وهياكل وأثاث. إحدى عشرة عائلة من الأشغال المعدنية، تُصنع حسب الطلب انطلاقًا من سوسة نحو عدّة جهات من تونس.'
  },
  heroPhotoAlt: {
    fr: 'Pergola à lames sombres au-dessus d’une terrasse de piscine à débordement au crépuscule, oliviers, mur en pierre et vallée en contrebas.',
    ar: 'برغولا بشرائح داكنة فوق شرفة مسبح لا متناهٍ عند الغسق، وأشجار زيتون وجدار حجري ووادٍ في الأسفل.'
  },

  manifestoA: { fr: 'Le métal', ar: 'المعدن' },
  manifestoB: { fr: 'prend', ar: 'يأخذ' },
  manifestoC: { fr: 'forme.', ar: 'شكله.' },
  manifestoLede: {
    fr: 'Un ouvrage bien fait ne se remarque pas tout de suite. On remarque d’abord que quelque chose est devenu facile.',
    ar: 'الشغل المتقن لا يُلاحَظ فورًا. ما يُلاحَظ أوّلًا أنّ شيئًا ما صار سهلًا.'
  },
  manifestoBody: {
    fr: [
      'Une porte qui ferme d’un doigt. Un escalier qu’on monte sans y penser. Une terrasse où l’on reste après le coucher du soleil. Ce déplacement d’usage est le vrai sujet : l’ouvrage n’est que le moyen de l’obtenir.',
      'C’est pour cela que chaque projet commence par le lieu — ses dimensions, son orientation, ce qu’on y fait déjà — et non par un modèle choisi dans une liste.'
    ],
    ar: [
      'باب يُغلق بإصبع. سلّم يُصعَد دون تفكير. شرفة يُمكث فيها بعد المغيب. هذا التحوّل في الاستعمال هو الموضوع الحقيقي: وما الشغل إلّا وسيلة إليه.',
      'لذلك يبدأ كلّ مشروع من المكان — أبعاده واتجاهه وما يُفعل فيه أصلًا — لا من نموذج مختار من قائمة.'
    ]
  },

  approachEyebrow: { fr: 'L’approche', ar: 'المنهج' },
  approachTitle: { fr: 'Partir du lieu, pas du catalogue.', ar: 'الانطلاق من المكان لا من القائمة.' },
  approachBody: {
    fr: [
      'Tunisie Pergola conçoit, fabrique et pose des ouvrages métalliques sur mesure. Portes et portails, garde-corps et escaliers, pergolas et abris, clôtures, verrières, structures et mobilier : la même équipe suit le projet du relevé jusqu’à la pose.',
      'Basée à Sousse, l’entreprise intervient dans plusieurs régions de Tunisie, pour des particuliers, des villas, des entreprises, des architectes, des commerces, des restaurants et des espaces professionnels.'
    ],
    ar: [
      'تصمّم تونيزي برغولا وتصنع وتركّب أشغالًا معدنية حسب الطلب. أبواب وبوابات، ودرابزين وسلالم، وبرغولات ومظلات، وأسيجة وأسقف زجاجية وهياكل وأثاث: الفريق نفسه يتابع المشروع من رفع القياسات إلى التركيب.',
      'ومقرّها سوسة، وتتدخّل في عدّة جهات من تونس، لفائدة الأفراد والفيلات والمؤسسات والمهندسين المعماريين والمحلات التجارية والمطاعم والفضاءات المهنية.'
    ]
  },
  approachPhotoAlt: {
    fr: 'Grande structure claire en cours de pose au-dessus d’une cour, vue large horizontale montrant toute la portée.',
    ar: 'هيكل فاتح كبير في طور التركيب فوق فناء، بمنظر أفقي واسع يُظهر كامل المسافة.'
  },
  approachPhotoCaption: {
    fr: 'Grande structure claire en cours de pose, vue large.',
    ar: 'هيكل فاتح كبير في طور التركيب، منظر واسع.'
  },

  worksEyebrow: { fr: 'Réalisations', ar: 'الإنجازات' },
  worksTitle: { fr: 'Ce qui a été posé, et comment.', ar: 'ما تمّ تركيبه، وكيف.' },
  worksLede: {
    fr: 'Structures terminées, détails de sous-face et étapes de pose. Les légendes disent uniquement ce que montre la photographie.',
    ar: 'هياكل مكتملة وتفاصيل من تحت الأسقف ومراحل تركيب. لا تقول التعليقات إلّا ما تُظهره الصورة.'
  },

  zonesTitle: { fr: 'Depuis Sousse.', ar: 'انطلاقًا من سوسة.' },
  zonesLede: {
    fr: 'Les villes ci-dessous sont celles que Tunisie Pergola déclare desservir. Si la vôtre n’y figure pas, la question mérite d’être posée directement.',
    ar: 'المدن التالية هي التي تعلن تونيزي برغولا خدمتها. وإن لم تكن مدينتك بينها، فالسؤال يستحقّ أن يُطرح مباشرة.'
  }
} as const satisfies Record<string, Bilingual | Bilingual<readonly string[]>>;

/* ==========================================================================
   Hub des ouvrages métalliques
   ========================================================================== */
export const HUB = {
  eyebrow: { fr: 'Savoir-faire', ar: 'الاختصاص' },
  title: { fr: 'Onze familles, cinquante ouvrages.', ar: 'إحدى عشرة عائلة، وخمسون شغلًا.' },
  lede: {
    fr: 'Tout ce que Tunisie Pergola conçoit, fabrique et pose en métal, rangé par famille. Chaque famille a sa page; chaque ouvrage peut être choisi nommément dans le formulaire de projet.',
    ar: 'كلّ ما تصمّمه تونيزي برغولا وتصنعه وتركّبه من المعدن، مرتّبًا حسب العائلات. لكلّ عائلة صفحتها، ويمكن اختيار كلّ شغل باسمه في استمارة المشروع.'
  },
  introEyebrow: { fr: 'Le périmètre', ar: 'مجال العمل' },
  introTitle: { fr: 'Le fer, du portail à la table.', ar: 'الحديد، من البوابة إلى الطاولة.' },
  introBody: {
    fr: [
      'La liste ci-dessous n’est pas un catalogue de modèles : c’est le périmètre du métier. Un ouvrage y figure parce que l’entreprise le conçoit, le fabrique et le pose — pas parce qu’il ferait un bon mot-clé.',
      'Les dimensions, les remplissages, les manœuvres et les finitions se décident projet par projet, après un relevé sur place. C’est la raison pour laquelle aucune page de ce site ne publie de dimensions types ni de tarif.'
    ],
    ar: [
      'القائمة التالية ليست دليل نماذج: هي مجال المهنة. يَرِد فيها الشغل لأنّ المؤسسة تصمّمه وتصنعه وتركّبه — لا لأنّه كلمة مفتاحية جيّدة.',
      'أمّا الأبعاد والحشوات وطرق الفتح والتشطيبات فتُقرَّر مشروعًا بمشروع بعد معاينة في الموقع. ولهذا لا تنشر أيّ صفحة من هذا الموقع أبعادًا نموذجية ولا أسعارًا.'
    ]
  },
  faqEyebrow: { fr: 'Questions fréquentes', ar: 'أسئلة متواترة' },
  faqTitle: { fr: 'Ce qu’il est utile de savoir avant d’écrire.', ar: 'ما يفيد معرفته قبل المراسلة.' },
  faq: [
    {
      q: {
        fr: 'Que fabrique exactement Tunisie Pergola ?',
        ar: 'ماذا تصنع تونيزي برغولا بالضبط؟'
      },
      r: {
        fr: 'Des ouvrages métalliques sur mesure, répartis en onze familles : portes, portails, fenêtres et grilles, garde-corps et rampes, escaliers, pergolas, abris et carports, clôtures et palissades, verrières et cloisons, structures et charpentes, mobilier et ferronnerie artistique.',
        ar: 'أشغالًا معدنية حسب الطلب، موزّعة على إحدى عشرة عائلة: أبواب، وبوابات، ونوافذ وقضبان حماية، ودرابزين ومساند، وسلالم، وبرغولات، ومظلات ومواقف سيارات، وأسيجة وحواجز، وأسقف زجاجية وفواصل، وهياكل وبناء معدني، وأثاث وحدادة فنية.'
      }
    },
    {
      q: { fr: 'Où l’entreprise intervient-elle ?', ar: 'أين تتدخّل المؤسسة؟' },
      r: {
        fr: 'Elle est implantée à Sousse et déclare desservir Sousse, Monastir, Nabeul, Tunis, La Marsa, Djerba, Sfax, Gabès, Médenine et Tataouine. Une ville qui ne figure pas dans cette liste n’est pas un refus : c’est une question à poser.',
        ar: 'مقرّها سوسة، وتعلن خدمة سوسة والمنستير ونابل وتونس والمرسى وجربة وصفاقس وقابس ومدنين وتطاوين. ووجود مدينة خارج هذه القائمة ليس رفضًا: بل سؤالًا يُطرح.'
      }
    },
    {
      q: { fr: 'Comment se passe une demande ?', ar: 'كيف يجري الطلب؟' },
      r: {
        fr: 'Vous décrivez le projet par le formulaire, par téléphone ou sur WhatsApp. Les demandes envoyées depuis ce site sont reçues et traitées par DCB Authority Group, l’agence qui l’opère pour Tunisie Pergola. La réponse est annoncée sous 24 heures.',
        ar: 'تصف مشروعك عبر الاستمارة أو الهاتف أو واتساب. والطلبات المرسلة من هذا الموقع تتلقّاها وتعالجها DCB Authority Group، الوكالة التي تديره لفائدة تونيزي برغولا. والردّ معلن في غضون 24 ساعة.'
      }
    },
    {
      q: {
        fr: 'La visite et l’étude sont-elles comprises ?',
        ar: 'هل المعاينة والدراسة مشمولتان؟'
      },
      r: {
        fr: 'La visite sur place est un service payant, facturé selon la localisation. L’étude est payante avant engagement et dépend du métrage et de la nature du projet; après signature, elle est reprise dans le contrat.',
        ar: 'المعاينة في الموقع خدمة بمقابل تُحتسب حسب الموقع. والدراسة بمقابل قبل الالتزام وتتوقّف على المساحة وطبيعة المشروع؛ وبعد الإمضاء تُدرج ضمن العقد.'
      }
    }
  ]
} as const;

/* ==========================================================================
   L'entreprise
   ========================================================================== */
export const ABOUT = {
  eyebrow: { fr: 'L’entreprise', ar: 'المؤسسة' },
  title: { fr: 'Concevoir, fabriquer, poser.', ar: 'التصميم والتصنيع والتركيب.' },
  lede: {
    fr: 'Tunisie Pergola est une ferronnerie-métallerie basée à Sousse. Elle conçoit, fabrique et pose des ouvrages métalliques sur mesure dans plusieurs régions de Tunisie.',
    ar: 'تونيزي برغولا مؤسسة حدادة ومعدنية مقرّها سوسة. تصمّم وتصنع وتركّب أشغالًا معدنية حسب الطلب في عدّة جهات من تونس.'
  },
  headPhotoAlt: {
    fr: 'Structure blanche vue depuis un étage pendant le chantier, poteaux et traverses en place.',
    ar: 'هيكل أبيض منظور من طابق علوي أثناء الورشة، بقوائم وعوارض في مكانها.'
  },

  startEyebrow: { fr: 'Le point de départ', ar: 'نقطة الانطلاق' },
  startTitle: { fr: 'Le lieu commande.', ar: 'المكان هو الذي يأمر.' },
  startBody: {
    fr: [
      'Un même besoin — « fermer cette entrée », « couvrir cette terrasse », « sécuriser ce balcon » — n’appelle pas la même réponse selon les dimensions, l’orientation, la nature du support et ce qu’on veut réellement faire de l’endroit. C’est cette lecture du lieu qui précède le dessin.',
      'C’est aussi ce qui explique que l’entreprise travaille sur mesure plutôt que sur catalogue : deux ouvertures de même largeur n’ont presque jamais le même tableau, le même seuil ni le même sens de passage.'
    ],
    ar: [
      'الحاجة الواحدة — «غلق هذا المدخل»، «تغطية هذه الشرفة»، «تأمين هذه الشرفة العلوية» — لا تستدعي الجواب نفسه حسب الأبعاد والاتجاه وطبيعة الحامل وما يُراد فعله فعلًا بالمكان. وقراءة المكان هذه تسبق الرسم.',
      'وهذا أيضًا ما يفسّر اشتغال المؤسسة حسب الطلب لا حسب قائمة جاهزة: فتحتان بالعرض نفسه لا تكاد تكون لهما الحافّة نفسها ولا العتبة نفسها ولا اتجاه المرور نفسه.'
    ]
  },
  facebookLine: {
    fr: 'Sur Facebook, la page réunissait',
    ar: 'على فيسبوك، جمعت الصفحة'
  },
  facebookLineEnd: {
    fr: 'Les publications y montrent les projets au fil des chantiers.',
    ar: 'وتُظهر المنشورات المشاريع على امتداد الورشات.'
  },
  facebookLink: { fr: 'Voir la page', ar: 'مشاهدة الصفحة' },

  bandPhotoAlt: {
    fr: 'Trame d’une grande structure blanche en cours de pose, vue large depuis le dessous de la couverture.',
    ar: 'نسيج هيكل أبيض كبير في طور التركيب، بمنظر واسع من تحت التغطية.'
  },
  bandPhotoCaption: {
    fr: 'Grande structure blanche en cours de pose, vue large sur la trame de la couverture.',
    ar: 'هيكل أبيض كبير في طور التركيب، بمنظر واسع على نسيج التغطية.'
  },

  methodEyebrow: { fr: 'La façon de travailler', ar: 'طريقة الاشتغال' },
  methodTitle: { fr: 'Cinq temps, un seul interlocuteur.', ar: 'خمس مراحل، ومخاطب واحد.' },
  methodLede: {
    fr: 'Le périmètre annoncé par l’entreprise est celui-ci, et rien de plus : concevoir, fabriquer, finir, livrer, poser.',
    ar: 'مجال العمل الذي تعلنه المؤسسة هو هذا، لا أكثر: التصميم والتصنيع والتشطيب والتسليم والتركيب.'
  },

  siteEyebrow: { fr: 'Le chantier', ar: 'الورشة' },
  siteTitle: { fr: 'Ce que la photo finale ne montre pas.', ar: 'ما لا تُظهره الصورة النهائية.' },
  siteText: {
    fr: 'Le portfolio public de l’entreprise mêle volontairement ouvrages terminés et étapes de pose. C’est un choix utile : il rend visible le travail réel derrière une ligne nette.',
    ar: 'يخلط رصيد المؤسسة العلني عن قصد بين الأشغال المكتملة ومراحل التركيب. وهو خيار مفيد: يُظهر العمل الحقيقي وراء الخطّ النظيف.'
  },
  sitePhotoAlt: {
    fr: 'Structure anthracite en cours de pose dans une cour, étais, échelle et membres de l’équipe autour du chantier.',
    ar: 'هيكل داكن في طور التركيب في فناء، مع دعائم وسلّم وأفراد الفريق حول الورشة.'
  },
  sitePhotoCaption: {
    fr: 'Structure anthracite en cours de pose dans une cour.',
    ar: 'هيكل داكن في طور التركيب في فناء.'
  },
  sitePhoto2Alt: {
    fr: 'Équipe posant une couverture anthracite à sous-face bois au bord d’une piscine, avec un engin de levage en place.',
    ar: 'فريق يركّب تغطية داكنة بسطح سفلي خشبي على حافّة مسبح، مع رافعة في مكانها.'
  },
  sitePhoto2Caption: {
    fr: 'Pose d’une couverture au bord d’une piscine, engin de levage en place.',
    ar: 'تركيب تغطية على حافّة مسبح، والرافعة في مكانها.'
  },

  whereEyebrow: { fr: 'Où', ar: 'أين' },
  whereTitle: { fr: 'Basée à Sousse.', ar: 'مقرّها سوسة.' },
  whereBody1: {
    fr: 'L’adresse de l’entreprise est',
    ar: 'عنوان المؤسسة هو'
  },
  whereBody2: {
    fr: 'et les zones desservies déclarées couvrent',
    ar: 'وتغطّي المناطق المعلنة'
  },
  whereBody3: {
    fr: 'villes, du nord au sud du pays.',
    ar: 'مدينة، من شمال البلاد إلى جنوبها.'
  },
  whereIntake: {
    fr: 'Les demandes envoyées depuis ce site sont reçues et traitées par DCB Authority Group, l’agence qui l’opère pour Tunisie Pergola :',
    ar: 'الطلبات المرسلة من هذا الموقع تتلقّاها وتعالجها DCB Authority Group، الوكالة التي تديره لفائدة تونيزي برغولا:'
  }
} as const;

/* ==========================================================================
   Réalisations
   ========================================================================== */
export const WORKS = {
  eyebrow: { fr: 'Réalisations', ar: 'الإنجازات' },
  title: { fr: 'Ce qui a été posé, et comment.', ar: 'ما تمّ تركيبه، وكيف.' },
  lede: {
    fr: 'Structures terminées, détails de sous-face et étapes de pose. Les légendes disent uniquement ce que montre la photographie.',
    ar: 'هياكل مكتملة وتفاصيل من تحت الأسقف ومراحل تركيب. لا تقول التعليقات إلّا ما تُظهره الصورة.'
  },
  headPhotoAlt: {
    fr: 'Grande structure blanche en cours de pose, vue large horizontale sur un chantier.',
    ar: 'هيكل أبيض كبير في طور التركيب، بمنظر أفقي واسع في ورشة.'
  },
  scopeEyebrow: { fr: 'Ce que montre cette galerie', ar: 'ما يُظهره هذا المعرض' },
  scopeTitle: { fr: 'Trois familles sur onze, pour l’instant.', ar: 'ثلاث عائلات من إحدى عشرة، إلى حدّ الآن.' },
  scopeBody: {
    fr: [
      'Les photographies réunies ici couvrent les pergolas, les abris et les verrières. Les huit autres familles — portes, portails, fenêtres et grilles, garde-corps, escaliers, clôtures, structures, mobilier — font partie du même métier, mais aucun chantier ne les a encore été photographié pour ce site.',
      'Nous préférons le dire plutôt qu’illustrer ces pages avec des images qui ne viendraient pas d’un chantier Tunisie Pergola. Les pages de famille les présentent donc par le dessin, en attendant les photographies.'
    ],
    ar: [
      'الصور المجمّعة هنا تغطّي البرغولات والمظلات والأسقف الزجاجية. أمّا العائلات الثماني الأخرى — الأبواب والبوابات والنوافذ وقضبان الحماية والدرابزين والسلالم والأسيجة والهياكل والأثاث — فهي من المهنة نفسها، لكن لم تُصوَّر لها بعدُ ورشة لهذا الموقع.',
      'ونفضّل قول ذلك على تزيين تلك الصفحات بصور لا تأتي من ورشة تونيزي برغولا. لذلك تعرضها صفحات العائلات بالرسم، في انتظار الصور.'
    ]
  },
  originEyebrow: { fr: 'Provenance', ar: 'المصدر' },
  originTitle: { fr: 'D’où viennent ces photos.', ar: 'من أين تأتي هذه الصور.' },
  originBody1: {
    fr: 'photographies publiées ici proviennent de la page Facebook de l’entreprise, avec son autorisation pour ce site. Certaines ont été recadrées pour sortir du cadre l’ancien bandeau de contact incrusté sur l’image : aucun élément de chantier n’a été effacé, retouché ou ajouté.',
    ar: 'صورة منشورة هنا مصدرها صفحة فيسبوك الخاصّة بالمؤسسة، بإذن منها لفائدة هذا الموقع. وقد أُعيد قصّ بعضها لإخراج شريط الاتصال القديم المطبوع على الصورة: ولم يُمحَ أيّ عنصر من الورشة ولم يُعدَّل ولم يُضَف.'
  },
  originBody2: {
    fr: 'Les légendes décrivent ce que l’on voit et rien de plus. Ni ville, ni date, ni matériau, ni performance ne sont attribués à une photographie tant que la publication d’origine ne les confirme pas.',
    ar: 'وتصف التعليقات ما يُرى لا غير. فلا مدينة ولا تاريخ ولا مادّة ولا أداء يُنسب إلى صورة ما لم يؤكّده المنشور الأصلي.'
  },
  originLink: { fr: 'Voir la page Facebook', ar: 'مشاهدة صفحة فيسبوك' }
} as const;

/* ==========================================================================
   Zones d'intervention
   ========================================================================== */
export const ZONES = {
  eyebrow: { fr: 'Zones d’intervention', ar: 'مناطق التدخّل' },
  title: { fr: 'Depuis Sousse, vers le reste du pays.', ar: 'من سوسة نحو بقيّة البلاد.' },
  citiesEyebrow: { fr: 'Villes déclarées', ar: 'المدن المعلنة' },
  citiesLede: {
    fr: 'Cette liste reprend exactement les zones que l’entreprise annonce elle-même. Si votre commune n’y figure pas, cela ne veut pas dire non : posez la question.',
    ar: 'تعيد هذه القائمة بالضبط المناطق التي تعلنها المؤسسة بنفسها. وإن لم تكن بلديتك بينها فذلك لا يعني الرفض: اطرح السؤال.'
  },
  placesEyebrow: { fr: 'Lieux de réalisation', ar: 'مواضع الإنجاز' },
  placesTitle: { fr: 'Trois lieux cités dans les publications.', ar: 'ثلاثة مواضع وردت في المنشورات.' },
  placesBody1: {
    fr: 'Les publications publiques de l’entreprise mentionnent des interventions à',
    ar: 'تذكر المنشورات العلنية للمؤسسة تدخّلات في'
  },
  placesBody2: {
    fr: 'Ces lieux sortent de la liste des zones déclarées : ils montrent que le rayon réel dépasse parfois l’annonce.',
    ar: 'وهذه المواضع خارج قائمة المناطق المعلنة: وهي تُظهر أنّ النطاق الفعلي يتجاوز أحيانًا ما يُعلَن.'
  },
  placesBody3: {
    fr: 'Ils ne font pas l’objet de pages dédiées pour l’instant. Une page locale n’a d’intérêt — pour un visiteur comme pour un moteur — que si elle porte une réalisation identifiée, ses photographies et ses informations propres. Tant que ces éléments ne sont pas vérifiés, cette page unique dit la vérité mieux que dix pages recopiées.',
    ar: 'ولا تُفرد لها صفحات خاصّة إلى حدّ الآن. فالصفحة المحلّية لا فائدة منها — لا لزائر ولا لمحرّك بحث — إلّا إذا حملت إنجازًا محدّدًا وصوره ومعلوماته الخاصّة. وما دامت هذه العناصر غير مؤكّدة، فهذه الصفحة الواحدة أصدق من عشر صفحات منسوخة.'
  },
  howEyebrow: { fr: 'Comment ça se passe', ar: 'كيف يجري الأمر' },
  howTitle: { fr: 'Une demande, une réponse.', ar: 'طلب، وردّ.' },
  howText: {
    fr: 'Le déplacement, la fabrication et la pose s’organisent après la prise de contact, en fonction du lieu et du projet.',
    ar: 'يُنظَّم التنقّل والتصنيع والتركيب بعد الاتصال، حسب المكان وحسب المشروع.'
  }
} as const;

/* ==========================================================================
   Contact
   ========================================================================== */
export const CONTACT = {
  eyebrow: { fr: 'Contact', ar: 'اتصال' },
  title: { fr: 'Votre projet mérite une réponse précise.', ar: 'مشروعك يستحقّ ردًّا دقيقًا.' },
  lede: {
    fr: 'Choisissez la famille et l’ouvrage, décrivez le lieu et les dimensions approximatives. L’équipe chargée du suivi commercial vous répond sous 24 heures.',
    ar: 'اختر العائلة والشغل، وصف المكان والأبعاد التقريبية. يردّ عليك الفريق المكلّف بالمتابعة التجارية في غضون 24 ساعة.'
  },
  formTitle: { fr: 'Le projet en quelques champs.', ar: 'المشروع في بضع خانات.' },
  formText: {
    fr: 'Plus la description est concrète, plus la réponse l’est aussi. Une estimation de dimensions suffit — personne ne vous demandera un plan.',
    ar: 'كلّما كان الوصف ملموسًا كان الردّ كذلك. ويكفي تقدير للأبعاد — لن يطلب منك أحد مخطّطًا.'
  },
  directEyebrow: { fr: 'Sans formulaire', ar: 'دون استمارة' },
  directTitle: { fr: 'Appeler, ou écrire sur WhatsApp.', ar: 'الاتصال، أو المراسلة عبر واتساب.' },
  directText: {
    fr: 'Le même numéro répond aux deux. C’est souvent le plus rapide pour une question courte avant de décrire un projet complet.',
    ar: 'الرقم نفسه يجيب في الحالتين. وهو غالبًا الأسرع لسؤال قصير قبل وصف مشروع كامل.'
  },
  intakeLabel: { fr: 'Réception des demandes', ar: 'تلقّي الطلبات' },
  intakeText: {
    fr: 'Les demandes envoyées depuis ce site sont reçues et traitées par DCB Authority Group :',
    ar: 'الطلبات المرسلة من هذا الموقع تتلقّاها وتعالجها DCB Authority Group:'
  }
} as const;

/* ==========================================================================
   Politique de confidentialité
   ========================================================================== */
export const PRIVACY = {
  eyebrow: { fr: 'Vie privée', ar: 'الحياة الخاصّة' },
  title: { fr: 'Ce que devient ce que vous écrivez.', ar: 'ما يصير إليه ما تكتبه.' },
  lede: {
    fr: 'Cette page décrit le traitement réellement en place sur ce site : les données du formulaire de projet, ce que le navigateur retient, et ce que le site ne fait pas.',
    ar: 'تصف هذه الصفحة المعالجة القائمة فعلًا في هذا الموقع: بيانات استمارة المشروع، وما يحتفظ به المتصفّح، وما لا يفعله الموقع.'
  },
  collectEyebrow: { fr: 'Données collectées', ar: 'البيانات المجمّعة' },
  collectTitle: { fr: 'Uniquement le formulaire de projet.', ar: 'استمارة المشروع لا غير.' },
  collectText: {
    fr: 'Aucune autre page ne collecte de donnée. Naviguer sur le site sans envoyer de demande ne transmet rien.',
    ar: 'ولا تجمع أيّ صفحة أخرى بيانات. وتصفّح الموقع دون إرسال طلب لا ينقل شيئًا.'
  },
  collect: [
    [
      { fr: 'Nom et prénom', ar: 'الاسم واللقب' },
      { fr: 'Obligatoire — pour savoir à qui répondre.', ar: 'إجباري — لمعرفة من نردّ عليه.' }
    ],
    [
      { fr: 'Téléphone', ar: 'رقم الهاتف' },
      { fr: 'Obligatoire — c’est le canal de rappel principal.', ar: 'إجباري — وهو قناة معاودة الاتصال الأساسية.' }
    ],
    [
      { fr: 'Ville', ar: 'المدينة' },
      { fr: 'Obligatoire — pour situer le projet et l’intervention.', ar: 'إجباري — لتحديد موضع المشروع والتدخّل.' }
    ],
    [
      { fr: 'Famille d’ouvrages, ouvrage souhaité, dimensions approximatives', ar: 'عائلة الأشغال، والشغل المطلوب، والأبعاد التقريبية' },
      { fr: 'Obligatoires — pour préparer une réponse utile.', ar: 'إجبارية — لإعداد ردّ مفيد.' }
    ],
    [
      { fr: 'Message', ar: 'الرسالة' },
      { fr: 'Obligatoire — votre description du projet.', ar: 'إجبارية — وصفك للمشروع.' }
    ],
    [
      { fr: 'E-mail', ar: 'البريد الإلكتروني' },
      { fr: 'Facultatif — seulement si vous préférez une réponse écrite.', ar: 'اختياري — فقط إن فضّلت ردًّا مكتوبًا.' }
    ],
    [
      { fr: 'Échéance souhaitée', ar: 'الأجل المطلوب' },
      { fr: 'Facultatif — pour situer l’urgence.', ar: 'اختياري — لتقدير درجة الاستعجال.' }
    ],
    [
      { fr: 'Origine de la visite et page d’entrée', ar: 'مصدر الزيارة وصفحة الدخول' },
      {
        fr: 'Ajoutées automatiquement à votre demande : le site d’où vous venez et la première page consultée.',
        ar: 'تُضاف تلقائيًا إلى طلبك: الموقع الذي جئت منه وأوّل صفحة اطّلعت عليها.'
      }
    ]
  ],
  whoEyebrow: { fr: 'Qui reçoit', ar: 'من يتلقّى' },
  whoTitle: { fr: 'DCB, puis l’entreprise.', ar: 'DCB، ثمّ المؤسسة.' },
  whoBody: {
    fr: [
      'Le bouton d’envoi du formulaire ouvre une conversation WhatsApp avec votre demande déjà rédigée. L’envoi reste votre geste : tant que vous n’appuyez pas sur envoyer, rien ne part par ce canal. WhatsApp est un service tiers, et ses propres conditions s’appliquent à la conversation.',
      'En parallèle, une copie de la demande est transmise à DCB Authority Group, l’agence qui opère ce site pour Tunisie Pergola, puis relayée à l’entreprise pour le suivi du projet. Les boutons « Demander un devis » du site, eux, ouvrent WhatsApp sans copie : ils ne transmettent que ce que vous écrivez vous-même dans la conversation.',
      'Techniquement, le formulaire poste vers un formulaire Google : les réponses sont donc hébergées par Google, chez qui DCB les consulte. Aucun autre destinataire n’existe, et aucune donnée n’est revendue ni utilisée à des fins publicitaires.'
    ],
    ar: [
      'زرّ إرسال الاستمارة يفتح محادثة واتساب وطلبك مكتوب فيها. أمّا الإرسال فيبقى فعلك أنت: ما لم تضغط على «إرسال» لا يخرج شيء عبر هذه القناة. وواتساب خدمة طرف ثالث، وشروطه الخاصّة تنطبق على المحادثة.',
      'وبالتوازي، تُحال نسخة من الطلب إلى DCB Authority Group — الوكالة التي تدير هذا الموقع لفائدة تونيزي برغولا — ثمّ إلى المؤسسة لمتابعة المشروع. أمّا أزرار «اطلب عرض سعر» في الموقع فتفتح واتساب دون نسخة: ولا تنقل إلّا ما تكتبه أنت في المحادثة.',
      'وتقنيًا، ترسل الاستمارة إلى استمارة غوغل: فتُستضاف الإجابات لدى غوغل، وهناك تطّلع عليها DCB. ولا وجود لأيّ متلقٍّ آخر، ولا تُباع أيّ بيانات ولا تُستعمل لأغراض إشهارية.'
    ]
  },
  keepEyebrow: { fr: 'Conservation et droits', ar: 'الحفظ والحقوق' },
  keepTitle: { fr: 'Le temps du suivi, pas au-delà.', ar: 'مدّة المتابعة، لا أكثر.' },
  keepBody: {
    fr: [
      'Les réponses sont conservées le temps du suivi de votre demande. Vous pouvez à tout moment demander à consulter, corriger ou supprimer ce que vous avez envoyé, en écrivant à l’adresse ci-dessous : la ligne correspondante est alors retirée.',
      'Une durée de conservation chiffrée sera publiée ici lorsqu’elle aura été arrêtée avec l’entreprise. Annoncer une durée qui ne serait pas réellement appliquée serait pire que de ne rien annoncer.'
    ],
    ar: [
      'تُحفَظ الإجابات مدّة متابعة طلبك. ويمكنك في أيّ وقت طلب الاطّلاع على ما أرسلته أو تصحيحه أو حذفه، بالكتابة إلى العنوان أسفله: فيُسحب السطر المعني.',
      'وسيُنشر هنا أجل حفظ محدّد حين يُضبط مع المؤسسة. فإعلان مدّة لا تُطبَّق فعلًا أسوأ من عدم إعلان شيء.'
    ]
  },
  notEyebrow: { fr: 'Ce que le site ne fait pas', ar: 'ما لا يفعله الموقع' },
  notTitle: { fr: 'Aucun cookie, aucune mesure d’audience.', ar: 'لا كعكات ولا قياس جمهور.' },
  notBody: {
    fr: [
      'Ce site ne dépose aucun cookie, ne charge aucun outil de mesure, aucun pixel publicitaire et aucune police distante. C’est la raison pour laquelle vous ne voyez pas de bandeau de consentement : il n’y aurait rien à consentir.',
      'Deux informations sont gardées par votre navigateur, dans le stockage de session, et effacées à sa fermeture : l’origine de votre visite et les étapes de votre parcours de contact. Elles ne partent nulle part tant que vous n’envoyez pas de demande, et elles sont alors jointes à la demande elle-même.',
      'Le téléversement de fichiers n’est pas proposé. Il ne le sera que si un stockage sécurisé, une limite de taille, un contrôle de type et une politique de conservation existent réellement.'
    ],
    ar: [
      'لا يضع هذا الموقع أيّ كعكة، ولا يحمّل أيّ أداة قياس ولا أيّ بكسل إشهاري ولا أيّ خطّ من خادم بعيد. ولهذا لا ترى شريط موافقة: إذ لا شيء يُوافَق عليه.',
      'ويحتفظ متصفّحك بمعلومتين في تخزين الجلسة، وتُمحيان عند إغلاقه: مصدر زيارتك ومراحل مسارك نحو الاتصال. ولا تُرسلان إلى أيّ مكان ما لم تُرسل طلبًا، وعندها تُرفقان بالطلب نفسه.',
      'ولا يُقترح تحميل ملفّات. ولن يُقترح إلّا إذا وُجد فعلًا تخزين آمن وحدّ للحجم ومراقبة للنوع وسياسة للحفظ.'
    ]
  },
  askEyebrow: { fr: 'Nous écrire', ar: 'مراسلتنا' },
  askTitle: { fr: 'Une seule adresse.', ar: 'عنوان واحد.' },
  askText: {
    fr: 'Pour toute question sur vos données, ou pour en demander la suppression :',
    ar: 'لكلّ سؤال عن بياناتك، أو لطلب حذفها:'
  }
} as const;

/* ==========================================================================
   Page introuvable
   ========================================================================== */
export const LOST = {
  eyebrow: { fr: 'Page introuvable', ar: 'الصفحة غير موجودة' },
  title: { fr: 'Cette adresse ne mène nulle part.', ar: 'هذا العنوان لا يؤدّي إلى شيء.' },
  lede: {
    fr: 'Le lien est peut-être ancien, ou l’adresse comporte une faute. Voici les chemins les plus courts vers ce que vous cherchiez.',
    ar: 'قد يكون الرابط قديمًا أو في العنوان خطأ. وهذه أقصر الطرق نحو ما كنت تبحث عنه.'
  },
  families: { fr: 'Familles d’ouvrages', ar: 'عائلات الأشغال' },
  company: { fr: 'L’entreprise', ar: 'المؤسسة' },
  direct: { fr: 'Direct', ar: 'اتصال مباشر' }
} as const;
