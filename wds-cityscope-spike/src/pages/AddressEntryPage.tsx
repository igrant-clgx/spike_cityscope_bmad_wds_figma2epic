import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useEstimateFlow } from '../context/EstimateFlowContext';
import AddressAutocomplete from '../components/AddressAutocomplete';
import { colors } from '../theme';

// Address Entry page (AD-1: address lives in EstimateFlowContext, not local
// state). Header/Footer are already mounted globally in App.tsx.
export default function AddressEntryPage() {
  const navigate = useNavigate();
  const { setAddress } = useEstimateFlow();

  // Ephemeral UI state only (AD-1 permits local state for non-flow data).
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [manualAddress, setManualAddress] = useState('');

  const handleAddressSelected = (address: string) => {
    setAddress(address);
    navigate('/questionnaire');
  };

  const handleManualSubmit = () => {
    if (manualAddress.trim()) {
      handleAddressSelected(manualAddress.trim());
    }
  };

  return (
    <Box
      component="main"
      sx={{
        position: 'relative',
        backgroundColor: colors.heroOverlay,
        backgroundImage: 'url(/hero-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: 'calc(100vh - 68.98px - 81.45px)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          maxWidth: '1128px',
          margin: '0 auto',
          padding: { xs: '24px', md: '24px 192px' },
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{ marginTop: '60.88px', color: '#ffffff', textAlign: 'center' }}
        >
          Renovation Calculator Report
        </Typography>

        <Typography
          variant="body1"
          component="p"
          sx={{ marginTop: '24px', color: '#ffffff', textAlign: 'center' }}
        >
          Please type property address below:
        </Typography>

        <Box sx={{ marginTop: '24px' }}>
          <AddressAutocomplete onAddressSelected={handleAddressSelected} />
        </Box>

        <Typography
          variant="body1"
          component="p"
          sx={{ marginTop: '24px', color: '#ffffff', textAlign: 'center' }}
        >
          If you're looking for a new place to call home, we will help you know more about it.
        </Typography>

        <Box
          sx={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Typography
            component="span"
            sx={{
              fontFamily: '"Source Sans Pro", sans-serif',
              fontSize: '12.4px',
              lineHeight: '18.67px',
              color: '#ffffff',
            }}
          >
            Address not showing?
          </Typography>
          <Button
            variant="text"
            onClick={() => setShowAdvancedSearch((prev) => !prev)}
            sx={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: '12.3px',
              lineHeight: '21.44px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: colors.jacarta,
            }}
          >
            Use Advanced Search
          </Button>
        </Box>

        {showAdvancedSearch && (
          <Box sx={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <TextField
              placeholder="Enter address manually"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              size="small"
              fullWidth
            />
            <Button variant="contained" onClick={handleManualSubmit}>
              Continue
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
