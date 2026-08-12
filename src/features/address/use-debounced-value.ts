'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Trailing-edge debounce for the autocomplete search input (FR-6). The value is
 * only emitted once the input has settled for `delayMs`, so rapid typing issues
 * at most one downstream request per window. Default ≥300ms per the spec.
 */
export const DEBOUNCE_MS = 300;

/**
 * Framework-agnostic trailing-edge debouncer. Each `push` restarts the timer, so
 * only the LAST value within a `delayMs` window is emitted (≤1 emission/window).
 * Extracted as a pure factory so the timing contract is unit-testable with fake
 * timers without a React renderer; the hook below drives it.
 */
export function createTrailingDebounce<T>(
  delayMs: number,
  emit: (value: T) => void,
): { push: (value: T) => void; cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const push = (value: T): void => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      emit(value);
    }, delayMs);
  };

  const cancel = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return { push, cancel };
}

/**
 * Debounce a changing value on the trailing edge. Returns the latest value that
 * has been stable for `delayMs`. Backed by `createTrailingDebounce` so the hook
 * and its unit-tested core share one implementation.
 */
export function useDebouncedValue<T>(value: T, delayMs: number = DEBOUNCE_MS): T {
  const [debounced, setDebounced] = useState<T>(value);
  const debouncerRef = useRef<ReturnType<typeof createTrailingDebounce<T>>>(
    undefined as unknown as ReturnType<typeof createTrailingDebounce<T>>,
  );

  if (debouncerRef.current === undefined) {
    debouncerRef.current = createTrailingDebounce<T>(delayMs, setDebounced);
  }

  useEffect(() => {
    const debouncer = debouncerRef.current;
    debouncer.push(value);
    return () => debouncer.cancel();
  }, [value]);

  return debounced;
}
