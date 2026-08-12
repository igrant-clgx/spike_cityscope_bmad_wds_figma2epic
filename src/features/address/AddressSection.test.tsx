import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { makeQueryClient } from '@/lib/query-client';
import { theme } from '@/theme';
import { AddressSection } from './AddressSection';
import { ADDRESS_EMPTY_PROMPT, ADD_ADDRESS_LABEL } from './copy';

/**
 * Node-only structural test (no jsdom/RTL). `AddressSection` is now CONTROLLED:
 * it takes `address` + `onConfirm` and owns only the local modal `open` boolean
 * (the flow-form state and reset notice moved to `EstimateFlow`). The modal is
 * closed, so its Portal body is not emitted. Wrapped in a `QueryClientProvider`
 * (the modal's suggest hook uses TanStack Query); no `ToastProvider` is needed
 * any more. Asserts the block renders its empty/initial state and the
 * keyboard-operable change control that opens the modal.
 */
describe('AddressSection', () => {
  const html = renderToStaticMarkup(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={makeQueryClient()}>
        <AddressSection address={null} onConfirm={() => {}} />
      </QueryClientProvider>
    </ThemeProvider>,
  );

  it('renders the address block in its empty/initial state', () => {
    expect(html).toContain(ADDRESS_EMPTY_PROMPT);
    expect(html).toContain(ADD_ADDRESS_LABEL);
  });

  it('renders the change control as a real button', () => {
    expect(html).toContain('<button');
    expect(html).toContain('type="button"');
  });

  it('does not leak an undefined address', () => {
    expect(html).not.toContain('undefined');
  });
});
