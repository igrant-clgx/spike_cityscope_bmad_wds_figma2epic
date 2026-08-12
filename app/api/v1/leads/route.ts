import { createStubLeadSink } from "@server/adapters/lead/stub-lead-sink";
import { captureLead } from "@server/application/lead";
import {
  err,
  generateRequestId,
  leadCaptureRequestSchema,
  leadReceiptSchema,
  ok,
} from "@shared/schemas";

/**
 * BFF lead route (AD-1/AD-9/AD-10). Same-origin only; the stub store is
 * instantiated server-side and never exposed to the browser — all lead PII
 * crosses this seam (NFR-6). The request body is validated with the shared
 * `leadCaptureRequestSchema` (non-JSON, bad `estimateId`, invalid AU
 * email/phone, short names, or `consent !== true` → `invalid_request`, HTTP 400,
 * sink never called); on success the use-case runs over the port and the receipt
 * is re-validated with `leadReceiptSchema` before it leaves the seam (AD-4:
 * input AND output). No PII is logged here.
 */
/**
 * Re-validate the store receipt against the output contract and build the
 * response. On validation failure return a controlled 500 ERROR ENVELOPE (AD-9)
 * — never a bare throw — preserving the `requestId`. Extracted so the failure
 * branch (the exact seam OI-11's CRM connector drops into) is unit-testable in
 * isolation.
 */
export function respondWithReceipt(result: unknown, requestId: string): Response {
  const validated = leadReceiptSchema.safeParse(result);
  if (!validated.success) {
    return Response.json(
      err("internal_error", "Lead receipt failed validation.", { requestId }),
      { status: 500 },
    );
  }
  return Response.json(ok(validated.data, requestId));
}

export async function POST(request: Request): Promise<Response> {
  const requestId = generateRequestId();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      err("invalid_request", "Request body was not valid JSON.", { requestId }),
      { status: 400 },
    );
  }

  const parsed = leadCaptureRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      err("invalid_request", "Invalid lead request.", { requestId }),
      { status: 400 },
    );
  }

  try {
    // A present-but-empty/whitespace header must NOT be treated as a real key
    // (it would collide every such lead to one `leadId` against the ledger).
    const rawKey = request.headers.get("Idempotency-Key");
    const idempotencyKey = rawKey && rawKey.trim() ? rawKey : undefined;
    const receipt = await captureLead(createStubLeadSink(), parsed.data, idempotencyKey);
    return respondWithReceipt(receipt, requestId);
  } catch {
    // A thrown adapter error (e.g. the consent gate) becomes the same controlled
    // 500 envelope rather than an unhandled throw. No PII is included.
    return Response.json(
      err("internal_error", "Lead capture failed.", { requestId }),
      { status: 500 },
    );
  }
}
