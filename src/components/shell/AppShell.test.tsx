import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { AppShell } from './AppShell';
import { PRODUCT_NAME, PARTNER_NAME } from './copy';

/**
 * Structural render test WITHOUT jsdom/RTL: `renderToStaticMarkup` returns the
 * server-rendered HTML string, which we assert against directly. Covers the
 * a11y-landmark rows of the I/O matrix plus brand-marks, disclaimer, and that
 * children land inside the main slot.
 */
describe('AppShell', () => {
  const html = renderToStaticMarkup(
    <ThemeProvider theme={theme}>
      <AppShell>
        <div>CHILD_MARKER_123</div>
      </AppShell>
    </ThemeProvider>,
  );

  it('renders the semantic landmarks', () => {
    expect(html).toContain('<header');
    expect(html).toContain('<main');
    expect(html).toContain('<footer');
  });

  it('renders both brand-mark accessible names', () => {
    expect(html).toContain(`aria-label="${PRODUCT_NAME}"`);
    expect(html).toContain(`aria-label="${PARTNER_NAME}"`);
    expect(html).toContain(PRODUCT_NAME);
    expect(html).toContain(PARTNER_NAME);
  });

  it('renders the constant disclaimer', () => {
    expect(html).toContain('indicative only');
    expect(html).toContain('not financial advice');
  });

  it('renders children inside the shell', () => {
    expect(html).toContain('CHILD_MARKER_123');
  });
});
