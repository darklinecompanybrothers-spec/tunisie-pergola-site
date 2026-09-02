/**
 * La demande de devis — un seul message, composé au bon endroit.
 * ==============================================================
 *
 * POURQUOI UN MODULE, ET PAS UN LIEN ÉCRIT À LA MAIN
 * Le site porte des dizaines d'appels à l'action, dans deux langues, sur
 * dix-huit routes. Écrire l'adresse WhatsApp à la main à chaque fois aurait
 * produit trois choses : des messages qui divergent, des messages qui oublient
 * de dire d'où vient le visiteur, et un numéro recopié — c'est-à-dire figé au
 * jour où il a été écrit.
 *
 * Ici, chaque bouton déclare seulement SON SUJET. Le module compose le reste :
 * la salutation, la phrase de demande, le sujet, la ligne de provenance. Le
 * numéro, lui, vient de `site.config.mjs` comme tout le reste.
 *
 * CE QUE CHANGE UN MESSAGE PRÉ-REMPLI
 * Un lien WhatsApp nu ouvre une conversation vide : le prospect doit écrire
 * lui-même ce qu'il veut, et la moitié n'écrit rien. Un message pré-rempli
 * arrive déjà qualifié — « je souhaite un devis pour : Portails métalliques,
 * vu sur la page Portails métalliques » — et l'entreprise sait de quoi on
 * parle avant même de répondre. C'est tout l'écart entre un bouton de contact
 * et un bouton de conversion.
 *
 * CE QU'IL NE DIT PAS
 * Rien sur le prix, rien sur la gratuité. La visite et l'étude sont des
 * services payants (CLIENT-BRIEF §2 bis) : le bouton demande un devis, il ne
 * promet pas qu'il sera offert.
 */
import { SITE } from './site';
import type { Bilingual, Locale } from '../i18n/locales';

/**
 * Salutation et demande — la même dans tout le site.
 *
 * L’arabe emploie la forme translittérée du nom, « تونيزي برغولا », comme le
 * font déjà les titres et les descriptions arabes du site. Un « Bonjour
 * Tunisie Pergola » en caractères latins au milieu d’une phrase arabe se lit
 * comme un copier-coller — et c’est la première ligne que le client voit
 * arriver dans sa conversation.
 */
const OPENING: Bilingual = {
  fr: `Bonjour ${SITE.name}, je souhaite un devis pour :`,
  ar: 'مرحبًا تونيزي برغولا، أودّ الحصول على عرض سعر لـ:'
};

/** Sujet employé quand la page n'en désigne pas de plus précis. */
export const GENERIC_SUBJECT: Bilingual = {
  fr: 'un ouvrage métallique sur mesure',
  ar: 'شغل معدني حسب الطلب'
};

/**
 * Ligne de provenance : la page d'où part la demande.
 *
 * Le deux-points est collé au mot en arabe et précédé d'une espace fine en
 * français : deux conventions typographiques, deux chaînes. Les fusionner
 * aurait donné une ponctuation fautive dans une langue sur deux.
 */
const FROM: Bilingual = {
  fr: 'Depuis la page :',
  ar: 'من صفحة:'
};

export interface QuoteContext {
  /** Ce que le visiteur demande. Défaut : la formule générique. */
  readonly subject?: string | undefined;
  /** Libellé de la page de départ, tel qu'il est affiché au visiteur. */
  readonly from?: string | undefined;
}

/**
 * Le texte du message WhatsApp.
 *
 * Trois lignes au plus : personne ne relit un pavé avant de l'envoyer, et un
 * message trop long est un message que le prospect efface.
 */
export function quoteMessage(locale: Locale, context: QuoteContext = {}): string {
  const subject = context.subject ?? GENERIC_SUBJECT[locale];
  const lines = [`${OPENING[locale]} ${subject}.`];
  if (context.from) lines.push(`${FROM[locale]} ${context.from}`);
  return lines.join('\n');
}

/**
 * L'adresse WhatsApp complète, message compris.
 *
 * `wa.me` attend le texte dans le paramètre `text`, encodé. `URLSearchParams`
 * encode l'espace en `+`, que WhatsApp affiche tel quel — d'où l'encodage
 * manuel, qui produit `%20` et un message propre à l'arrivée.
 */
export function quoteHref(locale: Locale, context: QuoteContext = {}): string {
  return `${SITE.contact.whatsappHref}?text=${encodeURIComponent(quoteMessage(locale, context))}`;
}
