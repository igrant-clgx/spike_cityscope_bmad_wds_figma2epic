import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  CALL_CTA_LABEL,
  CONTACT_DESCRIPTION,
  CONTACT_HEADING,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from './contact-copy';

/** Decorative inline phone glyph (no `@mui/icons-material` — not installed). */
function PhoneIcon() {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" role="presentation" focusable="false">
        <path
          fill="currentColor"
          d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"
        />
      </svg>
    </Box>
  );
}

/**
 * Contact Section (FR-26, UX-DR11) — the design-visible primary conversion path.
 * A canvas-fill card (deliberately `background.default`, distinct from the white
 * result card) offering a low-pressure, honest chat with a Home Loan Coach and a
 * full-width `tel:` phone CTA. Pure and static: no PII, no data flow, no form
 * (the inline lead form is OI-10-gated to Story 5.3). Node-testable via
 * `renderToStaticMarkup`.
 */
export function ContactSection() {
  return (
    <Box
      sx={{
        mt: 3,
        p: 3,
        borderRadius: 2,
        bgcolor: 'background.default',
      }}
    >
      <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h6" component="h3">
          {CONTACT_HEADING}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {CONTACT_DESCRIPTION}
        </Typography>
        <Button
          component="a"
          href={`tel:${CONTACT_PHONE_TEL}`}
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<PhoneIcon />}
          sx={{ minHeight: 48 }}
        >
          {`${CALL_CTA_LABEL}: ${CONTACT_PHONE_DISPLAY}`}
        </Button>
      </Stack>
    </Box>
  );
}
