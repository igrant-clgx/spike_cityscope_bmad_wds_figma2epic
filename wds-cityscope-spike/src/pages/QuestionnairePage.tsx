import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import TextField from '@mui/material/TextField';
import AddressBar from '../components/AddressBar';
import AccordionStep from '../components/AccordionStep';
import { useEstimateFlow } from '../context/EstimateFlowContext';
import { whatToRenovateOptions, qualityTierOptions } from '../data/mockRenovationOptions';
import { colors } from '../theme';

type StepKey = 1 | 2 | 3;

// Shared single-select toggle button, matching Figma node 9:27 exactly:
// 1px solid Jacarta border, 4px radius, 64px min-width. Selected state fills
// the background with Jacarta and flips the label to white (UX-DR14).
function ToggleButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        minWidth: '64px',
        padding: '7.994px 16.002px',
        border: `1px solid ${colors.jacarta}`,
        borderRadius: '4px',
        backgroundColor: selected ? colors.jacarta : 'transparent',
        transition: 'background-color 0.15s ease',
        '&:hover': {
          backgroundColor: selected ? colors.jacarta : 'rgba(67, 42, 110, 0.08)',
        },
      }}
    >
      <Typography
        component="span"
        sx={{
          fontFamily: '"Source Sans Pro", sans-serif',
          fontSize: '15.8px',
          lineHeight: '23.63px',
          color: selected ? '#ffffff' : colors.jacarta,
        }}
      >
        {label}
      </Typography>
    </ButtonBase>
  );
}

// Questionnaire page (AD-1: all answers live in EstimateFlowContext; AD-4:
// single-open-accordion, single-select Step 2). Header/Footer are already
// mounted globally in App.tsx.
export default function QuestionnairePage() {
  const navigate = useNavigate();
  const {
    renovationType,
    setRenovationType,
    whatToRenovate,
    setWhatToRenovate,
    sizeSqm,
    setSizeSqm,
    qualityTier,
    setQualityTier,
  } = useEstimateFlow();

  // Ephemeral UI state only (AD-1 permits local state for non-flow data):
  // which accordion step is currently expanded.
  const [expandedStep, setExpandedStep] = useState<StepKey>(1);

  const step1Answered = renovationType !== '';
  const step2Answered = whatToRenovate.length > 0;

  const handleSelectRenovationType = (value: string) => {
    setRenovationType(value);
    setExpandedStep(2);
  };

  const handleSelectWhatToRenovate = (value: string) => {
    setWhatToRenovate([value]);
    setExpandedStep(3);
  };

  const handleSelectQualityTier = (value: string) => {
    setQualityTier(value);
    if (sizeSqm !== null) {
      navigate('/estimate');
    }
  };

  const handleSizeChange = (value: string) => {
    const parsed = value === '' ? null : Number(value);
    setSizeSqm(Number.isNaN(parsed) ? null : parsed);
  };

  const handleSizeBlurOrEnter = () => {
    if (sizeSqm !== null && qualityTier !== '') {
      navigate('/estimate');
    }
  };

  return (
    <Box
      component="main"
      sx={{
        backgroundColor: colors.questionnaireBackground,
        minHeight: 'calc(100vh - 68.98px - 81.45px)',
      }}
    >
      <Box
        sx={{
          maxWidth: '1128px',
          margin: '0 auto',
          padding: { xs: '24px', md: '32px 144px' },
        }}
      >
        <Box sx={{ maxWidth: '840px', margin: '0 auto' }}>
          <AddressBar />

          <Box sx={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AccordionStep
            stepLabel="Step 1: Renovation type"
            expanded={expandedStep === 1}
            locked={false}
            summary={step1Answered && expandedStep !== 1 ? renovationType : undefined}
            onExpand={() => setExpandedStep(1)}
          >
            <Typography
              component="h3"
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: '17.7px',
                lineHeight: '23px',
                color: colors.textSecondary,
                marginBottom: '16px',
              }}
            >
              Is an Internal or External renovation?
            </Typography>
            <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <ToggleButton
                label="Internal"
                selected={renovationType === 'Internal'}
                onClick={() => handleSelectRenovationType('Internal')}
              />
              <ToggleButton
                label="External"
                selected={renovationType === 'External'}
                onClick={() => handleSelectRenovationType('External')}
              />
            </Box>
          </AccordionStep>

          <AccordionStep
            stepLabel="Step 2: What to renovate"
            expanded={expandedStep === 2}
            locked={!step1Answered}
            summary={step2Answered && expandedStep !== 2 ? whatToRenovate[0] : undefined}
            onExpand={() => setExpandedStep(2)}
          >
            <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {whatToRenovateOptions.map((option) => (
                <ToggleButton
                  key={option}
                  label={option}
                  selected={whatToRenovate[0] === option}
                  onClick={() => handleSelectWhatToRenovate(option)}
                />
              ))}
            </Box>
          </AccordionStep>

          <AccordionStep
            stepLabel="Step 3: More questions"
            expanded={expandedStep === 3}
            locked={!step2Answered}
            onExpand={() => setExpandedStep(3)}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <TextField
                label="Size (square meters)"
                type="number"
                value={sizeSqm ?? ''}
                onChange={(e) => handleSizeChange(e.target.value)}
                onBlur={handleSizeBlurOrEnter}
                size="small"
              />
              <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {qualityTierOptions.map((option) => (
                  <ToggleButton
                    key={option}
                    label={option}
                    selected={qualityTier === option}
                    onClick={() => handleSelectQualityTier(option)}
                  />
                ))}
              </Box>
            </Box>
          </AccordionStep>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
