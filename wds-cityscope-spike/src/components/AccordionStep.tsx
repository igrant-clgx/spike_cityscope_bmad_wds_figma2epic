import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { ReactNode } from 'react';
import { colors } from '../theme';

export interface AccordionStepProps {
  stepLabel: string;
  expanded: boolean;
  locked: boolean;
  summary?: string;
  onExpand: () => void;
  children: ReactNode;
}

// Shared Questionnaire accordion step (AD-2: built on MUI Accordion, not a
// hand-rolled Collapse). Card style, locked-state compounding opacity, and
// summary rendering match the live Figma export (nodes 9:27, 9:60, 9:72) —
// verified during story creation, not just the WDS text spec.
export default function AccordionStep({
  stepLabel,
  expanded,
  locked,
  summary,
  onExpand,
  children,
}: AccordionStepProps) {
  return (
    <Accordion
      expanded={expanded}
      disabled={locked}
      onChange={(_event, isExpanded) => {
        if (isExpanded && !locked) {
          onExpand();
        }
      }}
      disableGutters
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0px 2px 2px rgba(17, 11, 28, 0.08)',
        opacity: locked ? 0.46 : 1,
        '&.Mui-disabled': {
          backgroundColor: '#ffffff',
        },
        '&:before': {
          display: 'none',
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />}
        sx={{
          opacity: locked ? 0.38 : 1,
          minHeight: '48px',
        }}
      >
        <Typography
          component="h6"
          sx={{
            fontFamily: '"Source Sans Pro", sans-serif',
            fontSize: '14px',
            lineHeight: '18.2px',
            letterSpacing: '0.5px',
            color: colors.textSecondary,
          }}
        >
          {stepLabel}
          {summary ? `: ${summary}` : ''}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
