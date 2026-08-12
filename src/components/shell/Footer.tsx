import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DISCLAIMER } from './copy';

/**
 * Constant legal footer rendered on every view. Carries the indicative-only
 * disclaimer in the established humble voice.
 */
export function Footer() {
  return (
    <Box component="footer" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
      <Typography variant="caption" component="p" color="text.secondary">
        {DISCLAIMER}
      </Typography>
    </Box>
  );
}
