---
title: 'Story 1.3 — Branded shell (header, responsive layout, footer disclaimer)'
type: 'feature'
created: '2026-08-12'
status: 'done'
review_loop_iteration: 0
followup_review_recommended: false
baseline_revision: 'adfbdff6757e9740238ab187573fa25c47b23692'
final_revision: 'bb4f51eaf9b847d3ea7143db32207af36416b7de'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-1-2-design-system-theme.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/DESIGN.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-spike_cityscope_bmad_wds_figma2epic-2026-08-12/EXPERIENCE.md'
warnings: []
---

<intent-contract>

## Intent

**Problem:** The app now has a theme but no chrome. A homeowner must land on a trustworthy, on-brand page — a branded header, a calm centred column, and a constant legal disclaimer — before they'll start. (FR-1, FR-2, FR-3, UX-DR5, UX-DR17, UX-DR21 baseline)

**Approach:** Build a presentational shell — `Header`, `Footer`, and an `AppShell` wrapper — assembled from themed MUI components and mounted once in `app/layout.tsx` so every route inherits it. The header is the charcoal brand bar; the main region is a centred `contentMax` (840px) column that reflows without horizontal scroll; the footer carries the indicative-only disclaimer in the established humble voice.

## Boundaries & Constraints

**Always:**
- Read ALL brand values from the theme (`theme.palette`, `theme.layout`, `theme.typography`) — NO ad-hoc hex/px. The `no-adhoc-hex` convention test (from Story 1.2, now covering `src/` and `app/`) must stay green.
- Header: full-width MUI `AppBar` at `theme.palette` charcoal (`header-bg` via a themed sx callback reading the token), `theme.layout.headerH` (68px) tall on desktop, product logo left (~125px width) and Demo Channel partner logo right (~128px width). Visible at ALL breakpoints (FR-1, UX-DR5). No logo image assets exist yet → render accessible text brand-marks sized to those widths with `aria-label`s; leave a clear seam for real `<img>`/SVG assets later.
- Main content: a centred single column constrained to `theme.layout.contentMax` (840px) on desktop, with generous side margins that reduce on tablet and go full-width on mobile — one column at every breakpoint, no horizontal scroll (FR-3, UX-DR21 baseline). Use MUI `Container`/`Box` with theme breakpoints.
- Footer: legal disclaimer rendered on EVERY view (`{typography.caption}`, `text.secondary`) — indicative only, not financial advice, not a loan offer (FR-2). Honest, constant, low-pressure microcopy (UX-DR17).
- Semantic HTML landmarks: `<header>`, `<main>`, `<footer>` (via MUI `component=` props) for a11y; the disclaimer is real text, not an image.
- Keep the shell presentational and reusable so Epics 2–5 render their flow INTO `AppShell`'s main slot.

**Block If:**
- (none expected)

**Never:**
- Do NOT build the accordion stepper, address block, selection buttons, result card, contact section, or lead form — those are Epics 2–5 / later Epic-1 stories.
- Do NOT add feedback/motion/a11y primitives (spinners, snackbars, focus utilities) — that is Story 1.4.
- Do NOT wire analytics — that is Story 1.5.
- Do NOT introduce ad-hoc hex/px, multi-column layouts, or a second brand hue.
- Do NOT touch `src/server/**` or `src/shared/schemas/**`.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Load any route | GET `/` | Charcoal header (68px desktop, logos L/R), centred ≤840px main, disclaimer footer all render | N/A |
| Desktop ≥1200px | wide viewport | Column centred at 840px with side margins; no horizontal scroll | N/A |
| Tablet 768–1199px | mid viewport | Same single column, reduced margins; no horizontal scroll | N/A |
| Mobile ≤767px | narrow viewport | Full-width column; header logos + disclaimer still visible; no horizontal scroll | N/A |
| Long page content | tall children | Footer disclaimer still present (not fixed-overlapping); sticky-footer layout keeps it at/after content | N/A |
| A11y landmarks | any render | Exactly one `<header>`, one `<main>`, one `<footer>`; logos have accessible names | N/A |

</intent-contract>

## Code Map

- `src/components/shell/Header.tsx` -- themed MUI `AppBar` (charcoal, headerH tall) with left product brand-mark (~125px) + right Demo Channel brand-mark (~128px); `component="header"`; accessible names.
- `src/components/shell/Footer.tsx` -- `component="footer"` region rendering the constant legal disclaimer (caption type, secondary text, humble voice).
- `src/components/shell/AppShell.tsx` -- composes Header + a centred `contentMax` main `Container`(`component="main"`) + Footer using a sticky-footer flex column (min-height 100dvh) so the footer sits after content on short pages.
- `src/components/shell/index.ts` -- barrel export.
- `src/components/shell/copy.ts` -- shell microcopy constants (product name, partner name, disclaimer text) — single place for voice, no literals scattered.
- `src/components/shell/AppShell.test.tsx` -- render test via `renderToStaticMarkup` (from `react-dom/server`, already a dep — NO jsdom/RTL added): wrap `<ThemeProvider theme={theme}><AppShell>…marker…</AppShell></ThemeProvider>`, assert the HTML string contains `<header`, `<main`, `<footer`, both brand-mark accessible names, the disclaimer text, and the child marker inside main.
- `app/layout.tsx` (modify) -- wrap `{children}` in `<AppShell>` inside `<Providers>` so every route gets the shell.
- `app/page.tsx` (modify) -- drop the ad-hoc `Container`; render just the themed placeholder content (shell now owns the layout container).

