import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { ToastProvider, useToast } from './ToastProvider';

/**
 * Structural + guard tests WITHOUT jsdom/RTL. The provider is a smoke render
 * (children pass through); `useToast` must throw when used outside a provider.
 */
describe('ToastProvider', () => {
  it('renders its children (smoke)', () => {
    const html = renderToStaticMarkup(
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <div>KID</div>
        </ToastProvider>
      </ThemeProvider>,
    );
    expect(html).toContain('KID');
  });

  it('useToast throws when called outside a ToastProvider', () => {
    function Consumer() {
      useToast();
      return <div>never</div>;
    }
    expect(() =>
      renderToStaticMarkup(
        <ThemeProvider theme={theme}>
          <Consumer />
        </ThemeProvider>,
      ),
    ).toThrow(/ToastProvider/);
  });
});
