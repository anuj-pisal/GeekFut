# Build Tasks — GFGFUT

Ordered so each phase is independently shippable/testable before the next starts. Check items off as completed. References point to the doc that has the authoritative detail — this file is sequencing, not the source of truth for specifics.

## Phase 0 — Project Setup
- [ ] Initialize Next.js 14 app (TypeScript, App Router, Tailwind) — see `ARCHITECTURE.md` §1
- [ ] Set up ESLint + Prettier per `CODING_STANDARDS.md`
- [ ] Set up Vitest + Playwright scaffolding per `TESTING.md`
- [ ] Add folder structure per `ARCHITECTURE.md` §5
- [ ] Configure Tailwind theme with tokens from `DESIGN_SYSTEM.md` §2–3

## Phase 1 — Data Layer (no UI yet)
- [ ] Define `NormalizedGfgProfile` and `CardModel` types per `API_SPEC.md`
- [ ] Implement `lib/providers/tashif.ts` (primary provider adapter)
- [ ] Implement `lib/providers/napiyo.ts` and `lib/providers/arnoob.ts` (fallbacks)
- [ ] Implement `lib/providerChain.ts` (tries providers in order, returns first success, aggregates errors on total failure)
- [ ] Implement `lib/normalize.ts`
- [ ] Implement `lib/rating.ts` (pure function, per `PRD.md` §10 heuristic) — **write unit tests alongside this, not after**
- [ ] Implement `lib/cache.ts` (in-memory TTL map for v1)
- [ ] Unit tests: each provider adapter (mock upstream responses, including malformed/error cases), `normalize.ts`, `rating.ts`, `providerChain.ts` fallback behavior

## Phase 2 — API Route
- [ ] Implement `app/api/profile/[username]/route.ts` per `API_SPEC.md`
- [ ] Input validation (username format) before any provider call
- [ ] Wire cache check → provider chain → normalize → rate → cache write → response
- [ ] Rate limiting middleware per `SECURITY_AND_PRIVACY.md`
- [ ] Integration tests hitting the route with mocked provider responses (success, not-found, all-providers-down, invalid-username, rate-limited)

## Phase 3 — UI
- [ ] `UsernameForm` component (input + submit, per `DESIGN_SYSTEM.md` §5 states)
- [ ] `PlayerCard` component per `DESIGN_SYSTEM.md` §4 contract
- [ ] `CardStage` (empty/loading/error/success state container)
- [ ] `DownloadButton` (html2canvas export)
- [ ] Wire `app/page.tsx`: form → fetch `/api/profile/[username]` → render card
- [ ] Responsive check: mobile + desktop viewports
- [ ] Accessibility pass per `DESIGN_SYSTEM.md` §6

## Phase 4 — Hardening
- [ ] Error boundary for unexpected client-side failures
- [ ] Loading skeleton instead of blank stage while fetching
- [ ] Confirm cache TTL behavior under repeated lookups of the same username
- [ ] Confirm provider fallback actually triggers when primary is forced to fail (test with a deliberately broken mock)
- [ ] Lighthouse pass (performance + accessibility) — target scores in `TESTING.md`

## Phase 5 — Deployment
- [ ] Follow `DEPLOYMENT.md` end to end on a staging Vercel project first
- [ ] Verify env vars, rate-limit config, and cache behavior in the deployed environment (not just local)
- [ ] Smoke test: generate + download a card against production URLs
- [ ] Promote to production deployment

## Phase 6 — Post-launch (nice-to-have, not blocking launch)
- [ ] Exact difficulty breakdown via a secondary endpoint, replacing the estimated split (see `PRD.md` §14 open questions)
- [ ] Server-side OG image generation for link-preview sharing (`@vercel/og`)
- [ ] Card theme variants

## Definition of Done (applies to every phase)
- [ ] Tests pass (`npm run test` and `npm run test:e2e`)
- [ ] Lint/typecheck pass (`npm run lint`, `npm run typecheck`)
- [ ] No console errors/warnings in the browser for the happy path
- [ ] Matches the relevant spec doc — if implementation diverges from a doc, update the doc in the same change, don't let them drift apart
