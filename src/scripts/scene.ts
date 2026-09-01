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
 *   1. AMORTISSEMENT — la valeur écrite ne saute pas sur la mesure, elle la
 *      rejoint. Chaque image l'en rapproche d'une fraction constante du chemin
 *      restant, calculée sur le temps réellement écoulé : la course dure le
 *      même temps à 60 comme à 144 images par seconde. C'est l'équivalent du
 *      `scrub` amorti de ScrollTrigger, en une ligne.
 *
 *   2. CRÉNEAUX — `data-scene-slots="N"` découpe la course en N positions
 *      d'arrêt. Dans chaque intervalle la valeur reste tenue un moment, puis
 *      rejoint la suivante par une courbe en S. Une scène à créneaux passe donc
 *      l'essentiel de son temps POSÉE sur un état lisible. L'index du créneau
 *      atteint est publié dans `data-slot`.
 *
 * LA GÉOMÉTRIE EST MESURÉE, PUIS MÉMORISÉE (1er septembre 2026)
 * La version précédente appelait `getBoundingClientRect()` sur chaque scène du
 * champ, à chaque image de défilement. C'est une LECTURE de disposition : le
 * navigateur doit garantir qu'elle est à jour, donc il termine tout calcul de
 * style ou de disposition en attente avant de répondre. Sur un téléphone, avec
 * quatre scènes proches et une galerie chargée, ces lectures s'additionnent
 * dans la tâche de défilement elle-même — exactement le profil de saccade
 * signalé par le client.
 *
 * Le moteur mesure désormais la géométrie de chaque scène UNE FOIS — sa
 * position dans le document et sa hauteur — puis calcule la progression à
 * partir de `window.scrollY`, qui ne coûte rien. Plus une seule lecture de
 * disposition pendant le défilement.
 *
 * La mesure est refaite quand elle peut avoir bougé, et jamais pendant le
 * défilement : à l'arrivée d'une scène dans le champ, au chargement complet
 * de la page, et via un `ResizeObserver` — donc aussi quand une image en
 * chargement différé prend enfin sa place et décale ce qui la suit.
 *
 * BARRES DU NAVIGATEUR MOBILE
 * Faire défiler un téléphone masque puis réaffiche la barre d'adresse, ce qui
 * déclenche un `resize` en rafale. La version précédente y répondait en
 * réamorçant toutes les scènes, c'est-à-dire en les faisant SAUTER à leur
 * mesure. On distingue maintenant deux choses : la géométrie est toujours
 * remesurée, mais le réamorçage — celui qui saute — n'a lieu que si la LARGEUR
 * a changé, c'est-à-dire lors d'une vraie recomposition.
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
  /** Position du haut de la scène dans le document, en pixels. */
  top: number;
  /** Hauteur de la scène, en pixels. */
  height: number;
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

/**
 * Progression d'une scène, calculée sans lire la disposition.
 * `offset` est la distance du haut de la scène au haut du cadre — c'est
 * exactement ce que `getBoundingClientRect().top` renvoyait, mais déduit de la
 * géométrie mémorisée et du défilement courant.
 */
function progress(scene: Scene, scrollY: number, view: number): number {
  const offset = scene.top - scrollY;
  const through = clamp((view - offset) / (view + scene.height));
  if (scene.mode === 'pin') {
    const travel = scene.height - view;
    // Une scène « pin » n'est tenue que tant qu'elle est plus haute que la
    // fenêtre. Le CSS la dépingle sur écran étroit et sous réduction de
    // mouvement; elle retombe alors sur la progression de traversée, qui reste
    // continue. Sans ce repli, la même scène recevrait un tout-ou-rien et ses
    // compositions sauteraient d'un état à l'autre.
    return travel > 0 ? clamp(-offset / travel) : through;
  }
  if (scene.mode === 'through') return through;
  return clamp((view - offset) / (view * 0.8));
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
      top: 0,
      height: 0,
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
  let width = window.innerWidth;

  /**
   * Relève la géométrie d'une scène. C'est la SEULE lecture de disposition du
   * moteur, et elle n'a jamais lieu pendant le défilement.
   */
  function measure(scene: Scene): void {
    const rect = scene.el.getBoundingClientRect();
    scene.top = rect.top + window.scrollY;
    scene.height = rect.height;
  }

  function measureAll(): void {
    for (const scene of scenes) measure(scene);
  }

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
    const scrollY = window.scrollY;
    const ratio = 1 - Math.exp(-delta / TAU);
    let moving = false;

    // 1. Calculer — aucune lecture de disposition, uniquement de l'arithmétique
    //    sur la géométrie mémorisée.
    for (const scene of scenes) {
      if (!scene.near) continue;
      const raw = progress(scene, scrollY, view);
      scene.target = scene.slots === 0 ? raw : detent(raw, scene.slots);
    }

    // 2. Amortir puis écrire.
    for (const scene of scenes) {
      if (!scene.near) continue;
      const gap = scene.target - scene.value;
      if (!scene.primed) {
        // Entrée dans le champ, ou recomposition : la scène prend sa valeur
        // d'un coup. Amortir depuis une valeur périmée rejouerait le mouvement
        // sous les yeux du lecteur.
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
        if (entry.isIntersecting) {
          // Une scène qui revient dans le champ reprend sa mesure sans amortir :
          // elle a pu se déplacer de plusieurs écrans pendant son absence. Le
          // rectangle est déjà connu de l'observateur, donc cette lecture ne
          // coûte pas de calcul de disposition supplémentaire.
          scene.top = entry.boundingClientRect.top + window.scrollY;
          scene.height = entry.boundingClientRect.height;
          scene.primed = false;
        }
      }
      schedule();
    },
    { rootMargin: '30% 0px 30% 0px', threshold: 0 }
  );
  for (const scene of scenes) watcher.observe(scene.el);

  /* Une scène qui change de hauteur — image différée enfin arrivée, panneau
     déployé, police échangée — décale tout ce qui la suit. Le `ResizeObserver`
     rattrape ces cas hors de la tâche de défilement, là où une lecture de
     disposition ne coûte rien à la fluidité. */
  if ('ResizeObserver' in window) {
    const sizes = new ResizeObserver(() => {
      measureAll();
      schedule();
    });
    for (const scene of scenes) sizes.observe(scene.el);
  }

  window.addEventListener('scroll', schedule, { passive: true });

  /* Redimensionnement. La géométrie est TOUJOURS reprise; le réamorçage — qui
     fait sauter les scènes à leur mesure — n'a lieu que si la largeur a changé.
     Sur mobile, masquer la barre d'adresse ne change que la hauteur : les
     scènes gardent alors leur amortissement au lieu de tressauter. */
  window.addEventListener(
    'resize',
    () => {
      measureAll();
      if (window.innerWidth !== width) {
        width = window.innerWidth;
        settle();
      } else {
        schedule();
      }
    },
    { passive: true }
  );

  /* Au chargement complet, les images ont pris leur place définitive : c'est le
     moment où la géométrie mémorisée doit être reprise. */
  if (document.readyState === 'complete') measureAll();
  else window.addEventListener('load', () => { measureAll(); schedule(); }, { once: true });

  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      if (frame !== 0) cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      release();
    } else {
      measureAll();
      settle();
    }
  });

  if (reduced.matches) release();
  else {
    measureAll();
    schedule();
  }
}
