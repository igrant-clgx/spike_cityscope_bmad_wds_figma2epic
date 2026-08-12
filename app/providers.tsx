'use client';

import type * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@/theme';
import { getQueryClient } from '@/lib/query-client';
import { ToastProvider } from '@/components/feedback';
import { AnalyticsProvider } from '@/components/analytics';

/**
 * Client-side brand shell: mounts the Emotion App Router cache (flicker-free
 * SSR), the MUI ThemeProvider, CssBaseline, and the TanStack QueryClient (AD-5)
 * once at the app root. The QueryClient wraps the inner tree so the Toast /
 * Analytics providers and all children can own server-derived async state.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AnalyticsProvider>{children}</AnalyticsProvider>
          </ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
