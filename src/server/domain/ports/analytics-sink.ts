/**
 * AnalyticsSink port (AD-12). A first-party typed event seam. Events NEVER
 * carry PII (no name, email, phone, or full address).
 *
 * Interface only at scaffold time — the concrete no-op/first-party adapter is
 * wired in Story 1.5. No external I/O here.
 */
export type AnalyticsEventName =
  | "step_viewed"
  | "step_completed"
  | "estimate_generated"
  | "lead_submitted"
  | "drop_off";

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  requestId?: string;
  estimateId?: string;
}

export interface AnalyticsSink {
  track(event: AnalyticsEvent): Promise<void>;
}
