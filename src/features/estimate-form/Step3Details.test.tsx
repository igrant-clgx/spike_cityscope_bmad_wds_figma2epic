import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { useForm, FormProvider } from 'react-hook-form';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { Step3Details } from './Step3Details';
import { stepFormDefaults, type StepFormValues } from './flow-form-values';
import { ok, err, type FormConfig } from '@shared/schemas';

const CONFIG: FormConfig = {
  configVersion: 'v1',
  renovationTypes: [{ id: 'internal', label: 'Internal' }],
  items: [{ id: 'item-1', typeId: 'internal', label: 'Kitchen' }],
  questions: [
    {
      id: 'q1',
      label: 'Any special notes',
      kind: 'text',
      required: false,
      appliesToItemIds: undefined,
    },
  ],
};

function makeClient(): QueryClient {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function Harness({
  client,
  selectedItemIds = [],
}: {
  client: QueryClient;
  selectedItemIds?: string[];
}) {
  const methods = useForm<StepFormValues>({
    defaultValues: { ...stepFormDefaults(), selectedItemIds },
  });
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <FormProvider {...methods}>
          <Step3Details />
        </FormProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe('Step3Details (node-only structural)', () => {
  it('prompts to select items first when nothing is selected', () => {
    const html = renderToStaticMarkup(<Harness client={makeClient()} />);
    expect(html).toContain('role="status"');
    expect(html).toContain('renovating first to see the property details');
  });

  it('renders the filtered question fields when config resolves ready', () => {
    const client = makeClient();
    // Prime the cache so useFormConfig() returns the success envelope on SSR.
    client.setQueryData(['config', 'form'], ok(CONFIG));
    const html = renderToStaticMarkup(
      <Harness client={client} selectedItemIds={['item-1']} />,
    );
    expect(html).toContain('Any special notes');
  });

  it('renders an error Alert when the config envelope fails', () => {
    const client = makeClient();
    client.setQueryData(['config', 'form'], err('config_error', 'boom'));
    const html = renderToStaticMarkup(
      <Harness client={client} selectedItemIds={['item-1']} />,
    );
    expect(html).toContain('MuiAlert-message');
    expect(html).toContain('MuiAlert-colorError');
    expect(html).toContain('load the questions. Please try again.');
  });
});
