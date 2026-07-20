# API Spec — GFGFUT

Covers the app's own internal API (the BFF layer). This is the contract the frontend codes against — it should never need to know about upstream provider quirks.

## `GET /api/profile/{username}`

Fetches, normalizes, and rates a GFG profile.

### Path Parameters

| Param | Type | Required | Notes |
|---|---|---|---|
| `username` | string | yes | GFG username. Alphanumeric + `_`/`-`/`.`, 1–64 chars. Reject/400 anything else before it ever reaches a provider. |

### Success Response — `200 OK`

```json
{
  "username": "arnoob16",
  "displayName": "arnoob16",
  "institution": "SRM Institute of Science and Technology",
  "profilePicture": "https://media.geeksforgeeks.org/img-practice/user_web-1598433228.svg",
  "raw": {
    "codingScore": 224,
    "totalProblemsSolved": 95,
    "currentStreak": 0,
    "maxStreak": 929,
    "instituteRank": 415
  },
  "card": {
    "ovr": 78,
    "tier": "silver",
    "attributes": {
      "pace": 68,
      "shooting": 65,
      "passing": 71,
      "dribbling": 74,
      "defending": 62,
      "physical": 79
    },
    "streak": {
      "current": 0,
      "max": 929,
      "percent": 0
    }
  },
  "meta": {
    "provider": "gfgStatsTashifProvider",
    "cached": false,
    "fetchedAt": "2026-07-20T10:15:00.000Z"
  }
}
```

### Error Responses

| Status | Body | When |
|---|---|---|
| `400` | `{ "error": "invalid_username", "message": "..." }` | Username fails format validation before any network call |
| `404` | `{ "error": "profile_not_found", "message": "..." }` | All providers agree the username doesn't exist |
| `502` | `{ "error": "upstream_unavailable", "message": "..." }` | All providers in the chain failed (timeout, 5xx, malformed response) |
| `429` | `{ "error": "rate_limited", "message": "...", "retryAfterSeconds": 30 }` | This app's own rate limit on `/api/profile/*` was hit (see `SECURITY_AND_PRIVACY.md`) |

All error bodies follow the same shape: `{ error: string (machine-readable code), message: string (human-readable) }`. The frontend should key its UI off `error`, and only show `message` as the display text (never build custom copy per code unless there's a specific UX reason to).

## Normalized Profile Shape (internal type)

This is what `lib/normalize.ts` produces from **any** provider's raw response, so the rest of the app is provider-agnostic:

```ts
interface NormalizedGfgProfile {
  username: string;
  displayName: string;
  institution: string | null;
  profilePicture: string | null;
  codingScore: number;
  totalProblemsSolved: number;
  currentStreak: number;
  maxStreak: number;
  instituteRank: number | null;
}
```

Each provider adapter (`lib/providers/*.ts`) is responsible for mapping its own field names (e.g. `institute` vs `institution`, string-typed numbers vs actual numbers) into this shape. See `ARCHITECTURE.md` §4 for the provider chain.

## Card Model (computed, not fetched)

Produced by `lib/rating.ts` from a `NormalizedGfgProfile`. Pure function, fully unit-testable, no I/O:

```ts
function computeCardModel(profile: NormalizedGfgProfile): CardModel
```

See `PRD.md` §10 for the current rating heuristic (subject to change — when it changes, bump a `ratingVersion` field in the response so cached/shared cards can be understood in context later).

## Rate Limiting (this app's own)

- `/api/profile/*` limited per-IP: suggested starting point **20 requests / minute**, configurable via env var. See `SECURITY_AND_PRIVACY.md`.
- Cache hits should not count against this limit as heavily (or at all) since they don't hit upstream — implementation detail for the rate limiter.
