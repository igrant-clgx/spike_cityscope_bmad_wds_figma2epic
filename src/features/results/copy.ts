import { DISCLAIMER } from '@/components/shell/copy';
import type { EstimateConfidence } from '@server/domain/ports/estimate-engine';

/**
 * Results feature microcopy — plain, honest, low-pressure voice per
 * EXPERIENCE.md § Voice and Tone. The estimate is framed as a range with
 * humility ("could cost roughly…"), never "your quote". The indicative
 * `DISCLAIMER` is reused verbatim from the shell copy so the product speaks
 * with one voice about the estimate being a guide, not a quote.
 */

export const RESULT_CARD_TITLE = 'Estimated Renovation Cost';

/** Humble range framing lead-in (UX-DR10/UX-DR17). Never "Your quote". */
export const RANGE_FRAMING_LEAD =
  'Based on your answers, a renovation like this could cost roughly';

export const MORE_INFO_LABEL = '+ More Information';

/**
 * `[ASSUMPTION]` indicative "how this was calculated" explainer (OI-3 [OPEN] —
 * the real cost model is deferred). Honest about being a guide.
 */
export const HOW_CALCULATED_EXPLAINER =
  'This range is a guide built from the renovation type and items you selected, ' +
  'using indicative average costs for a project of this shape. It is not a quote ' +
  'and does not account for your property\u2019s specific condition, finishes, or ' +
  'local labour rates. For a precise figure, talk to a professional.';

/** Confidence display copy keyed by level (humble, non-alarming). */
export const CONFIDENCE_COPY: Record<
  EstimateConfidence,
  { label: string; help: string }
> = {
  low: {
    label: 'Low confidence',
    help: 'Add more detail to your answers for a tighter range.',
  },
  medium: {
    label: 'Medium confidence',
    help: 'A little more detail could sharpen this range.',
  },
  high: {
    label: 'High confidence',
    help: 'Based on a well-described project.',
  },
};

export { DISCLAIMER };
