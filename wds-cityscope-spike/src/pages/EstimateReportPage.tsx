import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhoneIcon from '@mui/icons-material/Phone';
import AddressBar from '../components/AddressBar';
import { useEstimateFlow } from '../context/EstimateFlowContext';
import { getEstimateForRenovation } from '../data/mockEstimates';
import { colors } from '../theme';

// Estimate Report page (Story 3.1). Header/Footer are already mounted
// globally in App.tsx. Page background is plain white (no override) —
// confirmed via live Figma cross-check of the page-wrapper node (9:101),
// unlike the Questionnaire page's #edf2f4 background.
export default function EstimateReportPage() {
  const navigate = useNavigate();
  const { renovationType, whatToRenovate } = useEstimateFlow();

  const { low, high } = getEstimateForRenovation(whatToRenovate);
  const whatItem = whatToRenovate?.[0];
  const subtypeLine =
    renovationType && whatItem ? `${renovationType} Renovation: ${whatItem}` : '';
  const costRangeLine = `$${low.toLocaleString()} - $${high.toLocaleString()}`;

  return (
    <Box component="main">
      <Box
        sx={{
          maxWidth: '1128px',
          margin: '0 auto',
          padding: { xs: '24px', md: '32px 144px' },
        }}
      >
        <Box sx={{ maxWidth: '840px', margin: '0 auto' }}>
          <AddressBar />

          {/* Estimate Summary (AC2) */}
          <Box
            sx={{
              marginTop: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '7.3px',
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '22.4px',
                lineHeight: '29.16px',
                textTransform: 'uppercase',
                color: colors.jacarta,
              }}
            >
              Estimated Renovation Cost
            </Typography>
            <Typography
              component="p"
              sx={{
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '15.8px',
                lineHeight: '23.63px',
                color: colors.textSecondary,
              }}
            >
              {subtypeLine}
            </Typography>
            <Typography
              component="p"
              sx={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: '52px',
                lineHeight: '57.2px',
                color: colors.jacarta,
              }}
            >
              {costRangeLine}
            </Typography>
          </Box>

          <Typography
            component="p"
            sx={{
              marginTop: '18.4px',
              textAlign: 'center',
              fontFamily: '"Source Sans Pro", sans-serif',
              fontSize: '14px',
              lineHeight: '18.2px',
              letterSpacing: '0.5px',
              color: 'rgba(17, 11, 28, 0.68)',
            }}
          >
            These are estimates to help you plan.
          </Typography>

          {/* Additional Information accordion (AC3) */}
          <Accordion
            disableGutters
            sx={{
              marginTop: '58.2px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0px 2px 2px rgba(17, 11, 28, 0.08)',
              '&:before': {
                display: 'none',
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />}
            >
              <Typography
                component="span"
                sx={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontSize: '14px',
                  lineHeight: '18.2px',
                  letterSpacing: '0.5px',
                  color: colors.jacarta,
                }}
              >
                Additional Information - How this was calculated
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                component="p"
                sx={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontSize: '14px',
                  lineHeight: '18.2px',
                  color: colors.textSecondary,
                }}
              >
                This estimate is a general guide only, based on typical renovation costs for
                similar properties in your area. Actual costs may vary depending on materials,
                labor, site conditions, and current market rates. Please consult a licensed
                contractor for an accurate quote.
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Action Buttons (AC1, Task 4) */}
          <Box
            sx={{
              marginTop: '35px',
              display: 'flex',
              justifyContent: 'center',
              gap: '7.99px',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate('/questionnaire')}
              sx={{
                minWidth: '64px',
                borderRadius: '4px',
                borderColor: 'rgba(67, 42, 110, 0.5)',
                color: colors.jacarta,
                textTransform: 'none',
                fontFamily: '"Poppins", sans-serif',
                fontSize: '12.3px',
                lineHeight: '21.44px',
                '&:hover': {
                  borderColor: colors.jacarta,
                  backgroundColor: 'rgba(67, 42, 110, 0.08)',
                },
              }}
            >
              Edit Estimate
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              sx={{
                minWidth: '64px',
                borderRadius: '4px',
                backgroundColor: colors.jacarta,
                textTransform: 'none',
                fontFamily: '"Poppins", sans-serif',
                fontSize: '12.3px',
                lineHeight: '21.44px',
                '&:hover': {
                  backgroundColor: colors.jacarta,
                  opacity: 0.9,
                },
              }}
            >
              New Estimate
            </Button>
          </Box>

          {/* Home Loan Coach CTA (AC4) */}
          <Box
            sx={{
              marginTop: '41.4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '7.5px',
            }}
          >
            <Typography
              component="p"
              sx={{
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '25.2px',
                lineHeight: '32.8px',
                letterSpacing: '0.5px',
                color: colors.jacarta,
              }}
            >
              Talk to a Home Loan Coach to learn about funding options
            </Typography>
            <PhoneIcon sx={{ fontSize: '21px', color: colors.jacarta }} />
            <Typography
              component="p"
              sx={{
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '14px',
                lineHeight: '18.2px',
                color: colors.textSecondary,
              }}
            >
              Call us
            </Typography>
            <Typography
              component="a"
              href="tel:08002694663"
              sx={{
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '25.2px',
                lineHeight: '32.8px',
                letterSpacing: '0.5px',
                color: colors.jacarta,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              0800 269 4663
            </Typography>
            <Box>
              <Typography
                component="p"
                sx={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontSize: '14px',
                  lineHeight: '18.2px',
                  color: 'rgba(17, 11, 28, 0.68)',
                }}
              >
                Weekdays, 8am - 8.30pm
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontSize: '14px',
                  lineHeight: '18.2px',
                  color: 'rgba(17, 11, 28, 0.68)',
                }}
              >
                Weekends, 9am - 5pm
              </Typography>
              <Typography
                component="p"
                sx={{
                  fontFamily: '"Source Sans Pro", sans-serif',
                  fontSize: '14px',
                  lineHeight: '18.2px',
                  color: 'rgba(17, 11, 28, 0.68)',
                }}
              >
                International: +64 4 470 3165
              </Typography>
            </Box>
          </Box>

          {/* Tips (AC5) */}
          <Box sx={{ marginTop: '54.5px', display: 'flex', flexDirection: 'column', gap: '7.98px' }}>
            <Typography
              component="p"
              sx={{
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '15.8px',
                lineHeight: '23.63px',
                letterSpacing: '0.5px',
                color: colors.textSecondary,
              }}
            >
              TIP: Before starting your renovation, you should talk to your insurance provider to
              understand whether your house insurance will be affected. Also, once the job&apos;s
              done, remember to update your sum insured amount to reflect the renovations.
            </Typography>
            <Typography
              component="p"
              sx={{
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '15.8px',
                lineHeight: '23.63px',
                letterSpacing: '0.5px',
                color: colors.textSecondary,
              }}
            >
              TIP: Consult your local council before starting any renovations.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
