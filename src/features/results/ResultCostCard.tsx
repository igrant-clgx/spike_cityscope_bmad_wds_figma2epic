'use client';

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { tokens } from '@/theme';
import { formatAud, formatAudRange } from '@/lib/money-format';
import type { EstimateResult } from '@shared/schemas';
import type { EstimateConfidence } from '@server/domain/ports/estimate-engine';
import { resolveConfidence } from './confidence';
import { buildSummaryLine } from './result-summary';
import {
  DISCLAIMER,
  HOW_CALCULATED_EXPLAINER,
  MORE_INFO_LABEL,
  RANGE_FRAMING_LEAD,
  RESULT_CARD_TITLE,
} from './copy';

export interface ResultCostCardProps {
  result: EstimateResult;
  typeLabel: string;
  itemLabels: string[];
}

/** Map confidence level → MUI palette colour prop (no ad-hoc hex). */
const CONFIDENCE_COLOR: Record<
  EstimateConfidence,
  'default' | 'info' | 'success'
> = {
  low: 'default',
  medium: 'info',
  high: 'success',
};

/**
 * The value-moment surface (FR-20/FR-21/FR-22, UX-DR10/UX-DR17). Presentational
 * only: it takes a ready `EstimateResult` plus the scope labels and renders the
 * honest cost range. The parent (Story 4.3) owns the async/error state and
 * derives `typeLabel`/`itemLabels`; the actions below it are Story 4.4.
 *
 * The `cost-display` variant is the emotional peak and is used nowhere else.
 *
 * NOTE (Story 4.3 contract): the arrival announcement is owned SOLELY by the
 * PERSISTENT results parent, which keeps an always-present `role="status"`
 * region in the tree (never unmounted between calculating and result states)
 * and speaks the dollar range there. This card carries NO live region of its
 * own, so the figure is announced exactly once by the single reliable region.
 */
export function ResultCostCard({ result, typeLabel, itemLabels }: ResultCostCardProps) {
  const confidence = resolveConfidence(result.confidence);
  const summary = buildSummaryLine(typeLabel, itemLabels);
  const range = formatAudRange(result.costMin, result.costMax);

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 600,
        mx: 'auto',
        p: 4,
        boxShadow: tokens.shadows.result,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Box sx={{ width: '100%' }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {RESULT_CARD_TITLE}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {summary}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {RANGE_FRAMING_LEAD}
          </Typography>
          <Typography
            variant="cost-display"
            component="p"
            align="center"
            aria-label={`${formatAud(Math.min(result.costMin, result.costMax))} to ${formatAud(Math.max(result.costMin, result.costMax))}`}
            sx={{ mt: 1 }}
          >
            {range}
          </Typography>
        </Box>

        <Chip
          label={confidence.label}
          color={CONFIDENCE_COLOR[result.confidence]}
          variant="outlined"
          size="small"
        />
        <Typography variant="caption" color="text.secondary">
          {confidence.help}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {DISCLAIMER}
        </Typography>

        <Accordion elevation={0} disableGutters sx={{ width: '100%', boxShadow: 'none' }}>
          <AccordionSummary
            expandIcon={
              <svg width="18" height="18" viewBox="0 0 24 24" role="presentation" focusable="false">
                <path d="M7 10l5 5 5-5z" fill="currentColor" />
              </svg>
            }
            aria-controls="how-calculated-content"
            id="how-calculated-header"
            sx={{ color: 'primary.main', fontWeight: 500, px: 0 }}
          >
            {MORE_INFO_LABEL}
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
              {HOW_CALCULATED_EXPLAINER}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </Paper>
  );
}
