/**
 * A small in-memory, fixed-window rate limiter.
 *
 * IMPORTANT — this is NOT production-grade: the `Map` below lives in a single
 * Node.js process's memory. It resets on every deploy and every serverless
 * cold start, and it is NOT shared across multiple instances/regions behind
 * a load balancer — under real concurrent traffic each instance enforces its
 * own independent limit. That is an acceptable trade-off for a low-traffic
 * portfolio contact form, but a real production system needs a durable,
 * shared store (e.g. Upstash Redis, Vercel KV, Cloudflare rate limiting)
 * keyed the same way (per IP, fixed or sliding window).
 */

const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5

interface RateLimitEntry {
  count: number
  resetAt: number
}

const hits = new Map<string, RateLimitEntry>()

export interface RateLimitResult {
  ok: boolean
  /** Requests remaining in the current window. */
  remaining: number
  /** Epoch ms when the current window resets. */
  resetAt: number
}

/**
 * Checks and records one request against `key` (typically `contact:<ip>`).
 * Fixed-window: exceeding `MAX_REQUESTS_PER_WINDOW` within `WINDOW_MS` of the
 * first request in the window fails every subsequent request until reset.
 */
export function checkRateLimit(key: string, now: number = Date.now()): RateLimitResult {
  const existing = hits.get(key)

  if (!existing || now >= existing.resetAt) {
    const resetAt = now + WINDOW_MS
    hits.set(key, { count: 1, resetAt })
    return { ok: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetAt }
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  return { ok: true, remaining: MAX_REQUESTS_PER_WINDOW - existing.count, resetAt: existing.resetAt }
}
