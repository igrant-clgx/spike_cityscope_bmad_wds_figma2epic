'use client';

import * as React from 'react';
import type {
  AnalyticsEvent,
  AnalyticsSink,
} from '@server/domain/ports/analytics-sink';
import { createNoopAnalyticsSink } from '@server/adapters/analytics/noop-analytics-sink';

/**
 * Client emission seam for the typed AnalyticsSink (Story 1.5, AD-12).
 *
 * Mirrors the ToastProvider style: a React context exposing a single
 * fire-and-forget `track`. Unlike `useToast`, `useAnalytics()` NEVER throws
 * outside a provider — it falls back to a safe no-op — and `track` swallows
 * both synchronous throws and rejected promises from the sink so a failing
 * sink can never surface an error into the UI.
 */

interface AnalyticsContextValue {
  track: (event: AnalyticsEvent) => void;
}

/** Safe no-op used both as the context default and as a fire-and-forget guard. */
function noop(): void {
  // intentionally empty
}

const AnalyticsContext = React.createContext<AnalyticsContextValue>({
  track: noop,
});

export interface AnalyticsProviderProps {
  children: React.ReactNode;
  sink?: AnalyticsSink;
}

export function AnalyticsProvider({ children, sink }: AnalyticsProviderProps) {
  // A stable no-op sink for renders where no explicit sink is supplied. Using a
  // ref keeps it referentially stable without re-creating it each render.
  const defaultSinkRef = React.useRef<AnalyticsSink | null>(null);
  if (defaultSinkRef.current === null) {
    defaultSinkRef.current = createNoopAnalyticsSink();
  }
  // Resolve the active sink every render (no render-time mutation): an explicit
  // sink wins, and removing the prop deterministically reverts to the no-op.
  const activeSink = sink ?? defaultSinkRef.current;
  const sinkRef = React.useRef<AnalyticsSink>(activeSink);
  sinkRef.current = activeSink;

  const track = React.useCallback((event: AnalyticsEvent) => {
    try {
      // `Promise.resolve` normalises non-promises AND thenables that lack a
      // `.catch`, so a rejected custom thenable can never escape as an
      // unhandled rejection.
      Promise.resolve(sinkRef.current.track(event)).catch((err: unknown) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[analytics] sink.track rejected', err);
        }
      });
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[analytics] sink.track threw', err);
      }
    }
  }, []);

  const value = React.useMemo<AnalyticsContextValue>(() => ({ track }), [track]);

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

/**
 * Access the analytics API. Safe to call outside a provider — returns a no-op
 * `track` so emission never throws.
 */
export function useAnalytics(): AnalyticsContextValue {
  return React.useContext(AnalyticsContext);
}
