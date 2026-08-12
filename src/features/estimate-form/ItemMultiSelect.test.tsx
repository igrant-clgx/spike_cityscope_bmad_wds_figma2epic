import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { ItemMultiSelect } from './ItemMultiSelect';
import type { RenovationItem } from '@shared/schemas';

const ITEMS: RenovationItem[] = [
  { id: 'kitchen', typeId: 'internal', label: 'Kitchen' },
  { id: 'bathroom', typeId: 'internal', label: 'Bathroom' },
  { id: 'flooring', typeId: 'internal', label: 'Flooring' },
];

function render(selectedIds: string[]): string {
  return renderToStaticMarkup(
    <ThemeProvider theme={theme}>
      <ItemMultiSelect
        items={ITEMS}
        selectedIds={selectedIds}
        onToggle={() => {}}
        groupLabel="Items to renovate"
      />
    </ThemeProvider>,
  );
}

const countOccurrences = (haystack: string, needle: string): number =>
  haystack.split(needle).length - 1;

describe('ItemMultiSelect (node-only structural)', () => {
  it('renders one button per item with its label', () => {
    const html = render([]);
    expect(countOccurrences(html, '<button')).toBe(ITEMS.length);
    expect(html).toContain('Kitchen');
    expect(html).toContain('Bathroom');
    expect(html).toContain('Flooring');
  });

  it('exposes the accessible group label', () => {
    expect(render([])).toContain('aria-label="Items to renovate"');
  });

  it('marks nothing pressed when nothing is selected', () => {
    expect(countOccurrences(render([]), 'aria-pressed="true"')).toBe(0);
  });

  it('marks every selected item pressed (multi-select)', () => {
    const html = render(['kitchen', 'flooring']);
    expect(countOccurrences(html, 'aria-pressed="true"')).toBe(2);
  });
});
