# Coding Standards — GFGFUT

## 1. Language & Types

- TypeScript in strict mode. No `any` without a comment explaining why it's unavoidable at that spot.
- Shared types (`NormalizedGfgProfile`, `CardModel`, provider interfaces) live in `lib/` and are imported, never redefined per-file.

## 2. Structure

- Pure logic (`normalize.ts`, `rating.ts`, provider adapters) stays free of React/Next imports — these must be unit-testable in isolation, per `TESTING.md`.
- Components stay presentational where possible; data-fetching lives in `app/page.tsx` or route handlers, not scattered inside deeply nested components.
- One component per file, named export matching the filename.

## 3. Formatting & Linting

- Prettier for formatting (no manual style debates) — default config unless a specific reason to deviate is documented here.
- ESLint with the Next.js recommended config + `@typescript-eslint`. CI blocks on lint errors (warnings are acceptable to merge but should be cleaned up opportunistically).

## 4. Naming

- Files: `camelCase.ts` for logic, `PascalCase.tsx` for components.
- Provider adapters named after their source: `tashif.ts`, `napiyo.ts`, `arnoob.ts` — matches `ARCHITECTURE.md` §4 so there's no ambiguity about which file backs which upstream.

## 5. Error Handling

- Never let a provider adapter throw an unhandled exception into the route handler — catch and return a typed failure so `providerChain.ts` can try the next provider.
- API route responses always match the shapes in `API_SPEC.md` — no ad-hoc error shapes introduced at the last minute.
- Client-side: every `fetch` to `/api/profile/*` has explicit loading/error/success handling — no silent failures.

## 6. Comments

- Comment *why*, not *what* — especially in `rating.ts`, where the "why this formula" is the valuable context (ties back to `PRD.md` §10's heuristic reasoning), not a restatement of the arithmetic.
- Any place code diverges from what a spec doc says: add a comment linking to the doc and explain the divergence, and update the doc in the same PR.

## 7. Commits & PRs

- Small, reviewable PRs mapped to `TASKS.md` items where possible — one task, one PR, where the task is naturally sized that way.
- Commit messages: imperative mood, short summary line (`Add provider fallback chain`, not `Added` or `Adding`).
- PR description references the relevant doc(s) it implements or changes.

## 8. Docs-Code Drift

If implementation reveals a spec doc is wrong or outdated, the doc gets updated in the same change — these docs are meant to stay authoritative for an agent picking up work later, not to be a point-in-time snapshot that quietly goes stale.
