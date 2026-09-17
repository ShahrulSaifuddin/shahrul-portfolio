// OKLCH -> sRGB -> WCAG 2.1 contrast ratio.
function oklchToSrgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3

  const lr = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  const enc = (x) => {
    const c = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(Math.max(x, 0), 1 / 2.4) - 0.055
    return Math.min(1, Math.max(0, c))
  }
  return [enc(lr), enc(lg), enc(lb)]
}

function relLum([r, g, b]) {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrast(fg, bg) {
  const a = relLum(oklchToSrgb(...fg)), b = relLum(oklchToSrgb(...bg))
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}

const light = {
  background: [0.995, 0, 0],
  foreground: [0.205, 0.005, 285],
  card: [1, 0, 0],
  muted: [0.968, 0.002, 285],
  mutedForeground: [0.505, 0.008, 285],
  primary: [0.58, 0.12, 168],
  primaryForeground: [0.99, 0.01, 168],
  brand: [0.52, 0.12, 168],
  brandMuted: [0.955, 0.03, 168],
  border: [0.918, 0.004, 285],
  destructive: [0.58, 0.21, 27],
}

const dark = {
  background: [0.165, 0.004, 285],
  foreground: [0.955, 0.002, 285],
  card: [0.205, 0.005, 285],
  muted: [0.245, 0.005, 285],
  mutedForeground: [0.735, 0.008, 285],
  primary: [0.76, 0.13, 168],
  primaryForeground: [0.17, 0.03, 168],
  brand: [0.78, 0.13, 168],
  brandMuted: [0.27, 0.045, 168],
  border: [0.295, 0.006, 285],
  destructive: [0.66, 0.19, 27],
}

const checks = (t) => [
  ['body text        foreground / background', t.foreground, t.background, 4.5],
  ['secondary text   mutedForeground / background', t.mutedForeground, t.background, 4.5],
  ['secondary on card mutedForeground / card', t.mutedForeground, t.card, 4.5],
  ['secondary on muted mutedForeground / muted', t.mutedForeground, t.muted, 4.5],
  ['CTA label       primaryFg / primary', t.primaryForeground, t.primary, 4.5],
  ['brand ink        brand / background', t.brand, t.background, 4.5],
  ['brand ink        brand / card', t.brand, t.card, 4.5],
  ['brand on tint    brand / brandMuted', t.brand, t.brandMuted, 4.5],
  ['heading on card  foreground / card', t.foreground, t.card, 4.5],
  ['destructive text destructive / background', t.destructive, t.background, 4.5],
  ['UI border        border / background', t.border, t.background, 3.0],
  ['focus ring       primary / background', t.primary, t.background, 3.0],
]

let failures = 0
for (const [label, tokens] of [['LIGHT', light], ['DARK', dark]]) {
  console.log(`\n=== ${label} ===`)
  for (const [name, fg, bg, min] of checks(tokens)) {
    const r = contrast(fg, bg)
    const ok = r >= min
    if (!ok) failures++
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2)}:1  (min ${min})  ${name}`)
  }
}
console.log(`\n${failures === 0 ? 'ALL PASS' : failures + ' FAILURE(S)'}`)
