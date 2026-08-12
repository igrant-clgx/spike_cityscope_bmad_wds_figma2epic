---
title: 'Story 1.2 — Design-system theme & tokens'
type: 'feature'
created: '2026-08-12'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: '4aaf36a28782ae4cf3c5532b80f04139914b8fb7'
final_revision: '012bb56cd25c4291dbae1fb4005ae861764b798a'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-1-1-greenfield-scaffold.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/DESIGN.md'
warnings: ['oversized']
---

<intent-contract>

## Intent

**Problem:** The scaffold renders with no brand identity. Every later component (header, accordion, buttons, cost figure, lead form) needs one authoritative MUI theme so the app looks like a trustworthy Cotality product and no feature invents ad-hoc colours, type sizes, or spacing.

**Approach:** Add MUI v9 (+ Emotion + Next App Router cache integration) and build a single theme in `src/theme/` that encodes the DESIGN.md brand delta as tokens — palette, typography ramp incl. a custom `cost-display` variant, shape radii, 8px spacing base + named layout tokens, and elevation shadows. Mount it at the app root via `ThemeProvider` + `CssBaseline`. Add a convention test proving no ad-hoc hex leaks outside the theme.

## Boundaries & Constraints

**Always:**
- Use MUI v9 (`@mui/material`), Emotion (`@emotion/react`, `@emotion/styled`), and the MUI Next.js App Router integration (`@mui/material-nextjs` `AppRouterCacheProvider`) so SSR styling is flicker-free. Roboto via `next/font/google`.
- Encode these EXACT token values from DESIGN.md (no drift):
  - Palette: header-bg `#2C2C2C`, canvas `#F5F5F5`, surface `#FFFFFF`, text `#333333`/`#666666`/`#999999`, primary `#0066CC`, primary-hover `#0052A3`, primary-active `#003D7A`, on-primary `#FFFFFF`, success `#28A745`, error `#DC3545`, warning `#FFC107`, info `#17A2B8`, border `#E0E0E0`, disabled `#CCCCCC`.
  - Typography (Roboto/Helvetica/Arial): h1 48/700/-0.5, h2 40/700/-0.3, h3 28/700, h4 22/600, h5 18/600, h6 16/600/0.5, body(1&2) 14/400/0.25, caption 12/400/0.4, button 14/500/0.4, and a custom `cost-display` 56px/700/lineHeight 1.2/-1px.
  - Shape radii: sm 4px, md 8px, full 9999px.
  - Spacing: 8px base; named layout tokens step-gap 24px, card-pad 24px, content-max 840px, header-h 68px — exposed on the theme so later stories read them (not magic numbers).
  - Elevation: accordion `0px 2px 4px rgba(0,0,0,0.08)`, result card `0px 4px 8px rgba(0,0,0,0.10)`, snackbar `0px 2px 8px rgba(0,0,0,0.15)`; no shadow above 0.15 opacity.
- Register the `cost-display` typography variant via TypeScript module augmentation (`TypographyVariants`, `TypographyVariantsOptions`, and `Typography` `variant` overrides) so `<Typography variant="cost-display">` typechecks and renders.
- Expose named layout tokens through a typed theme extension (augment MUI `Theme`/`ThemeOptions`) — e.g. `theme.layout.contentMax`, `headerH`, `stepGap`, `cardPad`.
- Mount the theme once at the app root (`app/layout.tsx`) wrapping children with `AppRouterCacheProvider` → `ThemeProvider` → `CssBaseline`. Keep the domain/server layers untouched (inward dependency rule still holds; theme is client/UI only).
- All hex colour literals live ONLY under `src/theme/**`. A convention test enforces this.

**Block If:**
- MUI v9 / `@mui/material-nextjs` cannot resolve compatible versions for Next 16 + React 19 on the public registry.

