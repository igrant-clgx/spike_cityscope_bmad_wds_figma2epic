import { envelopeSchema, generateRequestId, type Envelope, type ErrorDetail } from "@shared/schemas";
import type { z } from "zod";
import type { ApiResult } from "./request-state";

/**
 * The single client → BFF caller and the ONLY owner of envelope parsing + retry
 * (AD-9). It is NON-THROWING for expected failures: network errors, non-2xx
 * status, non-JSON bodies, and non-envelope JSON all resolve to a typed error
 * result carrying a `requestId` (generated when the response had none).
 *
 * Retry policy: retry only transient failures (network error / 5xx) up to a
 * small bounded count with backoff; NEVER retry a 4xx status or a well-formed
 * error envelope (those are legitimate, non-destructive errors that return
 * immediately). Framework-agnostic (no React import) so server + client share it.
 */

/** Tunable behaviour for `apiFetch` (defaults keep production behaviour; tests inject `backoffMs: 0`). */
export interface ApiFetchOptions {
  /** Max retries for transient failures (network / 5xx). Total attempts = maxRetries + 1. */
  maxRetries?: number;
  /** Base backoff in ms; delay for attempt N is `backoffMs * attempt`. Set 0 in tests. */
  backoffMs?: number;
}

const DEFAULT_MAX_RETRIES = 2;
const DEFAULT_BACKOFF_MS = 50;

function delay(ms: number): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorResult<T>(error: ErrorDetail, requestId: string): ApiResult<T> {
  return { ok: false, error, requestId };
}

/**
 * Fetch `input`, parse the shared envelope with `dataSchema`, and return a typed
 * `ApiResult<T>` — never throwing for the expected-failure cases in the matrix.
 */
export async function apiFetch<T extends z.ZodTypeAny>(
  input: RequestInfo | URL,
  dataSchema: T,
  init?: RequestInit,
  options?: ApiFetchOptions,
): Promise<ApiResult<z.infer<T>>> {
  const rawMaxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES;
  // Sanitise: NaN/Infinity/negative/non-integer would break the loop bound.
  const maxRetries = Number.isFinite(rawMaxRetries)
    ? Math.max(0, Math.floor(rawMaxRetries))
    : DEFAULT_MAX_RETRIES;
  const backoffMs = options?.backoffMs ?? DEFAULT_BACKOFF_MS;
  const schema = envelopeSchema(dataSchema);

  let attempt = 0;

  // Retry loop: `attempt` counts from 1. Only *transient* failures — a thrown
  // network error, or a 5xx/unreadable body that is NOT a well-formed envelope —
  // `continue` after backoff until attempts are exhausted. The body is always
  // read and parsed BEFORE deciding to retry, so a legitimate error envelope
  // (even on a 5xx) is honoured and returned immediately, never retried.
  for (;;) {
    attempt += 1;
    const isLastAttempt = attempt > maxRetries;
    const transient = response5xxOrNetwork(backoffMs, attempt, isLastAttempt);

    let response: Response;
    try {
      response = await fetch(input, init);
    } catch {
      // Network error → transient.
      const retried = await transient();
      if (retried) continue;
      return errorResult(
        { code: "network_error", message: "Network request failed." },
        generateRequestId(),
      );
    }

    const serverError = response.status >= 500;

    // Read the body once, defensively — reading must not throw.
    let bodyText: string;
    try {
      bodyText = await response.text();
    } catch {
      if (serverError) {
        const retried = await transient();
        if (retried) continue;
        return errorResult(
          { code: "server_error", message: `Server responded with ${response.status}.` },
          generateRequestId(),
        );
      }
      return errorResult(
        { code: "invalid_response", message: "Could not read response body." },
        generateRequestId(),
      );
    }

    let json: unknown;
    try {
      json = JSON.parse(bodyText);
    } catch {
      // Non-JSON body: transient if 5xx (e.g. an upstream HTML error page),
      // otherwise a hard invalid response that is NOT retried.
      if (serverError) {
        const retried = await transient();
        if (retried) continue;
        return errorResult(
          { code: "server_error", message: `Server responded with ${response.status}.` },
          generateRequestId(),
        );
      }
      return errorResult(
        { code: "invalid_response", message: "Response body was not valid JSON." },
        generateRequestId(),
      );
    }

    const parsed = schema.safeParse(json);
    if (parsed.success) {
      const envelope = parsed.data as Envelope<z.infer<T>>;
      if (envelope.ok === false) {
        // Legitimate error envelope → return immediately, NEVER retried,
        // preserving the server's error detail + requestId (even on a 5xx).
        return errorResult(envelope.error, envelope.requestId);
      }
      // Success-shaped body:
      if (response.ok) {
        return { ok: true, data: envelope.data, requestId: envelope.requestId };
      }
      // Contradictory: a non-2xx status carrying a success envelope → treat as
      // an HTTP error (do not report failure data as success), keep requestId.
      return errorResult(
        { code: "http_error", message: `Server responded with ${response.status}.` },
        envelope.requestId,
      );
    }

    // Well-formed JSON that is not our envelope: transient if 5xx, else invalid.
    if (serverError) {
      const retried = await transient();
      if (retried) continue;
      return errorResult(
        { code: "server_error", message: `Server responded with ${response.status}.` },
        generateRequestId(),
      );
    }
    return errorResult(
      { code: "invalid_response", message: "Response did not match the envelope contract." },
      generateRequestId(),
    );
  }
}

/**
 * Helper: on a transient failure, wait the backoff and report whether another
 * attempt should run. Returns `true` if the caller should `continue` the loop,
 * `false` if retries are exhausted.
 */
function response5xxOrNetwork(backoffMs: number, attempt: number, isLastAttempt: boolean) {
  return async (): Promise<boolean> => {
    if (isLastAttempt) return false;
    await delay(backoffMs * attempt);
    return true;
  };
}
