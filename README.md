# GFGFUT

Turn a GeeksforGeeks profile into an Ultimate Team–style player card.

> Fan-made / unofficial. Not affiliated with GeeksforGeeks or EA Sports. Card ratings are a for-fun heuristic derived from public profile stats, not an official skill assessment.

## What it does

Enter a GFG username → the app fetches that user's public coding stats → maps them to a FIFA-style rating (Pace, Shooting, Passing, Dribbling, Defending, Physical) and an overall rating → renders a downloadable player card, complete with a tier foil (Bronze/Silver/Gold/Icon) and a streak meter.

## Docs

Start with `AGENTS.md` if you're an agent picking up work on this repo — it maps out the rest of these docs in reading order.

| Doc | Covers |
|---|---|
| `PRD.md` | What this is, scope, goals/non-goals, risks |
| `ARCHITECTURE.md` | Tech stack, system design, folder structure |
| `API_SPEC.md` | Internal API contract, normalized data shapes |
| `DESIGN_SYSTEM.md` | Design tokens, card component contract |
| `TASKS.md` | Ordered build plan |
| `TESTING.md` | Testing strategy and coverage requirements |
| `DEPLOYMENT.md` | Hosting, environments, deploy checklist |
| `SECURITY_AND_PRIVACY.md` | Data handling, threat model |
| `CODING_STANDARDS.md` | Language/style/structure conventions |

## Local Development

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev         # local dev server
npm run build        # production build
npm run lint          # eslint
npm run typecheck  # tsc --noEmit
npm run test          # unit + integration tests (vitest)
npm run test:e2e   # end-to-end tests (playwright)
```

## Status

Prototype (`gfgfut.html`) validated the concept end-to-end. This repo is the production rebuild per `ARCHITECTURE.md` — see `TASKS.md` for current build phase.
