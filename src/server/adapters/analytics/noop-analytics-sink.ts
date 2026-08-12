/**
 * No-op/stub AnalyticsSink adapter (Story 1.5, AD-12).
 *
 * A pure module: no external I/O, no server-only deps. `track` resolves without
 * side effects. As a belt-and-braces privacy guard, in non-production it scans
 * event keys (and one level of nested object values) for forbidden PII keys and
 * `console.error`s — but NEVER throws — so a caller who bypasses the types still
 * cannot leak PII silently.
 */
import {
  FORBIDDEN_PII_KEYS,
  type AnalyticsEvent,
  type AnalyticsSink,
} from "@server/domain/ports/analytics-sink";

function scanForPII(event: AnalyticsEvent): void {
  const forbidden = new Set<string>(FORBIDDEN_PII_KEYS);
  const eventName = String((event as { name?: unknown }).name);
  const seen = new WeakSet<object>();

  // Fully recursive walk: catches PII keys at any depth and inside arrays /
  // arrays-of-objects, not just one nested level. `seen` guards cycles.
  const walk = (value: unknown, path: string, isTopLevel: boolean): void => {
    if (value === null || typeof value !== "object") return;
    if (seen.has(value)) return;
    seen.add(value);

    if (Array.isArray(value)) {
      value.forEach((item, i) => walk(item, `${path}[${i}]`, false));
      return;
    }

    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      // `name` is the event discriminant (a fixed event-name literal), not a
      // person's name — exempt ONLY at the top level; nested `name` is checked.
      const exempt = isTopLevel && key === "name";
      if (!exempt && forbidden.has(key)) {
        const where = path ? `${path}.${key}` : key;
        console.error(
          `[analytics] Forbidden PII key "${where}" on event "${eventName}" — events must never carry PII.`,
        );
      }
      walk(nested, path ? `${path}.${key}` : key, false);
    }
  };

  walk(event, "", true);
}

export function createNoopAnalyticsSink(): AnalyticsSink {
  return {
    track(event: AnalyticsEvent): Promise<void> {
      if (process.env.NODE_ENV !== "production") {
        try {
          scanForPII(event);
        } catch {
          // A guard must never disrupt emission.
        }
      }
      return Promise.resolve();
    },
  };
}
