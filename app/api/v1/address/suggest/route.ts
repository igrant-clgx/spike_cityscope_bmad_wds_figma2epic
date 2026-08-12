import { createStubAddressProvider } from "@server/adapters/address/stub-address-provider";
import { suggestAddresses } from "@server/application/address";
import {
  addressPredictionsSchema,
  addressQuerySchema,
  err,
  generateRequestId,
  ok,
} from "@shared/schemas";

/**
 * BFF address suggest route (AD-1/AD-9). Same-origin only; the stub adapter is
 * instantiated server-side and never exposed to the browser. Input `q` is
 * validated with the shared schema (missing `q` → `invalid_request`, HTTP 400);
 * a short (<3-char) query returns an empty prediction list (handled in the
 * application layer), not an error. The response payload is re-validated with
 * the shared schema before it leaves the seam (AD-4: input AND output).
 */
export async function GET(request: Request): Promise<Response> {
  const requestId = generateRequestId();
  const q = new URL(request.url).searchParams.get("q");

  const parsed = addressQuerySchema.safeParse({ q });
  if (!parsed.success) {
    return Response.json(
      err("invalid_request", "q is required", { requestId }),
      { status: 400 },
    );
  }

  const predictions = await suggestAddresses(
    createStubAddressProvider(),
    parsed.data.q,
  );
  const data = addressPredictionsSchema.parse({ predictions });
  return Response.json(ok(data, requestId));
}
