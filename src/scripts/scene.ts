/**
 * Moteur de scènes — la position de défilement devient un nombre CSS.
 * ===================================================================
 *
 * POURQUOI PAS UNE BIBLIOTHÈQUE
 * Le contrôle de build impose 40 Ko de JavaScript pour tout le site. Une pile
 * GSAP + ScrollTrigger + Lenis en consomme dix fois plus à elle seule. Or la
 * narration voulue ne demande qu'une chose : connaître, pour quelques éléments,
 * l'avancement du défilement entre deux repères. Ce fichier fait cela, et rien
 * d'autre, en trois kilo-octets.
 *
 * CONTRAT
 * Un élément portant `data-scene` reçoit un nombre entre 0 et 1 :
 *
 *   data-scene="enter"    --tp-p  0 quand le haut touche le bas du cadre,
 *                                 1 quand il a monté de 80 % du cadre.
 *   data-scene="pin"      --tp-x  0 quand le haut atteint le haut du cadre,
 *                                 1 quand le bas atteint le bas du cadre.
 *                                 C'est la course d'une scène `sticky`.
 *   data-scene="through"  --tp-x  0 à l'entrée par le bas, 1 à la sortie par
 *                                 le haut. Sert aux parallaxes d'images.
 *
 * Les enfants héritent de la variable : une scène écrit un nombre, sa
 * composition entière s'en sert.
 *
 * LES DEUX LOIS DU MOUVEMENT
 * Ce que le défilement donne est brut : la molette avance par paliers de cent
 * pixels, et une composition branchée dessus avance par à-coups. Deux
 * transformations séparent la mesure de ce qui est écrit.
 *
 *   1. AMORTISSEMENT — la valeur écrite ne saute pas sur la mesure, elle la
 *      rejoint. Chaque image l'en rapproche d'une fraction constante du chemin
 *      restant, calculée sur le temps réellement écoulé : la course dure le
 *      même temps à 60 comme à 144 images par seconde. C'est l'équivalent du
 *      `scrub` amorti de ScrollTrigger, en une ligne. C'est cette loi, et elle
 *      seule, qui fait la différence entre « lié au défilement » et « fluide ».
 *
 *   2. CRÉNEAUX — `data-scene-slots="N"` découpe la course en N positions
 *      d'arrêt. Dans chaque intervalle la valeur reste tenue un moment, puis
 *      rejoint la suivante par une courbe en S. Une scène à créneaux passe donc
 *      l'essentiel de son temps POSÉE sur un état lisible, au lieu d'être
 *      perpétuellement à mi-chemin entre deux. L'index du créneau atteint est
 *      publié dans `data-slot` : le CSS peut marquer l'élément courant sans
 *      qu'aucune classe ne soit calculée ici.
 *
 * SÛRETÉ
 *   • Les valeurs au repos, déclarées dans `tokens.css`, sont l'état LISIBLE
 *     (`--tp-p: 1`, `--tp-x: 0`). Si ce fichier ne s'exécute jamais, la page
 *     est simplement immobile — jamais vide, jamais coupée.
 *   • `prefers-reduced-motion: reduce` arrête le moteur et remet les valeurs
 *     au repos, y compris si la préférence change en cours de session.
 *   • Une scène qui entre dans le champ prend sa valeur d'un coup au lieu de
 *     l'amortir : sans cela, un rechargement en milieu de page rejouerait
 *     l'animation depuis zéro sous les yeux du lecteur.
 *   • Toutes les mesures sont lues d'abord, toutes les écritures ensuite : la
 *     boucle ne provoque pas de recalcul de disposition en cascade.
 *   • Seules les scènes réellement proches du cadre sont calculées, et la
 *     boucle s'arrête d'elle-même dès que plus rien ne bouge.
 */

type SceneMode = 'enter' | 'pin' | 'through';

