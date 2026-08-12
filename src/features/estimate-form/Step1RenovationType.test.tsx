import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { useForm, FormProvider } from 'react-hook-form';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { Step1RenovationType } from './Step1RenovationType';
import { stepFormDefaults, type StepFormValues } from './flow-form-values';

function Harness() {
  const methods = useForm<StepFormValues>({ defaultValues: stepFormDefaults() });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <FormProvider {...methods}>
          <Step1RenovationType />
        </FormProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('Step1RenovationType (node-only structural)', () => {
  // In SSR the config query has no data yet → the loading treatment renders.
  const html = renderToStaticMarkup(<Harness />);

  it('renders the accessible config-loading treatment while the query is pending', () => {
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('Loading renovation types');
  });
});
