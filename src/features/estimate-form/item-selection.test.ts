import { describe, it, expect } from 'vitest';
import {
  filterItemsForType,
  pruneSelection,
  toggleItem,
  deriveToggledId,
} from './item-selection';
import type { RenovationItem } from '@shared/schemas';

const ITEMS: RenovationItem[] = [
  { id: 'kitchen', typeId: 'internal', label: 'Kitchen' },
  { id: 'bathroom', typeId: 'internal', label: 'Bathroom' },
  { id: 'roofing', typeId: 'external', label: 'Roofing' },
];

describe('filterItemsForType', () => {
  it('returns only items whose typeId matches', () => {
    expect(filterItemsForType(ITEMS, 'internal').map((i) => i.id)).toEqual([
      'kitchen',
      'bathroom',
    ]);
    expect(filterItemsForType(ITEMS, 'external').map((i) => i.id)).toEqual([
      'roofing',
    ]);
  });

  it('returns [] when no type is chosen', () => {
    expect(filterItemsForType(ITEMS, null)).toEqual([]);
  });

  it('treats an empty-string type as no type chosen', () => {
    expect(filterItemsForType(ITEMS, '')).toEqual([]);
  });

  it('returns [] when the type matches no items', () => {
    expect(filterItemsForType(ITEMS, 'unknown')).toEqual([]);
  });
});

describe('pruneSelection', () => {
  const internal = filterItemsForType(ITEMS, 'internal');

  it('drops selected ids not in the available set, preserving order', () => {
    expect(pruneSelection(['bathroom', 'roofing', 'kitchen'], internal)).toEqual([
      'bathroom',
      'kitchen',
    ]);
  });

  it('keeps all ids when every one is available', () => {
    expect(pruneSelection(['kitchen', 'bathroom'], internal)).toEqual([
      'kitchen',
      'bathroom',
    ]);
  });

  it('drops everything when the available set is empty', () => {
    expect(pruneSelection(['kitchen'], [])).toEqual([]);
  });
});

describe('toggleItem', () => {
  it('adds an absent id (appended)', () => {
    expect(toggleItem(['kitchen'], 'bathroom')).toEqual(['kitchen', 'bathroom']);
  });

  it('removes a present id, preserving the order of the rest', () => {
    expect(toggleItem(['kitchen', 'bathroom', 'roofing'], 'bathroom')).toEqual([
      'kitchen',
      'roofing',
    ]);
  });

  it('adds to an empty selection', () => {
    expect(toggleItem([], 'kitchen')).toEqual(['kitchen']);
  });
});

describe('deriveToggledId', () => {
  it('returns the added id', () => {
    expect(deriveToggledId(['kitchen'], ['kitchen', 'bathroom'])).toBe('bathroom');
  });

  it('returns the removed id', () => {
    expect(deriveToggledId(['kitchen', 'bathroom'], ['kitchen'])).toBe('bathroom');
  });

  it('returns the removed id when the last selection is cleared', () => {
    expect(deriveToggledId(['kitchen'], [])).toBe('kitchen');
  });

  it('returns undefined when nothing changed', () => {
    expect(deriveToggledId(['kitchen'], ['kitchen'])).toBeUndefined();
  });

  it('prefers the first added id on a bulk change (well-defined)', () => {
    expect(deriveToggledId(['kitchen'], ['bathroom', 'roofing'])).toBe('bathroom');
  });
});