interface Scene {
  readonly el: HTMLElement;
  readonly mode: SceneMode;
  readonly prop: '--tp-p' | '--tp-x';
  readonly rest: number;
  /** Nombre de positions d'arrêt. 0 ou 1 : progression continue. */
  readonly slots: number;
  near: boolean;
  /** Ce que mesure le défilement, après passage par les créneaux. */
  target: number;
  /** Ce que l'amortissement a effectivement atteint. */
  value: number;
  /** Dernière valeur écrite dans le style — évite les écritures inutiles. */
  shown: string;
  /** Dernier index publié dans `data-slot`. -1 : aucun. */
  slot: number;
  /** Une scène non amorcée prend sa valeur d'un coup. */
  primed: boolean;
}

const MODES: Record<SceneMode, { prop: '--tp-p' | '--tp-x'; rest: number }> = {
  enter: { prop: '--tp-p', rest: 1 },
  pin: { prop: '--tp-x', rest: 0 },
  through: { prop: '--tp-x', rest: 0 }
};

/* Constante de temps de l'amortissement, en millisecondes : le temps au bout
   duquel il reste 37 % du chemin. Plus haut, la scène traîne derrière le doigt;
   plus bas, les paliers de la molette réapparaissent. */
const TAU = 118;
/* Au-delà, on considère que l'onglet était en arrière-plan : on ne rattrape pas
   deux secondes de défilement en une image. */
const MAX_FRAME = 64;
/* En deçà, l'œil ne voit plus la différence : la boucle peut s'arrêter. */
const SETTLED = 0.0009;
/* Quatre décimales suffisent : sur la plus longue course du site, la cinquième
   ne déplace plus rien d'un pixel. Écrire la valeur ARRONDIE et la comparer
   telle quelle évite d'appeler le moteur de style pour un chiffre invisible. */
const DIGITS = 4;
/* Part de chaque créneau passée à l'arrêt, répartie de part et d'autre de la
   position d'arrêt. Le reste sert à rejoindre le créneau suivant. */
const DWELL = 0.44;

const clamp = (value: number): number => (value < 0 ? 0 : value > 1 ? 1 : value);

const through = (rect: DOMRect, view: number): number =>
  clamp((view - rect.top) / (view + rect.height));

function progress(mode: SceneMode, rect: DOMRect, view: number): number {
  if (mode === 'pin') {
    const travel = rect.height - view;
    // Une scène « pin » n'est tenue que tant qu'elle est plus haute que la
    // fenêtre. Le CSS la dépingle sur écran étroit et sous réduction de
    // mouvement; elle retombe alors sur la progression de traversée, qui reste
    // continue. Sans ce repli, la même scène recevrait un tout-ou-rien et ses
    // compositions sauteraient d'un état à l'autre.
    return travel > 0 ? clamp(-rect.top / travel) : through(rect, view);
  }
  if (mode === 'through') return through(rect, view);
  return clamp((view - rect.top) / (view * 0.8));
}

/** Courbe en S : départ et arrivée à vitesse nulle, donc aucun à-coup. */
const smoothstep = (t: number): number => t * t * (3 - 2 * t);

/**
 * Découpe une progression continue en positions d'arrêt.
 * Autour de chaque arrêt la valeur ne bouge pas; entre deux, elle glisse.
 */
function detent(x: number, slots: number): number {
  const steps = slots - 1;
  if (steps < 1) return x;
  const walk = x * steps;
  const index = Math.min(Math.floor(walk), steps - 1);
  const inside = walk - index;
  return (index + smoothstep(clamp((inside - DWELL / 2) / (1 - DWELL)))) / steps;
}

