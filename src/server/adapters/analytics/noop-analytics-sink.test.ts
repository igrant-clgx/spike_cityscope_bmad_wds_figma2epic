import { describe, it, expect, vi } from "vitest";
import { createNoopAnalyticsSink } from "./noop-analytics-sink";
import type { AnalyticsEvent } from "@server/domain/ports/analytics-sink";

describe("createNoopAnalyticsSink", () => {
  it("track resolves without side effects", async () => {
    const sink = createNoopAnalyticsSink();
    await expect(
      sink.track({ name: "step_viewed", stepId: "s1", stepIndex: 0 }),
    ).resolves.toBeUndefined();
  });

  it("accepts each of the five event names", async () => {
    const sink = createNoopAnalyticsSink();
    const events: AnalyticsEvent[] = [
      { name: "step_viewed", stepId: "s1", stepIndex: 0 },
      { name: "step_completed", stepId: "s1", stepIndex: 0 },
      { name: "estimate_generated", estimateId: "e1" },
      { name: "lead_submitted", leadId: "l1", contactMethod: "email" },
      { name: "drop_off", stepId: "s2", stepIndex: 1 },
    ];
    for (const event of events) {
      await expect(sink.track(event)).resolves.toBeUndefined();
    }
  });

  it("dev PII guard logs and does not throw when a forbidden key is present", async () => {
    const sink = createNoopAnalyticsSink();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const leaky = {
        name: "lead_submitted",
        leadId: "l1",
        email: "x@example.com",
      } as unknown as AnalyticsEvent;

      let threw = false;
      let result: Promise<void> | undefined;
      try {
        result = sink.track(leaky);
      } catch {
        threw = true;
      }
      expect(threw).toBe(false);
      await expect(result).resolves.toBeUndefined();
      expect(spy).toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });

  it("dev PII guard detects nested forbidden keys", async () => {
    const sink = createNoopAnalyticsSink();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const leaky = {
        name: "lead_submitted",
        leadId: "l1",
        meta: { phone: "0400000000" },
      } as unknown as AnalyticsEvent;
      await expect(sink.track(leaky)).resolves.toBeUndefined();
      expect(spy).toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });

  it("dev PII guard detects forbidden keys inside arrays of objects", async () => {
    const sink = createNoopAnalyticsSink();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const leaky = {
        name: "lead_submitted",
        leadId: "l1",
        items: [{ ok: 1 }, { email: "x@example.com" }],
      } as unknown as AnalyticsEvent;
      await expect(sink.track(leaky)).resolves.toBeUndefined();
      expect(spy).toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });

  it("dev PII guard detects deeply nested forbidden keys", async () => {
    const sink = createNoopAnalyticsSink();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const leaky = {
        name: "lead_submitted",
        leadId: "l1",
        meta: { user: { profile: { ssn: "123-45-6789" } } },
      } as unknown as AnalyticsEvent;
      await expect(sink.track(leaky)).resolves.toBeUndefined();
      expect(spy).toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });

  it("dev PII guard tolerates cyclic event objects without throwing", async () => {
    const sink = createNoopAnalyticsSink();
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const leaky: Record<string, unknown> = {
        name: "drop_off",
        stepId: "s1",
        stepIndex: 0,
      };
      leaky.self = leaky;
      await expect(
        sink.track(leaky as unknown as AnalyticsEvent),
      ).resolves.toBeUndefined();
    } finally {
      spy.mockRestore();
    }
  });
});
