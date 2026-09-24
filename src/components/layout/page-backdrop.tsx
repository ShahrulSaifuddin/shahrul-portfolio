/**
 * The decorative top-of-page field for inner routes: engineering grid, a
 * soft brand glow, and grain — the same materials as the home hero, quieter.
 * Place it as the first child of a `relative isolate` wrapper.
 */
export function PageBackdrop(): React.ReactElement {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[44rem] overflow-hidden">
      <div className="bg-grid bg-grid-fade absolute inset-0" />
      <div className="absolute -top-56 left-1/2 h-[40rem] w-[70rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      <div className="grain absolute inset-0" />
    </div>
  )
}
