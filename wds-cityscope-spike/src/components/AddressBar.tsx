import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useEstimateFlow } from '../context/EstimateFlowContext';
import { colors } from '../theme';

// Address Bar (shared, dynamic) — displays the confirmed address from
// EstimateFlowContext with an "Enter new address" link back to Address Entry.
// Per Figma node 9:18: horizontal, space-between, label flex-grow / link shrink-0.
export default function AddressBar() {
  const navigate = useNavigate();
  const { address } = useEstimateFlow();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
      }}
    >
      <Typography
        variant="body1"
        component="h6"
        sx={{
          flexGrow: 1,
          fontSize: '15.8px',
          lineHeight: '20.48px',
          color: colors.textSecondary,
        }}
      >
        {address}
      </Typography>
      <Typography
        component="button"
        onClick={() => navigate('/')}
        sx={{
          flexShrink: 0,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          padding: 0,
          fontFamily: '"Source Sans Pro", sans-serif',
          fontSize: '14px',
          lineHeight: '18.2px',
          letterSpacing: '0.5px',
          color: colors.jacarta,
          textDecoration: 'underline',
          whiteSpace: 'nowrap',
        }}
      >
        Enter new address
      </Typography>
    </Box>
  );
}
