# AI Layout Builder — Lighthouse 98+

Block-based page builder with streaming AI content generation and Lighthouse 98 performance.

**[Live Demo](https://next-ai-layout-builder-lighthouse.vercel.app)** · Next.js 15 · TypeScript · Apollo GraphQL · Sanity CMS · SSE Streaming

[![Lighthouse CI](https://github.com/fcordero/next-ai-layout-builder-lighthouse/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/fcordero/next-ai-layout-builder-lighthouse/actions/workflows/lighthouse.yml)

---

## Performance Evidence

### Lighthouse Score — Production (Vercel)
> Screenshot taken from the deployed Vercel URL. Simulated throttling in CI scores 95+;
> production on Vercel Edge Network consistently scores 98.

![Lighthouse 98 — Performance, Accessibility 100, Best Practices 100](./docs/performance/lighthouse-98.png)

### Bundle Analysis — dnd-kit absent from public route
> Run `npm run analyze` to reproduce. The dnd-kit chunk only loads at `/studio`.

![Bundle Analyzer — initial JS <80KB on public route](./docs/performance/bundle-analyzer.png)

### Vercel Analytics — LCP Field Data (7-day median)
> Real user measurements from Vercel Analytics. Not Lighthouse simulation — field data.

![LCP 1.8s — 7 day p75 median from Vercel Analytics](./docs/performance/vercel-lcp.png)

### AI Graceful Degradation
> The component reverts to the static placeholder silently when the AI endpoint
> exceeds the 2-second budget. No spinner, no error state — just the placeholder.

![Graceful degradation demo — 2s timeout then silent revert](./docs/performance/graceful-degradation.gif)

---

## Performance Budget

| Metric | Target | How |
|--------|--------|-----|
| LCP | <1.8s | RSC + Image priority + Sanity CDN WebP |
| CLS | <0.05 | Fixed minHeight on all blocks, no async layout shifts |
| INP | <100ms | useTransition wraps all drag-end state updates |
| Initial JS | <80KB | Editor loaded via dynamic({ ssr: false }), never on public route |
| TTFB | <200ms | Vercel Edge Network + ISR revalidate: 60s |
| AI timeout | 2s hard limit | AbortController fires on first token timeout; silent revert to placeholder |

---

## Architecture

### Two separate bundles — the core of the 98 score

```
Public route /[slug]          Studio route /studio
─────────────────────         ──────────────────────
Next.js RSC + ISR             Client Components + dnd-kit
GraphQL → Sanity              Mutations → Sanity API
HTML at edge                  Revalidate ISR

Bundle: ~40KB (React runtime) Bundle: unbounded (editor tools)
Lighthouse: 98                Not measured — not for visitors
```

The `app/studio/editor/[slug]/page.tsx` mounts the PageEditor with
`dynamic({ ssr: false })` — dnd-kit is never included in the public route
JavaScript bundle. Verified with `npm run analyze`.

### AI Graceful Degradation

Three states. No fourth error state.

```
idle → [click Generate] → streaming → [first token <2s] → complete
                               ↓
                     [no first token in 2s]
                               ↓
                      abort + setState('idle')
                      ← silent revert to placeholder
```

The `AbortController` timeout starts when `fetch()` begins. The moment the
first SSE token arrives, `clearTimeout()` cancels it permanently. After that,
streaming continues indefinitely regardless of duration.

### ISR + Sanity Live Preview

Public pages are statically generated at build time and revalidated every 60s
via ISR. The studio editor uses Sanity's `.listen()` EventSource API to push
live document changes to the preview pane without page reloads.

---

## Local Development

```bash
# 1. Clone and install
git clone https://github.com/fcordero/next-ai-layout-builder-lighthouse
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Fill in: NEXT_PUBLIC_SANITY_PROJECT_ID, ANTHROPIC_API_KEY, etc.

# 3. Enable Sanity GraphQL API
# Dashboard → your project → API → GraphQL → Deploy

# 4. Generate TypeScript types from live schema
npm run codegen

# 5. Run development server
npm run dev
# Public: http://localhost:3000/[slug]
# Studio: http://localhost:3000/studio
```

## Bundle Analysis

```bash
npm run analyze
# Opens bundle-analyzer report in browser
# Verify: @dnd-kit/* appears only in studio chunks, never in page-[slug].js
```

## Lighthouse CI (Local)

```bash
npm install -g @lhci/cli
npm run build && npm start &
lhci autorun
```

---

## Rate Limiting — Design Decision

The `/api/generate` endpoint limits to **10 generations per session per hour**
(in-memory, resets on cold start). This is intentional demo-grade rate limiting.

Why in-memory: simple to understand, zero infrastructure dependencies, sufficient
to prevent accidental API key exhaustion during demos. For production use with
multiple Vercel instances, replace with Upstash Redis (1 extra dependency, exact
same behavior).

Why the studio token: the `x-studio-token` header gates the endpoint against
unauthenticated calls. It's a shared secret pattern (demo-grade) — production
would use NextAuth or Clerk sessions and check against the authenticated user ID.

---

## Week-by-Week Implementation

| Week | Deliverable | Key decision |
|------|-------------|--------------|
| 1 | Sanity schema, GraphQL layer, ISR routes, block components | Bundle separation established from day 1 |
| 2 | dnd-kit editor, optimistic updates, Sanity live preview | `useTransition` wraps drag-end for INP <100ms |
| 3 | SSE streaming AI, 2s graceful degradation, rate limiting | AbortController on first token, not total duration |
| 4 | Lighthouse 98, bundle analysis, CI gate, documentation | Measured in production, not localhost |
