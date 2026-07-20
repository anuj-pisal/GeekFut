# Architecture — GFGFUT

> **Assumption stated up front:** this document scopes GFGFUT as a production Next.js app rather than the static prototype HTML file, because "production level" implies server-side reliability (caching, fallback across unofficial APIs, rate-limit protection) that a pure client-side page can't do well. If you want to stay client-only/static instead, say so and this doc gets much shorter.

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router, TypeScript) | Single deployable for frontend + a thin backend (API routes), good on Vercel free tier |
| Styling | Tailwind CSS | Fast to build the card's tier-based styling variants, easy design tokens |
| Hosting | Vercel | Zero-config Next.js hosting, edge caching, free tier is enough for v1 |
| Cache | Vercel KV (Redis-compatible) — or in-memory Map with TTL for v1 if KV is overkill | Protects the unofficial upstream APIs from being hammered per-request |
| Image export | `html2canvas` (client-side) for v1; consider `@vercel/og`/`satori` (server-side) for v1.1 if OG-image sharing previews are wanted | Client-side is simplest to ship first |
| Testing | Vitest (unit) + Playwright (e2e) | Standard, fast, works well with Next.js |
| Lint/Format | ESLint + Prettier | Consistency for an agent-driven codebase |

## 2. High-level Flow

```
Browser
  │  1. user submits GFG username
  ▼
Next.js Client Component (form)
  │  2. fetch("/api/profile/{username}")
  ▼
Next.js API Route (Backend-for-Frontend)
  │  3. check cache (TTL ~10 min) → hit? return cached normalized JSON
  │  4. miss → call Provider Chain (see below)
  │  5. normalize response → compute card model (ratings/attributes)
  │  6. store in cache → return normalized JSON
  ▼
Browser renders <PlayerCard model={...} />
  │  7. user clicks "Download PNG"
  ▼
html2canvas renders the DOM card node → PNG blob → download
```

## 3. Why a Backend-for-Frontend (BFF) Layer

The prototype called the unofficial GFG stats API directly from the browser. For production this moves server-side because:

- **Resilience:** a provider fallback chain (try API A, then B, then C) is much easier to implement and reason about server-side.
- **Caching:** avoids re-hitting the upstream API on every page view of the same username; protects against being rate-limited or blocked.
- **CORS/stability:** the app isn't dependent on the upstream API's CORS headers staying permissive.
- **Secrets/config:** if a provider ever requires an API key, it stays server-side.

## 4. Provider Chain (Data Sources)

Ordered list, tried in sequence until one succeeds. Defined in `lib/providers/`:

1. `gfgStatsTashifProvider` — primary
2. `gfgStatsNapiyoProvider` — fallback 1
3. `gfgStatsArnoobProvider` — fallback 2

Each provider implements a shared interface:

```ts
interface GfgProvider {
  name: string;
  fetchProfile(username: string): Promise<RawGfgProfile>;
}
```

Normalization happens in one place (`lib/normalize.ts`) so the rest of the app never deals with provider-specific field names (see `DATA_MODEL.md`... actually consolidated into API_SPEC.md — see that file's "Normalized Profile Shape").

## 5. Folder Structure

```
gfgfut/
├─ app/
│  ├─ page.tsx                 # main page: input + card stage
│  ├─ api/
│  │  └─ profile/[username]/route.ts   # BFF endpoint
│  └─ layout.tsx
├─ components/
│  ├─ UsernameForm.tsx
│  ├─ PlayerCard.tsx
│  ├─ CardStage.tsx
│  └─ DownloadButton.tsx
├─ lib/
│  ├─ providers/
│  │  ├─ types.ts
│  │  ├─ tashif.ts
│  │  ├─ napiyo.ts
│  │  └─ arnoob.ts
│  ├─ providerChain.ts
│  ├─ normalize.ts
│  ├─ rating.ts               # card-model / attribute calculation (pure functions, unit-testable)
│  └─ cache.ts
├─ tests/
│  ├─ unit/
│  └─ e2e/
├─ public/
├─ PRD.md
├─ ARCHITECTURE.md
├─ API_SPEC.md
├─ DESIGN_SYSTEM.md
├─ TASKS.md
├─ TESTING.md
├─ DEPLOYMENT.md
├─ SECURITY_AND_PRIVACY.md
├─ CODING_STANDARDS.md
├─ AGENTS.md
└─ README.md
```

## 6. Key Design Decisions & Trade-offs

- **Server-side rating calculation** (not client-side): keeps the heuristic in one testable, versionable place (`lib/rating.ts`), and means the API response already includes computed attributes — the client just renders.
- **In-memory cache acceptable for v1**, Vercel KV recommended once traffic justifies it (avoids cold-start cache loss between serverless invocations).
- **No database in v1** — nothing is persisted; every request is stateless. A database only becomes relevant if a "saved cards" or "leaderboard" feature is added later (explicitly out of scope per `PRD.md`).
