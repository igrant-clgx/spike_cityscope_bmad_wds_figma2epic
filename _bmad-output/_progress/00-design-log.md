# WDS Design Log

## Current
- Phase 1 (Product Brief) started on branch `ig-figma-to-bmad-ux`.
- Context: prior BMad Method spike already produced a PRD, UX designs, and a fully
  built Reno Calculator implementation (on `planning/epics-and-stories`). Key finding:
  the pipeline never visually ingested the Figma, so the build drifted from the design.
  This WDS run aims to establish the Figma-first UX foundation properly.

## Backlog
- (none yet)

## Decisions
- (pending Phase 1)

---
## 2026-08-13 — Phase 1 Product Brief (Simplified) COMPLETE

- Ran WDS Phase 1 in **simplified** mode. Owner unavailable at authoring time, so the brief
  was **derived from existing authoritative artifacts** (prior `product-brief.md`, `prd.md`,
  UX `EXPERIENCE.md` on `planning/epics-and-stories`) + the live Figma (node 9:90) — not a
  fresh interview. Every claim is source-cited. **Pending owner confirmation.**
- Output: `_bmad-output/A-Product-Brief/project-brief.md`.

### Decisions
- brief_level = simplified (justified: a full PRD + built product already exist; a lightweight
  brief that captures scope/challenge/goals/constraints is sufficient to re-anchor the WDS run).
- This run's differentiating goal: **Figma-first fidelity** — pixels are source of truth, prose
  is annotation, verification diffs the running app against the design (addresses the spike's
  key finding that the Figma was never visually ingested).

### Next
- Owner to confirm/adjust the brief.
- Then Phase 2: Trigger Mapping (`bmad-wds-trigger-mapping`) — recommend running in a fresh context.

---
## 2026-08-13 — Phase 2 Trigger Mapping COMPLETE (documentation synthesis)

- Took the **documentation-synthesis** path (existing docs available), deriving the Trigger Map
  from `product-brief.md`, `prd.md`, `EXPERIENCE.md`, and the Figma. Owner unavailable, so all
  personas/drivers are **source-cited and pending user validation**.
- Outputs:
  - `_bmad-output/B-Trigger-Map/trigger-map.md` (poster: vision, 4 objectives, 3 prioritized
    target groups, mermaid, design focus, cross-group patterns/tensions)
  - `_bmad-output/B-Trigger-Map/personas/` — 02 Priya (primary ⭐), 03 Marcus (secondary), 04 Coach (tertiary)
  - `_bmad-output/B-Trigger-Map/feature-impact-analysis.md` (WDS scoring, max 11; Must-Have set)

### Decisions
- Primary design target = **Priya** (Renovating Homeowner); central tension resolved as
  "trust before ask" — coach CTA is an offer after value, never a gate.
- Top Must-Haves: credible range card + disclaimer, Steps 1–2, address entry, WCAG AA,
  **Figma-faithful fidelity**, honest voice, "how calculated" explainer.

### Next
- Owner to validate personas/drivers with real users.
- Phase 3: Outline Scenarios (`bmad-wds-outline-scenarios`) — run in a fresh context.

---
## 2026-08-13 — Phase 3 Outline Scenarios COMPLETE (documentation synthesis)

- Mapped the existing named-protagonist journeys (`EXPERIENCE.md § Key Flows`, UJ-1/2/3) into
  WDS scenario outlines. Owner unavailable — source-cited, pending confirmation.
- Outputs in `_bmad-output/C-UX-Scenarios/`:
  - `00-ux-scenarios.md` — index + coverage matrix (all IA surfaces assigned)
  - `01-priya-honest-number/` — primary sunshine path (address → Steps 1-3 → range → coach CTA)
  - `02-priya-edit-estimate/` — Edit Estimate (state preserved)
  - `03-marcus-compare-properties/` — New Estimate / repeat-use (OI-7 flagged)

### Decisions
- Single-page/two-state product modeled as sunshine-path "steps", not routes.
- Coach journey (UJ-3) has no UI — captured as Scenario 01's *Business Success*, not a page-bearing scenario.

### Next
- Owner to confirm scenarios.
- Phase 4: UX Design / Conceptual Specs — **Figma-grounded** (pull real frames via Figma MCP; pixels are source of truth). Run in a fresh context.

---
## 2026-08-13 — Phase 4 UX Design: FIGMA INGESTED + first page spec (the crux)

- **Resolved the spike's root cause.** The `imports/` folder was empty in the prior run — the Figma
  was never visually ingested. This phase pulled the **real Figma** via MCP (`get_metadata` +
  `get_design_context`) on frame `9:2`/page `9:90` and recorded exact pixels/tokens.
- Outputs in `_bmad-output/C-UX-Scenarios/`:
  - `_figma-imports/figma-9-2-desktop-1512w.png` — the real frame render (ingested).
  - `_figma-imports/figma-design-observations.md` — **exact** layout/color/type/token ledger + a
    Pixels-vs-Doc **Conflicts** table.
  - `01-priya-honest-number/01-calculator-form.md` — Figma-grounded page specification for the
    primary scenario's form surface (all values sourced from pixels).

