# AGENTS.md — Operating Instructions for Coding Agents

This file is for whatever agent (Antigravity or otherwise) is building or maintaining this repo. Read this first, then the doc it points you to for the task at hand.

## Doc Map — read in this order for a fresh build

1. `PRD.md` — what this is and why, scope boundaries (goals vs. non-goals)
2. `ARCHITECTURE.md` — tech stack and system design
3. `API_SPEC.md` — the exact contract for the internal API and data shapes
4. `DESIGN_SYSTEM.md` — visual tokens and component contracts
5. `TASKS.md` — the ordered build plan; work through it phase by phase
6. `TESTING.md` — what must be tested and how, before anything is considered done
7. `SECURITY_AND_PRIVACY.md` / `DEPLOYMENT.md` / `CODING_STANDARDS.md` — read before Phase 4/5 of `TASKS.md`, not required to internalize before writing the first line of code

## Ground Rules

- **Don't expand scope beyond `PRD.md` §4 (Non-Goals)** without flagging it first. No accounts, no card marketplace, no mobile app, no manual stat editing — these are explicitly out for v1.
- **Follow `TASKS.md` phase order.** Don't build UI (Phase 3) before the data layer (Phase 1) has tests passing — the rating logic and provider fallback are the riskiest parts of this project and should be solid before anything is wired to a screen.
- **Treat the provider fallback chain as the single highest-risk piece of this codebase.** It depends on unofficial, unaffiliated third-party APIs that can change or disappear without notice (see `PRD.md` Risks, `ARCHITECTURE.md` §4). Never remove the fallback chain in favor of a single hardcoded provider "to simplify," even temporarily.
- **Keep docs and code in sync.** If you implement something that contradicts a spec doc, update the doc in the same change (see `CODING_STANDARDS.md` §8). A future agent (or human) picking this up should be able to trust these docs without cross-checking every claim against the code.
- **When a doc is ambiguous or silent on something you need to decide**, make the smallest reasonable decision, note it inline as a comment or in `PRD.md` §14 Open Questions, and move on — don't block on it.

## Definition of Done

Matches `TASKS.md`'s per-phase Definition of Done: tests pass, lint/typecheck pass, no console errors on the happy path, implementation matches (or updates) the relevant spec doc.

## What Success Looks Like

A user can land on the page, type a real GFG username, get a card in a few seconds, and download it — and if the unofficial upstream API of the day is having a bad time, the app degrades to a clear error message rather than hanging or crashing. That resilience under upstream failure is the actual bar for "production level" here, more than any individual feature.
