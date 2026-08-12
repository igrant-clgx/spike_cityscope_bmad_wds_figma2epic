import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  ok,
  err,
  generateRequestId,
  successEnvelopeSchema,
  errorEnvelopeSchema,
  envelopeSchema,
} from "./envelope";

describe("envelope helpers", () => {
  it("builds a success envelope matching the schema with a non-empty requestId", () => {
    const envelope = ok({ status: "ok" });
    expect(envelope.ok).toBe(true);
    expect(envelope.data).toEqual({ status: "ok" });
    expect(envelope.requestId).toBeTruthy();
    expect(envelope.requestId.length).toBeGreaterThan(0);

    const schema = successEnvelopeSchema(z.object({ status: z.literal("ok") }));
    expect(schema.safeParse(envelope).success).toBe(true);
  });

  it("honours an explicit requestId on success", () => {
    const envelope = ok({ n: 1 }, "req-123");
    expect(envelope.requestId).toBe("req-123");
  });

  it("builds an error envelope matching the schema with code/message and requestId", () => {
    const envelope = err("NOT_FOUND", "Thing not found");
    expect(envelope.ok).toBe(false);
    expect(envelope.error.code).toBe("NOT_FOUND");
    expect(envelope.error.message).toBe("Thing not found");
    expect(envelope.error.fieldErrors).toBeUndefined();
    expect(envelope.requestId.length).toBeGreaterThan(0);

    expect(errorEnvelopeSchema.safeParse(envelope).success).toBe(true);
  });

  it("includes fieldErrors when provided", () => {
    const envelope = err("VALIDATION", "Invalid input", {
      fieldErrors: { email: "Required" },
      requestId: "req-9",
    });
    expect(envelope.error.fieldErrors).toEqual({ email: "Required" });
    expect(envelope.requestId).toBe("req-9");
    expect(errorEnvelopeSchema.safeParse(envelope).success).toBe(true);
  });

  it("parses both shapes via the discriminated envelope schema", () => {
    const schema = envelopeSchema(z.object({ status: z.literal("ok") }));
    expect(schema.safeParse(ok({ status: "ok" })).success).toBe(true);
    expect(schema.safeParse(err("X", "boom")).success).toBe(true);
  });

  it("generates non-empty, unique request ids", () => {
    const a = generateRequestId();
    const b = generateRequestId();
    expect(a.length).toBeGreaterThan(0);
    expect(b.length).toBeGreaterThan(0);
    expect(a).not.toBe(b);
  });
});
