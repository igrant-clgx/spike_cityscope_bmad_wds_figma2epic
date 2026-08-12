import { describe, it, expect } from 'vitest';
import type * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import type { AddressPrediction } from '@shared/schemas';
import type { ResolvedAddress } from '@server/domain/ports/address-provider';
import { theme } from '@/theme';
import { AddressModalBody } from './AddressModal';
import {
  ADDRESS_MODAL_TITLE,
  ADDRESS_SEARCH_LABEL,
  ADDRESS_LOOKUP_LOADING,
  ADDRESS_NO_RESULTS,
  ADDRESS_CONFIRM_LABEL,
  ADDRESS_CANCEL_LABEL,
} from './copy';

/**
 * Node-only structural / a11y tests (no jsdom/RTL). MUI `Dialog` renders its
 * body through a Portal, which `renderToStaticMarkup` does not emit — so we
 * render the extracted presentational `AddressModalBody` directly (the same node
 * MUI mounts inside the labelled, focus-trapped dialog at runtime). Focus trap +
 * focus-return are delegated to MUI and covered by a documented manual a11y
 * check per the spec's interaction-testing decision.
 */
const TITLE_ID = 'address-modal-title';

const samplePredictions: AddressPrediction[] = [
  { addressId: 'a1', label: '100 George St, Sydney NSW 2000' },
  { addressId: 'a2', label: '200 George St, Sydney NSW 2000' },
];

const sampleAddress: ResolvedAddress = {
  street: '100 George St',
  suburb: 'Sydney',
  state: 'NSW',
  postcode: '2000',
  geo: { lat: -33.8615, lng: 151.2055 },
};

function render(node: React.ReactElement): string {
  return renderToStaticMarkup(<ThemeProvider theme={theme}>{node}</ThemeProvider>);
}

function body(overrides: Partial<React.ComponentProps<typeof AddressModalBody>> = {}) {
  return render(
    <AddressModalBody
      titleId={TITLE_ID}
      query=""
      onQueryChange={() => {}}
      predictions={[]}
      isLookupLoading={false}
      selectedId={null}
      onSelectPrediction={() => {}}
      resolvedAddress={null}
      isResolving={false}
      onConfirm={() => {}}
      onCancel={() => {}}
      {...overrides}
    />,
  );
}

describe('AddressModalBody', () => {
  it('renders the dialog title that labels the dialog', () => {
    const html = body();
    expect(html).toContain(ADDRESS_MODAL_TITLE);
    expect(html).toContain(`id="${TITLE_ID}"`);
  });

  it('renders a programmatically-labelled search field', () => {
    const html = body();
    expect(html).toContain('<input');
    expect(html).toContain(`aria-label="${ADDRESS_SEARCH_LABEL}"`);
    expect(html).toContain(ADDRESS_SEARCH_LABEL);
  });

  it('renders Confirm and Cancel as buttons with accessible names', () => {
    const html = body();
    expect(html).toContain('<button');
    expect(html).toContain(ADDRESS_CONFIRM_LABEL);
    expect(html).toContain(ADDRESS_CANCEL_LABEL);
  });

  it('disables Confirm until a prediction has resolved', () => {
    const html = body({ resolvedAddress: null });
    // The contained (Confirm) button carries the disabled attribute.
    expect(html).toMatch(/<button[^>]*disabled/);
  });

  it('enables Confirm once a structured address is resolved', () => {
    const html = body({ resolvedAddress: sampleAddress });
    // Confirm is the only disable-able control; with a resolved address and no
    // in-flight resolve, no button is disabled.
    expect(html).toContain(ADDRESS_CONFIRM_LABEL);
    expect(html).not.toMatch(/<button[^>]*disabled/);
  });

  it('shows the inline lookup-loading text while a lookup is in flight', () => {
    const html = body({ isLookupLoading: true });
    expect(html).toContain(ADDRESS_LOOKUP_LOADING);
  });

  it('renders each prediction as a keyboard-operable list item', () => {
    const html = body({ predictions: samplePredictions });
    expect(html).toContain('100 George St, Sydney NSW 2000');
    expect(html).toContain('200 George St, Sydney NSW 2000');
  });

  it('shows no predictions and no "no results" for a short query (< 3 chars)', () => {
    const html = body({ query: 'sy', predictions: [] });
    expect(html).not.toContain(ADDRESS_NO_RESULTS);
    expect(html).not.toContain('George St');
  });

  it('shows the "no results" message for a settled valid query with no matches', () => {
    const html = body({ query: 'zzzzz', predictions: [], isLookupLoading: false });
    expect(html).toContain(ADDRESS_NO_RESULTS);
  });

  it('does not show "no results" while a lookup is still loading', () => {
    const html = body({ query: 'zzzzz', predictions: [], isLookupLoading: true });
    expect(html).not.toContain(ADDRESS_NO_RESULTS);
    expect(html).toContain(ADDRESS_LOOKUP_LOADING);
  });
});
