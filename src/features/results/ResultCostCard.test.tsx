import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { ResultCostCard } from './ResultCostCard';
import {
  RESULT_CARD_TITLE,
  HOW_CALCULATED_EXPLAINER,
  DISCLAIMER,
} from './copy';
import { formatAudRange } from '@/lib/money-format';
import type { EstimateResult } from '@shared/schemas';

const RESULT: EstimateResult = {
  estimateId: 'est_0011223344556677',
  costMin: 2_500_000,
  costMax: 4_000_000,
  confidence: 'high',
};

function render(result: EstimateResult, itemLabels: string[]): string {
  return renderToStaticMarkup(
    <ThemeProvider theme={theme}>
      <ResultCostCard result={result} typeLabel="Internal" itemLabels={itemLabels} />
    </ThemeProvider>,
  );
}

describe('ResultCostCard (node-only structural)', () => {
  it('renders the title and the type/items summary', () => {
    const html = render(RESULT, ['Kitchen', 'Bathroom']);
    expect(html).toContain(RESULT_CARD_TITLE);
    expect(html).toContain('Internal');
    expect(html).toContain('Kitchen, Bathroom');
  });

  it('renders the formatted range figure', () => {
    const html = render(RESULT, ['Kitchen']);
    expect(html).toContain(formatAudRange(RESULT.costMin, RESULT.costMax));
  });

  it('renders the estimate range and title (no card-level live region)', () => {
    const html = render(RESULT, ['Kitchen']);
    // The card carries NO live region of its own — the persistent parent owns it.
    expect(html).not.toContain('role="status"');
    expect(html).toContain(RESULT_CARD_TITLE);
    expect(html).toContain(formatAudRange(RESULT.costMin, RESULT.costMax));
  });

  it('always shows the indicative disclaimer', () => {
    const html = render(RESULT, ['Kitchen']);
    expect(html).toContain(DISCLAIMER);
  });

  it('contains the how-it-was-calculated explainer in the expander body', () => {
    const html = render(RESULT, ['Kitchen']);
    // Under SSR the collapsed Accordion body still renders in the markup.
    expect(html).toContain(HOW_CALCULATED_EXPLAINER);
  });

  it('gives the range figure an SR-friendly "to" aria-label', () => {
    const html = render(RESULT, ['Kitchen']);
    expect(html).toContain('aria-label="$25,000 to $40,000"');
  });

  it('does not duplicate the how-calculated region id', () => {
    const html = render(RESULT, ['Kitchen']);
    const occurrences = html.split('id="how-calculated-content"').length - 1;
    expect(occurrences).toBeLessThanOrEqual(1);
  });

  it('shows the confidence label for the given level', () => {
    const html = render({ ...RESULT, confidence: 'low' }, ['Kitchen']);
    expect(html).toContain('Low confidence');
  });
});
