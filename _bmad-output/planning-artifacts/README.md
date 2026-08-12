# Planning Artifacts — Spike Reno Calculator

**Prepared by:** Sally 🎨 (UX Designer, BMad Method) for Igrant
**Date:** 2026-08-12
**Phase:** BMAD Planning — inputs assembled from WDS analysis (Saga) and handover (Freya)

This folder holds the **requirements inputs** that feed the BMad Method planning phase. They translate the upstream WDS/Figma analysis and the development handover package (both in the project root) into BMAD-shaped planning documents. They precede — and inform — the PRD, architecture, and epics/stories.

---

## 1. Documents in this folder

| # | Document | What it is | Primary audience |
|---|----------|------------|------------------|
| 1 | [`product-brief.md`](./product-brief.md) | BMAD Product Brief — problem, goals, personas, value prop, scope, metrics, constraints, assumptions, risks. The "why" and the frame. | PM, stakeholders |
| 2 | [`ux-requirements.md`](./ux-requirements.md) | UX Design Brief — personas, journeys, IA, key screens/states, interaction & accessibility (WCAG 2.1 AA) & responsive requirements. **Core UX deliverable.** | UX, PM, Architect, Dev |
| 3 | [`functional-requirements.md`](./functional-requirements.md) | Numbered, testable FRs (FR-1…) and NFRs (NFR-1…) derived from the handover specs — form logic, address, cost calc, lead capture, data/API. | PM, Architect, Dev, QA |
| 4 | [`requirements-traceability.md`](./requirements-traceability.md) | Traceability matrix (requirement ↔ source ↔ screen/component) plus OPEN ITEMS with owners. | PM, Architect, everyone |
| 5 | `README.md` (this file) | Index, relationships, readiness, next step. | Everyone |

## 2. How they relate

```
WDS/Figma analysis (Saga)         Dev handover (Freya)
FIGMA_ANALYSIS.md, ANALYSIS_       HANDOVER_00..06 (design system,
SUMMARY.md, COMPONENT_DIAGRAM.md   components, pages, animations, data/API, checklist)
             \                         /
              \                       /
               ▼                     ▼
        ┌─────────────────────────────────┐
        │  product-brief.md  (why / frame) │
        └───────────────┬─────────────────┘
                        │
        ┌───────────────┼─────────────────┐
        ▼                                 ▼
  ux-requirements.md              functional-requirements.md
  (experience: what/why)          (FRs/NFRs: testable what)
        └───────────────┬─────────────────┘
                        ▼
          requirements-traceability.md
       (source ↔ requirement ↔ screen + OPEN ITEMS)
                        │
                        ▼
        Next BMAD steps → PRD → Architecture → Epics/Stories
```

- The **product brief** sets scope and goals.
- **UX requirements** and **functional requirements** are complementary views (experience vs. testable behaviour) and cross-reference each other's IDs.
- **Traceability** ties every requirement to a real source doc and forward to a screen/component, and surfaces the gaps that must close during planning.

## 3. Readiness for BMAD planning

| Area | State | Notes |
|------|-------|-------|
| Product framing (brief) | ✅ Ready | Grounded in Saga + Freya |
| UX requirements | ✅ Ready, with tracked open questions | Screen-state matrix & responsive gaps flagged |
| Functional/NFR requirements | ✅ Ready | Numbered & testable; some items **[OPEN]** |
| Traceability & gaps | ✅ Ready | 12 OPEN ITEMS with owners |
| Step 2 items / Step 3 questions | ⚠️ Content pending | OI-1, OI-2 — Product |
| Cost algorithm | ⛔ Critical gap | OI-3 — Engineering |
| API contracts | ⚠️ Illustrative | OI-6 — Backend Eng |
| Mobile/tablet layouts & screen states | ⚠️ Partial | OI-4, OI-5 — Design/UX |

**Overall:** Ready to enter PRD authoring. The four CRITICAL/HIGH open items (OI-1, OI-2, OI-3, OI-6) should be resolved during PRD elaboration and before the affected epics enter a sprint.

## 4. Recommended next BMAD step

1. **Run `bmad-create-prd`** (skill: `bmad-prd` / `bmad-create-prd`) using `product-brief.md`, `ux-requirements.md`, and `functional-requirements.md` as inputs.
2. During PRD elaboration, **drive the OPEN ITEMS** in `requirements-traceability.md` to closure with the named owners.
3. Then proceed to **`bmad-architecture`** (informed by the UX + FR/NFR docs), followed by **`bmad-create-epics-and-stories`**.
4. Optionally validate with **`bmad-validate-prd`** before sprint planning.

> Reference detail (hex, timings, component specs, API payloads) intentionally lives in the root `HANDOVER_*` docs and `FIGMA_ANALYSIS.md`; these planning artifacts link to them rather than duplicating pixel-level detail.
