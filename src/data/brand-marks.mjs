/**
 * Système de marque Tunisie Pergola — géométrie SVG
 * =================================================
 * Identité v1, proposition DCB à valider avec le client.
 *
 * PROVENANCE DE LA FORME
 * ----------------------
 * Le dessin ci-dessous n'est pas une interprétation : c'est le relevé du
 * concept approuvé `docs/clients/tunisie-pergola/assets/brand-concepts/
 * tunisie-pergola-logo-concept-v1-transparent.png`, mesuré au pixel sur le
 * raster (décodage PNG, classification anthracite/cuivre, extraction des
 * segments), puis reconstruit en coordonnées entières et rigoureuses. Le PNG
 * n'est ni vectorisé automatiquement ni agrandi : il a servi de calque de
 * mesure, le vecteur est redessiné.
 *
 * Relevé retenu (repère local du symbole, origine au coin haut-gauche de la
 * traverse arrière, unité = pixel du concept) :
 *
 *   traverse arrière ....... x 0 → 528     y 0 → 32
 *   plan de toiture ........ profondeur oblique (+72, +92)
 *   panne avant ............ x 72 → 582    y 92 → 124
 *   chevron d'about ........ largeur 24, à gauche, même obliquité
 *   lames cuivre ........... 6, largeur 32, pas 92, première à x = 24
 *   hampe du T ............. x 172 → 216   y 124 → 472
 *   hampe du P ............. x 312 → 356   y 124 → 472
 *   panse du P ............. cercle (443, 252) r 98, contrepoinçon r 52
 *
 * Les lames s'arrêtent 8 unités avant le bas de la panne : c'est ce liseré
 * sombre qui donne au concept sa lecture « les chevrons reposent sur la
 * poutre ». Il est reproduit tel quel.
 *
 * NARRATION
 * ---------
 * Chaque pièce est un groupe adressable (`data-part`). L'accueil s'en sert
 * pour désassembler le monogramme pendant la descente et le recomposer à la
 * remontée : le mouvement est une fonction du défilement, donc réversible par
 * construction. La forme, elle, n'est jamais réinterprétée — seules des
 * translations, rotations et opacités lui sont appliquées.
 *
 * MOT-SYMBOLE
 * -----------
 * Alphabet géométrique dessiné (12 capitales), relevé sur le même concept :
 * hauteur de capitale 100, épaisseur 21, chasses propres à chaque lettre,
 * approche large de 38. Il est dessiné ici et non composé dans une police,
 * pour que les fichiers remis au client soient autonomes et que le logo ne
 * dépende d'aucun rendu de texte.
 */

/* ==========================================================================
   SYMBOLE
   ========================================================================== */

export const MARK_VIEWBOX = '0 0 582 472';

/** Épaisseur d'une hampe — sert aussi de zone de protection minimale. */
export const MARK_UNIT = 44;

const BEAM = 32; // épaisseur des deux poutres
const SPAN = 528; // portée de la traverse arrière
/** La panne avant s'arrête sur l'about de la dernière lame : 24 + 5×92 + 32 + 66 − 72. */
const RAIL_SPAN = 510;
const DEPTH_X = 72; // décalage horizontal du plan de toiture
const DEPTH_Y = 92; // décalage vertical du plan de toiture
const RAKE_W = 24; // chevron d'about, à gauche
const SLAT_W = 32;
const SLAT_PITCH = 92;
const SLAT_COUNT = 6;
const SLAT_END = 116; // les lames s'arrêtent avant le bas de la panne
const STEM = 44;
const STEM_TOP = BEAM + DEPTH_Y; // 124 — les hampes naissent sous la panne
const STEM_BOTTOM = 472;
const T_X = 172;
const P_X = 312;
const BOWL_CX = 443;
const BOWL_CY = 252;
const BOWL_R = 98;
const COUNTER_R = 52;

/** Décalage horizontal du plan oblique pour une descente de `dy`. */
const skew = (dy) => Math.round((dy * DEPTH_X) / DEPTH_Y);

/** Une lame : parallélogramme posé sur le plan de toiture. */
function slat(index) {
  const x = RAKE_W + index * SLAT_PITCH;
  const dy = SLAT_END - BEAM;
  const dx = skew(dy);
  return `${x},${BEAM} ${x + SLAT_W},${BEAM} ${x + SLAT_W + dx},${SLAT_END} ${x + dx},${SLAT_END}`;
}

