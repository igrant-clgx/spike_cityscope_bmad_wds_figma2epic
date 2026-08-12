import { describe, it, expect } from "vitest";
import { createStubEstimateEngine } from "./stub-estimate-engine";
import type { EstimateEngineRequest } from "@server/domain/ports/estimate-engine";

/**
 * Node-only unit tests for the deterministic stub estimate engine covering the
 * I/O-matrix rows: happy path, determinism, distinct/order-independent scope,
 * empty scope, confidence tiers, and unknown-item fallback.
 */

const engine = createStubEstimateEngine();

function req(itemIds: string[], configVersion = "reno-config-v1"): EstimateEngineRequest {
  return { configVersion, itemIds };
}

describe("createStubEstimateEngine", () => {
  it("returns an integer-cents range with costMin <= costMax (happy path)", async () => {
    const result = await engine.estimate(req(["kitchen", "bathroom"]));
    expect(Number.isInteger(result.costMin)).toBe(true);
    expect(Number.isInteger(result.costMax)).toBe(true);
    expect(result.costMin).toBeGreaterThan(0);
    expect(result.costMax).toBeGreaterThanOrEqual(result.costMin);
    expect(result.costMin).toBe(2_500_000 + 1_500_000);
    expect(result.estimateId).toMatch(/^est_[0-9a-f]{16}$/);
  });

  it("emits a 64-bit hex estimateId (16 lowercase hex chars)", async () => {
    const result = await engine.estimate(req(["kitchen"]));
    expect(result.estimateId).toMatch(/^est_[0-9a-f]{16}$/);
  });

  it("is deterministic: the same request twice yields identical id and range", async () => {
    const a = await engine.estimate(req(["kitchen", "flooring"]));
    const b = await engine.estimate(req(["kitchen", "flooring"]));
    expect(a).toEqual(b);
  });

  it("empty scope yields a stable id (format + repeatable)", async () => {
    const a = await engine.estimate(req([]));
    const b = await engine.estimate(req([]));
    expect(a.estimateId).toMatch(/^est_[0-9a-f]{16}$/);
    expect(a.estimateId).toBe(b.estimateId);
  });

  it("distinct scope yields a different estimateId", async () => {
    const a = await engine.estimate(req(["kitchen"]));
    const b = await engine.estimate(req(["bathroom"]));
    expect(a.estimateId).not.toBe(b.estimateId);
  });

  it("is order-independent: same ids in a different order yield the same id", async () => {
    const a = await engine.estimate(req(["kitchen", "bathroom", "flooring"]));
    const b = await engine.estimate(req(["flooring", "kitchen", "bathroom"]));
    expect(a.estimateId).toBe(b.estimateId);
    expect(a.costMin).toBe(b.costMin);
    expect(a.costMax).toBe(b.costMax);
  });

  it("empty scope yields a zero range and low confidence", async () => {
    const result = await engine.estimate(req([]));
    expect(result.costMin).toBe(0);
    expect(result.costMax).toBe(0);
    expect(result.confidence).toBe("low");
  });

  it("derives confidence from the item count", async () => {
    expect((await engine.estimate(req([]))).confidence).toBe("low");
    expect((await engine.estimate(req(["kitchen"]))).confidence).toBe("medium");
    expect((await engine.estimate(req(["kitchen", "bathroom"]))).confidence).toBe("medium");
    expect(
      (await engine.estimate(req(["kitchen", "bathroom", "flooring"]))).confidence,
    ).toBe("high");
  });

  it("falls back to a default base cost for an unknown item", async () => {
    const result = await engine.estimate(req(["totally-unknown-item"]));
    expect(result.costMin).toBe(1_000_000);
    expect(result.costMax).toBe(1_000_000 + Math.round(1_000_000 * 0.3));
  });

  it("treats duplicate itemIds as a set: same id, cost, and confidence as the deduped scope", async () => {
    const dup = await engine.estimate(req(["kitchen", "kitchen"]));
    const single = await engine.estimate(req(["kitchen"]));
    expect(dup.estimateId).toBe(single.estimateId);
    expect(dup.costMin).toBe(single.costMin);
    expect(dup.costMax).toBe(single.costMax);
    expect(dup.confidence).toBe(single.confidence);
  });

  it("applies the spread to costMax", async () => {
    const result = await engine.estimate(req(["painting"]));
    expect(result.costMin).toBe(900_000);
    expect(result.costMax).toBe(900_000 + Math.round(900_000 * 0.3));
  });
});
