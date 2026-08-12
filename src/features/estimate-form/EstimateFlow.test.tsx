import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { makeQueryClient } from '@/lib/query-client';
import { ToastProvider } from '@/components/feedback';
import { theme } from '@/theme';
import { EstimateFlow } from './EstimateFlow';
import { ADDRESS_EMPTY_PROMPT } from '@/features/address/copy';
import { STEP_META } from './step-state';

/**
 * Node-only structural test (no jsdom/RTL). `EstimateFlow` composes the
 * controlled address section (empty prompt shown, modal closed) with the
 * FormProvider-wrapped stepper. Wrapped in Query (modal suggest hook), Toast
 * (change-path notice), and Theme providers.
 */
describe('EstimateFlow', () => {
  const html = renderToStaticMarkup(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={makeQueryClient()}>
        <ToastProvider>
          <EstimateFlow />
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>,
  );

  it('renders the address section in its empty/initial state', () => {
    expect(html).toContain(ADDRESS_EMPTY_PROMPT);
  });

  it('renders the estimate stepper steps', () => {
    expect(html).toContain(STEP_META.type.title);
    expect(html).toContain(STEP_META.items.title);
    expect(html).toContain(STEP_META.details.title);
  });

  it('does not leak an undefined value', () => {
    expect(html).not.toContain('undefined');
  });
});
