# Testing Strategy — GFGFUT

## 1. Levels

| Level | Tool | Scope |
|---|---|---|
| Unit | Vitest | Pure functions: `normalize.ts`, `rating.ts`, provider adapters (with mocked HTTP), `providerChain.ts` fallback logic |
| Integration | Vitest + mocked `fetch` | `app/api/profile/[username]/route.ts` — all response branches in `API_SPEC.md` |
| End-to-end | Playwright | Full user flow in a real browser: enter username → see card → download PNG |
| Manual/exploratory | — | Visual QA of card rendering across tiers, long names, missing avatar, extreme stat values (0 and 99+) |

## 2. What Must Be Covered (non-negotiable)

- **Rating math (`rating.ts`):** every attribute formula, clamped correctly at floor (40) and ceiling (99). Test with representative inputs (very new profile, very high-volume profile, zero streak, huge streak) so the heuristic's edge behavior is understood, not just its happy path.
- **Provider fallback (`providerChain.ts`):** primary fails → falls through to next provider → succeeds. All providers fail → correct `502 upstream_unavailable`. This is the single highest-risk piece of the whole app (see `PRD.md` Risks) and needs explicit tests, not just implicit coverage via the happy path.
- **Input validation:** usernames with invalid characters, empty string, extremely long strings — rejected with `400` before any network call is made.
- **Cache behavior:** second request for the same username within TTL doesn't call any provider (mock should assert it was called exactly once).
- **Normalization field-mapping quirks:** each provider adapter has its own test asserting it correctly maps that provider's actual field names (e.g. `institute` vs `institution`) into `NormalizedGfgProfile` — this is where real-world API drift will bite first.

## 3. E2E Scenarios (Playwright)

1. Happy path: valid username → card renders with correct tier styling → download produces a PNG file.
2. Invalid username format → inline error, no network call made.
3. Valid-format but nonexistent username → "not found" error shown.
4. Simulated upstream outage (mock all providers failing) → "upstream unavailable" error shown, UI doesn't hang.
5. Mobile viewport: form and card both usable/readable at ~375px width.
6. Keyboard-only flow: tab to input, type, Enter submits, tab to download button, activate with keyboard.

## 4. Performance Targets

- Lighthouse Performance ≥ 90 on the main page (empty state).
- API route p95 latency ≤ 1.5s on cache miss (dependent on upstream latency — track separately from app-side latency).
- API route p95 latency ≤ 100ms on cache hit.

## 5. CI Gate

Every PR must pass, before merge:
- `npm run lint`
- `npm run typecheck`
- `npm run test` (unit + integration)
- `npm run test:e2e` (can run against a preview deployment rather than local, if faster)

No merging with failing or skipped tests without an explicit, reviewed reason left in the PR description.

## 6. Non-Goals for Testing

- No load/stress testing required for v1 launch (traffic is expected to be low; revisit if usage grows).
- No visual regression/screenshot-diffing tooling required for v1 — manual visual QA per tier is sufficient at this scale.
