import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { useForm, FormProvider } from 'react-hook-form';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { Step2Items } from './Step2Items';
import { stepFormDefaults, type StepFormValues } from './flow-form-values';

function Harness() {
  // Default renovationTypeId is null → the no-type branch renders deterministically.
  const methods = useForm<StepFormValues>({ defaultValues: stepFormDefaults() });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <FormProvider {...methods}>
          <Step2Items />
        </FormProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('Step2Items (node-only structural)', () => {
  const html = renderToStaticMarkup(<Harness />);

  it('prompts to choose a renovation type first when none is selected', () => {
    expect(html).toContain('role="status"');
    expect(html).toContain('Choose a renovation type first');
  });
});
