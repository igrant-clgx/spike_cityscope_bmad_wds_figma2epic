# Scenario 01 - Renovation Estimate Prototype Roadmap

## Prototype Contract

- Delivery: `DD-001 Renovation Estimate Visual Prototype`
- Test scenario: `TS-001 Renovation Estimate Visual Prototype`
- Source scenario: `C-UX-Scenarios/01-renovation-estimate/`
- Figma: [Spike Reno Calculator](https://www.figma.com/design/Q0fDj1AKMbwyPJRmPltox0/Spike-Reno-Calculator?node-id=0-1&p=f&m=dev)
- Status: Setup complete; scenario analysis pending

## Pages

1. `01.1 Address Search`
2. `01.2 Renovation Details`
3. `01.3 Estimate Result`

## Approved Approach

- Platform: React + TypeScript
- Component library: Ensemble where its semantics meet accessibility requirements
- Accessible fallback: Native combobox/listbox for the address selector when required
- Fidelity: Full Figma visual fidelity
- Responsive range: 320 CSS px through 1512 CSS px
- Test viewports: 320 px, 768 px, 1024 px, and 1512 px
- Language: English only
- State: One React context and reducer, held in memory only
- Data: Deterministic local fixture in `data/demo-data.json`
- Backend and network dependencies: None
- Package policy: Preserve the repository's existing registry configuration and surface installation failures as blockers

## Fixed Demonstration Path

1. Select `400 Catherine Street Lilyfield NSW 2040`.
2. Choose `Internal`.
3. View the fixed `Kitchen` renovation example.
4. Display `Internal Renovation: Kitchen`.
5. Display the estimate range `$32,700 - $40,000`.

## Required Interaction Decisions

- Unselected address text cannot advance.
- Advanced Search displays an inline unavailable notice.
- External is selectable but cannot progress.
- Step 2 and Step 3 remain visibly outside prototype scope.
- Calculation details display an unavailable notice.
- Edit Estimate retains the property and renovation selection.
- New Estimate retains the property and clears renovation/result state.
- Enter new address clears all flow state without confirmation.
- Direct routes are guarded against missing prerequisite state.

## Planned Workflow

1. Complete WDS scenario analysis and identify logical views.
2. Break the first view into implementation sections.
3. Create section stories just in time.
4. Scaffold the approved React + TypeScript + Ensemble environment without changing registry policy.
5. Build and approve each section in sequence.
6. Run `TS-001` and complete final prototype approval.

## Explicit Exclusions

- Production address lookup or advanced-search workflow
- Configurable Step 2 renovation options
- Step 3 questions or conditional logic
- Calculation engine or estimate API
- Expanded calculation methodology
- Authentication, analytics, persistence, backend, or deployment
- Unapproved production branding, contact, legal, or currency decisions
