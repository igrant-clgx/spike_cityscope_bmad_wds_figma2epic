import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/theme';
import { ResultsPanel, ResultsPanelView, REVEAL_MS } from './ResultsPanel';
import { resolveDuration } from '@/components/feedback';
import type { ResultsView } from './results-view-state';
import type { StepFormValues } from '@/features/estimate-form/flow-form-values';
import type { EstimateResult, FormConfig } from '@shared/schemas';
import { formatAudRange } from '@/lib/money-format';
import {
  CALCULATE_CTA_LABEL,
  EDIT_ESTIMATE_LABEL,
  ERROR_TITLE,
  IDLE_PROMPT,
  LOADING_MESSAGE,
  LOW_CONFIDENCE_MESSAGE,
  NEW_ESTIMATE_LABEL,
  RESULT_CARD_TITLE,
} from './copy';
import { CONTACT_HEADING } from '@/features/lead/contact-copy';

const RESULT: EstimateResult = {
  estimateId: 'est_1',
  costMin: 2_000_000,
  costMax: 3_000_000,
  confidence: 'high',
};

function renderView(
  view: ResultsView,
  props: Partial<Parameters<typeof ResultsPanelView>[0]> = {},
): string {
  return renderToStaticMarkup(
    <ThemeProvider theme={theme}>
      <ResultsPanelView
        view={view}
        typeLabel="Internal"
        itemLabels={['Kitchen']}
        ctaDisabled={false}
        onCalculate={() => {}}
        onRetry={() => {}}
        onEdit={() => {}}
        onNewEstimate={() => {}}
        {...props}
      />
    </ThemeProvider>,
  );
}

describe('ResultsPanelView (node-only structural, full I/O matrix)', () => {
  it('idle: shows the prompt + calculate CTA and a persistent live region', () => {
    const html = renderView({ kind: 'idle', announce: '' });
    expect(html).toContain(IDLE_PROMPT);
    expect(html).toContain(CALCULATE_CTA_LABEL);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });

  it('idle: disables the CTA when told to (config not loaded)', () => {
    const html = renderView({ kind: 'idle', announce: '' }, { ctaDisabled: true });
    expect(html).toContain('disabled');
  });

  it('loading: shows role="status" aria-busy="true" and the loading copy', () => {
    const html = renderView({ kind: 'loading', announce: 'Calculating your estimate\u2026' });
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain(LOADING_MESSAGE);
    expect(html).toContain('Calculating your estimate\u2026');
  });

  it('success: reveals the ResultCostCard with the formatted range', () => {
    const html = renderView({
      kind: 'success',
      result: RESULT,
      announce: 'Your estimate is ready.',
    });
    expect(html).toContain(RESULT_CARD_TITLE);
    expect(html).toContain(formatAudRange(RESULT.costMin, RESULT.costMax));
    // The persistent live region announces the arrival AND the dollar range.
    expect(html).toContain(
      `Your estimate is ready. ${formatAudRange(RESULT.costMin, RESULT.costMax)}.`,
    );
  });

  it('lowConfidence: shows the humble message AND the range (never omits it)', () => {
    const low = { ...RESULT, confidence: 'low' as const };
    const html = renderView({
      kind: 'lowConfidence',
      result: low,
      announce: 'An early, rough estimate is ready.',
    });
    expect(html).toContain(LOW_CONFIDENCE_MESSAGE);
    expect(html).toContain(RESULT_CARD_TITLE);
    expect(html).toContain(formatAudRange(low.costMin, low.costMax));
  });

  it('error: shows a non-destructive message with a retry and a live region', () => {
    const html = renderView({
      kind: 'error',
      message: 'Something went wrong.',
      announce: 'We couldn\u2019t work out your estimate. Please try again.',
    });
    expect(html).toContain(ERROR_TITLE);
    expect(html).toContain('Something went wrong.');
    expect(html).toContain('Try again');
    // The persistent live region is present in the error state too.
    expect(html).toContain('role="status"');
    expect(html).toContain('We couldn\u2019t work out your estimate. Please try again.');
  });

  it('success: renders Edit (outlined) + New (contained) actions below the card', () => {
    const html = renderView({
      kind: 'success',
      result: RESULT,
      announce: 'Your estimate is ready.',
    });
    expect(html).toContain(EDIT_ESTIMATE_LABEL);
    expect(html).toContain(NEW_ESTIMATE_LABEL);
    expect(html).toContain('MuiButton-outlined');
    expect(html).toContain('MuiButton-contained');
  });

  it('lowConfidence: also renders the Edit + New actions', () => {
    const low = { ...RESULT, confidence: 'low' as const };
    const html = renderView({
      kind: 'lowConfidence',
      result: low,
      announce: 'An early, rough estimate is ready.',
    });
    expect(html).toContain(EDIT_ESTIMATE_LABEL);
    expect(html).toContain(NEW_ESTIMATE_LABEL);
  });

  it('idle/loading/error: does NOT render the Edit/New actions', () => {
    const idle = renderView({ kind: 'idle', announce: '' });
    const loading = renderView({ kind: 'loading', announce: '' });
    const error = renderView({ kind: 'error', message: 'x', announce: '' });
    for (const html of [idle, loading, error]) {
      expect(html).not.toContain(EDIT_ESTIMATE_LABEL);
      expect(html).not.toContain(NEW_ESTIMATE_LABEL);
    }
  });

  it('success/lowConfidence: renders the Contact Section coach CTA (FR-26)', () => {
    const success = renderView({
      kind: 'success',
      result: RESULT,
      announce: 'Your estimate is ready.',
    });
    const low = renderView({
      kind: 'lowConfidence',
      result: { ...RESULT, confidence: 'low' as const },
      announce: 'An early, rough estimate is ready.',
    });
    for (const html of [success, low]) {
      expect(html).toContain(CONTACT_HEADING);
      expect(html).toContain('href="tel:');
    }
  });

  it('idle/loading/error: does NOT render the Contact Section', () => {
    const idle = renderView({ kind: 'idle', announce: '' });
    const loading = renderView({ kind: 'loading', announce: '' });
    const error = renderView({ kind: 'error', message: 'x', announce: '' });
    for (const html of [idle, loading, error]) {
      expect(html).not.toContain(CONTACT_HEADING);
      expect(html).not.toContain('href="tel:');
    }
  });

  it('collapses the reveal under reduced motion (duration resolves to 0)', () => {
    // Motion signal, not content presence: the reveal band collapses to 0ms.
    expect(resolveDuration(REVEAL_MS, true)).toBe(0);
    expect(resolveDuration(REVEAL_MS, false)).toBe(REVEAL_MS);
    // And the view still renders the content when handed a 0ms reveal.
    const html = renderView(
      { kind: 'success', result: RESULT, announce: 'Your estimate is ready.' },
      { revealMs: 0 },
    );
    expect(html).toContain(RESULT_CARD_TITLE);
  });
});

