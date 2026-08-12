import type { ErrorDetail } from "@shared/schemas";

/**
 * Uniform async-request state (FR-32/FR-33 foundation).
 *
 * A discriminated union so consumers render `loading` and non-destructive
 * `error` states the same way everywhere, rather than sprinkling try/catch.
 * `success`/`error` both carry the correlation `requestId`.
 */
export type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T; requestId: string }
  | { status: "error"; error: ErrorDetail; requestId: string };

/** The non-throwing result shape returned by `apiFetch` (AD-9). */
export type ApiResult<T> =
  | { ok: true; data: T; requestId: string }
  | { ok: false; error: ErrorDetail; requestId: string };

/** Constructor: nothing requested yet. */
export function idle<T>(): RequestState<T> {
  return { status: "idle" };
}

/** Constructor: request in flight. */
export function loading<T>(): RequestState<T> {
  return { status: "loading" };
}

/** Constructor: request resolved successfully. */
export function success<T>(data: T, requestId: string): RequestState<T> {
  return { status: "success", data, requestId };
}

/** Constructor: request resolved to a (non-destructive) error. */
export function failure<T>(error: ErrorDetail, requestId: string): RequestState<T> {
  return { status: "error", error, requestId };
}
