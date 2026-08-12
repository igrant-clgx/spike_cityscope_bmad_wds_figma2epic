import { describe, it, expect } from "vitest";
import { estimateRequestSchema, estimateResultSchema } from "./estimate";

/**
 * Node-only unit tests for the shared estimate schemas: valid request/result
 * parse, the `costMin <= costMax` refine, and the field-level guards.
 */

describe("estimateRequestSchema", () => {
  it("accepts a valid request", () => {
    const parsed = estimateRequestSchema.safeParse({
      configVersion: "reno-config-v1",
      itemIds: ["kitchen", "bathroom"],
    });
    expect(parsed.success).toBe(true);
  });

  it("accepts an empty itemIds array", () => {
    expect(
      estimateRequestSchema.safeParse({ configVersion: "v1", itemIds: [] }).success,
    ).toBe(true);
  });

  it("rejects a blank configVersion", () => {
    expect(
      estimateRequestSchema.safeParse({ configVersion: "", itemIds: [] }).success,
    ).toBe(false);
  });

  it("rejects a whitespace-only configVersion", () => {
    expect(
      estimateRequestSchema.safeParse({ configVersion: "   ", itemIds: [] }).success,
    ).toBe(false);
  });

  it("rejects an empty-string itemId", () => {
    expect(
      estimateRequestSchema.safeParse({ configVersion: "v1", itemIds: ["kitchen", ""] })
        .success,
    ).toBe(false);
  });

  it("rejects an over-cap itemIds array (>200)", () => {
    const itemIds = Array.from({ length: 201 }, (_, i) => `item-${i}`);
    expect(
      estimateRequestSchema.safeParse({ configVersion: "v1", itemIds }).success,
    ).toBe(false);
  });

  it("accepts an at-cap itemIds array (200)", () => {
    const itemIds = Array.from({ length: 200 }, (_, i) => `item-${i}`);
    expect(
      estimateRequestSchema.safeParse({ configVersion: "v1", itemIds }).success,
    ).toBe(true);
  });

  it("rejects a non-array itemIds", () => {
    expect(
      estimateRequestSchema.safeParse({ configVersion: "v1", itemIds: "kitchen" }).success,
    ).toBe(false);
  });
});

describe("estimateResultSchema", () => {
  it("accepts a valid result", () => {
    const parsed = estimateResultSchema.safeParse({
      estimateId: "est_abc123",
      costMin: 1_000_000,
      costMax: 1_300_000,
      confidence: "medium",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects costMin greater than costMax", () => {
    const parsed = estimateResultSchema.safeParse({
      estimateId: "est_abc123",
      costMin: 2_000_000,
      costMax: 1_000_000,
      confidence: "high",
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0].message).toContain("costMin must be <= costMax");
    }
  });

  it("rejects a negative cost", () => {
    expect(
      estimateResultSchema.safeParse({
        estimateId: "est_x",
        costMin: -1,
        costMax: 10,
        confidence: "low",
      }).success,
    ).toBe(false);
  });

  it("rejects a fractional cost", () => {
    expect(
      estimateResultSchema.safeParse({
        estimateId: "est_x",
        costMin: 10.5,
        costMax: 20,
        confidence: "low",
      }).success,
    ).toBe(false);
  });

  it("rejects an unknown confidence value", () => {
    expect(
      estimateResultSchema.safeParse({
        estimateId: "est_x",
        costMin: 10,
        costMax: 20,
        confidence: "certain",
      }).success,
    ).toBe(false);
  });

  it("rejects a blank estimateId", () => {
    expect(
      estimateResultSchema.safeParse({
        estimateId: "",
        costMin: 10,
        costMax: 20,
        confidence: "low",
      }).success,
    ).toBe(false);
  });
});
