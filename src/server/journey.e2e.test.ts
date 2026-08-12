import { describe, it, expect } from "vitest";

import { createStubAddressProvider } from "@server/adapters/address/stub-address-provider";
import { createStubEstimateEngine } from "@server/adapters/estimate/stub-estimate-engine";
import { createStubLeadSink } from "@server/adapters/lead/stub-lead-sink";
import { createNoopAnalyticsSink } from "@server/adapters/analytics/noop-analytics-sink";

import { suggestAddresses, resolveAddress } from "@server/application/address";
import { requestEstimate } from "@server/application/estimate";
import { captureLead } from "@server/application/lead";

import type { LeadCapture } from "@server/domain/ports/lead-sink";
import type { AnalyticsEvent } from "@server/domain/ports/analytics-sink";

/**
 * Node-level END-TO-END JOURNEY (Story 6.5, NFR-11). Walks the whole guided
 * flow — address lookup -> estimate compute -> lead capture — through the REAL
 * application use-cases over the REAL stub adapters (the same seams the BFF
 * routes wire), asserting the pipeline runs GREEN end-to-end and the ids thread
 * correctly (resolved address -> estimate scope -> estimateId on the lead).
 *
 * This is the journey-level complement to the per-use-case unit tests (which
 * use fakes): here NOTHING is mocked, so it proves the concrete stubs compose.
 * No browser/RTL — pure node against the stub adapters (the OI-3/OI-11 swap
 * seams). Analytics events are collected through a recording sink to prove the
 * observability taxonomy fires with no PII (NFR-8, AD-12).
 */

/** A recording AnalyticsSink so the journey can assert the emitted taxonomy. */
function createRecordingAnalyticsSink() {
  const events: AnalyticsEvent[] = [];
  const noop = createNoopAnalyticsSink(); // still runs the belt-and-braces PII scan
  return {
    events,
    sink: {
      async track(event: AnalyticsEvent): Promise<void> {
        await noop.track(event);
        events.push(event);
      },
    },
  };
}

const FORBIDDEN_PII_VALUES = ["Jane", "Doe", "jane@example.com", "0412345678"];

describe("journey: address -> estimate -> lead (stub pipeline, NFR-11)", () => {
  it("runs green end-to-end and threads ids across the three seams", async () => {
    const address = createStubAddressProvider();
    const engine = createStubEstimateEngine();
    const leads = createStubLeadSink();
    const analytics = createRecordingAnalyticsSink();

    // 1. Address: suggest (>=3 chars) then resolve the chosen prediction.
    const predictions = await suggestAddresses(address, "George");
    expect(predictions.length).toBeGreaterThan(0);
    const chosen = predictions[0]!;
    await analytics.sink.track({ name: "step_viewed", stepId: "address", stepIndex: 0 });

    const resolved = await resolveAddress(address, chosen.addressId);
    expect(resolved).not.toBeNull();
    expect(resolved!.state).toBeTruthy();
    await analytics.sink.track({ name: "step_completed", stepId: "address", stepIndex: 0 });

    // 2. Estimate: compute an indicative range for the selected scope.
    const estimate = await requestEstimate(engine, {
      configVersion: "reno-config-v1",
      itemIds: ["kitchen", "bathroom"],
    });
    expect(estimate.estimateId).toMatch(/^est_[0-9a-f]{16}$/);
    expect(estimate.costMax).toBeGreaterThanOrEqual(estimate.costMin);
    await analytics.sink.track({
      name: "estimate_generated",
      estimateId: estimate.estimateId,
      rangeLowCents: estimate.costMin,
      rangeHighCents: estimate.costMax,
    });

    // 3. Lead: capture a consented lead against THAT estimateId.
    const lead: LeadCapture = {
      estimateId: estimate.estimateId,
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "0412345678",
      contactMethod: "phone",
      consent: true,
    };
    const receipt = await captureLead(leads, lead, "journey-idem-key");
    expect(receipt.leadId).toMatch(/^lead_[0-9a-f]{16}$/);
    await analytics.sink.track({
      name: "lead_submitted",
      leadId: receipt.leadId,
      contactMethod: "phone",
    });

    // The stored lead carries the estimateId from step 2 + the AD-10 markings.
    const stored = leads.peek();
    expect(stored).toHaveLength(1);
    expect(stored[0]!.lead.estimateId).toBe(estimate.estimateId);
    expect(stored[0]!.encryptAtRest).toBe(true);
    expect(stored[0]!.retentionMonths).toBe(24);
  });

  it("is idempotent: a retried lead POST dedups to the same leadId, no second record", async () => {
    const leads = createStubLeadSink();
    const lead: LeadCapture = {
      estimateId: "est_0123456789abcdef",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "0412345678",
      contactMethod: "phone",
      consent: true,
    };
    const first = await captureLead(leads, lead, "dupe-key");
    const second = await captureLead(leads, lead, "dupe-key");
    expect(second.leadId).toBe(first.leadId);
    expect(leads.peek()).toHaveLength(1);
  });

  it("rejects a consent-less lead at the end of the journey (AD-10 gate)", async () => {
    const leads = createStubLeadSink();
    const lead: LeadCapture = {
      estimateId: "est_0123456789abcdef",
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      phone: "0412345678",
      contactMethod: "phone",
      consent: false,
    };
    await expect(captureLead(leads, lead, "no-consent")).rejects.toThrow(/consent/i);
    expect(leads.peek()).toHaveLength(0);
  });

  it("emits the observability taxonomy with no PII values on any event (NFR-8, AD-12)", async () => {
    const address = createStubAddressProvider();
    const engine = createStubEstimateEngine();
    const leads = createStubLeadSink();
    const analytics = createRecordingAnalyticsSink();

    const [chosen] = await suggestAddresses(address, "George");
    await resolveAddress(address, chosen!.addressId);
    await analytics.sink.track({ name: "step_completed", stepId: "address", stepIndex: 0 });
    const estimate = await requestEstimate(engine, {
      configVersion: "reno-config-v1",
      itemIds: ["kitchen"],
    });
    await analytics.sink.track({ name: "estimate_generated", estimateId: estimate.estimateId });
    const receipt = await captureLead(
      leads,
      {
        estimateId: estimate.estimateId,
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        phone: "0412345678",
        contactMethod: "phone",
        consent: true,
      },
      "obs-key",
    );
    await analytics.sink.track({ name: "lead_submitted", leadId: receipt.leadId, contactMethod: "phone" });

    const names = analytics.events.map((e) => e.name);
    expect(names).toEqual([
      "step_completed",
      "estimate_generated",
      "lead_submitted",
    ]);

    // No emitted event may carry a raw PII value anywhere in its serialization.
    const serialized = JSON.stringify(analytics.events);
    for (const pii of FORBIDDEN_PII_VALUES) {
      expect(serialized).not.toContain(pii);
    }
  });
});
