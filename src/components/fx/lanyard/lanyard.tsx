'use client'

import * as React from 'react'
import { Canvas, extend, useFrame, type ThreeElement, type ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer, useGLTF } from '@react-three/drei'
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'

import type { BadgeArt } from '@/components/fx/lanyard/badge-art'

extend({ MeshLineGeometry, MeshLineMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>
    // MeshLineMaterial's constructor parameter is optional at runtime; the
    // generated element type marks `args` required, so relax it here.
    meshLineMaterial: Omit<ThreeElement<typeof MeshLineMaterial>, 'args'> & {
      args?: ConstructorParameters<typeof MeshLineMaterial>
    }
  }
}

const CARD_GLB = '/3d/card.glb'

type LerpedBody = RapierRigidBody & { lerped?: THREE.Vector3 }

/**
 * Adapted from React Bits' <Lanyard /> (reactbits.dev): a physically
 * simulated ID card on a rope, draggable and throwable. Changes: textures
 * come in as painted canvases (see badge-art.ts) instead of image files, the
 * render + physics loops stop entirely while the canvas is offscreen, and it
 * reports `onReady` once the model is on screen so the static placeholder
 * can hand over without a blank frame.
 */
export default function Lanyard({
  art,
  onReady,
}: {
  art: BadgeArt
  onReady?: () => void
}): React.ReactElement {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(true)

  React.useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting))
    io.observe(el)
    const onVisibility = () => setActive(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0 touch-none select-none">
      <Canvas
        // Tighter than React Bits' default (fov 20): the card reads ~35%
        // larger and the strap enters from above the viewport edge.
        camera={{ position: [0, 0, 30], fov: 15 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        frameloop={active ? 'always' : 'never'}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), 0)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60} paused={!active}>
          <Band art={art} onReady={onReady} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="#5ff5b4" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  )
}

function Band({ art, onReady }: { art: BadgeArt; onReady?: () => void }) {
  const band = React.useRef<THREE.Mesh<InstanceType<typeof MeshLineGeometry>, InstanceType<typeof MeshLineMaterial>>>(null!)
  const fixed = React.useRef<RapierRigidBody>(null!)
  const j1 = React.useRef<LerpedBody>(null!)
  const j2 = React.useRef<LerpedBody>(null!)
  const j3 = React.useRef<RapierRigidBody>(null!)
  const card = React.useRef<RapierRigidBody>(null!)

  const vec = React.useMemo(() => new THREE.Vector3(), [])
  const ang = React.useMemo(() => new THREE.Vector3(), [])
  const rot = React.useMemo(() => new THREE.Vector3(), [])
  const dir = React.useMemo(() => new THREE.Vector3(), [])

  const segmentProps: RigidBodyProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { nodes, materials } = useGLTF(CARD_GLB) as any

  const cardMap = React.useMemo(() => {
    const t = new THREE.CanvasTexture(art.atlas)
    t.colorSpace = THREE.SRGBColorSpace
    t.flipY = false // glTF UV convention
    t.anisotropy = 16
    return t
  }, [art.atlas])

  const bandMap = React.useMemo(() => {
    const t = new THREE.CanvasTexture(art.band)
    t.colorSpace = THREE.SRGBColorSpace
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.anisotropy = 8
    return t
  }, [art.band])

  const [curve] = React.useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ])
  )
  const [dragged, drag] = React.useState<false | THREE.Vector3>(false)
  const [hovered, hover] = React.useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ])

  React.useEffect(() => {
    // Give the card a gentle shove on arrival so it swings into place.
    const id = window.setTimeout(() => {
      card.current?.applyImpulse({ x: 6, y: 0, z: -3 }, true)
      onReady?.()
    }, 60)
    return () => window.clearTimeout(id)
  }, [onReady])

  React.useEffect(() => {
    if (!hovered) return
    document.body.style.cursor = dragged ? 'grabbing' : 'grab'
    return () => {
      document.body.style.cursor = ''
    }
  }, [hovered, dragged])

  const getLerped = (body: LerpedBody) => {
    if (!body.lerped) body.lerped = new THREE.Vector3().copy(body.translation())
    return body.lerped
  }

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      })
    }
    if (fixed.current) {
      ;[j1, j2].forEach((ref) => {
        const lerped = getLerped(ref.current)
        const clamped = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())))
        lerped.lerp(ref.current.translation(), delta * (clamped * 50))
      })
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(getLerped(j2.current))
      curve.points[2].copy(getLerped(j1.current))
      curve.points[3].copy(fixed.current.translation())
      band.current.geometry.setPoints(curve.getPoints(32))
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)
    }
  })

  curve.curveType = 'chordal'

  return (
    <>
      <group position={[0, 4.4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              ;(e.target as Element).releasePointerCapture(e.pointerId)
              drag(false)
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              ;(e.target as Element).setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[1000, 1000]}
          useMap={1}
          map={bandMap}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  )
}
