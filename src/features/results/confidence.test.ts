import { describe, it, expect } from 'vitest';
import { resolveConfidence } from './confidence';
import { CONFIDENCE_COPY } from './copy';

describe('resolveConfidence (pure)', () => {
  it('maps every confidence level to its display copy', () => {
    expect(resolveConfidence('low')).toEqual(CONFIDENCE_COPY.low);
    expect(resolveConfidence('medium')).toEqual(CONFIDENCE_COPY.medium);
    expect(resolveConfidence('high')).toEqual(CONFIDENCE_COPY.high);
  });

  it('returns a non-empty label and help for each level', () => {
    for (const level of ['low', 'medium', 'high'] as const) {
      const { label, help } = resolveConfidence(level);
      expect(label.length).toBeGreaterThan(0);
      expect(help.length).toBeGreaterThan(0);
    }
  });
});
