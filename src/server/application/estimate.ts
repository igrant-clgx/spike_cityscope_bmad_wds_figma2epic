import type {
  EstimateEngine,
  EstimateEngineRequest,
  EstimateEngineResult,
} from "@server/domain/ports/estimate-engine";

/**
 * Estimate use-case (application layer). Pure orchestration over the
 * `EstimateEngine` port — no vendor SDK, no UI, no zod. Keeps the BFF route thin
 * and the pricing swappable: the real OI-3 engine replaces the stub adapter with
 * no change here (mirror of `application/address.ts`). This is the swap seam.
 */
export async function requestEstimate(
  engine: EstimateEngine,
  request: EstimateEngineRequest,
): Promise<EstimateEngineResult> {
  return engine.estimate(request);
}
