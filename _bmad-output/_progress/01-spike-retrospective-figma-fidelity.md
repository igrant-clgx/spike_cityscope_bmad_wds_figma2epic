# Spike Retrospective — Figma → BMAD/WDS Fidelity

**Date:** 2026-08-13
**Branch of record:** merged to `main` (PRs #1 + #2)
**Facilitator:** Freya (WDS) / autonomous run
**Scope:** Does the Figma → BMAD/WDS-agent → code pipeline preserve visual fidelity? If not, why, and how do we fix it?

---

## 1. The question this spike answered

Could a design in Figma be carried through the BMAD Method + Whiteport (WDS) agent
pipeline and come out as an implementation that **looks like the design**?

**Answer: Not by default — and we found exactly why, fixed it, and proved the fix.**

---

## 2. What happened (timeline)

1. The BMAD loop built the full Reno Calculator (Epics 1–6, 528 tests) from PRD + UX handover docs.
2. **Symptom:** the running app "looked very different from the Figma."
3. **Root cause:** the pipeline never *visually ingested* the Figma. The `imports/` folder was empty;
   the build ran off **re-narrated text handover docs** (`DESIGN.md`, `EXPERIENCE.md`) that had
   drifted from the pixels. Epic 6 "verification" compared the build against those drifted docs — so
   it passed while still being wrong.
4. **Fix, part 1 (quick wins, `14c02fe`):** removed a non-existent H1 title, restored "Step 1/2/3:"
   labels, title-cased + outlined the selection buttons, restored the exact disclaimer.
5. **Fix, part 2 (the real fix):** re-ran WDS Phases 1–4 *Figma-first* — actually ingested the Figma
   via MCP (`get_metadata` + `get_design_context`), recorded exact tokens, and **remapped the app's
   design tokens to the real pixels** (`beb7d31`).
6. Packaged as Design Delivery **DD-001**, reconciled open items against the code, got owner sign-off,
   merged both PRs to `main` (528 tests green).

---

## 3. The fidelity gap, concretely

The build followed `DESIGN.md`, which disagreed with the actual Figma on the most visible tokens:

| Token | Doc/build used | Actual Figma | 
|-------|----------------|--------------|
| Primary/accent | `#0066CC` blue | **#432A6E violet (Jacarta)** |
| Heading font | Roboto | **Poppins** |
| Body/label font | Roboto | **Source Sans Pro** |
| Text colour | `#333333` | **#110B1C (Ebony 80%)** |
| Card radius | ~8px | **16px** (buttons 4px) |
| Button case | UPPERCASE | **Title case** |

Every one of these was invisible to a text-only pipeline and only surfaced once the Figma was
ingested as pixels.

---

## 4. What went well

- **The token architecture made the fix cheap.** All brand literals lived in one file
  (`src/theme/tokens.ts`); remapping to the Figma was a small, well-scoped change with a passing
  528-test safety net.
- **Figma MCP gave exact values**, not guesses — real hex, font families, radii, spacing — turning a
  subjective "looks off" into an objective diff.
- **WDS gave the fix a home.** Re-running Phases 1–4 Figma-first produced a durable artifact trail
  (observations ledger → page spec → DD-001) rather than a one-off patch.

## 5. What went wrong / what to change

- **The pipeline treated a text handover as the source of truth.** It should treat the **Figma
  (pixels)** as the source of truth and the prose as annotation.
- **`imports/` was empty and nobody noticed.** A pipeline gate should *fail* if no design was
  visually ingested for a UI story.
- **Verification compared against the wrong reference.** Epic 6 diffed the build against the drifted
  docs. Visual verification must diff the running UI against the **actual Figma render**.

---

## 6. Action items (process, for the next run)

| # | Action | Rationale |
|---|--------|-----------|
| A1 | Make Figma ingestion a **required first step** for any UI epic (populate `imports/` via MCP). | Prevents the root cause. |
| A2 | Extract design tokens **directly from Figma** (`get_design_context`) into `tokens.ts`; never hand-transcribe from a prose doc. | Kills transcription drift. |
| A3 | Add a **visual verification gate**: screenshot the running app and diff against the Figma render, not the handover doc. | Catches drift objectively. |
| A4 | When prose and pixels disagree, **pixels win** — and the doc gets corrected. | Single source of truth. |
| A5 | Keep the **observations ledger + DD** pattern (spec → code token map) as the standard handoff. | Traceability from pixel to code. |

---

## 7. Outcome

**Spike succeeded.** The fidelity gap is root-caused, fixed, verified (528 tests + visual
convergence with the ingested Figma render), documented, and shipped to `main`. The reusable lesson:
**visually ingest the Figma and treat pixels as the source of truth** — a text-only handover will
always drift.

_Open, out of UX scope: R3 (cost algorithm). Product placeholders accepted as-is for the spike:
Step 2 item set (OI-1), Step 3 questions (OI-2)._
