/**
 * WCAG contrast gate for the design tokens.
 *
 * Run: `node scripts/check-contrast.mjs`
 * Exits 1 if any pair fails, so it can be wired into CI.
 *
 * WHY THIS PARSES THE CSS INSTEAD OF HARDCODING VALUES:
 * An earlier version of this script hardcoded the token values. The tokens were
 * later corrected in globals.css, and the script kept "proving" the old numbers
 * — it reported failures that no longer existed and never tested `--input` at
 * all, which is the one token the 3:1 non-text rule actually governs here.
 * A checker that can drift away from the thing it checks is decoration, not
 * evidence. This version reads src/app/globals.css at run time, so it either
 * tests the live tokens or fails loudly because it could not find them.
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const CSS_PATH = join(here, '..', 'src', 'app', 'globals.css')

// ---------- color math: OKLCH -> sRGB -> WCAG relative luminance ----------

function oklchToSrgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3

  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

  const encode = (x) => {
    const c = x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(Math.max(x, 0), 1 / 2.4) - 0.055
    return Math.min(1, Math.max(0, c))
  }
  return [encode(lr), encode(lg), encode(lb)]
}

function relativeLuminance([r, g, b]) {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrastRatio(fg, bg) {
  const a = relativeLuminance(oklchToSrgb(...fg))
  const b = relativeLuminance(oklchToSrgb(...bg))
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}

// ---------- parse the live tokens out of globals.css ----------

/** Pulls `--name: oklch(L C H)` pairs out of one CSS block. */
function parseBlock(css, selector) {
  // Match the selector only where it actually opens a rule — i.e. at the start
  // of a line, followed by optional whitespace and `{`. A naive indexOf('.dark')
  // matches the `@custom-variant dark (&:is(.dark *));` line near the top of the
  // file and then walks into the wrong block entirely.
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const opener = new RegExp(`^[ \\t]*${escaped}[ \\t]*\\{`, 'm')
  const match = opener.exec(css)
  if (!match) throw new Error(`Could not find a "${selector} {" rule in ${CSS_PATH}`)
  const open = css.indexOf('{', match.index)
  if (open === -1) throw new Error(`Malformed "${selector}" block`)

  let depth = 0
  let end = -1
  for (let i = open; i < css.length; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}') {
      depth--
      if (depth === 0) {
        end = i
        break
      }
    }
  }
  if (end === -1) throw new Error(`Unbalanced braces in "${selector}" block`)

  const body = css.slice(open + 1, end)
  const tokens = {}
  const re = /--([\w-]+)\s*:\s*oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)\s*\)/g
  let m
  while ((m = re.exec(body)) !== null) {
    tokens[m[1]] = [Number(m[2]), Number(m[3]), Number(m[4])]
  }
  return tokens
}

const css = readFileSync(CSS_PATH, 'utf8')
const light = parseBlock(css, ':root')
const dark = parseBlock(css, '.dark')

/** Fails loudly rather than silently skipping a token that got renamed. */
function need(theme, themeName, name) {
  const v = theme[name]
  if (!v) {
    throw new Error(
      `Token --${name} not found (or not in oklch form) in the "${themeName}" block of globals.css. ` +
        `If it was renamed, update this script — do not delete the check.`
    )
  }
  return v
}

// ---------- the checks ----------
// 4.5:1  WCAG 1.4.3 normal-size text
// 3.0:1  WCAG 1.4.11 non-text contrast (UI component boundaries, focus indicators)
//
// NOTE: --border is deliberately NOT checked against 3:1. It is a decorative
// hairline between cards, not a UI component boundary. --input IS checked,
// because it draws form-control boundaries, which 1.4.11 does govern.

function checks(t, themeName) {
  const g = (n) => need(t, themeName, n)
  return [
    ['body text            --foreground on --background', g('foreground'), g('background'), 4.5],
    ['secondary text       --muted-foreground on --background', g('muted-foreground'), g('background'), 4.5],
    ['secondary on card    --muted-foreground on --card', g('muted-foreground'), g('card'), 4.5],
    ['secondary on muted   --muted-foreground on --muted', g('muted-foreground'), g('muted'), 4.5],
    ['heading on card      --foreground on --card', g('foreground'), g('card'), 4.5],
    ['CTA label            --primary-foreground on --primary', g('primary-foreground'), g('primary'), 4.5],
    ['brand ink            --brand on --background', g('brand'), g('background'), 4.5],
    ['brand ink on card    --brand on --card', g('brand'), g('card'), 4.5],
    ['brand on tint        --brand on --brand-muted', g('brand'), g('brand-muted'), 4.5],
    ['destructive text     --destructive on --background', g('destructive'), g('background'), 4.5],
    ['form control border  --input on --background  [WCAG 1.4.11]', g('input'), g('background'), 3.0],
    ['focus ring           --ring on --background   [WCAG 1.4.11]', g('ring'), g('background'), 3.0],
  ]
}

let failures = 0
for (const [themeName, tokens] of [
  ['LIGHT  (:root)', light],
  ['DARK   (.dark)', dark],
]) {
  console.log(`\n=== ${themeName} ===`)
  for (const [label, fg, bg, min] of checks(tokens, themeName)) {
    const ratio = contrastRatio(fg, bg)
    const ok = ratio >= min
    if (!ok) failures++
    console.log(
      `${ok ? 'PASS' : 'FAIL'}  ${ratio.toFixed(2).padStart(5)}:1  (min ${min.toFixed(1)})  ${label}`
    )
  }
}

console.log(
  `\n${failures === 0 ? 'ALL PASS — tokens read live from src/app/globals.css' : `${failures} FAILURE(S)`}`
)
process.exit(failures === 0 ? 0 : 1)
