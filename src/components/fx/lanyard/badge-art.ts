/**
 * Paints the 3D badge's texture atlas and lanyard strap at runtime, from the
 * real portrait and profile data — so the card always matches the site, and
 * the GLB ships with a 1×1 placeholder instead of a 2.3 MB baked texture.
 *
 * Atlas layout (measured from card.glb's UVs, as in React Bits' Lanyard):
 * front face = left half, top 75.5%; back face = right half, top 75.7%.
 */

const ATLAS = 2048
const FRONT = { x: 0, y: 0, w: ATLAS * 0.5, h: ATLAS * 0.755 }
const BACK = { x: ATLAS * 0.5, y: 0, w: ATLAS * 0.5, h: ATLAS * 0.757 }

type Ctx = CanvasRenderingContext2D & { fontStretch?: string; letterSpacing?: string }

export interface BadgeData {
  firstName: string
  lastName: string
  title: string
  location: string
  email: string
  github: string
  photoSrc: string
}

function cssVar(name: string, fallback: string): string {
  const v = getComputedStyle(document.body).getPropertyValue(name).trim()
  return v || fallback
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function grid(ctx: Ctx, x: number, y: number, w: number, h: number, step: number) {
  ctx.save()
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'
  ctx.lineWidth = 1
  for (let gx = x; gx <= x + w; gx += step) {
    ctx.beginPath()
    ctx.moveTo(gx, y)
    ctx.lineTo(gx, y + h)
    ctx.stroke()
  }
  for (let gy = y; gy <= y + h; gy += step) {
    ctx.beginPath()
    ctx.moveTo(x, gy)
    ctx.lineTo(x + w, gy)
    ctx.stroke()
  }
  ctx.restore()
}

function bolt(ctx: Ctx, cx: number, cy: number, s: number, color: string) {
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx + 0.1 * s, cy - 0.5 * s)
  ctx.lineTo(cx - 0.3 * s, cy + 0.08 * s)
  ctx.lineTo(cx - 0.02 * s, cy + 0.08 * s)
  ctx.lineTo(cx - 0.12 * s, cy + 0.5 * s)
  ctx.lineTo(cx + 0.3 * s, cy - 0.1 * s)
  ctx.lineTo(cx + 0.02 * s, cy - 0.1 * s)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function paintFront(ctx: Ctx, d: BadgeData, photo: HTMLImageElement | null, f: Fonts) {
  const { x, y, w, h } = FRONT
  const volt = '#5ff5b4'
  const pad = 72

  const bg = ctx.createLinearGradient(x, y, x + w, y + h)
  bg.addColorStop(0, '#0b1016')
  bg.addColorStop(1, '#0a1714')
  ctx.fillStyle = bg
  ctx.fillRect(x, y, w, h)
  grid(ctx, x, y, w, h, 64)

  // Header strip
  ctx.fillStyle = volt
  bolt(ctx, x + pad + 18, y + 92, 52, volt)
  ctx.font = `600 30px ${f.mono}`
  ctx.letterSpacing = '6px'
  ctx.fillStyle = '#e8f0f2'
  ctx.textBaseline = 'middle'
  ctx.fillText('LIVE WIRE', x + pad + 58, y + 94)
  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(232,240,242,0.55)'
  ctx.fillText('ACCESS · ALL SYSTEMS', x + w - pad, y + 94)
  ctx.textAlign = 'left'

  // Portrait window
  const px = x + pad
  const py = y + 160
  const pw = w - pad * 2
  const ph = 760
  ctx.save()
  roundRect(ctx, px, py, pw, ph, 36)
  ctx.clip()
  ctx.fillStyle = '#16202a'
  ctx.fillRect(px, py, pw, ph)
  if (photo) {
    // Cover-fit, biased toward the top so the face stays in frame.
    const scale = Math.max(pw / photo.width, ph / photo.height)
    const dw = photo.width * scale
    const dh = photo.height * scale
    ctx.filter = 'grayscale(0.35) contrast(1.08)'
    ctx.drawImage(photo, px + (pw - dw) / 2, py + (ph - dh) * 0.2, dw, dh)
    ctx.filter = 'none'
  }
  const tint = ctx.createLinearGradient(0, py, 0, py + ph)
  tint.addColorStop(0, 'rgba(10,23,20,0)')
  tint.addColorStop(0.62, 'rgba(10,23,20,0.05)')
  tint.addColorStop(1, 'rgba(10,23,20,0.92)')
  ctx.fillStyle = tint
  ctx.fillRect(px, py, pw, ph)
  // Scanlines
  ctx.fillStyle = 'rgba(0,0,0,0.12)'
  for (let sy = py; sy < py + ph; sy += 6) ctx.fillRect(px, sy, pw, 2)
  ctx.restore()

  ctx.save()
  roundRect(ctx, px, py, pw, ph, 36)
  ctx.strokeStyle = 'rgba(95,245,180,0.55)'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.restore()

  // Status pill over the portrait
  ctx.save()
  roundRect(ctx, px + 32, py + 32, 250, 60, 30)
  ctx.fillStyle = 'rgba(10,16,22,0.72)'
  ctx.fill()
  ctx.fillStyle = volt
  ctx.beginPath()
  ctx.arc(px + 66, py + 62, 9, 0, Math.PI * 2)
  ctx.fill()
  ctx.font = `600 24px ${f.mono}`
  ctx.letterSpacing = '4px'
  ctx.fillStyle = '#e8f0f2'
  ctx.fillText('AVAILABLE', px + 88, py + 63)
  ctx.restore()

  // Name
  ctx.fillStyle = '#f4f8f9'
  ctx.textBaseline = 'alphabetic'
  ctx.fontStretch = 'expanded'
  ctx.letterSpacing = '-2px'
  ctx.font = `800 104px ${f.display}`
  ctx.fillText(d.firstName.toUpperCase(), x + pad, py + ph + 150)
  ctx.fillText(d.lastName.toUpperCase(), x + pad, py + ph + 256)
  ctx.fontStretch = 'normal'

  ctx.font = `600 32px ${f.mono}`
  ctx.letterSpacing = '6px'
  ctx.fillStyle = volt
  ctx.fillText(d.title.toUpperCase(), x + pad, py + ph + 330)

  // Footer: location + barcode
  ctx.font = `500 26px ${f.mono}`
  ctx.letterSpacing = '4px'
  ctx.fillStyle = 'rgba(232,240,242,0.6)'
  ctx.fillText(d.location.toUpperCase(), x + pad, y + h - 70)
  let bx = x + w - pad - 250
  let seed = 7
  while (bx < x + w - pad) {
    seed = (seed * 9301 + 49297) % 233280
    const bw = 3 + (seed % 9)
    ctx.fillStyle = 'rgba(232,240,242,0.75)'
    ctx.fillRect(bx, y + h - 118, bw, 70)
    bx += bw + 4 + (seed % 5)
  }
}

function paintBack(ctx: Ctx, d: BadgeData, f: Fonts) {
  const { x, y, w, h } = BACK
  const volt = '#5ff5b4'
  const pad = 80
  ctx.fillStyle = '#0b1016'
  ctx.fillRect(x, y, w, h)
  grid(ctx, x, y, w, h, 64)

  // Oscilloscope trace
  ctx.save()
  ctx.strokeStyle = volt
  ctx.lineWidth = 5
  ctx.shadowColor = volt
  ctx.shadowBlur = 24
  ctx.beginPath()
  for (let i = 0; i <= 200; i++) {
    const t = i / 200
    const px = x + pad + t * (w - pad * 2)
    const env = Math.sin(t * Math.PI)
    const py = y + 420 + Math.sin(t * Math.PI * 9) * 120 * env * (0.6 + 0.4 * Math.sin(t * 40))
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()
  ctx.restore()

  bolt(ctx, x + w / 2, y + 820, 220, volt)

  ctx.textAlign = 'center'
  ctx.fillStyle = '#f4f8f9'
  ctx.fontStretch = 'expanded'
  ctx.letterSpacing = '-1px'
  ctx.font = `800 72px ${f.display}`
  ctx.fillText('IF FOUND,', x + w / 2, y + 1070)
  ctx.fillStyle = volt
  ctx.fillText('PLEASE HIRE.', x + w / 2, y + 1150)
  ctx.fontStretch = 'normal'

  ctx.font = `500 30px ${f.mono}`
  ctx.letterSpacing = '2px'
  ctx.fillStyle = 'rgba(232,240,242,0.7)'
  ctx.fillText(d.email, x + w / 2, y + 1280)
  ctx.fillText(d.github.replace(/^https?:\/\//, ''), x + w / 2, y + 1330)
  ctx.textAlign = 'left'
}

function paintBand(ctx: Ctx, width: number, height: number, d: BadgeData, f: Fonts) {
  ctx.fillStyle = '#5ff5b4'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#0a0f14'
  ctx.fillRect(0, 14, width, 4)
  ctx.fillRect(0, height - 18, width, 4)
  ctx.font = `800 58px ${f.display}`
  ctx.fontStretch = 'expanded'
  ctx.letterSpacing = '6px'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#0a0f14'
  ctx.fillText(`${d.firstName.toUpperCase()} ⚡ ${d.lastName.toUpperCase()}`, width / 2, height / 2 + 4)
}

interface Fonts {
  display: string
  mono: string
}

export interface BadgeArt {
  atlas: HTMLCanvasElement
  band: HTMLCanvasElement
}

export async function paintBadgeArt(d: BadgeData): Promise<BadgeArt> {
  const fonts: Fonts = {
    display: cssVar('--font-display', 'system-ui, sans-serif'),
    mono: cssVar('--font-geist-mono', 'ui-monospace, monospace'),
  }
  await Promise.all([
    document.fonts.load(`800 100px ${fonts.display}`),
    document.fonts.load(`600 30px ${fonts.mono}`),
  ]).catch(() => undefined)
  const photo = await loadImage(d.photoSrc)

  const atlas = document.createElement('canvas')
  atlas.width = ATLAS
  atlas.height = ATLAS
  const ctx = atlas.getContext('2d') as Ctx
  // Everything outside the two faces is the card's edge/rim.
  ctx.fillStyle = '#0d141b'
  ctx.fillRect(0, 0, ATLAS, ATLAS)
  paintFront(ctx, d, photo, fonts)
  paintBack(ctx, d, fonts)

  const band = document.createElement('canvas')
  band.width = 1024
  band.height = 256
  paintBand(band.getContext('2d') as Ctx, band.width, band.height, d, fonts)

  return { atlas, band }
}
