import { describe, it, expect } from "vitest";
import { audCents, type AudCents } from "./money";

describe("audCents", () => {
  it("accepts zero and positive safe integers", () => {
    expect(audCents(0)).toBe(0);
    expect(audCents(3_270_000)).toBe(3_270_000);
  });

  it("accepts negative safe integers (e.g. adjustments)", () => {
    expect(audCents(-1500)).toBe(-1500);
  });

  it("throws on fractional values", () => {
    expect(() => audCents(199.99)).toThrow(RangeError);
  });

  it("throws on non-safe integers (precision-loss range)", () => {
    expect(() => audCents(2 ** 53)).toThrow(RangeError);
  });

  it("throws on NaN and Infinity", () => {
    expect(() => audCents(Number.NaN)).toThrow(RangeError);
    expect(() => audCents(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });

  it("returns a value usable where AudCents is expected", () => {
    const cents: AudCents = audCents(42);
    expect(cents).toBe(42);
  });
});
