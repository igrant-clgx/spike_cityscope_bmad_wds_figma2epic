import { createStubAddressProvider } from "@server/adapters/address/stub-address-provider";
import { resolveAddress } from "@server/application/address";
import {
  addressResolveQuerySchema,
  err,
  generateRequestId,
  ok,
  resolvedAddressEnvelopeDataSchema,
} from "@shared/schemas";

/**
 * BFF address resolve route (AD-1/AD-9). Same-origin only; the stub adapter is
 * instantiated server-side. Input `addressId` is validated with the shared
 * schema (missing/blank → `invalid_request`, HTTP 400); an unknown id resolves
 * to `null` → `not_found` (HTTP 404); otherwise the structured address is
 * re-validated with the shared schema (AD-4: input AND output) and returned in
 * the success envelope.
 */
export async function GET(request: Request): Promise<Response> {
  const requestId = generateRequestId();
  const addressId = new URL(request.url).searchParams.get("addressId");

  const parsed = addressResolveQuerySchema.safeParse({ addressId });
  if (!parsed.success) {
    return Response.json(
      err("invalid_request", "addressId is required", { requestId }),
      { status: 400 },
    );
  }

  const address = await resolveAddress(
    createStubAddressProvider(),
    parsed.data.addressId,
  );
  if (address === null) {
    return Response.json(
      err("not_found", "address not found", { requestId }),
      { status: 404 },
    );
  }

  const data = resolvedAddressEnvelopeDataSchema.parse({ address });
  return Response.json(ok(data, requestId));
}
