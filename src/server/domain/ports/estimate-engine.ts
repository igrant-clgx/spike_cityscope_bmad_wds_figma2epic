import type { AudCents } from "@server/domain/money";

/**
 * EstimateEngine port (AD-2). Computes an indicative renovation cost range.
 *
 * Interface only at scaffold time — the concrete adapter (stub → real pricing
 * model, OI-3) is wired in a later story. No external I/O here.
 */
export interface EstimateEngine {
  estimate(request: EstimateEngineRequest): Promise<EstimateEngineResult>;
}

export interface EstimateEngineRequest {
  configVersion: string;
  itemIds: readonly string[];
}

/**
 * Confidence indicator for an estimate (UX-DR16). A placeholder heuristic in the
 * stub (derived from scope size); the real OI-3 model may compute it differently
 * without changing this contract.
 */
export type EstimateConfidence = "low" | "medium" | "high";

export interface EstimateEngineResult {
  estimateId: string;
  costMin: AudCents;
  costMax: AudCents;
  confidence: EstimateConfidence;
}
