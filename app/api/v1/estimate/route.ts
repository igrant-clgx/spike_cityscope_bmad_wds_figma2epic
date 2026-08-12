import { createStubEstimateEngine } from "@server/adapters/estimate/stub-estimate-engine";
import { requestEstimate } from "@server/application/estimate";
import {
  err,
  estimateRequestSchema,
  estimateResultSchema,
  generateRequestId,
  ok,
} from "@shared/schemas";

/**
 * BFF estimate route (AD-1/AD-9). Same-origin only; the stub adapter is
 * instantiated server-side and never exposed to the browser. The request body is
 * validated with the shared `estimateRequestSchema` (non-JSON or missing/blank
 * `configVersion`/non-array `itemIds` → `invalid_request`, HTTP 400, engine
 * never called); on success the use-case runs over the port and the response
 * payload is re-validated with `estimateResultSchema` before it leaves the seam
 * (AD-4: input AND output).
 */
/**
 * Re-validate the engine result against the output contract and build the
 * response. On validation failure return a controlled 500 ERROR ENVELOPE (AD-9)
 * — never a bare throw — preserving the `requestId`. Extracted so the failure
 * branch (the exact seam OI-3 drops into) is unit-testable in isolation.
 */
export function respondWithEstimate(result: unknown, requestId: string): Response {
  const validated = estimateResultSchema.safeParse(result);
  if (!validated.success) {
    return Response.json(
      err("internal_error", "Estimate result failed validation.", { requestId }),
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

  const parsed = estimateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      err("invalid_request", "Invalid estimate request.", { requestId }),
      { status: 400 },
    );
  }

  try {
    const result = await requestEstimate(createStubEstimateEngine(), parsed.data);
    return respondWithEstimate(result, requestId);
  } catch {
    // A thrown adapter error (e.g. audCents RangeError) becomes the same
    // controlled 500 envelope rather than an unhandled throw.
    return Response.json(
      err("internal_error", "Estimate computation failed.", { requestId }),
      { status: 500 },
    );
  }
}
