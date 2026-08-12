/**
 * Health use-case (application layer).
 *
 * Trivial use-case demonstrating the inward flow client → BFF route → application
 * → domain. Depends on nothing outward (no React/Next/adapter/vendor imports).
 */
export interface HealthStatus {
  status: "ok";
}

export function getHealth(): HealthStatus {
  return { status: "ok" };
}
