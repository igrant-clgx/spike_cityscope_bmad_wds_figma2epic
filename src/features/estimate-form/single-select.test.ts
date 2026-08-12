import { describe, it, expect } from 'vitest';
import { nextSelection } from './single-select';

describe('nextSelection (single-select transition, FR-10)', () => {
  it('stores the chosen id when nothing was selected', () => {
    expect(nextSelection(null, 'internal')).toBe('internal');
  });

  it('replaces the selection when a different id is toggled', () => {
    expect(nextSelection('internal', 'external')).toBe('external');
  });

  it('keeps the current selection when it is re-activated (null toggle, no deselect)', () => {
    // ToggleButtonGroup emits null on re-activating the active button.
    expect(nextSelection('internal', null)).toBe('internal');
  });
});
