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
