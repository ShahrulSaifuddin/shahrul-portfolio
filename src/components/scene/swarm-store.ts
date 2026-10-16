'use client'

import * as React from 'react'

import { FORMATION, type FormationIndex } from '@/components/scene/formations'

/**
 * The one piece of state the DOM shares with the WebGL swarm: which shape the
 * visitor picked for the hero, and whether the swarm is actually running
 * (so the hero only offers its shape switcher when there is something to
 * switch). A module-level store, read from inside `useFrame` without React.
 */
type Listener = () => void

let heroShape: FormationIndex = FORMATION.core
let active = false
const listeners = new Set<Listener>()

function emit(): void {
  listeners.forEach((l) => l())
}

export const swarmStore = {
  getHeroShape: (): FormationIndex => heroShape,
  setHeroShape(next: FormationIndex): void {
    if (next === heroShape) return
    heroShape = next
    emit()
  },
  isActive: (): boolean => active,
  setActive(next: boolean): void {
    if (next === active) return
    active = next
    emit()
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}

export function useHeroShape(): FormationIndex {
  return React.useSyncExternalStore(
    swarmStore.subscribe,
    swarmStore.getHeroShape,
    () => FORMATION.core
  )
}

export function useSwarmActive(): boolean {
  return React.useSyncExternalStore(swarmStore.subscribe, swarmStore.isActive, () => false)
}
