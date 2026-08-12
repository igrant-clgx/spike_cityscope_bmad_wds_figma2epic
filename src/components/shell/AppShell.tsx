import type * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { theme } from '@/theme';
import { Header } from './Header';
import { Footer } from './Footer';

/**
 * Presentational sticky-footer shell mounted once so every route inherits the
 * charcoal header, a centred `contentMax` (840px) main column, and the constant
 * disclaimer footer. Epics 2–5 render their flow into the `main` slot.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Header />
      <Container
        component="main"
        maxWidth={false}
        sx={{
          maxWidth: theme.layout.contentMax,
          mx: 'auto',
          width: '100%',
          flexGrow: 1,
          py: 4,
          px: { xs: 2, sm: 3 },
        }}
      >
        {children}
      </Container>
      <Footer />
    </Box>
  );
}