**Never:**
- Do NOT build the header, footer, shell layout, selection buttons, cards, snackbar, or any feature component — those are Stories 1.3–1.5 and Epics 2–5. This story delivers the theme + token plumbing + root application only.
- Do NOT restyle MUI components beyond what the tokens/theme options express (no bespoke `styled()` component library here).
- Do NOT introduce ad-hoc hex, px type sizes, or spacing outside the theme.
- Do NOT touch `src/server/**` or `src/shared/schemas/**`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Theme palette lookup | Read `theme.palette.primary.main` | Returns `#0066CC` (and hover/active map to `#0052A3`/`#003D7A`) | N/A |
| Custom cost-display variant | `theme.typography['cost-display']` | Defined with fontSize 56px, fontWeight 700, letterSpacing -1px | N/A |
| Named layout token | `theme.layout.contentMax` / `headerH` | `840`/`68` (or `"840px"`/`"68px"` consistently) | N/A |
| No ad-hoc hex | Scan `src/**` excluding `src/theme/**` | No `#rrggbb`/`#rgb` colour literals found | Convention test fails loudly if any found |

</intent-contract>

## Code Map

- `package.json` -- add `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/material-nextjs`; (continuity: Next 16 / React 19 / TS7 / vitest already present).
- `src/theme/tokens.ts` -- raw design tokens (the ONLY place hex/px literals live): colors, typography ramp, radii, spacing, layout, shadows.
- `src/theme/theme.ts` -- assembles the MUI theme from tokens (`createTheme`): palette, typography (+ `cost-display`), shape, spacing, and `layout` extension + shadow wiring.
- `src/theme/augmentation.d.ts` -- MUI module augmentation for the `cost-display` variant and the `theme.layout` tokens.
- `src/theme/index.ts` -- barrel export (`theme`, `tokens`).
- `src/theme/theme.test.ts` -- asserts token values are wired correctly (palette, cost-display, layout, shadow opacity).
- `src/theme/no-adhoc-hex.test.ts` -- convention test: scans `src/**` excluding `src/theme/**` for hex colour literals; fails if any exist.
- `app/layout.tsx` (modify) -- wrap children in `AppRouterCacheProvider` → `ThemeProvider theme={theme}` → `CssBaseline`; load Roboto via `next/font`.
- `app/page.tsx` (modify, minimal) -- render placeholder using themed `Typography` (e.g. one heading) to prove the theme is applied; no new layout/components.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- add MUI v9 + Emotion + `@mui/material-nextjs` deps (verify versions resolve) -- provides the theming stack.
- [x] `src/theme/tokens.ts` -- define all raw tokens with the EXACT DESIGN.md values -- single source; only file with hex/px literals.
- [x] `src/theme/augmentation.d.ts` -- augment MUI types for `cost-display` variant + `theme.layout` -- makes custom theme typecheck.
- [x] `src/theme/theme.ts` + `index.ts` -- build the MUI theme from tokens (palette, typography incl. cost-display, shape, spacing, layout, shadows) -- authoritative theme.
- [x] `app/layout.tsx` -- mount `AppRouterCacheProvider`→`ThemeProvider`→`CssBaseline`, load Roboto -- applies theme app-wide, flicker-free SSR.
- [x] `app/page.tsx` -- minimal edit to render a themed `Typography` -- proves the theme is live.
- [x] `src/theme/theme.test.ts` -- unit-test the wired token values -- covers the I/O matrix theme rows.
- [x] `src/theme/no-adhoc-hex.test.ts` -- convention test enforcing no ad-hoc hex outside `src/theme/**` -- satisfies the AC's lint/convention check (AD-11, NFR-4).

**Acceptance Criteria:**
- Given the app, when it renders at the root, then the MUI theme is applied via `ThemeProvider` + `CssBaseline` with Emotion App-Router cache (no SSR style flicker) and Roboto is the base font.
- Given the theme, when palette/typography/shape/spacing/shadow tokens are read, then every value equals the DESIGN.md spec exactly (verified by `theme.test.ts`).
- Given `<Typography variant="cost-display">…`, when the app is typechecked and rendered, then it compiles and applies 56px/700/-1px.
- Given the named layout tokens, when a consumer reads `theme.layout.contentMax`/`headerH`/`stepGap`/`cardPad`, then they return the DESIGN.md values.
- Given the source tree, when the convention test scans `src/**` outside `src/theme/**`, then it finds no ad-hoc hex colour literals (and fails if any are introduced later).
- Given the project, when `npm run typecheck`, `npm run lint`, `npm run build`, and `npm test` run, then all exit 0 and all tests pass.

