import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { makeQueryClient } from '@/lib/query-client';
import { theme } from '@/theme';
import { AddressSection } from './AddressSection';
import { ADDRESS_EMPTY_PROMPT, ADD_ADDRESS_LABEL } from './copy';

/**
 * Node-only structural test (no jsdom/RTL). The container owns the flow-form
 * state and mounts the display block (the modal is closed, so its Portal body is
 * not emitted). Wrapped in a `QueryClientProvider` because the modal's suggest
 * hook uses TanStack Query. Asserts the block renders its empty/initial state
 * and the keyboard-operable change control that opens the modal.
 */
describe('AddressSection', () => {
  const html = renderToStaticMarkup(
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={makeQueryClient()}>
        <AddressSection />
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
