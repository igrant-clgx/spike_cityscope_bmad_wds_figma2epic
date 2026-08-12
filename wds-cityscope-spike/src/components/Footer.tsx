import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { colors } from '../theme';

// Shared site footer with the exact 3-line legal disclaimer text taken
// verbatim from 1.1-address-entry.md#Section: Footer (addr-footer-disclaimer).
export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: colors.cannonBlack,
        minHeight: '81.45px',
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        boxSizing: 'border-box',
      }}
    >
      <Typography
        component="p"
        sx={{
          fontFamily: '"Source Sans Pro", sans-serif',
          fontSize: '12px',
          lineHeight: '18px',
          color: '#ffffff',
          margin: 0,
        }}
      >
        Disclaimer: The Renovation Calculator Report is available to customers who provide their
        contact details for Demo Channel to contact them about products and services. Renovation
        Calculator Report are prepared by Cotality. The statements, information and opinions
        contained in those reports are those of Cotality only, and Demo Channel AU does not
        endorse or accept any liability for them.
      </Typography>
    </Box>
  );
}
