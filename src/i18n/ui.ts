/**
 * Chaînes d'interface, dans les deux langues.
 * ===========================================
 *
 * Tout ce qui n'est pas un fait client (`site.config.mjs`) ni du contenu
 * éditorial (`catalogue.ts`, `copy.ts`) vit ici : libellés de navigation,
 * boutons, formulaire, messages d'erreur, mentions d'accessibilité.
 *
 * Le dictionnaire est un objet `as const` typé par lui-même : ajouter une clé
 * en français sans son arabe fait échouer `tsc`. C'est la seule garantie qui
 * survive à une reprise du projet dans six mois — une traduction oubliée n'est
 * pas une chaîne vide à l'écran, c'est un build qui refuse de partir.
 */
import type { Bilingual, Locale } from './locales';

const UI = {
  /* --- Navigation ------------------------------------------------------- */
  navPrimary: { fr: 'Navigation principale', ar: 'التنقّل الرئيسي' },
  navMenu: { fr: 'Navigation du menu', ar: 'تنقّل القائمة' },
  navFamilies: { fr: 'Familles', ar: 'العائلات' },
  navCatalogueAll: { fr: 'Tout le savoir-faire', ar: 'كامل الاختصاصات' },
  navRealisations: { fr: 'Réalisations', ar: 'الإنجازات' },
  navAbout: { fr: 'L’entreprise', ar: 'المؤسسة' },
  navZones: { fr: 'Zones d’intervention', ar: 'مناطق التدخّل' },
  navContact: { fr: 'Contact', ar: 'اتصال' },
  menuOpen: { fr: 'Menu', ar: 'القائمة' },
  menuClose: { fr: 'Fermer', ar: 'إغلاق' },
  menuLabel: { fr: 'Menu du site', ar: 'قائمة الموقع' },
  skip: { fr: 'Aller au contenu', ar: 'تجاوز إلى المحتوى' },
  home: { fr: 'Accueil', ar: 'الرئيسية' },
  homeAria: { fr: 'accueil', ar: 'الصفحة الرئيسية' },
  breadcrumb: { fr: 'Fil d’Ariane', ar: 'مسار التصفّح' },
  langSwitch: { fr: 'Langue', ar: 'اللغة' },
  langToArabic: { fr: 'العربية', ar: 'العربية' },
  langToFrench: { fr: 'Français', ar: 'Français' },
  newTab: { fr: ' (nouvel onglet)', ar: ' (نافذة جديدة)' },

  /* --- Appels à l'action ------------------------------------------------ */
  ctaProject: { fr: 'Parler de votre projet', ar: 'تحدّث عن مشروعك' },
  ctaSend: { fr: 'Envoyer sur WhatsApp', ar: 'إرسال عبر واتساب' },
  ctaSeeWorks: { fr: 'Voir les réalisations', ar: 'مشاهدة الإنجازات' },
  ctaAllWorks: { fr: 'Toutes les réalisations', ar: 'كلّ الإنجازات' },
  ctaZones: { fr: 'Détail des zones', ar: 'تفاصيل المناطق' },
  ctaCatalogue: { fr: 'Voir les onze familles', ar: 'مشاهدة العائلات الإحدى عشرة' },
  ctaFamily: { fr: 'Voir la famille', ar: 'مشاهدة العائلة' },
  ctaHowWeWork: { fr: 'Comment nous travaillons', ar: 'كيف نشتغل' },
  scrollCue: { fr: 'Défiler', ar: 'مرّر' },

  /* --- Demande de devis --------------------------------------------------
     Le libellé dit « devis », jamais « devis gratuit » : la visite et l’étude
     sont des services payants avant engagement (CLIENT-BRIEF §2 bis), et le
     contrôle de build refuse le mot. Promettre la gratuité pour gagner un clic
     coûterait la confiance au premier appel. */
  ctaQuote: { fr: 'Demander un devis', ar: 'اطلب عرض سعر' },
  ctaQuoteShort: { fr: 'Devis', ar: 'عرض سعر' },
  ctaQuoteAria: {
    fr: 'Demander un devis sur WhatsApp',
    ar: 'طلب عرض سعر عبر واتساب'
  },
  ctaDescribe: { fr: 'Décrire mon projet', ar: 'صف مشروعك بالتفصيل' },
  quoteEyebrow: { fr: 'Devis', ar: 'عرض سعر' },
  quoteNudge: {
    fr: 'Un projet dans cette famille ?',
    ar: 'مشروع في هذه العائلة؟'
  },
  quoteNudgeText: {
    fr: 'Envoyez les dimensions approximatives et une photo du lieu sur WhatsApp : c’est le chemin le plus court vers une réponse utile.',
    ar: 'أرسل الأبعاد التقريبية وصورة للمكان عبر واتساب: هو أقصر طريق نحو ردّ مفيد.'
  },
  quoteBarAria: { fr: 'Demande de devis rapide', ar: 'طلب عرض سعر سريع' },
  whatsappAnswer: { fr: 'Réponse sur WhatsApp', ar: 'الردّ عبر واتساب' },

  /* --- Canaux ----------------------------------------------------------- */
  channelCall: { fr: 'Appeler', ar: 'اتصال هاتفي' },
  channelWhatsapp: { fr: 'WhatsApp', ar: 'واتساب' },
  channelEmail: { fr: 'E-mail', ar: 'البريد الإلكتروني' },
  channelAddress: { fr: 'Adresse', ar: 'العنوان' },
  labelPhone: { fr: 'Téléphone et WhatsApp', ar: 'الهاتف وواتساب' },
  labelNetwork: { fr: 'Réseau', ar: 'الشبكات' },
  labelFacebookPage: { fr: 'Page Facebook', ar: 'صفحة فيسبوك' },
  labelDelay: { fr: 'Délai', ar: 'الآجال' },
  labelVisit: { fr: 'Visite sur place', ar: 'المعاينة في الموقع' },
  labelStudy: { fr: 'Étude', ar: 'الدراسة' },
  labelBase: { fr: 'Implantation', ar: 'مقرّ النشاط' },
  labelAreas: { fr: 'Interventions', ar: 'التدخّلات' },
  labelRequest: { fr: 'Demande de projet', ar: 'طلب مشروع' },
  citiesDeclared: { fr: 'villes déclarées', ar: 'مدينة معلنة' },

  /* --- Pied de page ----------------------------------------------------- */
  footerFamilies: { fr: 'Familles d’ouvrages', ar: 'عائلات الأشغال' },
  footerSite: { fr: 'Le site', ar: 'الموقع' },
  footerStudio: { fr: 'Conçu et développé par', ar: 'تصميم وتطوير' },

  /* --- Sections récurrentes --------------------------------------------- */
  eyebrowService: { fr: 'Famille d’ouvrages', ar: 'عائلة أشغال' },
  eyebrowWhat: { fr: 'Ce que c’est', ar: 'ما هو' },
  eyebrowProducts: { fr: 'Ce que nous réalisons', ar: 'ما ننجزه' },
  eyebrowUses: { fr: 'Usages', ar: 'الاستعمالات' },
  eyebrowJourney: { fr: 'Le parcours', ar: 'المسار' },
  eyebrowNearby: { fr: 'Familles voisines', ar: 'عائلات مجاورة' },
  eyebrowQuestions: { fr: 'Questions utiles', ar: 'أسئلة مفيدة' },
  eyebrowYourProject: { fr: 'Votre projet', ar: 'مشروعك' },
  eyebrowZones: { fr: 'Zones d’intervention', ar: 'مناطق التدخّل' },
  eyebrowSituation: { fr: 'En situation', ar: 'في الموقع' },

  productsTitle: { fr: 'Les ouvrages de cette famille.', ar: 'أشغال هذه العائلة.' },
  journeyTitle: { fr: 'De la conception à la pose.', ar: 'من التصميم إلى التركيب.' },
  nearbyTitle: { fr: 'Si votre projet penche ailleurs.', ar: 'إذا مال مشروعك نحو غير ذلك.' },
  questionsTitle: { fr: 'Ce qu’on nous demande d’abord.', ar: 'ما يُسأل عنه أولًا.' },

  ctaTitle: { fr: 'Votre projet mérite une réponse précise.', ar: 'مشروعك يستحقّ ردًّا دقيقًا.' },
  ctaText: {
    fr: 'Décrivez le lieu, les dimensions approximatives et l’usage recherché. L’équipe chargée du suivi commercial vous répond sous 24 heures.',
    ar: 'صف المكان والأبعاد التقريبية والاستعمال المطلوب. يردّ عليك الفريق المكلّف بالمتابعة التجارية في غضون 24 ساعة.'
  },

  /* --- Formulaire -------------------------------------------------------- */
  formName: { fr: 'Nom et prénom', ar: 'الاسم واللقب' },
  formPhone: { fr: 'Téléphone', ar: 'رقم الهاتف' },
  formPhoneHint: {
    fr: 'Le numéro sur lequel vous êtes joignable.',
    ar: 'الرقم الذي يمكن الاتصال بك عليه.'
  },
  formCity: { fr: 'Ville', ar: 'المدينة' },
  formEmail: { fr: 'E-mail', ar: 'البريد الإلكتروني' },
  formFamily: { fr: 'Famille d’ouvrages', ar: 'عائلة الأشغال' },
  formProduct: { fr: 'Ouvrage souhaité', ar: 'الشغل المطلوب' },
  formProductHint: {
    fr: 'La liste suit la famille choisie. Si rien ne correspond, décrivez-le plus bas.',
    ar: 'تتبع القائمة العائلة المختارة. إن لم يوافق شيء، صفه في الخانة أسفله.'
  },
  formDimensions: { fr: 'Dimensions approximatives', ar: 'الأبعاد التقريبية' },
  formDimensionsHint: {
    fr: 'Une estimation suffit, même approximative.',
    ar: 'يكفي تقدير تقريبي.'
  },
  formDimensionsPlaceholder: { fr: 'environ 4 m × 6 m', ar: 'حوالي 4 م × 6 م' },
  formDeadline: { fr: 'Échéance souhaitée', ar: 'الأجل المطلوب' },
  formMessage: { fr: 'Votre projet', ar: 'مشروعك' },
  formMessageHint: {
    fr: 'Le lieu, ce que vous voulez en faire, et tout ce qui vous semble utile.',
    ar: 'المكان، وما تريد فعله به، وكلّ ما تراه مفيدًا.'
  },
  formOptional: { fr: '(facultatif)', ar: '(اختياري)' },
  formChoose: { fr: 'Choisir…', ar: 'اختر…' },
  formConsent: {
    fr: 'J’accepte que les informations saisies soient utilisées pour me recontacter au sujet de ma demande.',
    ar: 'أوافق على استعمال المعلومات المدرجة للاتصال بي بخصوص طلبي.'
  },
  formPrivacyLink: { fr: 'Politique de confidentialité', ar: 'سياسة الخصوصية' },
  formErrorsTitle: { fr: 'Votre demande n’est pas encore partie', ar: 'لم يُرسل طلبك بعد' },
  formSending: { fr: 'Envoi en cours…', ar: 'جارٍ الإرسال…' },
  formSentTitle: { fr: 'Votre demande part sur WhatsApp', ar: 'طلبك في طريقه عبر واتساب' },
  formSentText: {
    fr: 'La conversation s’ouvre avec votre demande déjà écrite : il ne reste qu’à l’envoyer. Une copie est aussi partie vers l’équipe chargée du suivi commercial.',
    ar: 'تُفتح المحادثة وطلبك مكتوب فيها: لم يبق إلّا إرساله. وقد وصلت نسخة أيضًا إلى الفريق المكلّف بالمتابعة التجارية.'
  },
  formOpenWhatsapp: { fr: 'Ouvrir WhatsApp', ar: 'فتح واتساب' },
  formSentBlocked: {
    fr: 'Si WhatsApp ne s’est pas ouvert, ce bouton le fait.',
    ar: 'إن لم يُفتح واتساب، فهذا الزرّ يفتحه.'
  },
  formSentFallback: {
    fr: 'Sans nouvelle d’ici là, appelez ou écrivez sur WhatsApp au',
    ar: 'إن لم يصلك ردّ، اتصل أو راسلنا على واتساب على الرقم'
  },
  formFailed: {
    fr: 'La demande n’a pas pu partir — vos réponses sont conservées ci-dessus. Réessayez, ou passez par : ',
    ar: 'تعذّر إرسال الطلب — إجاباتك محفوظة أعلاه. أعد المحاولة أو مُرّ عبر: '
  },
  formFallbackWhatsapp: {
    fr: 'Envoyer la même demande sur WhatsApp',
    ar: 'إرسال الطلب نفسه عبر واتساب'
  },
  formFallbackCall: { fr: ' · appeler le ', ar: ' · الاتصال بالرقم ' },
  formCountOne: { fr: 'champ à compléter.', ar: 'خانة ينقصها.' },
  formCountMany: { fr: 'champs à compléter.', ar: 'خانات تنقصها.' },
  /* Le deux-points : espace insécable devant en français, collé en arabe. Le
     script du formulaire le lit dans le HTML plutôt que de le coder en dur —
     comme tout le reste de ses chaînes. */
  fieldSeparator: { fr: ' : ', ar: ': ' },
  consentShort: { fr: 'Consentement', ar: 'الموافقة' },
  consentLine: {
    fr: 'Consentement de contact : accordé',
    ar: 'الموافقة على الاتصال: ممنوحة'
  },
  formWhatsappIntro: {
    fr: 'Bonjour Tunisie Pergola, je souhaite un devis pour le projet suivant :',
    ar: 'مرحبًا تونيزي برغولا، أودّ الحصول على عرض سعر للمشروع التالي:'
  },

  /* --- Erreurs de champ -------------------------------------------------- */
  errName: { fr: 'Indiquez le nom à qui répondre.', ar: 'اذكر الاسم الذي نردّ عليه.' },
  errPhone: {
    fr: 'Indiquez un numéro joignable (au moins 8 chiffres).',
    ar: 'اذكر رقمًا يمكن الاتصال به (8 أرقام على الأقلّ).'
  },
  errCity: { fr: 'Indiquez la ville du projet.', ar: 'اذكر مدينة المشروع.' },
  errFamily: { fr: 'Choisissez une famille d’ouvrages.', ar: 'اختر عائلة الأشغال.' },
  errProduct: { fr: 'Choisissez l’ouvrage souhaité.', ar: 'اختر الشغل المطلوب.' },
  errDimensions: {
    fr: 'Une estimation suffit, par exemple « environ 4 m × 6 m ».',
    ar: 'يكفي تقدير، مثلًا «حوالي 4 م × 6 م».'
  },
  errMessage: {
    fr: 'Décrivez le projet en quelques mots (20 caractères minimum).',
    ar: 'صف المشروع في بضع كلمات (20 حرفًا على الأقلّ).'
  },
  errEmail: { fr: 'Cette adresse e-mail semble incomplète.', ar: 'يبدو هذا البريد الإلكتروني ناقصًا.' },
  errConsent: {
    fr: 'Votre accord est nécessaire pour vous recontacter.',
    ar: 'موافقتك ضرورية حتى نتمكّن من الاتصال بك.'
  },

  /* --- Valeurs de listes -------------------------------------------------- */
  deadlineAsap: { fr: 'Dès que possible', ar: 'في أقرب وقت' },
  deadline1to3: { fr: 'Dans 1 à 3 mois', ar: 'خلال شهر إلى ثلاثة أشهر' },
  deadline3to6: { fr: 'Dans 3 à 6 mois', ar: 'خلال ثلاثة إلى ستّة أشهر' },
  deadlineUnsure: { fr: 'Pas encore décidé', ar: 'لم يُحدَّد بعد' },
  familyUnsure: { fr: 'Je ne sais pas encore', ar: 'لا أعرف بعد' },
  productOther: { fr: 'Autre ouvrage — je décris plus bas', ar: 'شغل آخر — أصفه أسفله' },

  /* --- Galerie ----------------------------------------------------------- */
  filterLegend: { fr: 'Filtrer les réalisations', ar: 'تصفية الإنجازات' },
  filterAll: { fr: 'Tout', ar: 'الكلّ' },
  filterDone: { fr: 'Réalisations terminées', ar: 'إنجازات مكتملة' },
  filterSite: { fr: 'Chantier et pose', ar: 'الورشة والتركيب' },
  filterDetails: { fr: 'Détails de structure', ar: 'تفاصيل الهيكل' },
  countWorks: { fr: 'ouvrages', ar: 'أشغال' },
  familiesEyebrow: { fr: 'Onze familles', ar: 'إحدى عشرة عائلة' },
  familiesTitle: {
    fr: 'Tout ce qui se fabrique en métal.',
    ar: 'كلّ ما يُصنع من المعدن.'
  },
  familiesLede: {
    fr: 'Onze familles d’ouvrages, cinquante réalisations types. La même équipe conçoit, fabrique et pose.',
    ar: 'إحدى عشرة عائلة من الأشغال، وخمسون شغلًا نموذجيًا. الفريق نفسه يصمّم ويصنع ويركّب.'
  },
  galleryHeading: { fr: 'Galerie des réalisations', ar: 'معرض الإنجازات' }
} as const satisfies Record<string, Bilingual>;

export type UIKey = keyof typeof UI;

/** Lit une chaîne d'interface. Une clé inconnue ne compile pas. */
export function ui(key: UIKey, locale: Locale): string {
  return UI[key][locale];
}

export { UI };
