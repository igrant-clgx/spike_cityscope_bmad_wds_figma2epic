import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/theme';
import { LeadPanel, LeadPanelView, leadSubmittedEvent } from './LeadPanel';
import type { LeadView } from './lead-view-state';
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider';
import { LEAD_FORM_HEADING, SUBMIT_LABEL } from './lead-form-copy';
import {
  LEAD_DISABLED_SUBMIT_HELP,
  LEAD_ERROR_TITLE,
  LEAD_RETRY_LABEL,
  LEAD_SUBMITTING_ANNOUNCEMENT,
  LEAD_SUCCESS_ANNOUNCEMENT,
  LEAD_SUCCESS_MESSAGE,
  LEAD_SUCCESS_TITLE,
} from './lead-panel-copy';
import { FORBIDDEN_PII_KEYS } from '@server/domain/ports/analytics-sink';

/**
 * Node-only structural tests (no jsdom/RTL) for the lead surface. The pure
 * `LeadPanelView` is rendered per `LeadView` state via `renderToStaticMarkup`;
 * the persistent live region is asserted in EVERY state; success replaces the
 * form; error offers a retry; and the pure `lead_submitted` event builder is
 * asserted PII-free (AD-12).
 */

function renderView(view: LeadView): string {
  return renderToStaticMarkup(
    <ThemeProvider theme={theme}>
      <LeadPanelView view={view} onSubmit={() => {}} onRetry={() => {}} />
    </ThemeProvider>,
  );
}

describe('LeadPanelView (node-only structural, full I/O matrix)', () => {
  it('form: renders the LeadForm with a persistent live region', () => {
    const html = renderView({ kind: 'form', announce: '' });
    expect(html).toContain(LEAD_FORM_HEADING);
    expect(html).toContain(SUBMIT_LABEL);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    // Disabled-submit helper explains the pristine-disabled button (EH#3).
    expect(html).toContain(LEAD_DISABLED_SUBMIT_HELP);
  });

  it('submitting: keeps the form mounted, disabled, with aria-busy live region', () => {
    const html = renderView({
      kind: 'submitting',
      announce: LEAD_SUBMITTING_ANNOUNCEMENT,
    });
    expect(html).toContain(LEAD_FORM_HEADING);
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain(LEAD_SUBMITTING_ANNOUNCEMENT);
    // The submit is disabled while submitting (duplicate prevented).
    expect(html).toContain('disabled');
  });

  it('success: shows the confirmation and REPLACES the form', () => {
    const html = renderView({
      kind: 'success',
      leadId: 'lead_abc',
      announce: LEAD_SUCCESS_ANNOUNCEMENT,
    });
    expect(html).toContain(LEAD_SUCCESS_TITLE);
    expect(html).toContain(LEAD_SUCCESS_MESSAGE);
    expect(html).toContain(LEAD_SUCCESS_ANNOUNCEMENT);
    // The form is gone — no second submit is possible.
    expect(html).not.toContain(LEAD_FORM_HEADING);
    expect(html).not.toContain(SUBMIT_LABEL);
    // Live region still present.
    expect(html).toContain('role="status"');
  });

  it('error: non-destructive message + Try again, form still mounted (data preserved)', () => {
    const html = renderView({
      kind: 'error',
      message: 'Something went wrong.',
      announce: 'We couldn\u2019t send your details. Please try again.',
    });
    expect(html).toContain(LEAD_ERROR_TITLE);
    expect(html).toContain('Something went wrong.');
    expect(html).toContain(LEAD_RETRY_LABEL);
    // The form stays mounted so rhf state (entered data) is preserved.
    expect(html).toContain(LEAD_FORM_HEADING);
    expect(html).toContain('role="status"');
    expect(html).toContain('We couldn\u2019t send your details. Please try again.');
  });

  it('every state mounts exactly one persistent live region', () => {
    const states: LeadView[] = [
      { kind: 'form', announce: '' },
      { kind: 'submitting', announce: LEAD_SUBMITTING_ANNOUNCEMENT },
      { kind: 'success', leadId: 'l', announce: LEAD_SUCCESS_ANNOUNCEMENT },
      { kind: 'error', message: 'x', announce: 'y' },
    ];
    for (const view of states) {
      const html = renderView(view);
      expect(html.match(/aria-live="polite"/g)).toHaveLength(1);
    }
  });
});

describe('leadSubmittedEvent (AD-12: leadId + contactMethod, NEVER PII)', () => {
  it('carries only the leadId and contact-method category', () => {
    const event = leadSubmittedEvent({ contactMethod: 'phone' }, 'lead_abc');
    expect(event).toEqual({
      name: 'lead_submitted',
      leadId: 'lead_abc',
      contactMethod: 'phone',
    });
  });

  it('contains NO forbidden PII keys', () => {
    const event = leadSubmittedEvent({ contactMethod: 'email' }, 'lead_xyz');
    const keys = Object.keys(event);
    for (const forbidden of FORBIDDEN_PII_KEYS) {
      if (forbidden === 'name') continue; // `name` is the event discriminant.
      expect(keys).not.toContain(forbidden);
    }
    expect(keys).not.toContain('firstName');
    expect(keys).not.toContain('email');
    expect(keys).not.toContain('phone');
  });
});

describe('LeadPanel (wired, form at rest)', () => {
  function render(): string {
    return renderToStaticMarkup(
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={new QueryClient()}>
          <AnalyticsProvider>
            <LeadPanel estimateId="est_0123456789abcdef" />
          </AnalyticsProvider>
        </QueryClientProvider>
      </ThemeProvider>,
    );
  }

  it('renders the form at rest with the live region mounted', () => {
    const html = render();
    expect(html).toContain(LEAD_FORM_HEADING);
    expect(html).toContain(SUBMIT_LABEL);
    expect(html).toContain('role="status"');
  });

  it('is SSR-safe even without an AnalyticsProvider (useAnalytics no-op default)', () => {
    expect(() =>
      renderToStaticMarkup(
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={new QueryClient()}>
            <LeadPanel estimateId="est_0123456789abcdef" />
          </QueryClientProvider>
        </ThemeProvider>,
      ),
    ).not.toThrow();
  });
});
