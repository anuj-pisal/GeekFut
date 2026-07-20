# Project Requirements Document — GFGFUT

**Turn a GeeksforGeeks profile into an Ultimate Team–style player card**

| | |
|---|---|
| **Status** | Draft |
| **Owner** | Anuj Pisal |
| **Prototype** | `gfgfut.html` (single-file web app) |
| **Category** | Fan-made / unofficial developer tool |

---

## 1. Summary

GFGFUT is a web tool that takes a GeeksforGeeks (GFG) username, pulls that user's public coding stats, and generates a FIFA Ultimate Team–style player card (overall rating, six attribute stats, tier foil, streak meter) that can be viewed in-browser and downloaded as a PNG. It follows the same concept as existing tools for other platforms (a GitHub-to-card generator and a LeetCode-to-card generator), applied to GFG.

For the production tech stack and system design, see `ARCHITECTURE.md`. This document covers *what* to build and *why*, not *how*.

## 2. Problem / Motivation

- Competitive programmers and DSA learners like to show off their GFG stats, but GFG's own profile page is plain and not shareable in a fun, visual format.
- Similar tools already exist for GitHub and LeetCode profiles and have proven popular for social sharing (Twitter/LinkedIn flexing, community leaderboards, resume flair).
- No equivalent currently exists for GeeksforGeeks.

## 3. Goals

1. Let anyone generate a shareable "player card" from a public GFG username with zero login required.
2. Map real GFG stats to card attributes in a way that feels meaningful, not random.
3. Produce a downloadable, shareable image (PNG) of the card.
4. Ship as a resilient, low-maintenance app that degrades gracefully when the underlying (unofficial) data source has problems.

## 4. Non-Goals (out of scope for v1)

- No user accounts, login, or saved history of previously generated cards.
- No official partnership or data agreement with GeeksforGeeks.
- No card trading, packs, marketplace, or any other "Ultimate Team" game mechanics — this is a static image generator only.
- No mobile app; web-only.
- No editing/customizing card stats manually (stats are always derived from real profile data).

## 5. Target Users

- GFG users who want a shareable visual of their coding profile.
- College coding clubs / communities that want a fun leaderboard visual.
- Developers who enjoy GitHub/LeetCode "-to-card" tools and want the GFG equivalent.

## 6. User Flow

1. User lands on the page and sees an input field for a GFG username.
2. User types a username and clicks "Generate card" (or presses Enter).
3. App fetches that user's public stats from a GFG stats data source.
4. App computes card attributes and an overall rating, then renders the card.
5. User can click "Download PNG" to save the card as an image.
6. On error (invalid username, upstream API down, rate-limited), the user sees a clear inline message and can retry.

## 7. Functional Requirements

| ID | Requirement |
|----|-------------|
| FR1 | User can enter any GFG username in a text field. |
| FR2 | System fetches that user's public profile stats (coding score, total problems solved, current streak, max streak, institute, institute rank, profile picture). |
| FR3 | System computes an Overall Rating (OVR) from coding score and total problems solved. |
| FR4 | System computes six FIFA-style attributes (Pace, Shooting, Passing, Dribbling, Defending, Physical) derived from streak activity, solved-problem volume/difficulty mix, and institute rank. |
| FR5 | System assigns a card tier (Bronze / Silver / Gold / Icon) based on OVR thresholds, each with distinct card styling. |
| FR6 | Card displays: avatar (or initials fallback), name, institution, OVR, tier badge, six attributes, and a streak meter (current vs. best). |
| FR7 | User can download the rendered card as a PNG image. |
| FR8 | System shows a loading state while fetching and a clear error state on failure (invalid username, network/API failure). |
| FR9 | Card generation requires no login, signup, or personal data entry beyond the username. |

## 8. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR1 | Card generation completes in under ~3 seconds under normal network conditions (cache miss); under ~1s on a cache hit. |
| NFR2 | Page is responsive and usable on both desktop and mobile viewports. |
| NFR3 | No sensitive or private data is stored — the app is stateless beyond a short-lived cache; nothing persists long-term. See `SECURITY_AND_PRIVACY.md`. |
| NFR4 | Graceful degradation if the underlying stats source is slow, rate-limited, or temporarily down — via the provider fallback chain (see §9 below and `ARCHITECTURE.md` §4). |
| NFR5 | Deployable as a single app with no dependency on infrastructure beyond standard managed hosting (see `DEPLOYMENT.md`). |

