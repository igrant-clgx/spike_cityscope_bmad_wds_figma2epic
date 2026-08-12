---
baseline_commit: 9de8a34d468e2e7f86b5f56e98ba345c15e7ef4f
---

# Story 1.1: Project Scaffold & Shared Shell

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want the React project scaffolded with the approved stack and shared shell components (Header, Footer, flow-state context),
so that subsequent pages (Address Entry, Questionnaire, Estimate Report) can be built consistently on a working, Figma-accurate foundation.

## Acceptance Criteria

1. **Given** no project exists yet, **when** the project is scaffolded, **then** a Vite + React 18 + TypeScript project is created with `@mui/material`, `@emotion/react`, `@emotion/styled`, and `react-router-dom` installed. [Source: ARCHITECTURE-SPINE.md#Stack]
2. **Given** the scaffolded project, **when** inspected, **then** the source tree matches the Architecture Spine's Structural Seed exactly: `src/pages/`, `src/components/`, `src/context/`, `src/data/`, `src/App.tsx`. [Source: ARCHITECTURE-SPINE.md#Structural Seed]
3. **Given** the scaffolded project, **when** `EstimateFlowContext` is implemented, **then** it exposes a single shared state object `{ address, renovationType, whatToRenovate, sizeSqm, qualityTier }` with setters, and is mounted above the router in `App.tsx` so all pages share one instance (AD-1). No page may hold this data in local component state. [Source: ARCHITECTURE-SPINE.md#AD-1]
4. **Given** the scaffolded project, **when** the shared `Header` component (`src/components/Header.tsx`) is implemented, **then** it renders with Cannon Black `#1E1405` background, fixed height 68.98px, a Cotality logo image-link (125.39 × 32.98px, `<a href="https://www.cotality.com/">`, opens in new tab) and a static partner logo image (128.56 × 44.98px, non-interactive), 12px padding. [Source: 1.1-address-entry.md#Section: Header]
5. **Given** the scaffolded project, **when** the shared `Footer` component (`src/components/Footer.tsx`) is implemented, **then** it renders with Cannon Black `#1E1405` background, fixed height ~81.44-81.45px, and the exact 3-line legal disclaimer text verbatim from the WDS spec. [Source: 1.1-address-entry.md#Section: Footer]
6. **Given** the shared shell components exist, **when** viewed on mobile and desktop breakpoints, **then** layout is mobile-first responsive, scaling to a 1128px max content width on desktop (NFR2), and Poppins + Source Sans Pro typefaces are loaded (e.g. via `@fontsource` packages or a `<link>` import) and available at the exact px sizes documented per page. [Source: epics.md#NFR2, UX-DR13]
7. **Given** the project, **when** MUI theme setup is done, **then** a shared MUI theme (`src/theme.ts`) centralizes the color tokens (Cannon Black `#1E1405`, Jacarta `#432A6E`, rgba(17,11,28, alpha) text colors) and typography scale so pages consume tokens rather than hardcoding hex/rgba values inline. [Source: ARCHITECTURE-SPINE.md#AD-2, epics.md#UX-DR13]
8. **Given** the project, **when** `App.tsx` is implemented, **then** it sets up `react-router-dom` with 3 routes (`/`, `/questionnaire`, `/estimate`) as placeholders (actual page components arrive in Stories 1.2, 2.1, 3.1), wrapped by the `EstimateFlowContext` provider. [Source: ARCHITECTURE-SPINE.md#Structural Seed]
9. **Given** the project, **when** static data folders are created, **then** empty/stub `src/data/mockAddresses.ts` and `src/data/mockEstimates.ts` files exist (to be populated by later stories) — no live API calls anywhere in the codebase (NFR3, AD-3). [Source: ARCHITECTURE-SPINE.md#AD-3]

## Tasks / Subtasks

- [x] Task 1: Scaffold Vite + React + TypeScript project (AC: #1, #2)
  - [x] Run `npm create vite@latest` with the `react-ts` template to get current stable versions (registry access was unavailable during story creation — verify/pin exact versions at scaffold time)
  - [x] Install `@mui/material @emotion/react @emotion/styled react-router-dom`
  - [x] Create folder structure: `src/pages/`, `src/components/`, `src/context/`, `src/data/`
- [x] Task 2: Implement shared MUI theme (AC: #7)
  - [x] Create `src/theme.ts` with palette tokens (Cannon Black `#1E1405`, Jacarta `#432A6E`) and typography scale (Poppins, Source Sans Pro families)
  - [x] Wrap `App.tsx` in MUI `ThemeProvider`
- [x] Task 3: Implement `EstimateFlowContext` (AC: #3)
  - [x] Create `src/context/EstimateFlowContext.tsx` with state shape `{ address, renovationType, whatToRenovate, sizeSqm, qualityTier }` + setters + a `resetFlow()` function (needed later by Story 3.2's "New Estimate")
  - [x] Mount the provider above the router in `App.tsx`
- [x] Task 4: Implement shared `Header` component (AC: #4)
  - [x] Build `src/components/Header.tsx` per exact spec (background, height, logo link, partner logo, padding)
- [x] Task 5: Implement shared `Footer` component (AC: #5)
  - [x] Build `src/components/Footer.tsx` per exact spec (background, height, disclaimer text)
- [x] Task 6: Load typefaces and verify responsive scaffold (AC: #6)
  - [x] Add Poppins + Source Sans Pro (via `@fontsource/poppins`, `@fontsource/source-sans-pro`, or equivalent) and reference in theme.ts
  - [x] Verify Header/Footer render correctly at mobile and 1128px-desktop widths
- [x] Task 7: Set up router with placeholder routes (AC: #8)
  - [x] Configure `react-router-dom` routes `/`, `/questionnaire`, `/estimate` in `App.tsx`, each rendering a temporary placeholder (to be replaced by Stories 1.2, 2.1, 3.1)
- [x] Task 8: Create static data stub files (AC: #9)
  - [x] Create empty/stub `src/data/mockAddresses.ts` and `src/data/mockEstimates.ts` with exported empty arrays/objects and a comment noting they'll be populated in later stories

## Dev Notes

- **This is the FIRST story in the project — no existing code to read/preserve.** There is no previous story and no git history to mine for patterns; you are establishing the conventions every later story will follow. Get the shared shell right — Stories 1.2, 2.1, 3.1 all depend on `Header`, `Footer`, `EstimateFlowContext`, and `theme.ts` being correct and stable.
- **Architecture paradigm (AD's from ARCHITECTURE-SPINE.md):**
  - AD-1: All flow-state answers live in ONE `EstimateFlowContext` — never per-page `useState` for address/questionnaire answers. Only ephemeral UI state (e.g., "is this accordion open") may be local to a component.
  - AD-2: All UI primitives built on MUI — do not hand-roll buttons, inputs, or accordions from raw HTML/CSS.
  - AD-3: No backend/API calls anywhere — all data from local static modules under `src/data/`.
  - AD-4 (Consistency Convention): PascalCase components, camelCase context values, kebab-case data files.
- **100% Figma parity is this project's #1 objective (NFR1).** Every px value, color hex, and font size in the ACs above is taken directly from the WDS Figma-extracted specs — do not approximate or round. Use the shared `theme.ts` so this precision is centralized, not duplicated across pages.
- **Anticipate future stories' needs:** Story 3.2 ("New Estimate" button) will need a way to clear all flow state — build a `resetFlow()` function into the context now so Story 3.2 doesn't need to modify this file later.
- **Do not build the actual Address Entry, Questionnaire, or Estimate Report page content in this story** — routes should render simple placeholders; the real page implementations are Stories 1.2, 2.1, and 3.1 respectively. Building ahead here would violate the "no forward dependency" rule and risk duplicating/conflicting work.

### Project Structure Notes

- Source tree must exactly match: `src/pages/`, `src/components/`, `src/context/`, `src/data/`, `src/App.tsx` — per ARCHITECTURE-SPINE.md Structural Seed. No deviation (e.g., no `src/features/` or `src/modules/` — this is a small 3-page spike, not a large app).
- No conflicts detected — this is a greenfield scaffold with no existing code.

### References

- [Source: _bmad-output/planning-artifacts/architecture/architecture-spike_cityscope_bmad_wds_figma2epic-2026-08-12/ARCHITECTURE-SPINE.md#Design Paradigm, #Invariants & Rules (AD-1 through AD-4), #Stack, #Structural Seed]
- [Source: _bmad-output/C-UX-Scenarios/01-hannahs-renovation-estimate/1.1-address-entry/1.1-address-entry.md#Section: Header, #Section: Footer, #Typography, #Spacing]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 1: Address Entry & Project Foundation, #Story 1.1, #NFR1-NFR4, #UX-DR1, UX-DR2, UX-DR13]

## Latest Technical Information

- **Registry access unavailable during story creation** (corporate Artifactory proxy returned 403 for npm/vite/react/@mui packages, npmjs.com direct fetch also blocked). **Dev agent action required:** run `npm create vite@latest` and `npm install` at implementation time to get current stable versions — do not hardcode version numbers from training data, as they may be outdated. Verify React 18.x (or current stable major), Vite 6.x+, TypeScript 5.x+, MUI 5.x/6.x compatibility with each other before proceeding.
- MUI v6+ requires `@emotion/react` and `@emotion/styled` as peer dependencies — include both explicitly.

## Dev Agent Record

### Agent Model Used

Claude Sonnet 5 (GitHub Copilot CLI)

### Debug Log References

- Initial `npm create vite@latest` scaffold attempt in the pipeline-test workspace root failed with E403 (corporate Artifactory proxy blocked `create-vite`, `react`, and all standard registries). Story was HALTED and user was consulted.
- User manually initiated the project (`npm create vite@latest wds-cityscope-spike -- --template react-ts` equivalent) at `wds-cityscope-spike/` outside this session — confirmed npm install works from that project directory once initiated (registry access succeeded for `@mui/material`, `@emotion/react`, `@emotion/styled`, `react-router-dom`, `@fontsource/poppins`, `@fontsource/source-sans-pro`).
- `npm run build` initially failed: Vite 8.2.1 ships on the new `rolldown-vite` engine which requires a native `@rolldown/binding-win32-x64-msvc` optional dependency that failed to install/resolve (npm optional-deps bug, see npm/cli#4828). Registry access for that native binding package also returned 403.
- **Resolution:** Downgraded `vite` to `6.4.3` and `@vitejs/plugin-react` to `4.7.0` (last stable Rollup-based Vite 6.x line, no native binding dependency). Build and dev server both verified working after downgrade.
- ESLint initially flagged `react-refresh/only-export-components` on `EstimateFlowContext.tsx` (hook + provider co-located in one file, a standard/intentional React context pattern) — resolved with a scoped `eslint-disable-next-line` comment rather than restructuring into extra files (out of scope for this story).
- Verified with `npm run build` (production build succeeds), `npm run lint` (clean, 0 problems), and `npm run dev` + `Invoke-WebRequest` smoke test confirming all 3 routes (`/`, `/questionnaire`, `/estimate`) return HTTP 200.

### Completion Notes List

- Project scaffolded at `wds-cityscope-spike/` (manually initiated by user due to a corporate Artifactory registry block on `npm create vite@latest` from the original workspace root; the pre-existing scaffold's own `npm install` calls succeeded, confirming the block was specific to that initial bootstrap command/location).
- Pinned `vite@6.4.3` / `@vitejs/plugin-react@4.7.0` instead of the newly-released `vite@8.x` line due to a native-binding optional-dependency failure with the rolldown-based Vite 8 engine in this environment — documented above; this is a deliberate, verified deviation from "latest" per the story's own guidance to resolve versions live rather than trust training data.
- Implemented `src/theme.ts` centralizing Cannon Black (`#1E1405`), Jacarta (`#432A6E`), and text rgba tokens, plus a Poppins/Source Sans Pro typography scale matching the exact px/line-height/letter-spacing values from the WDS spec (AC7).
- Implemented `src/context/EstimateFlowContext.tsx` exposing `{ address, renovationType, whatToRenovate, sizeSqm, qualityTier }` + setters + `resetFlow()`, mounted above `BrowserRouter` in `App.tsx` (AC3, AD-1 compliant).
- Implemented `Header.tsx` (Cannon Black bg, 68.98px fixed height, 12px padding, Cotality logo link 125.39×32.98px opening cotality.com in a new tab, static partner logo 128.56×44.98px) and `Footer.tsx` (Cannon Black bg, 81.45px min-height, verbatim 3-sentence disclaimer text) per AC4/AC5.
- Added `@fontsource/poppins` and `@fontsource/source-sans-pro`, imported in `App.tsx`; `#root` constrained to 1128px max-width via `index.css` per NFR2/AC6.
- Wired `App.tsx` with `react-router-dom` routes `/`, `/questionnaire`, `/estimate`, each rendering a placeholder page component (`AddressEntryPage`, `QuestionnairePage`, `EstimateReportPage`) — no real page content built, per the story's explicit scope guard (AC8).
- Created stub `src/data/mockAddresses.ts` and `src/data/mockEstimates.ts` with typed empty arrays and comments noting which future story populates them (AC9, AD-3 no-live-API compliance).
- **Flagged gap:** Actual Cotality/partner brand logo image assets do not exist yet (WDS Phase 6 asset-generation scope, out of this story). Added lightweight placeholder SVGs (`public/logo-cotality.svg`, `public/logo-partner.svg`) sized exactly to spec (125.39×32.98px, 128.56×44.98px) so the Header renders correctly and layout/sizing can be validated now; swap-in of real brand assets is a follow-up, not a blocker for this story's ACs (which specify size/behavior, not asset content).
- Validation: `npm run build` succeeds, `npm run lint` reports 0 problems, `npm run dev` serves all 3 routes with HTTP 200 (manually verified via `Invoke-WebRequest`). No automated test framework (e.g. Vitest/Jest) is configured in this greenfield scaffold yet — this story's scope (per its Tasks) did not include setting one up; noting as a gap for a future story/task if automated component tests are desired.

### File List

- `wds-cityscope-spike/package.json` (modified — dependencies added, vite/plugin-react pinned to stable versions)
- `wds-cityscope-spike/package-lock.json` (modified)
- `wds-cityscope-spike/index.html` (modified — title updated)
- `wds-cityscope-spike/src/App.tsx` (modified — replaced Vite demo content with ThemeProvider/EstimateFlowProvider/Router shell)
- `wds-cityscope-spike/src/main.tsx` (unchanged)
- `wds-cityscope-spike/src/index.css` (modified — replaced Vite demo styles with minimal reset + 1128px max-width constraint)
- `wds-cityscope-spike/src/App.css` (deleted — unused Vite demo styles)
- `wds-cityscope-spike/src/assets/` (deleted — unused Vite demo assets)
- `wds-cityscope-spike/src/theme.ts` (created)
- `wds-cityscope-spike/src/context/EstimateFlowContext.tsx` (created)
- `wds-cityscope-spike/src/components/Header.tsx` (created)
- `wds-cityscope-spike/src/components/Footer.tsx` (created)
- `wds-cityscope-spike/src/pages/AddressEntryPage.tsx` (created)
- `wds-cityscope-spike/src/pages/QuestionnairePage.tsx` (created)
- `wds-cityscope-spike/src/pages/EstimateReportPage.tsx` (created)
- `wds-cityscope-spike/src/data/mockAddresses.ts` (created)
- `wds-cityscope-spike/src/data/mockEstimates.ts` (created)
- `wds-cityscope-spike/public/logo-cotality.svg` (created — placeholder brand asset)
- `wds-cityscope-spike/public/logo-partner.svg` (created — placeholder brand asset)

### Change Log

- 2026-08-12: Story implementation complete. Scaffold, shared theme, EstimateFlowContext, Header, Footer, router, and data stubs all implemented and verified (build/lint/dev-server smoke test pass). Status set to "review".
