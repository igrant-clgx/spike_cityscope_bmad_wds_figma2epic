'use client';

import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import { useReducedMotion } from '@/components/feedback';
import { Step1RenovationType } from './Step1RenovationType';
import { Step2Items } from './Step2Items';
import { Step3Details } from './Step3Details';
import type { StepFormValues } from './flow-form-values';
import {
  STEP_ORDER,
  STEP_META,
  isStepComplete,
  nextExpanded,
  type StepId,
} from './step-state';

/**
 * A completed-step indicator. OI-9 `[ASSUMPTION]`: the design calls for a check
 * icon; `@mui/icons-material` is not a project dependency (adding it would be a
 * second new dep, disallowed by the spec), so this is a themed inline check
 * glyph drawn with `currentColor` in the success palette — no ad-hoc hex.
 */
function CompletionIndicator() {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{ display: 'inline-flex', alignItems: 'center', color: 'success.main', mr: 1 }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" role="presentation" focusable="false">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 14.2-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z"
        />
      </svg>
    </Box>
  );
}

/**
 * The accordion stepper shell (UX-DR7/UX-DR18/UX-DR20). Renders one MUI
 * `Accordion` per step, driven by the single react-hook-form flow aggregate
 * (`useFormContext`/`useWatch`) for completion state plus a local one-expanded
 * state managed through the pure `nextExpanded` transition. Exactly one step is
 * expanded at a time; each header is a real `<button>` exposing `aria-expanded`
 * (MUI `AccordionSummary` is a `ButtonBase`). A completed, collapsed step shows
 * a summary line + completion indicator. A visually-hidden `aria-live` region
 * announces the active step for screen readers.
 *
 * Motion: the accordion collapse uses MUI's transition; the global
 * `MuiCssBaseline` rule collapses it under `prefers-reduced-motion`.
 * `useReducedMotion` is read so JS-driven timing (future step animations) can
 * honour the same preference.
 */
export function EstimateStepper() {
  const { control } = useFormContext<StepFormValues>();
  const values = (useWatch({ control }) ?? {}) as Partial<StepFormValues>;
  const [expanded, setExpanded] = useState<StepId>('type');
  // Read the OS reduced-motion preference (belt-and-braces with the global
  // MuiCssBaseline collapse) so future JS-driven step motion can honour it.
  useReducedMotion();

  const handleToggle = (target: StepId) => {
    setExpanded((current) => nextExpanded(current, target));
  };

  const activeAnnouncement = `Step ${STEP_META[expanded].index + 1} of ${STEP_ORDER.length}: ${STEP_META[expanded].title}`;

  return (
    <Box>
      <Box aria-live="polite" sx={visuallyHidden}>
        {activeAnnouncement}
      </Box>

      {STEP_ORDER.map((stepId) => {
        const meta = STEP_META[stepId];
        const isExpanded = expanded === stepId;
        const complete = isStepComplete(stepId, values);
        const showSummary = complete && !isExpanded;
        const contentId = `estimate-step-${stepId}-content`;
        const headerId = `estimate-step-${stepId}-header`;

        return (
          <Accordion
            key={stepId}
            expanded={isExpanded}
            onChange={() => handleToggle(stepId)}
            disableGutters
          >
            <AccordionSummary
              id={headerId}
              aria-controls={contentId}
              sx={{ gap: 1 }}
            >
              {showSummary ? <CompletionIndicator /> : null}
              <Box component="span" sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography component="span" variant="body1" sx={{ display: 'block', fontWeight: 500 }}>
                  {`Step ${meta.index + 1}: ${meta.title}`}
                </Typography>
                {showSummary ? (
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                    Completed
                  </Typography>
                ) : null}
              </Box>
            </AccordionSummary>
            <AccordionDetails id={contentId} aria-labelledby={headerId}>
              {stepId === 'type' ? (
                <Step1RenovationType />
              ) : stepId === 'items' ? (
                <Step2Items />
              ) : (
                <Step3Details />
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}
