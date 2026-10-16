/**
 * The shapes the swarm flies between. Every formation is `count` xyz triples,
 * and index `i` is the same particle in all of them — so morphing is a
 * per-particle mix between two arrays, done on the GPU. All generators are
 * seeded: the swarm is identical on every visit and on the server/client.
 *
 * Order inside each array is deliberately spatial (top→bottom, back→front),
 * so a morph reads as a coherent flow instead of white noise.
 */

export const FORMATION = {
  core: 0,
  ocean: 1,
  phone: 2,
  lattice: 3,
  helix: 4,
  portal: 5,
  galaxy: 6,
} as const

export type FormationIndex = (typeof FORMATION)[keyof typeof FORMATION]

/** mulberry32 — tiny, fast, good enough for scattering points. */
function seeded(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Box–Muller, for soft "thickness" around lines and surfaces. */
function gaussian(rand: () => number): number {
  const u = Math.max(1e-6, rand())
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand())
}

function write(out: Float32Array, i: number, x: number, y: number, z: number): void {
  out[i * 3] = x
  out[i * 3 + 1] = y
  out[i * 3 + 2] = z
}

/** Energy core: a fibonacci shell, a glowing interior and two tilted orbit rings. */
function core(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  const rand = seeded(11)
  const shell = Math.floor(count * 0.62)
  const inner = Math.floor(count * 0.1)
  const golden = Math.PI * (3 - Math.sqrt(5))
  const R = 1.55

  for (let i = 0; i < shell; i++) {
    const y = 1 - (2 * (i + 0.5)) / shell
    const r = Math.sqrt(1 - y * y)
    const theta = i * golden
    const k = R * (0.94 + rand() * 0.1)
    write(out, i, Math.cos(theta) * r * k, y * k, Math.sin(theta) * r * k)
  }
  for (let i = shell; i < shell + inner; i++) {
    const u = rand() * 2 - 1
    const t = rand() * Math.PI * 2
    const s = Math.sqrt(1 - u * u)
    const k = R * 0.75 * Math.cbrt(rand())
    write(out, i, Math.cos(t) * s * k, u * k, Math.sin(t) * s * k)
  }
  const rings = [
    { radius: 2.35, tiltX: 1.18, tiltZ: 0.32 },
    { radius: 2.95, tiltX: 1.42, tiltZ: -0.5 },
  ]
  for (let i = shell + inner; i < count; i++) {
    const ring = rings[i % 2]
    const a = rand() * Math.PI * 2
    const rr = ring.radius + gaussian(rand) * 0.05
    let x = Math.cos(a) * rr
    let y = gaussian(rand) * 0.025
    let z = Math.sin(a) * rr
    // tilt around X, then Z
    const cy = Math.cos(ring.tiltX)
    const sy = Math.sin(ring.tiltX)
    ;[y, z] = [y * cy - z * sy, y * sy + z * cy]
    const cz = Math.cos(ring.tiltZ)
    const sz = Math.sin(ring.tiltZ)
    ;[x, y] = [x * cz - y * sz, x * sz + y * cz]
    write(out, i, x, y, z)
  }
  return out
}

/** Ocean: a flat jittered sheet. The shader rolls waves through it. */
function ocean(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  const rand = seeded(23)
  const width = 16
  const depth = 11
  const cols = Math.round(Math.sqrt((count * width) / depth))
  const rows = Math.ceil(count / cols)
  for (let i = 0; i < count; i++) {
    const c = i % cols
    const r = Math.floor(i / cols)
    const x = (c / (cols - 1) - 0.5) * width + (rand() - 0.5) * 0.05
    const z = (r / (rows - 1)) * -depth + 2.5 + (rand() - 0.5) * 0.05
    write(out, i, x, 0, z)
  }
  return out
}

