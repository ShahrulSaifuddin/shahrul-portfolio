import { FORMATION, type FormationIndex } from '@/components/scene/formations'

/**
 * Where the swarm is, and what shape it holds, while each home-page section
 * is on screen. Units are world units: the camera sits at z = 10 with a 35°
 * vertical FOV, so the visible half-height at z = 0 is ~3.15 (half-width
 * ~5.6 on a 16:9 screen, ~1.45 on a portrait phone).
 *
 * The driver holds a section's state while you read it and morphs to the
 * next one as the next section's top crosses the viewport. `spin` is extra
 * rotation added across a long hold, so the shape keeps turning with scroll.
 */
export interface SceneState {
  f: FormationIndex
  x: number
  y: number
  z: number
  rx: number
  ry: number
  rz: number
  s: number
  alpha: number
}

export interface SceneAnchor {
  /**
   * Home page: the section's element id — its box defines the hold. Inner
   * pages: a free label, positioned by `at` instead.
   */
  id: string
  /** Fraction (0–1) of the page's scroll range. Overrides the element lookup. */
  at?: number
  desktop: SceneState
  mobile: SceneState
  spin?: { rx?: number; ry?: number; rz?: number }
  /** Where the hold ends up (desktop only), for shapes that travel across a long section. */
  travel?: Partial<Pick<SceneState, 'x' | 'y' | 'z' | 's'>>
}

const S = (f: FormationIndex, o: Partial<Omit<SceneState, 'f'>>): SceneState => ({
  f,
  x: 0,
  y: 0,
  z: 0,
  rx: 0,
  ry: 0,
  rz: 0,
  s: 1,
  alpha: 1,
  ...o,
})

export const SCENE_ANCHORS: readonly SceneAnchor[] = [
  {
    id: 'top',
    desktop: S(FORMATION.core, { x: 2.75, y: 0.15, rx: 0.22, rz: -0.18, s: 1.02 }),
    // Phones: crowns the name, clear of the pitch paragraph.
    mobile: S(FORMATION.core, {
      x: 0.35,
      y: 1.85,
      z: -0.5,
      rx: 0.22,
      rz: -0.18,
      s: 0.7,
      alpha: 0.9,
    }),
    spin: { ry: 0.6 },
  },
  {
    id: 'services',
    desktop: S(FORMATION.lattice, {
      x: 2.3,
      y: 0.1,
      z: -2.5,
      rx: 0.55,
      ry: 0.75,
      s: 1.1,
      alpha: 0.9,
    }),
    mobile: S(FORMATION.lattice, {
      x: 0.6,
      y: 1.5,
      z: -3,
      rx: 0.55,
      ry: 0.75,
      s: 0.78,
      alpha: 0.5,
    }),
    spin: { ry: 1.6, rx: 0.4 },
  },
  {
    id: 'projects',
    desktop: S(FORMATION.phone, {
      x: 3.4,
      y: -0.05,
      z: -1,
      rx: 0.12,
      ry: -0.55,
      rz: 0.1,
      s: 0.95,
      alpha: 0.95,
    }),
    mobile: S(FORMATION.phone, {
      x: 0.7,
      y: 0.3,
      z: -2.5,
      rx: 0.12,
      ry: -0.5,
      rz: 0.1,
      s: 0.9,
      alpha: 0.5,
    }),
    spin: { ry: 1.1 },
    // Swims right → left behind the glass panels as the track slides.
    travel: { x: -3.6 },
  },
  {
    id: 'about',
    desktop: S(FORMATION.ocean, { y: -2.15, rx: 0.3, alpha: 0.85 }),
    mobile: S(FORMATION.ocean, { y: -2.3, rx: 0.36, s: 0.8, alpha: 0.7 }),
    spin: { ry: 0.25 },
  },
  {
    id: 'process',
    desktop: S(FORMATION.ocean, { y: -2.45, rx: 0.2, ry: 0.25, s: 1.1, alpha: 0.7 }),
    mobile: S(FORMATION.ocean, { y: -2.5, rx: 0.3, ry: 0.2, s: 0.85, alpha: 0.6 }),
    spin: { ry: -0.25 },
  },
  {
    id: 'skills',
    desktop: S(FORMATION.galaxy, { y: 0.1, z: -2.5, rx: 1.08, rz: 0.22, s: 1.25, alpha: 0.7 }),
    mobile: S(FORMATION.galaxy, { y: 0.2, z: -3, rx: 1.12, rz: 0.22, s: 0.95, alpha: 0.5 }),
    spin: { ry: 0.9 },
  },
  {
    id: 'experience',
    desktop: S(FORMATION.helix, { x: -4.5, z: -1, rx: 0.08, rz: 0.12, alpha: 0.8 }),
    mobile: S(FORMATION.helix, { x: -1.4, z: -2, rx: 0.08, rz: 0.08, s: 0.85, alpha: 0.45 }),
    spin: { rz: -0.1 },
  },
  {
    id: 'education',
    desktop: S(FORMATION.helix, { x: 4.3, z: -1, rx: 0.08, rz: -0.28, s: 0.9, alpha: 0.75 }),
    mobile: S(FORMATION.helix, { x: 1.3, z: -2, rx: 0.08, rz: -0.2, s: 0.8, alpha: 0.45 }),
  },
  {
    id: 'contact',
    // Frames the round "start a project" button.
    desktop: S(FORMATION.portal, { x: 3.35, y: -0.85, s: 0.8 }),
    mobile: S(FORMATION.portal, { y: 0.9, s: 0.62, alpha: 0.9 }),
    spin: { rz: 0.5 },
  },
]

