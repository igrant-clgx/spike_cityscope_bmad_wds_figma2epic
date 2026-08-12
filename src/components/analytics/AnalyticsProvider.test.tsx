import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { AnalyticsProvider, useAnalytics } from './AnalyticsProvider';
import type { AnalyticsSink } from '@server/domain/ports/analytics-sink';

/**
 * Structural + non-throwing tests WITHOUT jsdom/RTL. The provider is a smoke
 * render (children pass through); a consumer that emits during render must not
 * throw even when the sink itself throws, and `useAnalytics` outside a provider
 * must be a safe no-op.
 */
describe('AnalyticsProvider', () => {
  it('renders its children (smoke)', () => {
    const html = renderToStaticMarkup(
      <AnalyticsProvider>
        <div>ok</div>
      </AnalyticsProvider>,
    );
    expect(html).toContain('ok');
  });

  it('does not throw when the sink throws synchronously', () => {
    const throwingSink: AnalyticsSink = {
      track: () => {
        throw new Error('boom');
      },
    };

    function Consumer() {
      useAnalytics().track({ name: 'step_viewed', stepId: 's', stepIndex: 0 });
      return <div>emitted</div>;
    }

    expect(() =>
      renderToStaticMarkup(
        <AnalyticsProvider sink={throwingSink}>
          <Consumer />
        </AnalyticsProvider>,
      ),
    ).not.toThrow();
  });

  it('useAnalytics is a safe no-op outside a provider', () => {
    function Consumer() {
      useAnalytics().track({ name: 'drop_off', stepId: 's', stepIndex: 1 });
      return <div>safe</div>;
    }

    expect(() => renderToStaticMarkup(<Consumer />)).not.toThrow();
  });

  it('swallows rejection from a thenable sink that lacks .catch', async () => {
    let rejecter: ((reason: unknown) => void) | undefined;
    // A custom thenable WITHOUT a `.catch` method whose rejection would, if
    // not normalised via Promise.resolve, escape as an unhandled rejection.
    const thenableSink: AnalyticsSink = {
      track: () =>
        ({
          then: (_res: unknown, rej: (reason: unknown) => void) => {
            rejecter = rej;
          },
        }) as unknown as Promise<void>,
    };

    function Consumer() {
      useAnalytics().track({ name: 'step_viewed', stepId: 's', stepIndex: 0 });
      return <div>emitted</div>;
    }

    expect(() =>
      renderToStaticMarkup(
        <AnalyticsProvider sink={thenableSink}>
          <Consumer />
        </AnalyticsProvider>,
      ),
    ).not.toThrow();

    // `then` is invoked in a microtask when Promise.resolve adopts the
    // thenable — flush it before asserting the rejecter was captured.
    await Promise.resolve();
    expect(rejecter).toBeTypeOf('function');
    rejecter?.(new Error('async boom'));
    await Promise.resolve();
  });
});
