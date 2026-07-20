# Design System — GFGFUT

Formalizes the visual language already validated in the HTML prototype (`gfgfut.html`), as design tokens an agent can implement consistently in Tailwind config + components.

## 1. Brand Intent

FIFA Ultimate Team card conventions (foil tiers, OVR block, attribute grid) as the base language, with one GFG-specific signature element: a **streak meter** (current vs. best) built into the card, since daily streaks are GFG's own differentiator. The surrounding site chrome (outside the card itself) uses a plainer, grid-paper, editorial look — not another FIFA pastiche — so the card itself stays the visual hero.

Always disclose: fan-made / unofficial, not affiliated with GeeksforGeeks or EA Sports. This belongs in the footer of every page, not just buried in a docs file.

## 2. Color Tokens

### Site chrome
| Token | Hex | Use |
|---|---|---|
| `--paper` | `#eef1e8` | page background |
| `--paper-dim` | `#dde2d4` | secondary surfaces |
| `--ink` | `#0b1410` | primary text, borders |
| `--line` | `#c7cdbc` | grid lines, hairline rules |
| `--gfg-green` | `#2f8d46` | accent / links / active states |
| `--gfg-green-dark` | `#18572c` | hover states, emphasis |

### Card tiers (foil gradients)
| Tier | OVR range | Gradient |
|---|---|---|
| Bronze | 40–64 | `#a9713f → #7a4a24 → #5a3417` |
| Silver | 65–79 | `#e7ebee → #a9b3ba → #767f85` |
| Gold | 80–89 | `#f7dd8f → #d9a53a → #a5721b` |
| Icon | 90+ | `#173a24 → #0c1f14 → #04120a` (GFG green-black, not a generic special-card look) |

## 3. Typography

| Role | Face | Use |
|---|---|---|
| Display / numerals | Oswald (600–700) | OVR number, attribute values, headings — condensed, sporty |
| Body / UI | Archivo (400–600) | form labels, card sub-text, footer |

Type scale: keep it tight and utilitarian (this isn't an editorial site) — headline ~32–52px clamp, card OVR ~40px, attribute values ~17px, card labels ~9–12px uppercase with letter-spacing.

## 4. The Card — Component Contract

`<PlayerCard model={CardModel} />` renders:

- OVR block (top-left): rating number, position label (`DSA`), tier badge
- Avatar (top-right): circular, profile picture or initials fallback
- Name + institution (centered)
- 2×3 attribute grid: Pace / Defending / Shooting / Physical / Passing / Dribbling — value + label pairs
- Streak meter (bottom): current vs. max streak, horizontal bar filled to `current/max` percent

Card aspect ratio: fixed at **5:7** (portrait), clipped with the FUT-style hexagonal-top silhouette (`clip-path: polygon(...)` — see prototype for exact points). This shape is part of the brand and should not vary by tier.

## 5. States & Feedback

- **Loading:** status text changes to "Fetching profile…"; generate button disabled until resolved.
- **Error:** inline status message in red-brown (`#a3341c`), specific to the error code from `API_SPEC.md` (invalid username vs. not found vs. upstream down should read differently to the user).
- **Success:** status message in `--gfg-green-dark`; "Download PNG" button becomes visible.
- **Empty state:** dashed-border placeholder box with instructional copy, not a blank void.

## 6. Accessibility

- All interactive elements keyboard-reachable, visible focus ring (don't rely on browser default alone — style it in `--gfg-green`).
- Color is never the only signal for tier — the tier badge text label (`Bronze`/`Silver`/`Gold`/`Icon`) must always be present, not just conveyed by gradient.
- Respect `prefers-reduced-motion` for any card entrance animation.
- Sufficient contrast between card text and its tier background at every tier (verify Silver and Gold especially — light backgrounds with light-ish text is the main risk).

## 7. What NOT to do

- Don't turn the site chrome around the card into another FIFA pastiche — the card is the one bold visual moment, everything else stays quiet (grid-paper editorial look).
- Don't add numbered-step markers or timeline devices to the form flow — it's a single-step action (enter username → get card), not a sequence worth narrating.
- Don't use official FIFA/EA or GeeksforGeeks logos/wordmarks on the card — the disclaimer covers style-inspiration, not trademark use.
