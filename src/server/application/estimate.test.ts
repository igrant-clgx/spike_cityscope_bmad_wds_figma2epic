import { describe, it, expect, vi } from "vitest";
import { requestEstimate } from "./estimate";
import { audCents } from "@server/domain/money";
import type {
  EstimateEngine,
  EstimateEngineResult,
} from "@server/domain/ports/estimate-engine";

/**
 * Node-only unit test: the use-case is pure orchestration that delegates to the
 * `EstimateEngine` port (mirror of `application/address.test.ts`).
 */

const SAMPLE_RESULT: EstimateEngineResult = {
  estimateId: "est_abc123",
  costMin: audCents(1_000_000),
  costMax: audCents(1_300_000),
  confidence: "medium",
};

function fakeEngine(overrides: Partial<EstimateEngine> = {}): EstimateEngine {
  return {
    estimate: vi.fn().mockResolvedValue(SAMPLE_RESULT),
    ...overrides,
  };
}

describe("requestEstimate", () => {
  it("delegates to the engine and returns its result", async () => {
    const engine = fakeEngine();
    const request = { configVersion: "reno-config-v1", itemIds: ["kitchen"] };
    const result = await requestEstimate(engine, request);
    expect(result).toEqual(SAMPLE_RESULT);
    expect(engine.estimate).toHaveBeenCalledWith(request);
  });
});