/** A smartphone: rounded body outline (front, back, sides) and a live UI on screen. */
function phone(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  const rand = seeded(37)
  const W = 1.72
  const H = 3.52
  const CR = 0.3
  const D = 0.18
  let i = 0

  // Rounded-rect perimeter sample, parametrised by arc length.
  const perimeterPoint = (t: number, inset = 0): [number, number] => {
    const hw = W / 2 - inset
    const hh = H / 2 - inset
    const cr = CR - inset
    const sw = W - 2 * CR
    const sh = H - 2 * CR
    const a = (Math.PI / 2) * cr
    let d = t * (2 * sw + 2 * sh + 4 * a)
    // top edge (left→right), top-right corner, right edge, ...
    if (d < sw) return [-sw / 2 + d, hh]
    d -= sw
    if (d < a) {
      const ang = Math.PI / 2 - d / cr
      return [sw / 2 + Math.cos(ang) * cr, sh / 2 + Math.sin(ang) * cr]
    }
    d -= a
    if (d < sh) return [hw, sh / 2 - d]
    d -= sh
    if (d < a) {
      const ang = -(d / cr)
      return [sw / 2 + Math.cos(ang) * cr, -sh / 2 + Math.sin(ang) * cr]
    }
    d -= a
    if (d < sw) return [sw / 2 - d, -hh]
    d -= sw
    if (d < a) {
      const ang = -Math.PI / 2 - d / cr
      return [-sw / 2 + Math.cos(ang) * cr, -sh / 2 + Math.sin(ang) * cr]
    }
    d -= a
    if (d < sh) return [-hw, -sh / 2 + d]
    d -= sh
    const ang = Math.PI - d / cr
    return [-sw / 2 + Math.cos(ang) * cr, sh / 2 + Math.sin(ang) * cr]
  }

  const outline = Math.floor(count * 0.36)
  for (; i < outline; i++) {
    const t = i / outline
    const [x, y] = perimeterPoint(t)
    const layer = rand()
    const z = layer < 0.42 ? D / 2 : layer < 0.84 ? -D / 2 : (rand() - 0.5) * D
    write(out, i, x, y, z)
  }

  // Screen bezel, inset from the body.
  const bezel = Math.floor(count * 0.08)
  for (let k = 0; k < bezel; k++, i++) {
    const [x, y] = perimeterPoint(k / bezel, 0.09)
    write(out, i, x * 0.985, y * 0.99, D / 2 + 0.005)
  }

  const zS = D / 2 + 0.012
  const fillRect = (n: number, x0: number, y0: number, w: number, h: number) => {
    for (let k = 0; k < n && i < count; k++, i++) {
      write(out, i, x0 + rand() * w, y0 + rand() * h, zS)
    }
  }
  const strokeRect = (n: number, x0: number, y0: number, w: number, h: number) => {
    const p = 2 * (w + h)
    for (let k = 0; k < n && i < count; k++, i++) {
      let d = (k / n) * p
      let x: number
      let y: number
      if (d < w) [x, y] = [x0 + d, y0]
      else if ((d -= w) < h) [x, y] = [x0 + w, y0 + d]
      else if ((d -= h) < w) [x, y] = [x0 + w - d, y0 + h]
      else [x, y] = [x0, y0 + h - (d - w)]
      write(out, i, x, y, zS)
    }
  }
  const fillCircle = (n: number, cx: number, cy: number, r: number) => {
    for (let k = 0; k < n && i < count; k++, i++) {
      const a = rand() * Math.PI * 2
      const rr = Math.sqrt(rand()) * r
      write(out, i, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, zS)
    }
  }

  const left = -0.66
  const n = (share: number) => Math.floor(count * share)

  fillRect(n(0.015), -0.22, 1.5, 0.44, 0.08) // dynamic island
  fillRect(n(0.03), left, 1.18, 0.95, 0.08) // title
  fillRect(n(0.018), left, 1.03, 0.6, 0.05) // subtitle
  strokeRect(n(0.06), left, 0.22, 1.32, 0.66) // hero card
  fillRect(n(0.06), left + 0.08, 0.3, 0.7, 0.18) // hero card value
  fillRect(n(0.02), left + 0.08, 0.62, 0.42, 0.06)
  for (let row = 0; row < 3; row++) {
    const y = -0.12 - row * 0.4
    fillCircle(n(0.022), left + 0.12, y, 0.11) // avatar
    fillRect(n(0.02), left + 0.32, y + 0.02, 0.8, 0.06)
    fillRect(n(0.012), left + 0.32, y - 0.09, 0.5, 0.04)
  }
  fillRect(n(0.07), left + 0.06, -1.42, 1.2, 0.2) // primary button
  fillRect(n(0.008), -0.3, -1.66, 0.6, 0.025) // home indicator

  // Whatever is left: faint glass across the screen.
  while (i < count) {
    write(out, i, (rand() - 0.5) * (W - 0.2), (rand() - 0.5) * (H - 0.2), zS - 0.004)
    i++
  }
  return out
}