const RAKE = `0,${BEAM} ${RAKE_W},${BEAM} ${RAKE_W + DEPTH_X},${STEM_TOP} ${DEPTH_X},${STEM_TOP}`;

/** Hampe du P et sa panse, en un seul tracé : le contrepoinçon est un vide. */
const P_LETTER =
  `M${P_X} ${STEM_TOP}H${P_X + STEM}V${BOWL_CY - BOWL_R}H${BOWL_CX}` +
  `A${BOWL_R} ${BOWL_R} 0 0 1 ${BOWL_CX} ${BOWL_CY + BOWL_R}` +
  `H${P_X + STEM}V${STEM_BOTTOM}H${P_X}Z` +
  `M${P_X + STEM} ${BOWL_CY - COUNTER_R}H${BOWL_CX}` +
  `A${COUNTER_R} ${COUNTER_R} 0 0 1 ${BOWL_CX} ${BOWL_CY + COUNTER_R}` +
  `H${P_X + STEM}Z`;

/**
 * Pièces de structure, dans l'ordre de tracé : la panne d'abord, les lames
 * ensuite — c'est ce qui produit le liseré sombre sous les chevrons.
 */
const STRUCTURE_PARTS = [
  ['rail', `<rect x="${DEPTH_X}" y="${DEPTH_Y}" width="${RAIL_SPAN}" height="${BEAM}"/>`],
  ['rake', `<polygon points="${RAKE}"/>`],
  ['beam', `<rect x="0" y="0" width="${SPAN}" height="${BEAM}"/>`],
  ['post-t', `<rect x="${T_X}" y="${STEM_TOP}" width="${STEM}" height="${STEM_BOTTOM - STEM_TOP}"/>`],
  ['post-p', `<path fill-rule="evenodd" d="${P_LETTER}"/>`]
];

const SLATS = Array.from({ length: SLAT_COUNT }, (_, index) => [
  `slat-${index + 1}`,
  `<polygon points="${slat(index)}"/>`
]);

/**
 * Symbole bicolore : structure anthracite, lames cuivre.
 * @param {{ structure?: string, lames?: string, parts?: boolean }} [options]
 *   `parts` expose chaque pièce dans son propre groupe `data-part`, ce dont la
 *   narration de l'accueil a besoin. Ailleurs, deux groupes suffisent.
 */
export function markColor(options = {}) {
  const structure = options.structure ?? 'var(--tp-mark-structure, #151A1C)';
  const lames = options.lames ?? 'var(--tp-mark-lames, #B86F44)';
  if (!options.parts) {
    return (
      `<g fill="${structure}">${STRUCTURE_PARTS.map(([, body]) => body).join('')}</g>` +
      `<g fill="${lames}">${SLATS.map(([, body]) => body).join('')}</g>`
    );
  }
  return (
    `<g fill="${structure}">${STRUCTURE_PARTS.map(
      ([name, body]) => `<g data-part="${name}">${body}</g>`
    ).join('')}</g>` +
    `<g fill="${lames}">${SLATS.map(([name, body]) => `<g data-part="${name}">${body}</g>`).join(
      ''
    )}</g>`
  );
}

/**
 * Symbole monochrome : une seule encre, dès que le support ne garantit pas le
 * contraste du cuivre (photo, gravure, favicon). Le dessin reste lisible parce
 * que le rythme vient des vides, pas de la couleur.
 * @param {string} [ink]
 */
export function markMono(ink = 'currentColor') {
  return `<g fill="${ink}">${STRUCTURE_PARTS.map(([, body]) => body).join('')}${SLATS.map(
    ([, body]) => body
  ).join('')}</g>`;
}

/* ==========================================================================
   MOT-SYMBOLE
   ========================================================================== */

/** Hauteur de capitale de l'alphabet dessiné. */
export const CAP_HEIGHT = 100;
/** Épaisseur relevée sur le concept : 21 pour 100 de capitale. */
export const LETTER_STROKE = 21;
/** Approche de base entre deux lettres. */
const TRACKING = 38;
/** Blanc entre deux mots, approche comprise. */
const WORD_SPACE = 108;


