import { createStubConfigSource } from "@server/adapters/config/stub-config-source";
import { formConfigSchema, generateRequestId, ok } from "@shared/schemas";

/**
 * BFF config form route (AD-1/AD-9). Same-origin only; the stub adapter is
 * instantiated server-side and never exposed to the browser. There is no input
 * to validate (no query params) — the seam serves the versioned form-config
 * bundle. The response payload is re-validated with the shared `formConfigSchema`
 * before it leaves the seam (AD-4), guarding against adapter drift.
 */
export async function GET(): Promise<Response> {
  const requestId = generateRequestId();
  const data = await createStubConfigSource().getFormConfig();
  const parsed = formConfigSchema.parse(data);
  return Response.json(ok(parsed, requestId));
}
