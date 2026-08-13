# Story 01.1.1: Address Search - Application Foundation

**Page:** 01.1 Address Search  
**Section:** 1 of 6  
**Delivery:** DD-001  
**Complexity:** Complex  
**Estimated Time:** 90 minutes

---

## Goal

Create the minimal React + TypeScript + Ensemble application foundation that
all three prototype views can share. Establish typed deterministic data,
in-memory flow state, and route seams without implementing visible page content.

## Specifications

- `design-artifacts/E-Development/deliveries/DD-001-renovation-estimate-visual-prototype.yaml`
- `design-artifacts/E-Development/test-scenarios/TS-001-renovation-estimate-visual-prototype.yaml`
- `design-artifacts/E-Development/prototypes/01-renovation-estimate-prototype/PROTOTYPE-ROADMAP.md`
- `design-artifacts/E-Development/prototypes/01-renovation-estimate-prototype/work/Logical-View-Map.md`
- `design-artifacts/E-Development/prototypes/01-renovation-estimate-prototype/work/Address-Search-Work.yaml`
- `design-artifacts/C-UX-Scenarios/01-renovation-estimate/01-renovation-estimate.md`

## Scope

### Infrastructure to create

- React and TypeScript application scaffold
- Existing-registry-compatible package manifest and lockfile
- Ensemble package initialization
- Client-side router with the three approved routes
- Typed fixture module sourced from the approved fixed demo data
- One React context and reducer as the only flow-state owner
- Placeholder route components that expose semantic loading/setup content only
- Test harness for reducer transitions and route guards

### Visible Object IDs

None. Section 1 is application infrastructure. Page-specific Object IDs begin
in Section 2 and must not be implemented in this story.

## Approved Routes

| View | Route |
|------|-------|
| Address Search | `/renocalc/ceshllg/search` |
| Renovation Details | `/renocalc/ceshllg/search/details` |
| Estimate Result | `/renocalc/ceshllg/result` |

## Data Contract

```ts
interface SelectedProperty {
  id: string;
  displayAddress: string;
}

type RenovationType = "internal" | "external";

interface PrototypeRenovationSelection {
  renovationType: RenovationType | null;
  renovationItem: "Kitchen" | null;
}

interface PrototypeEstimate {
  description: string;
  minimumAmount: number;
  maximumAmount: number;
  currencyDisplay: string;
}

interface PrototypeFlowState {
  selectedProperty: SelectedProperty | null;
  renovationSelection: PrototypeRenovationSelection;
  estimate: PrototypeEstimate | null;
}
```

The fixture owns these approved values:

- Property ID: `prototype-property-400-catherine-st`
- Address: `400 Catherine Street Lilyfield NSW 2040`
- Renovation type: `internal`
- Renovation item: `Kitchen`
- Description: `Internal Renovation: Kitchen`
- Range: `$32,700 - $40,000`

## Reducer Contract

The reducer supports only:

- `SELECT_PROPERTY`
- `SELECT_INTERNAL`
- `SELECT_EXTERNAL`
- `SELECT_RENOVATION_ITEM`
- `CREATE_FIXED_ESTIMATE`
- `EDIT_ESTIMATE`
- `START_NEW_ESTIMATE`
- `RESET_ADDRESS`

Required behavior:

- `SELECT_PROPERTY` stores ID and display address and clears dependent state.
- `SELECT_INTERNAL` stores the supported Internal renovation type.
- `SELECT_EXTERNAL` stores the unsupported External type and clears downstream answers.
- `SELECT_RENOVATION_ITEM` stores the fixed Kitchen item after Internal is selected.
- `CREATE_FIXED_ESTIMATE` requires a selected property and Internal Kitchen selection.
- `EDIT_ESTIMATE` retains property and selection and clears no approved state.
- `START_NEW_ESTIMATE` retains property while clearing selection and estimate.
- `RESET_ADDRESS` returns the complete flow to its initial state.
- Invalid transitions fail explicitly in a typed, testable manner; they must not
  silently manufacture prerequisite state.

## Route-Guard Seams

- Details requires a selected property and redirects to Address Search when absent.
- Result requires the fixed estimate tied to current state.
- Missing result exposes a recovery path to Details rather than stale data.
- Full guard presentation is implemented with each owning view; this section
  establishes the reusable guard primitives and tests their decisions.

## Ensemble and Styling Setup

- Use the documented Ensemble React/web-component integration available from
  the repository's configured package source.
- Do not change `.npmrc`, registry settings, or package source policy.
- Do not add Tailwind; DD-001 supersedes the generic WDS prototype template.
- Do not invent design tokens in this infrastructure story.
- Native semantic elements remain permitted when Ensemble cannot expose the
  required accessibility API.

## Implementation Steps

1. Inspect the configured package source and available Ensemble package without
   changing registry configuration.
