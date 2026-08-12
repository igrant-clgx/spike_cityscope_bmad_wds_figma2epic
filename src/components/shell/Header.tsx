import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { theme, tokens } from '@/theme';
import { PRODUCT_NAME, PARTNER_NAME } from './copy';

/**
 * Charcoal brand bar mounted at the top of every route.
 *
 * No logo image assets exist yet — accessible TEXT brand-marks are rendered,
 * each boxed to the target logo width with an accessible name. When real
 * artwork lands it drops into these seams without touching the layout.
 */
export function Header() {
  return (
    <AppBar
      component="header"
      position="static"
      elevation={0}
      sx={{ bgcolor: tokens.colors.headerBg }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: theme.layout.headerH,
        }}
      >
        {/* TODO: swap for the real product logo (SVG/PNG) — keep ~125px box. */}
        <Box
          role="img"
          aria-label={PRODUCT_NAME}
          sx={{ width: 125, minWidth: 0, flexShrink: 1, display: 'flex', alignItems: 'center' }}
        >
          <Typography variant="h6" component="span" noWrap sx={{ color: 'common.white' }}>
            {PRODUCT_NAME}
          </Typography>
        </Box>

        {/* TODO: swap for the real Demo Channel partner logo — keep ~128px box. */}
        <Box
          role="img"
          aria-label={PARTNER_NAME}
          sx={{
            width: 128,
            minWidth: 0,
            flexShrink: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Typography variant="h6" component="span" noWrap sx={{ color: 'common.white' }}>
            {PARTNER_NAME}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
