import type {
  LeadCapture,
  LeadReceipt,
  LeadSink,
} from "@server/domain/ports/lead-sink";

/**
 * Lead capture use-case (application layer). Pure orchestration over the
 * `LeadSink` port — no vendor SDK, no UI, no zod. Keeps the BFF route thin and
 * the store swappable: the real OI-11 CRM connector replaces the stub adapter
 * with no change here (mirror of `application/estimate.ts`). This is the swap
 * seam. The consent gate + encryption-at-rest marking (AD-10) live in the
 * adapter, not here.
 */
export async function captureLead(
  sink: LeadSink,
  lead: LeadCapture,
): Promise<LeadReceipt> {
  return sink.capture(lead);
}