2. Create the smallest Vite React + TypeScript application supported by the
   available package setup.
3. Add the router and test dependencies required by DD-001 and TS-001.
4. Convert the deterministic JSON fixture into a typed runtime module or
   validated import with no network access.
5. Implement the flow types, initial state, action union, reducer, and provider.
6. Implement route-guard decision helpers and placeholder route components.
7. Add focused reducer and guard tests.
8. Record any registry, package, or Ensemble incompatibility as an explicit
   blocker; do not switch registries or silently replace Ensemble.

## Acceptance Criteria

### Agent-Verifiable

| # | Criterion | Expected | Verification |
|---|-----------|----------|--------------|
| 1 | Package policy | Existing registry configuration remains unchanged | Compare repository config before/after |
| 2 | Build | TypeScript application builds without errors | Run the existing build script |
| 3 | Routes | All three approved URLs resolve in the application router | Router tests |
| 4 | State owner | One context/reducer owns all prototype flow state | Source inspection and tests |
| 5 | Transitions | All eight approved actions produce the documented state | Reducer tests |
| 6 | Invalid transition | Estimate creation without prerequisites fails explicitly | Reducer test |
| 7 | Persistence | No localStorage, sessionStorage, backend, or network usage | Source search |
| 8 | Fixture | Fixed values exactly match `demo-data.json` | Fixture test |
| 9 | Route guards | Missing Details property and Result estimate return approved recovery decisions | Guard tests |
| 10 | Runtime | Local application starts with no console error | Browser smoke test |

### User-Evaluable

- [ ] The application foundation follows the approved React + TypeScript + Ensemble contract.
- [ ] No production-calculator architecture has been introduced.
- [ ] The setup remains intentionally small and understandable for a visual prototype.
- [ ] Registry and dependency decisions follow the user's explicit package policy.

## How to Test

1. Run the targeted unit tests for reducer transitions, fixtures, and route guards.
2. Run TypeScript/build validation through the package scripts.
3. Start the local development server.
4. Open each approved route in browser automation.
5. Confirm each route mounts without unhandled errors.
6. Confirm direct Details and Result entry exercise their guard seams.
7. Search source for prohibited persistence and network APIs.
8. Stop the development server after verification.

## Known Risks

### Package installation blocked by configured registry

**Symptom:** React, Vite, test, or Ensemble packages return authorization or
availability errors.  
**Handling:** Stop dependency setup and report the exact package and registry
failure. Do not change registry configuration.

### Ensemble package or React integration differs from the delivery assumption

**Symptom:** The documented Ensemble package cannot be installed or initialized
in this repository.  
**Handling:** Record the incompatibility as a blocker for user decision. Do not
silently substitute another design system.

## Design Notes

- This story intentionally produces no Figma-faithful page content.
- Later sections own all typography, color, spacing, image, and component fidelity.
- Placeholder route content must remain semantic and minimal so it cannot be
  mistaken for an approved design.

## Next Section

After approval: `Address-Search.2-shared-header-and-disclaimer-footer.md`

## Status Tracking

**Status:** Complete
**Started:** 2026-08-13
**Completed:** 2026-08-13
**Approved By:** User
**Notes:** React contract replaces generic HTML/Tailwind WDS examples. The
configured Artifactory registry returned `E403 Forbidden` for
`npm view react version`; registry configuration was not changed. Local
validation used cached React tooling and the existing local
`@ensemble/lib@6.1.9` installation.

## Implementation Summary

- Added the React and TypeScript application shell for all three approved routes.
- Added the typed deterministic fixture adapter and the single context/reducer state owner.
- Added explicit route guards and the six approved state transitions.
- Added focused fixture, reducer, transition, and route-guard coverage.
- Preserved the repository registry configuration while using the available local dependency cache.
- Actual implementation time was not tracked.

## Changes from Original Plan

- The WDS story template's HTML/Tailwind/session-storage examples are not used
  because DD-001 explicitly requires React + TypeScript + Ensemble and in-memory state.

## Active Blocker

Clean dependency resolution cannot proceed through the repository's configured
npm source:

```text
npm error code E403
npm error 403 403 Forbidden - GET https://artifactory.solutions.corelogic.com/artifactory/api/npm/npm-google-oss-public/react
```

Per the approved package policy, no registry setting was changed. The local
foundation was completed using cached open-source packages and the existing
local Ensemble installation. A clean install on another machine remains blocked
until access to the configured Artifactory repository is restored.

## Verification Results

- 3 test files passed.
- 9 focused fixture, reducer, transition, and route-guard tests passed.
- TypeScript validation passed.
- Vite production build passed.
- Address Search, Details, and Result route shells respond from the local server.
- Ensemble styles and button module bundle successfully from `@ensemble/lib@6.1.9`.
