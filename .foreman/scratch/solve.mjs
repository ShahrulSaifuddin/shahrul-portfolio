function oklchToSrgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180
  const a = C * Math.cos(h), b = C * Math.sin(h)
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
const relLum = ([r, g, b]) => {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}
const contrast = (fg, bg) => {
  const a = relLum(oklchToSrgb(...fg)), b = relLum(oklchToSrgb(...bg))
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}

console.log('--- LIGHT --primary: need primaryFg(0.99,0.01,168) on it >= 4.5 ---')
for (let L = 0.62; L >= 0.44; L -= 0.01) {
  const r = contrast([0.99, 0.01, 168], [L, 0.12, 168])
  console.log(`L=${L.toFixed(2)}  ${r.toFixed(2)}:1  ${r >= 4.5 ? 'OK' : ''}`)
}

console.log('\n--- LIGHT --input: neutral border on background(0.995,0,0) >= 3.0 ---')
for (let L = 0.90; L >= 0.62; L -= 0.02) {
  const r = contrast([L, 0.004, 285], [0.995, 0, 0])
  console.log(`L=${L.toFixed(2)}  ${r.toFixed(2)}:1  ${r >= 3.0 ? 'OK' : ''}`)
}

console.log('\n--- DARK --input: neutral border on background(0.165,0.004,285) >= 3.0 ---')
for (let L = 0.30; L <= 0.62; L += 0.02) {
  const r = contrast([L, 0.006, 285], [0.165, 0.004, 285])
  console.log(`L=${L.toFixed(2)}  ${r.toFixed(2)}:1  ${r >= 3.0 ? 'OK' : ''}`)
}

console.log('\n--- LIGHT brand on brandMuted at candidate primary L (badge text) ---')
for (const L of [0.50, 0.52, 0.54]) {
  console.log(`brand L=${L}: ${contrast([L, 0.12, 168], [0.955, 0.03, 168]).toFixed(2)}:1`)
}
