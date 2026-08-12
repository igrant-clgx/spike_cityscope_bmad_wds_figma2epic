import { describe, it, expect } from "vitest";
import { formatAud, formatAudRange } from "./money-format";

/**
 * Node-only unit tests for the view-edge AUD formatter. Exhaustive on zero,
 * boundaries, thousands separators, rounding, and NO trailing cents / float drift.
 */

describe("formatAud", () => {
  it("formats zero", () => {
    expect(formatAud(0)).toBe("$0");
  });

  it("formats 1 dollar (100 cents)", () => {
    expect(formatAud(100)).toBe("$1");
  });

  it("formats with a thousands separator", () => {
    expect(formatAud(3_270_000)).toBe("$32,700");
  });

  it("formats large values with separators", () => {
    expect(formatAud(123_456_700)).toBe("$1,234,567");
  });

  it("never shows trailing cents and rounds to the nearest dollar", () => {
    expect(formatAud(3_270_099)).toBe("$32,701");
    expect(formatAud(3_270_049)).toBe("$32,700");
  });

  it("rounds to whole dollars without float drift", () => {
    expect(formatAud(150)).toBe("$2");
    expect(formatAud(149)).toBe("$1");
  });

  it("renders the zero-format for non-finite input", () => {
    expect(formatAud(0)).toBe("$0");
    expect(formatAud(NaN)).toBe("$0");
    expect(formatAud(Infinity)).toBe("$0");
    expect(formatAud(-Infinity)).toBe("$0");
  });

  it("renders a negative value with a leading minus", () => {
    expect(formatAud(-5_000)).toBe("-$50");
  });
});

describe("formatAudRange", () => {
  it("joins min and max with an en-dash", () => {
    expect(formatAudRange(1_500_000, 3_270_000)).toBe("$15,000 – $32,700");
  });

  it("handles an equal range", () => {
    expect(formatAudRange(0, 0)).toBe("$0 – $0");
  });

  it("orders an inverted range so it never renders backwards", () => {
    expect(formatAudRange(5_000, 1_000)).toBe("$10 – $50");
  });
});