/* ---------------------------------------------------------------------------
   Inner pages: no section waypoints, just a shape at the top of the page and
   one or two more spread down it, so the swarm morphs continuously as you
   scroll. Desktop shapes sit right of the page header; phones crown it.
   --------------------------------------------------------------------------- */

type Pose = Partial<Omit<SceneState, 'f'>>

/** Top of an inner page: beside (desktop) or above (phone) the header. */
function top(f: FormationIndex, pose: Pose = {}, phone: Pose = {}): SceneAnchor {
  return {
    id: 'page-top',
    at: 0,
    desktop: S(f, { x: 3.4, y: 0.35, s: 0.85, ...pose }),
    // Phones: pushed back and half off the right edge, so it frames the
    // header instead of sitting under the copy.
    mobile: S(f, { x: 1.1, y: 1.7, z: -2.5, s: 0.62, alpha: 0.45, ...phone }),
  }
}

/** Further down an inner page: pushed back and dimmed, behind the content. */
function down(id: string, at: number, f: FormationIndex, pose: Pose = {}, phone: Pose = {}): SceneAnchor {
  return {
    id,
    at,
    desktop: S(f, { z: -2.5, alpha: 0.6, ...pose }),
    mobile: S(f, { z: -3, s: 0.8, alpha: 0.42, ...phone }),
  }
}

const GALAXY_POSE: Pose = { rx: 1.1, rz: 0.22, s: 1.25 }
const LATTICE_POSE: Pose = { rx: 0.55, ry: 0.75 }
const PHONE_POSE: Pose = { rx: 0.12, ry: -0.5, rz: 0.08 }

const PROJECTS_PAGE: readonly SceneAnchor[] = [
  top(FORMATION.phone, PHONE_POSE, PHONE_POSE),
  down('page-mid', 0.5, FORMATION.galaxy, GALAXY_POSE, { rx: 1.1, s: 0.95 }),
  down('page-end', 1, FORMATION.lattice, { ...LATTICE_POSE, x: -3.2, ry: 2.2 }, LATTICE_POSE),
]

/** Each case study gets its own pair of shapes. */
const CASE_STUDY: Record<string, readonly [FormationIndex, Pose, FormationIndex, Pose]> = {
  fastev: [FORMATION.core, { rx: 0.22, rz: -0.18 }, FORMATION.helix, { x: -4.4, rz: 0.12 }],
  'sd-engage': [FORMATION.phone, PHONE_POSE, FORMATION.portal, { x: 3.2, s: 0.85 }],
  'karuna-growth-suite': [FORMATION.lattice, LATTICE_POSE, FORMATION.galaxy, GALAXY_POSE],
  'ctapps-digital': [FORMATION.phone, PHONE_POSE, FORMATION.lattice, { ...LATTICE_POSE, x: -3.2, ry: 2 }],
}

const PERFORMANCE_PAGE: readonly SceneAnchor[] = [
  top(FORMATION.lattice, LATTICE_POSE, LATTICE_POSE),
  down('page-mid', 0.45, FORMATION.helix, { x: -4.4, z: -1, rz: 0.12, alpha: 0.7 }, { x: -1.3 }),
  down('page-end', 1, FORMATION.galaxy, GALAXY_POSE, { rx: 1.1, s: 0.95 }),
]

const CONTACT_PAGE: readonly SceneAnchor[] = [
  top(FORMATION.portal, { x: 3.6, y: 0.6, s: 0.8 }),
  down('page-end', 1, FORMATION.ocean, { y: -2.4, z: 0, rx: 0.26, alpha: 0.75 }, { y: -2.5, rx: 0.34 }),
]

const FALLBACK_PAGE: readonly SceneAnchor[] = [
  top(FORMATION.core, { rx: 0.22, rz: -0.18 }),
  down('page-end', 1, FORMATION.portal, { s: 0.9 }),
]

/** The swarm's waypoints for a route. */
export function anchorsFor(pathname: string): readonly SceneAnchor[] {
  if (pathname === '/') return SCENE_ANCHORS
  if (pathname === '/projects') return PROJECTS_PAGE
  if (pathname === '/performance') return PERFORMANCE_PAGE
  if (pathname === '/contact') return CONTACT_PAGE
  const slug = pathname.match(/^\/projects\/([^/]+)/)?.[1]
  const study = slug ? CASE_STUDY[slug] : undefined
  if (study) {
    const [a, poseA, b, poseB] = study
    return [top(a, poseA, poseA), down('page-end', 1, b, poseB)]
  }
  return FALLBACK_PAGE
}
