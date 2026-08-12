import { describe, it, expect } from "vitest";
import { createStubLeadSink, maskPhone } from "./stub-lead-sink";
import type { LeadCapture } from "@server/domain/ports/lead-sink";

/**
 * Node-only unit tests for the deterministic stub lead sink covering the
 * I/O-matrix rows: happy consented capture, the consent gate (AD-10),
 * encryption-at-rest + retention marking (AD-10), deterministic id, and the
 * phone-masking log helper (NFR-6).
 */

function lead(overrides: Partial<LeadCapture> = {}): LeadCapture {
  return {
    estimateId: "est_0123456789abcdef",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@example.com",
    phone: "0412345678",
    contactMethod: "phone",
    bestTime: "morning",
    consent: true,
    ...overrides,
  };
}

describe("createStubLeadSink", () => {
  it("captures a consented lead and returns an opaque leadId (happy path)", async () => {
    const sink = createStubLeadSink();
    const receipt = await sink.capture(lead());
    expect(receipt.leadId).toMatch(/^lead_[0-9a-f]{16}$/);
    expect(sink.peek()).toHaveLength(1);
  });

  it("rejects a capture lacking consent (consent gate, AD-10) and stores nothing", async () => {
    const sink = createStubLeadSink();
    await expect(sink.capture(lead({ consent: false }))).rejects.toThrow(/consent/i);
    expect(sink.peek()).toHaveLength(0);
  });

  it("marks each stored record for encryption at rest and 24-month retention (AD-10)", async () => {
    const sink = createStubLeadSink();
    await sink.capture(lead());
    const [record] = sink.peek();
    expect(record.encryptAtRest).toBe(true);
    expect(record.retentionMonths).toBe(24);
    expect(record.lead.email).toBe("jane@example.com");
  });

  it("gives identical payloads distinct ids across fresh per-request sinks (no cross-request collision)", async () => {
    const a = await createStubLeadSink().capture(lead());
    const b = await createStubLeadSink().capture(lead());
    expect(a.leadId).not.toBe(b.leadId);
  });

  it("disambiguates identical payloads via a monotonic counter (distinct ids)", async () => {
    const sink = createStubLeadSink();
    const first = await sink.capture(lead());
    const second = await sink.capture(lead());
    expect(first.leadId).not.toBe(second.leadId);
    expect(sink.peek()).toHaveLength(2);
  });
});

describe("maskPhone", () => {
  it("masks a phone to its last 3 digits (NFR-6 — never log raw PII)", () => {
    expect(maskPhone("0412345678")).toBe("***678");
    expect(maskPhone("+61 412 345 678")).toBe("***678");
  });

  it("fully masks a short/degenerate number (never reveals under 4 digits)", () => {
    expect(maskPhone("12")).toBe("***");
    expect(maskPhone("")).toBe("***");
    expect(maskPhone("abc")).toBe("***");
  });
});
