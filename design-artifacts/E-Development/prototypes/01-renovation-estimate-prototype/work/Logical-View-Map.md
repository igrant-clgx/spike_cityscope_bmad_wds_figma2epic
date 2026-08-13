# Scenario 01 - Logical View Map

## Scenario

- Name: Renovation Estimate
- Delivery: `DD-001`
- Test scenario: `TS-001`
- Prototype roadmap: `../PROTOTYPE-ROADMAP.md`
- Mapping status: Confirmed

## View Mapping

| Build Order | Logical View | Scenario Step | Route | Purpose |
|-------------|--------------|---------------|-------|---------|
| 1 | Address Search | 01.1 Address Search | `/renocalc/ceshllg/search` | Select the fixed property and begin the prototype flow |
| 2 | Renovation Details | 01.2 Renovation Details | `/renocalc/ceshllg/search/details` | Select the fixed renovation type and create the example estimate |
| 3 | Estimate Result | 01.3 Estimate Result | `/renocalc/ceshllg/result` | Present the fixed estimate and support edit, restart, reset, explanation, and contact actions |

Each scenario step is a distinct logical view. The specifications do not define inherited layouts, overlays, or alternate states that warrant combining these steps into one view.

## View 1 - Address Search

**Specification:** `../../../../C-UX-Scenarios/01-renovation-estimate/pages/01.1-address-search/01.1-address-search.md`

### Included states

- Default empty search
- Typed query with the fixed suggestion available
- Keyboard or pointer active suggestion
- Selected property and navigation
- Required-address validation
- Unselected-free-text validation
- Advanced Search unavailable notice

### Flow responsibility

- Owns the public entry route.
- Dispatches `SELECT_PROPERTY` only after the fixed suggestion is selected.
- Clears stale selection when the input no longer matches the selected property.
- Navigates to Renovation Details after valid selection.

## View 2 - Renovation Details

**Specification:** `../../../../C-UX-Scenarios/01-renovation-estimate/pages/01.2-renovation-details/01.2-renovation-details.md`

### Included states

- Step 1 expanded with no renovation type selected
- Internal selected with `View example estimate` available
- External selected with a prototype-unavailable explanation
- Locked Step 2 and Step 3 with fixed-prototype messaging
- Edit Estimate with retained property and selection
- New Estimate with retained property and cleared selection/result
- Missing-property route guard

### Flow responsibility

- Requires `SelectedProperty`.
- Dispatches `SELECT_INTERNAL` for the supported path.
- Dispatches `CREATE_FIXED_ESTIMATE` once per valid activation.
- Dispatches `RESET_ADDRESS` for Enter new address.
- Navigates to Estimate Result only after the fixed estimate exists.

## View 3 - Estimate Result

**Specification:** `../../../../C-UX-Scenarios/01-renovation-estimate/pages/01.3-estimate-result/01.3-estimate-result.md`

### Included states

- Fixed result summary
- Calculation explanation collapsed
- Calculation explanation expanded with unavailable notice
- Edit Estimate transition
- New Estimate transition
- Enter new address transition
- Missing-result recovery

### Flow responsibility

- Requires a selected property and fixed prototype estimate.
- Dispatches `EDIT_ESTIMATE` while retaining property and selection.
- Dispatches `START_NEW_ESTIMATE` while retaining the property.
- Dispatches `RESET_ADDRESS` to clear all prototype flow state.
- Preserves normalized `tel:` links from the page specification.

## Shared Shell and State

The three views reuse shared implementation elements without becoming one logical view:

- Dual-brand header
- Selected-address context
- Disclaimer content
- Responsive page container and spacing primitives
- Ensemble components and tokens where accessible
- Native accessible controls where Ensemble semantics are insufficient
- One React context and reducer as the sole state owner
- One deterministic fixture loaded from `../data/demo-data.json`

## Confirmed Build Order

1. Build Address Search first as the keyboard-operable entry vertical slice.
2. Build Renovation Details and connect the selected-property guard.
3. Build Estimate Result and connect result recovery and reset/edit transitions.
4. Integrate responsive, accessibility, and cross-view acceptance coverage.

## Deferred Content

The logical view map does not introduce separate views for:

- Advanced Search
- Expanded Step 2
- Expanded Step 3
- Calculation methodology

Those areas remain unavailable states inside their owning logical views until approved specifications exist.
