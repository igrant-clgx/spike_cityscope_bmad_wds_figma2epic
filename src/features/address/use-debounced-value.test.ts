import { describe, it, expect, vi, afterEach } from 'vitest';
import { createTrailingDebounce, DEBOUNCE_MS } from './use-debounced-value';

/**
 * Node-only fake-timer tests (no jsdom/RTL) of the trailing-edge debounce core
 * that backs `useDebouncedValue`. Asserts the FR-6 timing contract: ≤1 emission
 * per 300ms window and trailing-edge (last value wins) semantics.
 */
afterEach(() => {
  vi.useRealTimers();
});

describe('createTrailingDebounce', () => {
  it('defaults to a ≥300ms window', () => {
    expect(DEBOUNCE_MS).toBeGreaterThanOrEqual(300);
  });

  it('emits nothing before the window elapses', () => {
    vi.useFakeTimers();
    const emitted: string[] = [];
    const debouncer = createTrailingDebounce<string>(DEBOUNCE_MS, (v) => emitted.push(v));

    debouncer.push('syd');
    vi.advanceTimersByTime(DEBOUNCE_MS - 1);

    expect(emitted).toEqual([]);
  });

  it('emits the trailing value exactly once after the window settles', () => {
    vi.useFakeTimers();
    const emitted: string[] = [];
    const debouncer = createTrailingDebounce<string>(DEBOUNCE_MS, (v) => emitted.push(v));

    debouncer.push('s');
    debouncer.push('sy');
    debouncer.push('syd');
    vi.advanceTimersByTime(DEBOUNCE_MS);

    expect(emitted).toEqual(['syd']);
  });

  it('issues at most one emission per 300ms window during rapid typing', () => {
    vi.useFakeTimers();
    const emitted: string[] = [];
    const debouncer = createTrailingDebounce<string>(DEBOUNCE_MS, (v) => emitted.push(v));

    // Ten keystrokes 100ms apart (well under the window) → the timer keeps
    // resetting, so nothing is emitted until typing stops.
    for (let i = 1; i <= 10; i += 1) {
      debouncer.push(`q${i}`);
      vi.advanceTimersByTime(100);
    }
    expect(emitted).toEqual([]);

    vi.advanceTimersByTime(DEBOUNCE_MS);
    expect(emitted).toEqual(['q10']);
  });

  it('emits once per window across settled pauses', () => {
    vi.useFakeTimers();
    const emitted: string[] = [];
    const debouncer = createTrailingDebounce<string>(DEBOUNCE_MS, (v) => emitted.push(v));

    debouncer.push('one');
    vi.advanceTimersByTime(DEBOUNCE_MS);
    debouncer.push('two');
    vi.advanceTimersByTime(DEBOUNCE_MS);

    expect(emitted).toEqual(['one', 'two']);
  });

  it('cancel prevents a pending trailing emission', () => {
    vi.useFakeTimers();
    const emitted: string[] = [];
    const debouncer = createTrailingDebounce<string>(DEBOUNCE_MS, (v) => emitted.push(v));

    debouncer.push('pending');
    debouncer.cancel();
    vi.advanceTimersByTime(DEBOUNCE_MS * 2);

    expect(emitted).toEqual([]);
  });
});
