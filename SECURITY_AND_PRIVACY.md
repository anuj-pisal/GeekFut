# Security & Privacy — GFGFUT

## 1. Data Handled

- The only user input is a GFG username (public identifier, not PII in itself).
- The app fetches and displays data that is **already public** on the person's GFG profile (coding score, problems solved, streaks, institute, institute rank, profile picture).
- **Nothing is stored beyond a short-lived cache** (see `ARCHITECTURE.md`/`DEPLOYMENT.md`, TTL ~10 min). No database, no user accounts, no logs of who looked up whom beyond standard hosting-provider access logs.
- No cookies, no tracking/analytics beyond what's explicitly added later and documented here first.

## 2. Threat Model (what this app actually needs to defend against)

| Concern | Mitigation |
|---|---|
| Someone hammers `/api/profile/*` to abuse this app as a free proxy to the unofficial upstream APIs | Per-IP rate limiting (`RATE_LIMIT_PER_MINUTE`), see `API_SPEC.md` `429` response |
| Malformed/malicious `username` input (injection attempts, oversized strings) | Strict input validation (alphanumeric + `_`/`-`/`.`, length cap) before any provider call or rendering |
| Upstream provider returns unexpected/malformed JSON | Defensive parsing in each provider adapter — never trust upstream shape blindly, fail closed into the fallback chain rather than crashing |
| Reflected content from upstream (e.g. a malicious "institution" string) rendered unescaped | React escapes by default; explicitly avoid `dangerouslySetInnerHTML` anywhere near provider data |
| Trademark/brand risk (FIFA/EA card styling, GFG name) | Clear, persistent "unofficial / fan-made, not affiliated" disclaimer; no official logos or wordmarks used on the card itself |

## 3. What This App Deliberately Does NOT Need

- No authentication/authorization system — there are no user accounts or private data.
- No encryption-at-rest requirements — nothing is persisted beyond an in-memory TTL cache.
- No GDPR/data-subject-request tooling — no personal data is collected or stored by this app (it only displays data the profile owner already made public on GFG).

If a future version adds accounts, saved cards, or a leaderboard, **this section must be revisited** — that would introduce actual data storage and change this analysis.

## 4. Dependency Hygiene

- Keep dependencies minimal (this app doesn't need a large framework surface).
- Run `npm audit` (or equivalent) as part of CI; don't ship with known-critical vulnerabilities unaddressed.
- Pin dependency versions; review changelogs before major-version bumps, especially for Next.js.

## 5. Responsible Use of Third-Party Data

- Only public profile data is fetched — no attempt to access authenticated or private GFG data.
- Respect reasonable request volume toward the unofficial upstream APIs (this is why caching and rate limiting exist — they protect the upstream providers as much as this app).
- If any upstream provider asks for reduced load or removal, comply immediately and fall back to the remaining providers in the chain.
