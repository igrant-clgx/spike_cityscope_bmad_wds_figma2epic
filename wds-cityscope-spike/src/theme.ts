import { createTheme } from '@mui/material/styles';

// Centralized color tokens and typography scale, extracted verbatim from the
// WDS Figma specs (see 1.1-address-entry.md). Pages must consume these tokens
// rather than hardcoding hex/rgba values inline (AD-2, UX-DR13).
export const colors = {
  cannonBlack: '#1E1405',
  jacarta: '#432A6E',
  textPrimary: 'rgba(17, 11, 28, 1)',
  textSecondary: 'rgba(17, 11, 28, 0.8)',
  heroOverlay: '#5c1515',
  questionnaireBackground: '#edf2f4',
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.jacarta,
    },
    text: {
      primary: colors.textPrimary,
      secondary: colors.textSecondary,
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Source Sans Pro", "Poppins", sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '28.4px',
      lineHeight: '36.89px',
      letterSpacing: '0.5px',
      fontWeight: 400,
    },
    body1: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '15.8px',
      lineHeight: '20.48px',
      letterSpacing: '0.5px',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Source Sans Pro", sans-serif',
      fontSize: '12.4px',
      lineHeight: '18.67px',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '12.3px',
      lineHeight: '21.44px',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      fontWeight: 400,
    },
  },
});

export default theme;
