import Box from '@mui/material/Box';
import { colors } from '../theme';

// Shared site header (AD-2: built on MUI primitives). Pixel values sourced
// verbatim from 1.1-address-entry.md#Section: Header — do not approximate.
export default function Header() {
  return (
    <Box
      component="header"
      sx={{
        backgroundColor: colors.cannonBlack,
        height: '68.98px',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
      }}
    >
      <a href="https://www.cotality.com/" target="_blank" rel="noopener noreferrer">
        <Box
          component="img"
          src="/logo-cotality.svg"
          alt="Cotality"
          sx={{ width: '125.39px', height: '32.98px', display: 'block' }}
        />
      </a>
      <Box
        component="img"
        src="/logo-partner.svg"
        alt="Partner"
        sx={{ width: '128.56px', height: '44.98px', display: 'block' }}
      />
    </Box>
  );
}
