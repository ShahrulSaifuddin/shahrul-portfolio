import type { PerformanceItem } from '@/lib/types'

/**
 * The 19-item performance/optimization checklist for `/performance`.
 *
 * This is a static, prerendered portfolio site: it has no database, no
 * server process to load-balance, and no live cache to warm. Every
 * `appliedHere` entry is written to be true of exactly what this site does —
 * where a technique is genuinely production experience rather than something
 * this site itself does, that is stated explicitly (FastEV's Laravel API,
 * SD Engage's Laravel API, Karuna Growth Suite's Express/SQLite API, and the
 * CloudPanel/Nginx/PM2 VPS infrastructure behind them). `demo` is set on
 * exactly the five items with a live interactive demo; every other item is
 * `null`.
 */
export const performanceItems = [
  {
    slug: 'api-response-caching',
    title: 'API Response Caching',
    category: 'Caching',
    summary: 'Cache API responses so repeat requests skip expensive recomputation.',
    detail:
      'A response is stored keyed by request parameters — in memory, in Redis, or at an HTTP cache layer — with a TTL or an explicit invalidation rule. Repeat requests return the stored payload instead of re-running business logic, which matters most on read-heavy endpoints that are slow to compute.',
    appliedHere:
      "This portfolio is a static site with no API layer to cache. The pattern is production experience: on FastEV's Laravel backend, read-heavy endpoints such as charge-point status are served from a short-lived cache to absorb polling load from concurrent app clients.",
    evidence: null,
    demo: null,
    icon: 'RefreshCw',
  },
  {
    slug: 'load-balancer',
    title: 'Load Balancing',
    category: 'Delivery',
    summary: 'Spread incoming traffic across multiple app instances so no single server saturates.',
    detail:
      'A load balancer distributes requests across two or more backend instances based on health checks and load, so a traffic spike or a failed instance does not take the whole service down.',
    appliedHere:
      'This portfolio ships as static, prerendered pages with no server process to balance load across — there is nothing to load-balance here. This entry documents production infrastructure: the FastEV, Karuna Growth Suite and CTApps Digital backends run behind Nginx on CloudPanel-managed Linux VPS infrastructure.',
    evidence: null,
    demo: null,
    icon: 'Network',
  },
  {
    slug: 'database-indexing',
    title: 'Database Indexing',
    category: 'Data',
    summary: 'Add indexes on frequently queried columns so lookups avoid full table scans.',
    detail:
      'An index lets the database jump straight to matching rows instead of scanning the whole table, turning a linear lookup into something close to logarithmic. It costs write overhead and storage, so it is targeted at columns actually used in WHERE, JOIN and ORDER BY clauses.',
    appliedHere:
      "This portfolio has no database — content is static TypeScript data compiled at build time. This reflects production work on FastEV's MySQL schema, where indexes back the charge-session and billing lookups the mobile app polls.",
    evidence: null,
    demo: null,
    icon: 'Database',
  },
  {
    slug: 'image-compression',
    title: 'Image Compression',
    category: 'Assets',
    summary: 'Re-encode images to modern formats and smaller file sizes without visible quality loss.',
    detail:
      'Serving AVIF/WebP instead of raw JPEG/PNG, and generating device-appropriate sizes, cuts transferred bytes substantially — often 50-80% — which speeds up Largest Contentful Paint on image-heavy pages.',
    appliedHere:
      "This site uses next/image, which automatically re-encodes and serves AVIF/WebP with responsive srcset sizes for the profile avatar and any other images on the site.",
    evidence: 'next/image automatic AVIF/WebP re-encoding',
    demo: null,
    icon: 'Image',
  },
  {
    slug: 'loading-skeletons',
    title: 'Loading Skeletons',
    category: 'Rendering',
    summary: 'Show a placeholder shape while content loads instead of a blank screen or spinner.',
    detail:
      'A skeleton mirrors the layout of the content that is about to arrive, so the page never jumps and the wait reads as shorter than an empty screen or a spinner would.',
    appliedHere:
      "Applied site-wide: every route (/, /projects, /projects/[slug], /performance, /contact) has a Next.js loading.tsx that renders instantly on navigation, sized to match that page's real content so nothing shifts when it arrives. Also demonstrated interactively below with a simulated slow-loading list.",
    evidence: null,
    demo: 'skeleton',
    icon: 'Rows3',
  },
  {
    slug: 'cache-expensive-queries',
    title: 'Cache Expensive Queries',
    category: 'Caching',
    summary: 'Memoize the result of a slow aggregation or join so it is computed once, not per request.',
    detail:
      "When a query involves heavy aggregation, multiple joins, or scans a large table, computing it on every request wastes cycles. Storing the result with a TTL — or invalidating it when the underlying data changes — turns a slow query into a cache hit for every request in between.",
    appliedHere:
      "No expensive queries exist on this static site. This is production experience: on SD Engage's Laravel API, aggregation-heavy endpoints such as event attendance summaries are cached rather than recomputed per request.",
    evidence: null,
    demo: null,
    icon: 'Timer',
  },
  {
    slug: 'fix-n-plus-one-queries',
    title: 'Fix N+1 Database Queries',
    category: 'Data',
    summary: 'Eager-load related records in one query instead of issuing one query per row.',
    detail:
      "Looping over a result set and querying related data inside the loop turns one page load into N+1 round trips to the database. Eager loading (e.g. Eloquent's with()) or a join fetches everything in one or two queries instead.",
    appliedHere:
      "This static site issues no database queries at build or request time. This documents production practice on FastEV's Laravel backend, where Eloquent eager loading avoids N+1 patterns across the 90-route API.",
    evidence: null,
    demo: null,
    icon: 'ListTree',
  },
  {
    slug: 'debounce-input-handlers',
    title: 'Debounce Input Handlers',
    category: 'Rendering',
    summary: 'Delay firing a handler until typing pauses, instead of on every keystroke.',
    detail:
      'Wrapping a search or filter handler in a debounce delays execution until the user stops typing for a short window, collapsing dozens of keystroke-triggered calls into one. It matters wherever a keystroke handler triggers a filter, a re-render of a large list, or a network request.',
    appliedHere:
      'Demonstrated live on this page, and used on the /projects tech-filter search input so filtering the project list does not re-run on every keystroke.',
    evidence: null,
    demo: 'debounce',
    icon: 'MousePointerClick',
  },
  {
    slug: 'code-splitting',
    title: 'Code Splitting',
    category: 'Build',
    summary: "Break the JS bundle into per-route chunks so a visitor only downloads what the current page needs.",
    detail:
      "Rather than shipping one bundle containing every page's code, the build splits it by route — and by dynamic import() for heavy below-fold widgets — so the initial download is smaller and unrelated code loads only when needed.",
    appliedHere:
      "Next.js's App Router splits this site by route automatically; heavier interactive widgets are loaded with next/dynamic rather than bundled into the initial page payload.",
    evidence: 'Automatic per-route chunking via Next.js App Router',
    demo: null,
    icon: 'Scissors',
  },
  {
    slug: 'cdn-integration',
    title: 'CDN Integration',
    category: 'Delivery',
    summary: 'Serve static assets from edge locations near the visitor instead of a single origin server.',
    detail:
      'A content delivery network caches static files — HTML, JS, CSS, images, fonts — at points of presence around the world, so visitors in different regions get a nearby, low-latency response instead of a round trip to one origin.',
    appliedHere:
      'This is a static, prerendered Next.js site, built specifically to be served from a CDN edge network on deploy. Whether that happens depends on the hosting choice made when the site goes live.',
    evidence: null,
    demo: null,
    icon: 'Globe',
  },
  {
    slug: 'server-side-caching',
    title: 'Server-Side Caching',
    category: 'Caching',
    summary: 'Cache rendered output or computed responses on the server so repeat requests skip the work.',
    detail:
      'Beyond caching a single query, an entire rendered response or computed API result can be cached server-side — in memory, on disk, or in a store like Redis — and served directly on the next matching request.',
    appliedHere:
      "This portfolio has no server-rendered request path to cache — pages are prerendered once at build time and served as static HTML. This documents production work: the Karuna Growth Suite's self-built Express/SQLite API runs behind a PM2-managed Node process on a CloudPanel VPS.",
    evidence: null,
    demo: null,
    icon: 'Server',
  },
  {
    slug: 'paginate-large-lists',
    title: 'Paginate Large Lists',
    category: 'Data',
    summary: 'Fetch and render a list in fixed-size pages instead of loading everything at once.',
    detail:
      'Rendering thousands of rows in one pass bloats memory and blocks the main thread. Paginating — page-numbered or infinite-scroll — fetches and renders a bounded slice at a time, keeping both the query and the render cheap.',
    appliedHere: 'Demonstrated live on this page with a paginated list over this same 19-item checklist.',
    evidence: null,
    demo: 'pagination',
    icon: 'ListOrdered',
  },
  {
    slug: 'lighthouse-audit',
    title: 'Lighthouse Audits',
    category: 'Build',
    summary: 'Run automated Accessibility, Performance, Best Practices and SEO scoring against every page.',
    detail:
      'Lighthouse audits a page against a fixed rubric — accessibility tree, unused bytes, render-blocking resources, meta tags — and produces a 0-100 score per category, catching regressions before they ship.',
    appliedHere:
      'Karuna Growth Suite (karunaventure.co) scores 100 Accessibility, 100 Best Practices and 100 SEO, with 90+ Performance. This portfolio is built to the same discipline.',
    evidence: '100 / 100 / 100 / 90+ on karunaventure.co',
    demo: null,
    icon: 'Gauge',
  },
  {
    slug: 'api-payload-compression',
    title: 'API Payload Compression',
    category: 'Delivery',
    summary: 'Compress HTTP responses (gzip/Brotli) so fewer bytes cross the wire.',
    detail:
      'Enabling gzip or Brotli compression on text responses — JSON, HTML, JS, CSS — typically cuts transferred size by 60-80% for minimal CPU cost, which matters most on slower mobile connections.',
    appliedHere:
      "This portfolio's static HTML, JS and CSS output is compressed in transit by the hosting layer (gzip/Brotli), the standard behavior for a Next.js static deploy.",
    evidence: null,
    demo: null,
    icon: 'Minimize2',
  },
  {
    slug: 'reduce-unnecessary-re-renders',
    title: 'Reduce Unnecessary Re-Renders',
    category: 'Rendering',
    summary: 'Memoize components and values so a parent update does not re-render unrelated children.',
    detail:
      'React.memo, useMemo and useCallback stop a component from re-rendering when its props have not meaningfully changed, which matters in lists and dashboards where one state update would otherwise cascade through every child.',
    appliedHere:
      "`ProjectCard` (used on / and /projects) is wrapped in React.memo: /projects's search box re-renders its parent on every keystroke, and without memo every visible card would re-render along with it for no reason. Also demonstrated live below with a render counter comparing a memoized component against an unmemoized one.",
    evidence: null,
    demo: 'memo',
    icon: 'Repeat',
  },
  {
    slug: 'minify-js-css',
    title: 'Minify JS & CSS',
    category: 'Build',
    summary: 'Strip whitespace, comments and shorten identifiers so shipped code is as small as possible.',
    detail:
      'A minifier removes everything a parser does not need — whitespace, comments, long variable names — cutting file size before compression even runs, at zero cost to behavior.',
    appliedHere:
      "The Next.js production build minifies all JS and CSS output automatically; nothing shipped to a visitor's browser is unminified.",
    evidence: 'Automatic via `next build` production bundling',
    demo: null,
    icon: 'FileCode',
  },
  {
    slug: 'lazy-load-images',
    title: 'Lazy-Load Images',
    category: 'Assets',
    summary: 'Defer loading an image until it is about to enter the viewport.',
    detail:
      'Loading every image on a page upfront wastes bandwidth on content the visitor may never scroll to. loading="lazy" (or an IntersectionObserver) defers the request until the image is near the viewport, prioritizing what is visible first.',
    appliedHere:
      'The only image on this site today is the hero portrait, and it is deliberately excluded from lazy loading — marked `priority` because it is the LCP element, so eager-loading it is the correct call, not an oversight. next/image defaults every other image to loading="lazy" automatically, which would apply the moment a second image is added. Demonstrated live below with two boxes that show what a lazy image actually does.',
    evidence: 'next/image default loading="lazy"; hero avatar deliberately excluded via priority',
    demo: 'lazy-image',
    icon: 'Images',
  },
  {
    slug: 'defer-non-critical-scripts',
    title: 'Defer Non-Critical Scripts',
    category: 'Rendering',
    summary: 'Delay loading third-party or non-essential scripts until after the page is interactive.',
    detail:
      'Analytics, chat widgets and other third-party scripts block nothing the visitor is looking at, so loading them eagerly only competes with the scripts the page actually needs to render. Deferring them keeps the critical path clear.',
    appliedHere:
      "The only third-party script this site can load is the optional analytics mount (`src/components/analytics.tsx`), which is env-gated and off by default. When enabled, it loads via next/script's afterInteractive strategy so it never blocks initial render; with analytics disabled, the site loads no third-party JavaScript at all.",
    evidence: null,
    demo: null,
    icon: 'Clock',
  },
  {
    slug: 'remove-unused-dependencies',
    title: 'Remove Unused Dependencies',
    category: 'Build',
    summary: 'Drop packages the code no longer imports so the bundle and install size do not carry dead weight.',
    detail:
      'An unused dependency still gets installed, still gets scanned by tooling, and — if it is ever imported by mistake or a barrel file — can end up in the client bundle. Regularly auditing and removing what is not imported keeps both install time and bundle size honest.',
    appliedHere:
      'This project intentionally avoids adding moment.js, lodash or a chart library — a hand-rolled debounce and native Intl/Date cover what those would have added, so there is nothing unused to remove.',
    evidence: null,
    demo: null,
    icon: 'PackageMinus',
  },
] as const satisfies readonly PerformanceItem[]