/** System lattice: the edges of a 3×3×3 subdivided cube, plus bright nodes. */
function lattice(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  const rand = seeded(41)
  const S = 2.5
  const steps = [-1, -1 / 3, 1 / 3, 1].map((v) => (v * S) / 2)
  const lines: [number, number, number][] = [] // axis, a, b
  for (let axis = 0; axis < 3; axis++) {
    for (const a of steps) for (const b of steps) lines.push([axis, a, b])
  }
  const nodes = Math.floor(count * 0.14)
  for (let i = 0; i < count; i++) {
    if (i < nodes) {
      const x = steps[Math.floor(rand() * 4)]
      const y = steps[Math.floor(rand() * 4)]
      const z = steps[Math.floor(rand() * 4)]
      const g = 0.05
      write(out, i, x + gaussian(rand) * g, y + gaussian(rand) * g, z + gaussian(rand) * g)
      continue
    }
    const [axis, a, b] = lines[Math.floor(rand() * lines.length)]
    const t = (rand() - 0.5) * S
    const j = 0.012
    const p = axis === 0 ? [t, a, b] : axis === 1 ? [a, t, b] : [a, b, t]
    write(out, i, p[0] + gaussian(rand) * j, p[1] + gaussian(rand) * j, p[2] + gaussian(rand) * j)
  }
  return out
}

/** Double helix with rungs: two strands, offset by half a turn. */
function helix(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  const rand = seeded(53)
  const height = 6.8
  const turns = 3.2
  const radius = 1.05
  const strands = Math.floor(count * 0.78)
  const rungs = 34
  for (let i = 0; i < count; i++) {
    if (i < strands) {
      const t = (i >> 1) / (strands / 2)
      const phase = i % 2 === 0 ? 0 : Math.PI
      const a = t * turns * Math.PI * 2 + phase
      const r = radius + gaussian(rand) * 0.035
      write(out, i, Math.cos(a) * r, (0.5 - t) * height, Math.sin(a) * r + gaussian(rand) * 0.03)
    } else {
      const k = Math.floor(rand() * rungs)
      const t = (k + 0.5) / rungs
      const a = t * turns * Math.PI * 2
      const s = rand() * 2 - 1
      write(
        out,
        i,
        Math.cos(a) * radius * s,
        (0.5 - t) * height + gaussian(rand) * 0.012,
        Math.sin(a) * radius * s
      )
    }
  }
  return out
}

/** Portal: a bright torus with a swirling vortex disk inside it. */
function portal(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  const rand = seeded(67)
  const R = 2.25
  const ring = Math.floor(count * 0.6)
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 * 17 + rand() * 0.4
    if (i < ring) {
      const tube = rand() * Math.PI * 2
      const r = 0.16 * Math.sqrt(rand())
      const rr = R + Math.cos(tube) * r
      write(out, i, Math.cos(a) * rr, Math.sin(a) * rr, Math.sin(tube) * r)
    } else {
      // Spiral arms that thin out toward the centre.
      const t = Math.pow(rand(), 0.6)
      const rr = R * 0.96 * t
      const arm = Math.floor(rand() * 3) * ((Math.PI * 2) / 3)
      const ang = arm + t * 4.2 + gaussian(rand) * 0.22
      write(out, i, Math.cos(ang) * rr, Math.sin(ang) * rr, gaussian(rand) * 0.06)
    }
  }
  return out
}

/** Galaxy: a two-armed spiral disk around a dense bulge. */
function galaxy(count: number): Float32Array {
  const out = new Float32Array(count * 3)
  const rand = seeded(79)
  const bulge = Math.floor(count * 0.14)
  for (let i = 0; i < count; i++) {
    if (i < bulge) {
      const g = 0.38
      write(out, i, gaussian(rand) * g, gaussian(rand) * g * 0.55, gaussian(rand) * g)
      continue
    }
    const t = Math.pow(rand(), 0.75)
    const r = 0.25 + t * 3.3
    const arm = (i % 2) * Math.PI
    const a = arm + r * 1.25 + gaussian(rand) * (0.3 - t * 0.12)
    write(out, i, Math.cos(a) * r, gaussian(rand) * 0.07 * (1.2 - t), Math.sin(a) * r)
  }
  return out
}

export function buildFormations(count: number): Float32Array[] {
  return [
    core(count),
    ocean(count),
    phone(count),
    lattice(count),
    helix(count),
    portal(count),
    galaxy(count),
  ]
}

/** Per-particle randoms: size, morph delay, jitter phase, colour. */
export function buildRandoms(count: number): Float32Array {
  const out = new Float32Array(count * 4)
  const rand = seeded(97)
  for (let i = 0; i < count * 4; i++) out[i] = rand()
  return out
}
