import { describe, it, expect } from 'vitest';
import type * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import type { ResolvedAddress } from '@server/domain/ports/address-provider';
import { theme } from '@/theme';
import { AddressBlock } from './AddressBlock';
import {
  ADDRESS_BLOCK_HEADING,
  ADDRESS_EMPTY_PROMPT,
  ADD_ADDRESS_LABEL,
  CHANGE_ADDRESS_LABEL,
} from './copy';

/**
 * Node-only structural render tests (no jsdom/RTL): `renderToStaticMarkup`
 * returns the SSR HTML string asserted directly. Covers FR-4 (current address
 * shown), the empty/initial prompt, and FR-5/UX-DR9 (keyboard-operable
 * `<button>` control with an accessible name).
 */
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

describe('AddressBlock', () => {
  it('renders the current formatted address and the change control', () => {
    const html = render(<AddressBlock address={sampleAddress} />);
    expect(html).toContain('100 George St, Sydney NSW 2000');
    expect(html).toContain(CHANGE_ADDRESS_LABEL);
  });

  it('renders the empty/initial prompt and the add control when no address is set', () => {
    const html = render(<AddressBlock address={null} />);
    expect(html).toContain(ADDRESS_EMPTY_PROMPT);
    expect(html).toContain(ADD_ADDRESS_LABEL);
    expect(html).not.toContain('undefined');
  });

  it('exposes the control as a real, focusable button', () => {
    const html = render(<AddressBlock address={sampleAddress} />);
    expect(html).toContain('<button');
    expect(html).toContain('type="button"');
  });

  it('labels the block region for assistive tech', () => {
    const html = render(<AddressBlock address={null} />);
    expect(html).toContain(`aria-label="${ADDRESS_BLOCK_HEADING}"`);
    expect(html).toContain('<section');
  });
});
