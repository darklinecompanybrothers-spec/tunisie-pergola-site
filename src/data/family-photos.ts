/**
 * Photographies d'ouverture des familles — seulement celles qui existent.
 * =======================================================================
 *
 * Trois familles sur onze ont des photographies authentiques dans le dossier
 * client : les pergolas, les abris et les verrières. Elles ouvrent donc sur une
 * photographie de chantier.
 *
 * Les huit autres ne figurent PAS dans cette table, et c'est le point : une
 * entrée absente fait ouvrir la page sur une élévation dessinée
 * (`components/Motif.astro`). Il n'existe aucun chemin par lequel une famille
 * pourrait hériter de la photographie d'une autre — ce qui serait exactement
 * l'attribution trompeuse que le brief interdit.
 *
 * Le jour où le client envoie des photographies de portails ou d'escaliers, il
 * suffit d'ajouter une ligne ici : la page bascule d'elle-même du dessin à la
 * photographie, dans les deux langues.
 */
import type { ImageMetadata } from 'astro';
import type { Bilingual } from '../i18n/locales';
import type { FamilyKey } from './catalogue';

import pergolasPhoto from '../assets/photos/derived/pergola-lames-rooftop-terrasse-bois.jpg';
import abrisPhoto from '../assets/photos/derived/pose-couverture-bord-de-piscine.jpg';
import verrieresPhoto from '../assets/photos/derived/veranda-vitree-lames-salon.jpg';

export interface FamilyPhoto {
  readonly photo: ImageMetadata;
  readonly alt: Bilingual;
}

export const FAMILY_PHOTOS: Partial<Record<FamilyKey, FamilyPhoto>> = {
  pergolas: {
    photo: pergolasPhoto,
    alt: {
      fr: 'Pergola à lames sombres indépendante à deux travées sur une terrasse en toiture, panneaux latéraux vitrés et sol en lames de bois.',
      ar: 'برغولا بشرائح داكنة مستقلّة بجناحين على شرفة سطح، بألواح جانبية زجاجية وأرضية بألواح خشب.'
    }
  },
  abris: {
    photo: abrisPhoto,
    alt: {
      fr: 'Pose d’une couverture sombre à sous-face bois au bord d’une piscine, engin de levage et ouvriers sur la structure.',
      ar: 'تركيب تغطية داكنة بسطح سفلي خشبي على حافّة مسبح، برافعة وعمّال فوق الهيكل.'
    }
  },
  verrieres: {
    photo: verrieresPhoto,
    alt: {
      fr: 'Véranda entièrement vitrée coiffée d’une toiture à lames sombres, salon en résine tressée, tronc de palmier au premier plan et bassin au fond.',
      ar: 'شرفة مزجّجة بالكامل يعلوها سقف بشرائح داكنة، وصالون من الراتنج المضفور، وجذع نخلة في المقدّمة وحوض ماء في العمق.'
    }
  }
};
