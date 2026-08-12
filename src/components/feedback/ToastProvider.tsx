'use client';

import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { type AlertColor } from '@mui/material/Alert';
import Slide, { type SlideProps } from '@mui/material/Slide';
import { tokens } from '@/theme';

/**
 * Form-level toast/snackbar system (UX-DR14).
 *
 * A React context holding a single current message; `show(...)` enqueues one.
 * Renders a MUI `Snackbar` (bottom-center, slide-up transition, auto-dismiss
 * from `tokens.motion.snackbarAutoHideMs`) containing a filled, severity-coloured
 * `Alert` with white text.
 *
 * FORM-LEVEL feedback ONLY — never use this for individual field errors (those
 * belong to `FormTextField`'s inline helper text).
 */

/** Options accepted by `useToast().show(...)`. */
export interface ToastOptions {
  severity: AlertColor;
  message: string;
}

interface ToastContextValue {
  show: (opts: ToastOptions) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

function SlideUp(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<ToastOptions | null>(null);
  // Monotonic key: bumping it on each `show` remounts the Snackbar so a new
  // message always gets a FRESH auto-hide timer, even when one is already open.
  const [messageKey, setMessageKey] = React.useState(0);

  const show = React.useCallback((opts: ToastOptions) => {
    setCurrent(opts);
    setMessageKey((k) => k + 1);
    setOpen(true);
  }, []);

  const handleClose = React.useCallback((_event?: unknown, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  }, []);

  const value = React.useMemo<ToastContextValue>(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Snackbar
        key={messageKey}
        open={open}
        onClose={handleClose}
        autoHideDuration={tokens.motion.snackbarAutoHideMs}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slots={{ transition: SlideUp }}
      >
        {current ? (
          <Alert
            onClose={handleClose}
            severity={current.severity}
            variant="filled"
            sx={{ color: 'common.white' }}
          >
            {current.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </ToastContext.Provider>
  );
}

/**
 * Access the toast API. MUST be called inside a `ToastProvider`; throws a clear
 * error otherwise so misuse fails fast in development.
 */
export function useToast(): ToastContextValue {
  const ctx = React.useContext(ToastContext);
  if (ctx === null) {
    throw new Error('useToast must be used within a <ToastProvider>.');
  }
  return ctx;
}
