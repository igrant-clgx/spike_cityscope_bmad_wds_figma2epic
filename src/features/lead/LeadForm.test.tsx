import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { LeadForm } from './LeadForm';
import {
  LEAD_FORM_HEADING,
  FIRST_NAME_LABEL,
  LAST_NAME_LABEL,
  EMAIL_LABEL,
  PHONE_LABEL,
  CONTACT_METHOD_LABEL,
  BEST_TIME_LABEL,
  CONSENT_LABEL,
  SUBMIT_LABEL,
  CONTACT_METHOD_OPTIONS,
} from './lead-form-copy';

function render(): string {
  return renderToStaticMarkup(
    <ThemeProvider theme={theme}>
      <LeadForm />
    </ThemeProvider>,
  );
}

describe('LeadForm', () => {
  it('renders the heading and every field label (FR-27, UX-DR12)', () => {
    const html = render();
    expect(html).toContain(LEAD_FORM_HEADING);
    expect(html).toContain(FIRST_NAME_LABEL);
    expect(html).toContain(LAST_NAME_LABEL);
    expect(html).toContain(EMAIL_LABEL);
    expect(html).toContain(PHONE_LABEL);
    expect(html).toContain(CONTACT_METHOD_LABEL);
    expect(html).toContain(BEST_TIME_LABEL);
  });

  it('renders the contact-method option labels (radios render inline)', () => {
    const html = render();
    for (const option of CONTACT_METHOD_OPTIONS) {
      expect(html).toContain(option.label);
    }
  });

  it('renders a real consent checkbox with its copy (FR-30)', () => {
    const html = render();
    expect(html).toContain('type="checkbox"');
    expect(html).toContain(CONSENT_LABEL);
  });

  it('renders a submit button DISABLED on a pristine form (FR-30 gate)', () => {
    const html = render();
    expect(html).toContain(SUBMIT_LABEL);
    // The submit button must carry the disabled attribute while pristine.
    expect(html).toMatch(/<button[^>]*disabled[^>]*>[^<]*Send my details/);
  });

  it('shows NO field errors on a pristine (untouched) form', () => {
    const html = render();
    // onTouched mode → nothing touched at first paint, so no error message text
    // or alerting helper nodes render.
    expect(html).not.toContain('at least 2 characters');
    expect(html).not.toContain('Enter a valid email');
    expect(html).not.toContain('id="lead-consent-error"');
    expect(html).not.toContain('aria-invalid="true"');
  });

  it('programmatically labels each text field via a stable id/label pair', () => {
    const html = render();
    // MUI wires the label `for`/input `id`; assert the ids are present.
    expect(html).toContain('id="lead-first-name"');
    expect(html).toContain('id="lead-email"');
    expect(html).toContain('id="lead-phone"');
    // The consent checkbox and contact-method group labelling.
    expect(html).toContain('id="lead-consent"');
    expect(html).toContain('id="lead-contact-method-label"');
  });

  it('renders the bestTime Select control (labelled combobox) even though its options are client-only', () => {
    const html = render();
    // MUI v9 Select renders a `role="combobox"` trigger in SSR; the individual
    // option labels are emitted only when the menu opens (client), so we assert
    // the control + its label, not the option text.
    expect(html).toContain('role="combobox"');
    expect(html).toContain('id="lead-best-time-label"');
  });
});
