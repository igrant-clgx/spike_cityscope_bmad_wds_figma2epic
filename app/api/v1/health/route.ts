import { getHealth } from "@server/application/health";
import { ok, generateRequestId } from "@shared/schemas";

/**
 * BFF health route (AD-9). Calls the health use-case and returns the shared
 * success envelope with a non-empty requestId — proves the inward flow and
 * envelope contract end-to-end.
 */
export function GET() {
  const requestId = generateRequestId();
  const data = getHealth();
  return Response.json(ok(data, requestId));
}
