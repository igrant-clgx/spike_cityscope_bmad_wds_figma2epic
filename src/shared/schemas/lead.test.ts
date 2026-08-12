import { describe, it, expect } from "vitest";
import { leadCaptureRequestSchema, leadReceiptSchema } from "./lead";

/**
 * Node-only unit tests for the shared lead schema (AD-4, FR-27/FR-28/FR-30).
 * Covers the I/O-matrix rows: valid consented lead, consent false/absent, bad
 * estimateId, invalid AU email/phone, short names, and the optional bestTime.
 */

const VALID = {
  estimateId: "est_0123456789abcdef",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "0412 345 678",
  contactMethod: "phone" as const,
  bestTime: "morning" as const,
  consent: true as const,
};

describe("leadCaptureRequestSchema", () => {
  it("accepts a well-formed consented lead (happy path)", () => {
    expect(leadCaptureRequestSchema.safeParse(VALID).success).toBe(true);
  });

  it("accepts a lead without the optional bestTime", () => {
    const { bestTime: _omit, ...rest } = VALID;
    expect(leadCaptureRequestSchema.safeParse(rest).success).toBe(true);
  });

  it("rejects consent: false", () => {
    expect(
      leadCaptureRequestSchema.safeParse({ ...VALID, consent: false }).success,
    ).toBe(false);
  });

  it("rejects an absent consent flag", () => {
    const { consent: _omit, ...rest } = VALID;
    expect(leadCaptureRequestSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects a bad estimateId format", () => {
    expect(
      leadCaptureRequestSchema.safeParse({ ...VALID, estimateId: "est_bad" }).success,
    ).toBe(false);
    expect(
      leadCaptureRequestSchema.safeParse({ ...VALID, estimateId: "0123456789abcdef" })
        .success,
    ).toBe(false);
  });

  it("rejects an invalid AU phone", () => {
    expect(
      leadCaptureRequestSchema.safeParse({ ...VALID, phone: "12345" }).success,
    ).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(
      leadCaptureRequestSchema.safeParse({ ...VALID, email: "not-an-email" }).success,
    ).toBe(false);
  });

  it("rejects names shorter than 2 chars", () => {
    expect(
      leadCaptureRequestSchema.safeParse({ ...VALID, firstName: "J" }).success,
    ).toBe(false);
    expect(
      leadCaptureRequestSchema.safeParse({ ...VALID, lastName: " " }).success,
    ).toBe(false);
  });

  it("rejects an unknown contactMethod", () => {
    expect(
      leadCaptureRequestSchema.safeParse({ ...VALID, contactMethod: "carrier-pigeon" })
        .success,
    ).toBe(false);
  });

  it("rejects an unknown bestTime", () => {
    expect(
      leadCaptureRequestSchema.safeParse({ ...VALID, bestTime: "midnight" }).success,
    ).toBe(false);
  });
});

describe("leadReceiptSchema", () => {
  it("accepts a non-empty leadId", () => {
    expect(leadReceiptSchema.safeParse({ leadId: "lead_abc" }).success).toBe(true);
  });

  it("rejects an empty leadId", () => {
    expect(leadReceiptSchema.safeParse({ leadId: "" }).success).toBe(false);
  });
});
