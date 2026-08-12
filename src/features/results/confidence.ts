import type { EstimateConfidence } from '@server/domain/ports/estimate-engine';
import { CONFIDENCE_COPY } from './copy';

/**
 * Pure confidence → display metadata mapper. Exhaustive over the three levels
 * with a `never` default so a new confidence level fails to compile until it is
 * handled here. Decouples the confidence presentation from the card component.
 *
 * The default also returns a safe runtime fallback (low) in case an untyped
 * value slips through a JSON boundary, so callers always get `{label, help}`.
 */
export function resolveConfidence(
  level: EstimateConfidence,
): { label: string; help: string } {
  switch (level) {
    case 'low':
    case 'medium':
    case 'high':
      return CONFIDENCE_COPY[level];
    default: {
      const _exhaustive: never = level;
      void _exhaustive;
      return CONFIDENCE_COPY.low;
    }
  }
}
