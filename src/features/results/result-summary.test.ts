import { describe, it, expect } from 'vitest';
import { buildSummaryLine } from './result-summary';

describe('buildSummaryLine (pure)', () => {
  it('joins type and items with a middle-dot separator', () => {
    expect(buildSummaryLine('Internal', ['Kitchen', 'Bathroom'])).toBe(
      'Internal \u00b7 Kitchen, Bathroom',
    );
  });

  it('renders a single item without a trailing comma', () => {
    expect(buildSummaryLine('Internal', ['Kitchen'])).toBe('Internal \u00b7 Kitchen');
  });

  it('omits the separator when there are no items', () => {
    expect(buildSummaryLine('External', [])).toBe('External');
  });

  it('trims and drops blank item labels', () => {
    expect(buildSummaryLine('Internal', ['', ' Kitchen '])).toBe('Internal \u00b7 Kitchen');
    expect(buildSummaryLine('Internal', ['', '  '])).toBe('Internal');
  });

  it('renders items only when the type label is blank', () => {
    expect(buildSummaryLine('', ['Kitchen'])).toBe('Kitchen');
    expect(buildSummaryLine('   ', [])).toBe('');
  });
});
