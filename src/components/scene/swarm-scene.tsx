'use client'

import * as React from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import {
  FORMATION,
  buildFormations,
  buildRandoms,
  type FormationIndex,
} from '@/components/scene/formations'
import { anchorsFor, type SceneAnchor, type SceneState } from '@/components/scene/scene-anchors'
import { swarmStore } from '@/components/scene/swarm-store'

/* ---------------------------------------------------------------------------
   Shaders. Every particle carries its position in all seven formations; the
   vertex shader picks two (uFrom → uTo), mixes them with a per-particle delay
   so the swarm peels away like a school of fish, swirls them through noise
   mid-flight, then applies the pointer (part / gravity well / shockwave) in
   screen space.
   --------------------------------------------------------------------------- */

// 3D simplex noise — Ian McEwan, Ashima Arts (MIT).
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uFrom;
uniform float uTo;
uniform float uMix;
uniform float uIntro;
uniform float uVelocity;
uniform vec2 uMouse;
uniform float uMouseActive;
uniform float uHold;
uniform vec4 uBurst;
uniform float uAspect;
uniform float uTanHalf;
uniform float uPixelRatio;
uniform float uSize;
uniform float uOpacity;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;

attribute vec3 aF1;
attribute vec3 aF2;
attribute vec3 aF3;
attribute vec3 aF4;
attribute vec3 aF5;
attribute vec3 aF6;
attribute vec4 aRand;

varying vec3 vColor;
varying float vAlpha;

${NOISE}

vec2 rot2(vec2 v, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
}

// Each formation's resting position plus its own idle life, and how much
// that life lights the particle up ("glow").
vec3 shape(float k, out float glow) {
  glow = 0.0;
  vec3 p;
  if (k < 0.5) {
    // core: spinning shell that breathes with noise
    p = position;
    float shell = 1.0 - step(1.8, length(position));
    p.xz = rot2(p.xz, uTime * (0.1 + shell * 0.07));
    float n = snoise(p * 0.85 + vec3(0.0, uTime * 0.22, 0.0));
    p += normalize(p + 1e-4) * n * 0.14 * shell;
    // Atmosphere: particles on the silhouette burn brighter.
    vec3 nv = normalize(normalMatrix * normalize(p + 1e-4));
    float rim = pow(1.0 - abs(nv.z), 3.0);
    glow = shell * (smoothstep(0.2, 0.9, n) * 0.7 + rim * 0.9);
  } else if (k < 1.5) {
    // ocean: rolling swell, crests light up
    p = aF1;
    float w = sin(p.x * 0.55 + uTime * 0.8) * 0.38
            + sin(p.z * 0.75 - uTime * 0.65) * 0.3
            + sin((p.x * 0.8 + p.z) * 1.35 + uTime * 1.3) * 0.09;
    p.y += w;
    glow = smoothstep(0.35, 0.72, w) * 0.85;
  } else if (k < 2.5) {
    // phone: a scan line sweeps the screen
    p = aF2;
    float scan = mod(uTime * 0.85, 5.2) - 2.6;
    glow = smoothstep(0.22, 0.0, abs(p.y - scan)) * step(0.0, p.z) * 0.9;
  } else if (k < 3.5) {
    // lattice: pulses travel along the edges
    p = aF3;
    p.xz = rot2(p.xz, uTime * 0.12);
    glow = smoothstep(0.82, 1.0, sin((aF3.x - aF3.y + aF3.z) * 1.7 - uTime * 2.4));
  } else if (k < 4.5) {
    // helix: turns, with light climbing the strands
    p = aF4;
    p.xz = rot2(p.xz, uTime * 0.4);
    glow = smoothstep(0.86, 1.0, sin(aF4.y * 1.3 - uTime * 2.0)) * 0.8;
  } else if (k < 5.5) {
    // portal: inner vortex spins faster than the rim
    p = aF5;
    float r = length(p.xy);
    p.xy = rot2(p.xy, uTime * (0.1 + 0.55 * (1.0 - smoothstep(0.0, 2.3, r))));
    glow = smoothstep(1.95, 2.25, r) * 0.45 + (1.0 - smoothstep(0.0, 0.6, r)) * 0.5;
  } else {
    // galaxy: differential rotation
    p = aF6;
    float r = length(p.xz);
    p.xz = rot2(p.xz, uTime * (0.04 + 0.28 / (0.7 + r)));
    glow = (1.0 - smoothstep(0.0, 0.9, r)) * 0.7;
  }
  return p;
}