describe('ResultsPanel (wired, idle at rest)', () => {
  const config: FormConfig = {
    configVersion: 'v1',
    renovationTypes: [{ id: 'internal', label: 'Internal' }],
    items: [{ id: 'kitchen', typeId: 'internal', label: 'Kitchen' }],
    questions: [],
  };
  const scope: StepFormValues = {
    renovationTypeId: 'internal',
    selectedItemIds: ['kitchen'],
    propertyDetails: {},
  };

  function render(cfg: FormConfig | undefined): string {
    return renderToStaticMarkup(
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={new QueryClient()}>
          <ResultsPanel config={cfg} getScope={() => scope} onNewEstimate={() => {}} />
        </QueryClientProvider>
      </ThemeProvider>,
    );
  }

  function renderWithScope(
    cfg: FormConfig | undefined,
    s: StepFormValues,
  ): string {
    return renderToStaticMarkup(
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={new QueryClient()}>
          <ResultsPanel config={cfg} getScope={() => s} onNewEstimate={() => {}} />
        </QueryClientProvider>
      </ThemeProvider>,
    );
  }

  it('renders the idle CTA at rest with the live region mounted', () => {
    const html = render(config);
    expect(html).toContain(CALCULATE_CTA_LABEL);
    expect(html).toContain('role="status"');
  });

  it('disables the CTA while config is undefined', () => {
    const html = render(undefined);
    expect(html).toContain(CALCULATE_CTA_LABEL);
    expect(html).toContain('disabled');
  });

  it('disables the CTA when no items are selected (empty scope)', () => {
    const html = renderWithScope(config, {
      renovationTypeId: 'internal',
      selectedItemIds: [],
      propertyDetails: {},
    });
    expect(html).toContain(CALCULATE_CTA_LABEL);
    expect(html).toContain('disabled');
  });
});
