import { describe, it, expect } from 'vitest';
import type { ResolvedAddress } from '@server/domain/ports/address-provider';
import { formatResolvedAddress } from './format-address';

describe('formatResolvedAddress', () => {
  it('formats a resolved AU address as `street, suburb STATE postcode`', () => {
    const address: ResolvedAddress = {
      street: '100 George St',
      suburb: 'Sydney',
      state: 'NSW',
      postcode: '2000',
      geo: { lat: -33.8615, lng: 151.2055 },
    };
    expect(formatResolvedAddress(address)).toBe('100 George St, Sydney NSW 2000');
  });

  it('preserves each component verbatim for other states', () => {
    const address: ResolvedAddress = {
      street: '1 Queen St',
      suburb: 'Melbourne',
      state: 'VIC',
      postcode: '3000',
      geo: { lat: -37.8136, lng: 144.9631 },
    };
    expect(formatResolvedAddress(address)).toBe('1 Queen St, Melbourne VIC 3000');
  });
});