export function initScenes(): void {
  const nodes = document.querySelectorAll<HTMLElement>('[data-scene]');
  if (nodes.length === 0) return;

  const scenes: Scene[] = [];
  const byNode = new Map<Element, Scene>();
  for (const el of nodes) {
    const mode = (el.dataset['scene'] ?? 'enter') as SceneMode;
    const spec = MODES[mode];
    if (!spec) continue;
    const slots = Number.parseInt(el.dataset['sceneSlots'] ?? '', 10);
    const scene: Scene = {
      el,
      mode,
      prop: spec.prop,
      rest: spec.rest,
      slots: Number.isFinite(slots) && slots > 1 ? slots : 0,
      near: false,
      target: spec.rest,
      value: spec.rest,
      shown: spec.rest.toFixed(DIGITS),
      slot: -1,
      primed: false
    };
    scenes.push(scene);
    byNode.set(el, scene);
  }
  if (scenes.length === 0) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let last = 0;

  function release(): void {
    for (const scene of scenes) {
      scene.el.style.removeProperty(scene.prop);
      delete scene.el.dataset['slot'];
      scene.value = scene.rest;
      scene.target = scene.rest;
      scene.shown = scene.rest.toFixed(DIGITS);
      scene.slot = -1;
      scene.primed = false;
    }
  }

  /** Remet chaque scène du champ sur sa mesure, sans amortir. */
  function settle(): void {
    for (const scene of scenes) scene.primed = false;
    schedule();
  }

  function tick(now: number): void {
    frame = 0;
    // Première image de la course : aucun temps ne s'est écoulé.
    const delta = last === 0 ? 0 : Math.min(now - last, MAX_FRAME);
    last = now;
    const view = window.innerHeight;
    const ratio = 1 - Math.exp(-delta / TAU);
    let moving = false;

    // 1. Lire — aucune écriture ici, donc une seule mise en page pour tout.
    for (const scene of scenes) {
      if (!scene.near) continue;
      const raw = progress(scene.mode, scene.el.getBoundingClientRect(), view);
      scene.target = scene.slots === 0 ? raw : detent(raw, scene.slots);
    }

    // 2. Amortir puis écrire — aucune lecture ici, donc aucun aller-retour
    //    avec le moteur de rendu.
    for (const scene of scenes) {
      if (!scene.near) continue;
      const gap = scene.target - scene.value;
      if (!scene.primed) {
        // Entrée dans le champ, ou changement de taille : la scène prend sa
        // valeur d'un coup. Amortir depuis une valeur périmée rejouerait le
        // mouvement sous les yeux du lecteur.
        scene.value = scene.target;
        scene.primed = true;
      } else if (Math.abs(gap) < SETTLED) {
        scene.value = scene.target;
      } else {
        scene.value += gap * ratio;
        moving = true;
      }

      const shown = scene.value.toFixed(DIGITS);
      if (shown !== scene.shown) {
        scene.shown = shown;
        scene.el.style.setProperty(scene.prop, shown);
      }

      if (scene.slots !== 0) {
        const index = Math.round(scene.value * (scene.slots - 1));
        if (index !== scene.slot) {
          scene.slot = index;
          scene.el.dataset['slot'] = String(index);
        }
      }
    }

    // La boucle se relance tant qu'une scène n'a pas rejoint sa mesure, et
    // s'arrête d'elle-même sinon : rien ne tourne sur une page immobile.
    if (moving) frame = requestAnimationFrame(tick);
    else last = 0;
  }

  function schedule(): void {
    if (frame !== 0 || reduced.matches) return;
    frame = requestAnimationFrame(tick);
  }

  const watcher = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const scene = byNode.get(entry.target);
        if (!scene) continue;
        scene.near = entry.isIntersecting;
        // Une scène qui revient dans le champ reprend sa mesure sans amortir :
        // elle a pu se déplacer de plusieurs écrans pendant son absence.
        if (entry.isIntersecting) scene.primed = false;
      }
      schedule();
    },
    { rootMargin: '30% 0px 30% 0px', threshold: 0 }
  );
  for (const scene of scenes) watcher.observe(scene.el);

  window.addEventListener('scroll', schedule, { passive: true });
  // Un changement de taille refait la géométrie : amortir vers une mesure prise
  // dans l'ancienne disposition ferait glisser toute la page.
  window.addEventListener('resize', settle, { passive: true });
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      if (frame !== 0) cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      release();
    } else {
      settle();
    }
  });

  if (reduced.matches) release();
  else schedule();
}
