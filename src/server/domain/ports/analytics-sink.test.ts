import { describe, it, expectTypeOf } from "vitest";
import type {
  AnalyticsEvent,
  AssertNoPII,
} from "@server/domain/ports/analytics-sink";

/**
 * Type-level lock-in for the PII guard. Each event variant must remain PII-free
 * (`AssertNoPII` resolves to the variant, not `never`), while any shape that
 * carries a forbidden key must resolve to `never`.
 */
describe("AssertNoPII type guard", () => {
  it("keeps each event variant PII-free (not never)", () => {
    expectTypeOf<
      AssertNoPII<Extract<AnalyticsEvent, { name: "step_viewed" }>>
    >().not.toBeNever();
    expectTypeOf<
      AssertNoPII<Extract<AnalyticsEvent, { name: "step_completed" }>>
    >().not.toBeNever();
    expectTypeOf<
      AssertNoPII<Extract<AnalyticsEvent, { name: "estimate_generated" }>>
    >().not.toBeNever();
    expectTypeOf<
      AssertNoPII<Extract<AnalyticsEvent, { name: "lead_submitted" }>>
    >().not.toBeNever();
    expectTypeOf<
      AssertNoPII<Extract<AnalyticsEvent, { name: "drop_off" }>>
    >().not.toBeNever();
  });

  it("collapses to never for a shape carrying a forbidden PII key", () => {
    expectTypeOf<AssertNoPII<{ email: string }>>().toBeNever();
    expectTypeOf<AssertNoPII<{ phone: string }>>().toBeNever();
    expectTypeOf<AssertNoPII<{ fullAddress: string }>>().toBeNever();
  });
});