## 9. Data Source

- GFG has no official public API, so this relies on **unofficial, community-maintained GFG stats APIs** that expose a user's public profile page data as JSON (coding score, problems solved, streaks, institute rank, etc.).
- **Risk:** these are third-party services outside the project's control — they can change response formats, go down, or get rate-limited without notice.
- **Mitigation:** the app calls an ordered chain of providers, falling through to the next on failure, rather than depending on a single source:
  1. `gfg-stats.tashif.codes` — primary
  2. `napiyo`'s GFG stats API — fallback
  3. `arnoob16`'s GFG stats API — fallback
  See `ARCHITECTURE.md` §4 for the implementation contract and `API_SPEC.md` for the normalized shape every provider gets mapped into.
- Only publicly visible GFG profile data is used; no scraping of private or authenticated data.

## 10. Card Rating Logic (v1 heuristic)

- **Overall Rating:** derived primarily from coding score, with a smaller contribution from total problems solved.
- **Pace:** current streak + max streak (rewards consistency).
- **Shooting / Passing / Dribbling:** derived from an estimated hard/medium/easy solve-count split (approximated from total solved, since the primary data source doesn't expose an exact difficulty breakdown in v1).
- **Defending:** derived from institute rank (better rank → higher defending).
- **Physical:** derived from total problems solved (volume/stamina proxy).
- **Tier:** Bronze (40–64), Silver (65–79), Gold (80–89), Icon (90+).

This is explicitly a **for-fun heuristic**, not an official skill assessment, and should be labeled as such in the UI. Implementation detail lives in `lib/rating.ts` per `ARCHITECTURE.md`; formulas should be unit-tested per `TESTING.md`.

## 11. Design Requirements

- Visual language: FIFA Ultimate Team card conventions (foil tiers, OVR/position block, attribute grid), adapted with a GFG-specific accent (green-based "Icon" tier instead of a generic special-card look) and a streak meter as the one GFG-specific signature element.
- Must clearly disclose it is **fan-made and unofficial** — not affiliated with GeeksforGeeks or EA Sports.
- Full token-level detail (colors, type, component contracts) lives in `DESIGN_SYSTEM.md`.

## 12. Success Metrics (post-launch)

- Number of cards generated / unique usernames looked up.
- Download-to-generate ratio (are people actually saving/sharing the card, or just previewing it).
- Error rate on generation (proxy for upstream API reliability) — track which provider in the chain served each request (`meta.provider` in the API response) to catch upstream degradation early.

## 13. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| Reliance on unofficial third-party APIs | Feature breaks if a provider changes or disappears | Provider fallback chain (§9); monitor which provider is serving requests and update the chain as needed |
| No exact difficulty breakdown available from the primary data source | Shooting/Passing/Dribbling are estimates, not exact | Disclose as heuristic; swap in an exact-breakdown endpoint if/when reliably available (tracked in §14) |
| Possible trademark sensitivity (FIFA/EA card style, GFG name) | Takedown risk | Keep clear "unofficial / fan-made, not affiliated" disclaimer; avoid using official logos or trademarked assets |
| Rate limiting on upstream APIs under heavy traffic | Failed generations at scale | Caching + this app's own rate limiting protect upstream from being hammered (see `SECURITY_AND_PRIVACY.md`) |

## 14. Open Questions

- Should users be able to choose a card theme/style, or should tier be the only visual variable?
- Is an exact easy/medium/hard breakdown (via a secondary endpoint) worth the added complexity and latency versus the current estimate?
- At what point does provider fallback need a 4th source, and is it worth building a config-driven provider list versus the current hardcoded chain?

## 15. Milestones

High-level only — see `TASKS.md` for the actual phase-by-phase build plan an agent should follow.

| Milestone | Scope |
|---|---|
| M1 — Prototype (done) | Single-file HTML app: username input, live fetch, card render, PNG download |
| M2 — Production rebuild | Full build per `TASKS.md` Phases 0–3: data layer, API route, UI, on the stack defined in `ARCHITECTURE.md` |
| M3 — Hardening | `TASKS.md` Phase 4: error handling, accessibility, performance pass |
| M4 — Launch | `TASKS.md` Phase 5: deployed per `DEPLOYMENT.md`, disclaimer finalized, smoke-tested in production |
| M5 — Post-launch | `TASKS.md` Phase 6: exact difficulty breakdown, OG image sharing, theme variants |