## Tasks & Acceptance

**Execution:**
- [x] `src/components/shell/copy.ts` -- shell microcopy constants (product/partner names, disclaimer) -- centralises voice per UX-DR17.
- [x] `src/components/shell/Header.tsx` -- charcoal `AppBar`, headerH tall, logos L/R with accessible names, all breakpoints -- FR-1, UX-DR5.
- [x] `src/components/shell/Footer.tsx` -- constant disclaimer footer, caption/secondary, honest voice -- FR-2, UX-DR17.
- [x] `src/components/shell/AppShell.tsx` + `index.ts` -- sticky-footer flex column with centred ≤840px main container -- FR-3, UX-DR21 baseline.
- [x] `app/layout.tsx` -- mount `<AppShell>` around children inside `<Providers>` -- shell on every view.
- [x] `app/page.tsx` -- remove local container; render placeholder content into the shell's main slot -- avoids double container.
- [x] `src/components/shell/AppShell.test.tsx` -- `renderToStaticMarkup` structural test (landmarks, accessible names, disclaimer, child marker); NO new test tooling -- covers the I/O matrix a11y rows.

**Acceptance Criteria:**
- Given the themed app, when any route loads, then a full-width charcoal header (68px desktop) shows the product logo left (~125px) and the Demo Channel logo right (~128px), visible at all breakpoints (FR-1, UX-DR5).
- Given any viewport (desktop/tablet/mobile), when the page renders, then content sits in a centred single column ≤840px on desktop that reflows without horizontal scroll (FR-3, UX-DR21 baseline).
- Given any view (form or Results), when it renders, then the legal disclaimer footer is present (FR-2).
- Given the shell, when its microcopy is read, then it follows the humble, honest, low-pressure voice (UX-DR17).
- Given the source tree, when the no-adhoc-hex convention test runs, then it stays green (no ad-hoc hex introduced).
- Given the project, when `npm run typecheck`, `npm run lint`, `npm run build`, and `npm test` run, then all exit 0 and all tests pass.

## Design Notes

Logo assets don't exist yet (the UX `imports/` folder is empty). Render accessible **text** brand-marks now, boxed to the ~125px/~128px widths, with a clear TODO seam so real SVG/PNG logos drop in without touching layout. This keeps the spike honest (no fabricated binary assets) while satisfying the "logo left/right, visible at all breakpoints" AC structurally.

Sticky-footer pattern: `AppShell` is a `flex column` with `minHeight: 100dvh`; `main` gets `flexGrow: 1`. This guarantees the disclaimer stays visible after content on short pages without `position: fixed` overlapping content on tall pages.

Charcoal header colour: `header-bg` (#2C2C2C) lives in `tokens.ts` but isn't a standard MUI palette slot. Read it via `sx={{ bgcolor: (t) => tokens.colors.headerBg }}` — importing the token keeps the literal inside `src/theme/**` (convention test stays green) while the component stays declarative. (This is the header-bg wiring the Story 1.2 review deferred.)

Keep components presentational (no client-only hooks needed) so they can render in the RSC tree; MUI's own components carry their `'use client'` where required.

## Verification

**Commands:**
- `npm run typecheck` -- exit 0.
- `npm run lint` -- exit 0.
- `npm run build` -- exit 0.
- `npm test` -- shell render test + no-adhoc-hex + theme + prior tests all pass.
- `npm run start` + load `/` at desktop/tablet/mobile widths -- header (charcoal, logos L/R), centred ≤840px column, disclaimer footer; no horizontal scroll at any width.

**Manual checks:**
- Inspect DOM -- expected: one `<header>`, one `<main>`, one `<footer>`; both brand-marks have accessible names; disclaimer is real text.
- Resize to ≤767px -- expected: single full-width column, logos + disclaimer visible, no horizontal scrollbar.

## Review Triage Log

Iteration 0 — Blind Hunter + Edge Case Hunter (parallel), orchestrator sets final severity.

**Patched (1):**
- `patch` — header brand-marks used fixed `width: 125/128` with `noWrap`; at very narrow/zoomed viewports this could force horizontal scroll (against FR-3 "no horizontal scroll at all breakpoints"). Added `minWidth: 0, flexShrink: 1` so both marks shrink gracefully. Standard mobile widths already fit; this hardens the extreme case.

**Rejected:** "child route renders its own `<main>`" (Edge Case Hunter) — no current defect: the only route (`app/page.tsx`) renders a fragment and the shell owns the single `<main>`; a future-route convention concern, not this diff. Blind Hunter found nothing substantive.

## Auto Run Result

- Result: **done** — branded shell (charcoal `AppBar` header with L/R text brand-marks boxed to ~125/128px, centred ≤840px `main` column, constant disclaimer footer, sticky-footer flex) mounted on every route. Semantic `<header>/<main>/<footer>` landmarks; humble/honest voice in `copy.ts`.
- Gates: typecheck/lint/build exit 0; **24 tests pass** (5 files); no ad-hoc hex outside `src/theme/**` (convention test covers `src/` and `app/`); server/domain layer imports no UI.
- Tooling: added `vitest.config.ts` (alias resolution only, no new deps); shell test uses `renderToStaticMarkup` (no jsdom/RTL).
- Also resolved a Story 1.2 deferred item: `header-bg` token is now wired into the header via `tokens.colors.headerBg`.
- `followup_review_recommended: false` — bounded presentational story, all findings resolved or consciously rejected.