### Key fidelity findings (pixels win over the handover doc the build followed)
- Primary/accent: **#432A6E violet (Jacarta)** — NOT #0066CC blue.
- Headings: **Poppins**; body/labels/buttons: **Source Sans Pro** — NOT Roboto.
- Text: **Ebony 80% (#110B1C @ 80%)**. Paper radius **16px**, button radius **4px**. Buttons title-case.
- Layout: 840px centered content column (336px margins @1512w), header 68.98px, footer 81.45px,
  ~16px inter-card gap, 7.98px button gap.

### Decisions
- Recorded exact tokens as source of truth; recommend remapping `src/theme/tokens.ts` (Poppins +
  Source Sans Pro, primary #432A6E, text Ebony 80%, paper radius 16px) and re-verifying the running
  app against `figma-9-2-desktop-1512w.png`.

### New Open Items
- OI-F1 exact header/canvas hexes + logo treatment; OI-F2 selection-button selected state;
  OI-F3 Poppins/Source Sans Pro licensing.

### Next
- Owner to confirm the observations ledger + page spec.
- Remaining Phase 4: specs for scenarios 02/03 surfaces + result/estimate surface; then Design
  Delivery ([H]) / conceptual-specs packaging. Recommend applying the token remap to close the
  fidelity loop.

---
## 2026-08-13 — Phase 4 Handover [H]: DD-001 packaged + fidelity VERIFIED IN CODE

- Ran the WDS Phase 4 **Handover** activity. Packaged Scenario 01's form surface into a formal
  **Design Delivery**: `_bmad-output/deliveries/DD-001-reno-calculator-form.yaml`.
- **Closed the spike's fidelity loop end-to-end.** Applied the Figma-grounded token remap to the
  built app on branch `planning/epics-and-stories` (commit **beb7d31**) and verified it:
  - primary → #432A6E violet; fonts → Poppins (display) + Source Sans Pro (body/UI);
    text → Ebony #110B1C; canvas → #EDF1F3; paper radius → 16px; button radius → 4px;
    accordion shadow → exact Figma value.
  - Gates: typecheck, lint, **528 tests**, build all green.
  - Visual: app screenshot at 1512w converges with `figma-9-2-desktop-1512w.png`
    (`files/built-form-v3-figma-remap.png`).

### Decisions
- DD-001 records the full **Figma-spec → code-token mapping** as the canonical handoff, so the
  build's fidelity is traceable to specific Figma variables.
- Remaining app work is content/state (OI-2/7/8, STATE-ADDRESS) + open visual items
  (OI-F1/F2/F3), not core theming.

### Next
- Owner to confirm DD-001 + the open items.
- Optional: specs for scenarios 02/03 + the result/estimate surface; then Phase 5 (agentic dev)
  to resolve the remaining content/state questions.

---
## 2026-08-13 — Open-item reconciliation against the built implementation

- Rather than fabricate answers under the autonomous pattern, reconciled DD-001's open items
  against the authoritative implementation (`planning/epics-and-stories`). Resolved by code:
  - **OI-7** (address change keep-vs-reset): first-set = record only; changing a confirmed address
    resets scope + shows `ADDRESS_CHANGED_RESET_NOTICE` (FR-9/Story 2.5); re-confirming the same
    address is not a change. Source: `EstimateFlow.tsx`, `address/copy.ts`.
  - **OI-8** (progression): ordered type→items→details; exactly-one-expanded (UX-DR7); a step is
    complete once its scope slot holds a meaningful answer. Source: `step-state.ts`.
  - **STATE-ADDRESS**: default entry state is EMPTY (`address === null`) — the built empty prompt is
    intended; the Figma pre-fill is an illustrative filled state. Source: `AddressSection.tsx`.
- Kept OPEN (genuine Product placeholders, flagged as such **in the code itself**): **OI-1** (Step 2
  item set) and **OI-2** (Step 3 questions), plus visual **OI-F1/F2/F3** and **R3** (algorithm).

### Outcome
- The spike's Figma-first thread is complete: ingested → spec'd → remapped in code (verified) →
  packaged (DD-001) → open items reconciled. Only true Product content decisions (OI-1/OI-2) and a
  few visual confirmations remain — all correctly owner-gated, not fabricated.

---
## 2026-08-13 — Owner decisions recorded (sign-off)

- Owner reviewed and decided:
  1. **Merge** both PRs (#1 design artifacts, #2 build + fidelity fixes).
  2. **Step 2/3 content** (OI-1 items, OI-2 questions): **leave as-is** — placeholders stand for the spike.
  3. **Visual items approved** (OI-F1 header/canvas hex + branding, OI-F2 selected-button state,
     OI-F3 Poppins/Source Sans Pro licensing): all agreed and approved.
- DD-001 open_questions updated: OI-F1/F2/F3 → APPROVED; OI-1/OI-2 → ACCEPTED_AS_IS.
- Only R3 (cost algorithm, out of UX scope) remains open.

### Outcome
The Figma-first spike is signed off. No remaining UX/theming decisions.
