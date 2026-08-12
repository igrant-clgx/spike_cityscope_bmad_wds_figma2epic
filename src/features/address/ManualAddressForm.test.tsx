import { describe, it, expect } from 'vitest';
import type * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { ManualAddressForm, MANUAL_FIELD_IDS } from './ManualAddressForm';
import {
  MANUAL_STREET_LABEL,
  MANUAL_SUBURB_LABEL,
  MANUAL_STATE_LABEL,
  MANUAL_POSTCODE_LABEL,
  MANUAL_POSTCODE_INVALID,
} from './copy';

const EMPTY_VALUES = { street: '', suburb: '', state: '', postcode: '' };

function render(node: React.ReactElement): string {
  return renderToStaticMarkup(<ThemeProvider theme={theme}>{node}</ThemeProvider>);
}

function form(
  overrides: Partial<React.ComponentProps<typeof ManualAddressForm>> = {},
): string {
  return render(
    <ManualAddressForm
      values={EMPTY_VALUES}
      errors={{}}
      onFieldChange={() => {}}
      {...overrides}
    />,
  );
}

describe('ManualAddressForm', () => {
  it('renders a programmatic label for every structured field', () => {
    const html = form();
    expect(html).toContain(MANUAL_STREET_LABEL);
    expect(html).toContain(MANUAL_SUBURB_LABEL);
    expect(html).toContain(MANUAL_STATE_LABEL);
    expect(html).toContain(MANUAL_POSTCODE_LABEL);
  });

  it('renders an option for each AU state/territory', () => {
    const html = form();
    for (const state of ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT']) {
      expect(html).toContain(`value="${state}"`);
    }
    expect(html).toContain('<select');
  });

  it('associates a field error with its input via aria-describedby (announced)', () => {
    const html = form({ errors: { postcode: MANUAL_POSTCODE_INVALID } });
    expect(html).toContain(MANUAL_POSTCODE_INVALID);
    expect(html).toContain(`aria-describedby="${MANUAL_FIELD_IDS.postcode}-helper-text"`);
    expect(html).toContain(`id="${MANUAL_FIELD_IDS.postcode}-helper-text"`);
  });

  it('renders provided field values', () => {
    const html = form({
      values: { street: '100 George St', suburb: 'Sydney', state: 'NSW', postcode: '2000' },
    });
    expect(html).toContain('100 George St');
    expect(html).toContain('Sydney');
  });
});
