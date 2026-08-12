import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { FormTextField } from './FormTextField';

/**
 * Structural render test WITHOUT jsdom/RTL: `renderToStaticMarkup` returns the
 * server-rendered HTML string. Verifies the input-error primitive renders an
 * input and always shows its inline helper text when in error (UX-DR15).
 */
describe('FormTextField', () => {
  it('renders an input element', () => {
    const html = renderToStaticMarkup(
      <ThemeProvider theme={theme}>
        <FormTextField label="Name" />
      </ThemeProvider>,
    );
    expect(html).toContain('<input');
  });

  it('renders helper text when in error state', () => {
    const html = renderToStaticMarkup(
      <ThemeProvider theme={theme}>
        <FormTextField error helperText="This field is required" />
      </ThemeProvider>,
    );
    expect(html).toContain('This field is required');
  });
});
