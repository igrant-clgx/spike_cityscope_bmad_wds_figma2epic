import { z } from "zod";
import { isAuEmail, isAuPhone } from "./au-formats";

/**
 * Shared lead request/receipt contracts (AD-4, FR-27/FR-28/FR-30, AD-10). The
 * SAME `leadCaptureRequestSchema` validates the lead body on the client
 * (Story 5.3 form) and on the server (the BFF route re-parses the body before
 * the application layer runs), and `leadReceiptSchema` re-validates the store's
 * receipt before it leaves the seam — so the lead contract can never drift.
 *
 * PII (NFR-6, AD-1): name/email/phone are personally identifying and cross the
 * BFF only. The domain port (`src/server/domain/ports/lead-sink.ts`) declares a
 * plain-TS mirror of these shapes; keeping zod out of the domain preserves layer
 * purity (asserted by `src/server/architecture.test.ts`).
 *
 * [ASSUMPTION] The `contactMethod` and `bestTime` option vocabularies below are
 * placeholders pending the OI-10 lead-form conversion-path decision (FR-31) —
 * build against the enum contract, not these exact members.
 */

/**
 * The lead capture request. `consent` is `z.literal(true)` so a `false`/absent
 * consent flag REJECTS at the schema (FR-30) — defense in depth ahead of the
 * sink's own consent gate (AD-10). `estimateId` must be the opaque
 * `est_[0-9a-f]{16}` join key issued by the estimate seam (AD-6).
 */
export const leadCaptureRequestSchema = z.object({
  estimateId: z.string().regex(/^est_[0-9a-f]{16}$/),
  firstName: z.string().trim().min(2).max(100),
  lastName: z.string().trim().min(2).max(100),
  email: z.string().trim().refine(isAuEmail, { message: "Invalid email address." }),
  phone: z.string().trim().refine(isAuPhone, { message: "Invalid Australian phone number." }),
  contactMethod: z.enum(["phone", "email"]),
  bestTime: z.enum(["morning", "afternoon", "evening", "anytime"]).optional(),
  consent: z.literal(true),
});

/** The lead receipt envelope payload: an opaque non-empty `leadId`. */
export const leadReceiptSchema = z.object({
  leadId: z.string().min(1),
});

export type LeadCaptureRequest = z.infer<typeof leadCaptureRequestSchema>;
export type LeadReceipt = z.infer<typeof leadReceiptSchema>;
