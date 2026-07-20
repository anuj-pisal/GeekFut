# Deployment — GFGFUT

## 1. Hosting

Vercel, deploying directly from the Git repository's default branch (`main`). Next.js on Vercel needs no custom server config for this app's scope.

## 2. Environments

| Environment | Trigger | URL pattern |
|---|---|---|
| Preview | every PR | Vercel auto-generated preview URL per PR |
| Production | merge to `main` | primary domain |

## 3. Environment Variables

| Var | Required | Purpose |
|---|---|---|
| `RATE_LIMIT_PER_MINUTE` | no (defaults to 20) | requests/min per IP to `/api/profile/*`, see `SECURITY_AND_PRIVACY.md` |
| `CACHE_TTL_SECONDS` | no (defaults to 600) | how long a normalized profile is cached before re-fetching |
| `KV_*` (if/when Vercel KV is adopted) | only once cache moves off in-memory | Vercel KV connection, auto-populated by Vercel when the integration is added |

No secrets are required for v1 — all data providers are public, unauthenticated endpoints. If a future provider requires an API key, add it here and document it before merging that provider.

## 4. Pre-deploy Checklist

- [ ] All CI gates green (see `TESTING.md` §5)
- [ ] Manually smoke-tested on the preview URL, not just localhost
- [ ] Provider fallback chain re-verified against live upstream APIs (not just mocks) — upstream services can and do change
- [ ] Footer disclaimer ("unofficial / fan-made, not affiliated with GeeksforGeeks or EA Sports") present and visible
- [ ] `robots.txt` / meta tags reviewed if the page should or shouldn't be indexed for launch

## 5. Rollback

Vercel keeps prior deployments — rollback is "promote a previous deployment" from the Vercel dashboard, no separate rollback tooling needed for this project's scale.

## 6. Monitoring (minimum viable for v1)

- Vercel's built-in request/error logs are sufficient at launch traffic levels.
- Watch the `meta.provider` field in API responses over time — if the primary provider stops being the one that succeeds most often, that's a signal upstream has degraded and the chain order or provider set needs revisiting.
- No dedicated APM/observability tool required for v1; revisit if traffic or incident frequency justifies it.

## 7. Domain & Branding Note

Whatever domain this ships on, keep the "unofficial/fan-made" disclaimer prominent — this reduces both user confusion and trademark risk (see `SECURITY_AND_PRIVACY.md`).
