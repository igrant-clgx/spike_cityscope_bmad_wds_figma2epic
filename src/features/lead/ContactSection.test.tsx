import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { ContactSection } from './ContactSection';
import {
  CALL_CTA_LABEL,
  CONTACT_HEADING,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from './contact-copy';

function render(): string {
  return renderToStaticMarkup(
    <ThemeProvider theme={theme}>
      <ContactSection />
    </ThemeProvider>,
  );
}

describe('ContactSection', () => {
  it('presents the low-pressure coach heading and CTA (FR-26, UX-DR11)', () => {
    const html = render();
    expect(html).toContain(CONTACT_HEADING);
    expect(html).toContain(CALL_CTA_LABEL);
    expect(html).toContain(CONTACT_PHONE_DISPLAY);
  });

  it('renders a tel: link with a spaceless digits-only target', () => {
    const html = render();
    expect(html).toContain(`href="tel:${CONTACT_PHONE_TEL}"`);
    expect(CONTACT_PHONE_TEL).not.toMatch(/\s/);
    // Guard against an accidental empty/whitespace display number → dead tel: link.
    expect(CONTACT_PHONE_TEL).toMatch(/^\d{6,}$/);
  });

  it('marks the phone icon decorative (aria-hidden, not focusable)', () => {
    const html = render();
    expect(html).toContain('aria-hidden');
    expect(html).toContain('<svg');
    expect(html).toContain('focusable="false"');
  });

  it('uses honest, low-pressure voice — never a quote-funnel framing (UX-DR17)', () => {
    const html = render().toLowerCase();
    expect(html).not.toContain('free');
    expect(html).not.toContain('quote now');
    expect(html).toContain('no pressure');
  });
});