## Design Notes

Keep the token→theme split clean: `tokens.ts` is dumb data (the only place literals live), `theme.ts` maps tokens into MUI's shape. This is what makes the "no ad-hoc hex" rule enforceable and keeps DESIGN.md ↔ code traceable.

Custom variant augmentation (shape illustration):
```ts
// augmentation.d.ts
declare module '@mui/material/styles' {
  interface TypographyVariants { 'cost-display': React.CSSProperties }
  interface TypographyVariantsOptions { 'cost-display'?: React.CSSProperties }
  interface Theme { layout: { contentMax: number; headerH: number; stepGap: number; cardPad: number } }
  interface ThemeOptions { layout?: Partial<Theme['layout']> }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides { 'cost-display': true }
}
```
This is a foundation story: prioritise exact tokens + clean theme wiring over any visual surface. No component library yet.

## Verification

**Commands:**
- `npm install` -- expected: MUI/Emotion resolve, exit 0.
- `npm run typecheck` -- expected: exit 0 (incl. cost-display variant + theme.layout augmentation).
- `npm run lint` -- expected: exit 0.
- `npm run build` -- expected: exit 0.
- `npm test` -- expected: theme + no-adhoc-hex + prior (envelope, money) tests all pass.
- `npm run start` + load `/` -- expected: page renders with Roboto + brand palette, no console errors, no SSR flash of unstyled content.

**Manual checks:**
- Inspect `src/theme/tokens.ts` values against DESIGN.md -- expected: exact match.
- Grep `src/` outside `src/theme/**` for `#[0-9a-fA-F]{3,6}` -- expected: none.

## Review Triage Log

Iteration 0 — Blind Hunter + Edge Case Hunter (parallel), orchestrator sets final severity.

**Patched (3):**
- `patch` — theme `fontFamily` used the literal `"Roboto"`, which does not reference the `next/font/google` self-hosted face (hashed family name on `--font-roboto`); Roboto would silently fall back to Helvetica/Arial. Fixed: `fontFamily: var(--font-roboto), "Roboto","Helvetica","Arial",sans-serif`.
- `patch` — `palette.primary.dark` was mapped to the active token (`#003D7A`); MUI uses `.dark` for the hover state. Remapped `.dark` → hover (`#0052A3`); the active token stays in `tokens.ts` for the selection-button pressed state (later stories). Test updated.
- `patch` — the no-ad-hoc-hex convention test scanned only `src/**`; UI colours in `app/**` (page/layout/providers) were unguarded. Extended the scan to include `app/`.

**Deferred (2):** convention test hex-only / no fs-error+symlink handling; `header-bg`/`disabled` palette slots not on the MUI theme (both recorded in `deferred-work.md`).

**Rejected:** radii sm/full "missing from theme" (MUI `shape.borderRadius` is single-valued; all three radii exported from `tokens.ts`); placeholder `page.tsx` `maxWidth="md"` (throwaway proof page, replaced by the real shell in Story 1.3); symlink recursion / shadow-array length assumptions (no symlinks in repo; MUI shadow scale is always length 25 and `.map` preserves it); non-hex colour formats in the convention test (AC is hex-specific).

## Auto Run Result

- Result: **done** — theme + token plumbing implemented, all gates green (typecheck/lint/build exit 0; 20 tests pass across 4 files), no ad-hoc hex outside `src/theme/**` (now enforced over `src/` and `app/`), server/domain layer still imports no UI.
- Stack: `@mui/material@^9.3.1`, `@mui/material-nextjs@^9.3.0` (`v16-appRouter` subpath, `enableCssLayer`), `@emotion/react@^11.14.0`, `@emotion/styled@^11.14.1`; Roboto via `next/font/google`.
- `followup_review_recommended: false` — foundation story, bounded scope, all reviewer findings resolved or consciously deferred.
