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

/**
 * Idle (not yet requested) copy: a low-pressure prompt plus the explicit
 * "calculate" CTA. The estimate fires only on this deliberate action, never on
 * a keystroke (UX-DR16 results).
 */
export const IDLE_PROMPT =
  'When you\u2019re ready, we\u2019ll turn your answers into an indicative cost range.';
export const CALCULATE_CTA_LABEL = 'See my estimate';

/** Loading copy — calm, honest about the wait (UX-DR16 loading). */
export const LOADING_MESSAGE = 'Working out your estimate\u2026';
export const LOADING_ANNOUNCEMENT = 'Calculating your estimate\u2026';

/** Success arrival announcement, spoken via the persistent live region. */
export const SUCCESS_ANNOUNCEMENT = 'Your estimate is ready.';

/**
 * Empty/low-confidence copy (UX-DR16). Honest that the range is rough and offers
 * a forward path — the range is still shown, framed humbly, never a single
 * false-precise number.
 */
export const LOW_CONFIDENCE_MESSAGE =
  'We can only give a rough range from what you\u2019ve told us so far. ' +
  'Add a little more detail to your answers and we\u2019ll sharpen it.';
export const LOW_CONFIDENCE_ANNOUNCEMENT =
  'An early, rough estimate is ready.';

/**
 * Non-destructive error copy (UX-DR16 error). Reassures the homeowner their
 * answers are safe and offers a plain retry; the request re-fires unchanged.
 */
export const ERROR_TITLE = 'We couldn\u2019t work out your estimate';
export const ERROR_MESSAGE =
  'Something went wrong on our side. Your answers are safe \u2014 you can try again.';
export const ERROR_ANNOUNCEMENT =
  'We couldn\u2019t work out your estimate. Please try again.';
export const RETRY_LABEL = 'Try again';

/** Post-result actions (UX-DR13): Edit preserves answers, New clears the flow. */
export const EDIT_ESTIMATE_LABEL = 'Edit Estimate';
export const NEW_ESTIMATE_LABEL = 'New Estimate';

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
