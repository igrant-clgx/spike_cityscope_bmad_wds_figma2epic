import { describe, it, expect, vi } from "vitest";
import { captureLead } from "./lead";
import type {
  LeadCapture,
  LeadSink,
} from "@server/domain/ports/lead-sink";

/**
 * Node-only unit test: the use-case is pure orchestration that delegates to the
 * `LeadSink` port (mirror of `application/estimate.test.ts`).
 */

const SAMPLE_LEAD: LeadCapture = {
  estimateId: "est_0123456789abcdef",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "0412345678",
  contactMethod: "phone",
  consent: true,
};

function fakeSink(overrides: Partial<LeadSink> = {}): LeadSink {
  return {
    capture: vi.fn().mockResolvedValue({ leadId: "lead_abc123" }),
    ...overrides,
  };
}

describe("captureLead", () => {
  it("delegates to the sink and returns its receipt", async () => {
    const sink = fakeSink();
    const receipt = await captureLead(sink, SAMPLE_LEAD);
    expect(receipt).toEqual({ leadId: "lead_abc123" });
    expect(sink.capture).toHaveBeenCalledWith(SAMPLE_LEAD, undefined);
  });

  it("threads the idempotency key through to the sink (FR-32/FR-33)", async () => {
    const sink = fakeSink();
    await captureLead(sink, SAMPLE_LEAD, "idem-key-1");
    expect(sink.capture).toHaveBeenCalledWith(SAMPLE_LEAD, "idem-key-1");
  });

  it("propagates a rejection from the sink (e.g. consent gate)", async () => {
    const sink = fakeSink({
      capture: vi.fn().mockRejectedValue(new Error("consent required")),
    });
    await expect(captureLead(sink, SAMPLE_LEAD)).rejects.toThrow(/consent/i);
  });
});