/**
 * Alphabet dessiné, hauteur de capitale 100, ligne de base à y = 100.
 * `w` est la chasse réelle de la lettre, relevée sur le concept.
 * Les lettres à courbes sont décrites par leur axe médian et épaissies au
 * trait; les autres sont des surfaces pleines. Dans les deux cas, la forme
 * finale a la même épaisseur apparente.
 */
const GLYPHS = {
  T: { w: 82, d: 'M0 0H82V21H51.5V100H30.5V21H0Z' },
  U: { w: 84, d: 'M0 0H21V58A21 21 0 0 0 63 58V0H84V58A42 42 0 0 1 0 58Z' },
  N: { w: 88, d: 'M0 0H21L67 69V0H88V100H67L21 31V100H0Z' },
  I: { w: 21, d: 'M0 0H21V100H0Z' },
  S: {
    w: 73,
    stroked: true,
    d:
      'M62 27C62 17 51 10.5 36.5 10.5C22 10.5 10.5 17.5 10.5 28' +
      'C10.5 38 19 43 36.5 47.5C54 52 62.5 58 62.5 69' +
      'C62.5 81 51 89.5 36.5 89.5C22 89.5 10.5 83 10.5 73'
  },
  E: { w: 71, d: 'M0 0H71V21H21V40H63V61H21V79H71V100H0Z' },
  P: { w: 82, d: 'M0 0H46A34 34 0 0 1 46 68H21V100H0ZM21 21H46A13 13 0 0 1 46 47H21Z', even: true },
  R: {
    w: 82,
    even: true,
    d: 'M0 0H45A31 31 0 0 1 45 62H57L82 100H60L35 62H21V100H0ZM21 21H45A10 10 0 0 1 45 41H21Z'
  },
  G: { w: 100, stroked: true, d: 'M79 22.6A39.5 39.5 0 1 0 89.3 54.5H51' },
  O: { w: 102, stroked: true, d: 'M10.5 50A40.5 39.5 0 1 1 91.5 50A40.5 39.5 0 1 1 10.5 50Z' },
  L: { w: 69, d: 'M0 0H21V79H69V100H0Z' },
  A: { w: 102, d: 'M37 0H65L102 100H81L51 19L21 100H0ZM35.8 60H66.2L73.6 80H28.4Z' }
};

/**
 * Corrections d'approche relevées sur le concept. Une diagonale ouverte (LA),
 * une panse suivie d'une courbe (RG, GO) ou une hampe suivie d'une hampe (TU)
 * ne laissent pas le même blanc : ces paires rétablissent l'équilibre optique.
 */
const KERNING = { TU: -4, NI: 4, RG: -8, GO: -4, LA: -10, IS: 2, IE: 2 };

/**
 * Compose un texte avec l'alphabet dessiné.
 * @param {string} text majuscules et espaces
 * @returns {{ markup: string, width: number, height: number }}
 */
export function drawText(text) {
  const solid = [];
  const stroked = [];
  let cursor = 0;
  let previous = '';

  for (const char of text) {
    if (char === ' ') {
      cursor += WORD_SPACE;
      previous = '';
      continue;
    }
    const glyph = GLYPHS[char];
    if (!glyph) {
      throw new Error(
        `brand-marks — caractère non dessiné dans l'alphabet du mot-symbole : « ${char} »`
      );
    }
    if (previous) cursor += TRACKING + (KERNING[previous + char] ?? 0);
    const rule = glyph.even ? ' fill-rule="evenodd"' : '';
    const path = `<path${rule} d="${glyph.d}" transform="translate(${round(cursor)} 0)"/>`;
    (glyph.stroked ? stroked : solid).push(path);
    cursor += glyph.w;
    previous = char;
  }

  const groups = [];
  if (solid.length > 0) groups.push(`<g fill="currentColor">${solid.join('')}</g>`);
  if (stroked.length > 0) {
    groups.push(
      `<g fill="none" stroke="currentColor" stroke-width="${LETTER_STROKE}" ` +
        `stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="2">${stroked.join('')}</g>`
    );
  }

  return { markup: groups.join(''), width: Math.round(cursor), height: CAP_HEIGHT };
}

function round(value) {
  return Math.round(value * 100) / 100;
}

export const WORDMARK_TEXT = 'TUNISIE PERGOLA';