void main() {
  float glowA;
  float glowB;
  vec3 a = shape(uFrom, glowA);
  vec3 b = a;
  glowB = glowA;
  if (abs(uTo - uFrom) > 0.5) b = shape(uTo, glowB);

  // Staggered departure: each particle leaves on its own beat.
  float m = clamp((uMix - aRand.y * 0.45) / 0.55, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  vec3 p = mix(a, b, m);
  float flight = sin(m * 3.14159265);
  if (flight > 0.002) {
    vec3 q = p * 0.32 + vec3(aRand.z * 5.0, uTime * 0.18, aRand.x * 5.0);
    p += vec3(snoise(q), snoise(q + 19.1), snoise(q + 47.3)) * flight * 1.5;
  }

  // Shimmer, so nothing is ever perfectly still.
  p += vec3(
    sin(uTime * (0.5 + aRand.z) + aRand.y * 40.0),
    cos(uTime * (0.45 + aRand.x) + aRand.z * 30.0),
    sin(uTime * (0.4 + aRand.y) + aRand.x * 20.0)
  ) * 0.02;

  // Intro: the swarm condenses out of a wide cloud.
  float ii = clamp((uIntro - aRand.y * 0.4) / 0.6, 0.0, 1.0);
  ii = 1.0 - pow(1.0 - ii, 3.0);
  vec3 scatter = normalize(position + vec3(1e-4)) * (6.0 + aRand.x * 12.0) + vec3(0.0, 0.0, -5.0);
  p = mix(scatter, p, ii);

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float depth = max(0.1, -mv.z);

  // Fast scrolling stretches the school as it races to keep up.
  mv.y += uVelocity * (aRand.z - 0.5) * 1.3;

  // Pointer work happens in aspect-corrected screen space.
  float unit = depth * uTanHalf;
  vec2 ndc = vec2(mv.x / (unit * uAspect), mv.y / unit);
  vec2 cur = vec2(ndc.x * uAspect, ndc.y);
  vec2 mouse = vec2(uMouse.x * uAspect, uMouse.y);
  vec2 da = cur - mouse;
  float dist = length(da);
  vec2 away = da / max(dist, 1e-4);

  // Hover: the swarm parts around the cursor.
  float part = smoothstep(0.34, 0.0, dist) * uMouseActive * (1.0 - uHold);
  mv.xy += away * part * 0.3 * unit;

  // Hold: a gravity well — pulled in, orbiting the cursor.
  float well = smoothstep(1.15, 0.0, dist) * uHold;
  vec2 orbit = rot2(away, 1.35 + aRand.x * 0.9) * (0.035 + aRand.z * 0.13);
  mv.xy += (mouse + orbit - cur) * well * (0.5 + aRand.y * 0.5) * unit;

  // Click: a shockwave ring.
  float age = uTime - uBurst.z;
  float wave = 0.0;
  if (age >= 0.0 && age < 2.6) {
    vec2 bd = cur - vec2(uBurst.x * uAspect, uBurst.y);
    float bdist = length(bd);
    wave = exp(-pow((bdist - age * 1.3) * 4.5, 2.0)) * exp(-age * 1.5) * uBurst.w;
    mv.xy += (bd / max(bdist, 1e-4)) * wave * 0.5 * unit;
    mv.z += wave * (aRand.x - 0.5) * 2.0;
  }

  gl_Position = projectionMatrix * mv;

  float glow = mix(glowA, glowB, m);
  float energy = glow + flight * 0.45 + part * 1.4 + well * 0.9 + wave * 2.2 + abs(uVelocity) * 0.12;
  float size = uSize * (0.35 + aRand.x * aRand.x * 1.6) * (10.0 / depth) * (1.0 + energy * 0.5);
  gl_PointSize = clamp(size * uPixelRatio, 0.0, 28.0 * uPixelRatio);

  vec3 col = mix(uColorA, uColorB, smoothstep(0.15, 0.95, aRand.w));
  col = mix(col, uColorC, clamp(energy * 0.6 + step(0.972, aRand.w) * 0.7, 0.0, 1.0));
  vColor = col;
  float fade = smoothstep(30.0, 10.0, depth) * smoothstep(0.8, 3.0, depth);
  vAlpha = uOpacity * fade * clamp(0.7 + energy * 0.5, 0.0, 1.0) * mix(0.15, 1.0, ii);
}
`

const FRAGMENT = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  // Hot centre plus a soft halo: reads as bloom without a post pass.
  float a = pow(1.0 - d * 2.0, 2.4) + exp(-d * 9.0) * 0.28;
  gl_FragColor = vec4(vColor, a * vAlpha);
  #include <colorspace_fragment>
}
`

const HALO_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const HALO_FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
varying vec2 vUv;
void main() {
  float d = length(vUv - 0.5) * 2.0;
  float a = pow(max(0.0, 1.0 - d), 2.6) * uOpacity;
  gl_FragColor = vec4(uColor, a);
  #include <colorspace_fragment>
}
`

/** How strongly each formation glows from within (the halo behind it). */
const HALO: Record<FormationIndex, number> = {
  [FORMATION.core]: 0.5,
  [FORMATION.ocean]: 0,
  [FORMATION.phone]: 0.22,
  [FORMATION.lattice]: 0.2,
  [FORMATION.helix]: 0.16,
  [FORMATION.portal]: 0.55,
  [FORMATION.galaxy]: 0.42,
}

/* ---------------------------------------------------------------------------
   Palettes. Hex approximations of the theme tokens (globals.css): dark is
   volt green → electric arc with a white-hot highlight, drawn additively;
   light is the same hues in ink, drawn normally.
   --------------------------------------------------------------------------- */
const PALETTE = {
  dark: { a: '#2ff4ac', b: '#3ac7ff', c: '#f2fffa', alpha: 1, blending: THREE.AdditiveBlending },
  light: { a: '#00805a', b: '#1f6fd1', c: '#0b2a22', alpha: 0.62, blending: THREE.NormalBlending },
} as const

/* ---------------------------------------------------------------------------
   Hero variants: the visitor can morph the hero swarm. Each shape gets its own
   best-looking pose; position comes from the hero anchor.
   --------------------------------------------------------------------------- */
const HERO_POSE: Partial<Record<FormationIndex, Partial<SceneState>>> = {
  [FORMATION.core]: {},
  [FORMATION.phone]: { rx: 0.1, ry: -0.45, rz: 0.08, s: 0.92 },
  [FORMATION.galaxy]: { rx: 1.05, rz: 0.3, s: 0.78 },
  [FORMATION.portal]: { rx: 0, ry: -0.35, rz: 0, s: 0.92 },
  [FORMATION.helix]: { rx: 0.1, rz: -0.3, s: 0.8 },
}

interface Key {
  at: number
  id: string
  state: SceneState
}

const lerp = THREE.MathUtils.lerp
const damp = THREE.MathUtils.damp
const smooth = (t: number) => t * t * (3 - 2 * t)

function mixState(a: SceneState, b: SceneState, t: number, out: SceneState): SceneState {
  out.x = lerp(a.x, b.x, t)
  out.y = lerp(a.y, b.y, t)
  out.z = lerp(a.z, b.z, t)
  out.rx = lerp(a.rx, b.rx, t)
  out.ry = lerp(a.ry, b.ry, t)
  out.rz = lerp(a.rz, b.rz, t)
  out.s = lerp(a.s, b.s, t)
  out.alpha = lerp(a.alpha, b.alpha, t)
  return out
}

/**
 * Scroll positions where each state is fully formed: the start and end of a
 * section's hold (home), or a single point a fraction down the page (inner
 * pages — so they morph continuously as you scroll).
 */
function measureKeys(mobile: boolean, anchors: readonly SceneAnchor[]): Key[] {
  const vh = window.innerHeight
  const sy = window.scrollY
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh)
  const keys: Key[] = []
  for (const anchor of anchors) {
    if (anchor.at !== undefined) {
      // Too short to scroll through several shapes: keep the first.
      if (anchor.at > 0 && maxScroll < vh * 0.3) continue
      keys.push({ at: anchor.at * maxScroll, id: anchor.id, state: mobile ? anchor.mobile : anchor.desktop })
      continue
    }
    const el = document.getElementById(anchor.id)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    const top = rect.top + sy
    const bottom = top + rect.height
    let start = top - vh * 0.3
    let end = bottom - vh * 0.9
    if (end < start) start = end = (start + end) / 2
    const base = mobile ? anchor.mobile : anchor.desktop
    const spun: SceneState = {
      ...base,
      ...(mobile ? null : anchor.travel),
      rx: base.rx + (anchor.spin?.rx ?? 0),
      ry: base.ry + (anchor.spin?.ry ?? 0),
      rz: base.rz + (anchor.spin?.rz ?? 0),
    }
    keys.push({ at: start, id: anchor.id, state: base }, { at: end, id: anchor.id, state: spun })
  }
  return keys.sort((p, q) => p.at - q.at)
}

/** Controls own their clicks: the swarm never reacts to them. */
function isControl(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return true
  return Boolean(
    target.closest(
      'a, button, input, textarea, select, label, summary, [role="button"], [role="dialog"], [data-swarm-ignore]'
    )
  )
}

/** Text still bursts on a click, but a drag there is text selection, not a spin. */
function isText(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest('p, h1, h2, h3, h4, li, dd, dt, figure'))
}

interface PointerState {
  ndc: THREE.Vector2
  active: number
  down: boolean
  /** pending → (hold | drag) on open space; tap on text, cancelled by any movement. */
  mode: 'none' | 'tap' | 'pending' | 'hold' | 'drag'
  type: string
  downAt: number
  downX: number
  downY: number
  lastX: number
  lastMove: number
}

function Swarm({
  count,
  light,
  pathname,
  onReady,
}: {
  count: number
  light: boolean
  pathname: string
  onReady?: () => void
}): React.ReactElement {
  const outer = React.useRef<THREE.Group>(null)
  const inner = React.useRef<THREE.Group>(null)

  const geometry = React.useMemo(() => {
    const g = new THREE.BufferGeometry()
    const formations = buildFormations(count)
    g.setAttribute('position', new THREE.BufferAttribute(formations[0], 3))
    for (let k = 1; k < formations.length; k++) {
      g.setAttribute(`aF${k}`, new THREE.BufferAttribute(formations[k], 3))
    }
    g.setAttribute('aRand', new THREE.BufferAttribute(buildRandoms(count), 4))
    return g
  }, [count])

  const material = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uFrom: { value: 0 },
          uTo: { value: 0 },
          uMix: { value: 0 },
          uIntro: { value: 0 },
          uVelocity: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uMouseActive: { value: 0 },
          uHold: { value: 0 },
          uBurst: { value: new THREE.Vector4(0, 0, -100, 0) },
          uAspect: { value: 1 },
          uTanHalf: { value: Math.tan(THREE.MathUtils.degToRad(35 / 2)) },
          uPixelRatio: { value: 1 },
          uSize: { value: 2.6 },
          uOpacity: { value: 1 },
          uColorA: { value: new THREE.Color() },
          uColorB: { value: new THREE.Color() },
          uColorC: { value: new THREE.Color() },
        },
      }),
    []
  )

  const halo = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: HALO_VERTEX,
        fragmentShader: HALO_FRAGMENT,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uColor: { value: new THREE.Color('#1fd99a') }, uOpacity: { value: 0 } },
      }),
    []
  )

  React.useEffect(() => () => geometry.dispose(), [geometry])
  React.useEffect(() => () => material.dispose(), [material])
  React.useEffect(() => () => halo.dispose(), [halo])

  React.useEffect(() => {
    const p = light ? PALETTE.light : PALETTE.dark
    material.uniforms.uColorA.value.set(p.a)
    material.uniforms.uColorB.value.set(p.b)
    material.uniforms.uColorC.value.set(p.c)
    material.blending = p.blending
    material.needsUpdate = true
  }, [light, material])

  // --- scroll keys (re-measured per route) ----------------------------------
  const keys = React.useRef<Key[]>([])
  const mobileRef = React.useRef(false)
  const routeChanged = React.useRef(false)
  const firstRoute = React.useRef(true)
  React.useEffect(() => {
    const anchors = anchorsFor(pathname)
    if (!firstRoute.current) routeChanged.current = true
    firstRoute.current = false
    let raf = 0
    const measure = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        mobileRef.current = window.innerWidth < 768
        keys.current = measureKeys(mobileRef.current, anchors)
      })
    }
    measure()
    // The incoming page is still streaming in and settling its layout.
    const late = [300, 1200].map((ms) => window.setTimeout(measure, ms))
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      late.forEach((id) => window.clearTimeout(id))
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pathname])

  // --- pointer -----------------------------------------------------------
  const pointer = React.useRef<PointerState>({
    ndc: new THREE.Vector2(0, 0),
    active: 0,
    down: false,
    mode: 'none',
    type: 'mouse',
    downAt: 0,
    downX: 0,
    downY: 0,
    lastX: 0,
    lastMove: -10,
  })
  const spin = React.useRef({ angle: 0, vel: 0 })
  const burstQueue = React.useRef<{ x: number; y: number; strength: number } | null>(null)

  React.useEffect(() => {
    const ptr = pointer.current
    const toNdc = (e: PointerEvent) => {
      ptr.ndc.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1)
      )
    }
    const onMove = (e: PointerEvent) => {
      ptr.type = e.pointerType
      toNdc(e)
      ptr.lastMove = performance.now()
      if (e.pointerType === 'mouse') ptr.active = 1
      if (ptr.down && e.pointerType === 'mouse') {
        const moved = Math.hypot(e.clientX - ptr.downX, e.clientY - ptr.downY)
        if (ptr.mode === 'tap' && moved > 6) ptr.mode = 'none'
        if (ptr.mode === 'pending' && moved > 6) ptr.mode = 'drag'
        if (ptr.mode === 'drag') {
          spin.current.vel = (e.clientX - ptr.lastX) * 0.006
          spin.current.angle += spin.current.vel
          window.getSelection()?.removeAllRanges()
        }
      }
      ptr.lastX = e.clientX
    }
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0 || isControl(e.target)) return
      ptr.type = e.pointerType
      toNdc(e)
      ptr.down = true
      ptr.mode = isText(e.target) ? 'tap' : 'pending'
      ptr.downAt = performance.now()
      ptr.downX = ptr.lastX = e.clientX
      ptr.downY = e.clientY
      if (e.pointerType !== 'mouse') ptr.active = 1
    }
    const onUp = (e: PointerEvent) => {
      if (!ptr.down) return
      const held = ptr.mode === 'hold'
      const tap =
        (ptr.mode === 'pending' || ptr.mode === 'tap') &&
        Math.hypot(e.clientX - ptr.downX, e.clientY - ptr.downY) < 12 &&
        (e.pointerType === 'mouse' || performance.now() - ptr.downAt < 350)
      if (held || tap) burstQueue.current = { x: ptr.ndc.x, y: ptr.ndc.y, strength: held ? 1.7 : 1 }
      ptr.down = false
      ptr.mode = 'none'
      if (e.pointerType !== 'mouse') ptr.active = 0
    }
    const onCancel = () => {
      ptr.down = false
      ptr.mode = 'none'
      if (ptr.type !== 'mouse') ptr.active = 0
    }
    const onLeave = () => {
      ptr.active = 0
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    window.addEventListener('pointercancel', onCancel, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  // --- per-frame simulation -------------------------------------------------
  const sim = React.useRef({
    y: -1,
    lastY: 0,
    vel: 0,
    intro: 0,
    hold: 0,
    active: 0,
    tiltX: 0,
    tiltY: 0,
    ready: false,
    hero: {
      current: FORMATION.core as FormationIndex,
      prev: FORMATION.core as FormationIndex,
      start: -10,
    },
    /** The shape on screen last frame — where a page change flies from. */
    shown: FORMATION.core as FormationIndex,
    route: {
      start: -10,
      f: FORMATION.core as FormationIndex,
      state: { f: FORMATION.core, x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1, alpha: 1 } as SceneState,
    },
    state: {
      f: FORMATION.core,
      x: 0,
      y: 0,
      z: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      s: 1,
      alpha: 1,
    } as SceneState,
    heroA: {
      f: FORMATION.core,
      x: 0,
      y: 0,
      z: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      s: 1,
      alpha: 1,
    } as SceneState,
    heroB: {
      f: FORMATION.core,
      x: 0,
      y: 0,
      z: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      s: 1,
      alpha: 1,
    } as SceneState,
  })

  useFrame((state, delta) => {
    const s = sim.current
    const ptr = pointer.current
    const u = material.uniforms
    const dt = Math.min(delta, 1 / 20)
    const time = state.clock.elapsedTime
    const vh = window.innerHeight
    const scrollY = window.scrollY

    // New page: fly from wherever the swarm is now into the new page's shape,
    // on a clock rather than on scroll (the incoming page starts at the top).
    if (routeChanged.current) {
      routeChanged.current = false
      s.route.start = time
      s.route.f = s.shown
      Object.assign(s.route.state, s.state)
      s.y = -1
    }

    // Scroll, with a little lag so the swarm "follows" rather than snaps.
    if (s.y < 0) s.y = s.lastY = scrollY
    s.y = damp(s.y, scrollY, 6, dt)
    const rawVel = (s.y - s.lastY) / Math.max(dt, 1e-3) / vh
    s.lastY = s.y
    s.vel = damp(s.vel, THREE.MathUtils.clamp(rawVel, -2.2, 2.2), 5, dt)

    // Hero shape the visitor picked.
    const wantHero = swarmStore.getHeroShape()
    if (wantHero !== s.hero.current) {
      const settled = time - s.hero.start > 0.9
      s.hero.prev = settled ? s.hero.current : s.hero.prev
      s.hero.current = wantHero
      s.hero.start = time
    }
    const heroMix = THREE.MathUtils.clamp((time - s.hero.start) / 1.9, 0, 1)

    // Resolve which two section states we sit between.
    const k = keys.current
    let from: FormationIndex = FORMATION.core
    let to: FormationIndex = FORMATION.core
    let mix = 0
    if (k.length) {
      let i = 0
      while (i < k.length - 1 && s.y >= k[i + 1].at) i++
      const a = k[i]
      const b = k[Math.min(i + 1, k.length - 1)]
      const span = b.at - a.at
      const t = s.y <= a.at ? 0 : span > 0 ? THREE.MathUtils.clamp((s.y - a.at) / span, 0, 1) : 1

      const pose = (key: Key, out: SceneState): SceneState => {
        if (key.id !== 'top') return key.state
        const pa = { ...key.state, ...HERO_POSE[s.hero.prev] }
        const pb = { ...key.state, ...HERO_POSE[s.hero.current] }
        return mixState(pa, pb, smooth(heroMix), out)
      }
      const sa = pose(a, s.heroA)
      const sb = pose(b, s.heroB)
      const fa = a.id === 'top' ? s.hero.current : a.state.f
      const fb = b.id === 'top' ? s.hero.current : b.state.f

      if (a.id === 'top' && b.id === 'top') {
        from = s.hero.prev
        to = s.hero.current
        mix = heroMix
        mixState(sa, sb, t, s.state)
      } else if (fa === fb) {
        from = to = fa
        mixState(sa, sb, t, s.state)
      } else {
        from = fa
        to = fb
        mix = t
        mixState(sa, sb, smooth(t), s.state)
      }
    }

    const routeMix = THREE.MathUtils.clamp((time - s.route.start) / 1.8, 0, 1)
    if (routeMix < 1) {
      to = mix < 0.5 ? from : to
      from = s.route.f
      mix = routeMix
      mixState(s.route.state, s.state, smooth(routeMix), s.state)
    }
    s.shown = mix < 0.5 ? from : to

    // Pointer.
    if (ptr.mode === 'pending' && ptr.type === 'mouse' && performance.now() - ptr.downAt > 170)
      ptr.mode = 'hold'
    if (ptr.type === 'mouse' && performance.now() - ptr.lastMove > 2600) ptr.active = 0
    s.hold = damp(s.hold, ptr.mode === 'hold' ? 1 : 0, ptr.mode === 'hold' ? 2.2 : 5, dt)
    s.active = damp(s.active, ptr.active, 4, dt)
    u.uMouse.value.x = damp(u.uMouse.value.x, ptr.ndc.x, 9, dt)
    u.uMouse.value.y = damp(u.uMouse.value.y, ptr.ndc.y, 9, dt)
    const burst = burstQueue.current
    if (burst) {
      u.uBurst.value.set(burst.x, burst.y, time, burst.strength)
      burstQueue.current = null
    }

    // Drag spin with inertia.
    if (ptr.mode !== 'drag') {
      spin.current.vel *= Math.pow(0.03, dt)
      spin.current.angle += spin.current.vel
    }

    // The whole swarm leans toward the cursor.
    const look = ptr.type === 'mouse' ? 1 : 0.35
    s.tiltX = damp(s.tiltX, -u.uMouse.value.y * 0.18 * look, 3, dt)
    s.tiltY = damp(s.tiltY, u.uMouse.value.x * 0.28 * look, 3, dt)

    s.intro = Math.min(1, s.intro + dt / 2.8)

    const st = s.state
    if (outer.current && inner.current) {
      outer.current.position.set(st.x, st.y + Math.sin(time * 0.6) * 0.06, st.z)
      outer.current.scale.setScalar(st.s)
      inner.current.rotation.set(st.rx + s.tiltX, st.ry + s.tiltY + spin.current.angle, st.rz)
    }

    const p = light ? PALETTE.light : PALETTE.dark
    u.uTime.value = time
    u.uFrom.value = from
    u.uTo.value = to
    u.uMix.value = mix
    u.uIntro.value = s.intro
    u.uVelocity.value = s.vel
    u.uMouseActive.value = s.active
    u.uHold.value = s.hold
    u.uAspect.value = state.size.width / Math.max(1, state.size.height)
    u.uPixelRatio.value = state.viewport.dpr
    u.uSize.value =
      (mobileRef.current ? 3.4 : 3.1) * THREE.MathUtils.clamp(state.size.height / 900, 0.75, 1.5)
    u.uOpacity.value = st.alpha * p.alpha
    halo.uniforms.uOpacity.value = light
      ? 0
      : lerp(HALO[from], HALO[to], smooth(mix)) * st.alpha * s.intro * (1 + s.hold * 0.6)

    if (!s.ready) {
      s.ready = true
      onReady?.()
    }
  })

  return (
    <group ref={outer}>
      <mesh material={halo} position={[0, 0, -1]} scale={8.5} frustumCulled={false}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <group ref={inner}>
        <points geometry={geometry} material={material} frustumCulled={false} />
      </group>
    </group>
  )
}

export default function SwarmScene({
  count,
  maxDpr,
  light,
  pathname,
  onReady,
}: {
  count: number
  maxDpr: number
  light: boolean
  pathname: string
  onReady?: () => void
}): React.ReactElement {
  return (
    <Canvas
      dpr={[1, maxDpr]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: false,
      }}
      camera={{ position: [0, 0, 10], fov: 35, near: 0.1, far: 80 }}
      style={{ pointerEvents: 'none' }}
    >
      <Swarm count={count} light={light} pathname={pathname} onReady={onReady} />
    </Canvas>
  )
}
