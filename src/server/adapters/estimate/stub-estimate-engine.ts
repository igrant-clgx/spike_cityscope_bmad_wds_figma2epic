import { audCents, type AudCents } from "@server/domain/money";
import type {
  EstimateConfidence,
  EstimateEngine,
  EstimateEngineRequest,
  EstimateEngineResult,
} from "@server/domain/ports/estimate-engine";

/**
 * Deterministic stub `EstimateEngine` (AD-2). Server-only: the browser never
 * touches it. Turns a completed scope into an indicative AUD-cents cost range
 * plus a stable `estimateId`, so Epic 4 can be built end-to-end before the real
 * pricing algorithm exists.
 *
 * Fully deterministic — no `Math.random`, no `Date`, no external I/O — so the
 * same scope always yields the same `estimateId` and range (a stable cache/join
 * key), and a different scope yields a different id.
 *
 * OI-3 [OPEN] CRITICAL: the real cost algorithm is unresolved; ALL pricing lives
 * here and nowhere else, so the real engine drops in as a single adapter
 * substitution with no change above the port (FR-23). The per-item base costs
 * and SPREAD below are `[ASSUMPTION]` placeholders (indicative magnitudes only,
 * NOT confirmed pricing) — build against the port contract, not these numbers.
 */

/** [ASSUMPTION] Indicative per-item base cost in integer AUD cents (OI-3 [OPEN]). */
const BASE_COST_CENTS: Record<string, number> = {
  kitchen: 2_500_000,
  bathroom: 1_500_000,
  flooring: 1_200_000,
  roofing: 1_800_000,
  painting: 900_000,
  landscaping: 1_100_000,
};

/** [ASSUMPTION] Fallback base cost for an unknown item id. */
const DEFAULT_BASE_COST_CENTS = 1_000_000;

/** [ASSUMPTION] Upper-bound spread over the summed base cost. */
const SPREAD = 0.3;

/**
 * FNV-1a 32-bit hash — no crypto dependency, deterministic across runs. The
 * offset-basis seed is a parameter so two independent lanes can be combined into
 * a wider digest (estimateId is a durable join/cache key for Epic 5).
 */
function fnv1a(input: string, seed = 0x811c9dc5): number {
  let hash = seed >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/**
 * Stable 64-bit id over the scope: version + order-independent item ids. Two
 * independent FNV-1a lanes (distinct offset basis, one over the reversed string)
 * widen the digest from 32 to 64 bits to make collisions negligible now that the
 * id is promoted to a durable join key. Fully deterministic (no Date/random).
 */
function estimateIdFor(configVersion: string, itemIds: readonly string[]): string {
  const canonical = `${configVersion}|${[...itemIds].sort().join(",")}`;
  const lane1 = fnv1a(canonical, 0x811c9dc5);
  const lane2 = fnv1a([...canonical].reverse().join(""), 0x84222325);
  return `est_${lane1.toString(16).padStart(8, "0")}${lane2.toString(16).padStart(8, "0")}`;
}

function confidenceFor(itemCount: number): EstimateConfidence {
  if (itemCount === 0) return "low";
  if (itemCount <= 2) return "medium";
  return "high";
}

function compute(request: EstimateEngineRequest): EstimateEngineResult {
  // Set-like scope: dedupe ONCE so duplicates never corrupt cost, confidence, or
  // identity (`['kitchen','kitchen']` == `['kitchen']` everywhere).
  const ids = [...new Set(request.itemIds)];

  const baseTotal = ids.reduce(
    (sum, id) => sum + (BASE_COST_CENTS[id] ?? DEFAULT_BASE_COST_CENTS),
    0,
  );

  const costMin: AudCents = audCents(baseTotal);
  const costMax: AudCents = audCents(baseTotal + Math.round(baseTotal * SPREAD));

  return {
    estimateId: estimateIdFor(request.configVersion, ids),
    costMin,
    costMax,
    confidence: confidenceFor(ids.length),
  };
}

export function createStubEstimateEngine(): EstimateEngine {
  return {
    estimate(request: EstimateEngineRequest): Promise<EstimateEngineResult> {
      return Promise.resolve(compute(request));
    },
  };
}
