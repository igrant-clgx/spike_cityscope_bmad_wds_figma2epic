import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/theme';
import { RenovationTypeSelect } from './RenovationTypeSelect';
import type { RenovationType } from '@shared/schemas';

const TYPES: RenovationType[] = [
  { id: 'internal', label: 'Internal' },
  { id: 'external', label: 'External' },
];

function render(value: string | null): string {
  return renderToStaticMarkup(
    <ThemeProvider theme={theme}>
      <RenovationTypeSelect
        types={TYPES}
        value={value}
        onSelect={() => {}}
        groupLabel="Renovation type"
      />
    </ThemeProvider>,
  );
}

const countOccurrences = (haystack: string, needle: string): number =>
  haystack.split(needle).length - 1;

describe('RenovationTypeSelect (node-only structural)', () => {
  it('renders one button per renovation type with its label', () => {
    const html = render(null);
    expect(countOccurrences(html, '<button')).toBe(TYPES.length);
    expect(html).toContain('Internal');
    expect(html).toContain('External');
  });

  it('exposes the accessible group label', () => {
    expect(render(null)).toContain('aria-label="Renovation type"');
  });

  it('marks nothing pressed when value is null', () => {
    const html = render(null);
    expect(countOccurrences(html, 'aria-pressed="true"')).toBe(0);
    expect(countOccurrences(html, 'aria-pressed="false"')).toBe(TYPES.length);
  });

  it('marks exactly one button pressed for a chosen value', () => {
    const html = render('internal');
    expect(countOccurrences(html, 'aria-pressed="true"')).toBe(1);
  });
});
